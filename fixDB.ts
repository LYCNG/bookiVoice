
import Book from "./database/models/book.model";
import { connectToDatabase } from "./database/mongoose";
import { generateSlug } from "./lib/utils";

async function fixSlugs() {
  try {
    await connectToDatabase();
    // Find books with empty slugs, null slugs, or just whitespace
    const books = await Book.find({ 
      $or: [
        { slug: "" }, 
        { slug: null }, 
        { slug: { $exists: false } },
        { slug: /^[\s-]+$/ } // Also catch slugs that are just dashes/spaces
      ] 
    });
    console.log(`Found ${books.length} books with problematic slugs.`);

    for (let book of books) {
      const newSlug = generateSlug(book.title);
      book.slug = newSlug;
      await book.save();
      console.log(`Updated book "${book.title}" with new slug: ${newSlug}`);
    }

    // Also let's check for books that might have a collision in slug due to fallback generating the same slug? No.
    console.log("Database patch completed.");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing DB:", err);
    process.exit(1);
  }
}

fixSlugs();
