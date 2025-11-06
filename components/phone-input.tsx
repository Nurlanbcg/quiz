"use client"

import type React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

const countryCodes = [
  { code: "+994", country: "AZ", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "+90", country: "TR", flag: "🇹🇷", name: "Turkey" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "USA" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "UK" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+98", country: "IR", flag: "🇮🇷", name: "Iran" },
]

export function PhoneInput({ value, onChange, required }: PhoneInputProps) {
  // Parse the phone value to extract country code and number
  const getCountryCode = () => {
    const matchedCode = countryCodes.find((c) => value.startsWith(c.code))
    return matchedCode?.code || "+994"
  }

  const getPhoneNumber = () => {
    const currentCode = getCountryCode()
    return value.startsWith(currentCode) ? value.slice(currentCode.length).trim() : value
  }

  const handleCountryCodeChange = (newCode: string) => {
    const phoneNumber = getPhoneNumber()
    onChange(`${newCode} ${phoneNumber}`)
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const countryCode = getCountryCode()
    const phoneNumber = e.target.value
    onChange(`${countryCode} ${phoneNumber}`)
  }

  return (
    <div className="flex gap-2">
      <Select value={getCountryCode()} onValueChange={handleCountryCodeChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span className="text-lg">{country.flag}</span>
                <span>{country.code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        placeholder="XX XXX XX XX"
        value={getPhoneNumber()}
        onChange={handlePhoneNumberChange}
        required={required}
        className="flex-1"
      />
    </div>
  )
}
