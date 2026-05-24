import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Container } from "./Container"
import { Outlet } from "react-router-dom"

import { useState } from "react"

export function MainLayout() {
	
	const [stretchedSidebar, setStretchedSidebar] = useState(false)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSidebarSize = () => {
    setStretchedSidebar(!stretchedSidebar)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

	return(
		<>
			<Header toggleMobileMenu={toggleMobileMenu} />
			<Sidebar 
				handleSidebarSize={handleSidebarSize} 
				customClass={stretchedSidebar ? "stretchedSidebar" : ""} 
				mobileMenuOpen={mobileMenuOpen}
				closeMobileMenu={() => setMobileMenuOpen(false)}
			/>
			<Container customClass={stretchedSidebar ? "stretchedSidebar" : ""} >
				<Outlet />
			</Container>
		</>
	)
}