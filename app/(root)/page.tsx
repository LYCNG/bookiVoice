export const dynamic = "force-dynamic";

import Hero from "@/components/Hero";

import BookCard from "@/components/BookCard";
import Search from "@/components/Search";
import { getAllBooks } from "@/lib/actions/book.actions";

const page = async () => {
  const bookResult = await getAllBooks();

  const books = bookResult.success ? (bookResult.data ?? []) : [];

  return (
    <div className="container">
      <Hero />
      <div className="wrapper">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#212a3b]">
            Recent Books
          </h2>
          <Search />
        </div>

        <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 md:gap-x-10 gap-y-7 md:gap-y-9 ">
          {books.map((book: any, index: number) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              slug={book.slug}
              priority={index < 5}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
