
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoomCard from './components/RoomCard';
import BookingModal from './components/BookingModal';
import ReviewsSection from './components/ReviewsSection';
import { ROOMS, AMENITIES, ATTRACTIONS, TRANSPORT_MODES, PILGRIM_TIPS } from './constants.tsx';
import { Room } from './types';

const App: React.FC = () => {
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [view, setView] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setView(params.get('view'));
  }, []);

  const handleBookNow = (room: Room) => {
    setSelectedRoomForBooking(room);
  };

  const handleCloseModal = () => {
    setSelectedRoomForBooking(null);
  };

  // Dedicated Availability View for New Tab
  if (view === 'availability') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-serif">
        <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl border border-stone-100 overflow-hidden text-center relative">
          <div className="h-3 bg-amber-600 w-full"></div>
          
          <div className="p-12 md:p-20">
            <div className="text-amber-600 text-5xl mb-8">🙏</div>
            <span className="text-amber-700 font-bold tracking-[0.3em] text-xs uppercase mb-4 block font-sans">Om Sai Ram</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              Room Confirmation
            </h1>
            <p className="text-slate-600 text-lg md:text-xl mb-12 font-sans leading-relaxed">
              For real-time room availability and manual confirmation of your pilgrimage stay, please contact our management team directly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 font-sans">Call Us</p>
                <a 
                  href="tel:9405562019" 
                  className="text-3xl font-black text-amber-700 hover:text-amber-800 transition-colors block"
                >
                  9405562019
                </a>
              </div>
              <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4 font-sans">WhatsApp Us</p>
                <a 
                  href="https://wa.me/919405562019" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl font-black text-emerald-700 hover:text-emerald-800 transition-colors block"
                >
                  Message
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center font-sans">
              <button 
                onClick={() => window.close()} 
                className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
              >
                Close Tab
              </button>
              <a 
                href="/" 
                className="px-8 py-4 bg-white border border-stone-200 text-slate-700 rounded-2xl font-bold hover:bg-stone-50 transition-all"
              >
                Back to Home
              </a>
            </div>
          </div>
          
          <div className="p-6 bg-stone-50 border-t border-stone-100 text-slate-400 text-[10px] uppercase font-bold tracking-widest font-sans">
            Hotel Sai Nandadeep • Shirdi
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Explore Shirdi */}
      <section id="explore" className="py-24 px-6 bg-stone-50 border-y border-stone-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 mb-4">
              <span className="h-[1px] w-8 bg-amber-600"></span>
              <span className="text-amber-700 font-bold tracking-[0.4em] text-xs uppercase">Sacred Shirdi</span>
              <span className="h-[1px] w-8 bg-amber-600"></span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">Your Pilgrimage Guide</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Nestled in the heart of Shirdi, Hotel Sai Nandadeep serves as your gateway to the divine. 
              Discover the sacred landmarks just steps from our door.
            </p>
          </div>

          <div className="mb-32">
            <div className="flex items-center space-x-4 mb-12">
              <div className="bg-amber-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-600/20">01</div>
              <div>
                <h3 className="text-3xl font-serif font-bold text-slate-800">Sacred Landmarks Nearby</h3>
                <p className="text-slate-400 text-sm font-medium">Within 5 minutes of walking distance</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {ATTRACTIONS.map((attr, idx) => (
                <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-amber-200/30 transition-all duration-500 group border border-stone-100 flex flex-col h-full">
                  <div className="h-64 overflow-hidden relative">
                    <img src={attr.image} alt={attr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute top-6 left-6 flex space-x-2">
                      <div className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-amber-800 tracking-wider shadow-sm flex items-center">
                        <span className="mr-2">🚶</span> {attr.distance}
                      </div>
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-1">
                    <h4 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-700 transition-colors">{attr.name}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">{attr.description}</p>
                    <div className="pt-6 border-t border-stone-50 flex justify-between items-center">
                      <span className="text-[10px] font-black text-amber-600/50 uppercase tracking-widest">Divine Presence</span>
                      <button className="text-amber-600 text-sm font-bold hover:underline">Directions →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center space-x-4 mb-12">
                <div className="bg-amber-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-600/20">02</div>
                <div>
                  <h3 className="text-3xl font-serif font-bold text-slate-800">How to Reach Us</h3>
                  <p className="text-slate-400 text-sm font-medium">Arrival & local commuting options</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {TRANSPORT_MODES.map((mode, idx) => (
                  <div key={idx} className="flex flex-col p-8 bg-white rounded-3xl border border-stone-100 shadow-sm hover:border-amber-200 transition-all group">
                    <div className="text-4xl mb-6 bg-stone-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-amber-50 group-hover:scale-110 transition-all duration-300">
                      {mode.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">{mode.title}</h4>
                      <p className="text-amber-700 text-[10px] font-black uppercase tracking-widest mb-4">{mode.detail}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{mode.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="flex items-center space-x-4 mb-12">
                <div className="bg-amber-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-600/20">03</div>
                <div>
                  <h3 className="text-3xl font-serif font-bold text-slate-800">Essential Tips</h3>
                  <p className="text-slate-400 text-sm font-medium">Important advice for your visit</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="space-y-10 relative z-10">
                  {PILGRIM_TIPS.map((tip, idx) => (
                    <div key={idx} className="flex space-x-6 group">
                      <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-2 group-hover:scale-150 transition-transform"></div>
                      <div>
                        <h4 className="text-amber-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">{tip.title}</h4>
                        <p className="text-stone-300 text-sm leading-relaxed font-light">{tip.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section id="about" className="py-24 px-6 bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-700 font-bold tracking-widest text-sm uppercase mb-4 block">Serving Devotees Since 2012</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-slate-900 leading-tight">
            Clean & Comfortable Stay <br /> Steps from Dwarkamai
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed font-light mb-10">
            Hotel Sai Nandadeep has been providing essential, clean, and peaceful lodging for Shirdi pilgrims since 2012. 
            Focusing exclusively on quality accommodation, we offer 3-bed rooms located near the historic Chavadi 
            and Dwarkamai, ensuring you are always close to the divine presence of Sai Baba.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 shadow-sm inline-block">
               <p className="text-amber-800 text-sm font-medium">Stay Only: No food services provided on-site.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 shadow-sm inline-block">
               <p className="text-blue-800 text-sm font-medium">Hot Water: Daily from 5:00 AM to 8:00 AM.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-24 bg-stone-50 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-amber-700 font-bold tracking-widest text-sm uppercase block">Our Accommodations</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900">Triple Bed Rooms</h2>
              <p className="text-slate-500 mt-2 text-sm">Submit your booking request below and contact us for instant confirmation.</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Direct Contact</p>
              <div className="flex flex-col items-end">
                <p className="text-amber-700 font-serif font-black text-2xl">9405562019</p>
                <a href="https://wa.me/919405562019" target="_blank" className="text-emerald-600 text-xs font-bold uppercase tracking-widest hover:underline flex items-center">
                  <span className="mr-1">💬</span> WhatsApp Now
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="sticky top-24">
                <div className="bg-stone-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden border border-amber-500/10">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-amber-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-xl shadow-amber-600/20">🛎️</div>
                    <h3 className="text-3xl font-serif font-bold text-amber-400 mb-6">Connect for Availability</h3>
                    <p className="text-stone-300 mb-8 leading-relaxed font-light">
                      To ensure your pilgrimage stay is perfectly arranged, please connect with hotel management directly via Call or WhatsApp for real-time room confirmation.
                    </p>
                    <div className="space-y-4 mb-8">
                       <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 mb-1">Call Management</p>
                             <a href="tel:9405562019" className="text-2xl font-serif font-black text-white group-hover:text-amber-400">9405562019</a>
                          </div>
                          <div className="text-2xl">📞</div>
                       </div>
                       <a href="https://wa.me/919405562019" target="_blank" className="bg-emerald-600/10 rounded-3xl p-6 border border-emerald-500/20 flex justify-between items-center group hover:bg-emerald-600/20 transition-all block w-full text-left">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">WhatsApp Chat</p>
                             <span className="text-2xl font-serif font-black text-white group-hover:text-emerald-400">Message Us</span>
                          </div>
                          <div className="text-2xl">💬</div>
                       </a>
                    </div>
                    <div className="flex items-center space-x-3 text-emerald-400">
                       <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                       <span className="text-xs font-bold uppercase tracking-widest">Available 24/7 for Devotees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {ROOMS.map(room => (
                  <RoomCard key={room.id} room={room} onBookNow={handleBookNow} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Reviews Section */}
      <ReviewsSection />

      {/* Footer */}
      <footer id="contact" className="bg-stone-950 pt-24 pb-12 text-stone-400 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="col-span-1">
              <div className="text-2xl font-serif font-bold text-white mb-6 tracking-tight">HOTEL SAI NANDADEEP</div>
              <p className="text-sm leading-relaxed mb-6 opacity-70">
                Providing peaceful, 3-bed lodging near Dwarkamai for Shirdi pilgrims since 2012. Your comfort and spiritual peace is our priority.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Reach Us</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex items-start"><span className="mr-2 text-amber-500">📍</span>Near Dwarkamai & Chavadi Temple, Shirdi</li>
                <li className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2 text-amber-500">📞</span>
                    <a href="tel:9405562019" className="font-serif font-bold text-white hover:text-amber-700 transition-colors text-xl tracking-tight">9405562019</a>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-emerald-500">💬</span>
                    <a href="https://wa.me/919405562019" target="_blank" className="hover:text-emerald-500 transition-colors">WhatsApp Management</a>
                  </div>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-amber-500">✉️</span>
                  <a href="mailto:yashgondkar0707@gmail.com" className="hover:text-amber-500 transition-colors">yashgondkar0707@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-stone-600 text-center md:text-left space-y-4 md:space-y-0">
            <div>
              <p>&copy; 2024 Hotel Sai Nandadeep, Shirdi. All rights reserved.</p>
              <div className="mt-1 flex flex-col md:flex-row md:space-x-4 opacity-50">
                <p>Owned & Managed by <span className="text-amber-500">Gondkar Brothers</span></p>
                <p className="hidden md:block">|</p>
                <p>Serving Pilgrims Since <span className="text-amber-500">2012</span></p>
              </div>
            </div>
            <div className="flex space-x-6">
              <span className="opacity-40">Privacy Policy</span>
              <span className="opacity-40">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {selectedRoomForBooking && (
        <BookingModal 
          room={selectedRoomForBooking} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default App;
