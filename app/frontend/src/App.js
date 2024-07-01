import { AuthProvider } from "./contexts/auth";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
