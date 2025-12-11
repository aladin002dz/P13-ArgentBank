import { baseApi } from '../../api/baseApi';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    status: number;
    message: string;
    body: {
        token: string;
    };
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/user/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation } = authApi;
