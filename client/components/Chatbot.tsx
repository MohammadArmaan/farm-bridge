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
import {
    BotMessageSquare,
    Send,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
} from "lucide-react";
import { useLocale } from "./locale-provider";

// Chat message type
interface ChatMessage {
    from: "user" | "farmfund";
    text: string;
}

export default function Chatbot() {
    const [prompt, setPrompt] = useState<string>("");
    const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isListening, setIsListening] = useState<boolean>(false);
    const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

    const router = useRouter();
    const { t, locale } = useLocale();

    // 🌐 Enhanced Speech-to-Text (STT) with better language support
    function startSpeechRecognition(callback: (text: string) => void) {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();

        // Enhanced language configuration
        if (locale === "hi") {
            recognition.lang = "hi-IN";
        } else if (locale === "kn") {
            recognition.lang = "kn-IN";
            try {
                recognition.lang = "kn-IN";
            } catch {
                recognition.lang = "kn"; // fallback if browser doesn’t support kn-IN
            }
        } else {
            recognition.lang = "en-IN";
        }

        // Better recognition settings for mixed language content
        recognition.interimResults = true; // Enable interim results for better accuracy
        recognition.maxAlternatives = 3; // Get more alternatives
        recognition.continuous = false;

        recognition.start();
        setIsListening(true);

        let finalTranscript = "";
        let interimTranscript = "";

        recognition.onresult = (event: any) => {
            interimTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Update the input field with interim results for better UX
            const fullTranscript = finalTranscript + interimTranscript;
            if (fullTranscript.trim()) {
                setPrompt(fullTranscript);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            if (finalTranscript.trim()) {
                callback(finalTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);

            // Try fallback with different language if the current one fails
            if (
                event.error === "language-not-supported" ||
                event.error === "no-speech"
            ) {
                // Fallback to English if regional language fails
                setTimeout(() => {
                    const fallbackRecognition = new SpeechRecognition();
                    fallbackRecognition.lang = "en-IN";
                    fallbackRecognition.interimResults = false;
                    fallbackRecognition.maxAlternatives = 1;

                    fallbackRecognition.start();
                    setIsListening(true);

                    fallbackRecognition.onresult = (fallbackEvent: any) => {
                        const transcript =
                            fallbackEvent.results[0][0].transcript;
                        callback(transcript);
                        setIsListening(false);
                    };

                    fallbackRecognition.onerror = () => setIsListening(false);
                    fallbackRecognition.onend = () => setIsListening(false);
                }, 500);
            }
        };
    }

    // 🔊 Enhanced Text-to-Speech (TTS) with better voice selection
    function speakText(text: string, index: number) {
        if (speakingIndex === index) {
            window.speechSynthesis.cancel();
            setSpeakingIndex(null);
            return;
        }

        window.speechSynthesis.cancel();
        setSpeakingIndex(index);

        // Clean text for better pronunciation
        // Clean text for better pronunciation (remove punctuation)
        const cleanText = text
            .replace(/<[^>]*>/g, "") // remove HTML tags
            .replace(/[.,!?;:]/g, "") // remove punctuation
            .replace(/\s+/g, " ") // normalize spaces
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);

        function setVoiceAndSpeak(voices: SpeechSynthesisVoice[]) {
            let selectedVoice: SpeechSynthesisVoice | null = null;

            if (locale === "hi") {
                // Look for Hindi voices with various patterns
                selectedVoice =
                    voices.find(
                        (v) =>
                            v.lang === "hi-IN" ||
                            v.lang === "hi" ||
                            v.name.toLowerCase().includes("hindi") ||
                            (v.name.toLowerCase().includes("india") &&
                                v.lang.startsWith("hi"))
                    ) || null;

                utterance.lang = "hi-IN";
            } else if (locale === "kn") {
                selectedVoice =
                    voices.find(
                        (v) =>
                            v.lang === "kn-IN" ||
                            v.lang === "kn" ||
                            v.name.toLowerCase().includes("kannada")
                    ) || null;

                utterance.lang = selectedVoice?.lang || "kn-IN";
            } else {
                // English voices - prefer Indian English
                selectedVoice =
                    voices.find(
                        (v) =>
                            v.lang === "en-IN" ||
                            (v.lang.startsWith("en") &&
                                v.name.toLowerCase().includes("india"))
                    ) ||
                    voices.find((v) => v.lang.startsWith("en")) ||
                    null;

                utterance.lang = "en-IN";
            }

            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log(
                    `Using voice: ${selectedVoice.name} (${selectedVoice.lang})`
                );
            } else {
                console.warn(`No suitable voice found for locale: ${locale}`);

                // Fallback strategy: use any available voice but set appropriate language
                const fallbackVoice =
                    voices.find((v) => v.lang.startsWith("en")) || voices[0];
                if (fallbackVoice) {
                    utterance.voice = fallbackVoice;
                }
            }

            // Error handling for speech synthesis
            utterance.onerror = (event) => {
                console.error("Speech synthesis error:", event);
                setSpeakingIndex(null);
            };

            try {
                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.error("Failed to speak:", error);
                setSpeakingIndex(null);
            }
        }

        // Wait for voices to load
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            setVoiceAndSpeak(voices);
        } else {
            // Wait for voices to be loaded
            let voiceLoadAttempts = 0;
            const maxAttempts = 10;

            const checkVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                voiceLoadAttempts++;

                if (availableVoices.length > 0) {
                    setVoiceAndSpeak(availableVoices);
                } else if (voiceLoadAttempts < maxAttempts) {
                    setTimeout(checkVoices, 100);
                } else {
                    console.error(
                        "Failed to load voices after multiple attempts"
                    );
                    setSpeakingIndex(null);
                }
            };

            window.speechSynthesis.onvoiceschanged = checkVoices;
            setTimeout(checkVoices, 100); // Also try after a short delay
        }

        utterance.onend = () => setSpeakingIndex(null);
        utterance.onstart = () => console.log("Speech started");
    }

    // Handle chat
    async function handleChat(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!prompt.trim()) return;

        // Add user's message
        setChatLog((prev) => [...prev, { from: "user", text: prompt }]);
        const userPrompt = prompt;
        setPrompt("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userPrompt, locale: locale }), // Send locale to backend
            });

            if (!res.ok) throw new Error("Failed to fetch chatbot response");

            const data: { response?: string; error?: string } =
                await res.json();

            setChatLog((prev) => [
                ...prev,
                {
                    from: "farmfund",
                    text: data.response || "Sorry, something went wrong.",
                },
            ]);
        } catch (err) {
            console.error("Chat error:", err);
            setChatLog((prev) => [
                ...prev,
                {
                    from: "farmfund",
                    text: "⚠️ Error: Unable to connect to FarmFund bot.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    // Enhanced voice input with better UX
    function handleVoiceInput() {
        startSpeechRecognition((text) => {
            setPrompt(text);
            // Auto-submit after a short delay to allow user to see the transcription
            setTimeout(() => {
                if (text.trim()) {
                    const syntheticEvent = {
                        preventDefault: () => {},
                        target: null,
                        currentTarget: null,
                    } as unknown as FormEvent<HTMLFormElement>;
                    handleChat(syntheticEvent);
                }
            }, 800);
        });
    }

    // SPA-friendly link clicks
    function handleLinkClick(e: MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLElement;
        if (
            target.tagName === "A" &&
            target.getAttribute("data-spa") === "true"
        ) {
            e.preventDefault();
            const href = target.getAttribute("href");
            if (href) {
                router.push(href);
                setIsModalOpen(false);
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
                        {t("chatbot.title")}
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                        {t("chatbot.subtitle")}
                    </DialogDescription>
                </DialogHeader>

                {/* Chat area */}
                <div
                    className="flex-1 overflow-y-auto px-4 py-2"
                    onClick={handleLinkClick}
                >
                    <div className="flex flex-col gap-4">
                        {chatLog.map((msg, index) =>
                            msg.from === "farmfund" ? (
                                <div
                                    key={index}
                                    className="relative self-start bg-muted text-foreground sm:max-w-[400px] max-w-[250px] px-4 py-2 rounded-md text-sm break-words"
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: msg.text,
                                        }}
                                    />
                                    <button
                                        onClick={() =>
                                            speakText(msg.text, index)
                                        }
                                        className="mt-1 flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
                                        title={
                                            speakingIndex === index
                                                ? "Stop speaking"
                                                : "Read aloud"
                                        }
                                    >
                                        {speakingIndex === index ? (
                                            <VolumeX size={18} />
                                        ) : (
                                            <Volume2 size={18} />
                                        )}
                                        <span className="text-xs">
                                            {speakingIndex === index
                                                ? "Stop"
                                                : "Speak"}
                                        </span>
                                    </button>
                                </div>
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
                                <span className="animate-pulse text-xl">
                                    ...
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input + mic */}
                <form
                    onSubmit={handleChat}
                    className="p-4 border-t flex items-center gap-2"
                >
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t("chatbot.placeholder")}
                        className="flex-1 rounded-full"
                    />
                    <Button type="submit" disabled={isLoading}>
                        <Send size={20} />
                    </Button>
                    <Button
                        type="button"
                        onClick={handleVoiceInput}
                        className={`transition-all ${
                            isListening
                                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={isLoading}
                        title={isListening ? "Listening..." : "Voice input"}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
