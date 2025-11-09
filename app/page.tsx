"use client"

import { useQuiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { quizzes } = useQuiz()

  const activeQuizzes = quizzes.filter((quiz) => quiz.isActive)

  console.log("[v0] Total quizzes:", quizzes.length)
  console.log("[v0] Active quizzes:", activeQuizzes.length)

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Onlayn İmtahan Platforması
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Peşəkar imtahanlar ilə bilik səviyyənizi yoxlayın və inkişaf edin
          </p>
        </div>

        {activeQuizzes.length === 0 ? (
          <Card className="max-w-2xl mx-auto border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hələ imtahan yoxdur</h3>
              <p className="text-muted-foreground text-center">Tezliklə yeni imtahanlar əlavə ediləcək</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {activeQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>{quiz.questions.length} sual</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.duration} dəqiqə</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-600">{quiz.price} ₼</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/exam/${quiz.id}`}>İmtahan Haqqında</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
