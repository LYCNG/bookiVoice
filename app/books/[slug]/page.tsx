export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBookBySlug } from "@/lib/actions/book.actions";
import BookDetailsPage from "@/components/BookDetailsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  return <BookDetailsPage book={result.data} />;
}
