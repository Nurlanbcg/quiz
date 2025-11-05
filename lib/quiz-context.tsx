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
  role: "admin" | "student"
  createdAt: string
}

interface QuizContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  users: User[]
  addUser: (user: User) => void
  deleteUser: (id: string) => void
  login: (email: string, password: string) => User | null
  logout: () => void
  quizzes: Quiz[]
  addQuiz: (quiz: Quiz) => void
  deleteQuiz: (id: string) => void
  toggleQuizActive: (id: string) => void
  results: QuizResult[]
  addResult: (result: QuizResult) => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [results, setResults] = useState<QuizResult[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("users")
    const savedQuizzes = localStorage.getItem("quizzes")
    const savedResults = localStorage.getItem("results")
    const savedCurrentUser = localStorage.getItem("currentUser")

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      const defaultAdmin: User = {
        id: "admin-1",
        email: "admin@quiz.com",
        password: "admin123",
        fullName: "Admin User",
        role: "admin",
        createdAt: new Date().toISOString(),
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
      setCurrentUser(JSON.parse(savedCurrentUser))
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

  const login = (email: string, password: string): User | null => {
    const user = users.find((u) => u.email === email && u.password === password)
    if (user) {
      setCurrentUser(user)
      return user
    }
    return null
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user])
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
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

  return (
    <QuizContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        deleteUser,
        login,
        logout,
        quizzes,
        addQuiz,
        deleteQuiz,
        toggleQuizActive,
        results,
        addResult,
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
