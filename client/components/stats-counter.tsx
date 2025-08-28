"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCounterProps {
    title: string;
    value: number;
    prefix?: string;
    suffix?: string;
    icon?: React.ReactNode;
}

export default function StatsCounter({
    title,
    value,
    prefix = "",
    suffix = "",
    icon,
}: StatsCounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000; // ms
        const steps = 20;
        const stepValue = value / steps;
        const stepTime = duration / steps;

        let current = 0;
        const timer = setInterval(() => {
            current += stepValue;
            if (current > value) {
                current = value;
                clearInterval(timer);
            }
            setCount(Math.floor(current));
        }, stepTime);

        return () => clearInterval(timer);
    }, [value]);

    const formattedValue = new Intl.NumberFormat().format(count);

    return (
        <Card className="border-none shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-600">
                        {title}
                    </h3>
                    {icon}
                </div>
                <p
                    className={cn(
                        "text-3xl font-bold",
                        icon?.props?.className?.includes("text-green")
                            ? "text-green-900"
                            : icon?.props?.className?.includes("text-pink")
                            ? "text-pink-900"
                            : "text-yellow-900"
                    )}
                >
                    {prefix}
                    {formattedValue}
                    {suffix}
                </p>
            </CardContent>
        </Card>
    );
}
