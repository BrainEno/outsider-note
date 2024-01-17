import "./App.css";
import { SettingsContext } from "./context/SettingsContext";
import Home from "./pages/Home";

function App() {

  return (
    <SettingsContext>
      <Home />
    </SettingsContext>
  );
}

export default App;
