"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileThemeToggler() {
    const { setTheme, theme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <span>Change Theme:</span>

                    <span className="capitalize flex items-center gap-2">
                        {theme}{" "}
                        {theme === "light" ? (
                            <Sun className="h-[1.2rem] w-[1.2rem]" />
                        ) : (
                            <Moon className="h-[1.2rem] w-[1.2rem]" />
                        )}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
