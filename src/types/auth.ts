export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent' | 'accountant';
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}