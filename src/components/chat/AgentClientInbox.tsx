import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  messageService,
  type AgentConversationItem,
  type DirectMessage,
} from "@/services/messageService";
import {
  socketClient,
  type NewMessageEvent,
  type PresenceSnapshotEvent,
  type PresenceState,
  type TypingEvent,
} from "@/services/socketClient";
import { Loader2, MessageSquare, RefreshCw, Users } from "lucide-react";

interface AgentClientInboxProps {
  className?: string;
}

const formatTimestamp = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const AgentClientInbox = ({ className }: AgentClientInboxProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<AgentConversationItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presenceByUserId, setPresenceByUserId] = useState<Record<string, boolean>>({});
  const [typingByUserId, setTypingByUserId] = useState<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTargetRef = useRef<string | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.user._id === selectedUserId) || null,
    [conversations, selectedUserId],
  );

  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await messageService.getAgentConversations();
      setConversations(data.conversations);
      if (!selectedUserId && data.conversations.length > 0) {
        setSelectedUserId(data.conversations[0].user._id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load inbox");
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversationMessages = async (userId: string) => {
    setIsLoadingMessages(true);
    setError(null);
    try {
      const data = await messageService.getAgentConversation(userId);
      setMessages(data.messages);
      setConversations((prev) =>
        prev.map((item) =>
          item.user._id === userId
            ? { ...item, unreadCount: 0, lastMessage: data.messages[data.messages.length - 1] || null }
            : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load conversation");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "agent") return;
    loadConversations();
  }, [user?.role]);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }
    loadConversationMessages(selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    if (conversations.length === 0) return;
    socketClient.watchPresence(conversations.map((row) => row.user._id));
  }, [conversations]);

  useEffect(() => {
    if (user?.role !== "agent") return;

    return socketClient.onNewMessage(({ message }: NewMessageEvent) => {
      const currentUserId = user.id;
      const isMine = message.senderId === currentUserId || message.recipientId === currentUserId;
      if (!isMine) return;

      const participantId =
        message.senderId === currentUserId ? message.recipientId : message.senderId;
      setTypingByUserId((prev) => ({ ...prev, [participantId]: false }));

      setConversations((prev) =>
        prev.map((item) => {
          if (item.user._id !== participantId) {
            return item;
          }

          const shouldIncrementUnread =
            message.senderId !== currentUserId && selectedUserId !== participantId;

          return {
            ...item,
            lastMessage: message,
            unreadCount: shouldIncrementUnread ? item.unreadCount + 1 : item.unreadCount,
          };
        }),
      );

      if (selectedUserId === participantId) {
        setMessages((prev) =>
          prev.some((existing) => existing._id === message._id)
            ? prev
            : [...prev, message],
        );
      }
    });
  }, [user?.role, user?.id, selectedUserId]);

  useEffect(() => {
    if (user?.role !== "agent") return;

    const applyPresenceState = (state: PresenceState) => {
      setPresenceByUserId((prev) => ({ ...prev, [state.userId]: state.online }));
    };

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
  }, [user?.role]);

  useEffect(() => {
    if (user?.role !== "agent") return;

    return socketClient.onTyping(({ fromUserId, isTyping }: TypingEvent) => {
      setTypingByUserId((prev) => ({ ...prev, [fromUserId]: isTyping }));
    });
  }, [user?.role]);

  const stopTyping = (targetId?: string | null) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    const destinationId = targetId || typingTargetRef.current;
    if (!destinationId) return;

    if (typingTargetRef.current === destinationId) {
      socketClient.emitTyping(destinationId, false);
      typingTargetRef.current = null;
    }
  };

  useEffect(
    () => () => {
      stopTyping(typingTargetRef.current);
    },
    [],
  );

  useEffect(
    () => () => {
      stopTyping(selectedUserId);
    },
    [selectedUserId],
  );

  const handleDraftChange = (value: string) => {
    setDraft(value);

    if (!selectedUserId) return;

    if (!value.trim()) {
      stopTyping(selectedUserId);
      return;
    }

    if (typingTargetRef.current !== selectedUserId) {
      if (typingTargetRef.current) {
        socketClient.emitTyping(typingTargetRef.current, false);
      }
      socketClient.emitTyping(selectedUserId, true);
      typingTargetRef.current = selectedUserId;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedUserId);
    }, 1200);
  };

  const handleSend = async () => {
    if (!selectedUserId || !draft.trim()) return;
    setIsSending(true);
    setError(null);
    stopTyping(selectedUserId);
    try {
      const sent = await messageService.sendMessage(selectedUserId, draft.trim());
      setMessages((prev) => [...prev, sent.message]);
      setDraft("");
      setConversations((prev) =>
        prev.map((item) =>
          item.user._id === selectedUserId
            ? { ...item, lastMessage: sent.message }
            : item,
        ),
      );
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
            <Users className="w-5 h-5 text-primary" />
            Client Messages
          </CardTitle>
          <CardDescription>Direct communication with your assigned users.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={loadConversations} disabled={isLoading}>
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-md border">
          <div className="p-3 border-b text-sm font-medium">Assigned Users</div>
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </div>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No assigned users found.
              </p>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.user._id}
                  type="button"
                  onClick={() => setSelectedUserId(conversation.user._id)}
                  className={cn(
                    "w-full text-left p-3 border-b last:border-b-0 hover:bg-muted/30",
                    selectedUserId === conversation.user._id && "bg-muted/40",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          "inline-block w-2 h-2 rounded-full flex-shrink-0",
                          presenceByUserId[conversation.user._id] ? "bg-emerald-500" : "bg-muted-foreground/40",
                        )}
                      />
                      <p className="text-sm font-medium truncate">{conversation.user.name}</p>
                    </div>
                    {conversation.unreadCount > 0 ? (
                      <Badge variant="secondary">{conversation.unreadCount}</Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conversation.user.email}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {typingByUserId[conversation.user._id]
                      ? "Typing..."
                      : conversation.lastMessage?.content || "No messages yet"}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-md border p-3 space-y-3">
          <div className="border-b pb-2">
            <p className="text-sm font-medium">
              {selectedConversation ? selectedConversation.user.name : "Select a user"}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedConversation?.user.email || "Choose a conversation to start messaging."}
            </p>
            {selectedUserId ? (
              <p className="text-xs text-muted-foreground mt-1">
                {typingByUserId[selectedUserId]
                  ? "User is typing..."
                  : presenceByUserId[selectedUserId]
                    ? "Online"
                    : "Offline"}
              </p>
            ) : null}
          </div>

          <div className="h-64 overflow-y-auto space-y-2">
            {!selectedUserId ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4 mr-2" />
                Pick a user from the list.
              </div>
            ) : isLoadingMessages ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading conversation...
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
                          : "bg-muted/40 border",
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

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Textarea
            rows={3}
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value)}
            placeholder="Type a reply..."
            disabled={!selectedUserId || isSending}
          />
          <div className="flex justify-end">
            <Button onClick={handleSend} disabled={!selectedUserId || !draft.trim() || isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentClientInbox;
