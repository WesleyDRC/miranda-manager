import styles from "./Sidebar.module.css";

import logo from "../../assets/logo-w90-h100.png";
import homeIcon from "../../assets/home.svg";
import analyticsIcon from "../../assets/analytics.svg";
import settingssIcon from "../../assets/settings.svg";
import helpIcon from "../../assets/help.svg";
import arrowSidebar from "../../assets/arrow-sidebar.svg"

import { ItemList } from "../dashboard/components/ItemList.js";

import { Link } from "react-router-dom";

export function Sidebar(props) {

  return (
    <aside className={`${styles.aside} ${styles[props.customClass]}`}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo Miranda Manager" />
        <div className={`${styles.arrowSidebar} ${styles[props.customClass]}`} onClick={props.handleSidebarSize}>
          <img src={arrowSidebar} alt="Seta da Sidebar" />
        </div>
      </div>
      <nav>
        <ul className={styles.list}>
          <ItemList 
            path={"/dashboard"} 
            icon={homeIcon} 
            alt="Ícone representando a página inicial."
          />
          <ItemList
            path={"/dashboard/analytics"}
            icon={analyticsIcon}
            alt="Ícone representando a página de análises."
          />
          <ItemList
            path={"/settings"}
            icon={settingssIcon}
            alt="Ícone representando a página de configurações."
          />
        </ul>
      </nav>
      <div className={styles.help}>
        <Link to="/help">
          <img src={helpIcon} alt="Ícone de ajuda" />
        </Link>
      </div>
    </aside>
  );
}
