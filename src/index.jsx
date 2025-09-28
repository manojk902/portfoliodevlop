import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, CssBaseline} from '@mui/material';
import { Provider } from 'react-redux';
import { persistor, store } from './store/index.js';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { getTheme } from './theme/index.js';
import { motion } from "framer-motion";
function Root() {
  const [mode, setMode] = useState("dark"); // ✅ hook inside component
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={getTheme(mode)}>
          <CssBaseline />
          <BrowserRouter>
            <motion.div
              initial={false} // prevent re-init on toggle
              animate={{
                backgroundColor:  mode === 'light' ? "#f3f4f692" : "#121212",
                color: mode === "light" ? "#000000" : "#ffffff",
              }}
              transition={{
                duration: 0.1,      // smoothness control
                ease: "linear",  // motion curve
              }}
              style={{
                minHeight: "100vh",
              }}
            >
              <App mode={mode} setMode={setMode} />
            </motion.div>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
