import {
  createDownload,
  updateDownloadStatus,
  getDownload,
  getDownloads,
  deleteDownload
} from "../services/library/download-manager.service.js";

// --------------------------------------------------
// Create
// --------------------------------------------------

export async function create(
  req,
  res,
  next
) {
  try {
    const download =
      await createDownload(
        req.body
      );

    res.status(201).json({
      success: true,
      download
    });
  } catch (error) {
    next(error);
  }
}


// --------------------------------------------------
// Get all
// --------------------------------------------------

export async function getAll(
  req,
  res,
  next
) {
  try {
    const status =
      req.query.status?.trim() ||
      null;

    const downloads =
      await getDownloads(status);

    res.json({
      success: true,

      count:
        downloads.length,

      downloads
    });
  } catch (error) {
    next(error);
  }
}


// --------------------------------------------------
// Get one
// --------------------------------------------------

export async function getOne(
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
      await getDownload(
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

export async function updateStatus(
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

    const {
      status
    } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required"
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

export async function remove(
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

      message:
        "Download metadata removed",

      download
    });
  } catch (error) {
    next(error);
  }
}
