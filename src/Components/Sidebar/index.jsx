import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const [isCvOpen, setIsCvOpen] = useState(false);

  const toggleCvDropdown = () => {
    setIsCvOpen(!isCvOpen);
  };

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.sidebarList}>
        <li className={styles.sidebarItem}>
          <button
            className={styles.sidebarButton}
            onClick={toggleCvDropdown}
            aria-expanded={isCvOpen}
            aria-controls="cv-submenu"
          >
            CV {isCvOpen ? "−" : "+"}
          </button>
          <ul
            id="cv-submenu"
            className={`${styles.sidebarSubmenu} ${isCvOpen ? styles.open : ""}`}
          >
            <li className={styles.sidebarSubitem}>
              <Link to="userinfo" className={styles.sidebarLink}>
                User Info
              </Link>
            </li>
            <li className={styles.sidebarSubitem}>
              <Link to="template" className={styles.sidebarLink}>
                Template
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;