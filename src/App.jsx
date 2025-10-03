import AppProvider from './app/AppProvider'; // Import the AppProvider component
// import FullPreview from "./Components/Template/FullPreview";
const App = ({ mode, setMode }) => {
  return (
    <AppProvider mode={mode} setMode={setMode} />
  );
};

export default App; 