import UploadForm from "@/components/UploadForm";
import React from "react";

const page = () => {
  return (
    <main>
      <div className="wrapper container">
        <div className="mx-auto max-w-180 space-y-10">
          <section className="flex flex-col gap-5">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#212a3b]">
              Add a New Book
            </h1>
            <p className="text-muted-foreground">
              Upload a book and start chatting with it
            </p>
          </section>
          <UploadForm />
        </div>
      </div>
    </main>
  );
};

export default page;
