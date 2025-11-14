import { Routes, Route } from "react-router";
import FirstInput from "./pages/FirstInput";
import ConversationPage from "./pages/ConversationPage";
import useMessage from "./hooks/useMessage";

function App() {
  const [message, addMessage] = useMessage();

  return (
    <Routes>
      <Route index element={<FirstInput onSubmit={addMessage} />} />
      <Route
        path="chat"
        element={<ConversationPage message={message} onClick={addMessage} />}
      />
    </Routes>
  );
}

export default App;
