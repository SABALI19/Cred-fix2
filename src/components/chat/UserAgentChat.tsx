import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { messageService, type DirectMessage } from "@/services/messageService";
import {
  socketClient,
  type NewMessageEvent,
  type PresenceState,
  type PresenceSnapshotEvent,
  type TypingEvent,
} from "@/services/socketClient";
import { Loader2, MessageCircle, RefreshCw, SendHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserAgentChatProps {
  className?: string;
}

const FRIENDLY_CHAT_ERRORS = {
  load: "Could not load your chat right now. Please refresh or try again shortly.",
  send: "Could not send your message right now. Please try again.",
};

const formatTimestamp = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const getInitials = (value?: string) => {
  if (!value) return "AG";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
};

const UserAgentChat = ({ className }: UserAgentChatProps) => {
  const { user } = useAuth();
  const [agent, setAgent] = useState<{ _id: string; name: string; email: string } | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isAgentOnline, setIsAgentOnline] = useState<boolean | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingSentRef = useRef(false);

  const loadConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await messageService.getUserAssignedAgentConversation();
      setAgent(data.agent);
      setMessages(data.messages);
    } catch (_error) {
      setError(FRIENDLY_CHAT_ERRORS.load);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "user") return;
    loadConversation();
  }, [user?.role]);

  useEffect(() => {
    if (!agent) {
      setIsAgentOnline(null);
      setIsAgentTyping(false);
    }
  }, [agent]);

  useEffect(() => {
    if (user?.role !== "user") return;

    return socketClient.onNewMessage(({ message }: NewMessageEvent) => {
      const currentUserId = user.id;
      const currentAgentId = agent?._id || user.assignedAgentId || null;

      if (!currentAgentId) return;

      const isCurrentConversation =
        (message.senderId === currentUserId && message.recipientId === currentAgentId) ||
        (message.senderId === currentAgentId && message.recipientId === currentUserId);

      if (!isCurrentConversation) return;
      if (message.senderId === currentAgentId) {
        setIsAgentTyping(false);
      }

      setMessages((prev) =>
        prev.some((existing) => existing._id === message._id)
          ? prev
          : [...prev, message],
      );
    });
  }, [user?.role, user?.id, user?.assignedAgentId, agent?._id]);

  useEffect(() => {
    if (user?.role !== "user" || !agent?._id) return;

    const applyPresenceState = (state: PresenceState) => {
      if (state.userId === agent._id) {
        setIsAgentOnline(state.online);
      }
    };

    socketClient.watchPresence([agent._id]);

    const offSnapshot = socketClient.onPresenceSnapshot(
      ({ users }: PresenceSnapshotEvent) => {
        for (const state of users) {
          applyPresenceState(state);
        }
      },
    );
    const offUpdate = socketClient.onPresenceUpdate(applyPresenceState);

    return () => {
      offSnapshot();
      offUpdate();
    };
  }, [user?.role, agent?._id]);

  useEffect(() => {
    if (user?.role !== "user" || !agent?._id) return;

    return socketClient.onTyping(({ fromUserId, isTyping }: TypingEvent) => {
      if (fromUserId === agent._id) {
        setIsAgentTyping(isTyping);
      }
    });
  }, [user?.role, agent?._id]);

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (agent?._id && isTypingSentRef.current) {
        socketClient.emitTyping(agent._id, false);
      }
    },
    [agent?._id],
  );

  const stopTyping = (targetAgentId?: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    const destinationId = targetAgentId || agent?._id;
    if (destinationId && isTypingSentRef.current) {
      socketClient.emitTyping(destinationId, false);
      isTypingSentRef.current = false;
    }
  };

  const handleDraftChange = (value: string) => {
    setDraft(value);

    if (!agent?._id) return;

    if (!value.trim()) {
      stopTyping(agent._id);
      return;
    }

    if (!isTypingSentRef.current) {
      socketClient.emitTyping(agent._id, true);
      isTypingSentRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(agent._id);
    }, 1200);
  };

  const handleSend = async () => {
    if (!agent || !draft.trim()) return;
    setIsSending(true);
    setError(null);
    stopTyping(agent._id);
    try {
      const sent = await messageService.sendMessage(agent._id, draft.trim());
      setMessages((prev) => [...prev, sent.message]);
      setDraft("");
    } catch (_error) {
      setError(FRIENDLY_CHAT_ERRORS.send);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className={cn("border-primary/20 bg-background", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Message Your Agent
          </CardTitle>
          <CardDescription>
            Direct chat with your selected specialist.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={loadConversation} disabled={isLoading}>
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {!agent && !isLoading ? (
          <div className="text-sm text-muted-foreground">
            You have not selected an agent yet.{" "}
            <Link to="/#agents-list" className="text-primary underline">
              Choose one from the agents list
            </Link>
            .
          </div>
        ) : null}

        {agent ? (
          <div className="flex items-center justify-between text-sm rounded-xl border p-3 bg-muted/20">
            <div>
              <p className="font-medium">{agent.name}</p>
              <p className="text-muted-foreground">{agent.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Assigned Agent</Badge>
              <Badge variant={isAgentOnline ? "default" : "outline"}>
                {isAgentOnline === null ? "Status..." : isAgentOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl border border-primary/20 overflow-hidden bg-[#eaf0ff] dark:bg-slate-900">
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-[#dfe6fb] dark:bg-slate-800/80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                {getInitials(agent?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{agent?.name || "No agent selected"}</p>
                <p className="text-xs text-muted-foreground truncate">{agent?.email || ""}</p>
              </div>
            </div>
            <Badge variant={isAgentOnline ? "default" : "secondary"}>
              {isAgentOnline === null ? "Status..." : isAgentOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          <div className="h-[340px] md:h-[420px] overflow-y-auto px-3 py-4 space-y-3">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No messages yet.
              </div>
            ) : (
              messages.map((message) => {
                const isMine = message.senderId === user?.id;
                return (
                  <div
                    key={message._id}
                    className={cn("flex", isMine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[84%] rounded-2xl px-3 py-2.5 text-sm shadow-sm",
                        isMine
                          ? "bg-primary text-primary-foreground rounded-tr-md"
                          : "bg-background/95 border border-border/60 rounded-tl-md",
                      )}
                    >
                      <div className="flex items-end gap-2">
                        <p className="break-words leading-relaxed">{message.content}</p>
                        <p
                          className={cn(
                            "text-[10px] shrink-0",
                            isMine ? "text-primary-foreground/80" : "text-muted-foreground",
                          )}
                        >
                          {formatTimestamp(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isAgentTyping ? (
              <div className="flex items-center gap-2">
                <div className="rounded-2xl bg-background border border-border/70 px-3 py-2 inline-flex items-center gap-1">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "240ms" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Your agent is typing...</p>
              </div>
            ) : null}
          </div>

          <div className="border-t border-primary/20 bg-[#dfe6fb] dark:bg-slate-800/80 px-3 py-3 space-y-2">
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Type a message to your agent..."
                value={draft}
                onChange={(e) => handleDraftChange(e.target.value)}
                disabled={!agent || isSending}
                rows={2}
                className="min-h-[44px] resize-none bg-background/95"
              />
              <Button onClick={handleSend} disabled={!agent || !draft.trim() || isSending} className="h-10 shrink-0">
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAgentChat;
