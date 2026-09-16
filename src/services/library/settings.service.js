import { query } from "../../database/database.js";

// --------------------------------------------------
// Default settings
// --------------------------------------------------

const DEFAULT_SETTINGS = {
  videoQuality: "1080p",
  autoplayNextEpisode: "true",
  autoResume: "true",
  autoMarkCompleted: "true",
  subtitleLanguage: "English",
  audioLanguage: "Japanese"
};

// --------------------------------------------------
// Ensure default settings
// --------------------------------------------------

async function ensureDefaultSettings() {
  for (const [key, value] of Object.entries(
    DEFAULT_SETTINGS
  )) {
    await query(
      `
      INSERT INTO app_settings (
        setting_key,
        setting_value
      )
      VALUES ($1, $2)

      ON CONFLICT (setting_key)
      DO NOTHING
      `,
      [key, value]
    );
  }
}

// --------------------------------------------------
// Get all settings
// --------------------------------------------------

export async function getSettings() {
  await ensureDefaultSettings();

  const result = await query(`
    SELECT
      setting_key,
      setting_value,
      updated_at

    FROM app_settings

    ORDER BY
      setting_key ASC
  `);

  const settings = {};

  for (const row of result.rows) {
    settings[row.setting_key] =
      row.setting_value;
  }

  return settings;
}

// --------------------------------------------------
// Get one setting
// --------------------------------------------------

export async function getSetting(
  key
) {
  await ensureDefaultSettings();

  const result = await query(
    `
    SELECT
      setting_key,
      setting_value,
      updated_at

    FROM app_settings

    WHERE setting_key = $1
    `,
    [key]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Update one setting
// --------------------------------------------------

export async function updateSetting(
  key,
  value
) {
  const result = await query(
    `
    INSERT INTO app_settings (
      setting_key,
      setting_value,
      updated_at
    )
    VALUES (
      $1,
      $2,
      CURRENT_TIMESTAMP
    )

    ON CONFLICT (setting_key)
    DO UPDATE SET
      setting_value = EXCLUDED.setting_value,
      updated_at = CURRENT_TIMESTAMP

    RETURNING *
    `,
    [key, String(value)]
  );

  return result.rows[0];
}

// --------------------------------------------------
// Update multiple settings
// --------------------------------------------------

export async function updateSettings(
  settings
) {
  const entries =
    Object.entries(settings || {});

  const updated = {};

  for (const [key, value] of entries) {
    const setting =
      await updateSetting(
        key,
        value
      );

    updated[setting.setting_key] =
      setting.setting_value;
  }

  return updated;
}

// --------------------------------------------------
// Reset settings
// --------------------------------------------------

export async function resetSettings() {
  await query(`
    DELETE FROM app_settings
  `);

  await ensureDefaultSettings();

  return getSettings();
}
