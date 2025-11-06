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
  login: (email: string, password: string) => User | null
  logout: () => void
  quizzes: Quiz[]
  addQuiz: (quiz: Quiz) => void
  deleteQuiz: (id: string) => void
  toggleQuizActive: (id: string) => void
  results: QuizResult[]
  addResult: (result: QuizResult) => void
  registrationRequests: RegistrationRequest[]
  addRegistrationRequest: (request: RegistrationRequest) => void
  purchaseQuiz: (userId: string, quizId: string) => void // Added to handle quiz purchases
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [results, setResults] = useState<QuizResult[]>([])
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]) // Added state

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("users")
    const savedQuizzes = localStorage.getItem("quizzes")
    const savedResults = localStorage.getItem("results")
    const savedCurrentUser = localStorage.getItem("currentUser")
    const savedRegistrationRequests = localStorage.getItem("registrationRequests")

    if (savedUsers) {
      const loadedUsers = JSON.parse(savedUsers)
      const usersWithPurchases = loadedUsers.map((u: User) => ({
        ...u,
        purchasedQuizzes: u.purchasedQuizzes || [],
      }))
      setUsers(usersWithPurchases)
    } else {
      const defaultAdmin: User = {
        id: "admin-1",
        email: "admin@quiz.com",
        password: "admin123",
        fullName: "Admin User",
        phone: "",
        role: "admin",
        createdAt: new Date().toISOString(),
        purchasedQuizzes: [], // Added default empty array
      }
      setUsers([defaultAdmin])
      localStorage.setItem("users", JSON.stringify([defaultAdmin]))
    }

    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes))
    }
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    }
    if (savedCurrentUser) {
      const loadedUser = JSON.parse(savedCurrentUser)
      setCurrentUser({
        ...loadedUser,
        purchasedQuizzes: loadedUser.purchasedQuizzes || [],
      })
    }
    if (savedRegistrationRequests) {
      setRegistrationRequests(JSON.parse(savedRegistrationRequests))
    }
  }, [])

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [users])

  // Save quizzes to localStorage whenever they change
  useEffect(() => {
    if (quizzes.length > 0) {
      localStorage.setItem("quizzes", JSON.stringify(quizzes))
    }
  }, [quizzes])

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem("results", JSON.stringify(results))
    }
  }, [results])

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    } else {
      localStorage.removeItem("currentUser")
    }
  }, [currentUser])

  useEffect(() => {
    if (registrationRequests.length > 0) {
      localStorage.setItem("registrationRequests", JSON.stringify(registrationRequests))
    }
  }, [registrationRequests])

  const login = (email: string, password: string): User | null => {
    console.log("[v0] Login attempt:", { email, totalUsers: users.length }) // Debug logging
    const user = users.find((u) => u.email === email && u.password === password)
    console.log("[v0] User found:", user ? "Yes" : "No") // Debug logging
    if (user) {
      const userWithPurchases = {
        ...user,
        purchasedQuizzes: user.purchasedQuizzes || [],
      }
      setCurrentUser(userWithPurchases)
      return userWithPurchases
    }
    return null
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const addUser = (user: User) => {
    console.log("[v0] Adding user:", user.email) // Debug logging
    setUsers((prev) => {
      const newUsers = [...prev, user]
      console.log("[v0] Total users after add:", newUsers.length) // Debug logging
      return newUsers
    })
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

  const addQuiz = (quiz: Quiz) => {
    setQuizzes((prev) => [...prev, quiz])
  }

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id))
  }

  const toggleQuizActive = (id: string) => {
    setQuizzes((prev) => prev.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q)))
  }

  const addResult = (result: QuizResult) => {
    setResults((prev) => [...prev, result])
  }

  const addRegistrationRequest = (request: RegistrationRequest) => {
    setRegistrationRequests((prev) => [...prev, request])
  }

  const purchaseQuiz = (userId: string, quizId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const purchasedQuizzes = u.purchasedQuizzes || []
          if (!purchasedQuizzes.includes(quizId)) {
            return { ...u, purchasedQuizzes: [...purchasedQuizzes, quizId] }
          }
        }
        return u
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
        updateUser, // Added to context
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
        purchaseQuiz, // Added to context
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
