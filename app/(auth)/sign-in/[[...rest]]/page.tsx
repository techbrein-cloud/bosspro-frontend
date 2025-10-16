import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-6">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
          Sign in to your account
        </h2>
        <p className="text-sm text-gray-600">
          Welcome back to AIPMS - AI-Powered Project Management System
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <SignIn 
            routing="path"
            path="/sign-in"
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case font-medium",
                card: "shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-lg mx-auto",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50 text-sm",
                formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                footerActionLink: "text-blue-600 hover:text-blue-500",
                rootBox: "w-full flex justify-center",
                cardBox: "w-full max-w-sm shadow-xl",
              },
            }}
            afterSignInUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  )
}
