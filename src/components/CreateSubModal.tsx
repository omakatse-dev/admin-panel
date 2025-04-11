import { createSubscription } from "@/APIs";
import { useState } from "react";

export default function CreateSubModal({
  setShowCreateModal,
}: {
  setShowCreateModal: (show: boolean) => void;
}) {
  const [size, setSize] = useState("");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [nextRenewalDate, setNextRenewalDate] = useState("");
  const [boxItems, setBoxItems] = useState("");
  const [petDetails, setPetDetails] = useState("");
  const [email, setEmail] = useState("");

  const createSubHandler = async () => {
    const date = new Date().toISOString();
    await createSubscription(
      size,
      nextBillingDate,
      address,
      name,
      duration,
      nextRenewalDate,
      date,
      boxItems,
      petDetails,
      email
    );
    setShowCreateModal(false);
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

          <div className="grid grid-cols-2 gap-4">
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
              <label htmlFor="duration" className="block text-sm font-medium">
                Duration (months)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="nextBillingDate"
                className="block text-sm font-medium"
              >
                Next Billing Date
              </label>
              <input
                type="date"
                id="nextBillingDate"
                value={nextBillingDate}
                onChange={(e) => setNextBillingDate(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="nextRenewalDate"
                className="block text-sm font-medium"
              >
                Next Renewal Date
              </label>
              <input
                type="date"
                id="nextRenewalDate"
                value={nextRenewalDate}
                onChange={(e) => setNextRenewalDate(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="boxItems" className="block text-sm font-medium">
              Box Items (JSON format)
            </label>
            <textarea
              id="boxItems"
              value={boxItems}
              onChange={(e) => setBoxItems(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              placeholder='[{"variantId": "item1", "quantity": "1"}]'
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="petDetails" className="block text-sm font-medium">
              Pet Details (Copy from Order notes)
            </label>
            <textarea
              id="petDetails"
              value={petDetails}
              onChange={(e) => setPetDetails(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
              onClick={() => {
                setShowCreateModal(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Create Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
