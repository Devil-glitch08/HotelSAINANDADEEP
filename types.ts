
export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
  capacity: number;
}

export interface Testimonial {
  id: string;
  author: string;
  rating: number;
  content: string;
  avatar: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}
