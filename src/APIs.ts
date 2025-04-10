"use server";

const endpoint = process.env.REVIEW_WORKER_ENDPOINT || "";
const subEndpoint = process.env.SUBSCRIPTION_WORKER_ENDPOINT || "";

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

export const createSubscription = async () => {
  try {
    const res = await fetch(subEndpoint, {
      method: "POST",
      body: JSON.stringify({
        size: "Large",
        nextBillingDate: "date here",
        address: "277 sbr",
        name: "matt",
        duration: "6",
        nextRenewalDate: "test date",
        date: "date here",
        paymentDate: "date here",
        boxItems: "box items here",
        petDetails: "pet details here",
        email: "matthew",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getSubscriptionPlans = async () => {
  const res = await fetch(
    `https://omakatse-subscriptions.matthew-3c3.workers.dev/subscription`
  );
  const data = await res.json();
  return data;
};
