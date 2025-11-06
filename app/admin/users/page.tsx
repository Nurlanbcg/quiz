"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, User, Mail, Phone, ShoppingBag, LayoutGrid, List } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  const { currentUser, users } = useQuiz()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  const studentUsers = users
    .filter((user) => user.role === "student")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">İstifadəçilər</h1>
              <p className="text-muted-foreground">Qeydiyyatdan keçmiş istifadəçilərin siyahısı</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {studentUsers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <User className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hələ istifadəçi yoxdur</h3>
              <p className="text-muted-foreground text-center">Qeydiyyatdan keçən istifadəçilər burada görünəcək</p>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {user.fullName}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Qeydiyyat: {new Date(user.createdAt).toLocaleDateString("az-AZ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.phone || "Telefon yoxdur"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.purchasedQuizzes?.length || 0} imtahan alınıb</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href={`/admin/users/${user.id}`}>Ətraflı Bax</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead className="text-center">Alınmış İmtahanlar</TableHead>
                    <TableHead>Qeydiyyat Tarixi</TableHead>
                    <TableHead className="text-right">Əməliyyat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {user.fullName}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">{user.phone || "-"}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          <ShoppingBag className="w-3 h-3" />
                          {user.purchasedQuizzes?.length || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("az-AZ")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/users/${user.id}`}>Ətraflı</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
