
import React, { useState, useEffect } from 'react';
import { ReviewData, getReviewsFromSupabase, saveReviewToSupabase } from '../services/supabaseClient';
import { TESTIMONIALS } from '../constants';

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    content: ''
  });

  const fetchReviews = async () => {
    try {
      const data = await getReviewsFromSupabase();
      
      if (data && data.length > 0) {
        setReviews(data);
      } else {
        // If DB is connected but empty, show static testimonials as default
        loadFallbackReviews();
      }
    } catch (err) {
      // If DB fails (table not found, etc.), show static testimonials
      console.log("Using local testimonials as fallback...");
      loadFallbackReviews();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFallbackReviews = () => {
    setReviews(TESTIMONIALS.map(t => ({
      id: parseInt(t.id),
      author: t.author,
      rating: t.rating,
      content: t.content,
      avatar: t.avatar,
      created_at: new Date().toISOString()
    })));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.content) return;
    
    setIsSubmitting(true);
    try {
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(newReview.author)}&background=random&color=fff`;
      await saveReviewToSupabase({ ...newReview, avatar });
      
      setNewReview({ author: '', rating: 5, content: '' });
      setShowForm(false);
      await fetchReviews();
    } catch (err) {
      alert("Note: Review could not be saved to database. Check if the 'reviews' table exists in your Supabase project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-stone-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-800/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-700/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 space-y-6 md:space-y-0 text-center md:text-left">
          <div>
            <span className="text-amber-400 font-bold tracking-widest text-sm uppercase mb-2 block">Guest Feedback</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white">Devotee Experiences</h2>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20"
          >
            {showForm ? 'Close Form' : 'Write a Review'}
          </button>
        </div>

        {showForm && (
          <div className="mb-16 bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
            <h3 className="text-2xl font-serif font-bold text-amber-400 mb-8 text-center">Share Your Stay Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-amber-500/60 ml-1">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newReview.author}
                    onChange={e => setNewReview({...newReview, author: e.target.value})}
                    placeholder="E.g. Rajesh Kumar"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-amber-500/60 ml-1">Rating</label>
                  <div className="flex space-x-2 bg-white/5 border border-white/10 rounded-xl p-3.5 justify-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className={`text-2xl transition-all ${newReview.rating >= star ? 'text-amber-400 scale-110' : 'text-white/20 hover:text-white/40'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-amber-500/60 ml-1">Your Thoughts</label>
                <textarea 
                  required
                  rows={4}
                  value={newReview.content}
                  onChange={e => setNewReview({...newReview, content: e.target.value})}
                  placeholder="Tell others about the divine atmosphere..."
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-white resize-none placeholder:text-white/20"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-amber-600 text-white rounded-xl font-bold text-lg hover:bg-amber-700 transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Posting Feedback...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/10 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div 
                key={review.id || i} 
                className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] shadow-2xl flex flex-col hover:bg-white/10 transition-all duration-500 group"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <img 
                    src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}`} 
                    alt={review.author} 
                    className="w-14 h-14 rounded-full border-2 border-amber-500 shadow-lg object-cover bg-stone-800" 
                  />
                  <div>
                    <h4 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">{review.author}</h4>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, idx) => (
                        <svg 
                          key={idx} 
                          className={`w-3.5 h-3.5 fill-current ${idx < review.rating ? 'text-amber-400' : 'text-white/10'}`} 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-stone-300 italic text-lg leading-relaxed flex-1">"{review.content}"</p>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent Guest'}
                   </span>
                   <span className="text-[10px] font-black uppercase text-amber-500/40 tracking-widest">
                    Verified Stay
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
