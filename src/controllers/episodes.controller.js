import {
  createSeason,
  getSeasons,
  createEpisode,
  getEpisodes,
  getEpisodeById
} from "../services/library/episodes.service.js";

// --------------------------------------------------
// Seasons
// --------------------------------------------------

export async function addSeason(req, res, next) {
  try {
    const animeId = Number(req.params.animeId);

    const {
      seasonNumber,
      title,
      description
    } = req.body;

    if (!Number.isInteger(animeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID"
      });
    }

    if (!Number.isInteger(seasonNumber)) {
      return res.status(400).json({
        success: false,
        error: "seasonNumber is required"
      });
    }

    const season = await createSeason(
      animeId,
      seasonNumber,
      title,
      description
    );

    res.status(201).json({
      success: true,
      season
    });
  } catch (error) {
    next(error);
  }
}

export async function listSeasons(req, res, next) {
  try {
    const animeId = Number(req.params.animeId);

    if (!Number.isInteger(animeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID"
      });
    }

    const seasons = await getSeasons(animeId);

    res.json({
      success: true,
      count: seasons.length,
      seasons
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Episodes
// --------------------------------------------------

export async function addEpisode(req, res, next) {
  try {
    const seasonId = Number(req.params.seasonId);

    const {
      episodeNumber,
      title,
      description,
      duration,
      thumbnail
    } = req.body;

    if (!Number.isInteger(seasonId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid season ID"
      });
    }

    if (!Number.isInteger(episodeNumber)) {
      return res.status(400).json({
        success: false,
        error: "episodeNumber is required"
      });
    }

    const episode = await createEpisode(
      seasonId,
      episodeNumber,
      title,
      description,
      duration,
      thumbnail
    );

    res.status(201).json({
      success: true,
      episode
    });
  } catch (error) {
    next(error);
  }
}

export async function listEpisodes(req, res, next) {
  try {
    const seasonId = Number(req.params.seasonId);

    if (!Number.isInteger(seasonId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid season ID"
      });
    }

    const episodes = await getEpisodes(seasonId);

    res.json({
      success: true,
      count: episodes.length,
      episodes
    });
  } catch (error) {
    next(error);
  }
}

export async function getEpisode(req, res, next) {
  try {
    const episodeId = Number(req.params.episodeId);

    if (!Number.isInteger(episodeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid episode ID"
      });
    }

    const episode = await getEpisodeById(episodeId);

    if (!episode) {
      return res.status(404).json({
        success: false,
        error: "Episode not found"
      });
    }

    res.json({
      success: true,
      episode
    });
  } catch (error) {
    next(error);
  }
}
