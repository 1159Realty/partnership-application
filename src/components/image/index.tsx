import NextImage, { ImageProps } from "next/image";
import React from "react";
import { ImageWrapper } from "./image.styles";

const Image = ({ ...props }: Omit<ImageProps, "alt" | "width" | "height" | "unoptimized">) => {
  return (
    <ImageWrapper>
      <NextImage priority width={358} height={312} alt={"1159 image"} unoptimized {...props} />
    </ImageWrapper>
  );
};

export { Image };
