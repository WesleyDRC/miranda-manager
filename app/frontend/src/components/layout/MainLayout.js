import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Container } from "./Container"
import { Outlet } from "react-router-dom"

import { useState } from "react"

export function MainLayout() {
	
	const [stretchedSidebar, setStretchedSidebar] = useState(false)

  const handleSidebarSize = () => {
    setStretchedSidebar(!stretchedSidebar)
  }

	return(
		<>
			<Header />
			<Sidebar handleSidebarSize={handleSidebarSize} customClass={stretchedSidebar ? "stretchedSidebar" : ""} />
			<Container customClass={stretchedSidebar ? "stretchedSidebar" : ""} >
				<Outlet />
			</Container>
		</>
	)
}