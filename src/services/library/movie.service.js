import { query } from "../../database/database.js";

// --------------------------------------------------
// Create movie
// --------------------------------------------------

export async function createMovie({
  animeId = null,
  title,
  description = null,
  releaseYear = null,
  duration = null,
  poster = null
}) {
  if (!title) {
    throw new Error(
      "Movie title is required"
    );
  }

  const result = await query(
    `
    INSERT INTO movies (
      anime_id,
      title,
      description,
      release_year,
      duration,
      poster
    )
    VALUES (
      $1,$2,$3,$4,$5,$6
    )
    RETURNING *
    `,
    [
      animeId,
      title,
      description,
      releaseYear,
      duration,
      poster
    ]
  );

  return result.rows[0];
}

// --------------------------------------------------
// Get movie
// --------------------------------------------------

export async function getMovieById(
  movieId
) {
  const result = await query(
    `
    SELECT
      m.*,

      a.title_romaji,
      a.title_english,
      a.title_native,
      a.cover_image

    FROM movies m

    LEFT JOIN anime a
      ON a.id = m.anime_id

    WHERE m.id = $1
    `,
    [movieId]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Get movies for anime
// --------------------------------------------------

export async function getMoviesByAnime(
  animeId
) {
  const result = await query(
    `
    SELECT *
    FROM movies
    WHERE anime_id = $1
    ORDER BY
      release_year ASC NULLS LAST,
      id ASC
    `,
    [animeId]
  );

  return result.rows;
}

// --------------------------------------------------
// Update movie
// --------------------------------------------------

export async function updateMovie(
  movieId,
  data
) {
  const {
    title,
    description,
    releaseYear,
    duration,
    poster
  } = data;

  const result = await query(
    `
    UPDATE movies
    SET
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      release_year = COALESCE($4, release_year),
      duration = COALESCE($5, duration),
      poster = COALESCE($6, poster)
    WHERE id = $1
    RETURNING *
    `,
    [
      movieId,
      title ?? null,
      description ?? null,
      releaseYear ?? null,
      duration ?? null,
      poster ?? null
    ]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Delete movie
// --------------------------------------------------

export async function deleteMovie(
  movieId
) {
  const result = await query(
    `
    DELETE FROM movies
    WHERE id = $1
    RETURNING *
    `,
    [movieId]
  );

  return result.rows[0] || null;
}
