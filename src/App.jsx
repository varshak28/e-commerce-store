import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Trash2, Plus, Minus, Eye, X } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch Products from Fake Store API
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter Logic
  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Functions
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalCartPrice = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* NAVBAR */}
      <nav className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-wider text-blue-400">
              DevMart
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-slate-800 rounded-full transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO & FILTERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            No products found!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition group"
              >
                <div>
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg flex items-center justify-center p-2 bg-slate-50">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white text-slate-700 shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mt-1 mb-2">
                    {product.title}
                  </h3>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-black text-slate-900">
                      ${product.price}
                    </span>
                    <span className="text-xs text-amber-500 font-bold">
                      ★ {product.rating?.rate}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-sm transition"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h2 className="text-lg font-bold">Your Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-slate-500 text-center py-10">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-3 gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold line-clamp-1">
                          {item.title}
                        </h4>
                        <span className="text-xs text-slate-500">
                          ${item.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 bg-slate-100 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs px-2 font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 bg-slate-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4 text-lg font-bold">
                <span>Total:</span>
                <span>${totalCartPrice}</span>
              </div>
              <button
                disabled={cart.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:bg-slate-300"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-32 h-32 object-contain"
              />
              <div>
                <span className="text-xs text-blue-600 font-bold uppercase">
                  {selectedProduct.category}
                </span>
                <h3 className="font-bold text-base mt-1">
                  {selectedProduct.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                  {selectedProduct.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black">
                    ${selectedProduct.price}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}