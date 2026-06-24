import { InitializeCategoriesUseCase } from "@/modules/category/useCases/InitializeCategoriesUseCase";
import { InitializeTreasuryProductsUseCase } from "@/modules/treasury/useCases/InitializeTreasuryProductsUseCase";

export const initializeData = async () => {
  const initializeCategoriesUseCase = new InitializeCategoriesUseCase();
  const initializeTreasuryProductsUseCase = new InitializeTreasuryProductsUseCase();
  
  try {
    await initializeCategoriesUseCase.execute();
  } catch (error) {
    console.error("Erro ao criar categorias padrão:", error);
  }

  try {
    await initializeTreasuryProductsUseCase.execute();
  } catch (error) {
    console.error("Erro ao criar produtos padrão do tesouro:", error);
  }
};