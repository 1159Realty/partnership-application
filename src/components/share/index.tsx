"use client";
import { ReactNode, useState } from "react";
import { CopyWrapper, ShareWrapper } from "./styles";

interface Props {
  children: ReactNode;
  value: string;
}

function Share({ children, value }: Props) {
  const [copied, setCopied] = useState(false);

  const onShareCopy = async () => {
    try {
      if (ClipboardItem) {
        const getUrl = async () => value;

        const text = new ClipboardItem({
          "text/plain": getUrl()
            .then((response) => response)
            .then((text) => {
              return new Blob([text], { type: "text/plain" });
            }),
        });
        navigator.clipboard.write([text]);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === "ClipboardItem is not defined") {
        await navigator.clipboard.writeText(value);
      }
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <ShareWrapper onClick={onShareCopy}>
      {children}
      {copied && <CopyWrapper>Copied!</CopyWrapper>}
    </ShareWrapper>
  );
}

export { Share };
