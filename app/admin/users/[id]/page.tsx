"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Phone, ShoppingBag, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const { currentUser, users, quizzes } = useQuiz()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  const user = users.find((u) => u.id === params.id)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <User className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">İstifadəçi tapılmadı</h3>
              <Button asChild className="mt-4">
                <Link href="/admin/users">Geri Qayıt</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const purchasedQuizzes = quizzes.filter((quiz) => user.purchasedQuizzes?.includes(quiz.id))

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/users">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">İstifadəçi Məlumatları</h1>
            <p className="text-muted-foreground">Ətraflı məlumat və alınmış imtahanlar</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Şəxsi Məlumatlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ad Soyad</label>
                  <p className="text-lg font-semibold mt-1">{user.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    E-poçt
                  </label>
                  <p className="text-sm mt-1 break-all">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefon
                  </label>
                  <p className="text-sm mt-1">{user.phone || "Telefon nömrəsi yoxdur"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Qeydiyyat Tarixi
                  </label>
                  <p className="text-sm mt-1">{new Date(user.createdAt).toLocaleDateString("az-AZ")}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Alınmış İmtahanlar
                </CardTitle>
                <CardDescription>
                  {purchasedQuizzes.length > 0 ? `${purchasedQuizzes.length} imtahan alınıb` : "Hələ imtahan alınmayıb"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchasedQuizzes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Bu istifadəçi hələ heç bir imtahan almayıb</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchasedQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <h4 className="font-semibold">{quiz.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{quiz.description}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{quiz.questions.length} sual</span>
                            <span>{quiz.duration} dəqiqə</span>
                            <span className="font-semibold text-foreground">{quiz.price} ₼</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
