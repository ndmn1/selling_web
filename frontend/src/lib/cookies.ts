"use client"

// Get a cookie value by name
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined

  const cookies = document.cookie.split(";")
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1))
    }
  }
  return undefined
}

// Set a cookie with a name and value
export function setCookie(name: string, value: string, days = 7): void {
  if (typeof document === "undefined") return

  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + days)

  const cookieValue = encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/; SameSite=Lax"

  document.cookie = name + "=" + cookieValue
}

