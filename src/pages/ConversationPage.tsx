import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/shadcn-io/ai/conversation";
import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { useState, useEffect } from "react";
import type { Message as MessageType } from "@/hooks/useMessage";
import { useParams } from "react-router";
import Markdown from "react-markdown";
import useTyping from "@/hooks/useTyping";

interface ConversationPageProps {
  messages: MessageType[];
  onClick: (input: string) => void;
  setCurrentSessionId: (sessionId: string) => void;
  getMessages: (sessionId: string) => void;
}

function Typed({ children }: { children: string }) {
  const curContent = useTyping(children, 1000000000);
  return <Markdown>{curContent}</Markdown>;
}

export default function ConversationPage({
  messages,
  onClick,
  setCurrentSessionId,
  getMessages,
}: ConversationPageProps) {
  const [input, setInput] = useState("");
  let isCompleted = false;
  if (
    messages &&
    messages.length > 0 &&
    messages[messages.length - 1].stage &&
    messages[messages.length - 1].stage === "complete"
  ) {
    isCompleted = true;
  }

  const { sessionId } = useParams<{ sessionId: string }>();
  useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, [sessionId, setCurrentSessionId]);

  const conversation = messages.map((message) => {
    switch (message.role) {
      case "user":
        return (
          <Message from={"user"} key={message.id}>
            <MessageContent>{message.content}</MessageContent>
          </Message>
        );

      case "assistant":
        return (
          <Message from={"assistant"} key={message.id}>
            <MessageContent className="leading-6">
              <Markdown>{message.content}</Markdown>
            </MessageContent>
          </Message>
        );

      case "typing":
        return (
          <Message from={"assistant"} key={message.id}>
            <MessageContent className="leading-6">
              <Typed>{message.content}</Typed>
            </MessageContent>
          </Message>
        );
    }
  });

  useEffect(() => {
    if (sessionId) {
      if (sessionId !== "loading...") {
        getMessages(sessionId);
      }
    }
  }, []);

  const promptInput = (
    <PromptInput
      onSubmit={(e) => {
        e.preventDefault();
        onClick(input);
        setInput("");
      }}
    >
      <PromptInputTextarea
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        placeholder="Type your message..."
      />
      <PromptInputToolbar className="flex justify-end">
        <PromptInputSubmit disabled={!input.trim()} />
      </PromptInputToolbar>
    </PromptInput>
  );

  const linkButton = (
    <a
      href="http://localhost:8000"
      target="_blank"
      className="w-full divide-y overflow-hidden rounded-xl border bg-background shadow-sm h-24"
    >
      <button
        type="button"
        className="w-full h-full divide-y overflow-hidden rounded-xl border bg-background shadow-sm cursor-pointer bg-green-400"
      >
        Go to Sillly Tavern
      </button>
    </a>
  );

  return (
    <div className="flex flex-col justify-between h-[calc(100vh-2rem)] items-center w-11/12 m-auto">
      <Conversation className="relative w-full" style={{ height: "500px" }}>
        <ConversationContent>{conversation}</ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      {isCompleted ? linkButton : promptInput}
    </div>
  );
}
