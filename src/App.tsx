import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
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
          />
          <Button
            type="button"
            className="h-13 border-2 border-input rounded-xl font-bold text-lg cursor-pointer"
          >
            生成剧本
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
