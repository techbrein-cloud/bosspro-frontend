"use client";
import { useEffect, useMemo, useState } from "react";
// import { projectAPI } from '@/lib/api'; // Commented out until Google Drive integration is implemented
import { useRouter } from "next/navigation";

type DriveFile = {
  id: string;
  name: string;
  mimeType?: string;
  webViewLink?: string;
};

export default function FilesPage() {
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);
  const [files, setFiles] = useState<DriveFile[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Token storage helpers (kept simple on client; ideally move to secure httpOnly cookies via backend)
  const tokenKey = 'google_oauth_token_v1';
  const refreshKey = 'google_oauth_refresh_v1';
  const expiryKey = 'google_oauth_expiry_v1';

  const accessToken = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null), []);

  const fetchDriveFiles = async () => {
    try {
      setError(null);
      setFiles(null);
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        return;
      }
      // Minimal direct Google API call from client for listing files
      const resp = await fetch(`https://www.googleapis.com/drive/v3/files?pageSize=50&fields=files(id,name,mimeType,webViewLink)`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.status === 401) {
        // try refresh if available
        const refreshed = await tryRefreshToken();
        if (refreshed) return fetchDriveFiles();
      }
      if (!resp.ok) {
        throw new Error(`Failed to list files: ${resp.status}`);
      }
      const data = await resp.json();
      setFiles(data.files || []);
    } catch (_e) {
      setError(_e instanceof Error ? _e.message : 'Failed to load drive files');
    }
  };

  const tryRefreshToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(refreshKey);
    if (!refreshToken) return false;
    try {
      // Your backend should expose a refresh endpoint. If not available, re-run auth.
      // For now, we re-run auth by clearing and prompting connect again.
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(expiryKey);
      return false;
    } catch (_e) {
      return false;
    }
  };

  const startGoogleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);
      // TODO: Implement Google Auth URL endpoint
      // const { auth_url } = await projectAPI.getGoogleAuthUrl();
      // window.location.href = auth_url;
      
      // Temporary placeholder - remove when API is implemented
      setError('Google Drive integration not yet implemented');
      setConnecting(false);
    } catch (_e) {
      setError('Failed to start Google auth');
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchDriveFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isConnected = Boolean(accessToken);

  return (
    <main className="ml-16 transition-all duration-300 p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between pr-16 md:pr-20">
          <h1 className="text-2xl font-bold text-gray-900">Files</h1>
          {!isConnected ? (
            <button onClick={startGoogleConnect} disabled={connecting} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              {connecting ? 'Connecting…' : 'Connect Google Drive'}
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button onClick={fetchDriveFiles} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">Refresh</button>
              <button onClick={() => { localStorage.removeItem(tokenKey); localStorage.removeItem(refreshKey); localStorage.removeItem(expiryKey); setFiles(null); router.refresh(); }} className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100">Disconnect</button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        )}

        {!isConnected && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-12">
              <div className="mx-auto text-gray-400 mb-4 text-5xl">📁</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect your Google Drive</h3>
              <p className="text-gray-500 mb-4">Authorize access to list your Drive files.</p>
              <button onClick={startGoogleConnect} disabled={connecting} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{connecting ? 'Connecting…' : 'Connect Google Drive'}</button>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {!files && !error && (
              <div className="text-center py-12 text-gray-500">Loading files…</div>
            )}
            {files && files.length === 0 && (
              <div className="text-center py-12 text-gray-500">No files found in Drive.</div>
            )}
            {files && files.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((f) => (
                  <a key={f.id} href={f.webViewLink || '#'} target="_blank" rel="noreferrer" className="border rounded p-4 hover:shadow">
                    <div className="font-medium text-gray-900 mb-1 line-clamp-1">{f.name}</div>
                    <div className="text-xs text-gray-500">{f.mimeType}</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
