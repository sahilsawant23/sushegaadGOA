import React, { useState } from 'react';
import { ARTISAN_PRODUCTS } from '../data/marketplaceData';
import { ArtisanProduct } from '../types';
import { ShoppingBag, Star, ShieldCheck, MapPin, Search, Filter, Check, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Marketplace: React.FC = () => {
  const [products] = useState<ArtisanProduct[]>(ARTISAN_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<{ product: ArtisanProduct; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeStoryProduct, setActiveStoryProduct] = useState<ArtisanProduct | null>(null);

  const categories = ['All', 'Feni & Spirits', 'Cashews & Spices', 'Handicrafts', 'Kunbi Textiles', 'Sweets & Preserves'];

  const filteredProducts = products.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: ArtisanProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`Added ${product.title} to your cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-8 md:p-12 mb-10 shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Direct from Local Artisans & Farmers
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Authentic Goan Marketplace 🌴
            </h1>
            <p className="text-amber-100 text-base md:text-lg mb-6">
              Support traditional Goan craftsman, weavers, distillers, and organic spice planters. 100% authentic local heritage shipped straight to your doorstep.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center space-x-2 bg-white text-amber-900 font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition"
              >
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <span>View Cart ({cart.reduce((a, c) => a + c.quantity, 0)})</span>
              </button>

              <div className="flex items-center space-x-2 text-xs text-amber-100 bg-black/20 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Eco-Certified & GI-Tagged Products</span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-12 translate-y-12">
            <ShoppingBag className="w-96 h-96" />
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cashews, feni, sarees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur text-white text-xs font-semibold rounded-xl">
                      {product.category}
                    </span>
                    {product.ecoCertified && (
                      <span className="flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-500/90 text-white text-xs font-bold rounded-lg shadow-sm">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Eco Certified</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveStoryProduct(product)}
                    className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow backdrop-blur hover:bg-amber-600 hover:text-white transition"
                  >
                    Read Artisan Story 📖
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="flex items-center space-x-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{product.originVillage}, {product.location}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{product.rating} ({product.reviewCount})</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    Crafted by <strong className="text-slate-800 dark:text-slate-200">{product.artisanName}</strong>. {product.story}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Direct Price</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-2xl shadow-md transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm">Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full p-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Goan Cart</h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-center text-slate-400 py-10">Your cart is currently empty.</p>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-12 h-12 object-cover rounded-xl"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                              {item.product.title}
                            </h4>
                            <span className="text-xs text-amber-600 font-semibold">
                              ₹{item.product.price} × {item.quantity}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-rose-500 font-bold hover:underline px-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500 text-sm font-medium">Subtotal</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ₹{totalCartPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      toast.success('Order placed successfully! Local artisans notified.');
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition"
                  >
                    Proceed to Direct Checkout (UPI / Card)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Artisan Story Modal */}
        {activeStoryProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setActiveStoryProduct(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-950/60 rounded-2xl text-amber-600">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeStoryProduct.artisanName}
                  </h3>
                  <p className="text-xs text-amber-600 font-semibold">
                    {activeStoryProduct.originVillage}, {activeStoryProduct.location}
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                {activeStoryProduct.story}
              </p>
              <button
                onClick={() => setActiveStoryProduct(null)}
                className="w-full bg-amber-600 text-white font-bold py-3 rounded-2xl"
              >
                Close Story
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Marketplace;
