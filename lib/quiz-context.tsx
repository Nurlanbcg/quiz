"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type QuestionType = "single" | "multiple"

export interface Question {
  id: string
  text: string
  type: QuestionType
  options: string[]
  correctAnswers: number[]
}

export interface Quiz {
  id: string
  title: string
  description: string
  duration: number // in minutes
  price: number // Added price field
  questions: Question[]
  createdAt: string
  isActive: boolean
}

export interface QuizResult {
  id: string
  quizId: string
  quizTitle: string
  studentName: string
  studentEmail: string
  answers: Record<string, number[]>
  score: number
  totalQuestions: number
  submittedAt: string
}

export interface User {
  id: string
  email: string
  password: string
  fullName: string
  phone: string // Added phone field to User interface
  role: "admin" | "student"
  createdAt: string
  purchasedQuizzes: string[] // Added to track which quizzes user has purchased
}

export interface RegistrationRequest {
  id: string
  quizId: string
  quizTitle: string
  fullName: string
  email: string
  phone: string
  password: string
  requestedAt: string
  status: "pending" | "approved" | "rejected"
}

interface QuizContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  users: User[]
  addUser: (user: User) => void
  deleteUser: (id: string) => void
  updateUser: (user: User) => void // Added to update user data
  login: (email: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
  quizzes: Quiz[]
  addQuiz: (quiz: Quiz) => Promise<void>
  deleteQuiz: (id: string) => Promise<void>
  toggleQuizActive: (id: string) => void
  results: QuizResult[]
  addResult: (result: QuizResult) => Promise<void>
  registrationRequests: RegistrationRequest[]
  addRegistrationRequest: (request: RegistrationRequest) => void
  purchaseQuiz: (userId: string, quizId: string) => Promise<void> // Added to handle quiz purchases
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [results, setResults] = useState<QuizResult[]>([])
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUsers = localStorage.getItem("quiz-users")
      const savedQuizzes = localStorage.getItem("quiz-quizzes")
      const savedResults = localStorage.getItem("quiz-results")
      const savedRegistrations = localStorage.getItem("quiz-registrations")
      const savedCurrentUser = localStorage.getItem("quiz-currentUser")

      console.log("[v0] Loading from localStorage...")

      if (savedUsers) {
        const loadedUsers = JSON.parse(savedUsers)
        setUsers(loadedUsers)
        console.log("[v0] Loaded users:", loadedUsers.length)
      }

      if (savedQuizzes) {
        const loadedQuizzes = JSON.parse(savedQuizzes)
        setQuizzes(loadedQuizzes)
        console.log("[v0] Loaded quizzes:", loadedQuizzes.length)
        console.log(
          "[v0] Quiz IDs:",
          loadedQuizzes.map((q: Quiz) => q.id),
        )
      }

      if (savedResults) {
        setResults(JSON.parse(savedResults))
      }

      if (savedRegistrations) {
        setRegistrationRequests(JSON.parse(savedRegistrations))
      }

      if (savedCurrentUser) {
        setCurrentUser(JSON.parse(savedCurrentUser))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz-users", JSON.stringify(users))
    }
  }, [users])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz-quizzes", JSON.stringify(quizzes))
      console.log("[v0] Saved quizzes to localStorage:", quizzes.length)
    }
  }, [quizzes])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz-results", JSON.stringify(results))
    }
  }, [results])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz-registrations", JSON.stringify(registrationRequests))
    }
  }, [registrationRequests])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        localStorage.setItem("quiz-currentUser", JSON.stringify(currentUser))
      } else {
        localStorage.removeItem("quiz-currentUser")
      }
    }
  }, [currentUser])

  const login = async (email: string, password: string): Promise<User | null> => {
    console.log("[v0] Login attempt:", { email })
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      console.log("[v0] Login successful for:", email)
      setCurrentUser(user)
      return user
    }

    console.log("[v0] Login failed - user not found")
    return null
  }

  const logout = async () => {
    setCurrentUser(null)
  }

  const addUser = (user: User) => {
    console.log("[v0] Adding user:", user.email)
    setUsers((prev) => [...prev, user])
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const updateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser)
    }
  }

  const addQuiz = async (quiz: Quiz) => {
    console.log("[v0] Adding quiz:", quiz.id, quiz.title)
    setQuizzes((prev) => [...prev, quiz])
  }

  const deleteQuiz = async (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id))
  }

  const toggleQuizActive = (id: string) => {
    setQuizzes((prev) => prev.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q)))
  }

  const addResult = async (result: QuizResult) => {
    setResults((prev) => [...prev, result])
  }

  const addRegistrationRequest = (request: RegistrationRequest) => {
    setRegistrationRequests((prev) => [...prev, request])
  }

  const purchaseQuiz = async (userId: string, quizId: string) => {
    console.log("[v0] Purchasing quiz:", { userId, quizId })

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          const purchasedQuizzes = user.purchasedQuizzes || []
          if (!purchasedQuizzes.includes(quizId)) {
            return { ...user, purchasedQuizzes: [...purchasedQuizzes, quizId] }
          }
        }
        return user
      }),
    )

    if (currentUser?.id === userId) {
      const purchasedQuizzes = currentUser.purchasedQuizzes || []
      if (!purchasedQuizzes.includes(quizId)) {
        setCurrentUser({ ...currentUser, purchasedQuizzes: [...purchasedQuizzes, quizId] })
      }
    }
  }

  return (
    <QuizContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        deleteUser,
        updateUser,
        login,
        logout,
        quizzes,
        addQuiz,
        deleteQuiz,
        toggleQuizActive,
        results,
        addResult,
        registrationRequests,
        addRegistrationRequest,
        purchaseQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}
