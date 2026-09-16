import {
  addAnimeToLibrary,
  getLibrary,
  removeAnimeFromLibrary,
  getAnimeLibraryDetails
} from "../services/library/library.service.js";

export async function addAnime(req, res, next) {
  try {
    const anime = req.body;

    if (!anime.anilistId) {
      return res.status(400).json({
        success: false,
        error: "anilistId is required"
      });
    }

    const result = await addAnimeToLibrary(anime);

    res.status(201).json({
      success: true,
      anime: result
    });
  } catch (error) {
    next(error);
  }
}

export async function getAll(req, res, next) {
  try {
    const library = await getLibrary();

    res.json({
      success: true,
      count: library.length,
      library
    });
  } catch (error) {
    next(error);
  }
}

export async function removeAnime(req, res, next) {
  try {
    const animeId = Number(req.params.id);

    if (!Number.isInteger(animeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID"
      });
    }

    const removed = await removeAnimeFromLibrary(animeId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: "Anime is not in your library"
      });
    }

    res.json({
      success: true,
      message: "Anime removed from library",
      animeId: removed.anime_id
    });
  } catch (error) {
    next(error);
  }
}

export async function getDetails(req, res, next) {
  try {
    const animeId = Number(req.params.id);

    if (!Number.isInteger(animeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID"
      });
    }

    const result = await getAnimeLibraryDetails(animeId);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Anime not found in your library"
      });
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}
