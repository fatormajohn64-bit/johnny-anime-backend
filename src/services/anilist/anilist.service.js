import { anilistConfig } from "../../config/api.js";
import { httpJson } from "../../utils/http-client.js";


// --------------------------------------------------
// Validate search text
// --------------------------------------------------

function validateSearch(search) {
  if (
    typeof search !== "string"
  ) {
    throw new Error(
      "Search must be a string"
    );
  }

  const value =
    search.trim();

  if (!value) {
    throw new Error(
      "Search query is required"
    );
  }

  if (value.length > 100) {
    throw new Error(
      "Search query is too long"
    );
  }

  return value;
}


// --------------------------------------------------
// Validate AniList ID
// --------------------------------------------------

function validateAnimeId(id) {
  const animeId =
    Number(id);

  if (
    !Number.isInteger(animeId) ||
    animeId <= 0
  ) {
    throw new Error(
      "Invalid AniList anime ID"
    );
  }

  return animeId;
}


// --------------------------------------------------
// AniList API request
// --------------------------------------------------

async function anilistRequest(
  query,
  variables = {}
) {
  const response =
    await httpJson(
      anilistConfig.baseUrl,
      {
        method: "POST",

        body: {
          query,
          variables
        },

        timeout: 15000
      }
    );

  const data =
    response.data;

  if (
    !data ||
    typeof data !== "object"
  ) {
    throw new Error(
      "Invalid response from AniList"
    );
  }

  if (data.errors) {
    const message =
      data.errors?.[0]?.message ||
      "AniList request failed";

    throw new Error(message);
  }

  if (!data.data) {
    throw new Error(
      "AniList returned no data"
    );
  }

  return data.data;
}


// --------------------------------------------------
// Search anime
// --------------------------------------------------

export async function searchAnime(
  search
) {
  const validatedSearch =
    validateSearch(search);

  const query = `
    query ($search: String) {
      Page(
        page: 1,
        perPage: 20
      ) {
        media(
          search: $search,
          type: ANIME,
          sort: SEARCH_MATCH
        ) {
          id
          idMal

          title {
            romaji
            english
            native
          }

          type
          format
          status

          episodes
          duration

          season
          seasonYear

          coverImage {
            large
            medium
          }

          bannerImage

          description(
            asHtml: false
          )

          genres

          averageScore

          startDate {
            year
            month
            day
          }

          endDate {
            year
            month
            day
          }
        }
      }
    }
  `;

  const data =
    await anilistRequest(
      query,
      {
        search: validatedSearch
      }
    );

  return (
    data.Page?.media || []
  );
}


// --------------------------------------------------
// Get anime by AniList ID
// --------------------------------------------------

export async function getAnimeById(
  id
) {
  const animeId =
    validateAnimeId(id);

  const query = `
    query ($id: Int) {
      Media(
        id: $id,
        type: ANIME
      ) {
        id
        idMal

        title {
          romaji
          english
          native
        }

        type
        format
        status

        episodes
        duration

        season
        seasonYear

        coverImage {
          large
          medium
        }

        bannerImage

        description(
          asHtml: false
        )

        genres

        averageScore

        startDate {
          year
          month
          day
        }

        endDate {
          year
          month
          day
        }

        relations {
          edges {
            relationType

            node {
              id
              type
              format

              title {
                romaji
                english
                native
              }

              coverImage {
                medium
              }

              bannerImage
            }
          }
        }
      }
    }
  `;

  const data =
    await anilistRequest(
      query,
      {
        id: animeId
      }
    );

  return data.Media || null;
}
