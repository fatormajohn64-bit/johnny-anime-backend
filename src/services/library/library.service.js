import { query } from "../../database/database.js";

export async function addAnimeToLibrary(animeData) {
  const {
    anilistId,
    titleRomaji,
    titleEnglish,
    titleNative,
    description,
    coverImage,
    bannerImage,
    format,
    status,
    totalEpisodes,
    duration,
    season,
    seasonYear
  } = animeData;

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
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
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
      anilistId,
      titleRomaji,
      titleEnglish,
      titleNative,
      description,
      coverImage,
      bannerImage,
      format,
      status,
      totalEpisodes,
      duration,
      season,
      seasonYear
    ]
  );

  const anime = result.rows[0];

  await query(
    `
    INSERT INTO library (anime_id)
    VALUES ($1)
    ON CONFLICT (anime_id)
    DO NOTHING
    `,
    [anime.id]
  );

  return anime;
}

export async function getLibrary() {
  const result = await query(`
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
    FROM library l
    JOIN anime a
      ON a.id = l.anime_id
    ORDER BY l.added_at DESC
  `);

  return result.rows;
}

export async function removeAnimeFromLibrary(animeId) {
  const result = await query(
    `
    DELETE FROM library
    WHERE anime_id = $1
    RETURNING anime_id
    `,
    [animeId]
  );

  return result.rows[0] || null;
}

export async function getAnimeLibraryDetails(animeId) {
  const animeResult = await query(
    `
    SELECT
      a.*,
      l.added_at
    FROM anime a
    JOIN library l
      ON l.anime_id = a.id
    WHERE a.id = $1
    `,
    [animeId]
  );

  if (!animeResult.rows.length) {
    return null;
  }

  const seasonsResult = await query(
    `
    SELECT *
    FROM seasons
    WHERE anime_id = $1
    ORDER BY season_number ASC
    `,
    [animeId]
  );

  const moviesResult = await query(
    `
    SELECT *
    FROM movies
    WHERE anime_id = $1
    ORDER BY release_year ASC NULLS LAST, id ASC
    `,
    [animeId]
  );

  return {
    anime: animeResult.rows[0],
    seasons: seasonsResult.rows,
    movies: moviesResult.rows
  };
}
