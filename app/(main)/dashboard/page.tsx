"use client";
import DashboardKpis from "@/components/dashboard/DashboardKpis";
import TasksLineChart from "@/components/dashboard/TasksLineChart";
import ProjectProgressList from "@/components/dashboard/ProjectProgressList";
import RecentTasks from "@/components/dashboard/RecentTasks";
import TaskProgressPieChart from "@/components/dashboard/TaskProgressPieChart";

export default function Page() {
  return (
    <main className="ml-16 transition-all duration-300 p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between ml-16 pr-16 md:pr-20">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button className="px-4 py-2 bg-white rounded-md shadow-sm text-sm font-medium">This Month</button>
              <button className="px-4 py-2 text-gray-500 text-sm font-medium">This Week</button>
              <button className="px-4 py-2 text-gray-500 text-sm font-medium">This Year</button>
            </div>
            <button className="flex items-center text-gray-500 hover:text-gray-700">
              <span className="mr-2">Filter</span>
            </button>
          </div>
        </div>

        <DashboardKpis />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TasksLineChart />
          <ProjectProgressList />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentTasks />
          <TaskProgressPieChart />
        </div>
      </div>
    </main>
  );
}
