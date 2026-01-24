import { cache } from "react";
import { getPostBySlug } from "../services/post";

/**
 * Cache: Memoizes the DB call for the duration of a single request.
 * This allows Metadata and the Page to call the same function without
 * hitting the database twice.
 */
export const getCachedPost = cache(async (slug: string) => {
  return getPostBySlug(slug);
});