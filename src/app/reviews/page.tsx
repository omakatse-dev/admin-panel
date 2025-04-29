import { getReviews } from "@/APIs";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import ReviewsTable from "@/components/ReviewsTable";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  const allReviews = await getReviews();
  
  return <ReviewsTable reviews={allReviews.reviews} />;
}
