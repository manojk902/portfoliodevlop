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
      h1: { fontWeight: 700, fontSize: "2.25rem", lineHeight: 1.3 },
      h2: { fontWeight: 600, fontSize: "1.875rem", lineHeight: 1.35 },
      h3: { fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.4 },
      body1: { fontSize: "1rem", lineHeight: 1.6 },
      body2: { fontSize: "0.875rem", lineHeight: 1.5 },
      button: { fontWeight: 500, textTransform: "none" },
    },


    palette: {
      mode: mode, // 'light' ya 'dark'
      subtextColor: mode === "light" ? '#9CA3AF' : '#6B7280',
      cardBgColor: mode === "dark" ? '#1F2937' : '#FFFFFF',
      borderColor: mode === "dark" ? '#374151' : '#E5E7EB',
      textColor: mode === "dark" ? '#F9FAFB' : '#1F2937',

      primary: {
        main: mode === "dark" ? "#64B5F6" : "#1565C0",   // richer blue, better contrast
      },
      secondary: {
        main: mode === "dark" ? "#9CA3AF" : "#6C757D",   // neutral grey for secondary buttons
      },
      success: {
        main: mode === "dark" ? "#34D399" : "#1B9C85",   // teal-green instead of plain green
      },
      info: {
        main: mode === "dark" ? "#38BDF8" : "#0DCAF0",   // soft blue info tone
      },
      warning: {
        main: mode === "dark" ? "#FACC15" : "#FFC107",   // warning yellow
      },
      error: {
        main: mode === "dark" ? "#F87171" : "#DC3545",   // red error tone
      },
      light: {
        main: "#F8F9FA",
      },
      dark: {
        main: "#0F172A",   // refined deep navy instead of muddy olive
      },
      background: {
        default: mode === "light" ? "#F5F7FA" : "#1A1C1F",  // smoother background tone
        paper: mode === "light" ? "#FFFFFF" : "#1F2937",
        // backgroundColor: mode === "light" ? "#F3F4F6" : "#111827",
      },
      divider: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
      hoverColor: mode === "light" ? "rgba(25,118,210,0.08)" : "rgba(100,181,246,0.15)",

      text: {
        // primary: mode === 'light' ? "#111827" : "#F3F4F6",
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
            variants: "outlined",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 12px rgba(0, 0, 0, 0.08)" // soft subtle light mode
                : "0 4px 12px rgba(169, 149, 200, 0.25), 0 0 20px rgba(148, 130, 177, 0.15)", // purple glow in dark

            "&:hover": {
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 6px 16px rgba(0, 0, 0, 0.12)" // slightly stronger hover in light
                  : "0 6px 16px rgba(178, 170, 190, 0.45), 0 0 25px rgba(195, 183, 215, 0.25)", // stronger purple glow
              transform: "translateY(-3px)", // smooth lift on ho`ver
              // transition: "all 0.3s ease-in-out",
            },

            border:
              theme.palette.mode === "dark"
                ? "1px solid rgba(103, 16, 242, 0.22)" // purple border in dark
                : "1px solid rgba(0, 0, 0, 0.08)", // light subtle border
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