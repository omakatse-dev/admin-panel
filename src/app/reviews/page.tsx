import { getReviews } from "@/APIs";
import { Review } from "../page";
import ReviewRow from "@/components/ReviewRow";
import Link from "next/link";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  const allReviews = await getReviews();
  return (
    <div className="flex flex-col max-w-7xl">
      <Link href="/" className="text-blue-400">
        Back to Home
      </Link>
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
