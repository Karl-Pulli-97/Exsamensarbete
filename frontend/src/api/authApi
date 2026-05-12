import { apiClient } from '../lib/apiClient';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const authApi = {
    login: (data: LoginRequest) =>
        apiClient.post<AuthResponse>('/auth/login', data),

    register: (data: RegisterRequest) =>
        apiClient.post<AuthResponse>('/auth/register', data),
};