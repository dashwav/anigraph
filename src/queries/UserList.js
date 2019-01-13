export const
  UserList = `
  query ($userId: Int!) {
    User(id: $userId) {
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
          }
          mediaId
          score
        }
      }
    }
  }
  `