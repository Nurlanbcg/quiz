"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useQuiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, FileText, ArrowLeft, CheckCircle, Share2, Copy, PlayCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ExamDetailsPage({ params }: { params: { id: string } }) {
  const { quizzes, currentUser, addUser, setCurrentUser, purchaseQuiz, users } = useQuiz()
  const router = useRouter()
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  })

  useEffect(() => {
    console.log("[v0] Exam Details Debug:")
    console.log("[v0] URL params.id:", params.id, typeof params.id)
    console.log("[v0] Total quizzes:", quizzes.length)
    console.log(
      "[v0] Quiz IDs:",
      quizzes.map((q) => ({ id: q.id, type: typeof q.id, title: q.title })),
    )
    const foundQuiz = quizzes.find((q) => q.id === params.id)
    console.log("[v0] Found quiz:", foundQuiz ? "Yes" : "No")
  }, [quizzes, params.id])

  useEffect(() => {
    if (!currentUser) {
      router.push(`/login?returnUrl=/exam/${params.id}`)
    }
  }, [currentUser, router, params.id])

  const quiz = quizzes.find((q) => q.id === params.id)
  const hasPurchased = currentUser?.purchasedQuizzes?.includes(params.id) || false

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Yönləndirilir...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">İmtahan tapılmadı</p>
            <Button asChild>
              <Link href="/">Ana Səhifəyə Qayıt</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleBuyNow = () => {
    if (currentUser) {
      purchaseQuiz(currentUser.id, quiz.id)
      setShowThankYou(true)
    } else {
      setShowRegisterModal(true)
    }
  }

  const handleStartExam = () => {
    router.push(`/student/quiz/${quiz.id}`)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      alert("Zəhmət olmasa bütün xanaları doldurun")
      return
    }

    const existingUser = users.find((u) => u.email === formData.email)
    if (existingUser) {
      alert("Bu e-poçt artıq qeydiyyatdan keçib. Zəhmət olmasa daxil olun.")
      return
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      role: "student" as const,
      createdAt: new Date().toISOString(),
      purchasedQuizzes: [],
    }

    addUser(newUser)
    setCurrentUser(newUser)
    setShowRegisterModal(false)
    router.push("/")
  }

  const shareableLink = typeof window !== "undefined" ? window.location.href : ""

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Təşəkkür Edirik!</CardTitle>
            <CardDescription className="text-base">Alışınız uğurla tamamlandı</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Alış-verişiniz üçün təşəkkür edirik. Tezliklə sizinlə əlaqə saxlayacağıq və sonra imtahana başlaya
              bilərsiniz.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href="/">Ana Səhifəyə Qayıt</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Link>
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{quiz.title}</CardTitle>
                <CardDescription className="text-base">{quiz.description}</CardDescription>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">Aktiv</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Suallar</p>
                  <p className="text-2xl font-bold">{quiz.questions.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <Clock className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Müddət</p>
                  <p className="text-2xl font-bold">{quiz.duration} dəq</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center text-green-600 font-bold text-xl">₼</div>
                <div>
                  <p className="text-sm text-muted-foreground">Qiymət</p>
                  <p className="text-2xl font-bold">{quiz.price} ₼</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">İmtahan Haqqında</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>İmtahan {quiz.questions.length} sualdan ibarətdir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>İmtahanı tamamlamaq üçün {quiz.duration} dəqiqə vaxtınız var</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>İmtahan bitdikdən sonra nəticənizi dərhal görə biləcəksiniz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Qeydiyyatdan sonra admin tərəfindən təsdiq gözləyin</span>
                </li>
              </ul>
            </div>

            {currentUser?.role === "admin" && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">İmtahan Linkini Paylaş</h3>
                <div className="flex gap-2">
                  <Input value={shareableLink} readOnly className="flex-1" />
                  <Button onClick={handleCopyLink} variant="outline">
                    {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Kopyalandı" : "Kopyala"}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {hasPurchased ? (
                <Button onClick={handleStartExam} size="lg" className="flex-1">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  İmtahana Başla
                </Button>
              ) : (
                <Button onClick={handleBuyNow} size="lg" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  İndi Al
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Registration Modal */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Qeydiyyat</DialogTitle>
            <DialogDescription>İmtahana qatılmaq üçün qeydiyyatdan keçin</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-fullName">Tam Ad</Label>
              <Input
                id="modal-fullName"
                placeholder="Adınızı və soyadınızı daxil edin"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-email">E-poçt</Label>
              <Input
                id="modal-email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-phone">Telefon</Label>
              <Input
                id="modal-phone"
                type="tel"
                placeholder="+994 XX XXX XX XX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-password">Şifrə</Label>
              <Input
                id="modal-password"
                type="password"
                placeholder="Şifrənizi daxil edin"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowRegisterModal(false)} className="flex-1">
                Ləğv et
              </Button>
              <Button type="submit" className="flex-1">
                Qeydiyyatdan Keç
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
