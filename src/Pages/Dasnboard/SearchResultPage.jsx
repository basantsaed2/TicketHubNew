// import React, { useState, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom"; // or next/navigation
// import { FaBus, FaTrain, FaCar, FaStar, FaArrowRight } from "react-icons/fa";
// import { useAuth } from "../../Context/Auth";
// import ErrorImg from "../../Assets/Images/Error.png";

// // Helpers
// const toMinutes = (t = "00:00:00") => {
//   const [h, m] = t.split(":").map(Number);
//   return h * 60 + m;
// };
// const hhmm = (mins) => {
//   const h = String(Math.floor(mins / 60)).padStart(2, "0");
//   const m = String(mins % 60).padStart(2, "0");
//   return `${h}:${m}`;
// };
// const diffText = (s, e) => {
//   const d = toMinutes(e) - toMinutes(s);
//   const pd = d >= 0 ? d : d + 24 * 60;
//   const h = Math.floor(pd / 60), m = pd % 60;
//   return `${h} hr${h!==1?"s":""} ${m} min${m!==1?"s":""}`;
// };
// const getIcon = (type) => {
//   switch(type) {
//     case "bus": return <FaBus className="text-white text-2xl"/>;
//     case "train": return <FaTrain className="text-white text-2xl"/>;
//     case "hiace": return <FaCar className="text-white text-2xl"/>;
//     default: return null;
//   }
// };
// // helpers
// const to12Hour = (timeStr = "") => {
//   const [hStr, mStr] = timeStr.split(":");
//   let h = parseInt(hStr, 10);
//   if (h === 0) h = 12;
//   else if (h > 12) h = h - 12;
//   return `${h}:${mStr}`;
// };

// export default function SearchResultPage() {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const auth = useAuth();
//   const trips = state?.trips?.all_trips || [];
//   const searchData= state?.searchData || [];
//   console.log("searchData",searchData)

//   // derive slider bounds
//   const deps = trips.map(t => toMinutes(t.deputre_time));
//   const arrs = trips.map(t => toMinutes(t.arrival_time));
//   const ps   = trips.map(t => t.price);
//   const depMin = Math.min(...deps, 0), depMax = Math.max(...deps, 1440);
//   const arrMin = Math.min(...arrs, 0), arrMax = Math.max(...arrs, 1440);
//   const priceMin = Math.min(...ps, 0), priceMax = Math.max(...ps, 0);

//   // filter/sort state
//   const [sortBy, setSortBy] = useState("recommended");
//   const [types, setTypes] = useState(["all"]);
//   const [services, setServices] = useState([]);
//   const [amenities, setAmenities] = useState([]);
//   const [depRange, setDepRange] = useState([depMin, depMax]);
//   const [arrRange, setArrRange] = useState([arrMin, arrMax]);
//   const [priceRange, setPriceRange] = useState([priceMin, priceMax]);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const toggle = (arr, set, v) =>
//     arr.includes(v) ? set(arr.filter(x=>x!==v)) : set([...arr, v]);

//   // filtered + sorted
//   const filtered = useMemo(() => {
//     return trips
//       .filter(t => {
//         if (!types.includes("all") && !types.includes(t.trip_type)) return false;
//         const d = toMinutes(t.deputre_time);
//         if (d < depRange[0] || d > depRange[1]) return false;
//         const a = toMinutes(t.arrival_time);
//         if (a < arrRange[0] || a > arrRange[1]) return false;
//         if (t.price < priceRange[0] || t.price > priceRange[1]) return false;
//         // TODO: services/amenities
//         return true;
//       })
//       .sort((a,b) => {
//         if (sortBy==="price_asc") return a.price - b.price;
//         if (sortBy==="price_desc") return b.price - a.price;
//         if (sortBy==="duration_asc")
//           return (toMinutes(a.arrival_time)-toMinutes(a.deputre_time))
//                - (toMinutes(b.arrival_time)-toMinutes(b.deputre_time));
//         return 0;
//       });
//   }, [trips, types, depRange, arrRange, priceRange, sortBy]);

