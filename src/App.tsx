import { ThemeProvider } from "@emotion/react";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
