"use server";

const endpoint = process.env.REVIEW_WORKER_ENDPOINT || "";

export const getReviews = async () => {
  const res = await fetch(endpoint);
  const data = await res.json();
  return data;
};

export const approveReview = async (
  id: string,
  status: "APPROVED" | "REJECTED"
) => {
  await fetch("https://omakatse-review-handler.matthew-3c3.workers.dev/", {
    method: "PUT",
    body: JSON.stringify({ id, status }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
