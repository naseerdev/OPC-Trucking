export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Credentials {
  email: string;
  password: string;
}

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  code?: string;
  retryable?: boolean;
  timestamp: string;
}
