"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    isWalletConnected,
    getCurrentAccount,
    isAccountOwner,
    isDonorRegistered,
    isFarmerRegistered,
} from "@/lib/blockchain";
import WalletConnect from "@/components/wallet-connect";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { MobileThemeToggler } from "./MobileThemeToggler";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isDonor, setIsDonor] = useState(false);
    const [isFarmer, setIsFarmer] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkWallet = async () => {
            const connected = await isWalletConnected();
            if (connected) {
                const account = getCurrentAccount();
                if (account) {
                    setAddress(account);
                    setIsOwner(isAccountOwner());

                    // ✅ Check registration roles
                    const donor = await isDonorRegistered(account);
                    const farmer = await isFarmerRegistered(account);
                    setIsDonor(donor);
                    setIsFarmer(farmer);
                }
            }
        };
        checkWallet();
    }, []);

    // Build routes dynamically
    const routes = [
        { name: "Home", path: "/" },
        { name: "Farmers", path: "/farmers" },
        { name: "Donors", path: "/donors" },
        ...(isFarmer
            ? [{ name: "Request Aid", path: "/aid" }]
            : isDonor
            ? []
            : [{ name: "Request Aid", path: "/aid" }]), // default if not registered
        { name: "All Requests", path: "/AllAids" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "About", path: "/about" },
        ...(isOwner ? [{ name: "Admin", path: "/verification" }] : []),
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-black/20 bg-white/70 dark:bg-black/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/70 shadow-sm">
            <div className="container flex h-16 items-center justify-between">
                {/* Left Side - Logo & Mobile Menu */}
                <div className="flex items-center gap-2">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mr-2"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-[300px] sm:w-[400px] p-0" // remove padding so scroll feels natural
                        >
                            <div className="h-full overflow-y-auto px-6 py-8 flex flex-col items-center gap-4">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    height={100}
                                    width={100}
                                />

                                {routes.map((route) => (
                                    <Link
                                        key={route.path}
                                        href={route.path}
                                        className={cn(
                                            "text-lg dark:text-white/95 font-medium transition-colors hover:text-green-600",
                                            isActive(route.path)
                                                ? "text-green-500"
                                                : "text-foreground/90"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {route.name}
                                    </Link>
                                ))}

                                <MobileThemeToggler />

                                <WalletConnect
                                    variant="outline"
                                    onConnect={async (addr) => {
                                        setAddress(addr);
                                        setIsOwner(isAccountOwner());
                                        const donor = await isDonorRegistered(
                                            addr
                                        );
                                        const farmer = await isFarmerRegistered(
                                            addr
                                        );
                                        setIsDonor(donor);
                                        setIsFarmer(farmer);
                                    }}
                                    onDisconnect={() => {
                                        setAddress(null);
                                        setIsOwner(false);
                                        setIsDonor(false);
                                        setIsFarmer(false);
                                    }}
                                />

                                {!isDonor && !isFarmer && (
                                    <div className="mt-4 space-y-2 w-full">
                                        <Button
                                            asChild
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            <Link href="/register">
                                                Register
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl bg-gradient-to-r text-green-500 bg-clip-text">
                            FarmFund
                        </span>
                        <span className="text-xs font-semibold text-white bg-green-600 px-2 py-0.5 rounded-full shadow-sm">
                            Beta
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6">
                    {routes.map((route) => (
                        <Link
                            key={route.path}
                            href={route.path}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-green-600",
                                isActive(route.path)
                                    ? "text-green-500"
                                    : "text-foreground/90"
                            )}
                        >
                            {route.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Side - Wallet + Register */}
                <div className="flex items-center gap-2">
                    <div className="hidden lg:flex items-center gap-2">
                        <ThemeToggle />
                        <WalletConnect
                            variant="outline"
                            onConnect={async (addr) => {
                                setAddress(addr);
                                setIsOwner(isAccountOwner());

                                // re-check roles after login
                                const donor = await isDonorRegistered(addr);
                                const farmer = await isFarmerRegistered(addr);
                                setIsDonor(donor);
                                setIsFarmer(farmer);
                            }}
                            onDisconnect={() => {
                                setAddress(null);
                                setIsOwner(false);
                                setIsDonor(false);
                                setIsFarmer(false);
                            }}
                        />

                        {/* Only show Register if not registered */}
                        {!isDonor && !isFarmer && (
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                asChild
                            >
                                <Link href="/register">Register</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

// Add window ethereum type declaration
declare global {
    interface Window {
        ethereum: any;
    }
}
