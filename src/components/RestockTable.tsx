"use client";

import { notifyRestock } from "@/APIs";
import { useState } from "react";

export type RestockItemType = {
  variantId: string;
  emails: string;
  product: ProductType;
  link: string;
};

export type ProductType = {
  title: string;
  id: string;
  images: {
    nodes: {
      url: string;
    }[];
  };
};

function Spinner() {
  return (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  );
}

export default function RestockTable({
  restocks,
}: {
  restocks: RestockItemType[];
}) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const notifyHandler = async (restock: RestockItemType) => {
    setLoadingStates((prev) => ({ ...prev, [restock.variantId]: true }));
    try {
      const res = await notifyRestock(
        restock.variantId,
        restock.link,
        restock.product.title,
        restock.product.images.nodes[0].url
      );
      console.log("success", res);
      window.location.reload();
    } catch (error) {
      alert("Error sending restock alert" + error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [restock.variantId]: false }));
    }
  };

  return (
    <div>
      <div className="grid grid-cols-5 border-b font-bold mt-12 gap-6">
        <div>Product Variant ID</div>
        <div>Product Name</div>
        <div>Requests</div>
        <div>Action</div>
      </div>
      {restocks.map((restock: RestockItemType) => {
        const isLoading = loadingStates[restock.variantId] || false;

        return (
          <div
            key={restock.variantId}
            className="grid grid-cols-5 items-center py-2 gap-6"
          >
            <a
              href={restock.link}
              target="_blank"
              className="underline text-blue-600"
            >
              {restock.variantId}
            </a>
            <div>{restock.product?.title}</div>
            <div>
              {JSON.parse(restock.emails).map((email: string) => (
                <div key={email}>{email}</div>
              ))}
            </div>
            <button
              className={`bg-blue-400 rounded-lg py-3 px-4 cursor-pointer flex items-center justify-center gap-2 min-w-[160px] ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-500"
              }`}
              onClick={() => notifyHandler(restock)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Sending...</span>
                </>
              ) : (
                "Send Restock Alert"
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
