import { redirect } from "next/navigation";
import Link from "next/link";
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
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex flex-col max-w-7xl items-center gap-20">
      <h1 className="text-4xl font-bold">Home</h1>
      <div className="flex gap-12">
        <Link href="/subscriptions" className="bg-blue-400 p-8 rounded-md">
          Subscriptions
        </Link>
        <Link href="/reviews" className="bg-blue-400 p-8 rounded-md">
          Reviews
        </Link>
        <Link href="/restocks" className="bg-blue-400 p-8 rounded-md">
          Restocks
        </Link>
      </div>
    </div>
  );
}
