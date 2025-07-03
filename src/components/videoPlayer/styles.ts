"use client";
import styled from "@emotion/styled";

// PropertyDetail
export const IGMainWrapper = styled.div`
  width: 100%;
  aspect-ratio: 9 / 16;
  position: relative;
`;

export const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

export const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;

export const YoutubePlayerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 312px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;

  @media screen and (min-width: 1074px) {
    height: 312px;
  }

  @media screen and (min-width: 970px) and (max-width: 1073px) {
    height: 244px;
  }

  @media screen and (min-width: 870px) and (max-width: 969px) {
    height: 244px;
  }

  @media screen and (min-width: 769px) and (max-width: 869px) {
    height: 244px;
  }

  @media screen and (min-width: 720px) and (max-width: 768px) {
    height: 389px;
  }

  @media screen and (min-width: 620px) and (max-width: 719px) {
    height: 331px;
  }

  @media screen and (min-width: 520px) and (max-width: 619px) {
    height: 274px;
  }

  @media screen and (min-width: 421px) and (max-width: 519px) {
    height: 212px;
  }
`;
