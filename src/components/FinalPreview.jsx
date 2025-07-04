import { PrintIcon, RetakeIcon, CameraIcon } from "./Icons";

function FinalPreview({
  croppedImages,
  onAddMore,
  onStartOver,
  onRemoveImage,
}) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
          <html>
            <head>
              <title>Print ID Cards</title>
              <style>
                @page { size: auto; margin: 0; }
                body { padding: 2rem; display: flex; flex-wrap: wrap; gap: 16px; align-content: flex-start; }
                img { width: auto; height: 180px; display: block; object-fit: contain; }
              </style>
            </head>
            <body>
              ${croppedImages
                .map(
                  (src) =>
                    `<div><img src="${src}" alt="Cropped ID Card" /></div>`
                )
                .join("")}
              <script>window.onload = function() { window.print(); window.close(); }</script>
            </body>
          </html>
        `);
      printWindow.document.close();
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700 text-center">
      <h2 className="text-3xl font-bold text-slate-100 mb-4">Các ảnh đã cắt</h2>
      <p className="text-slate-300 mb-6">
        Bạn có thể thêm ảnh, xóa ảnh, hoặc in tất cả.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {croppedImages.map((src, idx) => (
          <div
            key={idx}
            className="relative bg-slate-900/50 p-4 rounded-lg border border-slate-700 inline-block"
          >
            <img
              src={src}
              alt={`Final Cropped ID ${idx + 1}`}
              className="max-w-xs md:max-w-sm rounded-md shadow-lg"
            />
            <button
              onClick={() => onRemoveImage(idx)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center"
              title="Xóa ảnh này"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 no-print">
        <button
          onClick={onAddMore}
          className="group inline-flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          <CameraIcon className="w-5 h-5" />
          <span>THÊM</span>
        </button>
        <button
          onClick={onStartOver}
          className="group inline-flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          <RetakeIcon className="w-5 h-5" />
          <span>QUÉT MỚI</span>
        </button>
        <button
          onClick={handlePrint}
          disabled={croppedImages.length === 0}
          className="group inline-flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-indigo-900 disabled:cursor-not-allowed disabled:transform-none"
        >
          <PrintIcon className="w-6 h-6" />
          <span>IN</span>
        </button>
      </div>
    </div>
  );
}

export default FinalPreview;
