import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely get dark mode preference
const getInitialDarkMode = () => {
  try {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference if no saved preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (error) {
    console.warn('Failed to get dark mode preference:', error);
    return false;
  }
};

// Helper function to safely set dark mode preference
const setDarkModePreference = (isDark) => {
  try {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  } catch (error) {
    console.warn('Failed to save dark mode preference:', error);
  }
};

const initialState = {
  isDarkMode: getInitialDarkMode(),
  theme: 'system', // 'light', 'dark', 'system'
  animationEnabled: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      setDarkModePreference(state.isDarkMode);
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      setDarkModePreference(state.isDarkMode);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      // Update isDarkMode based on theme
      if (action.payload === 'system') {
        state.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        state.isDarkMode = action.payload === 'dark';
      }
      setDarkModePreference(state.isDarkMode);
    },
    toggleAnimation: (state) => {
      state.animationEnabled = !state.animationEnabled;
      try {
        localStorage.setItem('animationEnabled', JSON.stringify(state.animationEnabled));
      } catch (error) {
        console.warn('Failed to save animation preference:', error);
      }
    },
    setAnimationEnabled: (state, action) => {
      state.animationEnabled = action.payload;
      try {
        localStorage.setItem('animationEnabled', JSON.stringify(state.animationEnabled));
      } catch (error) {
        console.warn('Failed to save animation preference:', error);
      }
    },
  },
});

export const { 
  toggleDarkMode, 
  setDarkMode, 
  setTheme, 
  toggleAnimation, 
  setAnimationEnabled 
} = themeSlice.actions;

export default themeSlice.reducer;