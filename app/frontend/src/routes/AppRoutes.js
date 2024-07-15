
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom"

import { MainLayout } from "../components/layout/MainLayout"
import { Authentication } from "../pages/Authentication"
import { Dashboard } from "../pages/Dashboard"
import { CreateFinance } from "../pages/CreateFinance"
import { CreateCategory } from "../pages/CreateCategory"
import { Finances } from "../pages/Finances"
import { FinanceRentDetail } from "../pages/FinanceRentDetail"

export function AppRoutes() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Authentication />
		},
		{
			element: <MainLayout />,
			children: [
				{
					path: 'dashboard',
					element: <Dashboard />
				},
				{
					path: "finance/create",
					element: <CreateFinance />
				},
				{
					path:"category/create",
					element: <CreateCategory />
				},
				{
					path: "/finances", 
					element: <Finances />
				},
				{
					path: "/finance/rent/:id", 
					element: <FinanceRentDetail />
				}
			]
		}
	])

	return <RouterProvider router={router}/>
}

