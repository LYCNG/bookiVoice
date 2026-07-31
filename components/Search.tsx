"use client";

import React, { useEffect, useState } from "react";

import { Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, pathname, router]);

  return (
    <div className="relative w-full sm:max-w-xs group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary text-slate-400">
        <SearchIcon size={18} />
      </div>
      <Input
        type="text"
        placeholder="Search books..."
        className="w-full pl-11 pr-4 py-6 bg-slate-100/50 border-slate-200/60 rounded-2xl shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-400 text-slate-700"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default Search;
