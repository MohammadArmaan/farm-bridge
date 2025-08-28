"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import {
  connectWallet,
  isWalletConnected,
  getCurrentAccount,
  isAccountOwner,
} from "@/lib/blockchain"
import { useToast } from "@/hooks/use-toast"
import { Wallet, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface WalletConnectProps {
  onConnect?: (address: string) => void
  onDisconnect?: () => void
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function WalletConnect({
  onConnect,
  onDisconnect,
  variant = "default",
  size = "default",
  className,
}: WalletConnectProps) {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const hasDisconnected =
          localStorage.getItem("disconnected") === "true"
        if (hasDisconnected) return

        const connected = await isWalletConnected()
        if (connected) {
          const account = getCurrentAccount()
          if (account) {
            setAddress(account)
            setIsOwner(isAccountOwner())
            await fetchBalance(account)
            localStorage.setItem("connectedAccount", account)
            if (onConnect) onConnect(account)
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkConnection()
  }, [onConnect])

  const fetchBalance = async (account: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const bal = await provider.getBalance(account)
      const formatted = parseFloat(ethers.formatEther(bal)).toFixed(4)
      setBalance(formatted)
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const account = await connectWallet()
      if (account) {
        setAddress(account)
        setIsOwner(isAccountOwner())
        await fetchBalance(account)
        localStorage.setItem("connectedAccount", account)
        localStorage.setItem("disconnected", "false")
      }
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      })
      if (onConnect && account) onConnect(account)
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description:
          error.message ||
          "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAddress(null)
    setBalance(null)
    setIsOwner(false)
    localStorage.removeItem("connectedAccount")
    localStorage.setItem("disconnected", "true")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected from this app.",
    })

    if (onDisconnect) onDisconnect()
  }

  const formatShortAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`

  return (
    <div>
      {!address ? (
        <Button
          onClick={handleConnect}
          variant={variant}
          size={size}
          className={className}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect
            </>
          )}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`${className} flex items-center gap-2`}
            >
              <Wallet className="h-4 w-4" />
              {formatShortAddress(address)}
              {isOwner && (
                <Badge className="ml-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Owner
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Wallet Details</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {balance && (
              <DropdownMenuItem disabled>
                Balance: {balance} ETH
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
