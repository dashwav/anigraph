export const
  UserList = `
  query ($userId: Int!) {
    User(id:99010) {
      id
      name
      avatar {
        medium
      }
    }
    MediaListCollection(userId: $userId, type:ANIME) {
      lists {
        name
        entries {
          id
          progress
          status
          media {
            id
            episodes
            title {
              userPreferred
            }
            coverImage{
              medium
            }
            genres
            relations{
              edges{
                id
                relationType
                node {
                  id
                  title {
                    userPreferred
                  }
                }
              }
            }
          }
          mediaId
          score
        }
      }
    }
  }
  `