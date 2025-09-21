"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export default function RegisterLoginPage() {
  const [tab, setTab] = useState("login")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Replace with real authentication logic
    if (!loginEmail || !loginPassword) {
      setError("Please enter both email and password.")
      return
    }
    setError("")
    router.push("/dashboard")
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Replace with real registration logic
    if (!registerName || !registerEmail || !registerPassword) {
      setError("Please fill all fields.")
      return
    }
    setError("")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-center">Welcome to Echoes</CardTitle>
          <CardDescription className="text-center">Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                />
                {error && tab === "login" && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
                <Button type="submit" className="w-full bg-primary text-primary-foreground">Login</Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Name"
                  value={registerName}
                  onChange={e => setRegisterName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  required
                />
                {error && tab === "register" && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
                <Button type="submit" className="w-full bg-primary text-primary-foreground">Register</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
