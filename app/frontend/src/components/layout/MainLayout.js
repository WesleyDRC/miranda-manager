import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Container } from "./Container"
import { Outlet } from "react-router-dom"


export function MainLayout() {
	return(
		<>
			<Header />
			<Sidebar />
			<Container>
				<Outlet />
			</Container>
		</>
	)
}