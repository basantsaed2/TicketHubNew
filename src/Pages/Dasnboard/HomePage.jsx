import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, Car, Globe, Map as MapIcon, X, Navigation, Plus, Minus, ArrowLeftRight, ChevronDown, CheckSquare, Compass, ShieldCheck, Star, ChevronLeft, ChevronRight, BusFront, TrainFront, Ship, CarFront, Ticket, Users as UsersIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Select from 'react-select';

const backgroundImage = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80";
import { usePost } from '../../Hooks/usePostJson';
import { useGet } from '../../Hooks/useGet';
import { useAuth } from '../../Context/Auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button';
import { BookingSearchForm, MapModal } from '../../Components/Component';

const MiniVanSvg = () => (
  <svg width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-[0_12px_12px_rgba(249,115,22,0.3)]">
    <defs>
      <linearGradient id="bodyGrad1" x1="10" y1="20" x2="55" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316"/>
        <stop offset="1" stopColor="#C2410C"/>
      </linearGradient>
    </defs>
    <path d="M12 28C12 24 15 20 19 20H45C50 20 54 24 55 29L58 40V48C58 50 56 52 54 52H14C11.8 52 10 50.2 10 48V30C10 28.9 10.9 28 12 28Z" fill="url(#bodyGrad1)"/>
    <path d="M16 26C16 24.9 16.9 24 18 24H32V34H16V26Z" fill="#1E293B" opacity="0.9"/>
    <path d="M34 24H44.5C45.6 24 46.5 24.9 46.8 26L48 34H34V24Z" fill="#1E293B" opacity="0.9"/>
    <circle cx="20" cy="52" r="7" fill="#0F172A"/>
    <circle cx="20" cy="52" r="3" fill="#cbd5e1"/>
    <circle cx="48" cy="52" r="7" fill="#0F172A"/>
    <circle cx="48" cy="52" r="3" fill="#cbd5e1"/>
    <rect x="54" y="42" width="6" height="4" rx="2" fill="#FEF08A"/>
    <rect x="6" y="42" width="6" height="4" rx="2" fill="#EF4444"/>
    <rect x="24" y="38" width="16" height="2" fill="#ea580c"/>
  </svg>
);

const CarSvg = () => (
  <svg width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-[0_12px_12px_rgba(249,115,22,0.3)]">
    <defs>
      <linearGradient id="bodyGrad2" x1="10" y1="22" x2="56" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316"/>
        <stop offset="1" stopColor="#C2410C"/>
      </linearGradient>
    </defs>
    <path d="M16 28C16 24 20 22 24 22H40C44 22 47 25 49 29L54 38C55.7 40 56 42 56 44V48C56 50.2 54.2 52 52 52H12C9.8 52 8 50.2 8 48V42C8 39 10 38 12 36L16 28Z" fill="url(#bodyGrad2)"/>
    <path d="M22 26C22 24.9 22.9 24 24 24H38C39.1 24 40 24.9 40 26V32H22V26Z" fill="#1E293B" opacity="0.9"/>
    <circle cx="20" cy="52" r="7" fill="#0F172A"/>
    <circle cx="20" cy="52" r="3" fill="#cbd5e1"/>
    <circle cx="44" cy="52" r="7" fill="#0F172A"/>
    <circle cx="44" cy="52" r="3" fill="#cbd5e1"/>
    <rect x="52" y="40" width="6" height="4" rx="2" fill="#FEF08A"/>
    <rect x="6" y="42" width="6" height="4" rx="2" fill="#EF4444"/>
  </svg>
);

