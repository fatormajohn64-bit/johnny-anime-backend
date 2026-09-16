import {
  searchAnime
} from "../anilist/anilist.service.js";

import { query } from "../../database/database.js";


// --------------------------------------------------
// Search AniList
// --------------------------------------------------

export async function searchAniListAnime(
  search
) {
  return searchAnime(search);
}


// --------------------------------------------------
// Search local library
// --------------------------------------------------

export async function searchLibraryAnime(
  search
) {
  if (
    typeof search !== "string" ||
    !search.trim()
  ) {
    throw new Error(
      "Search query is required"
    );
  }

  const value =
    search.trim();

  if (value.length > 100) {
    throw new Error(
      "Search query is too long"
    );
  }

  const result =
    await query(
      `
        SELECT
          a.id,
          a.anilist_id,
          a.title_romaji,
          a.title_english,
          a.title_native,
          a.cover_image,
          a.banner_image,
          a.format,
          a.status,
          a.total_episodes,
          a.season,
          a.season_year,

          l.added_at

        FROM anime a

        INNER JOIN library l
          ON l.anime_id = a.id

        WHERE
          a.title_romaji ILIKE $1
          OR a.title_english ILIKE $1
          OR a.title_native ILIKE $1

        ORDER BY
          a.title_romaji ASC
      `,
      [`%${value}%`]
    );

  return result.rows;
}


// --------------------------------------------------
// Combined discovery search
// --------------------------------------------------

export async function searchDiscovery(
  search
) {
  const [
    anilist,
    library
  ] = await Promise.all([
    searchAniListAnime(search),
    searchLibraryAnime(search)
  ]);

  return {
    anilist,
    library
  };
}
