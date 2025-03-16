export const sortByName = (record1: { name: string }, record2: { name: string }) => {
  return record1.name.localeCompare(record2.name);
};

export const sortByAlbumCount = (record1: { albumCount: number }, record2: { albumCount: number }) => {
  return record1.albumCount - record2.albumCount;
};

export const filterImages = (artists: { portrait: string }[]) => {
  return artists.filter((artist) => artist.portrait);
}