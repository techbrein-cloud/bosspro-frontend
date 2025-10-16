"use client";
import { LayoutDashboard, FolderKanban, CheckSquare, FileText, Settings, Shield, Building2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";

const menu = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/project", icon: CheckSquare, label: "Project" },
  { href: "/my-department", icon: Building2, label: "My Department" },
  { href: "/files", icon: FileText, label: "Files" },
  { href: "/settings", icon: Settings, label: "Settings" }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin, loading } = useAdminCheck();

  return (
    <div className="fixed left-0 top-0 h-full w-17 bg-blue-600 flex flex-col items-center py-4 z-30">
      <Link href="/">
        <div className="w-15 h-8 bg-white rounded text-blue-600 flex items-center justify-center font-bold mb-8 text-sm cursor-pointer">
          BossPRO
        </div>
      </Link>
      {menu.map((item) => {
        const active = item.href === "/" 
          ? pathname === "/" 
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${
              active ? "bg-blue-500 text-white" : "text-blue-200 hover:bg-blue-500 hover:text-white"
            }`}
            title={item.label}
          >
            <Icon size={20} />
          </Link>
        );
      })}
      
      {/* Admin Menu Item - Only show if user is admin */}
      {!loading && isAdmin && (
        <Link
          href="/admin"
          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${
            pathname.startsWith("/admin") 
              ? "bg-blue-500 text-white" 
              : "text-blue-200 hover:bg-blue-500 hover:text-white"
          }`}
          title="Admin Panel"
        >
          <Shield size={20} />
        </Link>
      )}
      
      <div className="mt-auto pt-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500 hover:bg-blue-400 transition-colors">
          <UserButton afterSignOutUrl="/" appearance={{ 
            elements: { userButtonAvatarBox: 'w-6 h-6',
              userButtonPopoverActionButton__manageAccount: {
            display: "none"
          }
            }
            
         }} />
        </div>
      </div>
    </div>
  );
}
