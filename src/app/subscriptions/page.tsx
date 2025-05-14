export type SubscriptionType = {
  contractId: string;
  name: string;
  email: string;
  address: string;
  planDuration: string;
  duplicateCount: number;
  nextBillingDate: string;
  nextRenewalDate: string;
  items: string;
  contractSize: string;
  pets: string;
  status: string;
  number: string;
};

import { getSubscriptionPlans } from "@/APIs";
import { authOptions } from "@/auth";
import CreateSubscription from "@/components/CreateSubscription";
import SubscriptionsTable from "@/components/SubscriptionsTable";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function page() {
  const res = await getSubscriptionPlans();
  // console.log("here", res)

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Count duplicates for each contractId
  const duplicateCounts = res.results.reduce(
    (acc: Record<string, number>, result: { contractId: string }) => {
      acc[result.contractId] = (acc[result.contractId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Create unique results with duplicate count, keeping the entry with highest number
  const uniqueResults = res.results.reduce(
    (acc: SubscriptionType[], result: SubscriptionType) => {
      const existing = acc.find(
        (item) => item.contractId === result.contractId
      );
      if (!existing) {
        return [
          ...acc,
          { ...result, duplicateCount: duplicateCounts[result.contractId] },
        ];
      }
      // Keep the entry with the higher number
      if (parseInt(result.number) > parseInt(existing.number)) {
        return acc.map((item) =>
          item.contractId === result.contractId
            ? { ...result, duplicateCount: duplicateCounts[result.contractId] }
            : item
        );
      }
      return acc;
    },
    []
  );
  // console.log("uniqueResults", uniqueResults);
  return (
    <div className="flex flex-col w-screen px-8 max-w-7xl">
      <Link href="/" className="text-blue-400">
        Back to Home
      </Link>
      <h1 className="text-4xl font-bold">Subscriptions</h1>
      <CreateSubscription />
      <SubscriptionsTable uniqueResults={uniqueResults} />
    </div>
  );
}
