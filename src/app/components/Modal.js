import React from 'react';

const Modal = ({ isOpen, setIsOpen, heading, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{heading}</h2>
        <div>{children}</div>
        <button
          className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
