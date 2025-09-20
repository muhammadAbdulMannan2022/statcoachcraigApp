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
    getQuaterData: builder.query<
      any, // response type
      { game_id: string; quater_id: string } // argument type
    >({
      query: ({ game_id, quater_id }) => {
        console.log(game_id, quater_id, "rtk query params");
        return `api/get_game_data_by_quarter/${game_id}/${quater_id}/`;
      },
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
