import React from 'react';

export default function Alert({ type = 'error', title, message, onClose }) {
  const color = {
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      button: 'text-red-700 hover:text-red-900'
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      button: 'text-emerald-700 hover:text-emerald-900'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      button: 'text-amber-700 hover:text-amber-900'
    },
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-900',
      button: 'text-sky-700 hover:text-sky-900'
    }
  }[type] || {
    container: 'bg-gray-50 border-gray-200 text-gray-800',
    button: 'text-gray-700 hover:text-gray-900'
  };

  return (
    <div className={`w-full rounded-lg border px-4 py-3 flex items-start gap-3 shadow-sm ${color.container}`}>
      <div className="flex-1">
        {title && <div className="font-semibold mb-0.5">{title}</div>}
        {message && <div className="text-sm leading-5">{message}</div>}
      </div>
      {onClose && (
        <button type="button" className={`ms-auto text-sm opacity-80 ${color.button}`} onClick={onClose} aria-label="Yopish">
          ✕
        </button>
      )}
    </div>
  );
}



