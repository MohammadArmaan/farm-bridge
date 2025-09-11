"use client";

import { useState, FormEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BotMessageSquare, Send } from "lucide-react";

// Define chat message type
interface ChatMessage {
  from: "user" | "farmfund";
  text: string;
}

export default function Chatbot() {
  const [prompt, setPrompt] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleChat(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user's message first
    setChatLog((prev) => [...prev, { from: "user", text: prompt }]);
    setPrompt(""); // clear input
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch chatbot response");
      }

      const data: { response?: string; error?: string } = await res.json();

      // Add FarmFund bot's response
      setChatLog((prev) => [
        ...prev,
        { from: "farmfund", text: data.response || "Sorry, something went wrong." },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatLog((prev) => [
        ...prev,
        { from: "farmfund", text: "⚠️ Error: Unable to connect to FarmFund bot." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle SPA-friendly link clicks
  function handleLinkClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.tagName === "A" && target.getAttribute("data-spa") === "true") {
      e.preventDefault();
      const href = target.getAttribute("href");
      if (href) {
        router.push(href);
        setIsModalOpen(false); // optional: close chatbot after navigating
      }
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger>
        <div className="p-5 rounded-full bg-primary text-white cursor-pointer fixed right-10 bottom-20 z-50 hover:scale-105 transition-all">
          <BotMessageSquare className="text-4xl" />
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 max-w-lg w-[95vw] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg text-center">
            FarmFund ChatBot 🤖
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Ask about Blockchain, Ethereum, or FarmFund routes
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable chat area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-2"
          onClick={handleLinkClick}
        >
          <div className="flex flex-col gap-4">
            {chatLog.map((msg, index) =>
              msg.from === "farmfund" ? (
                <div
                  key={index}
                  className="self-start bg-muted text-foreground sm:max-w-[400px] max-w-[250px] px-4 py-2 rounded-md text-sm break-words [&_a]:text-primary [&_a:hover]:underline"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ) : (
                <div
                  key={index}
                  className="self-end bg-primary text-white max-w-full px-4 py-2 rounded-md text-sm break-words"
                >
                  {msg.text}
                </div>
              )
            )}
            {isLoading && (
              <div className="self-start bg-muted text-foreground max-w-fit px-4 py-2 rounded-md text-sm">
                <span className="animate-pulse text-xl">...</span>
              </div>
            )}
          </div>
        </div>

        {/* Input stays fixed at bottom */}
        <form onSubmit={handleChat} className="p-4 border-t flex items-center gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask about FarmFund..."
            className="flex-1 rounded-full focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
          />
          <Button type="submit" disabled={isLoading}>
            <Send size={20} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
