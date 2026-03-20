"use client";
import Link from "next/link";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const navItems = [
  { label: "Library", href: "/" },
  {
    label: "Add New",
    href: "/books/new",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-[85vw] z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all">
      <div className="px-6 md:px-10 navbar-height py-4 flex justify-between items-center">
        <Link href="/" className="flex gap-2 items-center">
          <Image
            src="/assets/logo.png"
            alt="Bookfified"
            width={32}
            height={32}
            className="rounded-lg shadow-sm"
          />
          <span className="text-xl font-bold text-foreground">Bookfified</span>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-7.5 items-center">
            {navItems.map(({ label, href }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));

              return (
                <Link
                  key={label}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary hover:text-primary/80"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 border-l border-border pl-8">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 shadow-sm cursor-pointer">
                  Get Started
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9 border border-border",
                    },
                  }}
                />
                {user?.firstName && (
                  <Link
                    href="/subscriptions"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {user.firstName}
                  </Link>
                )}
              </div>
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
