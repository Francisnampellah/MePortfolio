import { POSTS, type ArticleSection } from "./data";

/**
 * Article bodies, derived from the blog posts in content/posts.json.
 * Edit the post (lede + sections) in /admin to change an article.
 */
export type Article = { lede: string; sections: ArticleSection[] };

export const ARTICLES: Record<string, Article> = Object.fromEntries(
  POSTS.map((p) => [p.id, { lede: p.lede, sections: p.sections }])
);
