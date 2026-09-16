const ANILIST_API_URL =
  process.env.ANILIST_API_URL || "https://graphql.anilist.co";

async function anilistRequest(query, variables = {}) {
  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const data = await response.json();

  if (!response.ok || data.errors) {
    const message =
      data.errors?.[0]?.message || "AniList request failed";

    throw new Error(message);
  }

  return data.data;
}

export async function searchAnime(search) {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 20) {
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

          description(asHtml: false)

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

  const data = await anilistRequest(query, {
    search
  });

  return data.Page.media;
}

export async function getAnimeById(id) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
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

        description(asHtml: false)

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
            }
          }
        }
      }
    }
  `;

  const data = await anilistRequest(query, {
    id: Number(id)
  });

  return data.Media;
}
