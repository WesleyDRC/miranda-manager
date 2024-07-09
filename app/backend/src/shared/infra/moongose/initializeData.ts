import { InitializeCategoriesUseCase } from "../../../modules/category/useCases/InitializeCategoriesUseCase";

export const initializeData = async () => {
  const initializeCategoriesUseCase = new InitializeCategoriesUseCase();
  
  try {
    await initializeCategoriesUseCase.execute();
  } catch (error) {
    console.error("Erro ao criar categorias padrão:", error);
  }
};