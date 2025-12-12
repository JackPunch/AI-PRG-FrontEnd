import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import useTyping from "./useTyping";

export interface Message {
  id: string;
  role: "user" | "assistant" | "typing";
  content: string;
  sessionId?: string;
  conversationId?: string;
  stage?:
    | "initialization"
    | "clarification"
    | "outline"
    | "writing"
    | "reActing"
    | "complete";
}

function useMessage(updateSessions: () => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  function addMessage(content: string, role: "user" | "assistant" = "user") {
    const newMessages: Message[] = [...messages];
    if (messages.length === 0) {
      newMessages.push({ id: uuidv4(), role, content });
      setMessages(newMessages);
      sendMessage({ query: content }).catch((e) => console.error(e));
    } else {
      const lastMessage = messages[messages.length - 1];
      newMessages.push({
        id: uuidv4(),
        role,
        content,
        sessionId: lastMessage.sessionId,
      });
      setMessages(newMessages);
      sendMessage({
        query: content,
        sessionId: lastMessage.sessionId,
        parentId: lastMessage.conversationId,
      }).catch((e) => console.error(e));
    }
  }

  async function sendMessage({
    query,
    baseURL,
    sessionId,
    parentId,
  }: {
    query: string;
    baseURL?: string;
    sessionId?: string;
    parentId?: string;
  }) {
    const url = (baseURL || "http://localhost:3000") + "/api/agents/craftcard";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          sessionId && parentId
            ? { query, session_id: sessionId, parent_id: parentId }
            : { query }
        ),
      });

      if (!response.ok) {
        throw new Error(
          `网络错误，状态码：${response.status} \n Response status: ${response.status}`
        );
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      let isFirst = true;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.trim().length === 0) continue;
          const tmp = line.trim().slice(6);
          if (tmp === "[DONE]") continue;
          // console.log(tmp);
          const textObj = JSON.parse(tmp);
          const content = textObj.data.content;
          const sessionId = textObj.session_id;
          const conversationId = textObj.conversation_id;
          // console.log(text.match(/{.*}/));

          setMessages((prev) => [
            ...prev,
            {
              id: uuidv4(),
              role: "typing",
              content,
              sessionId,
              conversationId,
              stage: textObj.data.stage,
            },
          ]);
          if (isFirst) {
            isFirst = false;
            updateSessions();
            navigate(`/chat/${sessionId}`);
          }
        }
      }
    } catch (e) {
      console.error(`生成卡片时发生错误：${e}`);
      throw e;
    }
  }

  function getMessages(sessionId: string) {
    const url = "http://localhost:3000/api/store/conversation/list";
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ session_id: sessionId });
    async function fetchMessages() {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body,
        });

        if (!response.ok) {
          const e = new Error(`网络错误，状态码：${response.status}`);
          throw e;
        }

        const result = await response.json();
        // console.log(result);
        const fetchMessages: Message[] = result.data.conversations.map(
          (msg: {
            id: string;
            type: string;
            content: string;
            session_id: string;
          }) => {
            let type: string = msg.type;
            if (type === "human") type = "user";
            else if (type === "ai") type = "assistant";
            return {
              id: msg.id,
              role: type,
              content: msg.content,
              sessionId: msg.session_id,
              conversationId: msg.id,
            };
          }
        );
        setMessages(fetchMessages);
      } catch (e) {
        console.error(`获取消息记录时发生错误：${e}`);
      }
    }

    fetchMessages();
  }

  function clearMessages() {
    setMessages([]);
  }

  return [messages, addMessage, getMessages, clearMessages] as const;
}

export default useMessage;
