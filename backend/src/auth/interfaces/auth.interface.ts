export interface JwtPayload {
  sub: string; // User ID
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId?: string;
  sessionId: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId?: string;
    isEmailVerified: boolean;
    lastLoginAt?: Date;
  };
  tokens: AuthTokens;
  session: {
    id: string;
    expiresAt: Date;
    rememberMe: boolean;
  };
}

export interface RequestUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId?: string;
  sessionId: string;
}
