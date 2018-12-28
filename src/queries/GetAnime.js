export const GetAnime = `
query ($animeId: Int!)
  {
    Media(id: $animeId) {
      id
      episodes
      title {
        userPreferred
      }
      coverImage {
        large
      }
      genres
      relations {
        edges {
          id
          relationType
          Media: node {
            id
            episodes
            title {
              userPreferred
            }
            coverImage {
              large
            }
            genres
            relations {
              edges {
                id
                relationType
                Media: node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`