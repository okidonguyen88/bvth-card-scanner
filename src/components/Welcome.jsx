import React from 'react';
import { CameraIcon } from './Icons';

function Welcome({ onStart }) {
  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 text-center flex flex-col items-center">
      <h2 className="text-3xl font-bold text-slate-100 mb-4">Chào mừng bạn</h2>
      <p className="text-slate-300 max-w-md mb-8">
        Công cụ này sẽ giúp bạn chụp ảnh thẻ căn cước công dân, bằng lái, ... bằng webcam của thiết bị. Vui lòng chuẩn bị thẻ của bạn.
      </p>
      <button
        onClick={onStart}
        className="group inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        <CameraIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
        <span>Bắt đầu Camera</span>
      </button>
    </div>
  );
}

export default Welcome;