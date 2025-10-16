import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/layout/Sidebar";
import AIChatWindow from "@/components/layout/AIChatWindow";
import ProjectCreationWizard from "@/components/tasks/ProjectCreationWizard";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'


const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
  })
  
  const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
  })
  



export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <AppProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-4">
        <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
        <SignedIn>
              
          {children}
          <UserButton />
            </SignedIn>
        </main>

        {/* Global components inside this layout */}
        <AIChatWindow />
        <ProjectCreationWizard />
      </div>
    </AppProvider>
  );
}
