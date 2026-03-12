"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Button disabled variant="outline">
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-sm text-muted-foreground">
          Welcome, {session.user?.name?.split(' ')[0]}
        </span>
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">My Orders</Button>
          </Link>
          <Button onClick={() => signOut()} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button 
      onClick={() => signIn('google')}
      variant="outline"
      size="sm"
    >
      Sign In with Google
    </Button>
  )
}