//   // --- Sidebar JSX (desktop + mobile) ---
//   const Sidebar = () => {
//     const transports = [
//       {label:"All",value:"all"},
//       {label:"Hiace",value:"hiace"},
//       {label:"Private",value:"private"},
//       {label:"Trains",value:"train"},
//       {label:"Bus",value:"bus"},
//     ];
//     const servicesOpts = [
//       {label:"Instant Confirmation",value:"instant_confirmation"},
//     ];
//     const amenityOpts = [
//       {label:"A/C",value:"ac"},
//       {label:"WC",value:"wc"},
//       {label:"Food & Drinks",value:"food_drinks"},
//       {label:"USB Charger",value:"usb_charger"},
//       {label:"TV",value:"tv"},
//       {label:"Wheelchair Accessibility",value:"wheelchair"},
//     ];

//     return (
//       <div className="w-72 bg-white p-6 rounded-lg shadow">
//         {/* title */}
//         <h2 className="font-semibold text-lg mb-4">Filters</h2>

//         {/* Sort */}
//         <div className="mb-6">
//           <label className="block text-gray-600 mb-1 text-sm">Sort by</label>
//           <select
//             className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             value={sortBy}
//             onChange={e=>setSortBy(e.target.value)}
//           >
//             <option value="recommended">Recommended</option>
//             <option value="price_asc">Price: Low → High</option>
//             <option value="price_desc">Price: High → Low</option>
//             <option value="duration_asc">Duration: Short → Long</option>
//           </select>
//         </div>

//         {/* Departure */}
//         <div className="mb-6">
//           <p className="text-gray-600 mb-1 text-sm">Departure Time</p>
//           <div className="flex justify-between text-xs text-gray-500 mb-1">
//             <span>{hhmm(depRange[0])}</span>
//             <span>{hhmm(depRange[1])}</span>
//           </div>
//           <input
//             type="range"
//             min={depMin}
//             max={depMax}
//             value={depRange[0]}
//             onChange={e=>setDepRange([+e.target.value,depRange[1]])}
//             className="w-full h-1 rounded-lg accent-secoundColor"
//           />
//           <input
//             type="range"
//             min={depMin}
//             max={depMax}
//             value={depRange[1]}
//             onChange={e=>setDepRange([depRange[0],+e.target.value])}
//             className="w-full h-1 rounded-lg accent-secoundColor mt-1"
//           />
//         </div>

//         {/* Arrival */}
//         <div className="mb-6">
//           <p className="text-gray-600 mb-1 text-sm">Arrival Time</p>
//           <div className="flex justify-between text-xs text-gray-500 mb-1">
//             <span>{hhmm(arrRange[0])}</span>
//             <span>{hhmm(arrRange[1])}</span>
//           </div>
//           <input
//             type="range"
//             min={arrMin}
//             max={arrMax}
//             value={arrRange[0]}
//             onChange={e=>setArrRange([+e.target.value,arrRange[1]])}
//             className="w-full h-1 rounded-lg accent-secoundColor"
//           />
//           <input
//             type="range"
//             min={arrMin}
//             max={arrMax}
//             value={arrRange[1]}
//             onChange={e=>setArrRange([arrRange[0],+e.target.value])}
//             className="w-full h-1 rounded-lg accent-secoundColor mt-1"
//           />
//         </div>

//         {/* Price */}
//         <div>
//           <p className="text-gray-600 mb-1 text-sm">Price</p>
//           <div className="flex justify-between text-xs text-gray-500 mb-1">
//             <span>US${priceRange[0]}</span>
//             <span>US${priceRange[1]}</span>
//           </div>
//           <input
//             type="range"
//             min={priceMin}
//             max={priceMax}
//             value={priceRange[0]}
//             onChange={e=>setPriceRange([+e.target.value,priceRange[1]])}
//             className="w-full h-1 rounded-lg accent-secoundColor"
//           />
//           <input
//             type="range"
//             min={priceMin}
//             max={priceMax}
//             value={priceRange[1]}
//             onChange={e=>setPriceRange([priceRange[0],+e.target.value])}
//             className="w-full h-1 rounded-lg accent-secoundColor mt-1"
//           />
//         </div>
//       </div>
//     );
//   };

