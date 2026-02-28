import { useState, useCallback } from "react";

interface Message {
  text: string;
  isUser: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey! I'm Jacob's AI assistant. Ask me anything about his work!",
      isUser: false,
    },
    { text: "What are you working on right now?", isUser: true },
    {
      text: "I'm currently building this portfolio using Next.js and the Gemini API. It features a custom card-style interface with real-time AI chat integration.",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const handleSubmit = useCallback(
    async (message?: string) => {
      const userMessage = message || inputValue.trim();
      if (!userMessage) return;

      // Add user message immediately
      setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
      if (!message) setInputValue("");
      setIsLoading(true);
      setStreamingText("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMessage }),
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                // Finalize the message
                setMessages((prev) => [
                  ...prev,
                  { text: fullText, isUser: false },
                ]);
                setStreamingText("");
              } else {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.text) {
                    fullText += parsed.text;
                    setStreamingText(fullText);
                  }
                } catch {
                  // Ignore parse errors for partial chunks
                }
              }
            }
          }
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, something went wrong. Please try again.",
            isUser: false,
          },
        ]);
        setStreamingText("");
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue],
  );

  const handleBubbleClick = useCallback(
    (message: string) => {
      handleSubmit(message);
    },
    [handleSubmit],
  );

  const handleClearChat = useCallback(() => {
    setMessages([
      {
        text: "Hey! I'm Jacob's AI assistant. Ask me anything about his work!",
        isUser: false,
      },
    ]);
    setInputValue("");
    setStreamingText("");
  }, []);

  return {
    messages,
    inputValue,
    isLoading,
    streamingText,
    setInputValue,
    handleSubmit,
    handleBubbleClick,
    handleClearChat,
  };
}
