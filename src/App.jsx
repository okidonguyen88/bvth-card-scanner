import React, { useState, useCallback } from 'react';
import Welcome from './components/Welcome';
import WebcamCapture from './components/WebcamCapture';
import ImageCropper from './components/ImageCropper';
import FinalPreview from './components/FinalPreview';
import { CameraIcon } from './components/Icons';

const AppState = {
  IDLE: 'IDLE',
  CAPTURING: 'CAPTURING',
  CROPPING: 'CROPPING',
  PREVIEW: 'PREVIEW',
  ERROR: 'ERROR',
};

const App = () => {
  const [appState, setAppState] = useState(AppState.IDLE);
  const [capturedImage, setCapturedImage] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [error, setError] = useState(null);

  const handleStartCapture = useCallback(() => {
    setError(null);
    setCapturedImage(null);
    setAppState(AppState.CAPTURING);
  }, []);

  const handleImageCaptured = useCallback((imageSrc) => {
    setCapturedImage(imageSrc);
    setAppState(AppState.CROPPING);
  }, []);

  const handleImageCropped = useCallback((imageSrc) => {
    setCroppedImages((prev) => [...prev, imageSrc]);
    setCapturedImage(null);
    setAppState(AppState.PREVIEW);
  }, []);

  const handleAddMore = useCallback(() => {
    setCapturedImage(null);
    setAppState(AppState.CAPTURING);
  }, []);

  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setCroppedImages([]);
    setError(null);
    setAppState(AppState.IDLE);
  }, []);

  const handleRemoveImage = useCallback((idx) => {
    setCroppedImages((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleError = useCallback((message) => {
    setError(message);
    setAppState(AppState.ERROR);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return <Welcome onStart={handleStartCapture} />;
      case AppState.CAPTURING:
        return <WebcamCapture onCapture={handleImageCaptured} onCancel={handleReset} onError={handleError} />;
      case AppState.CROPPING:
        if (capturedImage) {
          return <ImageCropper imageSrc={capturedImage} onCrop={handleImageCropped} onRetake={handleAddMore} />;
        }
        handleError("Không có ảnh để cắt.");
        return null;
      case AppState.PREVIEW:
        return (
          <FinalPreview
            croppedImages={croppedImages}
            onAddMore={handleAddMore}
            onStartOver={handleReset}
            onRemoveImage={handleRemoveImage}
          />
        );
      case AppState.ERROR:
        return (
          <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Đã xảy ra lỗi</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-8 no-print">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 flex items-center justify-center gap-4">
          <CameraIcon className="w-10 h-10" />
          <span>PM QUÉT NHANH</span>
        </h1>
        <p className="text-slate-400 mt-2">Căn cước công dân, bằng lái xe, ...</p>
      </header>
      <main className="w-full max-w-4xl">
        {renderContent()}
      </main>
      <footer className="text-center mt-8 text-slate-500 text-sm no-print">
        <p>&copy; 2025 BVTH-CNTT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;