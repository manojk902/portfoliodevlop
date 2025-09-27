// src/theme/index.js
// This file defines your custom Material-UI theme.
// It centralizes all design tokens like colors, typography, and component overrides.
// This makes your design consistent and easy to manage across the entire application.

import { createTheme } from '@mui/material/styles';

// Define your custom MUI theme
export const getTheme = (mode) => {

  return createTheme({
    typography: {
      fontFamily: "'Inter', sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      button: { fontWeight: 500 },
    },

    palette: {
      mode: mode, // 'light' ya 'dark'
      subtextColor: mode === "light" ? '#9CA3AF' : '#6B7280',
      cardBgColor: mode === "dark" ? '#1F2937' : '#FFFFFF',
      borderColor: mode === "dark" ? '#374151' : '#E5E7EB',
      textColor: mode === "dark" ? '#F9FAFB' : '#1F2937',
      primary: { main: "#0d6efd" },
      secondary: { main: "#6c757d" },
      success: { main: "#198754" },
      info: { main: "#0dcaf0" },
      warning: { main: "#ffc107" },
      error: { main: "#dc3545" },
      light: { main: "#f8f9fa" },
      dark: { main: "#212529" },
      background: {
        default: mode === 'light' ? "#F3F4F6" : "#121212",
      },
      text: {
        primary: mode === 'light' ? "#111827" : "#F3F4F6",
        // dark: mode === 'light' ? "#111827" : "#6610f2"
        // secondary: "#100d0dff",
      },
      // Optional custom colors (indigo, purple, pink, etc.) agar chahiye to aise:
      indigo: { main: "#6610f2" },
      purple: { main: "#6f42c1" },
      pink: { main: "#d63384" },
    },
    // Component style overrides to ensure consistent UI across default MUI components.
    // These apply global styles to all instances of these MUI components.
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: "12px",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
                : "0 4px 6px -1px rgba(255,255,255,0.05), 0 2px 4px -1px rgba(255,255,255,0.04)",
            "&:hover": {
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 8px 16px rgba(0,0,0,0.15)"
                  : "0 8px 16px rgba(255,255,255,0.08)",
            },
            ...(theme.palette.mode === "dark" && {
              border: "1px solid rgba(255,255,255,0.08)",
            }),
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', // Apply rounded corners to text fields
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '12px', // Apply rounded corners to dialogs (Modals)
          },
        },
      },
      //  MuiCard: {
      //   styleOverrides: {
      //     root: {
      //       borderRadius: '12px', // Apply rounded corners to cards
      //       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Mimics Tailwind's shadow-lg
      //     },
      //   },
      // },
    },
    // components: {
    //   MuiButton: {
    //     styleOverrides: {
    //       root: {
    //         borderRadius: '12px', // Apply rounded corners to all buttons
    //         textTransform: 'none', // Prevent uppercase text for better readability
    //       },
    //     },
    //   },
    //   MuiTextField: {
    //     styleOverrides: {
    //       root: {
    //         '& .MuiOutlinedInput-root': {
    //           borderRadius: '12px', // Apply rounded corners to text fields
    //         },
    //       },
    //     },
    //   },
    //   MuiAppBar: {
    //     styleOverrides: {
    //       root: {
    //         boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Mimics Tailwind's shadow-sm for the app bar
    //       },
    //     },
    //   },
    //   MuiCard: {
    //     styleOverrides: {
    //       root: {
    //         borderRadius: '12px', // Apply rounded corners to cards
    //         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Mimics Tailwind's shadow-lg
    //       },
    //     },
    //   },
    //   MuiDialog: {
    //     styleOverrides: {
    //       paper: {
    //         borderRadius: '12px', // Apply rounded corners to dialogs (Modals)
    //       },
    //     },
    //   },
    // },
  });
}