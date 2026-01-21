
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cdotyptpcevrbnyyuypx.supabase.co';
const supabaseKey = 'sb_publishable_nIkfGqof1_bH_En2yIQZRw_V6SI3IrS';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface BookingData {
  name: string;
  mobile_number: string;
  address: string;
  check_in: string;
  check_out: string;
  rooms_count: number;
  room_type: string;
  total_price: number;
  payment_method: string;
  transaction_id: string;
  floor: string;
  room_numbers: string;
}

export interface ReviewData {
  id?: number;
  created_at?: string;
  author: string;
  rating: number;
  content: string;
  avatar?: string;
}

export async function saveBookingToSupabase(booking: BookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking]);
  
  if (error) {
    console.error('Supabase Booking Error:', error.message, error.details);
    throw error;
  }
  return data;
}

export async function saveReviewToSupabase(review: ReviewData) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review]);
  
  if (error) {
    console.error('Supabase Review Post Error:', error.message, error.details);
    throw error;
  }
  return data;
}

export async function getReviewsFromSupabase() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.warn('Supabase Fetch Notice:', error.message);
    throw error;
  }
  return data as ReviewData[];
}
