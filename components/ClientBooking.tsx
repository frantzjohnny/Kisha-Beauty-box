
import React, { useState, useEffect, useMemo } from 'react';
import { StorageService } from '../services/storage';
import { Service, BookingState, ShopSettings } from '../types';
import { Button } from './ui/Button';
import { Clock, CheckCircle, Sparkles, ArrowRight, ArrowLeft, MessageCircle, CreditCard, DollarSign, Banknote } from 'lucide-react';

// --- HERO SLIDESHOW COMPONENT ---
const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=1000", // Nail Art / Pink
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1000", // Makeup/Salon vibe
    "https://images.unsplash.com/photo-1519017715179-c6f2f6ee73f4?auto=format&fit=crop&q=80&w=1000"  // Pink aesthetic
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg mb-8 group">
      {/* Overlay Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
      
      {/* Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={img} 
            alt="Salon ambiance" 
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Hero Text Content */}
      <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
        <div className="flex items-center gap-2 mb-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                KISHA BEAUTY BOX
            </span>
        </div>
        <h1 className="text-3xl font-serif font-bold leading-tight drop-shadow-md opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          Enhance your beauty
        </h1>
        <p className="text-white/90 text-sm mt-1 max-w-xs opacity-0 animate-fade-in-up" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          Elegance starts with perfect details.
        </p>
      </div>
      
      {/* Dots Indicators */}
      <div className="absolute bottom-4 right-6 z-20 flex gap-2">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`} 
          />
        ))}
      </div>
    </div>
  );
};

export const ClientBooking: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(StorageService.getSettings());
  
  const [booking, setBooking] = useState<BookingState>({
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    customerName: '',
    paymentMethod: null
  });

  useEffect(() => {
    setServices(StorageService.getServices());
    setSettings(StorageService.getSettings());
  }, []);

  // Group services by category
  const groupedServices = useMemo(() => {
    const groups: { [key: string]: Service[] } = {};
    services.forEach(service => {
      const cat = service.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(service);
    });
    // Order categories if needed
    return groups;
  }, [services]);

  // Generate next 14 days for calendar
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  // Generate time slots based on duration
  const generateTimeSlots = (date: Date | null, duration: number) => {
    if (!date) return [];
    
    const slots: string[] = [];
    const [openH, openM] = settings.openingTime.split(':').map(Number);
    const [closeH, closeM] = settings.closingTime.split(':').map(Number);
    
    let currentMinutes = openH * 60 + openM;
    const endMinutes = closeH * 60 + closeM;
    
    // If today, start from next hour
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        const currentNowMinutes = now.getHours() * 60 + now.getMinutes();
        // Start at least 30 mins from now
        currentMinutes = Math.max(currentMinutes, currentNowMinutes + 30); 
        // Round up to nearest 15 min slot
        currentMinutes = Math.ceil(currentMinutes / 15) * 15;
    }

    while (currentMinutes + duration <= endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      slots.push(timeString);
      currentMinutes += 30; // Interval between slots (e.g., every 30 mins)
    }
    
    return slots;
  };

  const timeSlots = useMemo(() => {
    if (!booking.selectedDate || !booking.selectedService) return [];
    return generateTimeSlots(booking.selectedDate, booking.selectedService.durationMinutes);
  }, [booking.selectedDate, booking.selectedService, settings]);


  const handleWhatsAppRedirect = () => {
    if (!booking.selectedService || !booking.selectedDate || !booking.selectedTime) return;

    const dateStr = booking.selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    const message = `Hello, I would like to confirm my booking at ${settings.shopName}:
✨ *Service*: ${booking.selectedService.name}
📅 *Date*: ${dateStr}
🕒 *Time*: ${booking.selectedTime}
👤 *Name*: ${booking.customerName}
💰 *Price*: ${settings.currency}${booking.selectedService.price}
💳 *Payment*: ${booking.paymentMethod}

