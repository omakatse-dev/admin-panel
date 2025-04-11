import { createNewBox } from "@/APIs";
import { useState } from "react";

export default function NewBoxModal({
  setShowNewBoxModal,
  contractId,
  number,
  size,
}: {
  setShowNewBoxModal: (showNewBoxModal: boolean) => void;
  contractId: string;
  number: string;
  size: string;
}) {
  const [boxItems, setBoxItems] = useState("");

  const handleCreateNewBox = async () => {
    const date = new Date().toISOString();
    await createNewBox(contractId, date, number, size, "-", boxItems);
    setShowNewBoxModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-700 p-8 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">New Box</h2>
        <textarea
          className="w-full h-64 p-2 rounded-md bg-white text-black"
          placeholder=""
          value={boxItems}
          onChange={(e) => setBoxItems(e.target.value)}
        />
        <div className="flex justify-between gap-4">
          <button
            className="bg-blue-500 text-white p-2 rounded-md w-1/2 cursor-pointer"
            onClick={() => setShowNewBoxModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md w-1/2 cursor-pointer"
            onClick={handleCreateNewBox}
          >
            Create Box
          </button>
        </div>
      </div>
    </div>
  );
}
