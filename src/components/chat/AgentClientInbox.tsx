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
import { Loader2, MessageSquare, RefreshCw, SendHorizontal, Users } from "lucide-react";

interface AgentClientInboxProps {
  className?: string;
}

const FRIENDLY_INBOX_ERRORS = {
  loadInbox: "Could not load the inbox right now. Please refresh or try again shortly.",
  loadConversation:
    "Could not load this conversation right now. Please try again shortly.",
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
  if (!value) return "U";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
};

const AgentClientInbox = ({ className }: AgentClientInboxProps) => {
  const { user } = useAuth();
  const canAccessInbox = user?.role === "agent" || user?.role === "admin";
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
    } catch (_error) {
      setError(FRIENDLY_INBOX_ERRORS.loadInbox);
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
    } catch (_error) {
      setError(FRIENDLY_INBOX_ERRORS.loadConversation);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!canAccessInbox) {
      setIsLoading(false);
      return;
    }
    loadConversations();
  }, [canAccessInbox]);

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
    if (!canAccessInbox) return;

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
  }, [canAccessInbox, user?.id, selectedUserId]);

  useEffect(() => {
    if (!canAccessInbox) return;

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
  }, [canAccessInbox]);

  useEffect(() => {
    if (!canAccessInbox) return;

    return socketClient.onTyping(({ fromUserId, isTyping }: TypingEvent) => {
      setTypingByUserId((prev) => ({ ...prev, [fromUserId]: isTyping }));
    });
  }, [canAccessInbox]);

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
    } catch (_error) {
      setError(FRIENDLY_INBOX_ERRORS.send);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className={cn("border-primary/20 bg-background", className)}>
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
        <div className="rounded-2xl border border-border/70 bg-card">
          <div className="px-4 py-3 border-b text-sm font-semibold">Assigned Users</div>
          <div className="max-h-[480px] overflow-y-auto">
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
                    "w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors",
                    selectedUserId === conversation.user._id && "bg-primary/10",
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

        <div className="lg:col-span-2 rounded-3xl border border-primary/20 overflow-hidden bg-[#eaf0ff] dark:bg-slate-900">
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-[#dfe6fb] dark:bg-slate-800/80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                {getInitials(selectedConversation?.user.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {selectedConversation ? selectedConversation.user.name : "Select a user"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedConversation?.user.email || "Choose a conversation to start messaging."}
                </p>
              </div>
            </div>
            {selectedUserId ? (
              <Badge variant={presenceByUserId[selectedUserId] ? "default" : "secondary"}>
                {presenceByUserId[selectedUserId] ? "Online" : "Offline"}
              </Badge>
            ) : null}
          </div>

          <div className="h-[360px] md:h-[420px] overflow-y-auto px-3 py-4 space-y-3">
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

            {selectedUserId && typingByUserId[selectedUserId] ? (
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
                <p className="text-xs text-muted-foreground">User is typing...</p>
              </div>
            ) : null}
          </div>

          <div className="border-t border-primary/20 bg-[#dfe6fb] dark:bg-slate-800/80 px-3 py-3 space-y-2">
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex items-end gap-2">
              <Textarea
                rows={2}
                value={draft}
                onChange={(e) => handleDraftChange(e.target.value)}
                placeholder="Type a reply..."
                disabled={!selectedUserId || isSending}
                className="min-h-[44px] resize-none bg-background/95"
              />
              <Button
                onClick={handleSend}
                disabled={!selectedUserId || !draft.trim() || isSending}
                className="h-10 shrink-0"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentClientInbox;
