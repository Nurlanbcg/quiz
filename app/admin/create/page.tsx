"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuiz, type Question, type Quiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateQuizPage() {
  const { currentUser, addQuiz } = useQuiz()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(30)
  const [price, setPrice] = useState(0) // Added price state
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
    }
  }, [currentUser, router])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
      type: "single",
      options: ["", "", "", ""],
      correctAnswers: [],
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options]
          newOptions[optionIndex] = value
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const toggleCorrectAnswer = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          if (q.type === "single") {
            return { ...q, correctAnswers: [optionIndex] }
          } else {
            const newCorrectAnswers = q.correctAnswers.includes(optionIndex)
              ? q.correctAnswers.filter((i) => i !== optionIndex)
              : [...q.correctAnswers, optionIndex]
            return { ...q, correctAnswers: newCorrectAnswers }
          }
        }
        return q
      }),
    )
  }

  const handleSaveQuiz = () => {
    if (!title.trim()) {
      alert("Please enter a quiz title")
      return
    }
    if (questions.length === 0) {
      alert("Please add at least one question")
      return
    }

    const invalidQuestions = questions.filter(
      (q) => !q.text.trim() || q.options.some((opt) => !opt.trim()) || q.correctAnswers.length === 0,
    )

    if (invalidQuestions.length > 0) {
      alert("Please complete all questions with text, options, and correct answers")
      return
    }

    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title,
      description,
      duration,
      price, // Added price to quiz object
      questions,
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    addQuiz(newQuiz)
    router.push("/admin")
  }

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            İdarə Panelinə Qayıt
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Yeni İmtahan Yarat</h1>
          <p className="text-muted-foreground">Xüsusi suallarla imtahanınızı dizayn edin</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>İmtahan Təfərrüatları</CardTitle>
            <CardDescription>İmtahanınız haqqında əsas məlumat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">İmtahan Başlığı</Label>
              <Input
                id="title"
                placeholder="İmtahan başlığını daxil edin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Təsvir</Label>
              <Textarea
                id="description"
                placeholder="İmtahan təsvirini daxil edin"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Müddət (dəqiqə)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(Number.parseInt(e.target.value) || 30)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Qiymət (₼)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Suallar</h2>
            <Button onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Sual Əlavə Et
            </Button>
          </div>

          {questions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">Hələ sual əlavə edilməyib</p>
                <Button onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Sualınızı Əlavə Edin
                </Button>
              </CardContent>
            </Card>
          ) : (
            questions.map((question, qIndex) => (
              <div key={question.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Sual {qIndex + 1}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => deleteQuestion(question.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Sual Mətni</Label>
                      <Textarea
                        placeholder="Sualınızı daxil edin"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sual Növü</Label>
                      <RadioGroup
                        value={question.type}
                        onValueChange={(value) =>
                          updateQuestion(question.id, {
                            type: value as "single" | "multiple",
                            correctAnswers: [],
                          })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id={`single-${question.id}`} />
                          <Label htmlFor={`single-${question.id}`} className="font-normal">
                            Tək Seçim
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multiple" id={`multiple-${question.id}`} />
                          <Label htmlFor={`multiple-${question.id}`} className="font-normal">
                            Çoxlu Seçim
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label>Variantlar (düzgün cavabları qeyd edin)</Label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          {question.type === "single" ? (
                            <RadioGroup
                              value={question.correctAnswers[0]?.toString() || ""}
                              onValueChange={() => toggleCorrectAnswer(question.id, optIndex)}
                            >
                              <RadioGroupItem value={optIndex.toString()} id={`correct-${question.id}-${optIndex}`} />
                            </RadioGroup>
                          ) : (
                            <Checkbox
                              checked={question.correctAnswers.includes(optIndex)}
                              onCheckedChange={() => toggleCorrectAnswer(question.id, optIndex)}
                              id={`correct-${question.id}-${optIndex}`}
                            />
                          )}
                          <Input
                            placeholder={`Variant ${String.fromCharCode(65 + optIndex)}`}
                            value={option}
                            onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-center">
                  <Button onClick={addQuestion} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Sual Əlavə Et
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" asChild>
            <Link href="/admin">Ləğv et</Link>
          </Button>
          <Button onClick={handleSaveQuiz}>
            <Save className="w-4 h-4 mr-2" />
            İmtahanı Yadda Saxla
          </Button>
        </div>
      </main>
    </div>
  )
}
