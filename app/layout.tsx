import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { QuizProvider } from "@/lib/quiz-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "İmtahan Platforması",
  description: "Onlayn imtahan platforması",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="az">
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        <QuizProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QuizProvider>
        <Analytics />
      </body>
    </html>
  )
}
