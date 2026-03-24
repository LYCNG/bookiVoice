import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookCardProps } from "@/types";

const BookCard = ({ title, author, coverURL, slug, priority }: BookCardProps) => {
  return (
    <Link href={`/books/${slug}`}>
      <article className="flex flex-col gap-4 group cursor-pointer w-full">
        <figure className="bg-white rounded-[32px] p-6 shadow-sm group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 border border-black/5">
          <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl shadow-md">
            <Image
              src={coverURL}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={priority}
            />
          </div>
        </figure>
        <figcaption className="px-2">
          <h3 className="font-serif font-bold text-xl text-[#2D241E] mt-2 group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
          <p className="text-sm font-medium text-muted-foreground line-clamp-1">{author}</p>
        </figcaption>
      </article>
    </Link>
  );
};

export default BookCard;
