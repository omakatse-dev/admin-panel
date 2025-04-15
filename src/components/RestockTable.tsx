"use client";

import { notifyRestock } from "@/APIs";

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

export default function RestockTable({
  restocks,
}: {
  restocks: RestockItemType[];
}) {
  const notifyHandler = async () => {
    try {
      const res = await notifyRestock(
        restocks[0].variantId,
        restocks[0].link,
        restocks[0].product.title,
        restocks[0].product.images.nodes[0].url
      );
      console.log("success", res);
      window.location.reload();
    } catch (error) {
      alert("Error sending restock alert" + error);
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
      {restocks.map((restock: RestockItemType) => (
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
          <div>{JSON.parse(restock.emails).length}</div>
          <button
            className="bg-blue-400 rounded-lg py-3 cursor-pointer"
            onClick={notifyHandler}
          >
            Send Restock Alert
          </button>
        </div>
      ))}
    </div>
  );
}