const TrainSvg = () => (
  <svg width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-[0_12px_12px_rgba(249,115,22,0.3)]">
    <defs>
      <linearGradient id="bodyGrad3" x1="14" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316"/>
        <stop offset="1" stopColor="#C2410C"/>
      </linearGradient>
    </defs>
    <rect x="14" y="12" width="36" height="40" rx="8" fill="url(#bodyGrad3)"/>
    <path d="M14 26H50V52H14V26Z" fill="#C2410C" opacity="0.4"/>
    <rect x="20" y="18" width="24" height="14" rx="4" fill="#0F172A"/>
    <rect x="10" y="46" width="44" height="6" rx="3" fill="#F59E0B"/>
    <circle cx="24" cy="56" r="5" fill="#0F172A"/>
    <circle cx="24" cy="56" r="2" fill="#cbd5e1"/>
    <circle cx="40" cy="56" r="5" fill="#0F172A"/>
    <circle cx="40" cy="56" r="2" fill="#cbd5e1"/>
    <rect x="28" y="6" width="8" height="6" rx="2" fill="#4B5563"/>
    <path d="M32 0C32 -1 35 -3 38 -3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" border="dashed" />
  </svg>
);

const BusSvg = () => (
  <svg width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-[0_12px_12px_rgba(249,115,22,0.3)]">
    <defs>
      <linearGradient id="bodyGrad4" x1="10" y1="16" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316"/>
        <stop offset="1" stopColor="#C2410C"/>
      </linearGradient>
    </defs>
    <rect x="10" y="16" width="44" height="36" rx="8" fill="url(#bodyGrad4)"/>
    <rect x="14" y="22" width="36" height="14" rx="4" fill="#0F172A"/>
    <rect x="14" y="42" width="36" height="4" rx="2" fill="#FDBA74" fillOpacity="0.4"/>
    <circle cx="22" cy="54" r="6" fill="#0F172A"/>
    <circle cx="22" cy="54" r="2.5" fill="#cbd5e1"/>
    <circle cx="42" cy="54" r="6" fill="#0F172A"/>
    <circle cx="42" cy="54" r="2.5" fill="#cbd5e1"/>
    <rect x="48" y="44" width="6" height="4" rx="2" fill="#FEF08A"/>
    <rect x="10" y="44" width="5" height="4" rx="2" fill="#EF4444"/>
  </svg>
);

