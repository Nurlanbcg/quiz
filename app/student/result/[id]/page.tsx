"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuiz, type QuizResult } from "@/lib/quiz-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ResultPage() {
  const { currentUser, results, quizzes } = useQuiz()
  const router = useRouter()
  const params = useParams()
  const resultId = params.id as string

  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    if (!currentUser || currentUser.role !== "student") {
      router.push("/login")
      return
    }

    const foundResult = results.find((r) => r.id === resultId)
    if (!foundResult) {
      router.push("/student")
      return
    }

    setResult(foundResult)
  }, [currentUser, resultId, results, router])

  if (!currentUser || currentUser.role !== "student" || !result) {
    return null
  }

  const quiz = quizzes.find((q) => q.id === result.quizId)

  let correctAnswersCount = 0
  if (quiz) {
    quiz.questions.forEach((question) => {
      const studentAnswer = result.answers[question.id] || []
      const correctAnswer = question.correctAnswers
      if (studentAnswer.length === correctAnswer.length && studentAnswer.every((ans) => correctAnswer.includes(ans))) {
        correctAnswersCount++
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/student">
            <ArrowLeft className="w-4 h-4 mr-2" />
            İdarə Panelinə Qayıt
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">İmtahan Nəticələri</h1>
          <p className="text-muted-foreground">Cavablarınızı və performansınızı nəzərdən keçirin</p>
        </div>

        {/* Score Summary Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{result.score}%</div>
                <p className="text-sm text-muted-foreground">Ümumi Bal</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-chart-1 mb-2">{correctAnswersCount}</div>
                <p className="text-sm text-muted-foreground">Düzgün Cavablar</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{result.totalQuestions}</div>
                <p className="text-sm text-muted-foreground">Ümumi Suallar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Sual Təhlili</h2>

          {quiz?.questions.map((question, index) => {
            const studentAnswer = result.answers[question.id] || []
            const correctAnswer = question.correctAnswers
            const isCorrect =
              studentAnswer.length === correctAnswer.length && studentAnswer.every((ans) => correctAnswer.includes(ans))

            return (
              <Card
                key={question.id}
                className={cn("border-2", isCorrect ? "border-chart-1/20" : "border-destructive/20")}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Sual {index + 1}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                          {question.type === "single" ? "Tək Seçim" : "Çoxlu Seçim"}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-relaxed">{question.text}</CardTitle>
                    </div>
                    <div
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                        isCorrect ? "bg-chart-1/10" : "bg-destructive/10",
                      )}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-chart-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* All Options */}
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isStudentAnswer = studentAnswer.includes(optionIndex)
                      const isCorrectAnswer = correctAnswer.includes(optionIndex)

                      return (
                        <div
                          key={optionIndex}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-colors",
                            isCorrectAnswer && "bg-chart-1/5 border-chart-1",
                            isStudentAnswer && !isCorrectAnswer && "bg-destructive/5 border-destructive",
                            !isStudentAnswer && !isCorrectAnswer && "border-border",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                              <span>{option}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && (
                                <span className="text-xs px-2 py-1 rounded-full bg-chart-1 text-white font-medium">
                                  Düzgün Cavab
                                </span>
                              )}
                              {isStudentAnswer && (
                                <span
                                  className={cn(
                                    "text-xs px-2 py-1 rounded-full font-medium",
                                    isCorrectAnswer ? "bg-chart-1 text-white" : "bg-destructive text-white",
                                  )}
                                >
                                  Sizin Cavabınız
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Summary */}
                  {!isCorrect && studentAnswer.length === 0 && (
                    <div className="text-sm text-muted-foreground italic">Bu suala cavab vermədiz</div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
