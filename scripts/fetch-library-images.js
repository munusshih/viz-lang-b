import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIBRARY_JSON_PATH = path.join(__dirname, "../src/data/library.json");

async function searchBookCover(title, author = "") {
  try {
    console.log(`  Searching book cover for: "${title}"...`);

    // Try Google Books API first
    const query = encodeURIComponent(`${title} ${author}`.trim());
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

    const response = await fetch(googleBooksUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LibraryBot/1.0)",
      },
      timeout: 10000,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const book = data.items[0];
        if (book.volumeInfo?.imageLinks) {
          // Prefer larger images
          const imageUrl =
            book.volumeInfo.imageLinks.large ||
            book.volumeInfo.imageLinks.medium ||
            book.volumeInfo.imageLinks.thumbnail ||
            book.volumeInfo.imageLinks.smallThumbnail;

          if (imageUrl) {
            // Convert to https and get larger version
            const highResUrl = imageUrl
              .replace("http:", "https:")
              .replace("&zoom=1", "&zoom=2");
            console.log(`  ✓ Found book cover via Google Books: ${highResUrl}`);
            return highResUrl;
          }
        }
      }
    }

    // Try Open Library
    const openLibraryUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`;
    const olResponse = await fetch(openLibraryUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LibraryBot/1.0)",
      },
      timeout: 10000,
    });

    if (olResponse.ok) {
      const data = await olResponse.json();
      if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];
        if (book.cover_i) {
          const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
          console.log(`  ✓ Found book cover via Open Library: ${coverUrl}`);
          return coverUrl;
        }
      }
    }

    // Try Wikidata/Wikipedia
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=500&origin=*`;
    const wikiResponse = await fetch(wikiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LibraryBot/1.0)",
      },
      timeout: 10000,
    });

    if (wikiResponse.ok) {
      const data = await wikiResponse.json();
      const pages = data.query?.pages;
      if (pages) {
        const page = Object.values(pages)[0];
        if (page?.thumbnail?.source) {
          console.log(
            `  ✓ Found image via Wikipedia: ${page.thumbnail.source}`,
          );
          return page.thumbnail.source;
        }
      }
    }

    // Try Internet Archive
    const iaUrl = `https://archive.org/advancedsearch.php?q=title:(${encodeURIComponent(title)})&fl=identifier&output=json&rows=1`;
    const iaResponse = await fetch(iaUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LibraryBot/1.0)",
      },
      timeout: 10000,
    });

    if (iaResponse.ok) {
      const data = await iaResponse.json();
      if (data.response?.docs?.length > 0) {
        const identifier = data.response.docs[0].identifier;
        const coverUrl = `https://archive.org/services/img/${identifier}`;
        // Verify the cover exists
        try {
          const coverCheck = await fetch(coverUrl, {
            method: "HEAD",
            timeout: 5000,
          });
          if (coverCheck.ok) {
            console.log(
              `  ✓ Found book cover via Internet Archive: ${coverUrl}`,
            );
            return coverUrl;
          }
        } catch (e) {
          // Cover doesn't exist, continue
        }
      }
    }

    console.log(`  ✗ No book cover found for "${title}"`);
    return null;
  } catch (error) {
    console.error(`  Error searching book cover:`, error.message);
    return null;
  }
}

async function fetchOGImage(url) {
  try {
    console.log(`Fetching OG image for: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LibraryBot/1.0)",
      },
      timeout: 10000,
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Priority order: book cover images, og:image, twitter:image
    const patterns = [
      // Book cover patterns (various book sites)
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*book[^"']*)["']/i,
      /<meta[^>]*content=["']([^"']*book[^"']*)["'][^>]*property=["']og:image["']/i,
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*cover[^"']*)["']/i,
      /<meta[^>]*content=["']([^"']*cover[^"']*)["'][^>]*property=["']og:image["']/i,
      // Standard OG image
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
      // Twitter image
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let imageUrl = match[1];

        // Handle relative URLs
        if (imageUrl.startsWith("/")) {
          const urlObj = new URL(url);
          imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
        }

        console.log(`✓ Found image: ${imageUrl}`);
        return imageUrl;
      }
    }

    console.warn(`No OG image found for ${url}`);
    return null;
  } catch (error) {
    console.error(`Error fetching OG image for ${url}:`, error.message);
    return null;
  }
}

async function processLibrary() {
  console.log("Loading library.json...");
  const libraryData = JSON.parse(fs.readFileSync(LIBRARY_JSON_PATH, "utf-8"));

  async function processItems(items) {
    const processedItems = [];

    for (const item of items) {
      const processedItem = { ...item };

      // Skip Google Drive links and PDFs (they don't have useful OG images)
      if (
        !item.url.includes("drive.google.com") &&
        !item.url.endsWith(".pdf")
      ) {
        processedItem.thumbnail = await fetchOGImage(item.url);

        // If no OG image found, try searching for book cover
        if (!processedItem.thumbnail && item.title) {
          processedItem.thumbnail = await searchBookCover(
            item.title,
            item.author,
          );
        }

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        console.log(`Skipping: ${item.url}`);

        // Even for PDFs, try to find book cover
        if (item.title) {
          processedItem.thumbnail = await searchBookCover(
            item.title,
            item.author,
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          processedItem.thumbnail = null;
        }
      }

      processedItems.push(processedItem);
    }

    return processedItems;
  }

  // Process all sections
  for (const section of libraryData.sections) {
    if (section.items) {
      section.items = await processItems(section.items);
    }

    if (section.subsections) {
      for (const subsection of section.subsections) {
        if (subsection.items) {
          subsection.items = await processItems(subsection.items);
        }
      }
    }
  }

  // Write the result back to library.json
  console.log(`\nWriting results to ${LIBRARY_JSON_PATH}...`);
  fs.writeFileSync(LIBRARY_JSON_PATH, JSON.stringify(libraryData, null, 2));
  console.log("✓ Done!");
}

processLibrary().catch(console.error);
