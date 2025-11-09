"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

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
  login: (email: string, password: string) => Promise<User | null> // Made async
  logout: () => Promise<void> // Made async
  quizzes: Quiz[]
  addQuiz: (quiz: Quiz) => Promise<void> // Made async
  deleteQuiz: (id: string) => Promise<void> // Made async
  toggleQuizActive: (id: string) => void
  results: QuizResult[]
  addResult: (result: QuizResult) => void
  registrationRequests: RegistrationRequest[]
  addRegistrationRequest: (request: RegistrationRequest) => void
  purchaseQuiz: (userId: string, quizId: string) => Promise<void> // Made async
  refreshQuizzes: () => Promise<void> // Added refresh function
  refreshUsers: () => Promise<void> // Added refresh function
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [results, setResults] = useState<QuizResult[]>([])
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([])

  const supabase = createClient()

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (userData) {
          const { data: purchases } = await supabase.from("purchases").select("quiz_id").eq("user_id", authUser.id)

          setCurrentUser({
            id: userData.id,
            fullName: userData.full_name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            password: "", // Not stored from Supabase
            createdAt: userData.created_at,
            purchasedQuizzes: purchases ? purchases.map((p) => p.quiz_id) : [],
          })
        }
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const refreshQuizzes = async () => {
    const { data } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false })

    if (data) {
      setQuizzes(
        data.map((q) => ({
          id: q.id,
          title: q.title,
          description: q.description || "",
          questions: q.questions as Question[],
          duration: q.duration,
          price: q.price,
          createdAt: q.created_at,
          isActive: q.is_active,
        })),
      )
    }
  }

  const refreshUsers = async () => {
    if (currentUser?.role === "admin") {
      const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (data) {
        const usersWithPurchases = await Promise.all(
          data.map(async (u) => {
            const { data: purchases } = await supabase.from("purchases").select("quiz_id").eq("user_id", u.id)

            return {
              id: u.id,
              fullName: u.full_name,
              email: u.email,
              phone: u.phone,
              role: u.role,
              password: "", // Not stored from Supabase
              createdAt: u.created_at,
              purchasedQuizzes: purchases ? purchases.map((p) => p.quiz_id) : [],
            }
          }),
        )
        setUsers(usersWithPurchases)
      }
    }
  }

  useEffect(() => {
    refreshQuizzes()
  }, [])

  useEffect(() => {
    if (currentUser?.role === "admin") {
      refreshUsers()
    }
  }, [currentUser])

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [users])

  // Save quizzes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("quizzes", JSON.stringify(quizzes))
  }, [quizzes])

  // Save results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results))
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

  const login = async (email: string, password: string): Promise<User | null> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[v0] Login error:", error)
      return null
    }

    // User will be loaded by the auth state listener
    return new Promise((resolve) => {
      setTimeout(() => resolve(currentUser), 500)
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
    setUsers([])
  }

  const addUser = (user: User) => {
    // This is now handled in the register function
    console.log("[v0] addUser called - user creation handled in register")
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
    const { error } = await supabase.from("quizzes").insert({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
      duration: quiz.duration,
      price: quiz.price,
      is_active: quiz.isActive,
      created_by: currentUser?.id,
    })

    if (error) {
      console.error("Error adding quiz:", error)
      throw error
    }

    await refreshQuizzes()
  }

  const deleteQuiz = async (id: string) => {
    const { error } = await supabase.from("quizzes").delete().eq("id", id)

    if (error) {
      console.error("Error deleting quiz:", error)
      throw error
    }

    await refreshQuizzes()
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

  const purchaseQuiz = async (userId: string, quizId: string) => {
    const { error } = await supabase.from("purchases").insert({
      user_id: userId,
      quiz_id: quizId,
    })

    if (error && !error.message.includes("duplicate")) {
      console.error("Error purchasing quiz:", error)
      throw error
    }

    // Update local state
    if (currentUser?.id === userId) {
      setCurrentUser({
        ...currentUser,
        purchasedQuizzes: [...(currentUser.purchasedQuizzes || []), quizId],
      })
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
        refreshQuizzes, // Added
        refreshUsers, // Added
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
