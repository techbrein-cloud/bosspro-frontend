"use client";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, FolderKanban, CheckSquare, ListTodo, CheckCircle } from "lucide-react";
import { useDashboard } from "@/lib/hooks/useDashboard";
// Removed unused LoaderFive import

export default function DashboardKpis() {
  const { dashboardData, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>Error loading dashboard data: {error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const kpis = [
    {
      label: "Total Projects",
      value: dashboardData.total_projects,
      icon: FolderKanban,
      trend: "up" as const,
      change: 12,
      color: "text-blue-600"
    },
    {
      label: "Total Tasks",
      value: dashboardData.total_tasks,
      icon: CheckSquare,
      trend: "up" as const,
      change: 8,
      color: "text-green-600"
    },
    {
      label: "Pending Tasks",
      value: dashboardData.pending_tasks,
      icon: ListTodo,
      trend: "down" as const,
      change: 5,
      color: "text-orange-600"
    },
    {
      label: "Completed Tasks",
      value: dashboardData.completed_tasks,
      icon: CheckCircle,
      trend: "up" as const,
      change: 15,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }} 
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gray-50 ${kpi.color}`}>
                <Icon size={20} />
              </div>
              <div className={`flex items-center ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {kpi.trend === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="text-xs ml-1">{Math.abs(kpi.change)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <h3 className="text-sm font-medium text-gray-600">{kpi.label}</h3>
          </motion.div>
        );
      })}
    </div>
  );
}
