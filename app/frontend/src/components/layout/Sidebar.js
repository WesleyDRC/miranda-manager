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
import { FaBuilding } from "react-icons/fa";

import { Link, useLocation} from "react-router-dom";
import { useState, useEffect } from "react"

export function Sidebar(props) {

  const [currentPage, setCurrentPage] = useState("/dashboard")

  let location = useLocation()

  useEffect(() => {
    const regex = /\/([^/]*)/;
    const match = location.pathname.match(regex);

    setCurrentPage(match && match[1])
  }, [location.pathname])

  return (
    <>
      <div
        className={`${styles.overlay} ${props.mobileMenuOpen ? styles.mobileOpen : ""}`}
        onClick={props.closeMobileMenu}
      />
      <aside className={`${styles.aside} ${styles[props.customClass]} ${props.mobileMenuOpen ? styles.mobileOpen : ""}`}>
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
              icon={currentPage === "dashboard" ? homeIconActivated : homeIconDisabled}
              alt="Ícone representando a página inicial."
              onClick={() => {
                setCurrentPage("dashboard");
                props.closeMobileMenu();
              }}
              label="Dashboard"
              isExpanded={props.customClass === "stretchedSidebar"}
            />
            <ItemList
              path={"/finances"}
              icon={currentPage === "finances" || currentPage === "finance" ? analyticsIconActivated : analyticsIconDisabled}
              alt="Ícone representando a página de análises."
              onClick={() => {
                setCurrentPage("finances");
                props.closeMobileMenu();
              }}
              label="Finanças"
              isExpanded={props.customClass === "stretchedSidebar"}
            />
            <ItemList
              path={"/rentals"}
              icon={<FaBuilding style={{ color: currentPage === "rentals" ? "#5E17EB" : "#5F5F5F", width: "32px", height: "32px" }} />}
              alt="Ícone representando a página de alugueis."
              onClick={() => {
                setCurrentPage("rentals");
                props.closeMobileMenu();
              }}
              label="Aluguéis"
              isExpanded={props.customClass === "stretchedSidebar"}
            />
            {/* <ItemList
              path={"/settings"}
              icon={currentPage === "settings" ? settingsIconActivated : settingsIconDisabled}
              alt="Ícone representando a página de configurações."
              onClick={() => {
                setCurrentPage("settings");
                props.closeMobileMenu();
              }}
              label="Configurações"
              isExpanded={props.customClass === "stretchedSidebar"}
            /> */}
          </ul>
        </nav>
        <div className={styles.help}>
          {/* <Link to="/help" onClick={props.closeMobileMenu}>
            <img src={helpIcon} alt="Ícone de ajuda" />
          </Link> */}
        </div>
      </aside>
    </>
  );
}
