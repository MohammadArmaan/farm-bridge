import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/Chatbot";
import { LocaleProvider } from "@/components/locale-provider";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600"], // choose the weights you need
});

export const metadata: Metadata = {
    title: "FarmFund - Transparent Aid Distribution",
    description: "A transparent aid distribution system for small farmers",
    generator: "v0.dev",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={poppins.className}>
                <LocaleProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="flex min-h-screen flex-col">
                            <Navbar />
                            <main className="flex-1">
                                {children}
                                <Chatbot />
                            </main>
                            <Footer />
                        </div>
                    </ThemeProvider>
                </LocaleProvider>
            </body>
        </html>
    );
}
