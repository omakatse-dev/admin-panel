import { getRestocks } from "@/APIs";
import { authOptions } from "@/auth";
import RestockTable, { RestockItemType } from "@/components/RestockTable";
import { getProductDetailsFromVariantId } from "@/shopifyAPIs";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const restocks = await getRestocks();
  const restockItems = await Promise.all(
    restocks.results.map(async (restock: RestockItemType) => {
      const product = await getProductDetailsFromVariantId(
        "gid://shopify/ProductVariant/" + restock.variantId
      );
      return {
        ...restock,
        ...product,
        link:
          "https://omakatsepets.com/shop/" +
          product.product.id.split("/").pop(),
      };
    })
  );

  // console.log(restockItems);

  return (
    <div className="flex flex-col max-w-7xl w-screen">
      <Link href="/" className="text-blue-400">
        Back to Home
      </Link>
      <h1 className="text-4xl font-bold">Restock Requests</h1>
      <RestockTable restocks={restockItems} />
    </div>
  );
}
