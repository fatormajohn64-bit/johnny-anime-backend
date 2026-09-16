import { query } from "./database.js";

export async function initializeDatabase() {
  await query(`
    -- --------------------------------------------------
    -- Anime
    -- --------------------------------------------------

    CREATE TABLE IF NOT EXISTS anime (
      id SERIAL PRIMARY KEY,

      anilist_id INTEGER UNIQUE,

      title_romaji TEXT,
      title_english TEXT,
      title_native TEXT,

      description TEXT,

      cover_image TEXT,
      banner_image TEXT,

      format TEXT,
      status TEXT,

      total_episodes INTEGER,
      duration INTEGER,

      season TEXT,
      season_year INTEGER,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


    -- --------------------------------------------------
    -- Seasons
    -- --------------------------------------------------

    CREATE TABLE IF NOT EXISTS seasons (
      id SERIAL PRIMARY KEY,

      anime_id INTEGER NOT NULL
        REFERENCES anime(id)
        ON DELETE CASCADE,

      season_number INTEGER NOT NULL,

      title TEXT,
      description TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(anime_id, season_number)
    );


    -- --------------------------------------------------
    -- Episodes
    -- --------------------------------------------------

    CREATE TABLE IF NOT EXISTS episodes (
      id SERIAL PRIMARY KEY,

      season_id INTEGER NOT NULL
        REFERENCES seasons(id)
        ON DELETE CASCADE,

      episode_number INTEGER NOT NULL,

      title TEXT,
      description TEXT,

      duration INTEGER,

      thumbnail TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(season_id, episode_number)
    );


    -- --------------------------------------------------
    -- Movies
    -- --------------------------------------------------

    CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,

      anime_id INTEGER
        REFERENCES anime(id)
        ON DELETE CASCADE,

      title TEXT NOT NULL,

      description TEXT,

      release_year INTEGER,

      duration INTEGER,

      poster TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


    -- --------------------------------------------------
    -- Video Sources
    -- --------------------------------------------------

    CREATE TABLE IF NOT EXISTS video_sources (
      id SERIAL PRIMARY KEY,

      episode_id INTEGER
        REFERENCES episodes(id)
        ON DELETE CASCADE,

      movie_id INTEGER
        REFERENCES movies(id)
        ON DELETE CASCADE,

      source_type TEXT NOT NULL,

      source_url TEXT,

      quality TEXT,

      format TEXT,

      size_bytes BIGINT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


    -- --------------------------------------------------
    -- Watch Progress
    -- --------------------------------------------------

    CREATE TABLE IF NOT EXISTS watch_progress (
      id SERIAL PRIMARY KEY,

      episode_id INTEGER
        REFERENCES episodes(id)
        ON DELETE CASCADE,

      movie_id INTEGER
        REFERENCES movies(id)
        ON DELETE CASCADE,

      position_seconds DOUBLE PRECISION DEFAULT 0,

      duration_seconds DOUBLE PRECISION DEFAULT 0,

      completed BOOLEAN DEFAULT FALSE,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(episode_id),
      UNIQUE(movie_id)
    );


    -- --------------------------------------------------
    -- Library
    -- --------------------------------------------------

    CREATE TABLE IF NOT EXISTS library (
      id SERIAL PRIMARY KEY,

      anime_id INTEGER
        REFERENCES anime(id)
        ON DELETE CASCADE,

      movie_id INTEGER
        REFERENCES movies(id)
        ON DELETE CASCADE,

      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(anime_id),
      UNIQUE(movie_id)
    );


    -- --------------------------------------------------
    -- Favorites
    -- --------------------------------------------------

    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,

      anime_id INTEGER
        REFERENCES anime(id)
        ON DELETE CASCADE,

      movie_id INTEGER
        REFERENCES movies(id)
        ON DELETE CASCADE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(anime_id),
      UNIQUE(movie_id)
    );


    -- --------------------------------------------------
    -- Browser Downloads
    -- --------------------------------------------------

    CREATE TABLE IF NOT EXISTS downloads (
      id SERIAL PRIMARY KEY,

      episode_id INTEGER
        REFERENCES episodes(id)
        ON DELETE CASCADE,

      movie_id INTEGER
        REFERENCES movies(id)
        ON DELETE CASCADE,

      storage_key TEXT NOT NULL UNIQUE,

      file_name TEXT,

      mime_type TEXT,

      quality TEXT,

      format TEXT,

      size_bytes BIGINT,

      status TEXT DEFAULT 'ready',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


    -- --------------------------------------------------
    -- Indexes
    -- --------------------------------------------------

    CREATE INDEX IF NOT EXISTS idx_seasons_anime_id
      ON seasons(anime_id);


    CREATE INDEX IF NOT EXISTS idx_episodes_season_id
      ON episodes(season_id);


    CREATE INDEX IF NOT EXISTS idx_video_sources_episode_id
      ON video_sources(episode_id);


    CREATE INDEX IF NOT EXISTS idx_video_sources_movie_id
      ON video_sources(movie_id);


    CREATE INDEX IF NOT EXISTS idx_watch_progress_updated
      ON watch_progress(updated_at);


    CREATE INDEX IF NOT EXISTS idx_downloads_episode_id
      ON downloads(episode_id);


    CREATE INDEX IF NOT EXISTS idx_downloads_movie_id
      ON downloads(movie_id);


    CREATE INDEX IF NOT EXISTS idx_downloads_updated
      ON downloads(updated_at);


    CREATE INDEX IF NOT EXISTS idx_favorites_anime_id
      ON favorites(anime_id);


    CREATE INDEX IF NOT EXISTS idx_favorites_movie_id
      ON favorites(movie_id);
  `);

  console.log("Database initialized");
}
