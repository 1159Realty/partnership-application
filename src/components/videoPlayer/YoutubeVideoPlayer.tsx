"use client";

import { delay } from "@/services/delay";
import { useEffect, useState } from "react";
import { LoaderContainer, PlayerContainer, YoutubePlayerWrapper } from "./styles";
import { Skeleton } from "@mui/material";
import ReactPlayer from "react-player";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instgrm?: any;
  }
}

interface Props {
  url: string;
  reload?: boolean;
}

const YoutubeVideoPlayer = ({ url, reload }: Props) => {
  const [renderVideo, setRenderVideo] = useState(false);

  useEffect(() => {
    const scanDom = async () => {
      await delay(0.1);
      setRenderVideo(true);
    };
    scanDom();
  }, [reload]);

  return (
    <YoutubePlayerWrapper>
      <LoaderContainer>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </LoaderContainer>
      {renderVideo && (
        <PlayerContainer>
          <ReactPlayer width={"100%"} url={url} />
        </PlayerContainer>
      )}
    </YoutubePlayerWrapper>
  );
};

export { YoutubeVideoPlayer };
