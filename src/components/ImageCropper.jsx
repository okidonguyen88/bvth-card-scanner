import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CropIcon, RetakeIcon } from './Icons';

function ImageCropper({ imageSrc, onCrop, onRetake }) {
  const [crop, setCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [startPoint, setStartPoint] = useState(null);

  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Helper to get coordinates from mouse or touch event
  const getPoint = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  // Mouse events (do not call preventDefault)
  const handleStart = (e) => {
    if (e.type === 'mousedown') {
      setIsCropping(true);
      const { x, y } = getPoint(e);
      setStartPoint({ x, y });
      setCrop({ x, y, width: 0, height: 0 });
    }
  };

  const handleMove = (e) => {
    if (!isCropping || !startPoint) return;
    if (e.type === 'mousemove') {
      const { x: currentX, y: currentY } = getPoint(e);
      setCrop({
        x: Math.min(startPoint.x, currentX),
        y: Math.min(startPoint.y, currentY),
        width: Math.abs(currentX - startPoint.x),
        height: Math.abs(currentY - startPoint.y),
      });
    }
  };

  const handleEnd = (e) => {
    if (e.type === 'mouseup' || e.type === 'mouseleave') {
      setIsCropping(false);
      setStartPoint(null);
    }
  };

  // Touch events (call preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const touchStart = (e) => {
      e.preventDefault();
      setIsCropping(true);
      const { x, y } = getPoint(e);
      setStartPoint({ x, y });
      setCrop({ x, y, width: 0, height: 0 });
    };
    const touchMove = (e) => {
      if (!isCropping || !startPoint) return;
      e.preventDefault();
      const { x: currentX, y: currentY } = getPoint(e);
      setCrop({
        x: Math.min(startPoint.x, currentX),
        y: Math.min(startPoint.y, currentY),
        width: Math.abs(currentX - startPoint.x),
        height: Math.abs(currentY - startPoint.y),
      });
    };
    const touchEnd = (e) => {
      e.preventDefault();
      setIsCropping(false);
      setStartPoint(null);
    };

    container.addEventListener('touchstart', touchStart, { passive: false });
    container.addEventListener('touchmove', touchMove, { passive: false });
    container.addEventListener('touchend', touchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', touchStart);
      container.removeEventListener('touchmove', touchMove);
      container.removeEventListener('touchend', touchEnd);
    };
    // eslint-disable-next-line
  }, [isCropping, startPoint]);

  const handleCropImage = useCallback(() => {
    if (!imageRef.current || !crop || crop.width === 0 || crop.height === 0) {
      alert("Please select an area to crop.");
      return;
    }

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;

    canvas.width = sourceWidth;
    canvas.height = sourceHeight;

    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

    onCrop(canvas.toDataURL('image/png'));
  }, [crop, onCrop]);

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
      <p className="text-center text-slate-300 mb-4">Chọn và cắt ảnh.</p>
      <div
        ref={containerRef}
        onMouseDown={handleStart}
        onMouseMove={isCropping ? handleMove : undefined}
        onMouseUp={handleEnd}
        onMouseLeave={isCropping ? handleEnd : undefined}
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4 cursor-crosshair select-none"
        style={{ touchAction: 'none' }}
      >
        <img ref={imageRef} src={imageSrc} alt="Captured ID" className="w-full h-full object-contain" draggable={false} />
        {crop && (
          <div
            className="absolute border-2 border-dashed border-cyan-400 bg-cyan-400/20"
            style={{
              left: crop.x,
              top: crop.y,
              width: crop.width,
              height: crop.height,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onRetake}
          className="group inline-flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          <RetakeIcon className="w-5 h-5"/>
          <span>Retake Photo</span>
        </button>
        <button
          onClick={handleCropImage}
          disabled={!crop || crop.width === 0 || crop.height === 0}
          className="group inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-indigo-900 disabled:cursor-not-allowed disabled:transform-none"
        >
          <CropIcon className="w-6 h-6"/>
          <span>Crop Image</span>
        </button>
      </div>
    </div>
  );
}

export default ImageCropper;