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
import { useState } from "react";
import type { Message as MessageType } from "@/hooks/useMessage";

interface ConversationPageProps {
  message: MessageType[];
  onClick: (input: string) => void;
}

export default function ConversationPage({
  message,
  onClick,
}: ConversationPageProps) {
  const [input, setInput] = useState("");

  const conversation = message.map((message) => {
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
            <MessageContent>{message.content}</MessageContent>
          </Message>
        );
    }
  });

  return (
    <div className="flex flex-col justify-between h-[calc(100vh-2rem)] items-center w-11/12 m-auto">
      <Conversation className="relative w-full" style={{ height: "500px" }}>
        <ConversationContent>{conversation}</ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Type your message..."
        />
        <PromptInputToolbar className="flex justify-end">
          <PromptInputSubmit disabled={!input.trim()} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
