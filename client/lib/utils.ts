import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return `${amount} ETH`
}

export function formatAddress(address: string): string {
  if (!address) return ""

  // If already shortened, return as is
  if (address.includes("...")) return address

  // Otherwise, shorten it
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}
