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
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Welcome, {session.user?.name}
        </span>
        <Link href="/dashboard">
          <Button 
            variant="ghost"
            size="sm"
          >
            My Orders
          </Button>
        </Link>
        <Button 
          onClick={() => signOut()}
          variant="outline"
          size="sm"
        >
          Sign Out
        </Button>
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
