import { Link } from 'react-router-dom';

export default function BlogTeaser({ post }) {
  // Safe data access with fallbacks
  const coverImageUrl = post?.fields?.pictureFlyer?.fields?.file?.url || '';


  const title = post?.fields?.title || 'No title available';
  const excerpt = post?.fields?.subtitlte || 'No excerpt available';
  const slug = post?.fields?.slug || '';

  // Loading state
  if (!post) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse">
        <div className="w-full h-64 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!post.fields) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-500">No blog post available</h3>
          <p className="text-gray-400 mb-4">Check back later for new posts</p>
          <div className="text-gray-400 font-semibold">Unavailable</div>
        </div>
      </div>
    );
  }

  // Normal render
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        {slug ? (
          <Link
            to={`/blog/${slug}`}
            className="text-purple-700 hover:underline font-semibold inline-flex items-center"
          >
            Read More <span className="ml-1">→</span>
          </Link>
        ) : (
          <span className="text-gray-400 font-semibold">Link unavailable</span>
        )}
      </div>
    </div>
  );
}
