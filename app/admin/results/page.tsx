"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/lib/quiz-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, TrendingUp, Users, Award } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const { currentUser, results, quizzes } = useQuiz()
  const router = useRouter()
  const [selectedQuiz, setSelectedQuiz] = useState<string>("all")

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  const filteredResults = selectedQuiz === "all" ? results : results.filter((r) => r.quizId === selectedQuiz)

  const totalSubmissions = filteredResults.length
  const averageScore =
    totalSubmissions > 0 ? Math.round(filteredResults.reduce((sum, r) => sum + r.score, 0) / totalSubmissions) : 0
  const highestScore = totalSubmissions > 0 ? Math.max(...filteredResults.map((r) => r.score)) : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            İdarə Panelinə Qayıt
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">İmtahan Nəticələri</h1>
          <p className="text-muted-foreground">Bütün təqdim edilmiş imtahan nəticələrinə baxın</p>
        </div>

        {results.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hələ nəticə yoxdur</h3>
              <p className="text-muted-foreground text-center">
                Tələbələr imtahanları tamamladıqdan sonra nəticələr burada görünəcək
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <Label htmlFor="quiz-filter" className="text-sm font-medium mb-2 block">
                İmtahana görə filtr
              </Label>
              <select
                id="quiz-filter"
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                className="w-full md:w-64 h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">Bütün İmtahanlar</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Ümumi Təqdimatlar</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSubmissions}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedQuiz === "all" ? "Bütün imtahanlar üzrə" : "Seçilmiş imtahan üçün"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Orta Bal</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Orta performans</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Ən Yüksək Bal</CardTitle>
                  <Award className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{highestScore}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Ən yaxşı performans</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Təqdimatlar</h2>
              {filteredResults
                .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                .map((result) => (
                  <Card key={result.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle>{result.quizTitle}</CardTitle>
                          <CardDescription>
                            <span className="font-medium">{result.studentName}</span> tərəfindən təqdim edilib -{" "}
                            {new Date(result.submittedAt).toLocaleString()}
                          </CardDescription>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-3xl font-bold text-primary">{result.score}%</div>
                          <div className="text-sm text-muted-foreground">
                            {Object.keys(result.answers).length} / {result.totalQuestions} cavablandırılıb
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
