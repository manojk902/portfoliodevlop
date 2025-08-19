
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import the App component
// Material-UI Imports for global theming and baseline CSS
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/index.js'; // Import your custom MUI theme
// Redux Toolkit Import for global state management
import { Provider } from 'react-redux';
import { persistor, store } from './store/index.js'; // Import your Redux store
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);