import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { persistor, store } from './store/index.js';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { getTheme } from './theme/index.js';

function Root() {
  const [mode, setMode] = useState("dark"); // ✅ hook inside component
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={getTheme(mode)}>
          <CssBaseline />
          <BrowserRouter>
            <App mode={mode} setMode={setMode} /> {/* pass props */}
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
