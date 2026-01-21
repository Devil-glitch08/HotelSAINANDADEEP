
import React, { useState, useMemo } from 'react';
import { ROOMS } from '../constants';
import { saveBookingToSupabase, BookingData } from '../services/supabaseClient';

type PaymentMethod = 'paypal' | 'cash';

const FLOOR_ROOMS: Record<string, string[]> = {
  '1st Floor': ['101', '102'],
  '2nd Floor': ['201', '202'],
  '3rd Floor': ['301', '302'],
  '4th Floor': ['401', '402'],
};

const BookingForm: React.FC = () => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomsCount, setRoomsCount] = useState(1);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('1st Floor');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS[0].id);
  const [transactionId] = useState(() => 'SN-' + Math.random().toString(36).substr(2, 9).toUpperCase());

  const selectedRoom = useMemo(() => 
    ROOMS.find(r => r.id === selectedRoomId) || ROOMS[0], 
  [selectedRoomId]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }, [checkIn, checkOut]);

  const totalPrice = nights * selectedRoom.price * roomsCount;

  const handleRoomToggle = (roomNum: string) => {
    setSelectedRooms(prev => {
      if (prev.includes(roomNum)) return prev.filter(r => r !== roomNum);
      if (prev.length < roomsCount) return [...prev, roomNum];
      return [roomNum];
    });
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (nights <= 0) {
      setError("Please select valid stay dates.");
      return;
    }

    if (!mobile || mobile.length < 10) {
      setError("Valid 10-digit mobile number is required.");
      return;
    }

    if (selectedRooms.length !== roomsCount) {
      setError(`Please select exactly ${roomsCount} room(s) for your stay.`);
      return;
    }

    setStep('payment');
  };

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const bookingData: BookingData = {
        name,
        mobile_number: mobile,
        address,
        check_in: checkIn,
        check_out: checkOut,
        rooms_count: roomsCount,
        room_type: selectedRoom.name,
        total_price: totalPrice,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        floor: selectedFloor,
        room_numbers: selectedRooms.join(', ')
      };

      await saveBookingToSupabase(bookingData);
      
      if (paymentMethod === 'paypal') {
        window.open('https://www.paypal.com/paypalme/YGondkar', '_blank');
      }

      setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
      }, 2000);
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Connection failed. Please contact us directly.');
      setIsProcessing(false);
    }
  };

  const handleShareReceipt = async () => {
    const shareText = `🙏 Om Sai Ram!\n\nBooking Confirmation\nHotel Sai Nandadeep, Shirdi\n\nGuest: ${name}\nReceipt ID: ${transactionId}\nRoom: ${roomsCount} x ${selectedRoom.name}\nFloor: ${selectedFloor}\nRooms: ${selectedRooms.join(', ')}\nStay: ${checkIn} to ${checkOut}\nTotal: ₹${totalPrice}\n\nManaged by Gondkar Brothers`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booking Confirmation - Hotel Sai Nandadeep',
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

  if (step === 'success') {
    return (
      <div className="bg-white rounded-[3rem] p-8 md:p-16 text-center shadow-2xl border border-amber-100 max-w-2xl mx-auto my-12 animate-in zoom-in-95 duration-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400"></div>
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner border border-green-100">✓</div>
        <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2">Om Sai Ram, {name}!</h3>
        <p className="text-amber-700 font-bold uppercase tracking-widest text-xs mb-4">Request Logged Successfully</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
           <button 
             onClick={handleShareReceipt}
             className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center text-sm"
           >
             <span className="mr-2">📲</span> Share to WhatsApp
           </button>
           <a 
             href={`https://wa.me/919405562019?text=Om%20Sai%20Ram!%20Confirm%20my%20stay.%20Receipt:%20${transactionId}`}
             target="_blank"
             rel="noopener noreferrer"
             className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center text-sm"
           >
             <span className="mr-2">🛎️</span> Message Hotel
           </a>
        </div>

        <div className="bg-stone-50 rounded-[2.5rem] p-10 mb-8 border border-stone-100 text-left">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Selected Unit</p>
              <p className="text-slate-800 font-bold text-lg">{roomsCount} x {selectedRoom.name}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Allocation</p>
              <p className="text-amber-700 font-bold">{selectedFloor}</p>
            </div>
          </div>
          <div className="pt-6 border-t border-stone-200">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Receipt ID</p>
            <p className="text-slate-800 font-black font-serif text-xl tracking-wider">{transactionId}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={() => { setStep('details'); setSelectedRooms([]); }} className="px-10 py-4 border border-stone-200 rounded-2xl font-bold hover:bg-stone-50 transition-all text-sm">New Booking</button>
          <a href="/" className="px-10 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all text-sm">Home</a>
        </div>
      </div>
    );
  }

  return (
    <div id="booking" className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-stone-100 max-w-5xl mx-auto my-12">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 p-8 md:p-12">
          <h3 className="text-3xl font-serif font-bold text-slate-900 mb-8">Pilgrimage Stay Registration</h3>
          
          {error && (
            <div className="mb-6 p-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center animate-bounce">
              <span className="text-2xl mr-3">⚠️</span>
              <p className="font-bold text-sm">{error}</p>
            </div>
          )}

          {step === 'details' ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" required placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" />
                <input type="tel" required placeholder="Mobile Number" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Arrival</label>
                   <input type="date" required min={new Date().toISOString().split('T')[0]} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 font-bold text-slate-700" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Departure</label>
                   <input type="date" required min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 font-bold text-slate-700" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Room Type & Quantity</label>
                  <div className="flex gap-4">
                    <select value={selectedRoomId} onChange={(e) => { setSelectedRoomId(e.target.value); setSelectedRooms([]); }} className="flex-1 px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500 font-bold"><option value="1">Non-AC</option><option value="2">Deluxe AC</option></select>
                    <input type="number" min="1" max="8" value={roomsCount} onChange={(e) => { setRoomsCount(Math.max(1, parseInt(e.target.value) || 1)); setSelectedRooms([]); }} className="w-20 px-4 py-3 rounded-xl border border-stone-200 text-center font-black" />
                  </div>
                </div>
              </div>

              {/* Floor/Room Selection */}
              <div className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-200 space-y-6">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Choose Floor & Preferred Rooms</p>
                 <div className="flex flex-wrap gap-2">
                    {Object.keys(FLOOR_ROOMS).map(f => (
                      <button key={f} type="button" onClick={() => { setSelectedFloor(f); setSelectedRooms([]); }} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${selectedFloor === f ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-400 border border-stone-200'}`}>{f}</button>
                    ))}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {FLOOR_ROOMS[selectedFloor].map(roomNum => (
                      <button key={roomNum} type="button" onClick={() => handleRoomToggle(roomNum)} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-1 ${selectedRooms.includes(roomNum) ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-inner' : 'border-white bg-white text-slate-300'}`}>
                        <span className="text-lg">🏨</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Room {roomNum}</span>
                      </button>
                    ))}
                 </div>
              </div>

              <textarea required placeholder="Home Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" rows={2} />
              <button type="submit" className="w-full py-5 bg-amber-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-amber-600/20 uppercase tracking-widest hover:bg-amber-700 transition-all">Submit Devotee Registration</button>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 shadow-inner">
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Choose Payment Method</p>
                  <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => setPaymentMethod('paypal')} className={`p-6 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-widest ${paymentMethod === 'paypal' ? 'border-amber-600 bg-amber-50 text-amber-900' : 'bg-white text-slate-400 border-stone-100'}`}>PayPal</button>
                     <button onClick={() => setPaymentMethod('cash')} className={`p-6 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-widest ${paymentMethod === 'cash' ? 'border-amber-600 bg-amber-50 text-amber-900' : 'bg-white text-slate-400 border-stone-100'}`}>Cash</button>
                  </div>
               </div>
               <button onClick={handlePaymentConfirm} disabled={isProcessing} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-xl shadow-slate-900/20 disabled:opacity-50 uppercase tracking-widest">
                 {isProcessing ? 'Confirming...' : paymentMethod === 'paypal' ? 'Pay Offering via PayPal' : 'Confirm Registration'}
               </button>
               <button onClick={() => setStep('details')} className="w-full text-slate-400 font-black text-xs uppercase tracking-[0.4em] hover:text-amber-700 transition-colors">← Back to Details</button>
            </div>
          )}
        </div>
        <div className="bg-stone-50 p-8 md:p-12 border-l border-stone-100 flex flex-col justify-center">
          <div className="sticky top-0">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 block">Reservation Summary</span>
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 mb-8">
                <p className="text-slate-800 font-black text-lg leading-tight mb-2">{roomsCount} x {selectedRoom.name}</p>
                <p className="text-amber-700 font-bold text-xs">{selectedFloor} • Rooms: {selectedRooms.join(', ')}</p>
                <div className="mt-6 pt-6 border-t border-stone-50">
                   <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Offering</p>
                   <p className="text-4xl font-serif font-black text-amber-700 leading-none">₹{totalPrice}</p>
                </div>
             </div>
             <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 italic text-[10px] text-amber-800 leading-relaxed font-bold">
               * Room numbers are subject to manual verification. Final receipt provided at check-in.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
