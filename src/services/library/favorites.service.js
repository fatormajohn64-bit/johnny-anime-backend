import { query } from "../../database/database.js";

// --------------------------------------------------
// Add anime favorite
// --------------------------------------------------

export async function addAnimeFavorite(
  animeId
) {
  const result = await query(
    `
    INSERT INTO favorites (
      anime_id
    )
    VALUES ($1)

    ON CONFLICT (anime_id)
    DO NOTHING

    RETURNING *
    `,
    [animeId]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Add movie favorite
// --------------------------------------------------

export async function addMovieFavorite(
  movieId
) {
  const result = await query(
    `
    INSERT INTO favorites (
      movie_id
    )
    VALUES ($1)

    ON CONFLICT (movie_id)
    DO NOTHING

    RETURNING *
    `,
    [movieId]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Remove anime favorite
// --------------------------------------------------

export async function removeAnimeFavorite(
  animeId
) {
  const result = await query(
    `
    DELETE FROM favorites
    WHERE anime_id = $1
    RETURNING *
    `,
    [animeId]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Remove movie favorite
// --------------------------------------------------

export async function removeMovieFavorite(
  movieId
) {
  const result = await query(
    `
    DELETE FROM favorites
    WHERE movie_id = $1
    RETURNING *
    `,
    [movieId]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Get all favorites
// --------------------------------------------------

export async function getFavorites() {
  const result = await query(
    `
    SELECT
      f.id,
      f.anime_id,
      f.movie_id,
      f.created_at,

      -- Anime

      a.title_romaji,
      a.title_english,
      a.title_native,

      a.cover_image,
      a.banner_image,

      -- Movie

      m.title AS movie_title,
      m.poster AS movie_poster,
      m.release_year AS movie_release_year

    FROM favorites f

    LEFT JOIN anime a
      ON a.id = f.anime_id

    LEFT JOIN movies m
      ON m.id = f.movie_id

    ORDER BY
      f.created_at DESC
    `
  );

  return result.rows;
}

// --------------------------------------------------
// Check anime favorite
// --------------------------------------------------

export async function isAnimeFavorite(
  animeId
) {
  const result = await query(
    `
    SELECT id
    FROM favorites
    WHERE anime_id = $1
    `,
    [animeId]
  );

  return result.rows.length > 0;
}

// --------------------------------------------------
// Check movie favorite
// --------------------------------------------------

export async function isMovieFavorite(
  movieId
) {
  const result = await query(
    `
    SELECT id
    FROM favorites
    WHERE movie_id = $1
    `,
    [movieId]
  );

  return result.rows.length > 0;
}
