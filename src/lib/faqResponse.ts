export function getFaqResponse(message: string): string | null {
  const lowerMsg = message.toLowerCase().trim();

  // Greeting responses
  if (
    lowerMsg.includes("hello") || 
    lowerMsg.includes("hi") || 
    lowerMsg.includes("hey") ||
    lowerMsg === "good morning" ||
    lowerMsg === "good afternoon" ||
    lowerMsg === "good evening"
  ) {
    return "Hello! Welcome to Zayna Hotel. I'm here to help you with information about our rooms, amenities, and services. What would you like to know?";
  }

  // Check-in/Check-out timing
  if (
    (lowerMsg.includes("check") && (lowerMsg.includes("in") || lowerMsg.includes("out"))) ||
    lowerMsg.includes("timing") ||
    lowerMsg.includes("check-in times") ||
    lowerMsg.includes("check-out time")
  ) {
    return "✅ Check-in starts at 2:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request for an additional fee. Please contact the front desk for availability.";
  }

  // Wi-Fi Information
  if (
    lowerMsg.includes("wifi") || 
    lowerMsg.includes("wi-fi") || 
    lowerMsg.includes("internet") ||
    lowerMsg.includes("wi-fi info")
  ) {
    return "📶 Yes! Free high-speed Wi-Fi is available throughout the entire hotel, including all guest rooms, lobby, restaurant, and common areas. The network name is 'Zayna-Guest' - no password required.";
  }

  // Breakfast Information
  if (
    lowerMsg.includes("breakfast") || 
    lowerMsg.includes("morning meal") ||
    lowerMsg.includes("breakfast hours") ||
    (lowerMsg.includes("food") && lowerMsg.includes("morning"))
  ) {
    return "🍳 Complimentary breakfast is served daily from 7:00 AM to 10:00 AM in our main dining room on the ground floor. We offer both continental and à la carte options, including fresh pastries, fruits, eggs, and local specialties.";
  }

  // Spa Services
  if (
    lowerMsg.includes("spa") || 
    lowerMsg.includes("massage") || 
    lowerMsg.includes("wellness") ||
    lowerMsg.includes("spa services") ||
    lowerMsg.includes("relaxation")
  ) {
    return "🧘‍♀️ Our luxury spa is open daily from 9:00 AM to 9:00 PM. We offer massages, facials, body treatments, and wellness therapies. Advance reservations are highly recommended - please call ext. 205 or visit the spa reception.";
  }

  // Parking Information
  if (
    lowerMsg.includes("park") || 
    lowerMsg.includes("car") || 
    lowerMsg.includes("vehicle") ||
    lowerMsg.includes("valet")
  ) {
    return "🚗 We offer complimentary valet parking for all guests at the main entrance. Self-parking is also available in our covered garage with 24/7 security. Both options are free of charge.";
  }

  // Pool and Fitness
  if (
    lowerMsg.includes("pool") || 
    lowerMsg.includes("swim") || 
    lowerMsg.includes("gym") || 
    lowerMsg.includes("fitness") ||
    lowerMsg.includes("exercise")
  ) {
    return "🏊‍♂️ Our heated outdoor pool is open 24/7 with poolside service available until 10 PM. The fully-equipped fitness center is open daily from 5:00 AM to 11:00 PM, featuring modern cardio and strength equipment.";
  }

  // Room Service
  if (
    lowerMsg.includes("room service") || 
    lowerMsg.includes("order food") ||
    lowerMsg.includes("dining in room") ||
    (lowerMsg.includes("food") && lowerMsg.includes("room"))
  ) {
    return "🍽️ Room service is available 24/7. You can order through the phone in your room (dial 0), via our Zayna Hotel mobile app, or through the in-room tablet. Full menu and wine list available.";
  }

  // Contact Information
  if (
    lowerMsg.includes("contact") || 
    lowerMsg.includes("phone") || 
    lowerMsg.includes("address") ||
    lowerMsg.includes("location") ||
    lowerMsg.includes("where are you")
  ) {
    return "📞 Zayna Hotel\n📍 123 Luxury Avenue, Downtown District\n☎️ Main: (555) 123-4567\n✉️ reservations@zaynahotel.com\n🌐 www.zaynahotel.com\n\nFront desk available 24/7 for assistance.";
  }

  // Hotel Amenities
  if (
    lowerMsg.includes("amenities") || 
    lowerMsg.includes("facilities") || 
    lowerMsg.includes("services") ||
    lowerMsg.includes("what do you offer")
  ) {
    return "🏨 Our amenities include:\n• Free high-speed Wi-Fi\n• Outdoor heated pool\n• Full-service spa\n• 24/7 fitness center\n• Business center\n• Concierge services\n• Valet & self-parking\n• 24/7 room service\n• Restaurant & bar\n• Meeting rooms";
  }

  // Pricing Information
  if (
    lowerMsg.includes("price") || 
    lowerMsg.includes("rate") || 
    lowerMsg.includes("cost") ||
    lowerMsg.includes("how much") ||
    lowerMsg.includes("booking")
  ) {
    return "💰 Room rates vary by season, room type, and availability. We offer competitive pricing with special packages and discounts. For current rates and reservations:\n📞 Call (555) 123-4567\n🌐 Visit www.zaynahotel.com\n📧 Email reservations@zaynahotel.com";
  }

  // Cancellation Policy
  if (
    lowerMsg.includes("cancel") || 
    lowerMsg.includes("refund") || 
    lowerMsg.includes("policy") ||
    lowerMsg.includes("change reservation")
  ) {
    return "📋 Cancellation Policy:\n• Free cancellation up to 24 hours before check-in\n• Cancellations within 24 hours: 1-night charge\n• No-shows: full stay charge\n• Modifications can be made by calling (555) 123-4567\n\nSpecial rates may have different policies.";
  }

  // Pet Policy
  if (
    lowerMsg.includes("pet") || 
    lowerMsg.includes("dog") || 
    lowerMsg.includes("cat") ||
    lowerMsg.includes("animal")
  ) {
    return "🐕 Pet-Friendly Policy:\n• We welcome pets up to 50 lbs\n• Pet fee: $50 per night\n• Maximum 2 pets per room\n• Please inform us during booking\n• Pet amenities include beds, bowls, treats, and nearby park information";
  }

  // Restaurant/Dining
  if (
    lowerMsg.includes("restaurant") || 
    lowerMsg.includes("dining") || 
    lowerMsg.includes("bar") ||
    lowerMsg.includes("eat") ||
    lowerMsg.includes("dinner") ||
    lowerMsg.includes("lunch")
  ) {
    return "🍴 Dining Options:\n• Main Restaurant: 6:30 AM - 11:00 PM\n• Rooftop Bar: 4:00 PM - 1:00 AM\n• Pool Bar: 11:00 AM - 10:00 PM\n• 24/7 Room Service\n\nReservations recommended for dinner. Happy hour 5-7 PM daily!";
  }

  // Business Services
  if (
    lowerMsg.includes("business") || 
    lowerMsg.includes("meeting") || 
    lowerMsg.includes("conference") ||
    lowerMsg.includes("work") ||
    lowerMsg.includes("office")
  ) {
    return "💼 Business Services:\n• 24/7 business center with computers & printers\n• Meeting rooms for 10-100 people\n• High-speed internet in all areas\n• Audio/visual equipment available\n• Catering services\n• Administrative support\n\nCall ext. 150 for bookings.";
  }

  // Transportation
  if (
    lowerMsg.includes("airport") || 
    lowerMsg.includes("shuttle") || 
    lowerMsg.includes("transport") ||
    lowerMsg.includes("taxi") ||
    lowerMsg.includes("uber")
  ) {
    return "🚖 Transportation:\n• Complimentary airport shuttle (advance booking required)\n• Valet can arrange taxis/rideshares\n• Car rental desk in lobby\n• Public transit stop 2 blocks away\n• Downtown attractions within walking distance\n\nCall front desk for shuttle reservations.";
  }

  // Thank you responses
  if (
    lowerMsg.includes("thank") || 
    lowerMsg.includes("thanks") ||
    lowerMsg.includes("appreciate")
  ) {
    return "You're very welcome! I'm always here to help make your stay at Zayna Hotel exceptional. Is there anything else you'd like to know about our services or amenities?";
  }

  // Goodbye responses
  if (
    lowerMsg.includes("bye") || 
    lowerMsg.includes("goodbye") ||
    lowerMsg.includes("see you") ||
    lowerMsg.includes("talk later")
  ) {
    return "Thank you for choosing Zayna Hotel! Have a wonderful day, and don't hesitate to reach out if you need anything. We're here 24/7 to assist you! 🌟";
  }

  // No match found
  return null;
}