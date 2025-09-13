"use client";

import { useState } from "react";
import { MapPin, Eye, Star, Clock, Camera } from "lucide-react";

const touristAttractions = [
  {
    id: 1,
    name: "Burj Khalifa",
    description: "World's tallest building with breathtaking views",
    image: "/placeholder-burj.jpg",
    rating: 4.8,
    distance: "2.5 km",
    duration: "2-3 hours",
    category: "Landmarks",
    has360: true,
  },
  {
    id: 2,
    name: "Dubai Mall",
    description: "World's largest shopping and entertainment destination",
    image: "/placeholder-mall.jpg",
    rating: 4.7,
    distance: "3.1 km",
    duration: "Half day",
    category: "Shopping",
    has360: true,
  },
  {
    id: 3,
    name: "Dubai Fountain",
    description: "Spectacular water, music and light show",
    image: "/placeholder-fountain.jpg",
    rating: 4.9,
    distance: "3.0 km",
    duration: "30 minutes",
    category: "Entertainment",
    has360: true,
  },
  {
    id: 4,
    name: "Palm Jumeirah",
    description: "Iconic palm-shaped artificial island",
    image: "/placeholder-palm.jpg",
    rating: 4.6,
    distance: "8.2 km",
    duration: "Full day",
    category: "Beaches",
    has360: true,
  },
  {
    id: 5,
    name: "Dubai Marina",
    description: "Stunning waterfront district with luxury yachts",
    image: "/placeholder-marina.jpg",
    rating: 4.5,
    distance: "12.1 km",
    duration: "3-4 hours",
    category: "Waterfront",
    has360: true,
  },
  {
    id: 6,
    name: "Gold Souk",
    description: "Traditional market for gold and jewelry",
    image: "/placeholder-souk.jpg",
    rating: 4.4,
    distance: "5.8 km",
    duration: "1-2 hours",
    category: "Culture",
    has360: false,
  },
];

const categories = ["All", "Landmarks", "Shopping", "Entertainment", "Beaches", "Waterfront", "Culture"];

export default function TourismPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAttraction, setSelectedAttraction] = useState<typeof touristAttractions[0] | null>(null);

  const filteredAttractions = selectedCategory === "All" 
    ? touristAttractions 
    : touristAttractions.filter(attraction => attraction.category === selectedCategory);

  const open360View = (attraction: typeof touristAttractions[0]) => {
    // Simulate 360° view - in a real app, this would open a 360° viewer
    setSelectedAttraction(attraction);
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gold mb-4">Explore Dubai</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Discover the best attractions near Zayna Hotel with immersive 360° virtual tours
          </p>
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

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAttractions.map((attraction) => (
            <div key={attraction.id} className="card-black rounded-2xl overflow-hidden">
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <Camera className="text-gold/50" size={48} />
                <div className="absolute top-4 right-4">
                  {attraction.has360 && (
                    <span className="bg-gold text-black px-2 py-1 rounded-full text-xs font-semibold">
                      360° Available
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gold">{attraction.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="text-gold fill-current" size={16} />
                    <span className="text-sm text-foreground">{attraction.rating}</span>
                  </div>
                </div>

                <p className="text-foreground/70 mb-4">{attraction.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-foreground/60">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{attraction.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{attraction.duration}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {attraction.has360 && (
                    <button
                      onClick={() => open360View(attraction)}
                      className="btn-gold flex-1 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      360° View
                    </button>
                  )}
                  <button className="btn-outline-gold flex-1 py-2 rounded-lg">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 360° View Modal */}
        {selectedAttraction && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="card-black rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gold">{selectedAttraction.name}</h3>
                  <button
                    onClick={() => setSelectedAttraction(null)}
                    className="text-foreground hover:text-gold text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                {/* 360° Viewer Placeholder */}
                <div className="h-96 bg-gradient-to-br from-gold/10 to-gold/5 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="mx-auto text-gold mb-4" size={64} />
                    <h4 className="text-xl font-semibold text-gold mb-2">360° Virtual Tour</h4>
                    <p className="text-foreground/70">Experience {selectedAttraction.name} in immersive 360°</p>
                    <p className="text-sm text-foreground/50 mt-2">
                      * 360° viewer would be integrated here with real panoramic images
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button className="btn-gold px-6 py-2 rounded-lg">
                    Book Tour
                  </button>
                  <button className="btn-outline-gold px-6 py-2 rounded-lg">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}