//   // --- Trip Card ---
//   const TripCard = ({ trip }) => {
//     const img = trip.bus?.image_link || "https://via.placeholder.com/150x100";
//     const rating = trip.rating ?? 4.8;
//     const reviews = trip.reviewsCount ?? 86;

//     return (
//       <div className="flex flex-col lg:flex-row bg-[#E8E8EA] md:h-[160px] h-[500px] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
//         {/* image/icon */}
//         <div className="relative w-full md:w-48 md:h-auto h-48  p-4">
//           {trip.bus ? (
//             <img src={img} className="w-full h-full object-fill rounded" />
//           ) : (
//             <div className="w-full h-full bg-mainColor flex items-center justify-center rounded">
//               {getIcon(trip.trip_type)}
//             </div>
//           )}
//         </div>

//         {/* details */}
//         <div className="flex-1 p-4">
//           <div className="flex items-center gap-5 mb-2">
//             <h3 className="text-lg font-semibold">{trip.trip_name} ({trip.trip_type})</h3>
//             <div className="flex items-center text-yellow-400 text-sm">
//               <FaStar className="mr-1" /> {rating} <span className="text-gray-500 ml-1">({reviews})</span>
//             </div>
//           </div>
        
//           <div className="text-black text-md mb-2" dir="ltr">
//             <span className="font-medium" dir="ltr">
//               Route : {trip.pickup_station?.name || "Unknown Pickup"} ({trip.city?.name})
//             </span>
//             <span className="mx-1 text-gray-400">→</span>
//             <span className="font-medium" dir="ltr">
//               {trip.dropoff_station?.name || "Unknown Dropoff"} ({trip.to_city?.name})
//             </span>
//           </div>
//           <div className="text-black text-sm mb-2">
//               Time : {to12Hour(trip.deputre_time)} → {to12Hour(trip.arrival_time)} (
//                 {diffText(trip.deputre_time, trip.arrival_time)}
//               )
//             </div>

//           <div className="flex flex-wrap gap-2">
//             {trip.bus?.aminity?.map(am => (
//               <span
//                 key={am.id}
//                 className="flex items-center bg-green-100 text-black px-2 py-1 rounded-full text-xs"
//               >
//                 <img src={am.icon_link} className="w-3 h-3 mr-1" />
//                 {am.name}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* price & button */}
//         <div className="p-4 flex flex-col justify-between items-end">
//         {/* <div className="flex flex-col items-end justify-between p-4"> */}
//         <div className="flex flex-col items-end space-y-1">
//           <span className="text-orange-500 font-semibold md:text-md xl:text-lg">
//             Price: {trip.price} {trip.currency?.symbol} / Person
//           </span>
//           <span className="text-gray-600">{trip.avalible_seats} seats left</span>
//           {
//             (trip.trip_type === "bus")&& 
//             <span className="text-gray-600">{trip.trip_type} number :{trip.bus?.bus_number} </span>
//           }
//         </div>
//           <button
//             onClick={() => {
//               if (!auth.user) {
//                 auth.toastError("Log in first");
//                 return navigate("/auth/login", { replace: true });
//               }
//               navigate(`details/${trip.id}`, { state: { trip } });
//             }}
//             className="mt-2 bg-secoundColor hover:bg-secoundColor/90 text-white text-md font-semibold px-8 py-2 rounded"
//           >
//             Select
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // --- render ---
//   return (
//     <div className="min-h-screen bg-white md:p-8 p-4">

//       {/* mobile header */}
//       <div className="flex md:hidden items-center justify-between mb-4">
//         {/* <h1 className="text-xl font-semibold">Results</h1> */}
//         <button
//           onClick={()=>setMobileOpen(true)}
//           className="bg-secoundColor text-white px-3 py-1 rounded text-sm"
//         >
//           Filters
//         </button>
//       </div>

//       <div className="flex">
//         {/* sidebar */}
//         <div className="hidden md:block mr-8">
//           <Sidebar />
//         </div>

