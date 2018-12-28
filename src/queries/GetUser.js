export const GetUser = `
query ($userName: String!)
  { 
    User (name: $userName) {
      id
      name
      avatar {
        large
      }
      unreadNotificationCount
      donatorTier
      updatedAt
      options {
        titleLanguage
        displayAdultContent
      }
      mediaListOptions {
        scoreFormat
      }
    }
  }
`