
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom"

import { Authentication } from "../pages/Authentication"

export function AppRoutes() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Authentication />
		}
	])

	return <RouterProvider router={router}/>
}

