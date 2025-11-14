import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useState } from "react";
import type { FormEvent } from "react";

interface FirstInputProps {
  onSubmit: (input: string) => void;
}

function FirstInput({ onSubmit }: FirstInputProps) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // 阻止默认提交
    // 这里执行表单验证或API请求逻辑
    console.log("表单已提交");

    // 跳转到指定页面
    navigate("/chat"); // 相当于 <Link to="/success" />
    onSubmit(input);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        id="app-container"
        className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] pb-60"
      >
        <h1
          id="app-title"
          className="scroll-m-20 text-center text-5xl font-extrabold tracking-tight text-balance"
        >
          AI跑团
        </h1>
        <p
          id="app-desc"
          className="scroll-m-20 text-center text-m font-extrabold tracking-tight text-balance"
        >
          剧本生成器
        </p>
        <div
          id="app-input-container"
          className="flex items-center justify-center gap-4 mt-10 w-[50vw]"
        >
          <Input
            type="text"
            className="h-12 border-2 border-input rounded-xl"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          <Button
            type="submit"
            className="h-13 border-2 border-input rounded-xl font-bold text-lg cursor-pointer"
            disabled={!input.trim()}
          >
            生成剧本
          </Button>
        </div>
      </div>
    </form>
  );
}

export default FirstInput;
