import { query } from "../../database/database.js";

import {
  searchAnime
} from "../anilist/anilist.service.js";

// --------------------------------------------------
// Search AniList
// --------------------------------------------------

export async function searchAniListAnime(
  search
) {
  const results =
    await searchAnime(search);

  return results;
}

// --------------------------------------------------
// Search local library
// --------------------------------------------------

export async function searchLibraryAnime(
  search
) {
  const result = await query(
    `
    SELECT
      a.id,
      a.anilist_id,

      a.title_romaji,
      a.title_english,
      a.title_native,

      a.description,

      a.cover_image,
      a.banner_image,

      a.format,
      a.status,

      a.total_episodes,
      a.duration,

      a.season,
      a.season_year,

      l.added_at

    FROM anime a

    JOIN library l
      ON l.anime_id = a.id

    WHERE
      a.title_romaji ILIKE $1
      OR a.title_english ILIKE $1
      OR a.title_native ILIKE $1

    ORDER BY
      l.added_at DESC
    `,
    [`%${search}%`]
  );

  return result.rows;
}

// --------------------------------------------------
// Search everything
// --------------------------------------------------

export async function searchDiscovery(
  search
) {
  const normalizedSearch =
    search?.trim();

  if (!normalizedSearch) {
    throw new Error(
      "Search query is required"
    );
  }

  const [
    aniListResults,
    libraryResults
  ] = await Promise.all([
    searchAniListAnime(
      normalizedSearch
    ),

    searchLibraryAnime(
      normalizedSearch
    )
  ]);

  return {
    query: normalizedSearch,

    anilist: {
      count: aniListResults.length,
      results: aniListResults
    },

    library: {
      count: libraryResults.length,
      results: libraryResults
    }
  };
}
