"use client";
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'


import { motion } from "framer-motion";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Page() {

  const { getToken, isLoaded, userId } = useAuth();


  useEffect(() => {
    const fetchToken = async () => {
      if (isLoaded && userId) {
        const token = await getToken({ template: "default" }); // "default" is the default JWT template
        console.log("JWT Token:", token);
      }
    };

    fetchToken();
  }, [isLoaded, userId, getToken]);


  return (
    // <main className="ml-16 transition-all duration-300 p-8">
      <HeroSectionOne />
    // {/* </main> */}
  );
}


export function HeroSectionOne() {
  return (
    // <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <>
      <Navbar />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Manage Projects Smarter with AI"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Boss Pro helps your team create, organize, and prioritize projects effortlessly. From task auto-completion to smart recommendations, manage your work faster and focus on what really matters.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <SignedOut>
          <a href="/dashboard">
          <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Get Started
          </button>
          </a>
          </SignedOut>
          <SignedIn  >
          <a href="/dashboard">
          <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Dashboard
          </button>
          </a>
          </SignedIn>
          <a href="mailto:support@aipms.com">
          <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
          </a>
        </motion.div>
        <div className="w-full flex justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-2xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full flex justify-center">
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <img
              src="/image.png"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-5xl object-cover"
              height={800}
              width={800}
            />
          </div>
          </div>
        </motion.div>
        </div>
      </div>
      </>
    // </div> 
  );
}

const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Boss Pro</h1>
      </div>


  <SignedIn>
    <UserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonPopoverActionButton__manageAccount: {
            display: "none"
          }
        }
      }}
    />
  </SignedIn>

    

      
      <SignedOut>
        <a href="/dashboard">
      {/* <SignInButton > */}

      <button className="w-32 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Sign In
      </button>
      
      {/* </SignInButton> */}

      </a>
      </SignedOut>
    </nav>
  );
};
