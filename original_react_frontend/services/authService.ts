import { apiClient, simDb, delay } from './api';
import { AuthResponse, Role, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    // If external Spring Boot URL is configured, try real HTTP call first
    if (import.meta.env.VITE_API_URL) {
      try {
        const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
        localStorage.setItem('stylecart_token', response.data.token);
        localStorage.setItem('stylecart_user', JSON.stringify(response.data));
        return response.data;
      } catch (err) {
        console.warn('Real backend call failed, falling back to local simulation:', err);
      }
    }

    await delay(200);

    const users = simDb.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw {
        response: {
          status: 401,
          data: {
            timestamp: new Date().toISOString(),
            status: 401,
            message: 'Invalid email or password',
            path: '/api/auth/login',
          },
        },
      };
    }

    // Mock JWT token generation
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXIuZW1haWx9IiwidXNlcklkIjoke3VzZXIuaWR9LCJyb2xlIjoiJHt1c2VyLnJvbGV9In0.simulated_signature_${Date.now()}`;

    const authData: AuthResponse = {
      token: mockToken,
      tokenType: 'Bearer',
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    localStorage.setItem('stylecart_token', mockToken);
    localStorage.setItem('stylecart_user', JSON.stringify(authData));
    return authData;
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role?: Role;
  }): Promise<AuthResponse> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        localStorage.setItem('stylecart_token', response.data.token);
        localStorage.setItem('stylecart_user', JSON.stringify(response.data));
        return response.data;
      } catch (err) {
        console.warn('Real backend call failed, falling back to simulation:', err);
      }
    }

    await delay(250);

    const users = simDb.getUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw {
        response: {
          status: 400,
          data: {
            timestamp: new Date().toISOString(),
            status: 400,
            message: 'Error: Email is already in use!',
            path: '/api/auth/register',
          },
        },
      };
    }

    const newUser: User = {
      id: Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role || 'ROLE_USER',
      phoneNumber: data.phoneNumber,
      createdAt: new Date().toISOString(),
      totalOrders: 0,
    };

    users.push(newUser);
    simDb.saveUsers(users);

    const mockToken = `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIke25ld1VzZXIuZW1haWx9Iiwicm9sZSI6IiR7bmV3VXNlci5yb2xlfSJ9.simulated_sig_${Date.now()}`;

    const authData: AuthResponse = {
      token: mockToken,
      tokenType: 'Bearer',
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
    };

    localStorage.setItem('stylecart_token', mockToken);
    localStorage.setItem('stylecart_user', JSON.stringify(authData));
    return authData;
  },

  logout() {
    localStorage.removeItem('stylecart_token');
    localStorage.removeItem('stylecart_user');
  },

  getCurrentUser(): AuthResponse | null {
    try {
      const stored = localStorage.getItem('stylecart_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};
