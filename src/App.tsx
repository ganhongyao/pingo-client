import { ThemeProvider } from "@emotion/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import NamePrompt from "./components/NamePrompt";
import Landing from "./pages/Landing";
import theme from "./theme";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NamePrompt />
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
      </ThemeProvider>
    </Provider>
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
