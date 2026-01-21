import React, { useState } from 'react';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  onBookNow: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBookNow }) => {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `Hotel Sai Nandadeep - ${room.name}`,
      text: `Check out the ${room.name} at Hotel Sai Nandadeep in Shirdi. Only ₹${room.price}/night! Extremely close to Dwarkamai.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setShowCopyFeedback(true);
        setTimeout(() => setShowCopyFeedback(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const whatsappLink = `https://wa.me/919405562019?text=Om%20Sai%20Ram!%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(room.name)}.%20Please%20let%20me%20know%20the%20availability.`;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-stone-100 flex flex-col h-full">
      <div className="relative h-72 overflow-hidden">
        <img 
          src={room.image} 
          alt={room.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-full font-bold shadow-md">
          ₹{room.price} <span className="text-xs font-normal opacity-80">/ night</span>
        </div>
        
        {/* Share Button Overlay */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full flex items-center justify-center shadow-md hover:bg-amber-600 hover:text-white transition-all transform active:scale-90 group/share"
          aria-label="Share room"
        >
          {showCopyFeedback ? (
            <span className="text-[10px] font-bold">COPIED</span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center space-x-2 text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Up to {room.capacity} Guests</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4 group-hover:text-amber-700 transition-colors">
          {room.name}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
          {room.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8 flex-1">
          {room.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="text-[10px] px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-100">
              {amenity}
            </span>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onBookNow(room)}
            className="flex-1 text-center py-4 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all active:scale-95 shadow-md shadow-amber-600/10"
          >
            Book Now
          </button>

          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-sm"
            title="WhatsApp for Availability"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049c0 2.123.554 4.197 1.607 6.037L0 24l6.105-1.602a11.834 11.834 0 005.937 1.598h.005c6.637 0 12.05-5.414 12.053-12.051a11.78 11.78 0 00-3.391-8.526z"/>
            </svg>
          </a>
          
          <a 
            href="tel:9405562019"
            className="w-14 h-14 bg-stone-50 text-slate-400 border border-stone-200 rounded-xl flex items-center justify-center hover:text-amber-600 hover:border-amber-600 hover:bg-white transition-all active:scale-95 shadow-sm"
            title="Call Management"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;