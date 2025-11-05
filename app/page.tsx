"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/lib/quiz-context"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { GraduationCap, UserCog } from 'lucide-react'

export default function HomePage() {
  const { currentUser } = useQuiz()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/student")
      }
    } else {
      router.push("/login")
    }
    setIsChecking(false)
  }, [currentUser, router])

  if (isChecking) {
    return null
  }

  return null
}
