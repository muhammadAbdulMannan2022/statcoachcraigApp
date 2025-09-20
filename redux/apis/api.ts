import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a type for Post
export interface Post {
  id: number;
  title: string;
  body: string;
}

// API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://craigmvp.pythonanywhere.com/",
  }),
  endpoints: (builder) => ({
    createGame: builder.mutation({
      query: () => ({
        url: "api/create_game/",
        method: "POST",
      }),
    }),
    sendQuaterData: builder.mutation({
      query: (data) => ({
        url: "api/send_quarter_data/",
        method: "POST",
        body: data,
      }),
    }),
    getGameData: builder.query({
      query: (id) => `api/get_game_data/${id}/`,
    }),
    getQuaterData: builder.query({
      query: (data) =>
        `api/get_game_data_by_quarter/${data.game_id}/${data.quater_id}/`,
    }),
  }),
});

// Auto-generated hooks
export const {
  useCreateGameMutation,
  useSendQuaterDataMutation,
  useGetGameDataQuery,
  useGetQuaterDataQuery,
} = api;
