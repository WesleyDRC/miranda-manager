
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom"

import { Authentication } from "../pages/Authentication"
import { Dashboard } from "../pages/Dashboard"
import { CreateFinance } from "../pages/CreateFinance"

export function AppRoutes() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Authentication />
		},
		{
			path: "/dashboard",
			element: <Dashboard />
		},
		{
			path: "/finance/create",
			element: <CreateFinance />
		}
	])

	return <RouterProvider router={router}/>
}

