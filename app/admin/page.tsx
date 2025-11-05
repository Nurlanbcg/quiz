"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/lib/quiz-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Trash2, BarChart3, Users } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AdminPage() {
  const { currentUser, quizzes, deleteQuiz, toggleQuizActive } = useQuiz()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Paneli</h1>
            <p className="text-muted-foreground">İmtahanlarınızı yaradın və idarə edin</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/admin/students">
                <Users className="w-4 h-4 mr-2" />
                İstifadəçiləri İdarə Et
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/results">
                <BarChart3 className="w-4 h-4 mr-2" />
                Nəticələrə Bax
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/create">
                <Plus className="w-4 h-4 mr-2" />
                İmtahan Yarat
              </Link>
            </Button>
          </div>
        </div>

        {quizzes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hələ imtahan yoxdur</h3>
              <p className="text-muted-foreground mb-6 text-center">İlk imtahanınızı yaradaraq başlayın</p>
              <Button asChild>
                <Link href="/admin/create">
                  <Plus className="w-4 h-4 mr-2" />
                  İlk İmtahanınızı Yaradın
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl flex-1">{quiz.title}</CardTitle>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        quiz.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {quiz.isActive ? "Aktiv" : "Qeyri-aktiv"}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex justify-between">
                      <span>Suallar:</span>
                      <span className="font-medium text-foreground">{quiz.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Müddət:</span>
                      <span className="font-medium text-foreground">{quiz.duration} dəqiqə</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
                    <Label htmlFor={`active-${quiz.id}`} className="text-sm font-medium cursor-pointer">
                      {quiz.isActive ? "İmtahan Aktivdir" : "İmtahan Qeyri-aktivdir"}
                    </Label>
                    <Switch
                      id={`active-${quiz.id}`}
                      checked={quiz.isActive}
                      onCheckedChange={() => toggleQuizActive(quiz.id)}
                    />
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      if (confirm("Bu imtahanı silmək istədiyinizə əminsiniz?")) {
                        deleteQuiz(quiz.id)
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    İmtahanı Sil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
