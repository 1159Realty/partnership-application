"use client";

import React from "react";
import { delay } from "@/services/delay";
import { useEffect, useRef } from "react";
import { LoaderContainer, IGMainWrapper, PlayerContainer } from "./styles";
import { Skeleton } from "@mui/material";

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

const InstagramVideoPlayer = ({ url, reload }: Props) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scanDom = async () => {
      await delay(0.1);
      if (!window.instgrm) {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
          if (window.instgrm && containerRef.current) {
            window.instgrm.Embeds.process();
          }
        };
        document.body.appendChild(script);
      } else {
        window.instgrm.Embeds.process();
      }
    };
    scanDom();
  }, [reload]);

  return (
    <IGMainWrapper>
      <LoaderContainer>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </LoaderContainer>
      <PlayerContainer>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ width: "100%" }}
        />
      </PlayerContainer>
    </IGMainWrapper>
  );
};

export { InstagramVideoPlayer };
