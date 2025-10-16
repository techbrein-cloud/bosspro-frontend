"use client";
import { SignOutButton, UserProfile } from "@clerk/nextjs";
export default function SettingsPage() {
  return (
    <main className="ml-16 transition-all duration-300 p-8">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your Company" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="admin@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>UTC</option>
                    <option>EST</option>
                    <option>PST</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border">Export Data</button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border">Import Users</button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border">System Backup</button>
                <SignOutButton>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-red-50 border border-red-200 text-red-700">Sign out</button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <UserProfile routing="hash" />
        </div> */}
      </div>
    </main>
  );
}
