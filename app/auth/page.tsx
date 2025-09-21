"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { AlertTriangle, UserPlus, LogIn } from "lucide-react"

export default function AuthPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")

  const handleLogin = () => {
    // TODO: Implement login API call
    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password.")
      return
    }
    setError("")
    alert("Login successful (demo)")
  }

  const handleSignup = () => {
    // TODO: Implement signup API call
    if (!signupData.name || !signupData.email || !signupData.password) {
      setError("Please fill all fields.")
      return
    }
    setError("")
    alert("Sign up successful (demo)")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted p-4">
      <Card className="max-w-md w-full shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-heading font-bold">Welcome to Echoes</CardTitle>
          <p className="text-muted-foreground">Sign up or log in to continue your journey</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login"><LogIn className="inline mr-2" />Login</TabsTrigger>
              <TabsTrigger value="signup"><UserPlus className="inline mr-2" />Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" autoComplete="email" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" autoComplete="current-password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
                </div>
                {error && <div className="flex items-center gap-2 text-destructive text-sm"><AlertTriangle className="h-4 w-4" />{error}</div>}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Login</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSignup(); }}>
                <div>
                  <Label htmlFor="signup-name">Name</Label>
                  <Input id="signup-name" type="text" autoComplete="name" value={signupData.name} onChange={e => setSignupData({ ...signupData, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" autoComplete="email" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" autoComplete="new-password" value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} required />
                </div>
                {error && <div className="flex items-center gap-2 text-destructive text-sm"><AlertTriangle className="h-4 w-4" />{error}</div>}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
