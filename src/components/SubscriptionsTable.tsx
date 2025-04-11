"use client";

import { deactivateSubscription } from "@/APIs";
import { SubscriptionType } from "@/app/subscriptions/page";
import { useState } from "react";
import NewBoxModal from "./NewBoxModal";

export default function SubscriptionsTable({
  uniqueResults,
}: {
  uniqueResults: SubscriptionType[];
}) {
  const [showNewBoxModal, setShowNewBoxModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelectContract = (index: number) => {
    setSelectedIndex(index);
    setShowNewBoxModal(true);
  };

  return (
    <div className="flex flex-col gap-4 mt-12">
      <div className="grid grid-cols-10 gap-4 font-bold border-b">
        <div className="break-words whitespace-normal">Name</div>
        <div className="break-words whitespace-normal">Email</div>
        <div className="break-words whitespace-normal">Address</div>
        <div className="break-words whitespace-normal">Curr Box</div>
        <div className="break-words whitespace-normal">Box Size</div>
        <div className="break-words whitespace-normal">Pet Details</div>
        <div className="break-words whitespace-normal">Items</div>
        <div className="break-words whitespace-normal">Status</div>
      </div>
      {uniqueResults.map((result: SubscriptionType, index: number) => {
        const items = JSON.parse(result.items);
        return (
          <div
            key={result.contractId}
            className="grid grid-cols-10 gap-4 items-start text-sm"
          >
            <div className="break-words whitespace-normal">{result.name}</div>
            <div className="break-words whitespace-normal">{result.email}</div>
            <div className="break-words whitespace-normal">{result.address}</div>
            <div className="break-words whitespace-normal">
              {result.duplicateCount} / {result.planDuration}
            </div>
            <div className="break-words whitespace-normal">{result.size}</div>
            <div className="break-words whitespace-normal">{result.pets}</div>
            <div className="break-words whitespace-normal">
              {items.map((item: { variantId: string; quantity: string }) => (
                <div key={item.variantId}>
                  {item.variantId} x {item.quantity}
                </div>
              ))}
            </div>
            <div className="break-words whitespace-normal">{result.status}</div>
            <button
              className="border rounded-md p-2 cursor-pointer"
              onClick={() => handleSelectContract(index)}
            >
              New Box
            </button>
            <button
              disabled={result.status === "INACTIVE"}
              className="border border-red-500 text-red-500 rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => deactivateSubscription(result.contractId)}
            >
              Deactivate
            </button>
          </div>
        );
      })}
      {showNewBoxModal && (
        <NewBoxModal
          setShowNewBoxModal={setShowNewBoxModal}
          contractId={uniqueResults[selectedIndex].contractId}
          number={(uniqueResults[selectedIndex].duplicateCount + 1).toString()}
          size={uniqueResults[selectedIndex].size}
        />
      )}
    </div>
  );
}
