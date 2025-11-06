"use client"

import { useQuiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { LogOut, LogIn, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function Header() {
  const { currentUser, logout } = useQuiz()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            İmtahan Platforması
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="text-sm text-muted-foreground">
                {currentUser.fullName} ({currentUser.role === "admin" ? "Admin" : "Tələbə"})
              </span>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Çıxış
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Daxil Ol
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Qeydiyyat
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
