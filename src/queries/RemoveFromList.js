export const RemoveFromList = `
mutation ($mediaId: Int) {
  DeleteMediaListEntry (id: $mediaId) {
    deleted
  }
}
`