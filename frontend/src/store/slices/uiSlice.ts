import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  notifications: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    open: boolean;
  };
  sidebarOpen: boolean;
}

const initialState: UIState = {
  darkMode: true,
  notifications: {
    message: '',
    type: 'info',
    open: false,
  },
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    showNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.notifications = {
        ...action.payload,
        open: true,
      };
    },
    hideNotification: (state) => {
      state.notifications.open = false;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  toggleDarkMode,
  showNotification,
  hideNotification,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer; 