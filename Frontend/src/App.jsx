import { useTheme } from "./hooks/useTheme.js";
import { SupportPage } from "./pages/SupportPage.jsx";

function App() {
  const { theme, toggleTheme } = useTheme();

  return <SupportPage theme={theme} onToggleTheme={toggleTheme} />;
}

export default App;
