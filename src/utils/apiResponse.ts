import { ApiResponse } from "../types/apiResponse"

export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  }
}

export function errorResponse<T = undefined>(message: string, error?: string): ApiResponse<T> {
  return {
    success: false,
    message,
    error,
  }
}
