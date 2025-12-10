import { useCallback, useEffect, useState } from "react";
export default function useTyping(content: string, typeSpeed: number = 100) {
  const [curIndex, setCurIndex] = useState<number>(0);
  const len = content.length;
  const typing = useCallback(() => {
    if (curIndex >= len) {
      return;
    }
    setCurIndex((pre) => pre + 1);
    const timeoutId = setTimeout(typing, typeSpeed);
  }, [curIndex, typeSpeed, len]);
  useEffect(() => {
    typing();
  }, [typing, curIndex]);

  return content.slice(0, curIndex);
}