const TravelBooking = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dateInputRef = useRef(null);
  const roundDateInputRef = useRef(null);
  const travelerMenuRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // --- API & DATA ---
  const { refetch: refetchBookingList, data: bookingListData } = useGet({ url: `https://bcknd.ticket-hub.net/user/booking/lists` });
  const { postData: postGeneral, loadingPost, response } = usePost({ url: `${apiUrl}/user/booking` });
  const { postData: postPrivate, loadingPost: loadingPrivate, response: responsePrivate } = usePost({ url: `${apiUrl}/user/booking/private_request` });

  // --- STATE ---
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cars, setCars] = useState([]);
  const [filterMode, setFilterMode] = useState("general");
  const [activeTab, setActiveTab] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);

  // Travelers State
  const [passengerCounts, setPassengerCounts] = useState({
    adult: 2,
    child: 0,
  });
  const totalTravelers = passengerCounts.adult + passengerCounts.child;

  // Form Fields
  const [selectedFromCity, setSelectedFromCity] = useState(null);
  const [selectedToCity, setSelectedToCity] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  
  const today = new Date().toISOString().split("T")[0];
  const [travelDate, setTravelDate] = useState(today);
  const [roundDate, setRoundDate] = useState("");
  
  const [showTravelerMenu, setShowTravelerMenu] = useState(false);
  const [addressFrom, setAddressFrom] = useState("");
  const [addressTo, setAddressTo] = useState("");
  
  const [mapLocationFrom, setMapLocationFrom] = useState([26.8206, 30.8025]);
  const [mapLocationTo, setMapLocationTo] = useState([26.8206, 30.8025]);
  const [showMapFrom, setShowMapFrom] = useState(false);
  const [showMapTo, setShowMapTo] = useState(false);

  // Minimum date for return is travelDate + 1
  const minRoundDate = travelDate 
    ? new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + 1)).toISOString().split("T")[0] 
    : today;

  useEffect(() => { refetchBookingList(); }, []);

  useEffect(() => {
    if (bookingListData) {
      setCities(bookingListData.cities?.map(c => {
        const country = bookingListData.countries?.find(cntry => cntry.id === c.country_id);
        return { 
          value: String(c.id), 
          label: country ? `${c.name}, ${country.name}` : c.name 
        };
      }) || []);
      setCountries(bookingListData.countries?.map(c => ({ value: String(c.id), label: c.name })) || []);
      setCars(bookingListData.car_category?.map(c => ({ value: String(c.id), label: c.name })) || []);
    }
  }, [bookingListData]);

  // LOGIC: Navigation on General Booking Response
  useEffect(() => {
    if (response && !loadingPost) {
      navigate('/trips', {
        state: {
          trips: response.data,
          service: activeTab,
          searchData: {
            from: selectedFromCity?.value,
            to: selectedToCity?.value,
            date: travelDate,
            roundDate: roundDate,
            travelers: totalTravelers,
            tripType: roundDate ? "round_trip" : "one_way"
          }
        }
      });
    }
  }, [response, loadingPost]);

  // LOGIC: Show Success Modal on Private Response
  useEffect(() => {
    if (responsePrivate && !loadingPrivate) {
      setModalVisible(true);
    }
  }, [responsePrivate, loadingPrivate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (travelerMenuRef.current && !travelerMenuRef.current.contains(event.target)) {
        setShowTravelerMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateCount = (type, operation) => {
    setPassengerCounts(prev => ({
      ...prev,
      [type]: operation === 'inc' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const handleSwitchCities = () => {
    const temp = selectedFromCity;
    setSelectedFromCity(selectedToCity);
    setSelectedToCity(temp);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFromCity) { auth.toastError("Please Select Departure From"); return; }
    if (!selectedToCity) { auth.toastError("Please Select Arrival To"); return; }

    const formData = {
      date: travelDate,
      traveler: totalTravelers,
    };

    if (filterMode === "general") {
      formData.type = roundDate ? "round_trip" : "one_way";
      if (roundDate) formData.round_date = roundDate;
      formData.from = selectedFromCity.value;
      formData.to = selectedToCity.value;
      postGeneral(formData);
    } 
    else if (filterMode === "private") {
      if (!auth.user) {
        auth.toastError('You must be logged in to continue.');
        navigate('/auth/login', { replace: true });
        return;
      }
      formData.country_id = selectedCountry?.value;
      formData.city_id = selectedToCity.value;
      formData.from_city_id = selectedFromCity.value;
      formData.address = addressTo;
      formData.from_address = addressFrom;
      formData.category_id = selectedCar?.value;
      // Map Logic from second page
      formData.map = `https://www.google.com/maps?q=${mapLocationTo[0].toFixed(4)},${mapLocationTo[1].toFixed(4)}`;
      formData.from_map = `https://www.google.com/maps?q=${mapLocationFrom[0].toFixed(4)},${mapLocationFrom[1].toFixed(4)}`;
      
      postPrivate(formData);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFDFD]">
      {/* SUCCESS MODAL FOR PRIVATE REQUEST */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="rotate-45" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Request Sent!</h3>
            <p className="text-slate-500 mb-6 font-medium">Your private request has been received. We will contact you soon.</p>
            <Button onClick={() => setModalVisible(false)} className="w-full bg-slate-900 rounded-full h-12 font-bold">Close</Button>
          </div>
        </div>
      )}

      {/* ULTRA PREMIUM HERO WRAPPER WITH CENTERED FORM */}
      <div className="relative min-h-[600px] md:min-h-[750px] lg:min-h-[850px] flex flex-col items-center justify-center overflow-hidden w-full pb-10">
        <img src={backgroundImage} alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
        
        {/* Premium Bookaway Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-black/40 to-black/70 pointer-events-none" />
        
        {/* Hero Text */}
        <div className="relative z-10 text-center px-4 w-full max-w-5xl mt-24 mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-2xl">
            Ready to explore?
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-white/95 drop-shadow-lg tracking-wide">
            Book your next journey instantly
          </p>
        </div>

        {/* Search Form Pulled Inside */}
        <div className="relative z-30 w-full px-4 lg:px-8 xl:px-12 max-w-7xl mx-auto">
          <BookingSearchForm
            cities={cities}
            countries={countries}
            cars={cars}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedFromCity={selectedFromCity}
            setSelectedFromCity={setSelectedFromCity}
            selectedToCity={selectedToCity}
            setSelectedToCity={setSelectedToCity}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedCar={selectedCar}
            setSelectedCar={setSelectedCar}
            travelDate={travelDate}
            setTravelDate={setTravelDate}
            roundDate={roundDate}
            setRoundDate={setRoundDate}
            passengerCounts={passengerCounts}
            setPassengerCounts={setPassengerCounts}
            addressFrom={addressFrom}
            setAddressFrom={setAddressFrom}
            addressTo={addressTo}
            setAddressTo={setAddressTo}
            showTravelerMenu={showTravelerMenu}
            setShowTravelerMenu={setShowTravelerMenu}
            loadingPost={loadingPost}
            loadingPrivate={loadingPrivate}
            onSearch={handleSubmit}
            onMapFromOpen={() => setShowMapFrom(true)}
            onMapToOpen={() => setShowMapTo(true)}
            onSwitchCities={handleSwitchCities}
          />
        </div>
      </div>

      {/* NEW SECTION 1: Features */}
      <section className="max-w-7xl mx-auto px-4 py-20 mt-10 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Feature 1 */}
          <div className="flex flex-col items-center group">
            <div className="relative w-20 h-20 flex items-center justify-center mb-6">
               <div className="absolute inset-0 bg-slate-100 rounded-bl-[2rem] rounded-tr-[2rem] rounded-tl-lg rounded-br-lg rotate-12 group-hover:rotate-[35deg] transition-transform duration-500"></div>
               <div className="absolute inset-0 rounded-bl-lg rounded-tr-lg rounded-tl-[2rem] rounded-br-[2rem] border-2 border-slate-300 -rotate-12 group-hover:rotate-0 transition-transform duration-500"></div>
               <Ticket size={36} strokeWidth={2} className="relative z-10 text-slate-800" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">One-tap booking</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs">Compare and book your next ticket anywhere in the world, and find it in your inbox. Simple.</p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center group">
            <div className="relative w-20 h-20 flex items-center justify-center mb-6">
               <div className="absolute inset-0 bg-orange-100 rounded-bl-[2rem] rounded-tr-[2rem] rounded-tl-lg rounded-br-lg rotate-12 group-hover:rotate-[35deg] transition-transform duration-500"></div>
               <div className="absolute inset-0 rounded-bl-lg rounded-tr-lg rounded-tl-[2rem] rounded-br-[2rem] border-2 border-orange-200 -rotate-12 group-hover:rotate-0 transition-transform duration-500"></div>
               <Compass size={36} strokeWidth={2} className="relative z-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Your trip, your way</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs">From buses to planes or early starts to late nights, you have the final say.</p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center group">
            <div className="relative w-20 h-20 flex items-center justify-center mb-6">
               <div className="absolute inset-0 bg-slate-800 rounded-bl-[2rem] rounded-tr-[2rem] rounded-tl-lg rounded-br-lg rotate-12 group-hover:rotate-[35deg] transition-transform duration-500 shadow-xl shadow-slate-900/10"></div>
               <div className="absolute inset-0 rounded-bl-lg rounded-tr-lg rounded-tl-[2rem] rounded-br-[2rem] border-2 border-slate-700 -rotate-12 group-hover:rotate-0 transition-transform duration-500"></div>
               <ShieldCheck size={36} strokeWidth={2} className="relative z-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Expert-led travel</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs">Bookaway has your back wherever, whenever. With thousands of happy users and 24-hour support.</p>
          </div>
        </div>
      </section>

      {/* NEW SECTION 3: Transportation Types */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
        <h2 className="text-3xl font-black text-slate-800 mb-14">Transportation we offer</h2>
        
        <div className="flex overflow-x-auto no-scrollbar gap-14 md:gap-16 pb-8 pt-4 justify-start lg:justify-center items-end px-4">
          
          {/* Mini Van */}
          <div className="flex flex-col items-center group cursor-pointer">
             <div className="w-36 h-36 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group-hover:-translate-y-3 transition-transform duration-500 border border-slate-200 group-hover:border-orange-500 group-hover:shadow-orange-500/30">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-200 rounded-full blur-[40px] opacity-70 group-hover:bg-orange-400 group-hover:opacity-100 transition-colors duration-500" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-200 rounded-full blur-[40px] opacity-40 group-hover:bg-yellow-400 group-hover:opacity-100 transition-colors duration-500" />
                <MiniVanSvg />
             </div>
             <span className="font-black text-slate-500 group-hover:text-orange-500 uppercase tracking-widest text-[12px] md:text-sm transition-colors block">Mini Van</span>
          </div>

          {/* Car */}
          <div className="flex flex-col items-center group cursor-pointer">
             <div className="w-36 h-36 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group-hover:-translate-y-3 transition-transform duration-500 border border-slate-200 group-hover:border-orange-500 group-hover:shadow-orange-500/30">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-200 rounded-full blur-[40px] opacity-70 group-hover:bg-orange-400 group-hover:opacity-100 transition-colors duration-500" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-200 rounded-full blur-[40px] opacity-40 group-hover:bg-yellow-400 group-hover:opacity-100 transition-colors duration-500" />
                <CarSvg />
             </div>
             <span className="font-black text-slate-500 group-hover:text-orange-500 uppercase tracking-widest text-[12px] md:text-sm transition-colors block text-center leading-tight">Car</span>
          </div>

          {/* Train */}
          <div className="flex flex-col items-center group cursor-pointer">
             <div className="w-36 h-36 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group-hover:-translate-y-3 transition-transform duration-500 border border-slate-200 group-hover:border-orange-500 group-hover:shadow-orange-500/30">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-200 rounded-full blur-[40px] opacity-70 group-hover:bg-orange-400 group-hover:opacity-100 transition-colors duration-500" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-200 rounded-full blur-[40px] opacity-40 group-hover:bg-yellow-400 group-hover:opacity-100 transition-colors duration-500" />
                <TrainSvg />
             </div>
             <span className="font-black text-slate-500 group-hover:text-orange-500 uppercase tracking-widest text-[12px] md:text-sm transition-colors block">Train</span>
          </div>

          {/* Bus */}
          <div className="flex flex-col items-center group cursor-pointer">
             <div className="w-36 h-36 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group-hover:-translate-y-3 transition-transform duration-500 border border-slate-200 group-hover:border-orange-500 group-hover:shadow-orange-500/30">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-200 rounded-full blur-[40px] opacity-70 group-hover:bg-orange-400 group-hover:opacity-100 transition-colors duration-500" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-200 rounded-full blur-[40px] opacity-40 group-hover:bg-yellow-400 group-hover:opacity-100 transition-colors duration-500" />
                <BusSvg />
             </div>
             <span className="font-black text-slate-500 group-hover:text-orange-500 uppercase tracking-widest text-[12px] md:text-sm transition-colors block">Bus</span>
          </div>

        </div>
      </section>

      <MapModal
        isOpen={showMapFrom || showMapTo}
        onClose={() => { setShowMapFrom(false); setShowMapTo(false); }}
        centerLocation={showMapFrom ? mapLocationFrom : mapLocationTo}
        markerLocation={showMapFrom ? mapLocationFrom : mapLocationTo}
        onLocationSelect={(e) => {
          const loc = [e.latlng.lat, e.latlng.lng];
          showMapFrom ? setMapLocationFrom(loc) : setMapLocationTo(loc);
        }}
      />
    </div>
  );
};

export default TravelBooking;