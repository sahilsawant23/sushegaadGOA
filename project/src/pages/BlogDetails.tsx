import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';
import { mockBlogPosts } from '../data/mockData';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const blogPost = mockBlogPosts.find(post => post.id === id);

    if (!blogPost) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
                    <button
                        onClick={() => navigate('/blog')}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Blog</span>
                    </button>
                </div>
            </div>
        );
    }

    // Default read time if not present in type
    const readTime = "5 min read";

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="relative h-[60vh]">
                <img
                    src={blogPost.image}
                    alt={blogPost.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto text-white">
                    <button
                        onClick={() => navigate('/blog')}
                        className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Blog</span>
                    </button>
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        <span className="bg-blue-600 px-3 py-1 rounded-full text-white flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            {blogPost.category}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
                        {blogPost.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{blogPost.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{blogPost.publishDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{readTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 -mt-20 relative z-10">
                    <div
                        className="prose prose-lg max-w-none hover:prose-a:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: blogPost.content }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
