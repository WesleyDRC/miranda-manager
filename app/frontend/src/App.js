import { AuthProvider } from "./contexts/auth";
import { FinanceProvider } from "./contexts/finance";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppRoutes />
      </FinanceProvider>
    </AuthProvider>
  );
}
