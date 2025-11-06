"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Clock, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TakeQuizPage() {
  const { currentUser, quizzes, addResult } = useQuiz()
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState(quizzes.find((q) => q.id === quizId))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number[]>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (!currentUser || currentUser.role !== "student") {
      router.push("/login")
      return
    }

    const foundQuiz = quizzes.find((q) => q.id === quizId)
    if (!foundQuiz) {
      router.push("/student")
      return
    }

    setQuiz(foundQuiz)
    setTimeRemaining(foundQuiz.duration * 60)
  }, [currentUser, quizId, quizzes, router])

  useEffect(() => {
    if (!quiz) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quiz])

  const handleAnswerChange = (questionId: string, optionIndex: number, isMultiple: boolean) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || []
      const newAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter((i) => i !== optionIndex)
        : [...currentAnswers, optionIndex]
      setAnswers({ ...answers, [questionId]: newAnswers })
    } else {
      setAnswers({ ...answers, [questionId]: [optionIndex] })
    }
  }

  const handleSubmit = () => {
    if (!quiz || !currentUser) return

    let correctCount = 0
    quiz.questions.forEach((question) => {
      const studentAnswer = answers[question.id] || []
      const correctAnswer = question.correctAnswers

      if (studentAnswer.length === correctAnswer.length && studentAnswer.every((ans) => correctAnswer.includes(ans))) {
        correctCount++
      }
    })

    const score = Math.round((correctCount / quiz.questions.length) * 100)

    const result = {
      id: Date.now().toString(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      studentName: currentUser.fullName,
      studentEmail: currentUser.email,
      answers,
      score,
      totalQuestions: quiz.questions.length,
      submittedAt: new Date().toISOString(),
    }

    addResult(result)
    router.push(`/student/result/${result.id}`)
  }

  if (!currentUser || currentUser.role !== "student" || !quiz) {
    return null
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (
    <div className="min-h-screen bg-background">
      {/* Timer Bar */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{currentUser.fullName}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{quiz.title}</span>
          </div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="w-5 h-5" />
            <span className={cn(timeRemaining < 60 && "text-destructive")}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Question Area */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Sual {currentQuestionIndex + 1} / {quiz.questions.length}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                    {currentQuestion.type === "single" ? "Tək Seçim" : "Çoxlu Seçim"}
                  </span>
                </div>
                <CardTitle className="text-xl leading-relaxed">{currentQuestion.text}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQuestion.type === "single" ? (
                  <RadioGroup
                    value={answers[currentQuestion.id]?.[0]?.toString() || ""}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, Number.parseInt(value), false)}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                          <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <Checkbox
                          checked={answers[currentQuestion.id]?.includes(index) || false}
                          onCheckedChange={() => handleAnswerChange(currentQuestion.id, index, true)}
                          id={`option-${index}`}
                        />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                          <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Əvvəlki
              </Button>

              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <Button onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" />
                  İmtahanı Təqdim Et
                </Button>
              ) : (
                <Button onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>
                  Növbəti
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sual Naviqatoru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {quiz.questions.map((question, index) => (
                    <Button
                      key={question.id}
                      variant={currentQuestionIndex === index ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-10",
                        answers[question.id]?.length > 0 &&
                          currentQuestionIndex !== index &&
                          "bg-chart-1/10 border-chart-1 hover:bg-chart-1/20",
                      )}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary" />
                    <span>Cari</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-chart-1/10 border border-chart-1" />
                    <span>Cavablandırılıb</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border" />
                    <span>Cavablandırılmayıb</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
