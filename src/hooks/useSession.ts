import { useEffect, useState } from "react";

export interface Session {
  id: string;
  title: string;
  isActive: boolean;
}

export function useSession(): [
  Session[],
  () => void,
  (sessionId: string) => void,
  () => void
] {
  const [sessions, setSessions] = useState<Session[]>([]);

  async function getSessions(baseURL = "http://localhost:3000") {
    const url = baseURL + "/api/store/session/list";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offset: 0, limit: 50 }),
      });

      if (!response.ok) {
        throw new Error(
          `获取 sessions 列表时发生网络错误，错误码：${response.status}`
        );
      }

      const result = await response.json();
      const newSessions = result.data.sessions.map((session: Session) => {
        const newTitle =
          session.title.length > 8
            ? session.title.slice(0, 7) + "..."
            : session.title;
        return { ...session, title: newTitle, isActive: false };
      });
      setSessions(newSessions);
    } catch (e) {
      console.error(`获取 sessions 列表时发生错误：${e}`);
      throw e;
    }
  }

  useEffect(() => {
    updateSessions();
  }, []);

  // useEffect(() => {
  //   console.log(sessions);
  // }, [sessions]);

  function updateSessions() {
    getSessions()
      // .then(() => console.log("更新 sessions 列表"))
      .catch((e) => console.error(e));
  }

  function deleteSession(sessionId: string) {
    const url = "http://localhost:3000/api/store/session/delete";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `删除 session 时发生网络错误，错误码：${response.status}`
          );
          throw new Error(
            `删除 session 时发生网络错误，错误码：${response.status}`
          );
        }
        // 从本地状态中移除该 session
        setSessions((prevSessions) =>
          prevSessions.filter((session) => session.id !== sessionId)
        );
      })
      .catch((e) => {
        console.error(`删除 session 时发生错误：${e}`);
      });
  }

  function addSession() {
    const newSessions = [
      { id: "loading...", title: "加载中...", isActive: true },
      ...sessions,
    ];
    setSessions(newSessions);
    // console.log("添加 session");
  }

  return [sessions, updateSessions, deleteSession, addSession];
}
