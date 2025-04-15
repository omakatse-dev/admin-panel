"use server";

const endpoint = process.env.REVIEW_WORKER_ENDPOINT || "";
const subEndpoint = process.env.SUBSCRIPTION_WORKER_ENDPOINT || "";
const restockEndpoint = process.env.RESTOCK_WORKER_ENDPOINT || "";
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

export const createSubscription = async (
  size: string,
  nextBillingDate: string,
  address: string,
  name: string,
  duration: string,
  nextRenewalDate: string,
  date: string,
  boxItems: string,
  petDetails: string,
  email: string
) => {
  try {
    console.log(boxItems);
    const res = await fetch(subEndpoint, {
      method: "POST",
      body: JSON.stringify({
        size: size,
        nextBillingDate: nextBillingDate,
        address: address,
        name: name,
        duration: duration,
        nextRenewalDate: nextRenewalDate,
        date: date,
        paymentDate: "-",
        boxItems: boxItems,
        petDetails: petDetails,
        email: email,
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

export const deactivateSubscription = async (contractId: string) => {
  const res = await fetch(subEndpoint + "deactivateContract", {
    method: "PUT",
    body: JSON.stringify({ contractId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.body;
};

export const createNewBox = async (
  contractId: string,
  date: string,
  number: string,
  size: string,
  paymentDate: string,
  boxItems: string
) => {
  const res = await fetch(subEndpoint + "addBox", {
    method: "POST",
    body: JSON.stringify({
      contractId: contractId,
      date: date,
      number: number,
      size: size,
      paymentDate: paymentDate,
      items: boxItems,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.body;
};

export const getRestocks = async () => {
  const res = await fetch(restockEndpoint);
  const data = await res.json();
  return data;
};

export const notifyRestock = async (
  variantId: string,
  link: string,
  productName: string,
  image: string
) => {
  console.log(
    { variantId, link, productName, image },
    restockEndpoint + "inform"
  );
  const res = await fetch(restockEndpoint + "inform", {
    method: "POST",
    body: JSON.stringify({ variantId, link, productName, image }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.body;
};
