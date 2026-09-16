import {
  getAnimeById
} from "../anilist/anilist.service.js";

import { query } from "../../database/database.js";

// --------------------------------------------------
// Sync anime from AniList
// --------------------------------------------------

export async function syncAnimeFromAniList(
  anilistId
) {
  const anime = await getAnimeById(
    Number(anilistId)
  );

  if (!anime) {
    return null;
  }

  const result = await query(
    `
    INSERT INTO anime (
      anilist_id,

      title_romaji,
      title_english,
      title_native,

      description,

      cover_image,
      banner_image,

      format,
      status,

      total_episodes,
      duration,

      season,
      season_year
    )
    VALUES (
      $1,$2,$3,$4,
      $5,
      $6,$7,
      $8,$9,
      $10,$11,
      $12,$13
    )

    ON CONFLICT (anilist_id)
    DO UPDATE SET
      title_romaji = EXCLUDED.title_romaji,
      title_english = EXCLUDED.title_english,
      title_native = EXCLUDED.title_native,

      description = EXCLUDED.description,

      cover_image = EXCLUDED.cover_image,
      banner_image = EXCLUDED.banner_image,

      format = EXCLUDED.format,
      status = EXCLUDED.status,

      total_episodes = EXCLUDED.total_episodes,
      duration = EXCLUDED.duration,

      season = EXCLUDED.season,
      season_year = EXCLUDED.season_year,

      updated_at = CURRENT_TIMESTAMP

    RETURNING *
    `,
    [
      anime.id,

      anime.title?.romaji || null,
      anime.title?.english || null,
      anime.title?.native || null,

      anime.description || null,

      anime.coverImage?.large ||
        anime.coverImage?.medium ||
        null,

      anime.bannerImage || null,

      anime.format || null,
      anime.status || null,

      anime.episodes || null,
      anime.duration || null,

      anime.season || null,
      anime.seasonYear || null
    ]
  );

  return result.rows[0];
}

// --------------------------------------------------
// Add synced anime to library
// --------------------------------------------------

export async function syncAndAddToLibrary(
  anilistId
) {
  const anime =
    await syncAnimeFromAniList(
      anilistId
    );

  if (!anime) {
    return null;
  }

  await query(
    `
    INSERT INTO library (
      anime_id
    )
    VALUES ($1)

    ON CONFLICT (anime_id)
    DO NOTHING
    `,
    [anime.id]
  );

  return anime;
}

// --------------------------------------------------
// Get synchronized anime
// --------------------------------------------------

export async function getSyncedAnime(
  anilistId
) {
  const result = await query(
    `
    SELECT *
    FROM anime
    WHERE anilist_id = $1
    `,
    [anilistId]
  );

  return result.rows[0] || null;
}
