import { Post } from "../types";
import { api } from "./api";

export const postApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPost: builder.mutation<Post, FormData>({
            query: (postData) => ({
                url: '/posts',
                method: 'POST',
                body: postData
            })
        }),

        updatePost: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/posts/${id}`,
                method: 'PUT',
                body: formData
            }),
            invalidatesTags: ['Posts']
        }),

        getAllPosts: builder.query<Post[], void>({
            query: () => ({
                url: '/posts',
                method: 'GET'
            })
        }),

        getPostsByUser: builder.query<Post[], string>({
            query: (userId) => ({
                url: `/users/${userId}/posts`,
                method: 'GET'
            }),
            providesTags: ['Posts']
        }),

        getPostById: builder.query<Post, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: 'GET'
            })
        }),

        deletePost: builder.mutation<void, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: 'DELETE'
            })
        })
    })
})

export const {
    useCreatePostMutation,
    useGetAllPostsQuery,
    useGetPostByIdQuery,
    useDeletePostMutation,
    useLazyGetPostByIdQuery,
    useLazyGetAllPostsQuery,
    useUpdatePostMutation,
    useGetPostsByUserQuery
} = postApi;

export const {
    endpoints: { createPost, getAllPosts, getPostById, deletePost }
} = postApi;