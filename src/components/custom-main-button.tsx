"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface CustomMainButtonProps {
  text: string
  onClick?: () => void
}

export function CustomMainButton({ text, onClick }: CustomMainButtonProps) {
  // This would integrate with Telegram's WebApp API in a real implementation
  // For now, we'll create a styled button that looks like Telegram's main button

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6"
        onClick={onClick}
      >
        <Plus className="h-5 w-5 mr-2" />
        {text}
      </Button>
    </div>
  )
}

