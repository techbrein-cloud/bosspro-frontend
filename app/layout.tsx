import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/layout/Sidebar";
import SecondSidebar from "@/components/layout/SecondSidebar";
import AIChatWindow from "@/components/layout/AIChatWindow";
import ProjectCreationWizard from "@/components/tasks/ProjectCreationWizard";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import AuthTokenBridge from "@/components/AuthTokenBridge";


export const metadata: Metadata = {
  title: "AI PMS",
  description: "AI-powered Project Management System"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50">
        <ClerkProvider
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: "#2563eb",
              colorBackground: "#ffffff",
              colorInputBackground: "#ffffff",
              colorInputText: "#1f2937",
            },
          }}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
        <AppProvider>
          {/* <Sidebar /> */}
          <AuthTokenBridge />
          {children}
          {/* <AIChatWindow /> */}
          {/* <ProjectCreationWizard /> */}
        </AppProvider>
        </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
