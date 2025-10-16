export const mockDashboardData = {
  kpis: [
    { label: "Completed Tasks", value: 25, change: 11.01, trend: "up" as const },
    { label: "Overdue Tasks", value: 6, change: -0.03, trend: "down" as const },
    { label: "Tasks Created", value: 36, change: 15.03, trend: "up" as const },
    { label: "Open Tasks", value: 5, change: 6.08, trend: "up" as const }
  ],
  lineData: [
    { date: "1 Jan", thisMonth: 6, lastMonth: 3 },
    { date: "2 Jan", thisMonth: 7, lastMonth: 6 },
    { date: "3 Jan", thisMonth: 5, lastMonth: 5 },
    { date: "4 Jan", thisMonth: 8, lastMonth: 7 },
    { date: "5 Jan", thisMonth: 7, lastMonth: 4 },
    { date: "6 Jan", thisMonth: 12, lastMonth: 10 },
    { date: "7 Jan", thisMonth: 10, lastMonth: 9 },
    { date: "8 Jan", thisMonth: 11, lastMonth: 6 },
    { date: "Today", thisMonth: 12, lastMonth: 15 }
  ],
  taskTypes: [
    { name: "Bugs", count: 12, color: "#8b5cf6" },
    { name: "Features", count: 20, color: "#10b981" },
    { name: "Update", count: 15, color: "#1f2937" },
    { name: "Review", count: 18, color: "#3b82f6" },
    { name: "Request", count: 8, color: "#8b5cf6" },
    { name: "Tasks", count: 16, color: "#10b981" }
  ],
  taskProgress: [
    { name: "Pending", value: 52.1, color: "#1f2937" },
    { name: "In Progress", value: 22.8, color: "#3b82f6" },
    { name: "In Review", value: 13.9, color: "#10b981" },
    { name: "Done", value: 11.2, color: "#6b7280" }
  ],
  projects: [
    { name: "PMS", progress: 45 },
    { name: "Project 1", progress: 78 },
    { name: "Project 2", progress: 30 },
    { name: "Project 3", progress: 65 },
    { name: "Project 4", progress: 20 },
    { name: "Project 5", progress: 85 }
  ]
};

export const mockTasks = [
  {
    id: 1,
    title: "Sed iaculis placerat dui et sit",
    description: "Nullam enim sed sit convallis...",
    priority: "High",
    status: "Pending",
    assignees: [{ name: "John", avatar: "👤" }, { name: "Jane", avatar: "👤" }],
    attachments: 3,
    comments: 3,
    checklist: { completed: 0, total: 3 },
    type: "Bug",
    department: "IT"
  },
  // ...copy the rest unchanged
];

export const mockDepartments = [
  { name: "Marketing", projects: ["Product Launch Q4", "Visual Concept"] },
  { name: "Product", projects: ["Developer", "UI/UX Design", "Tester", "Production Round"] },
  { name: "Drafts", projects: [] }
];
