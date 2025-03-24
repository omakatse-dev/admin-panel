import { redirect } from "next/navigation";

export type Review = {
  author: string;
  email: string;
  id: string;
  product: string;
  price: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  date: string;
  rating: number;
  title: string;
  body: string;
  image: string | null;
};

import { getReviews } from "@/APIs";
import ReviewRow from "@/components/ReviewRow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function Home() {
  const allReviews = await getReviews();

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex flex-col max-w-7xl">
      <h1 className="text-4xl font-bold">Approve / Reject Reviews</h1>
      <div className="grid grid-cols-5 border-b font-bold mt-12 gap-3">
        <div>Product Name</div>
        <div>Date Created</div>
        <div>Author</div>
        <div>Review Content</div>
        <div>Status</div>
      </div>
      <div className="flex flex-col gap-3 divide-y">
        {allReviews.reviews.map((review: Review) => (
          <ReviewRow key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
