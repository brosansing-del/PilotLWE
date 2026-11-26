/**
 * Victims' Corner-only editorial article list.
 * No entries are pre-populated: do not substitute Opinions or development articles.
 * Add a verified original source, its title, and a short attributed description.
 */
export type VictimsArticle = {
  title: string;
  url: string;
  publisher: string;
  description: string;
  date?: string;
  location?: string;
  image?: string;
};

export const victimsArticles: VictimsArticle[] = [];
