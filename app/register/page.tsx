"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client" // Fixed import path
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useQuiz } from "@/lib/quiz-context"
import { PhoneInput } from "@/components/phone-input"

export default function RegisterPage() {
  const router = useRouter()
  const { addUser, setCurrentUser, users } = useQuiz()
  const supabase = createClient()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "+994 ",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError("Zəhmət olmasa bütün xanaları doldurun")
      setIsLoading(false)
      return
    }

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          },
        },
      })

      if (authError) throw authError

      // Create user profile
      if (authData.user && authData.user.identities && authData.user.identities.length > 0) {
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: "student",
        })

        if (profileError && !profileError.message.includes("duplicate")) {
          console.error("Error creating profile:", profileError)
        }
      }

      router.push("/")
    } catch (err: any) {
      setError(err.message || "Qeydiyyat uğursuz oldu")
    } finally {
      setIsLoading(false)
    }
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
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

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
              <PhoneInput value={formData.phone} onChange={(phone) => setFormData({ ...formData, phone })} required />
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
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Qeydiyyat edilir..." : "Qeydiyyatdan Keç"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
