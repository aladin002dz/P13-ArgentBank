import { baseApi } from '../../api/baseApi';

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

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
