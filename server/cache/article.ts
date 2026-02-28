import { cache } from "react";
import { getArticleBySlug } from "../services/article";

/**
 * Cache: Memoizes the DB call for the duration of a single request.
 * This allows Metadata and the Page to call the same function without
 * hitting the database twice.
 */
export const getCachedArticle = cache(async (slug: string) => {
  return getArticleBySlug(slug);
});