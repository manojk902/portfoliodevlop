import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

const BuilderPage = () => {
  return (
    <div style={{ display: 'flex',marginTop:'1px' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px',marginTop:'1px' }}>
        <Outlet /> {/* This is where the clicked component will render */}
      </main>
    </div>
  );
};
export default BuilderPage;