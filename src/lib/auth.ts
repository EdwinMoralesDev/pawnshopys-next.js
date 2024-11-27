import { UserRole } from './types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  storeId?: string;
  avatar?: string;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  storeName?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// Simulated auth service (replace with actual backend integration)
class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    this.currentUser = {
      id: '1',
      email: credentials.email,
      name: 'John Doe',
      role: UserRole.CUSTOMER,
    };
    
    return this.currentUser;
  }

  async loginWithGoogle(): Promise<AuthUser> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful Google login
    this.currentUser = {
      id: '1',
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      role: UserRole.CUSTOMER,
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
    };
    
    return this.currentUser;
  }

  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful registration
    this.currentUser = {
      id: '1',
      email: credentials.email,
      name: credentials.name,
      role: credentials.role,
      storeId: credentials.role === UserRole.STORE_OWNER ? '1' : undefined,
    };
    
    return this.currentUser;
  }

  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    // Update user data
    this.currentUser = {
      ...this.currentUser,
      ...data,
    };

    return this.currentUser;
  }

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.currentUser;
  }
}

export const authService = AuthService.getInstance();