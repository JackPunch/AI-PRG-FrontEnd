import { Routes, Route } from "react-router";
import FirstInput from "./pages/FirstInput";
import ConversationPage from "./pages/ConversationPage";
import useMessage from "./hooks/useMessage";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";

import { useSession } from "./hooks/useSession.ts";
import type { Session } from "./hooks/useSession.ts";

function App() {
  const [sessions, updateSessions, deleteSession, addSession]: [
    Session[],
    () => void,
    (sessionId: string) => void,
    () => void
  ] = useSession();
  const [messages, addMessage, getMessages, clearMessages] =
    useMessage(updateSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  return (
    <SidebarProvider>
      <AppSidebar
        sessions={sessions}
        deleteSession={deleteSession}
        currentSessionId={currentSessionId}
        getMessages={getMessages}
        clearMessages={clearMessages}
        setCurrentSessionId={setCurrentSessionId}
      />
      <main className="w-full">
        <SidebarTrigger />
        <Routes>
          <Route
            index
            element={
              <FirstInput onSubmit={addMessage} addSession={addSession} />
            }
          />
          <Route
            path="chat/:sessionId"
            element={
              <ConversationPage
                messages={messages}
                onClick={addMessage}
                setCurrentSessionId={setCurrentSessionId}
                getMessages={getMessages}
              />
            }
          />
        </Routes>
      </main>
    </SidebarProvider>
  );
}

export default App;
