"use client";

import { useState } from "react";
import { createNewBox } from "@/APIs";

interface NewBoxModalProps {
  setShowNewBoxModal: (show: boolean) => void;
  contractId: string | string[];
}

export default function NewBoxModal({
  setShowNewBoxModal,
  contractId,
}: NewBoxModalProps) {
  const [boxItems, setBoxItems] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const items = JSON.parse(boxItems);
      const contractIds = Array.isArray(contractId) ? contractId : [contractId];
      await createNewBox(contractIds, items);
      alert("Box created successfully");
      setShowNewBoxModal(false);
    } catch (error) {
      console.error("Error creating box:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Box</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Box Items (JSON) {`([{"variantId": "item1", "quantity": "1"}])`}
            </label>
            <textarea
              value={boxItems}
              onChange={(e) => setBoxItems(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-0"
              rows={5}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewBoxModal(false)}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Box"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
