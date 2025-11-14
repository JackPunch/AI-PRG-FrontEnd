import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function useMessage() {
  const [message, setMessage] = useState<Message[]>([]);

  function addMessage(content: string, role: "user" | "assistant" = "user") {
    const newMessage: Message = { id: uuidv4(), role, content };
    setMessage((prev) => [...prev, newMessage]);
    sendMessage(content).catch((e) => console.error(e));
  }

  async function sendMessage(
    query: string,
    baseURL: string = "http://localhost:3000"
  ) {
    const url = baseURL + "/api/agents/craftcard";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(
          `网络错误，状态码：${response.status} \n Response status: ${response.status}`
        );
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.trim().length === 0) continue;
          const tmp = line.trim().slice(6);
          if (tmp === "[DONE]") continue;
          console.log(tmp);
          const content = JSON.parse(tmp)!.content;

          // console.log(text.match(/{.*}/));

          setMessage((prev) => [
            ...prev,
            {
              id: uuidv4(),
              role: "assistant",
              content,
            },
          ]);
        }
      }
    } catch (e) {
      console.error(`生成卡片时发生错误：${e}`);
      throw e;
    }
  }

  return [message, addMessage] as const;
}

export default useMessage;
