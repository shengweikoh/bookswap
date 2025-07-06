"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import AuthenticatedHeader from "@/components/AuthenticatedHeader"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()

  // Pages that don't need any header
  const noHeaderPages = ["/", "/login", "/signup"]

  // Pages that need the authenticated header
  const authenticatedPages = ["/home", "/browse", "/add-book", "/edit-book", "/listing", "/profile", "/notifications", "/my-listings", "/my-chats"]

  const showNoHeader = noHeaderPages.includes(pathname)
  const showAuthenticatedHeader = authenticatedPages.includes(pathname)

  return (
    <>
      {showNoHeader ? null : showAuthenticatedHeader ? <AuthenticatedHeader /> : null}
      {children}
    </>
  )
}
