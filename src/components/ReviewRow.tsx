"use client";

import { approveReview } from "@/APIs";
import { Review } from "@/app/page";
import Image from "next/image";
import { useState } from "react";
export default function ReviewRow({ review }: { review: Review }) {
  const [loading, setLoading] = useState(false);
  const updateStatusHandler = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    setLoading(true);
    try {
      await approveReview(id, status);
      alert("Status updated, refresh page to verify changes.");
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-3 py-3">
      <div>{review.product}</div>
      <div>{review.date}</div>
      <div className="flex flex-col gap-1">
        <div>{review.author}</div>
        <div>{review.email}</div>
      </div>
      <div className="flex flex-col">
        {review.image && (
          <Image
            src={review.image}
            alt={review.title}
            width={100}
            height={100}
          />
        )}
        <div>{review.title}</div>
        <div>{review.rating} stars</div>
        <div>{review.body}</div>
      </div>
      {review.status === "PENDING" ? (
        <div className="flex flex-col gap-2">
          <button
            className={`bg-green-500 text-white px-4 py-2 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => updateStatusHandler(review.id, "APPROVED")}
          >
            {loading ? "Approving..." : "Approve"}
          </button>
          <button
            className={`bg-red-500 text-white px-4 py-2 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => updateStatusHandler(review.id, "REJECTED")}
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      ) : (
        <div>{review.status}</div>
      )}
    </div>
  );
}
