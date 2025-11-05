"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuiz, type User } from "@/lib/quiz-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, UserPlus, Mail, Lock, UserIcon, AlertCircle, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StudentsPage() {
  const { currentUser, users, addUser, deleteUser } = useQuiz()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student" as "admin" | "student",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
    }
  }, [currentUser, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all fields")
      return
    }

    // Check if email already exists
    if (users.some((u) => u.email === formData.email)) {
      setError("Email already exists")
      return
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role,
      createdAt: new Date().toISOString(),
    }

    addUser(newUser)
    setIsDialogOpen(false)
    setFormData({ email: "", password: "", fullName: "", role: "student" })
  }

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  const students = users.filter((u) => u.role === "student")
  const admins = users.filter((u) => u.role === "admin")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          İdarə Panelinə Qayıt
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">İstifadəçiləri İdarə Et</h1>
            <p className="text-muted-foreground">Tələbələr və adminlər əlavə edin və idarə edin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                İstifadəçi Əlavə Et
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni İstifadəçi Əlavə Et</DialogTitle>
                <DialogDescription>Yeni tələbə və ya admin hesabı yaradın</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName">Tam Ad</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Tam adı daxil edin"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-poçt</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="E-poçtu daxil edin"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Şifrə</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Şifrəni daxil edin"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "student") => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Tələbə</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  İstifadəçi Əlavə Et
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tələbələr ({students.length})</h2>
            {students.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserIcon className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Hələ tələbə əlavə edilməyib</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <Card key={student.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{student.fullName}</CardTitle>
                      <CardDescription>{student.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>Qoşulub:</span>
                        <span>{new Date(student.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          if (confirm(`${student.fullName} adlı istifadəçini silmək istədiyinizə əminsiniz?`)) {
                            deleteUser(student.id)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Sil
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Adminlər ({admins.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {admins.map((admin) => (
                <Card key={admin.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{admin.fullName}</CardTitle>
                    <CardDescription>{admin.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Qoşulub:</span>
                      <span>{new Date(admin.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
