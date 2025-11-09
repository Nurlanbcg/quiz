"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminSetup() {
  const [email] = useState("admin@quiz.com")
  const [password] = useState("admin123")
  const [fullName] = useState("Admin")
  const [phone] = useState("+994501234567")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const createAdminUser = async () => {
    setLoading(true)
    setMessage("")

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) {
        setMessage(`Auth Error: ${authError.message}`)
        setLoading(false)
        return
      }

      if (!authData.user) {
        setMessage("Failed to create auth user")
        setLoading(false)
        return
      }

      // 2. Create user in users table
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        full_name: fullName,
        email,
        phone,
        role: "admin",
      })

      if (dbError) {
        setMessage(`Database Error: ${dbError.message}`)
        setLoading(false)
        return
      }

      setMessage("Admin user created successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>Create the initial admin user for the quiz platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} disabled />
          </div>
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={fullName} disabled />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} disabled />
          </div>
          <Button onClick={createAdminUser} disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Admin User"}
          </Button>
          {message && (
            <div
              className={`rounded p-3 text-sm ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
