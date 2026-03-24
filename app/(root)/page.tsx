import React from "react";
import Hero from "@/components/Hero";
import { sampleBooks } from "@/lib/constant";
import BookCard from "@/components/BookCard";
import Search from "@/components/Search";

const page = () => {
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
          {sampleBooks.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              slug={book.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
