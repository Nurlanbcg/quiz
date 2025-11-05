"use client"

import { useQuiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header() {
  const { currentUser, logout } = useQuiz()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">İmtahan Platforması</h1>
          {currentUser && (
            <span className="text-sm text-muted-foreground">
              ({currentUser.fullName} - {currentUser.role === "admin" ? "Admin" : "Tələbə"})
            </span>
          )}
        </div>
        {currentUser && (
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Çıxış
          </Button>
        )}
      </div>
    </header>
  )
}
