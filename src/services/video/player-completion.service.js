import { query } from "../../database/database.js";

// --------------------------------------------------
// Complete episode and find next episode
// --------------------------------------------------

export async function completeEpisodeAndGetNext(
  episodeId
) {
  const client = await query(
    `
    UPDATE watch_progress
    SET
      completed = true,
      updated_at = CURRENT_TIMESTAMP
    WHERE episode_id = $1
    RETURNING *
    `,
    [episodeId]
  );

  // If progress does not exist yet,
  // create a completed progress record.
  if (!client.rows.length) {
    await query(
      `
      INSERT INTO watch_progress (
        episode_id,
        position_seconds,
        duration_seconds,
        completed
      )
      SELECT
        e.id,
        COALESCE(e.duration, 0),
        COALESCE(e.duration, 0),
        true
      FROM episodes e
      WHERE e.id = $1
      ON CONFLICT (episode_id)
      DO UPDATE SET
        completed = true,
        updated_at = CURRENT_TIMESTAMP
      `,
      [episodeId]
    );
  }

  const currentResult = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.season_id,

      s.season_number,
      s.anime_id

    FROM episodes e

    JOIN seasons s
      ON s.id = e.season_id

    WHERE e.id = $1
    `,
    [episodeId]
  );

  if (!currentResult.rows.length) {
    return null;
  }

  const current =
    currentResult.rows[0];

  // --------------------------------------------------
  // Find next episode in current season
  // --------------------------------------------------

  const nextEpisodeResult = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.thumbnail,
      e.duration

    FROM episodes e

    WHERE
      e.season_id = $1
      AND e.episode_number > $2

    ORDER BY
      e.episode_number ASC

    LIMIT 1
    `,
    [
      current.season_id,
      current.episode_number
    ]
  );

  if (nextEpisodeResult.rows.length) {
    return {
      completedEpisode: {
        id: current.id,
        episodeNumber:
          current.episode_number,
        title: current.title
      },

      next: {
        type: "episode",
        sameSeason: true,
        ...nextEpisodeResult.rows[0]
      }
    };
  }

  // --------------------------------------------------
  // Current season is finished.
  // Find next season.
  // --------------------------------------------------

  const nextSeasonResult = await query(
    `
    SELECT
      s.id,
      s.season_number,
      s.title

    FROM seasons s

    WHERE
      s.anime_id = $1
      AND s.season_number > $2

    ORDER BY
      s.season_number ASC

    LIMIT 1
    `,
    [
      current.anime_id,
      current.season_number
    ]
  );

  if (!nextSeasonResult.rows.length) {
    return {
      completedEpisode: {
        id: current.id,
        episodeNumber:
          current.episode_number,
        title: current.title
      },

      next: null,

      animeCompleted: true
    };
  }

  const nextSeason =
    nextSeasonResult.rows[0];

  // --------------------------------------------------
  // First episode of next season
  // --------------------------------------------------

  const firstEpisodeResult = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.thumbnail,
      e.duration

    FROM episodes e

    WHERE
      e.season_id = $1

    ORDER BY
      e.episode_number ASC

    LIMIT 1
    `,
    [nextSeason.id]
  );

  if (!firstEpisodeResult.rows.length) {
    return {
      completedEpisode: {
        id: current.id,
        episodeNumber:
          current.episode_number,
        title: current.title
      },

      next: null,

      nextSeason: {
        id: nextSeason.id,
        number:
          nextSeason.season_number,
        title:
          nextSeason.title
      }
    };
  }

  return {
    completedEpisode: {
      id: current.id,
      episodeNumber:
        current.episode_number,
      title: current.title
    },

    next: {
      type: "episode",
      sameSeason: false,

      seasonId:
        nextSeason.id,

      seasonNumber:
        nextSeason.season_number,

      seasonTitle:
        nextSeason.title,

      ...firstEpisodeResult.rows[0]
    }
  };
}
