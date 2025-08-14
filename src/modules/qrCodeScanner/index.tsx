"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/buttons";
import { Info, QrCode, XCircle } from "@phosphor-icons/react";

const QrScanner = () => {
  const qrCodeRegionId = "reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set mobile detection on mount and when screen resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // initial check
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

    return () => {
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleScanToggle = async () => {
    const config = isMobile
      ? {
          fps: 10,
          qrbox: 200,
        }
      : {
          fps: 20,
          qrbox: 300,
        };

    const html5QrCode = html5QrCodeRef.current;

    if (!html5QrCode) return;

    if (isScanning) {
      await html5QrCode.stop();
      setIsScanning(false);
    } else {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          // Prefer back camera if available
          const backCamera = cameras.find((cam) =>
            cam.label.toLowerCase().includes("back")
          );
          const cameraId = backCamera ? backCamera.id : cameras[0].id;

          await html5QrCode.start(
            cameraId,
            config,
            (decodedText) => {
              console.log("QR Code detected:", decodedText);
              html5QrCode.stop().then(() => {
                setIsScanning(false);
                console.log("Scanner stopped");
              });
            },
            (errorMessage) => {
              // Optional: handle decode errors
            }
          );

          setIsScanning(true);
        } else {
          console.error("No cameras found.");
        }
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
      {!isScanning && (
        <div className="p-3 text-md flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-center text-gray-700">
            <Info size={20} weight="duotone" />
            <span>
              To verify a user, scan their QR code or search by User ID.
            </span>
          </div>
          <span>
            Tap <strong>"Start Scanner"</strong> to begin.
          </span>
        </div>
      )}

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
