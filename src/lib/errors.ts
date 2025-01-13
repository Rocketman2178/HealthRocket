// Error handling utilities
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class AuthError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'AuthError';
  }
}

// Add specific error for empty results
export class EmptyResultError extends Error {
  constructor(message: string = 'No results found') {
    super(message);
    this.name = 'EmptyResultError';
  }
}

export function handleError(error: unknown): never {
  // Handle PGRST116 (no rows) errors specially
  if (error && typeof error === 'object' && 'code' in error && error.code === 'PGRST116') {
    throw new EmptyResultError();
  }

  if (error instanceof ConfigurationError) {
    console.error('Configuration Error:', error.message);
    throw error;
  }
  
  if (error instanceof AuthError) {
    console.error('Authentication Error:', error.message, error.originalError);
    throw error;
  }
  
  if (error instanceof DatabaseError) {
    console.error('Database Error:', error.message, error.originalError);
    throw error;
  }
  
  console.error('Unexpected Error:', error);
  throw error;
}