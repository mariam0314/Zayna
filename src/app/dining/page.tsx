"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGuestSession } from "@/hooks/useGuestSession";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus, Star, Clock, ChefHat } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const menuItems = [
  {
    id: 1,
    name: "Wagyu Beef Tenderloin",
    description: "Premium wagyu beef with truffle mashed potatoes and seasonal vegetables",
    price: 285,
    category: "Main Course",
    rating: 4.9,
    prepTime: "25-30 min",
    image: "https://themeatery.com/cdn/shop/articles/pan-seared-wagyu-beef-7-of-7.webp?v=1728655305&width=1920",
  },
  {
    id: 2,
    name: "Lobster Thermidor",
    description: "Fresh lobster in creamy cognac sauce with herb-crusted potatoes",
    price: 195,
    category: "Seafood",
    rating: 4.8,
    prepTime: "20-25 min",
    image: "https://www.allrecipes.com/thmb/r4smJXjq4boMyoTX00UaMTwBcpM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-87386-Lobster-Thermidor-DDMFS-4x3-3d182e9ac5ac494fbbb44787cd80fdad.jpg",
  },
  {
    id: 3,
    name: "Zayna Signature Pasta",
    description: "Handmade pasta with gold-infused truffle cream sauce and parmesan",
    price: 125,
    category: "Pasta",
    rating: 4.7,
    prepTime: "15-20 min",
    image: "https://s.lightorangebean.com/media/20240914160809/Spicy-Penne-Pasta_-done.png",
  },
  {
    id: 4,
    name: "Royal Sushi Platter",
    description: "Selection of premium sushi and sashimi with wasabi and ginger",
    price: 165,
    category: "Sushi",
    rating: 4.9,
    prepTime: "10-15 min",
    image: "https://images.stockcake.com/public/a/5/8/a58f1cfe-fe92-4c01-8618-99c0f479a7f0_large/delicious-sushi-platter-stockcake.jpg",
  },
  {
    id: 5,
    name: "Mediterranean Sea Bass",
    description: "Grilled sea bass with olive tapenade and roasted Mediterranean vegetables",
    price: 145,
    category: "Seafood",
    rating: 4.6,
    prepTime: "20-25 min",
    image: "https://www.licious.in/blog/wp-content/uploads/2021/09/shutterstock_1762534535-600x600.jpg",
  },
  {
    id: 6,
    name: "Chocolate Gold Souffle",
    description: "Decadent chocolate souffle with 24k gold flakes and vanilla ice cream",
    price: 85,
    category: "Dessert",
    rating: 4.8,
    prepTime: "25-30 min",
    image: "https://thumbs.dreamstime.com/b/premium-chocolate-souffle-cream-quenelle-gold-leaf-garnish-paired-amber-spirits-upscale-dining-high-quality-398497709.jpg",
  },
  {
    id: 7,
    name: "Caesar Salad Supreme",
    description: "Fresh romaine with parmesan, croutons, and our signature dressing",
    price: 65,
    category: "Salad",
    rating: 4.5,
    prepTime: "5-10 min",
    image: "https://www.allrecipes.com/thmb/mXZ0Tulwn3x9_YB_ZbkiTveDYFE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/229063-Classic-Restaurant-Caesar-Salad-ddmfs-4x3-231-89bafa5e54dd4a8c933cf2a5f9f12a6f.jpg",
  },
  {
    id: 8,
    name: "Dom Pérignon Champagne",
    description: "Premium vintage champagne served chilled",
    price: 450,
    category: "Beverages",
    rating: 5.0,
    prepTime: "Immediate",
    image: "https://lh3.googleusercontent.com/pBCxAuGw92OJfpqoVVlmPsxP1XTqQYlnsrLgHwzsAFb8lxfDypCuFZa0C1H7D5ku3Mfh7X6TKmY1HLh564NeCo63f-_G=w360-rw",
  },
];

const categories = ["All", "Main Course", "Seafood", "Pasta", "Sushi", "Salad", "Dessert", "Beverages"];

export default function DiningPage() {
  const { status } = useSession();
  const { guest, checked } = useGuestSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
        }];
      }
    });
  };

  const updateCartQuantity = (id: number, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const proceedToCheckout = () => {
    if (cart.length === 0) return;
    
    const orderSummary = cart.map(item => 
      `${item.quantity}x ${item.name} - AED ${item.price * item.quantity}`
    ).join('\n');
    
    alert(`Order Summary:\n${orderSummary}\n\nTotal: AED ${cartTotal}\n\nThis would proceed to Stripe payment in AED currency.`);
  };

  useEffect(() => {
    if (status === "unauthenticated" && checked && !guest) {
      router.replace("/");
    }
  }, [status, router, checked, guest]);

  if (status === "loading" || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (status === "unauthenticated" && !guest) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gold mb-4">Zayna Dining</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Experience exquisite cuisine crafted by world-class chefs using the finest ingredients
          </p>
        </div>

        {/* Cart Button */}
        <div className="fixed top-24 right-6 z-40">
          <button
            onClick={() => setShowCart(true)}
            className="btn-gold p-3 rounded-full shadow-lg relative"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? "btn-gold"
                  : "btn-outline-gold"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="card-black rounded-2xl overflow-hidden">
              {/* Image */}
              <div className="relative h-48 bg-black flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90" />
                <div className="absolute top-4 right-4">
                  <span className="bg-gold text-black px-2 py-1 rounded-full text-xs font-semibold">
                    AED {item.price}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gold">{item.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="text-gold fill-current" size={16} />
                    <span className="text-sm text-foreground">{item.rating}</span>
                  </div>
                </div>

                <p className="text-foreground/70 mb-4">{item.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-foreground/60">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{item.prepTime}</span>
                  </div>
                  <span className="text-gold font-semibold">AED {item.price}</span>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="btn-gold w-full py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="card-black rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gold">Your Order</h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-foreground hover:text-gold text-2xl"
                  >
                    ×
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="mx-auto text-gold/50 mb-4" size={48} />
                    <p className="text-foreground/60">Your cart is empty</p>
                    <p className="text-sm text-foreground/40 mt-2">
                      Add some delicious items from our menu
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 border border-gold/20 rounded-lg p-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-lg flex items-center justify-center">
                          <ChefHat className="text-gold/50" size={24} />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gold">{item.name}</h4>
                          <p className="text-sm text-foreground/60">AED {item.price} each</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="btn-outline-gold w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="btn-gold w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gold">AED {item.price * item.quantity}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-gold/20 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-gold">AED {cartTotal}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <button
                          onClick={proceedToCheckout}
                          className="btn-gold w-full py-3 rounded-lg"
                        >
                          Proceed to Payment
                        </button>
                        <button
                          onClick={() => setShowCart(false)}
                          className="btn-outline-gold w-full py-2 rounded-lg"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}