"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/buttons";
import { QrCode, XCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import SearchProfile from "./search-profile";

const QrScanner = () => {
  const qrCodeRegionId = "reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
    const config = isMobile ? { fps: 10, qrbox: 200 } : { fps: 20, qrbox: 200 };
    const html5QrCode = html5QrCodeRef.current;

    if (!html5QrCode) return;

    if (isScanning) {
      await html5QrCode.stop();
      setIsScanning(false);
    } else {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras.length) {
          const backCamera = cameras.find((cam) =>
            cam.label.toLowerCase().includes("back")
          );
          const cameraId = backCamera ? backCamera.id : cameras[0].id;

          await html5QrCode.start(
            cameraId,
            config,
            async (decodedText) => {
              await html5QrCode.stop();
              setIsScanning(false);
              router.push(`/?publicId=${encodeURIComponent(decodedText)}`);
            },
            () => {}
          );

          setIsScanning(true);
        }
      } catch (err) {
        console.error("Failed to start scanner", err);
      }
    }
  };

  return (
    <>
      <SearchProfile />
      {/* Scanner */}
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="relative w-full h-[60vh] max-w-[90vw] md:max-w-4xl md:h-[70vh] bg-gray-100 rounded-md overflow-hidden border border-gray-300">
          <div
            id={qrCodeRegionId}
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              isScanning ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
          <div
            className={`absolute inset-0 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-4 ${
              isScanning ? "opacity-0 z-0" : "opacity-100 z-10"
            }`}
          >
            <div className="text-center text-gray-700 text-md">
              To verify a user, scan their QR code or search by User ID.
            </div>
            <div className="text-center">
              Tap <strong>&quot;Start Scanner&quot;</strong> to begin.
            </div>
            <QrCode size={250} />
          </div>
        </div>

        <Button
          onClick={handleScanToggle}
          className="flex justify-center items-center gap-2"
        >
          {isScanning ? (
            <div className="flex items-center justify-center text-center">
              <XCircle size={20} />
              <span>Stop Scanner</span>
            </div>
          ) : (
            <div className="flex items-center justify-center text-center">
              <QrCode size={20} />
              <span>Start Scanner</span>
            </div>
          )}
        </Button>
      </div>
    </>
  );
};

export default QrScanner;
