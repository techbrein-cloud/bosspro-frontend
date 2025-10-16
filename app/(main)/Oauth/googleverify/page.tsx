"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { projectAPI } from '@/lib/api'; // Commented out until Google OAuth integration is implemented

export default function GoogleVerifyPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [exchanging, setExchanging] = useState(true);

  useEffect(() => {
    const code = search.get('code');
    if (!code) {
      setError('Missing authorization code');
      setExchanging(false);
      return;
    }

    const run = async () => {
      try {
        setExchanging(true);
        // TODO: Implement Google OAuth code exchange endpoint
        // const res = await projectAPI.exchangeGoogleCode(code);
        // if (typeof window !== 'undefined') {
        //   localStorage.setItem('google_oauth_token_v1', res.access_token);
        //   if (res.refresh_token) localStorage.setItem('google_oauth_refresh_v1', res.refresh_token);
        //   if (res.expiry) localStorage.setItem('google_oauth_expiry_v1', res.expiry);
        // }
        
        // Temporary placeholder - redirect back to files with error
        setError('Google OAuth integration not yet implemented');
        setTimeout(() => router.replace('/files'), 2000);
      } catch (_e) {
        setError('Failed to exchange code');
      } finally {
        setExchanging(false);
      }
    };
    run();
  }, [router, search]);

  return (
    <main className="ml-16 transition-all duration-300 p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between pr-16 md:pr-20">
          <h1 className="text-2xl font-bold text-gray-900">Connecting Google Drive…</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          {exchanging && (
            <div className="text-gray-600">Exchanging authorization code…</div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
          )}
        </div>
      </div>
    </main>
  );
}


