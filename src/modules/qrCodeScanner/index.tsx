"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/buttons";
import { QrCode, XCircle } from "@phosphor-icons/react";

const QrScanner = () => {
  const qrCodeRegionId = "reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

    return () => {
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleScanToggle = async () => {
    const html5QrCode = html5QrCodeRef.current;

    if (!html5QrCode) return;

    if (isScanning) {
      // Stop scanner
      await html5QrCode.stop();
      setIsScanning(false);
    } else {
      // Start scanner
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 500,
          },
          (decodedText) => {
            console.log("QR Code detected:", decodedText);
            html5QrCode.stop().then(() => {
              setIsScanning(false);
              console.log("Scanner stopped");
            });
          },
          (errorMessage) => {
            // Optional: handle errors
          }
        );
        setIsScanning(true);
      } catch (err) {
        console.error("Failed to start scanner", err);
      }
    }
  };

  return (
    <div className="w-full h-full items-center justify-center flex flex-col gap-4">
      <div
        id={qrCodeRegionId}
        className="md:w-1/2 md:h-1/2 w-full h-full border border-black"
      />
      <Button onClick={handleScanToggle} className="flex items-center gap-2">
        {isScanning ? (
          <div className="flex items-center gap-2">
            <XCircle size={20} />
            Stop Scanner
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <QrCode size={20} />
            Start Scanner
          </div>
        )}
      </Button>
    </div>
  );
};

export default QrScanner;
