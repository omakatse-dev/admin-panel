"use client";
import { useState } from "react";
import CreateSubModal from "./CreateSubModal";

export default function CreateSubscription() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <button
        className="border rounded-md py-2 px-8 w-fit mt-8 cursor-pointer"
        onClick={() => setShowCreateModal(true)}
      >
        Create New Subscription
      </button>
      {showCreateModal && <CreateSubModal setShowCreateModal={setShowCreateModal} />}
    </>
  );
}
