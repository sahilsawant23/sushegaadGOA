import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockBlogPosts } from '../data/mockData';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Travel Tips', 'Destinations', 'Food & Culture', 'Adventure', 'Heritage'];

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1499750310159-5b5f8c673246?w=1600&q=80"
            alt="Travel Blog"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg font-serif">
              Travel Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover travel tips, hidden gems, and insider insights about Goa
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {category === 'all' ? 'All Posts' : category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <img
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full">
                      {filteredPosts[0].category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{filteredPosts[0].publishDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{filteredPosts[0].author}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {filteredPosts[0].excerpt}
                  </p>
                  <Link
                    to={`/blog/${filteredPosts[0].id}`}
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.publishDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center space-x-1"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or browse all posts</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest travel tips, destination guides, and exclusive deals delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Blog;