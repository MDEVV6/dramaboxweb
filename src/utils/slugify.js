/**
 * Slugify Utility
 * Converts text to URL-friendly slugs
 */

/**
 * Convert text to URL-friendly slug
 * @param {string} text - Text to slugify
 * @returns {string} URL-friendly slug
 */
export const slugify = (text) => {
    if (!text) return '';

    return text
        .toString()
        .toLowerCase()
        .trim()
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove special characters except hyphens
        .replace(/[^\w\-]+/g, '')
        // Replace multiple hyphens with single hyphen
        .replace(/\-\-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

/**
 * Generate SEO-friendly slug from drama object
 * @param {object} drama - Drama object with name/bookName
 * @returns {string} SEO-friendly slug
 */
export const generateDramaSlug = (drama) => {
    if (!drama) return '';

    const title = drama.name || drama.bookName || drama.title || '';
    return slugify(title);
};

/**
 * Generate full drama URL with ID and slug
 * @param {object} drama - Drama object
 * @returns {string} Full URL path
 */
export const getDramaUrl = (drama) => {
    if (!drama) return '/';

    const id = drama.id || drama.bookId;
    const slug = generateDramaSlug(drama);

    if (slug) {
        return `/drama/${id}/${slug}`;
    }

    return `/drama/${id}`;
};

/**
 * Generate watch URL with ID, episode, and slug
 * @param {object} drama - Drama object
 * @param {number} episode - Episode number
 * @returns {string} Full watch URL path
 */
export const getWatchUrl = (drama, episode) => {
    if (!drama || !episode) return '/';

    const id = drama.id || drama.bookId;
    const slug = generateDramaSlug(drama);

    if (slug) {
        // Format: /watch/id/slug/episode
        return `/watch/${id}/${slug}/${episode}`;
    }

    return `/watch/${id}/${episode}`;
};

/**
 * Generate article slug from title
 * @param {string} title - Article title
 * @returns {string} Article slug
 */
export const generateArticleSlug = (title) => {
    return slugify(title);
};

/**
 * Get article URL
 * @param {object} article - Article object with id and slug
 * @returns {string} Article URL
 */
export const getArticleUrl = (article) => {
    if (!article) return '/';

    const slug = article.slug || generateArticleSlug(article.title);
    return `/artikel/${slug}`;
};