Please confirm my appointment.`;

    const url = `https://wa.me/${settings.phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(url, '_blank');

    // RESET APPLICATION STATE AFTER SENDING
    setTimeout(() => {
        setBooking({
            selectedService: null,
            selectedDate: null,
            selectedTime: null,
            customerName: '',
            paymentMethod: null
        });
        setStep(1);
        // Optional: scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500); // Wait 1.5s to allow the tab to open, then reset
  };

  const StepsIndicator = () => (
    <div className="flex justify-center items-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-brand-600' : s < step ? 'w-2 bg-brand-400' : 'w-2 bg-stone-200'}`} />
      ))}
    </div>
  );

  const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="mb-6 text-center animate-fade-in">
      <h2 className="text-2xl font-serif font-bold text-stone-800">{title}</h2>
      {subtitle && <p className="text-stone-500 mt-1">{subtitle}</p>}
    </div>
  );

  // --- STEP 1: SERVICE SELECTION ---
  if (step === 1) {
    return (
      <div className="pb-24">
        <HeroSlideshow />
        <StepsIndicator />
        <Header title="Pick Your Glow-Up Service" subtitle="Our experts will take care of you" />
        
        <div className="space-y-8">
          {Object.entries(groupedServices).map(([category, catServices]) => (
            <div key={category}>
              <h3 className="text-lg font-bold text-brand-800 mb-3 border-b border-brand-100 pb-1">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(catServices as Service[]).map(service => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setBooking({ ...booking, selectedService: service });
                      setStep(2);
                    }}
                    className="group relative bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-brand-200 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-stone-800 group-hover:text-brand-700 transition-colors">{service.name}</h3>
                      <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded-lg text-sm font-semibold">
                        {settings.currency}{service.price}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center text-xs text-stone-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.durationMinutes} min
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {services.length === 0 && (
          <div className="text-center p-8 text-stone-500">
            No services available at the moment.
          </div>
        )}
      </div>
    );
  }

  // --- STEP 2: DATE SELECTION ---
  if (step === 2) {
    return (
      <div className="pb-24">
        <StepsIndicator />
        <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4"/></Button>
            <span className="ml-auto text-sm font-semibold text-brand-600">{booking.selectedService?.name}</span>
        </div>
        <Header title="Select Date" />

        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {availableDates.map((date, idx) => {
             const isSelected = booking.selectedDate?.toDateString() === date.toDateString();
             const isToday = new Date().toDateString() === date.toDateString();
             
             return (
              <button
                key={idx}
                onClick={() => {
                    setBooking({ ...booking, selectedDate: date, selectedTime: null });
                }}
                className={`
                    flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                    ${isSelected 
                        ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200' 
                        : 'bg-white text-stone-600 border-stone-100 hover:border-brand-300'}
                `}
              >
                <span className="text-xs uppercase font-medium opacity-80">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                    {date.getDate()}
                </span>
                {isToday && <span className="text-[10px] mt-1">• Today •</span>}
              </button>
             );
          })}
        </div>

        {booking.selectedDate && (
            <div className="mt-8 animate-fade-in-up">
                 <Header title="Select Time" subtitle="Available slots" />
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.length > 0 ? timeSlots.map(time => (
                        <button
                            key={time}
                            onClick={() => {
                                setBooking({ ...booking, selectedTime: time });
                                setStep(3);
                            }}
                            className="py-2 px-4 rounded-lg border border-brand-100 bg-white text-brand-700 hover:bg-brand-50 font-medium text-sm transition-colors"
                        >
                            {time}
                        </button>
                    )) : (
                        <div className="col-span-full text-center text-stone-500 py-4 bg-stone-50 rounded-lg">
                            No slots available for this date.
                        </div>
                    )}
                 </div>
            </div>
        )}
      </div>
    );
  }

  // --- STEP 3: DETAILS & PAYMENT ---
  if (step === 3) {
    return (
        <div className="pb-24">
            <StepsIndicator />
            <div className="flex items-center mb-4">
                <Button variant="ghost" size="sm" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4"/></Button>
            </div>
            <Header title="Details & Payment" subtitle="Your Information" />

            <div className="space-y-6">
                {/* Personal Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Full Name</label>
                    <input 
                        type="text" 
                        autoFocus
                        placeholder="e.g. Sarah Smith"
                        value={booking.customerName}
                        onChange={(e) => setBooking({...booking, customerName: e.target.value})}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none transition-all"
                    />
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-brand-600" />
                        Payment Method
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { id: 'Cash', icon: Banknote, label: 'Cash' },
                            { id: 'Zelle', icon: DollarSign, label: 'Zelle' },
                            { id: 'CashApp', icon: DollarSign, label: 'CashApp' }
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setBooking({...booking, paymentMethod: method.id as any})}
                                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                                    ${booking.paymentMethod === method.id 
                                        ? 'border-brand-500 bg-brand-50 text-brand-700' 
                                        : 'border-stone-100 hover:border-brand-200 text-stone-600'}
                                `}
                            >
                                <method.icon className="w-4 h-4" />
                                <span className="font-medium">{method.label}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-stone-400 mt-3 text-center">
                        Payment will be handled at the shop or via your selected app.
                    </p>
                </div>

                {/* Recap Mini */}
                <div className="bg-brand-50 p-4 rounded-xl flex gap-4 items-center opacity-80">
                    <div className="bg-white p-2 rounded-full shadow-sm text-brand-600">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-stone-800">{booking.selectedService?.name}</p>
                        <p className="text-sm text-brand-700">
                            {booking.selectedDate?.toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'})} at {booking.selectedTime}
                        </p>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 left-0 right-0 px-4 md:static md:mt-8">
                <Button 
                    fullWidth 
                    size="lg" 
                    onClick={() => setStep(4)}
                    disabled={!booking.customerName.trim() || !booking.paymentMethod}
                    className="shadow-xl md:shadow-none"
                >
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
  }

  // --- STEP 4: SUMMARY ---
  if (step === 4) {
    return (
        <div className="pb-24">
            <StepsIndicator />
            <div className="flex items-center mb-4">
                <Button variant="ghost" size="sm" onClick={() => setStep(3)}><ArrowLeft className="w-4 h-4"/></Button>
            </div>
            
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-800">Almost there!</h2>
                <p className="text-stone-500">Review your booking before sending.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden">
                <div className="p-6 space-y-4">
                    <div className="flex justify-between border-b border-stone-100 pb-4">
                        <span className="text-stone-500">Service</span>
                        <span className="font-semibold text-stone-800 text-right">{booking.selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-100 pb-4">
                        <span className="text-stone-500">Date</span>
                        <span className="font-semibold text-stone-800 capitalize">
                            {booking.selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}
                        </span>
                    </div>
                    <div className="flex justify-between border-b border-stone-100 pb-4">
                        <span className="text-stone-500">Time</span>
                        <span className="font-semibold text-stone-800">{booking.selectedTime}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-100 pb-4">
                        <span className="text-stone-500">Payment</span>
                        <span className="font-semibold text-brand-600">{booking.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold text-stone-800">Total</span>
                        <span className="text-2xl font-bold text-brand-600">
                            {settings.currency}{booking.selectedService?.price}
                        </span>
                    </div>
                </div>
                <div className="bg-stone-50 p-4 text-center text-xs text-stone-400">
                    Clicking below will open WhatsApp with a pre-filled message.
                </div>
            </div>

            <div className="fixed bottom-6 left-0 right-0 px-4 md:static md:mt-8">
                <Button 
                    fullWidth 
                    size="lg" 
                    onClick={handleWhatsAppRedirect}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-green-200 md:shadow-none"
                >
                    <MessageCircle className="w-5 h-5 mr-2" /> Send on WhatsApp
                </Button>
            </div>
        </div>
    );
  }

  return null;
};
