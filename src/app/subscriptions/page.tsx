type SubscriptionType = {
  contractId: string;
  name: string;
  email: string;
  address: string;
  planDuration: string;
  duplicateCount: number;
  nextBillingDate: string;
  nextRenewalDate: string;
  items: string;
  size: string;
  pets: string;
};

import { createSubscription, getSubscriptionPlans } from "@/APIs";
export default async function page() {
  const res = await getSubscriptionPlans();

  // Count duplicates for each contractId
  const duplicateCounts = res.results.reduce(
    (acc: Record<string, number>, result: { contractId: string }) => {
      acc[result.contractId] = (acc[result.contractId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Create unique results with duplicate count
  const uniqueResults = res.results
    .filter(
      (
        result: { contractId: string },
        index: number,
        self: { contractId: string }[]
      ) =>
        self.findIndex(
          (t: { contractId: string }) => t.contractId === result.contractId
        ) === index
    )
    .map((result: { contractId: string }) => ({
      ...result,
      duplicateCount: duplicateCounts[result.contractId],
    }));

  return (
    <div className="flex flex-col w-screen max-w-7xl">
      <h1 className="text-4xl font-bold">Subscriptions</h1>
      <button
        className="border rounded-md py-2 px-8 w-fit mt-8 cursor-pointer"
        onClick={createSubscription}
      >
        Create New Subscription
      </button>
      <div className="flex flex-col gap-4 mt-12">
        <div className="grid grid-cols-10 gap-4 font-bold border-b">
          <div>Name</div>
          <div>Email</div>
          <div>Address</div>
          <div>Curr Box</div>
          <div>Total Boxes</div>
          <div>Box Size</div>
          <div>Pet Details</div>
          <div>Items</div>
        </div>
        {uniqueResults.map((result: SubscriptionType) => (
          <div
            key={result.contractId}
            className="grid grid-cols-10 gap-4 items-center"
          >
            <p>{result.name}</p>
            <p>{result.email}</p>
            <p>{result.address}</p>
            <p>{result.duplicateCount}</p>
            <p>{result.planDuration}</p>
            <p>{result.size}</p>
            <p>{result.pets}</p>
            <p>{result.items}</p>
            <button className="border rounded-md p-2 cursor-pointer">
              New Box
            </button>
            <button className="border border-red-500 text-red-500 rounded-md p-2 cursor-pointer">
              Deactivate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
