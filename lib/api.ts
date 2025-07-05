const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Types for API responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export interface BookRequest {
  title: string
  author: string
  genre: string
  condition: string
  description: string
  image?: string
}

export interface ExchangeRequestPayload {
  bookId: string
  message: string
}

// API Service Class
class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "An error occurred",
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error or invalid response",
      }
    }
  }

  // Authentication APIs
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const result = await this.handleResponse<AuthResponse>(response)

      if (result.success && result.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", result.data.token)
          localStorage.setItem("user", JSON.stringify(result.data.user))
        }
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: "Login failed. Please try again.",
      }
    }
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const result = await this.handleResponse<AuthResponse>(response)

      if (result.success && result.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", result.data.token)
          localStorage.setItem("user", JSON.stringify(result.data.user))
        }
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: "Signup failed. Please try again.",
      }
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      // Clear local storage regardless of response
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      }

      return await this.handleResponse<void>(response)
    } catch (error) {
      // Still clear local storage on error
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      }

      return {
        success: false,
        error: "Logout failed, but you have been logged out locally.",
      }
    }
  }

  // Book APIs
  async getBooks(params?: {
    search?: string
    genre?: string
    condition?: string
    page?: number
    size?: number
  }): Promise<ApiResponse<{ books: any[]; totalPages: number; totalElements: number }>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.search) queryParams.append("search", params.search)
      if (params?.genre) queryParams.append("genre", params.genre)
      if (params?.condition) queryParams.append("condition", params.condition)
      if (params?.page) queryParams.append("page", params.page.toString())
      if (params?.size) queryParams.append("size", params.size.toString())

      const response = await fetch(`${API_BASE_URL}/books?${queryParams}`, {
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch books",
      }
    }
  }

  async getBookById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch book details",
      }
    }
  }

  async addBook(bookData: BookRequest): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bookData),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to add book",
      }
    }
  }

  async updateBook(id: string, bookData: Partial<BookRequest>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bookData),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to update book",
      }
    }
  }

  async deleteBook(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to delete book",
      }
    }
  }

  // Exchange APIs
  async createExchangeRequest(requestData: ExchangeRequestPayload): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/exchanges/request`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestData),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to create exchange request",
      }
    }
  }

  async getExchangeRequests(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/exchanges/requests`, {
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch exchange requests",
      }
    }
  }

  async respondToExchangeRequest(requestId: string, action: "accept" | "reject"): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/exchanges/requests/${requestId}/${action}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: `Failed to ${action} exchange request`,
      }
    }
  }

  async getExchangeHistory(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/exchanges/history`, {
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch exchange history",
      }
    }
  }

  // User Profile APIs
  async getUserProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch user profile",
      }
    }
  }

  async updateUserProfile(profileData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to update profile",
      }
    }
  }

  // Notifications APIs
  async getNotifications(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch notifications",
      }
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to mark notification as read",
      }
    }
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to mark all notifications as read",
      }
    }
  }

  async getUserBooks(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/user/${userId}`, {
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch user books",
      }
    }
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return typeof window !== "undefined" ? !!localStorage.getItem("authToken") : false
  }

  // Get current user from localStorage
  getCurrentUser(): any | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }
}

// Export singleton instance
export const apiService = new ApiService()
