"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { 
  User, 
  Calendar, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  LogOut,
  CreditCard,
  Settings,
  MessageCircle
} from "lucide-react";

export default function GuestDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="card-black p-8 rounded-2xl mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gold mb-2">
                Welcome back, {session.user?.name}!
              </h1>
              <p className="text-foreground/70">
                Manage your reservations, orders, and preferences at Zayna Hotel
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="btn-outline-gold px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push("/tourism")}
            className="card-black p-6 rounded-2xl text-left hover:border-gold transition-all"
          >
            <MapPin className="text-gold mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gold mb-2">Explore Tourism</h3>
            <p className="text-foreground/70">Discover local attractions with 360° virtual tours</p>
          </button>

          <button
            onClick={() => router.push("/spa")}
            className="card-black p-6 rounded-2xl text-left hover:border-gold transition-all"
          >
            <Heart className="text-gold mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gold mb-2">Book Spa Services</h3>
            <p className="text-foreground/70">Relax with our luxury spa treatments and massages</p>
          </button>

          <button
            onClick={() => router.push("/dining")}
            className="card-black p-6 rounded-2xl text-left hover:border-gold transition-all"
          >
            <ShoppingBag className="text-gold mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gold mb-2">Order Dining</h3>
            <p className="text-foreground/70">Browse our menu and order delicious meals</p>
          </button>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="card-black p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-gold" size={24} />
              <h2 className="text-xl font-semibold text-gold">Profile Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-foreground/60">Name</label>
                <p className="text-foreground">{session.user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-foreground/60">Email</label>
                <p className="text-foreground">{session.user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-foreground/60">Phone</label>
                <p className="text-foreground">{session.user?.phone || "Not provided"}</p>
              </div>
              <button className="btn-outline-gold px-4 py-2 rounded-lg flex items-center gap-2">
                <Settings size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-black p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-gold" size={24} />
              <h2 className="text-xl font-semibold text-gold">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              <div className="text-center py-8">
                <MessageCircle className="mx-auto text-gold/50 mb-4" size={48} />
                <p className="text-foreground/60">No recent activity</p>
                <p className="text-sm text-foreground/40 mt-2">
                  Your spa appointments and dining orders will appear here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="card-black p-4 rounded-xl text-center">
            <Calendar className="mx-auto text-gold mb-2" size={24} />
            <p className="text-2xl font-bold text-gold">0</p>
            <p className="text-sm text-foreground/60">Spa Appointments</p>
          </div>
          <div className="card-black p-4 rounded-xl text-center">
            <ShoppingBag className="mx-auto text-gold mb-2" size={24} />
            <p className="text-2xl font-bold text-gold">0</p>
            <p className="text-sm text-foreground/60">Food Orders</p>
          </div>
          <div className="card-black p-4 rounded-xl text-center">
            <CreditCard className="mx-auto text-gold mb-2" size={24} />
            <p className="text-2xl font-bold text-gold">AED 0</p>
            <p className="text-sm text-foreground/60">Total Spent</p>
          </div>
          <div className="card-black p-4 rounded-xl text-center">
            <Heart className="mx-auto text-gold mb-2" size={24} />
            <p className="text-2xl font-bold text-gold">0</p>
            <p className="text-sm text-foreground/60">Favorite Services</p>
          </div>
        </div>
      </div>
    </div>
  );
}