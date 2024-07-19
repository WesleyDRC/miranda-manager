import { createContext, useState } from "react";

import axiosRepositoryInstance from "../repository/AxiosRepository";

export const FinanceContext = createContext({})

export const FinanceProvider = ({children}) => {

	const [finances, setFinances] = useState([]);
	const [financeData, setFinanceData] = useState([]);
  const [rentData, setRentData] = useState([]);

	const fetchFinances = async () => {
		try {
			const response = await axiosRepositoryInstance.getFinances()
			setFinances(response.data.finances)
		} catch (error) {
			return
		}
	}

	const fetchFinanceData = async (financeId) => {
		try {
			const response = await axiosRepositoryInstance.getFinanceById({
				id: financeId
			})

			setFinanceData(response.data.finance)
		} catch (error) {
			return
		}
	}

	const fetchRentData = async (rentId) => {
		try {
			const response = await axiosRepositoryInstance.getRentById({
				id: rentId
			})
			setRentData(response.data.rent)
		} catch (error) {
			return
		}
	}

	return (
		<FinanceContext.Provider
			value={{
				finances,
				financeData,
				rentData,
				fetchFinances,
				fetchFinanceData,
				fetchRentData
			}}
		>
			{children}
		</FinanceContext.Provider>
	)
}