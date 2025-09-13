"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "./locale-provider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <Select value={locale} onValueChange={(val) => setLocale(val as any)}>
      <SelectTrigger className="w-[160px] bg-green-950 text-green-300 hover:bg-green-900 border-green-300 border-2 rounded-2xl shadow-md">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent className="bg-green-950 text-green-300 border-green-300 border-2 rounded-2xl shadow-lg">
        <SelectItem className="focus:bg-green-500" value="en">
          🌍 English
        </SelectItem>
        <SelectItem className="focus:bg-green-500" value="hi">
          🇮🇳 Hindi
        </SelectItem>
        <SelectItem className="focus:bg-green-500" value="kn">
          🌿 Kannada
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
