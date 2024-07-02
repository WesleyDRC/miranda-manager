
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom"

import { Authentication } from "../pages/Authentication"
import { Dashboard } from "../pages/Dashboard"

export function AppRoutes() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Authentication />
		},
		{
			path: "/dashboard",
			element: <Dashboard />
		}
	])

	return <RouterProvider router={router}/>
}

