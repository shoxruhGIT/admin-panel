import React from "react";

const DeleteModal = ({ onCancel, deleteItem, label }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold mb-4">
            {`Are you sure you want to delete this ${label}?`}
          </h3>
          <button
            onClick={onCancel}
            className="text-white bg-black rounded-[50%] h-[35px] w-[35px] flex items-center justify-center cursor-pointer"
          >
            X
          </button>
        </div>
        <div className="flex justify-between">
          <button
            onClick={deleteItem}
            className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Yes, delete
          </button>
          <button
            onClick={onCancel}
            className="px-4 cursor-pointer py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
