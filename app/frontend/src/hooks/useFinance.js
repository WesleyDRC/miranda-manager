import { useContext } from "react";
import { FinanceContext } from "../contexts/finance";

export const useFinance = () => {
  return useContext(FinanceContext);
};

