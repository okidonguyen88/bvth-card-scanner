import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, StopIcon } from './Icons';

function WebcamCapture({ onCapture, onCancel, onError }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startWebcam = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: 'environment'
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      if (err instanceof Error) {
          if(err.name === "NotAllowedError") {
              onError("Camera access was denied. Please allow camera access in your browser settings and try again.");
          } else {
              onError(`Could not start webcam: ${err.message}`);
          }
      } else {
          onError("An unknown error occurred while accessing the webcam.");
      }
    }
  }, [onError]);

  useEffect(() => {
    startWebcam();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      } else {
        onError("Could not get canvas context to capture image.");
      }
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-lg pointer-events-none flex items-center justify-center">
            <span className="bg-black/50 text-white px-3 py-1 rounded">Đặt thẻ vào khung hình</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onCancel}
          className="group inline-flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          <StopIcon className="w-5 h-5"/>
          <span>Hủy</span>
        </button>
        <button
          onClick={handleCapture}
          className="group inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <CameraIcon className="w-6 h-6" />
          <span>Quét</span>
        </button>
      </div>
    </div>
  );
}

export default WebcamCapture;