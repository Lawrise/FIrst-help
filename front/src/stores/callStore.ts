// src/stores/callStore.ts
import { create } from "zustand";
import axios from "axios";

export type Priority = "1" | "2" | "3" | "4";

interface Call {
  dateTime: ReactNode;
  id: string;
  _id: string;
  uuid: string;
  name: string;
  accident: string;
  location: string;
  priority: Priority;
  createdAt: string;
}

interface CallStore {
  // State
  calls: Call[];
  loading: boolean;
  error: string | null;
  filterPriority: Priority | null;

  // Actions
  fetchCalls: (uuid: string) => Promise<void>;
  addCall: (call: Call) => void;
  updateCall: (id: string, updates: Partial<Call>) => void;
  toggleCallCheck: (id: string) => void;
  deleteCall: (id: string) => Promise<void>;
//   setSortOrder: (order: "asc" | "desc") => void;
//   setFilterPriority: (priority: Priority | null) => void;
  
//   // Getters
//   getFilteredAndSortedCalls: () => Call[];
//   getPriorityCount: (priority: Priority) => number;
}

const useCallStore = create<CallStore>((set, get) => ({
  // Initial state
  calls: [],
  loading: false,
  error: null,
  filterPriority: null,

  // Actions
  fetchCalls: async (uuid: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Call[]>(`http://localhost:3000/eliza/${uuid}`);
      set({ calls: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch calls", 
        loading: false 
      });
    }
  },

  addCall: (call: Call) => {
    set((state) => ({
      calls: [...state.calls, call]
    }));
  },

  updateCall: (id: string, updates: Partial<Call>) => {
    set((state) => ({
      calls: state.calls.map((call) =>
        call._id === id ? { ...call, ...updates } : call
      )
    }));
  },

  toggleCallCheck: (id: string) => {
    set((state) => ({
      calls: state.calls.map((call) =>
        call._id === id ? { ...call, checked: !call.checked } : call
      )
    }));
  },

  deleteCall: async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/eliza/calls/${id}`);
      set((state) => ({
        calls: state.calls.filter((call) => call._id !== id)
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to delete call"
      });
    }
  },

//   setSortOrder: (order: "asc" | "desc") => {
//     set({ sortOrder: order });
//   },

//   setFilterPriority: (priority: Priority | null) => {
//     set({ filterPriority: priority });
//   },

//   // Getters
//   getFilteredAndSortedCalls: () => {
//     const state = get();
//     let filteredCalls = state.calls;

//     // Apply priority filter
//     if (state.filterPriority) {
//       filteredCalls = filteredCalls.filter(
//         (call) => call.priority === state.filterPriority
//       );
//     }

//     // Apply sorting
//     const sortedCalls = [...filteredCalls].sort((a, b) => {
//       const dateA = new Date(a.createdAt).getTime();
//       const dateB = new Date(b.createdAt).getTime();
//       return state.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
//     });

//     return sortedCalls;
//   },

//   getPriorityCount: (priority: Priority) => {
//     const state = get();
//     return state.calls.filter((call) => call.priority === priority).length;
//   },
}));

export default useCallStore;