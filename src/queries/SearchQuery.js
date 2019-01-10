export const SearchQuery = `
query ($query: String) {
  AnimeSearch: Page {
    media(search: $query, type: ANIME) {
      id
      title {
        userPreferred
      }
      coverImage {
        large
      }
    }
  }
}
`