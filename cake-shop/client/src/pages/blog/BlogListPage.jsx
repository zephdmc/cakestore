import { useEffect, useState } from 'react';
import client from '../../services/contentful';
import BlogTeaser from '../../components/blog/BlogTeaser';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const entries = await client.getEntries({
          content_type: 'blog',
          order: '-fields.publishDate',
        });
        setBlogs(entries.items);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">From the Blog</h1>

      {loading ? (
        <p className="text-center text-purpleDark">Loading blog posts...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-red-600">No blog posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <BlogTeaser key={post.sys.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
