export const GetAnime = `
query ($animeId: Int!)
  {
    Media(id: $animeId) {
      id
      episodes
      status
      description(asHtml: false)
      siteUrl
      stats {
        scoreDistribution {
          score
          amount
        }
        statusDistribution {
          status
          amount
        }
      }
      title {
        userPreferred
      }
      bannerImage
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
            status
            description(asHtml: true)
            siteUrl
            stats {
              scoreDistribution {
                score
                amount
              }
              statusDistribution {
                status
                amount
              }
            }
            title {
              userPreferred
            }
            bannerImage
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