import { createContext, useState } from "react";

import axiosRepositoryInstance from "../repository/AxiosRepository";

export const FinanceContext = createContext({});

export const FinanceProvider = ({ children }) => {
  const [finances, setFinances] = useState([]);
  const [financeData, setFinanceData] = useState([]);
  const [rentData, setRentData] = useState([]);
  const [totalRentalEarnings, setTotalRentalEarnings] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);

  const fetchFinances = async () => {
    try {
      const response = await axiosRepositoryInstance.getFinances();
      setFinances(response.data.finances);

      calculateTotalAssets(response.data.finances);
    } catch (error) {
      return;
    }
  };

  const fetchFinanceData = async (financeId) => {
    try {
      const response = await axiosRepositoryInstance.getFinanceById({
        id: financeId,
      });

      setFinanceData(response.data.finance);
    } catch (error) {
      return;
    }
  };

  const fetchRentData = async (rentId) => {
    try {
      const response = await axiosRepositoryInstance.getRentById({
        id: rentId,
      });
      setRentData(response.data.rent);
    } catch (error) {
      return;
    }
  };

  const handleTotalRentalEarnings = (finances) => {
    const rents = finances.reduce((acc, finance) => {
      if (finance.category.name.toLowerCase() === "aluguel") {
        acc.push(finance.rent);
      }
      return acc;
    }, []);

    const initialValue = 0;
    const sumRentalEarnings = rents.reduce(
      (accumulator, currentValue) => accumulator + currentValue.netIncome,
      initialValue
    );

    return sumRentalEarnings;
  };

  const calculateTotalAssets = (finances) => {
    const sumRentalEarnings = handleTotalRentalEarnings(finances);

    setTotalRentalEarnings(sumRentalEarnings);

    /* TODO
      Add all assets
    */
    setTotalAssets(sumRentalEarnings);
  };

  return (
    <FinanceContext.Provider
      value={{
        finances,
        financeData,
        rentData,
        fetchFinances,
        fetchFinanceData,
        fetchRentData,
        totalRentalEarnings,
        totalAssets,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
