import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-6">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
          Create your account
        </h2>
        <p className="text-sm text-gray-600">
          Join AIPMS and start managing your projects with AI-powered efficiency
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <SignUp 
            routing="path"
            path="/sign-up"
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
            afterSignUpUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  )
}
