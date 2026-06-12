
import {
	createHashRouter,
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
import { RentalsDashboard } from "../pages/RentalsDashboard"
import { ForecastDashboard } from "../pages/ForecastDashboard"
import { WalletsDashboard } from "../pages/WalletsDashboard"
import { PatrimonyDashboard } from "../pages/PatrimonyDashboard"
import { PatrimonyDetail } from "../pages/PatrimonyDetail"
import { TransactionsDashboard } from "../pages/TransactionsDashboard"
import { VehicleDetail } from "../pages/VehicleDetail"
import { useAuth } from "../hooks/useAuth"
import ErrorPage from "../pages/ErrorPage"

export function AppRoutes() {
	const { authenticated, loading } = useAuth();

	const Private = ({ children }) => {

    if (loading) {
      return 
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

	const router = createHashRouter([
		{
			path: "/",
			element: <IsAuthenticated> <Authentication /> </IsAuthenticated>,
			errorElement: <ErrorPage />
		},
		{
			element: <MainLayout />,
			children: [
				{
					path: '/dashboard',
					element: <Private> <Dashboard /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/finance/create",
					element: <Private> <CreateFinance /> </Private> 
				},
				{
					path:"/category/create",
					element: <Private> <CreateCategory /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/finances", 
					element: <Private> <Finances /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/rentals",
					element: <Private> <RentalsDashboard /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/forecast",
					element: <Private> <ForecastDashboard /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/wallets",
					element: <Private> <WalletsDashboard /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/patrimony",
					element: <Private> <PatrimonyDashboard /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/patrimony/:id",
					element: <Private> <PatrimonyDetail /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/patrimony/vehicle/:id",
					element: <Private> <VehicleDetail /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/transactions",
					element: <Private> <TransactionsDashboard /> </Private>,
					errorElement: <ErrorPage />
				},
				{
					path: "/finance/:financeId/rent/:rentId", 
					element: <Private> <FinanceRentDetail /> </Private>,
					errorElement: <ErrorPage />
				}
			]
		}
	])

	return <RouterProvider router={router}/>
}

