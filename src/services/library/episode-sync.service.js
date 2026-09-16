import { query } from "../../database/database.js";

import {
  getAnimeById
} from "../anilist/anilist.service.js";

// --------------------------------------------------
// Find local anime by AniList ID
// --------------------------------------------------

async function getLocalAnimeByAniListId(
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

// --------------------------------------------------
// Create or update season
// --------------------------------------------------

async function upsertSeason(
  animeId,
  seasonNumber,
  title = null,
  description = null
) {
  const result = await query(
    `
    INSERT INTO seasons (
      anime_id,
      season_number,
      title,
      description
    )
    VALUES ($1, $2, $3, $4)

    ON CONFLICT (anime_id, season_number)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description

    RETURNING *
    `,
    [
      animeId,
      seasonNumber,
      title,
      description
    ]
  );

  return result.rows[0];
}

// --------------------------------------------------
// Create or update episode
// --------------------------------------------------

async function upsertEpisode(
  seasonId,
  episodeNumber
) {
  const result = await query(
    `
    INSERT INTO episodes (
      season_id,
      episode_number
    )
    VALUES ($1, $2)

    ON CONFLICT (season_id, episode_number)
    DO UPDATE SET
      episode_number = EXCLUDED.episode_number

    RETURNING *
    `,
    [
      seasonId,
      episodeNumber
    ]
  );

  return result.rows[0];
}

// --------------------------------------------------
// Synchronize episodes
// --------------------------------------------------

export async function syncEpisodesFromAniList(
  anilistId
) {
  const numericId = Number(anilistId);

  if (!Number.isInteger(numericId)) {
    throw new Error(
      "Invalid AniList ID"
    );
  }

  const anilistAnime =
    await getAnimeById(numericId);

  if (!anilistAnime) {
    return null;
  }

  const localAnime =
    await getLocalAnimeByAniListId(
      numericId
    );

  if (!localAnime) {
    throw new Error(
      "Anime must be synchronized before episodes"
    );
  }

  const totalEpisodes =
    Number(anilistAnime.episodes || 0);

  if (totalEpisodes <= 0) {
    return {
      anime: localAnime,
      season: null,
      episodes: []
    };
  }

  // ------------------------------------------------
  // AniList's season/year describes the anime's
  // release season, not necessarily a DVD/streaming
  // season structure.
  //
  // We therefore use Season 1 as the default local
  // episode container unless a richer episode source
  // is added later.
  // ------------------------------------------------

  const season =
    await upsertSeason(
      localAnime.id,
      1,
      null,
      null
    );

  const episodes = [];

  for (
    let episodeNumber = 1;
    episodeNumber <= totalEpisodes;
    episodeNumber++
  ) {
    const episode =
      await upsertEpisode(
        season.id,
        episodeNumber
      );

    episodes.push(episode);
  }

  return {
    anime: localAnime,
    season,
    episodes
  };
}

// --------------------------------------------------
// Get synchronization summary
// --------------------------------------------------

export async function getEpisodeSyncSummary(
  animeId
) {
  const animeResult = await query(
    `
    SELECT *
    FROM anime
    WHERE id = $1
    `,
    [animeId]
  );

  if (!animeResult.rows.length) {
    return null;
  }

  const seasonsResult = await query(
    `
    SELECT
      s.id,
      s.season_number,
      s.title,

      COUNT(e.id)::INTEGER AS episode_count

    FROM seasons s

    LEFT JOIN episodes e
      ON e.season_id = s.id

    WHERE s.anime_id = $1

    GROUP BY
      s.id,
      s.season_number,
      s.title

    ORDER BY
      s.season_number ASC
    `,
    [animeId]
  );

  return {
    anime: animeResult.rows[0],
    seasons: seasonsResult.rows
  };
}
