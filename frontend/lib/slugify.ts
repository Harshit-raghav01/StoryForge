/**
 * Shared slug utility — used by both authorService and bookService.
 * Extracted from authorService to prevent code duplication.
 */

/**
 * Converts any string into a URL-safe lowercase slug.
 * "Harshit Raghav" → "harshit-raghav"
 * "The Dragon's Lair!" → "the-dragons-lair"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')           // remove apostrophes before slug generation
    .replace(/_/g, '-')             // underscores become hyphens
    .replace(/\s+/g, '-')          // spaces become hyphens
    .replace(/-+/g, '-')           // collapse multiple hyphens
    .replace(/[^a-z0-9-]/g, '');   // remove any remaining non-alphanumeric chars
}

/**
 * Generates a book slug by combining book title + author slug.
 * "The Dragon's Lair" + "raven-blackwell" → "the-dragons-lair-raven-blackwell"
 * This makes book slugs globally unique per author without needing a random suffix.
 */
export function generateBookSlug(title: string, authorSlug: string): string {
  return `${slugify(title)}-${authorSlug}`;
}

/**
 * Resolves slug collisions by appending -2, -3 etc.
 * Pass a function that checks if a given slug already exists in the database.
 */
export async function resolveSlugCollision(
  baseSlug: string,
  existsCheck: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let suffix = 2;
  while (await existsCheck(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }
  return slug;
}
