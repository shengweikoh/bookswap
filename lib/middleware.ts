import type { NextRequest } from "next/server"
import { verifyToken, extractTokenFromHeader } from "./jwt"
import { db } from "./database"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    name: string
  }
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (req: AuthenticatedRequest): Promise<Response> => {
    try {
      const authHeader = req.headers.get("authorization")
      const token = extractTokenFromHeader(authHeader)

      if (!token) {
        return new Response(JSON.stringify({ error: "Authentication required" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      }

      const payload = verifyToken(token)
      if (!payload) {
        return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      }

      const user = db.getUserById(payload.userId)
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      }

      return handler(req)
    } catch (error) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
  }
}