//         <div className="border border-gray-500 mr-5"></div>

//         {/* results */}
//         <div className="flex-1">
//           {filtered.length === 0 ? (
//             <div className="text-center text-gray-600">
//               No trips match your filters.
//               <img src={ErrorImg} className="mx-auto mt-4 w-32" />
//             </div>
//           ) : (
//             <div className="space-y-6">
//                 <div>
//                   <h1 className="font-semibold text-2xl">Results:</h1>
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-1 gap-3">
//               {filtered.map(t => <TripCard key={t.id} trip={t} />)}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* mobile drawer */}
//       {mobileOpen && (
//         <div className="fixed inset-0 z-50 flex">
//           <div
//             className="absolute inset-0 bg-black bg-opacity-50"
//             onClick={()=>setMobileOpen(false)}
//           />
//           <div className="relative bg-white w-82 p-2 overflow-x-hidden">
//             <button
//               className="absolute top-4 right-4 text-gray-600"
//               onClick={()=>setMobileOpen(false)}
//             >
//               ✕
//             </button>
//             <Sidebar />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaBus, FaTrain, FaCar, FaStar, FaChevronRight, 
  FaSnowflake, FaTv, FaCheckCircle, FaFilter, FaArrowRight 
} from "react-icons/fa";
import { BookingSearchForm, MapModal } from "../../Components/Component";
import { useGet } from "../../Hooks/useGet";
import { usePost } from "../../Hooks/usePostJson";
import { useAuth } from "../../Context/Auth";
import ErrorImg from "../../Assets/Images/Error.png";

