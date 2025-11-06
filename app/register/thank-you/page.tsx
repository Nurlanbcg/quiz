"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
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
