
import React, { useState, useMemo, useEffect } from 'react';
import { Room } from '../types';
import { saveBookingToSupabase, BookingData } from '../services/supabaseClient';

interface BookingModalProps {
  room: Room;
  onClose: () => void;
}

type PaymentMethod = 'paypal' | 'cash';

const FLOOR_ROOMS: Record<string, string[]> = {
  '1st Floor': ['101', '102'],
  '2nd Floor': ['201', '202'],
  '3rd Floor': ['301', '302'],
  '4th Floor': ['401', '402'],
};

const BookingModal: React.FC<BookingModalProps> = ({ room, onClose }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomsCount, setRoomsCount] = useState(1);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('1st Floor');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [transactionId] = useState(() => 'SN-' + Math.random().toString(36).substr(2, 9).toUpperCase());

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }, [checkIn, checkOut]);

  const totalPrice = nights * room.price * roomsCount;

  const handleRoomToggle = (roomNum: string) => {
    setSelectedRooms(prev => {
      if (prev.includes(roomNum)) {
        return prev.filter(r => r !== roomNum);
      }
      if (prev.length < roomsCount) {
        return [...prev, roomNum];
      }
      return [roomNum];
    });
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (nights <= 0) {
      setError("Please select valid arrival and departure dates.");
      return;
    }

    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (selectedRooms.length !== roomsCount) {
      setError(`Please select exactly ${roomsCount} room(s) from the room selection.`);
      return;
    }

    setStep('payment');
  };

  const handlePaymentConfirm = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      const bookingData: BookingData = {
        name,
        mobile_number: mobile,
        address,
        check_in: checkIn,
        check_out: checkOut,
        rooms_count: roomsCount,
        room_type: room.name,
        total_price: totalPrice,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        floor: selectedFloor,
        room_numbers: selectedRooms.join(', ')
      };

      await saveBookingToSupabase(bookingData);

      if (paymentMethod === 'paypal') {
        window.open('https://www.paypal.com/paypalme/YGondkar', '_blank');
        setTimeout(() => {
          setIsRedirecting(true);
          setTimeout(() => {
            setIsProcessing(false);
            setIsRedirecting(false);
            setStep('success');
          }, 2000);
        }, 1500);
      } else {
        setTimeout(() => {
          setIsProcessing(false);
          setStep('success');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Booking failed:', err);
      setError('Connection error. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleShareReceipt = async () => {
    const shareText = `🙏 Om Sai Ram!\n\nBooking Confirmation\nHotel Sai Nandadeep, Shirdi\n\nGuest: ${name}\nReceipt ID: ${transactionId}\nRoom: ${roomsCount} x ${room.name}\nFloor: ${selectedFloor}\nRooms: ${selectedRooms.join(', ')}\nStay: ${checkIn} to ${checkOut}\nTotal: ₹${totalPrice}\n\nManaged by Gondkar Brothers`;
    
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

  const PayPalLogo = () => (
    <div className="flex items-center">
      <span className="font-black italic text-[#003087] text-lg tracking-tighter">Pay</span>
      <span className="font-black italic text-[#009cde] text-lg tracking-tighter">Pal</span>
    </div>
  );

  const PaymentOption = ({ id, icon, label, sublabel }: { id: PaymentMethod, icon: React.ReactNode, label: string, sublabel: string }) => (
    <button 
      onClick={() => { setError(null); setPaymentMethod(id); }} 
      className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-2 group ${
        paymentMethod === id 
          ? 'border-amber-600 bg-amber-50 shadow-md ring-2 ring-amber-600/10' 
          : 'border-stone-100 bg-white hover:border-stone-200 hover:shadow-sm'
      }`}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <span className={`text-xs font-black uppercase tracking-widest ${
        paymentMethod === id ? 'text-amber-900' : 'text-slate-500'
      }`}>{label}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter group-hover:text-slate-500">{sublabel}</span>
    </button>
  );

  const whatsappConfirmLink = `https://wa.me/919405562019?text=Om%20Sai%20Ram!%20I%20have%20just%20submitted%20a%20booking%20request%20for%20${encodeURIComponent(room.name)}%20(Receipt%20ID:%20${transactionId}).%20Please%20confirm%20my%20stay.`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        {isRedirecting && (
          <div className="absolute inset-0 z-[110] bg-white flex flex-col items-center justify-center p-8">
            <PayPalLogo />
            <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin my-6"></div>
            <h3 className="text-xl font-bold text-slate-800">Redirecting to PayPal...</h3>
          </div>
        )}

        <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {step === 'success' ? (
          <div className="p-8 md:p-16 text-center bg-white flex-1 flex flex-col justify-center">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">✓</div>
            <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2">Om Sai Ram, {name}!</h3>
            <p className="text-amber-700 font-bold uppercase tracking-widest text-xs mb-4">Request Logged Successfully</p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-8 max-w-2xl mx-auto w-full">
              <div className="flex-1 bg-amber-50 text-amber-900 p-6 rounded-3xl border border-amber-100 flex flex-col items-center space-y-4">
                <p className="text-sm font-bold leading-relaxed">Send this to Hotel Management for instant verification.</p>
                <a 
                  href={whatsappConfirmLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-600/20 flex items-center justify-center"
                >
                  <span className="mr-2 text-lg">📲</span> Confirm to Hotel
                </a>
              </div>
              <div className="flex-1 bg-blue-50 text-blue-900 p-6 rounded-3xl border border-blue-100 flex flex-col items-center space-y-4">
                <p className="text-sm font-bold leading-relaxed">Share these stay details with family or save for reference.</p>
                <button 
                  onClick={handleShareReceipt}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center justify-center"
                >
                  <span className="mr-2 text-lg">📤</span> Share Confirmation
                </button>
              </div>
            </div>

            <div className="bg-stone-50 rounded-[2.5rem] p-10 mb-10 border border-stone-100 shadow-sm max-w-2xl mx-auto w-full text-left">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Devotee Information</p>
                  <p className="text-slate-800 font-bold">{name}</p>
                  <p className="text-slate-500 text-sm">{mobile}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Allocation</p>
                  <p className="text-amber-700 font-black text-xl">{selectedFloor}</p>
                  <p className="text-slate-800 font-bold">Room(s): {selectedRooms.join(', ')}</p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="px-16 py-5 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all mx-auto shadow-xl">Return to Home</button>
          </div>
        ) : step === 'payment' ? (
          <div className="p-8 md:p-12 flex-1 flex flex-col">
            <div className="text-center mb-10">
              <span className="text-amber-700 font-bold tracking-[0.3em] text-[10px] uppercase mb-1 block">Step 2: Payment</span>
              <h3 className="text-4xl font-serif font-bold text-slate-900">Choose Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <PaymentOption id="paypal" icon={<PayPalLogo />} label="PayPal" sublabel="International Payments" />
                  <PaymentOption id="cash" icon="🤝" label="Cash" sublabel="Pay at Hotel Front Desk" />
                </div>
                <div className="bg-stone-50 rounded-[2.5rem] p-8 border border-stone-200 min-h-[300px] flex flex-col justify-center shadow-inner">
                  {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-xs font-bold">{error}</div>}
                  <div className="text-center">
                    <p className="text-slate-500 text-sm mb-8 font-medium">
                      {paymentMethod === 'paypal' 
                        ? 'We will open PayPal for a secure international payment.' 
                        : 'Confirm your reservation now and pay during check-in at the hotel.'}
                    </p>
                    <button onClick={handlePaymentConfirm} disabled={isProcessing} className="w-full max-w-xs mx-auto bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl disabled:opacity-50">
                      {isProcessing ? 'Verifying...' : paymentMethod === 'paypal' ? 'Pay Offering & Reserve' : 'Confirm Reservation'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-stone-50 rounded-[3rem] p-10 border border-stone-200 flex flex-col shadow-inner">
                <h4 className="text-2xl font-serif font-bold text-slate-900 mb-8 border-b pb-4">Stay Summary</h4>
                <div className="space-y-6 flex-1">
                   <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Rooms</p>
                    <p className="text-slate-900 font-bold text-lg">{selectedRooms.length} x {room.name}</p>
                    <p className="text-amber-700 font-black text-xs">{selectedFloor} • Rooms: {selectedRooms.join(', ')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-stone-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Check In</p>
                      <p className="text-slate-800 font-bold text-xs">{checkIn}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-stone-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Check Out</p>
                      <p className="text-slate-800 font-bold text-xs">{checkOut}</p>
                    </div>
                  </div>
                  <div className="pt-8 border-t-2 border-dashed flex justify-between items-end">
                    <span className="text-slate-900 font-black uppercase text-[11px] tracking-widest pb-1">Total Offering</span>
                    <span className="text-5xl font-serif font-black text-amber-700">₹{totalPrice}</span>
                  </div>
                </div>
                <button onClick={() => setStep('details')} className="mt-8 text-slate-400 hover:text-amber-700 text-[11px] font-black uppercase tracking-[0.4em]">← Edit Registration</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 h-full flex-1">
            <div className="md:col-span-2 relative hidden md:block">
              <img src={room.image} className="absolute inset-0 w-full h-full object-cover" alt={room.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-10 flex flex-col justify-end">
                <h3 className="text-4xl font-serif font-bold text-white mb-2">{room.name}</h3>
                <p className="text-amber-200 font-bold uppercase tracking-widest text-xs">₹{room.price} / Night</p>
              </div>
            </div>

            <div className="md:col-span-3 p-8 md:p-12 overflow-y-auto bg-stone-50/30">
              <div className="mb-10">
                <span className="text-amber-700 font-bold tracking-[0.3em] text-[10px] uppercase mb-1 block">Step 1: Registration</span>
                <h3 className="text-4xl font-serif font-bold text-slate-900">Pilgrim Details</h3>
              </div>

              {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold animate-pulse">⚠️ {error}</div>}

              <form onSubmit={handleDetailsSubmit} className="space-y-8">
                <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input type="text" required placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50" />
                    <input type="tel" required placeholder="Mobile Number" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} className="w-full px-5 py-4 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50" />
                  </div>
                  <textarea required placeholder="Home Address" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Arrival</label>
                    <input type="date" required min={new Date().toISOString().split('T')[0]} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-stone-200 bg-white font-bold text-slate-700 shadow-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Departure</label>
                    <input type="date" required min={checkIn || new Date().toISOString().split('T')[0]} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-stone-200 bg-white font-bold text-slate-700 shadow-sm" />
                  </div>
                </div>

                <div className="p-8 bg-amber-50/40 rounded-[2.5rem] border border-amber-100 space-y-6 shadow-inner">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-wider text-amber-700">Floor & Room Selection</label>
                    <div className="flex items-center space-x-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Rooms:</label>
                      <input type="number" min="1" max="8" value={roomsCount} onChange={(e) => { setRoomsCount(Math.max(1, parseInt(e.target.value) || 1)); setSelectedRooms([]); }} className="w-16 px-2 py-1.5 rounded-lg border border-stone-200 text-center font-bold" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Object.keys(FLOOR_ROOMS).map(f => (
                      <button 
                        key={f}
                        type="button"
                        onClick={() => { setSelectedFloor(f); setSelectedRooms([]); }}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${selectedFloor === f ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-stone-200 hover:border-amber-300'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {FLOOR_ROOMS[selectedFloor].map(roomNum => (
                      <button
                        key={roomNum}
                        type="button"
                        onClick={() => handleRoomToggle(roomNum)}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-2 group ${
                          selectedRooms.includes(roomNum) 
                            ? 'border-amber-600 bg-amber-600 text-white shadow-xl' 
                            : 'border-white bg-white text-slate-400 hover:border-amber-200 shadow-sm'
                        }`}
                      >
                        <span className="text-2xl">🏨</span>
                        <span className="font-black tracking-widest uppercase text-xs">Room {roomNum}</span>
                        <span className={`text-[10px] font-bold uppercase ${selectedRooms.includes(roomNum) ? 'text-amber-100' : 'text-slate-300'}`}>
                          {selectedRooms.includes(roomNum) ? 'Selected' : 'Available'}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest italic">
                    Note: Selection is for floor preference. Final allocation is confirmed by management.
                  </p>
                </div>

                <button type="submit" className="w-full py-6 bg-amber-600 text-white rounded-[2rem] font-black text-xl hover:bg-amber-700 transition-all shadow-2xl shadow-amber-600/20 uppercase tracking-widest mt-4">
                  Proceed to Payment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
