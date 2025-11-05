"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/lib/quiz-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function StudentPage() {
  const { currentUser, quizzes } = useQuiz()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser || currentUser.role !== "student") {
      router.push("/login")
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== "student") {
    return null
  }

  const activeQuizzes = quizzes.filter((quiz) => quiz.isActive)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mövcud İmtahanlar</h1>
          <p className="text-muted-foreground">Başlamaq üçün imtahan seçin</p>
        </div>

        {activeQuizzes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mövcud imtahan yoxdur</h3>
              <p className="text-muted-foreground text-center">Yeni imtahanlar üçün sonra yoxlayın</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HelpCircle className="w-4 h-4" />
                      <span>{quiz.questions.length} sual</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.duration} dəqiqə</span>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/student/quiz/${quiz.id}`}>İmtahana Başla</Link>
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
