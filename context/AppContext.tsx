"use client";
import React, {createContext, useContext, useState} from "react";
import { mockTasks } from "@/lib/mockData";

type AppContextType = {
  isChatOpen: boolean;
  setIsChatOpen: (v: boolean) => void;
  isSecondSidebarOpen: boolean;
  setIsSecondSidebarOpen: (v: boolean) => void;
  tasks: typeof mockTasks;
  setTasks: (v: typeof mockTasks) => void;
  isCreatingTask: boolean;
  setIsCreatingTask: (v: boolean) => void;
  isCreatingProject: boolean;
  setIsCreatingProject: (v: boolean) => void;
  tasksRefreshKey: number;
  bumpTasksRefresh: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSecondSidebarOpen, setIsSecondSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState(mockTasks);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [tasksRefreshKey, setTasksRefreshKey] = useState(0);
  const bumpTasksRefresh = () => setTasksRefreshKey((k) => k + 1);

  return (
    <AppContext.Provider value={{
      isChatOpen, setIsChatOpen,
      isSecondSidebarOpen, setIsSecondSidebarOpen,
      tasks, setTasks,
      isCreatingTask, setIsCreatingTask,
      isCreatingProject, setIsCreatingProject,
      tasksRefreshKey, bumpTasksRefresh
    }}>
      {children}
    </AppContext.Provider>
  );
};