// --- Helpers ---
const to12Hour = (timeStr = "") => {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mStr} ${ampm}`;
};

const toMinutes = (t = "00:00:00") => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function SearchResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  // --- UI State ---
  const [activeTab, setActiveTab] = useState("all");
  const [showModify, setShowModify] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  // --- API & DATA ---
  const { refetch: refetchBookingList, data: bookingListData } = useGet({ url: `https://bcknd.ticket-hub.net/user/booking/lists` });
  const { postData: postGeneral, loadingPost, response } = usePost({ url: `${apiUrl}/user/booking` });
  const { postData: postPrivate, loadingPost: loadingPrivate } = usePost({ url: `${apiUrl}/user/booking/private_request` });

  // --- Search Results State ---
  const [displayTrips, setDisplayTrips] = useState(state?.trips?.all_trips || []);
  const [displaySearchData, setDisplaySearchData] = useState(state?.searchData || { from: "Departure", to: "Arrival", date: "" });

  // --- Form Options State ---
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cars, setCars] = useState([]);

  // --- Search Form State ---
  const [filterMode, setFilterMode] = useState("general");
  const [passengerCounts, setPassengerCounts] = useState({ adult: 2, child: 0 });
  const [selectedFromCity, setSelectedFromCity] = useState(null);
  const [selectedToCity, setSelectedToCity] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split("T")[0]);
  const [roundDate, setRoundDate] = useState("");
  const [showTravelerMenu, setShowTravelerMenu] = useState(false);
  const [addressFrom, setAddressFrom] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [mapLocationFrom, setMapLocationFrom] = useState([26.8206, 30.8025]);
  const [mapLocationTo, setMapLocationTo] = useState([26.8206, 30.8025]);
  const [showMapFrom, setShowMapFrom] = useState(false);
  const [showMapTo, setShowMapTo] = useState(false);

  useEffect(() => { refetchBookingList(); }, []);

  useEffect(() => {
    if (bookingListData) {
      setCities(bookingListData.cities?.map(c => ({ value: String(c.id), label: c.name })) || []);
      setCountries(bookingListData.countries?.map(c => ({ value: String(c.id), label: c.name })) || []);
      setCars(bookingListData.car_category?.map(c => ({ value: String(c.id), label: c.name })) || []);
    }
  }, [bookingListData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalTravelers = passengerCounts.adult + passengerCounts.child;
    const formData = { date: travelDate, traveler: totalTravelers };

    if (filterMode === "general") {
      formData.type = roundDate ? "round_trip" : "one_way";
      if (roundDate) formData.round_date = roundDate;
      formData.from = selectedFromCity?.value;
      formData.to = selectedToCity?.value;
      postGeneral(formData);
    } else {
      formData.country_id = selectedCountry?.value;
      formData.city_id = selectedToCity?.value;
      formData.from_city_id = selectedFromCity?.value;
      formData.address = addressTo;
      formData.from_address = addressFrom;
      formData.category_id = selectedCar?.value;
      formData.map = `0{mapLocationTo[0]},${mapLocationTo[1]}`;
      formData.from_map = `0{mapLocationFrom[0]},${mapLocationFrom[1]}`;
      postPrivate(formData);
    }
  };

  useEffect(() => {
    if (response && !loadingPost) {
      setDisplayTrips(response.data?.all_trips || []);
      setDisplaySearchData({
        from: selectedFromCity?.label || "Departure",
        to: selectedToCity?.label || "Arrival",
        date: travelDate,
        travelers: passengerCounts.adult + passengerCounts.child
      });
      setShowModify(false);
    }
  }, [response, loadingPost]);

  // --- Filtering Logic ---
  const filteredTrips = useMemo(() => {
    let result = displayTrips.filter(t => activeTab === "all" || t.trip_type === activeTab);
    
    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "duration_asc") {
      result.sort((a, b) => (toMinutes(a.arrival_time) - toMinutes(a.deputre_time)) - (toMinutes(b.arrival_time) - toMinutes(b.deputre_time)));
    }
    return result;
  }, [displayTrips, activeTab, sortBy]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      
      {/* 1. STICKY MODERN HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-5 py-2 cursor-pointer hover:bg-gray-100 transition flex-1 md:flex-none"
            onClick={() => setShowModify(!showModify)}
          >
            <span className="font-bold text-gray-800">{displaySearchData.from}</span>
            <FaArrowRight className="text-orange-500 text-xs" />
            <span className="font-bold text-gray-800">{displaySearchData.to}</span>
            <span className="hidden md:inline border-l pl-3 ml-2 text-gray-500 text-sm">
              {displaySearchData.date} • {displaySearchData.travelers || 2} Travelers
            </span>
          </div>

          <button 
            onClick={() => setShowModify(!showModify)}
            className="hidden md:block bg-orange-500 text-white px-8 py-2 rounded-full font-bold hover:bg-orange-600 transition"
          >
            {showModify ? 'Cancel' : 'Modify'}
          </button>
        </div>

        {/* MODIFY FORM DROPDOWN */}
        {showModify && (
          <div className="bg-white border-b p-4 animate-in slide-in-from-top duration-300">
            <div className="max-w-6xl mx-auto">
              <BookingSearchForm
                cities={cities} countries={countries} cars={cars}
                filterMode={filterMode} setFilterMode={setFilterMode}
                activeTab={activeTab} setActiveTab={setActiveTab}
                selectedFromCity={selectedFromCity} setSelectedFromCity={setSelectedFromCity}
                selectedToCity={selectedToCity} setSelectedToCity={setSelectedToCity}
                selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
                selectedCar={selectedCar} setSelectedCar={setSelectedCar}
                travelDate={travelDate} setTravelDate={setTravelDate}
                roundDate={roundDate} setRoundDate={setRoundDate}
                passengerCounts={passengerCounts} setPassengerCounts={setPassengerCounts}
                addressFrom={addressFrom} setAddressFrom={setAddressFrom}
                addressTo={addressTo} setAddressTo={setAddressTo}
                showTravelerMenu={showTravelerMenu} setShowTravelerMenu={setShowTravelerMenu}
                loadingPost={loadingPost} loadingPrivate={loadingPrivate}
                onSearch={handleSubmit}
                onMapFromOpen={() => setShowMapFrom(true)}
                onMapToOpen={() => setShowMapTo(true)}
                onSwitchCities={() => {
                  const t = selectedFromCity; setSelectedFromCity(selectedToCity); setSelectedToCity(t);
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* 2. TRANSPORT TABS */}
      <nav className="bg-white border-b sticky top-[68px] z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex justify-around md:justify-start">
          {[
            { id: "all", label: "All", icon: null },
            { id: "bus", label: "Bus", icon: <FaBus /> },
            { id: "train", label: "Train", icon: <FaTrain /> },
            { id: "hiace", label: "Hiace", icon: <FaCar /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-4 px-6 border-b-2 transition min-w-[100px] ${
                activeTab === tab.id ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-black uppercase">
                {tab.icon} {tab.label}
              </div>
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 p-4 md:p-8">
        
        {/* 3. SIDEBAR FILTERS */}
        <aside className="hidden md:block space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Sort By</h3>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="duration_asc">Shortest Duration</option>
            </select>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Amenities</h3>
            <div className="space-y-3">
              {['A/C', 'WiFi', 'TV', 'USB Charger'].map(item => (
                <label key={item} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-orange-500 rounded" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* 4. TRIP CARDS LIST */}
        <main className="md:col-span-3 space-y-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-gray-500 font-bold text-xs uppercase tracking-widest">
              {filteredTrips.length} Results Found
            </h2>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-200">
              <img src={ErrorImg} className="mx-auto w-40 mb-4 opacity-50" />
              <p className="text-gray-500 font-medium">No trips found matching your criteria.</p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <TripResultCard key={trip.id} trip={trip} navigate={navigate} auth={auth} />
            ))
          )}
        </main>
      </div>

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
}

// --- SUB-COMPONENT: TRIP CARD (Second Page Design) ---
function TripResultCard({ trip, navigate, auth }) {
  const handleSelect = () => {
    if (!auth.user) {
      auth.toastError("Log in first");
      return navigate("/auth/login", { replace: true });
    }
    navigate(`details/${trip.id}`, { state: { trip } });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">
      
      {/* Image Section */}
      <div className="relative w-full md:w-64 h-52 md:h-auto overflow-hidden">
        <img 
          src={trip.bus?.image_link || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=500&auto=format&fit=crop"} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt="trip" 
        />
        <div className="absolute top-4 left-4 bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg">
          Top Rated
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 text-gray-800 font-extrabold text-lg mb-1">
                {trip.trip_type === 'bus' ? <FaBus className="text-gray-400" /> : <FaTrain className="text-gray-400" />}
                {trip.trip_name}
              </div>
              <div className="flex items-center text-xs font-bold text-orange-500">
                <FaStar className="mr-1" /> 4.8 <span className="text-gray-400 font-normal ml-2 tracking-wide">(1.2k reviews)</span>
              </div>
            </div>
          </div>

          {/* Timeline View */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{to12Hour(trip.deputre_time)}</div>
              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                {trip.pickup_station?.name || "Departure"}
              </div>
            </div>

            <div className="flex-1 px-8 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">{trip.duration}</span>
              <div className="w-full h-[2px] bg-gray-100 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-200 border-2 border-white"></div>
                <div className="absolute -top-[3px] right-0 w-2 h-2 border-t-2 border-r-2 border-orange-500 rotate-45"></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{to12Hour(trip.arrival_time)}</div>
              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                {trip.dropoff_station?.name || "Arrival"}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-50">
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5 text-green-600 text-[11px] font-black uppercase tracking-wider">
               <FaCheckCircle className="text-sm" /> Instant
             </div>
             <div className="hidden sm:flex items-center gap-3 text-gray-300">
                <FaSnowflake title="AC" />
                <FaTv title="TV" />
             </div>
          </div>
          <div className="text-[11px] font-bold text-gray-400 italic">
            {trip.avalible_seats} seats left
          </div>
        </div>
      </div>

      {/* Price/Action Section */}
      <div className="w-full md:w-52 bg-[#F9FAFB] md:border-l border-gray-100 p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4">
        <div className="md:text-center">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Total Price</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-gray-900">US${trip.price}</span>
          </div>
        </div>
        <button 
          onClick={handleSelect}
          className="bg-orange-500 text-white px-10 py-3.5 md:w-full rounded-xl font-black text-sm hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 group/btn"
        >
          SELECT <FaChevronRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}