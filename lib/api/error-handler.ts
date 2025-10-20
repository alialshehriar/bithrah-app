import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Centralized API error handler
 */
export function handleApiError(error: unknown, context?: string): NextResponse {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
  }

  // Handle known error types
  if (error instanceof Error) {
    // Database connection errors
    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        {
          success: false,
          error: 'خطأ في الاتصال بقاعدة البيانات',
          code: 'DB_CONNECTION_ERROR',
        },
        { status: 503 }
      );
    }

    // Authentication errors
    if (error.message.includes('unauthorized') || error.message.includes('token')) {
      return NextResponse.json(
        {
          success: false,
          error: 'غير مصرح بالوصول',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Validation errors
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return NextResponse.json(
        {
          success: false,
          error: 'بيانات غير صالحة',
          code: 'VALIDATION_ERROR',
          details: error.message,
        },
        { status: 400 }
      );
    }

    // Generic error with message
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === 'development' ? error.message : 'حدث خطأ غير متوقع',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }

  // Unknown error type
  return NextResponse.json(
    {
      success: false,
      error: 'حدث خطأ غير متوقع',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
}

/**
 * Safe async API handler wrapper
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  context?: string
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, context);
    }
  };
}

/**
 * Validate required fields
 */
export function validateRequired(data: any, fields: string[]): { valid: boolean; missing?: string[] } {
  const missing = fields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    return { valid: false, missing };
  }
  
  return { valid: true };
}

/**
 * Create success response
 */
export function successResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  );
}

/**
 * Create error response
 */
export function errorResponse(message: string, status: number = 400, code?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
    },
    { status }
  );
}

