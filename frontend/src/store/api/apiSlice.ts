import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

interface ProfileResponse {
    status: number;
    message: string;
    body: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/api/v1',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Profile'],
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/user/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        getProfile: builder.query<ProfileResponse, void>({
            query: () => ({
                url: '/user/profile',
                method: 'POST',
            }),
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
            query: (profile) => ({
                url: '/user/profile',
                method: 'PUT',
                body: profile,
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const {
    useLoginMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
} = apiSlice;
