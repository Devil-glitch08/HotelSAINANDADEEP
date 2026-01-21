
import { Room, Testimonial } from './types';

export const TOTAL_HOTEL_ROOMS = 8;

export const ROOMS: Room[] = [
  {
    id: '1',
    name: 'Standard Triple Room',
    description: 'A clean and well-maintained room featuring three comfortable single beds, perfect for families or groups of pilgrims. Located just a 2-minute walk from Dwarkamai.',
    price: 1000,
    image: 'room_triple.jpg',
    amenities: ['3 Comfortable Beds', 'Attached Bathroom', 'Hot Water (5AM-8AM)', 'Ceiling Fan', 'Daily Housekeeping'],
    capacity: 3
  },
  {
    id: '2',
    name: 'Deluxe AC Room',
    description: 'Our premium offering featuring a large comfortable bed and high-quality air conditioning. Ideal for guests looking for extra comfort during their Shirdi pilgrimage.',
    price: 1500,
    image: 'room_ac.jpg',
    amenities: ['Air Conditioning', 'Large Double Bed', 'LED TV', 'Hot Water (5AM-8AM)', 'Premium Linen'],
    capacity: 3
  }
];

// Mock Occupancy Data: Date string mapping to number of rooms booked (Max 8)
const today = new Date();
const formatDate = (daysToAdd: number) => {
  const d = new Date();
  d.setDate(today.getDate() + daysToAdd);
  return d.toISOString().split('T')[0];
};

export const MOCK_OCCUPANCY: Record<string, number> = {
  [formatDate(2)]: 8, // Fully booked
  [formatDate(3)]: 8, // Fully booked
  [formatDate(5)]: 4, // Partially booked
  [formatDate(7)]: 8, // Fully booked
  [formatDate(10)]: 2,
  [formatDate(14)]: 8,
  [formatDate(15)]: 8,
  [formatDate(21)]: 5,
};

export const ATTRACTIONS = [
  {
    name: "Dwarkamai",
    distance: "2 min walk",
    description: "The sacred mosque where Sai Baba lived for 60 years. Home to the eternal sacred fire (Dhuni).",
    image: "https://images.unsplash.com/photo-1561488132-5952c9b48da1?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Chavadi",
    distance: "3 min walk",
    description: "The place where Baba stayed on alternate nights. It holds deep spiritual significance during the Palanquin procession.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Khandoba Temple",
    distance: "5 min walk",
    description: "The historical site where the priest first welcomed the saint with the words 'Aao Sai' (Welcome Sai).",
    image: "https://images.unsplash.com/photo-1590050752117-23a9d7fc91db?auto=format&fit=crop&w=600&q=80"
  }
];

export const TRANSPORT_MODES = [
  {
    title: "Shirdi Airport (SKO)",
    detail: "15 km (30 mins drive)",
    icon: "✈️",
    desc: "Direct flights from major cities like Mumbai, Delhi, and Hyderabad."
  },
  {
    title: "Sainagar Shirdi Railway",
    detail: "3 km (10 mins drive)",
    icon: "🚂",
    desc: "Direct trains available. We can arrange pick-up via our travel desk."
  },
  {
    title: "Local Rickshaws",
    detail: "Available 24/7",
    icon: "🛺",
    desc: "Standard rates apply for travel to distant Shirdi attractions."
  }
];

export const PILGRIM_TIPS = [
  { title: "Online Darshan", text: "Book your Darshan and Aarti slots online via the official Sansthan portal to save time." },
  { title: "Dress Code", text: "Modest and traditional Indian attire is recommended for temple entry." },
  { title: "Peak Days", text: "Thursdays and holidays are busiest. Expect longer wait times for Darshan." },
  { title: "Footwear", text: "You must leave footwear at designated stands before entering the temple complex." }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Rajesh Kulkarni',
    rating: 5,
    content: 'Very close to Dwarkamai. We walked to the early morning Kakad Aarti easily. The rooms are basic but very clean and perfect for families.',
    avatar: 'https://i.pravatar.cc/150?u=rajesh'
  },
  {
    id: '2',
    author: 'Anjali Sharma',
    rating: 5,
    content: 'Hotel Sai Nandadeep provided exactly what we needed - a clean, affordable place to stay near the temple. The 3-bed arrangement was perfect for us.',
    avatar: 'https://i.pravatar.cc/150?u=anjali'
  }
];

export const AMENITIES = [
  { name: 'Walk to Temple', icon: '🚶' },
  { name: 'Travel Desk', icon: '🚕' },
  { name: 'Triple Bed Rooms', icon: '🛏️' },
  { name: '24/7 Security', icon: '🛡️' },
  { name: 'Free Parking', icon: '🅿️' },
  { name: 'Hot Water (5-8 AM)', icon: '🚿' }
];
