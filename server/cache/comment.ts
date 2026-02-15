import { cache } from "react";
import { getCommentsByPostId } from "../services/comment";

/**
 * Cache: Memoizes the DB call for the duration of a single request.
 * Useful for multiple components on the same page needing comment data.
 */
export const getCachedComments = cache(async (postId: number) => {
  return getCommentsByPostId(postId);
});
