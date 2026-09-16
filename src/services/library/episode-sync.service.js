import {
  getAnimeById
} from "../anilist/anilist.service.js";

import { query } from "../../database/database.js";

export async function syncEpisodes(
  anilistId
) {
  const id = Number(anilistId);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      "Invalid AniList ID"
    );
  }

  const anime =
    await getAnimeById(id);

  if (!anime) {
    throw new Error(
      "Anime not found on AniList"
    );
  }

  const animeResult =
    await query(
      `
        SELECT
          id,
          anilist_id,
          title_romaji,
          title_english,
          title_native,
          total_episodes
        FROM anime
        WHERE anilist_id = $1
        LIMIT 1
      `,
      [id]
    );

  if (
    animeResult.rows.length === 0
  ) {
    throw new Error(
      "Anime must be synced to the local database before syncing episodes"
    );
  }

  const localAnime =
    animeResult.rows[0];

  const seasonResult =
    await query(
      `
        INSERT INTO seasons (
          anime_id,
          season_number,
          title,
          description
        )
        VALUES (
          $1,
          1,
          $2,
          $3
        )
        ON CONFLICT (
          anime_id,
          season_number
        )
        DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description

        RETURNING *
      `,
      [
        localAnime.id,
        anime?.season
          ? String(anime.season)
          : "Season 1",
        anime?.description || null
      ]
    );

  const season =
    seasonResult.rows[0];

  const totalEpisodes =
    Number(
      anime?.episodes ||
      localAnime.total_episodes ||
      0
    );

  if (
    !Number.isInteger(totalEpisodes) ||
    totalEpisodes <= 0
  ) {
    return {
      animeId:
        localAnime.id,
      anilistId: id,
      season,
      episodesCreated: 0,
      episodes: []
    };
  }

  const episodes = [];

  for (
    let episodeNumber = 1;
    episodeNumber <= totalEpisodes;
    episodeNumber++
  ) {
    const episodeResult =
      await query(
        `
          INSERT INTO episodes (
            season_id,
            episode_number,
            title,
            description,
            duration
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
          )
          ON CONFLICT (
            season_id,
            episode_number
          )
          DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            duration = EXCLUDED.duration

          RETURNING *
        `,
        [
          season.id,
          episodeNumber,
          `Episode ${episodeNumber}`,
          null,
          anime?.duration || null
        ]
      );

    episodes.push(
      episodeResult.rows[0]
    );
  }

  return {
    animeId:
      localAnime.id,

    anilistId: id,

    season,

    episodesCreated:
      episodes.length,

    episodes
  };
}

export async function getEpisodes(
  animeId
) {
  const id = Number(animeId);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      "Invalid anime ID"
    );
  }

  const animeResult =
    await query(
      `
        SELECT
          id,
          anilist_id,
          title_romaji,
          title_english,
          title_native
        FROM anime
        WHERE id = $1
        LIMIT 1
      `,
      [id]
    );

  if (
    animeResult.rows.length === 0
  ) {
    throw new Error(
      "Anime not found"
    );
  }

  const result =
    await query(
      `
        SELECT
          s.id AS season_id,
          s.season_number,
          s.title AS season_title,

          e.id AS episode_id,
          e.episode_number,
          e.title AS episode_title,
          e.description,
          e.duration,
          e.thumbnail,

          COALESCE(
            wp.position_seconds,
            0
          ) AS position_seconds,

          COALESCE(
            wp.duration_seconds,
            e.duration,
            0
          ) AS duration_seconds,

          COALESCE(
            wp.completed,
            FALSE
          ) AS completed

        FROM seasons s

        LEFT JOIN episodes e
          ON e.season_id = s.id

        LEFT JOIN watch_progress wp
          ON wp.episode_id = e.id

        WHERE s.anime_id = $1

        ORDER BY
          s.season_number ASC,
          e.episode_number ASC
      `,
      [id]
    );

  const seasons = [];

  for (
    const row of result.rows
  ) {
    let season =
      seasons.find(
        (item) =>
          item.seasonId ===
          row.season_id
      );

    if (!season) {
      season = {
        seasonId:
          row.season_id,

        seasonNumber:
          row.season_number,

        title:
          row.season_title,

        episodes: []
      };

      seasons.push(season);
    }

    if (row.episode_id) {
      season.episodes.push({
        id:
          row.episode_id,

        episodeNumber:
          row.episode_number,

        title:
          row.episode_title,

        description:
          row.description,

        duration:
          row.duration,

        thumbnail:
          row.thumbnail,

        progress: {
          positionSeconds:
            Number(
              row.position_seconds
            ),

          durationSeconds:
            Number(
              row.duration_seconds
            ),

          completed:
            Boolean(
              row.completed
            )
        }
      });
    }
  }

  return {
    anime:
      animeResult.rows[0],

    seasons
  };
}
