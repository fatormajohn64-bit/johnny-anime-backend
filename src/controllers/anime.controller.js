import {
  searchAnime,
  getAnimeById
} from "../services/anilist/anilist.service.js";

export async function search(req, res, next) {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Search query is required"
      });
    }

    const results = await searchAnime(query);

    res.json({
      success: true,
      query,
      count: results.length,
      results
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID"
      });
    }

    const anime = await getAnimeById(id);

    if (!anime) {
      return res.status(404).json({
        success: false,
        error: "Anime not found"
      });
    }

    res.json({
      success: true,
      anime
    });
  } catch (error) {
    next(error);
  }
}
