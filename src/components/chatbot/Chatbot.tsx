import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useChatbot } from "@/contexts/ChatbotContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Phone,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Chatbot = () => {
  const {
    isOpen,
    messages,
    isTyping,
    openChat,
    closeChat,
    sendMessage,
    selectOption,
  } = useChatbot();
  const { user, openSignUp } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOptionClick = (option: string) => {
    if (option === "Sign up now" || option === "Get free analysis") {
      openSignUp();
    } else if (
      option === "Schedule a free consultation" ||
      option === "Schedule consultation"
    ) {
      // In a real app, this would open a calendar booking widget
      selectOption("I'd like to schedule a consultation");
    } else if (option === "Call us now") {
      // In a real app, this could initiate a call or show phone number
      selectOption("I'd like to speak with someone by phone");
    } else {
      selectOption(option);
    }
  };

  const formatMessage = (message: string) => {
    return message.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < message.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={openChat}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 z-[60]"
          size="icon"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[24rem] md:w-[26rem] h-[min(78dvh,32rem)] sm:h-[min(80dvh,34rem)] shadow-2xl border-2 border-border/50 z-[60] flex flex-col">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-primary to-accent text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Assistant" />
                <AvatarFallback className="bg-white/20 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium text-white">
                  CreditFix Pro Assistant
                </CardTitle>
                <p className="text-xs text-white/80">
                  Online • Typically replies instantly
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeChat}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 min-h-0 p-0">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.type === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.type === "bot" && (
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className="bg-primary/10">
                          <Bot className="h-3 w-3 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[78%] sm:max-w-[280px] rounded-lg px-3 py-2 text-sm",
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted",
                      )}
                    >
                      <div className="whitespace-pre-wrap">
                        {formatMessage(message.message)}
                      </div>

                      {/* Quick Reply Options */}
                      {message.type === "bot" && message.options && (
                        <div className="mt-3 space-y-2">
                          {message.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start h-auto py-2 px-3 text-xs hover:bg-primary/10"
                              onClick={() => handleOptionClick(option)}
                            >
                              {option === "Schedule a free consultation" && (
                                <Calendar className="h-3 w-3 mr-2" />
                              )}
                              {option === "Call us now" && (
                                <Phone className="h-3 w-3 mr-2" />
                              )}
                              {(option === "Sign up now" ||
                                option === "Get free analysis") && (
                                <ExternalLink className="h-3 w-3 mr-2" />
                              )}
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    {message.type === "user" && (
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className="bg-accent/10">
                          <User className="h-3 w-3 text-accent" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <Avatar className="h-6 w-6 mt-1">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-3 w-3 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t">
            {user && (
              <div className="mb-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  Signed in as {user.name}
                </Badge>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by CreditFix Pro AI
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
