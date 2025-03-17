export const filterImages = (artists: { portrait: string }[]) => {
  return artists.filter((artist) => artist.portrait);
}