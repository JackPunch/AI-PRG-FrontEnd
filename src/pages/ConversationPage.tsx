"use client";

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

export default function ConversationPage() {
  return (
    <div className="flex flex-col justify-between h-[calc(100vh-2rem)] items-center w-11/12 m-auto">
      <Conversation className="relative w-full" style={{ height: "500px" }}>
        <ConversationContent>
          <Message from={"user"}>
            <MessageContent>Hi there!</MessageContent>
          </Message>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea
          // value={input}
          // onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Type your message..."
        />
        <PromptInputToolbar className="flex justify-end">
          <PromptInputSubmit
          // disabled={!input.trim()}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
