import {
  createDownload,
  getEpisodeDownloads,
  getMovieDownloads,
  getDownloads,
  getDownloadById,
  updateDownloadStatus,
  deleteDownload
} from "../services/library/download.service.js";

// --------------------------------------------------
// Create
// --------------------------------------------------

export async function addDownload(
  req,
  res,
  next
) {
  try {
    const {
      episodeId,
      movieId,
      storageKey,
      fileName,
      mimeType,
      quality,
      format,
      sizeBytes,
      status
    } = req.body;

    if (!storageKey) {
      return res.status(400).json({
        success: false,
        error: "storageKey is required"
      });
    }

    const download =
      await createDownload({
        episodeId,
        movieId,
        storageKey,
        fileName,
        mimeType,
        quality,
        format,
        sizeBytes,
        status
      });

    res.status(201).json({
      success: true,
      download
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// All downloads
// --------------------------------------------------

export async function listDownloads(
  req,
  res,
  next
) {
  try {
    const downloads =
      await getDownloads();

    res.json({
      success: true,
      count: downloads.length,
      downloads
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Episode downloads
// --------------------------------------------------

export async function listEpisodeDownloads(
  req,
  res,
  next
) {
  try {
    const episodeId =
      Number(req.params.episodeId);

    if (!Number.isInteger(episodeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid episode ID"
      });
    }

    const downloads =
      await getEpisodeDownloads(
        episodeId
      );

    res.json({
      success: true,
      count: downloads.length,
      downloads
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Movie downloads
// --------------------------------------------------

export async function listMovieDownloads(
  req,
  res,
  next
) {
  try {
    const movieId =
      Number(req.params.movieId);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid movie ID"
      });
    }

    const downloads =
      await getMovieDownloads(
        movieId
      );

    res.json({
      success: true,
      count: downloads.length,
      downloads
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Get download
// --------------------------------------------------

export async function getDownload(
  req,
  res,
  next
) {
  try {
    const downloadId =
      Number(req.params.downloadId);

    if (!Number.isInteger(downloadId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid download ID"
      });
    }

    const download =
      await getDownloadById(
        downloadId
      );

    if (!download) {
      return res.status(404).json({
        success: false,
        error: "Download not found"
      });
    }

    res.json({
      success: true,
      download
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Update status
// --------------------------------------------------

export async function changeDownloadStatus(
  req,
  res,
  next
) {
  try {
    const downloadId =
      Number(req.params.downloadId);

    const { status } = req.body;

    if (!Number.isInteger(downloadId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid download ID"
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "status is required"
      });
    }

    const download =
      await updateDownloadStatus(
        downloadId,
        status
      );

    if (!download) {
      return res.status(404).json({
        success: false,
        error: "Download not found"
      });
    }

    res.json({
      success: true,
      download
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Delete
// --------------------------------------------------

export async function removeDownload(
  req,
  res,
  next
) {
  try {
    const downloadId =
      Number(req.params.downloadId);

    if (!Number.isInteger(downloadId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid download ID"
      });
    }

    const download =
      await deleteDownload(
        downloadId
      );

    if (!download) {
      return res.status(404).json({
        success: false,
        error: "Download not found"
      });
    }

    res.json({
      success: true,
      message: "Download record deleted"
    });
  } catch (error) {
    next(error);
  }
}
