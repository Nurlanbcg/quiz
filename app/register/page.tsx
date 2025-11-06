"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useQuiz } from "@/lib/quiz-context" // Import useQuiz hook

export default function RegisterPage() {
  const router = useRouter()
  const { addUser, setCurrentUser, users } = useQuiz() // Get context functions
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      alert("Zəhmət olmasa bütün xanaları doldurun")
      return
    }

    const existingUser = users.find((u) => u.email === formData.email)
    if (existingUser) {
      alert("Bu e-poçt artıq qeydiyyatdan keçib")
      return
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      role: "student" as const,
      createdAt: new Date().toISOString(),
      purchasedQuizzes: [], // Initialize with empty purchased quizzes array
    }

    console.log("[v0] Registering new user:", newUser.email) // Debug logging
    addUser(newUser)
    setCurrentUser(newUser)

    setTimeout(() => {
      router.push("/")
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button asChild variant="ghost" size="sm" className="w-fit mb-2">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Səhifəyə Qayıt
            </Link>
          </Button>
          <CardTitle className="text-2xl">Qeydiyyat</CardTitle>
          <CardDescription>İmtahanlara qatılmaq üçün qeydiyyatdan keçin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Tam Ad</Label>
              <Input
                id="fullName"
                placeholder="Adınızı və soyadınızı daxil edin"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-poçt</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+994 XX XXX XX XX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifrə</Label>
              <Input
                id="password"
                type="password"
                placeholder="Şifrənizi daxil edin"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Qeydiyyatdan Keç
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
