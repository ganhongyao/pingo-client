import { ThemeProvider } from "@emotion/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { SnackbarProvider } from "notistack";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import { socket, SocketContext } from "./context/socket";
import Landing from "./pages/Landing";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SocketContext.Provider value={socket}>
        <SnackbarProvider>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route
              path="/*"
              element={
                <RequireAuth redirectTo="/landing">
                  <AppShell />
                </RequireAuth>
              }
            />
          </Routes>
        </SnackbarProvider>
      </SocketContext.Provider>
    </ThemeProvider>
  );
}

interface RequireAuthProps {
  children: ReactJSXElement;
  redirectTo: string;
}

function RequireAuth({ children, redirectTo }: RequireAuthProps) {
  let isAuthenticated = true; // TODO: Implement auth
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default App;
