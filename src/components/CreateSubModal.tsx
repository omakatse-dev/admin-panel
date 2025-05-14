"use client";

import { createSubscription } from "@/APIs";
import { useState } from "react";

function Spinner() {
  return (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  );
}

export default function CreateSubModal({
  setShowCreateModal,
}: {
  setShowCreateModal: (show: boolean) => void;
}) {
  const [size, setSize] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [boxItems, setBoxItems] = useState("");
  const [boxDetails, setBoxDetails] = useState("");
  const [email, setEmail] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createSubHandler = async () => {
    setIsLoading(true);
    const date = new Date().toISOString();
    if (boxDetails) {
      try {
        const parsedBoxDetails = JSON.parse(boxDetails);
        const duration = parseInt(parsedBoxDetails.duration.split(" ")[0]) || 1; // Default to 1 month if duration not specified

        // Calculate dates
        const orderDateObj = new Date(orderDate);
        const nextBillingDate = new Date(orderDateObj);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

        const nextRenewalDate = new Date(orderDateObj);
        nextRenewalDate.setMonth(nextRenewalDate.getMonth() + duration);

        await createSubscription(
          size,
          nextBillingDate.toISOString(),
          address,
          name,
          duration.toString(),
          nextRenewalDate.toISOString(),
          date,
          boxItems ? JSON.parse(boxItems) : undefined,
          JSON.parse(boxDetails).pets,
          email
        );
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error parsing JSON or calculating dates:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 w-1/3 p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Create New Subscription</h1>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            createSubHandler();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="size" className="block text-sm font-medium">
              Box Size
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            >
              <option value="">Select Size</option>
              <option value="SMALL">Small</option>
              <option value="LARGE">Large</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="orderDate" className="block text-sm font-medium">
              Order Date
            </label>
            <input
              type="date"
              id="orderDate"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="boxDetails" className="block text-sm font-medium">
              Box Details (JSON format)
            </label>
            <textarea
              id="boxDetails"
              value={boxDetails}
              onChange={(e) => setBoxDetails(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              placeholder='{"duration": 12, "otherDetails": "..."}'
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="boxItems" className="block text-sm font-medium">
              Box Items (JSON format, optional) {" "} 
              {`[{"variantId": "item1", "quantity": "1"}]`}
            </label>
            <textarea
              id="boxItems"
              value={boxItems}
              onChange={(e) => setBoxItems(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              placeholder='[{"variantId": "item1", "quantity": "1"}]'
            />
          </div>

          

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className={`px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                setShowCreateModal(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 min-w-[160px] flex items-center justify-center gap-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Subscription"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
