import { Routes, Route } from "react-router";
import FirstInput from "./pages/FirstInput";
import ConversationPage from "./pages/ConversationPage";

function App() {
  return (
    <Routes>
      <Route index element={<FirstInput />} />
      <Route path="chat" element={<ConversationPage />} />
    </Routes>
  );
}

export default App;
