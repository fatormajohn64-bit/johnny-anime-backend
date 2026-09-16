import { query } from "../../database/database.js";


// --------------------------------------------------
// Complete an episode and determine what comes next
// --------------------------------------------------

export async function completeEpisode(
  episodeId
) {
  const id = Number(episodeId);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      "Invalid episode ID"
    );
  }


  // ----------------------------------------------
  // Get current episode
  // ----------------------------------------------

  const currentResult =
    await query(
      `
        SELECT
          e.id,
          e.episode_number,
          e.title,
          e.season_id,

          s.season_number,
          s.anime_id

        FROM episodes e

        INNER JOIN seasons s
          ON s.id = e.season_id

        WHERE e.id = $1

        LIMIT 1
      `,
      [id]
    );


  if (
    currentResult.rows.length === 0
  ) {
    throw new Error(
      "Episode not found"
    );
  }


  const current =
    currentResult.rows[0];


  // ----------------------------------------------
  // Mark current episode completed
  // ----------------------------------------------

  await query(
    `
      INSERT INTO watch_progress (
        episode_id,
        position_seconds,
        duration_seconds,
        completed,
        updated_at
      )

      SELECT
        e.id,
        COALESCE(
          wp.position_seconds,
          0
        ),
        COALESCE(
          wp.duration_seconds,
          0
        ),
        TRUE,
        CURRENT_TIMESTAMP

      FROM episodes e

      LEFT JOIN watch_progress wp
        ON wp.episode_id = e.id

      WHERE e.id = $1

      ON CONFLICT (episode_id)

      DO UPDATE SET
        completed = TRUE,
        updated_at = CURRENT_TIMESTAMP
    `,
    [id]
  );


  // ----------------------------------------------
  // Find next episode in same season
  // ----------------------------------------------

  const nextEpisodeResult =
    await query(
      `
        SELECT
          e.id,
          e.episode_number,
          e.title,
          e.season_id

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


  if (
    nextEpisodeResult.rows.length > 0
  ) {
    return {
      completed: true,

      animeCompleted: false,

      currentEpisode: current,

      nextEpisode:
        nextEpisodeResult.rows[0],

      nextSeason: null
    };
  }


  // ----------------------------------------------
  // No more episodes in this season
  // Find next season
  // ----------------------------------------------

  const nextSeasonResult =
    await query(
      `
        SELECT
          s.id,
          s.season_number,
          s.title,
          s.anime_id

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


  if (
    nextSeasonResult.rows.length > 0
  ) {
    const nextSeason =
      nextSeasonResult.rows[0];


    // --------------------------------------------
    // First episode of next season
    // --------------------------------------------

    const firstEpisodeResult =
      await query(
        `
          SELECT
            e.id,
            e.episode_number,
            e.title,
            e.season_id

          FROM episodes e

          WHERE
            e.season_id = $1

          ORDER BY
            e.episode_number ASC

          LIMIT 1
        `,
        [nextSeason.id]
      );


    if (
      firstEpisodeResult.rows.length > 0
    ) {
      return {
        completed: true,

        animeCompleted: false,

        currentEpisode: current,

        nextEpisode:
          firstEpisodeResult.rows[0],

        nextSeason
      };
    }
  }


  // ----------------------------------------------
  // Anime has no more episodes
  // ----------------------------------------------

  return {
    completed: true,

    animeCompleted: true,

    currentEpisode: current,

    nextEpisode: null,

    nextSeason: null
  };
}
