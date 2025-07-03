import { validateInstagramUrl, validateYoutubeUrl } from "@/services/validation/video";
import React from "react";
import { YoutubeVideoPlayer } from "./YoutubeVideoPlayer";
import { InstagramVideoPlayer } from "./InstagramVideoPlayer";

interface Props {
  url: string;
  reload?: boolean;
}

function VideoPlayer({ url, reload }: Props) {
  if (validateYoutubeUrl(url)) return <YoutubeVideoPlayer url={url} reload={reload} />;
  if (validateInstagramUrl(url)) return <InstagramVideoPlayer url={url} reload={reload} />;
  return null;
}

export default VideoPlayer;
