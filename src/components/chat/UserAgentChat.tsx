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
import { Loader2, MessageCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserAgentChatProps {
  className?: string;
}

const formatTimestamp = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load messages");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className={className}>
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
            <Link to="/profile" className="text-primary underline">
              Choose one in profile settings
            </Link>
            .
          </div>
        ) : null}

        {agent ? (
          <div className="flex items-center justify-between text-sm rounded-md border p-3 bg-muted/20">
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

        <div className="h-72 overflow-y-auto rounded-md border p-3 space-y-3 bg-muted/10">
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
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      isMine
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border",
                    )}
                  >
                    <p>{message.content}</p>
                    <p
                      className={cn(
                        "mt-1 text-[11px]",
                        isMine ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      {formatTimestamp(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-2">
          {isAgentTyping ? (
            <p className="text-xs text-muted-foreground">Your agent is typing...</p>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Textarea
            placeholder="Type a message to your agent..."
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value)}
            disabled={!agent || isSending}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleSend} disabled={!agent || !draft.trim() || isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAgentChat;
