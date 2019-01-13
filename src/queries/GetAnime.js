export const GetAnime = `
query ($animeId: Int!)
  {
    Media(id: $animeId) {
      id
      format
      episodes
      status
      description(asHtml: false)
      siteUrl
      averageScore
      popularity
      mediaListEntry {
        id
        status
        progress
      }
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
        medium
        color
      }
      genres
      relations {
        edges {
          id
          relationType
          Media: node {
            id
            format
            episodes
            status
            description(asHtml: true)
            siteUrl
            averageScore
            popularity
            mediaListEntry {
              id
              status
              progress
            }
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
              medium
              color
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