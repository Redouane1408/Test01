// Create a mock API with interceptors that don't actually make network requests
class MockApi {
    defaults = {
      headers: {
        common: {
          Authorization: null,
        },
      },
    }
  
    // Mock GET request
    async get(url: string) {
      console.log(`Mock GET request to ${url}`)
  
      // Return mock data based on the URL
      if (url === "/api/users/me") {
        return {
          data: {
            id: "USR-001",
            name: "Ahmed Benali",
            email: "ahmed.benali@finances.gov",
            role: "ADMIN",
            department: "Direction Générale",
            createdAt: new Date().toISOString(),
          },
        }
      }
  
      return { data: [] }
    }
  
    // Mock POST request
    async post(url: string, data: any) {
      console.log(`Mock POST request to ${url}`, data)
  
      // Handle login
      if (url === "/api/auth/login") {
        return {
          data: {
            token: "mock-jwt-token-" + Math.random().toString(36).substring(2),
          },
        }
      }
  
      return { data: { success: true } }
    }
  
    // Mock PUT request
    async put(url: string, data: any) {
      console.log(`Mock PUT request to ${url}`, data)
      return { data: { success: true } }
    }
  
    // Mock DELETE request
    async delete(url: string) {
      console.log(`Mock DELETE request to ${url}`)
      return { data: { success: true } }
    }
  
    // Mock interceptors
    interceptors = {
      request: {
        use: (fulfilled: any, rejected: any) => {
          console.log("Mock request interceptor registered")
          return 0
        },
      },
      response: {
        use: (fulfilled: any, rejected: any) => {
          console.log("Mock response interceptor registered")
          return 0
        },
      },
    }
  }
  
  // Export the mock API instance
  export const api = new MockApi() as any
  