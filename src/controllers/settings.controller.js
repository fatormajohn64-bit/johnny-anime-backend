import {
  getSettings,
  getSetting,
  updateSetting,
  updateSettings,
  resetSettings
} from "../services/library/settings.service.js";

// --------------------------------------------------
// Get all settings
// --------------------------------------------------

export async function listSettings(
  req,
  res,
  next
) {
  try {
    const settings =
      await getSettings();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Get one setting
// --------------------------------------------------

export async function getOneSetting(
  req,
  res,
  next
) {
  try {
    const key =
      req.params.key?.trim();

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "Setting key is required"
      });
    }

    const setting =
      await getSetting(key);

    if (!setting) {
      return res.status(404).json({
        success: false,
        error: "Setting not found"
      });
    }

    res.json({
      success: true,
      setting
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Update one setting
// --------------------------------------------------

export async function setOneSetting(
  req,
  res,
  next
) {
  try {
    const key =
      req.params.key?.trim();

    const { value } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "Setting key is required"
      });
    }

    if (
      value === undefined ||
      value === null
    ) {
      return res.status(400).json({
        success: false,
        error: "Setting value is required"
      });
    }

    const setting =
      await updateSetting(
        key,
        value
      );

    res.json({
      success: true,
      setting
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Update multiple settings
// --------------------------------------------------

export async function setSettings(
  req,
  res,
  next
) {
  try {
    const settings =
      req.body?.settings;

    if (
      !settings ||
      typeof settings !== "object" ||
      Array.isArray(settings)
    ) {
      return res.status(400).json({
        success: false,
        error:
          "settings must be an object"
      });
    }

    const updated =
      await updateSettings(
        settings
      );

    res.json({
      success: true,
      settings: updated
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Reset settings
// --------------------------------------------------

export async function resetAllSettings(
  req,
  res,
  next
) {
  try {
    const settings =
      await resetSettings();

    res.json({
      success: true,
      message:
        "Settings reset to defaults",
      settings
    });
  } catch (error) {
    next(error);
  }
}
