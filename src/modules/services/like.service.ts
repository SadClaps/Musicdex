import "setimmediate";
import zipObject from "lodash-es/zipObject";
import Dataloader, { BatchLoadFn } from "dataloader";

import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useClient } from "../client";
import { DEFAULT_FETCH_CONFIG } from "./defaults";
import { useStoreState } from "../../store";
import { useEffect } from "react";

export const LIKE_QUERY_CONFIG = {
  ...DEFAULT_FETCH_CONFIG,
  refetchOnMount: false,
  keepPreviousData: true,
  staleTime: 1000 * 60 * 30, // 30 minute staleness.
};

export const useSongLikeUpdater = (
  callbacks: UseMutationOptions<
    any,
    unknown,
    { song_id: string; action: "add" | "delete" }
  > = {}
) => {
  const { AxiosInstance } = useClient();
  const queryClient = useQueryClient();

  return useMutation(
    async (payload) =>
      (
        await AxiosInstance("/musicdex/like", {
          method: payload.action === "delete" ? "DELETE" : "POST",
          data: { song_id: payload.song_id },
        })
      ).data,
    {
      ...callbacks,
      onSuccess: (data, payload, ...rest) => {
        queryClient.cancelQueries(["likedSongList"]);
        queryClient.invalidateQueries(["likedSongList"]);
        queryClient.invalidateQueries([LIKED_QUERY_KEY, payload.song_id]);
        if (callbacks.onSuccess) {
          callbacks.onSuccess(data, payload, ...rest);
        }
      },
    }
  );
};

export const useLikedSongs = (
  page?: number,
  config: UseQueryOptions<
    PaginatedSongs,
    unknown,
    PaginatedSongs,
    string[]
  > = {}
) => {
  // const queryClient = useQueryClient();
  const { AxiosInstance, uid } = useClient();

  const result = useQuery(
    ["likedSongList", uid, String(page || 1)],
    async (q): Promise<PaginatedSongs> => {
      const songs = (
        await AxiosInstance<PaginatedSongs>(
          `/musicdex/like?page=${Number.parseInt(q.queryKey[2]) ?? 1}`
        )
      ).data;
      songs?.content?.forEach((x) => (x.liked = true));
      return songs;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      ...config,
    }
  );

  return result;
};

export const LIKED_QUERY_KEY = "BLK:";
let dataloader: Dataloader<string, boolean, unknown> | undefined = undefined;
let dataLoaderToken: string | null = null;
export function useSongLikeCheck_Loader():
  | Dataloader<string, boolean, unknown>
  | undefined {
  const { AxiosInstance, isLoggedIn, token } = useClient();
  if (!isLoggedIn) {
    dataloader = undefined;
    dataLoaderToken = null;
    return;
  }

  if (token !== dataLoaderToken || !dataloader) {
    const fetchDataPromise: BatchLoadFn<string, boolean> = async (
      ids: readonly string[]
    ) => {
      const out = Array.from(new Set(ids));
      const resp = await AxiosInstance<boolean[]>(
        `/musicdex/like/check?song_id=${out.join(",")}`
      );
      const obj = zipObject(out, resp.data);
      return ids.map((x) => obj[x]);
    };

    dataloader = new Dataloader<string, boolean>(fetchDataPromise, {
      batchScheduleFn: (callback) => setTimeout(callback, 100),
      cache: false, // <-- IMPORTANT, dataloader doesn't have the same cache management as react-query
    });

    // Bind to this token, incase it gets refreshed or logged out
    dataLoaderToken = token;
  }

  return dataloader;
}

export function useSongLikeBulkCheck(songId: string) {
  const loader = useSongLikeCheck_Loader();
  const user = useStoreState((state) => state.auth.user);
  const result = useQuery(
    [LIKED_QUERY_KEY, songId, user?.id ?? "na"],
    () => {
      if (loader) return loader.load(songId);
      else return false;
    },
    LIKE_QUERY_CONFIG
  );
  return result;
}
