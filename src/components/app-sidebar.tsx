import { Home, Clock9, ChevronDown, Trash2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@/components/ui/collapsible";

import type { Session } from "@/hooks/useSession";

import { useNavigate, Link } from "react-router";

export function AppSidebar({
  sessions,
  deleteSession,
  currentSessionId,
  getMessages,
  clearMessages,
  setCurrentSessionId,
}: {
  sessions: Session[];
  deleteSession: (sessionId: string) => void;
  currentSessionId: string | null;
  getMessages: (sessionId: string) => void;
  clearMessages: () => void;
  setCurrentSessionId: (sessionId: string | null) => void;
}) {
  const items = sessions.map((session) => ({
    title: session.title,
    url: `/chat/${session.id}`,
    id: session.id,
    isActive: session.id === currentSessionId,
  }));

  const navigate = useNavigate();
  function handleDelete(sessionId: string) {
    if (sessionId === currentSessionId) {
      clearMessages();
      deleteSession(sessionId);
      setCurrentSessionId(null);
      navigate("/");
    } else {
      deleteSession(sessionId);
    }
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="text-2xl font-bold">AI 跑团</SidebarHeader>
      <SidebarContent className="h-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="home">
                <SidebarMenuButton
                  asChild
                  onClick={() => {
                    clearMessages();
                    setCurrentSessionId(null);
                  }}
                >
                  <Link to="/">
                    <Home size={24} className="size-[24px]" />
                    <span className="text-xl">创建新剧本</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <Clock9 size={24} className="size-[24px] mr-2" />
                <span className="text-base">历史记录</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        onClick={() => {
                          getMessages(item.id);
                        }}
                      >
                        <Link to={item.url}>
                          <span className="text-base">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 color="red" />
                        <span className="sr-only">Add Project</span>
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
