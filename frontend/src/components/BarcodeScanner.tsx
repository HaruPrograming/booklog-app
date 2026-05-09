import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

type Props = {
  onDetect: (isbn: string) => void;
  onClose: () => void;
};

export function BarcodeScanner({ onDetect, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detected, setDetected] = useState(false);
  const detectedRef = useRef(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    reader
      .decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoRef.current!,
        (result) => {
          if (result && !detectedRef.current) {
            const text = result.getText();
            if (/^\d{13}$/.test(text) || /^\d{10}$/.test(text)) {
              detectedRef.current = true;
              setDetected(true);
              BrowserMultiFormatReader.releaseAllStreams();
              setTimeout(() => onDetect(text), 400);
            }
          }
        }
      )
      .catch(() => {});

    return () => {
      BrowserMultiFormatReader.releaseAllStreams();
    };
  }, []);

  return (
    <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden">
      <video ref={videoRef} className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-2/3 h-2/3 rounded-lg border-4 transition-colors duration-200 ${
            detected ? 'border-green-400 opacity-100' : 'border-white opacity-60'
          }`}
        />
      </div>
      {detected && (
        <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
          <span className="bg-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
            読み取り完了
          </span>
        </div>
      )}
      {!detected && (
        <button
          type="button"
          onClick={() => {
            BrowserMultiFormatReader.releaseAllStreams();
            onClose();
          }}
          className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
}
