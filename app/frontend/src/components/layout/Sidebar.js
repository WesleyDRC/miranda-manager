import styles from "./Sidebar.module.css";

import logo from "../../assets/logo-w90-h100.png";

import homeIconActivated from "../../assets/home-activated.svg";
import homeIconDisabled from "../../assets/home-disabled.svg";

import analyticsIconActivated from "../../assets/analytics-activated.svg";
import analyticsIconDisabled from "../../assets/analytics-disabled.svg";

import settingsIconActivated from "../../assets/settings-activated.svg";
import settingsIconDisabled from "../../assets/settings-disabled.svg";

import helpIcon from "../../assets/help.svg";
import arrowSidebar from "../../assets/arrow-sidebar.svg"

import { ItemList } from "../dashboard/components/ItemList.js";

import { Link, useLocation} from "react-router-dom";
import { useState, useEffect } from "react"

export function Sidebar(props) {

  const [currentPage, setCurrentPage] = useState("/dashboard")

  let location = useLocation()

  useEffect(() => {
    setCurrentPage(location.pathname)
  }, [])

  return (
    <aside className={`${styles.aside} ${styles[props.customClass]}`}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo Miranda Manager" />
      </div>
      <nav>
        <ul className={styles.list}>
          <div className={`${styles.arrowSidebar} ${styles[props.customClass]}`} onClick={props.handleSidebarSize}>
            <img src={arrowSidebar} alt="Seta da Sidebar" />
          </div>
          <ItemList 
            path={"/dashboard"} 
            icon={currentPage === "/dashboard" ? homeIconActivated : homeIconDisabled} 
            alt="Ícone representando a página inicial."
            onClick={() => setCurrentPage("/dashboard")}
          />
          <ItemList
            path={"/finances"}
            icon={currentPage === "/finances" ? analyticsIconActivated : analyticsIconDisabled}
            alt="Ícone representando a página de análises."
            onClick={() => setCurrentPage("/finances")}
          />
          <ItemList
            path={"/finances"}
            icon={currentPage === "/settings" ? settingsIconActivated : settingsIconDisabled}
            alt="Ícone representando a página de configurações."
            onClick={() => setCurrentPage("/settings")}
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
