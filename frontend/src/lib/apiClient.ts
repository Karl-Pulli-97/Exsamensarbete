const API_BASE_URL = 'http://localhost:5008/api';

class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        const hadToken = localStorage.getItem('token') !== null;
        if (hadToken) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
        const text = await response.text();
        let message = response.statusText;
        if (text) {
            try {
                const parsed = JSON.parse(text);
                message = parsed.message || text;
            } catch {
                message = text;
            }
        }
        throw new ApiError(response.status, message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : undefined as T;
}

export const apiClient = {
    get: <T>(endpoint: string) => request<T>(endpoint),

    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string) =>
        request<T>(endpoint, { method: 'DELETE' }),
};