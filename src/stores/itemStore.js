
import { create } from 'zustand';

export const useGlobalStore = create((set) => ({
  data: { user: {} },
  notification: {},
  loading: false,
  error: null,

  addData: (key, newData) =>
    set((state) => ({
      data: { ...state.data, [key]: newData },
      error: null,
    })),

  updateData: (key, updatedData) =>
    set((state) => ({
      data: {
        ...state.data,
        [key]: updatedData,
      },
      error: null,
    })),

  deleteData: (key) =>
    set((state) => {
      const { [key]: _, ...rest } = state.data;
      return {
        data: rest,
        error: null,
      };
    }),

  setNotification: (notification) =>
    set({ notification, error: null }),

  clearData: () =>
    set({ data: {}, error: null }),

  clearNotification: () =>
    set({ notification: {}, error: null }),

  setLoading: (loading) =>
    set({ loading }),
}));
