import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from '../../services/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'blog',
          'fields.slug': slug,
        });
        if (res.items.length > 0) {
          setPost(res.items[0]);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!post || !post.fields) return <div className="p-10 text-center text-red-500">Post not found.</div>;

  const { title, pictureFlyer, publishDate, body } = post.fields;

  return (
    <div className="container bg-white mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-purpleDark mb-4">{title || 'Untitled'}</h1>
      <p className="text-purpleLight mb-6">
        Published on{' '}
        {publishDate ? new Date(publishDate).toLocaleDateString() : 'Unknown date'}
      </p>
      {pictureFlyer?.fields?.file?.url && (
        <img
          src={pictureFlyer.fields.file.url}
          alt={title || 'Blog cover'}
          className="w-full h-72 object-cover rounded-lg mb-10"
        />
      )}
      <article className="prose prose-lg max-w-none">
  {body
    ? documentToReactComponents(body, {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
          [BLOCKS.HEADING_2]: (node, children) => <h2>{children}</h2>,
          [BLOCKS.HEADING_3]: (node, children) => <h3>{children}</h3>,
          [BLOCKS.QUOTE]: (node, children) => <blockquote>{children}</blockquote>,
          [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-6">{children}</ul>,
          [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-6">{children}</ol>,
          [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
        },
      })
    : 'No content available.'}
</article>
    </div>
  );
}
