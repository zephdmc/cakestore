import { createClient } from 'contentful';

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
});

// Add this function
export async function getBlogPosts() {
  const entries = await client.getEntries({
    content_type: 'blog', // Make sure this matches your Contentful content type
    order: '-sys.createdAt' // Optional: newest first
  });
  return entries.items;
}

export default client;
