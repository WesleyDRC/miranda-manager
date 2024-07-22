
import {
	createBrowserRouter,
	RouterProvider, 
	Navigate
} from "react-router-dom"

import { MainLayout } from "../components/layout/MainLayout"
import { Authentication } from "../pages/Authentication"
import { Dashboard } from "../pages/Dashboard"
import { CreateFinance } from "../pages/CreateFinance"
import { CreateCategory } from "../pages/CreateCategory"
import { Finances } from "../pages/Finances"
import { FinanceRentDetail } from "../pages/FinanceRentDetail"
import { useAuth } from "../hooks/useAuth"

export function AppRoutes() {
	const { authenticated, loading } = useAuth();

	const Private = ({ children }) => {

    if (loading) {
      return <div className="loading"> Carregando..... </div>;
    }
    if (!authenticated) {
      return <Navigate to="/" />;
    }
    return children;
  };

	const IsAuthenticated = ({ children }) => {
		if(authenticated) {
			return <Navigate to="/dashboard" />
		}

		return children
	}

	const router = createBrowserRouter([
		{
			path: "/",
			element: <IsAuthenticated> <Authentication /> </IsAuthenticated>
		},
		{
			element: <MainLayout />,
			children: [
				{
					path: '/dashboard',
					element: <Private> <Dashboard /> </Private>
				},
				{
					path: "/finance/create",
					element: <Private> <CreateFinance /> </Private> 
				},
				{
					path:"/category/create",
					element: <Private> <CreateCategory /> </Private>
				},
				{
					path: "/finances", 
					element: <Private> <Finances /> </Private>
				},
				{
					path: "/finance/:financeId/rent/:rentId", 
					element: <Private> <FinanceRentDetail /> </Private>
				}
			]
		}
	])

	return <RouterProvider router={router}/>
}

