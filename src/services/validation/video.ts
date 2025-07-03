function validateInstagramUrl(url: string | null | undefined): boolean {
  if (!url || !url.includes("instagram.com/reel") || !url.includes("utm_source=ig_embed")) return false;
  return true;
}

function validateYoutubeUrl(url: string | null | undefined): boolean {
  if (!url || !url.includes("youtube.com")) return false;
  return true;
}

function validateVideoUrl(url: string | null | undefined): boolean {
  const isYoutubeUrl = validateYoutubeUrl(url);
  const isInstagramUrl = validateInstagramUrl(url);
  if (!url || (!isYoutubeUrl && !isInstagramUrl)) return false;
  return true;
}

export { validateYoutubeUrl, validateInstagramUrl, validateVideoUrl };
