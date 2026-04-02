import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBus, FaTrain, FaCar, FaStar, FaChevronRight,
  FaSnowflake, FaTv, FaCheckCircle, FaTimes,
  FaMapMarkerAlt, FaArrowRight, FaEdit, FaUsers, FaCalendarAlt
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

// --- Modal Component ---
function ModifyModal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-4 pb-4 px-2 sm:pt-8"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

       {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-gray-500 hover:text-gray-900 hover:bg-white shadow-lg transition-all"
        >
          <FaTimes size={14} />
        </button>

      {/* Modal Box */}
      <div
        className="relative w-full px-6 bg-transparent rounded-3xl z-10 max-h-[90vh] overflow-y-auto"
        style={{ animation: "modalSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {children}
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default function SearchResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // --- UI State ---
  const [activeTab, setActiveTab] = useState("all");
  const [showModify, setShowModify] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  // --- API & DATA ---
  const { refetch: refetchBookingList, data: bookingListData } = useGet({ url: `${apiUrl}/user/booking/lists` });
  const { postData: postGeneral, loadingPost, response } = usePost({ url: `${apiUrl}/user/booking` });
  const { postData: postPrivate, loadingPost: loadingPrivate } = usePost({ url: `${apiUrl}/user/booking/private_request` });

  // --- Search Results State ---
  const [displayTrips, setDisplayTrips] = useState(state?.trips?.all_trips || []);
  const [displaySearchData, setDisplaySearchData] = useState({
    from: state?.searchData?.fromLabel || state?.searchData?.from || "Departure",
    to: state?.searchData?.toLabel || state?.searchData?.to || "Arrival",
    date: state?.searchData?.date || "",
    travelers: state?.searchData?.travelers || 2,
  });

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
      const citiesList = bookingListData.cities?.map(c => ({ value: String(c.id), label: c.name })) || [];
      setCities(citiesList);
      setCountries(bookingListData.countries?.map(c => ({ value: String(c.id), label: c.name })) || []);
      setCars(bookingListData.car_category?.map(c => ({ value: String(c.id), label: c.name })) || []);

      // Fix: once we have cities, resolve if displaySearchData.from looks like an ID (numeric)
      setDisplaySearchData(prev => {
        const fromIsId = prev.from && !isNaN(Number(prev.from));
        const toIsId = prev.to && !isNaN(Number(prev.to));
        if (fromIsId || toIsId) {
          const fromCity = citiesList.find(c => c.value === String(prev.from));
          const toCity = citiesList.find(c => c.value === String(prev.to));
          return {
            ...prev,
            from: fromIsId ? (fromCity?.label || prev.from) : prev.from,
            to: toIsId ? (toCity?.label || prev.to) : prev.to,
          };
        }
        return prev;
      });
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
        travelers: passengerCounts.adult + passengerCounts.child,
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
      result.sort((a, b) =>
        (toMinutes(a.arrival_time) - toMinutes(a.deputre_time)) -
        (toMinutes(b.arrival_time) - toMinutes(b.deputre_time))
      );
    }
    return result;
  }, [displayTrips, activeTab, sortBy]);

  return (
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)" }}>

      {/* ============ STICKY HEADER ============ */}
      <header className="sticky top-0 z-50 shadow-lg" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
        {/* Top bar */}
        <div className="w-full px-3 sm:px-6 py-3 flex items-center gap-3">

          {/* Route pill — click to open modal */}
          <button
            onClick={() => setShowModify(true)}
            className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0 group"
          >
            <div
              className="flex-1 flex items-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 transition-all duration-200 min-w-0"
            >
              {/* From */}
              <div className="flex items-center gap-1.5 min-w-0">
                <FaMapMarkerAlt className="text-orange-400 flex-shrink-0 text-xs sm:text-sm" />
                <span className="font-extrabold text-white text-sm sm:text-base truncate max-w-[80px] sm:max-w-[140px]">
                  {displaySearchData.from}
                </span>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-orange-500/20 border border-orange-400/30 rounded-full flex items-center justify-center">
                <FaArrowRight className="text-orange-400 text-[10px] sm:text-xs" />
              </div>

              {/* To */}
              <div className="flex items-center gap-1.5 min-w-0">
                <FaMapMarkerAlt className="text-emerald-400 flex-shrink-0 text-xs sm:text-sm" />
                <span className="font-extrabold text-white text-sm sm:text-base truncate max-w-[80px] sm:max-w-[140px]">
                  {displaySearchData.to}
                </span>
              </div>

              {/* Meta info — hidden on small screens */}
              <div className="hidden lg:flex items-center gap-3 ml-auto pl-4 border-l border-white/20 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold">
                  <FaCalendarAlt className="text-orange-400/80" />
                  <span>{displaySearchData.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold">
                  <FaUsers className="text-orange-400/80" />
                  <span>{displaySearchData.travelers || 2} Travelers</span>
                </div>
              </div>
            </div>
          </button>

          {/* Modify button */}
          <button
            onClick={() => setShowModify(true)}
            className="flex-shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-orange-900/30 hover:shadow-orange-900/50"
          >
            <FaEdit className="text-xs sm:text-sm" />
            <span className="hidden xs:inline sm:inline">Modify</span>
          </button>
        </div>

        {/* Date + Travelers Meta — visible on mobile below main bar */}
        <div className="flex lg:hidden items-center justify-center gap-4 px-4 pb-2.5">
          {displaySearchData.date && (
            <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-semibold">
              <FaCalendarAlt className="text-orange-400/70 text-[10px]" />
              <span>{displaySearchData.date}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-semibold">
            <FaUsers className="text-orange-400/70 text-[10px]" />
            <span>{displaySearchData.travelers || 2} Travelers</span>
          </div>
        </div>
      </header>

      {/* ============ TRANSPORT TABS ============ */}
      <nav className="bg-white border-b shadow-sm sticky top-[56px] sm:top-[68px] z-40 overflow-x-auto">
        <div className="w-full px-2 sm:px-4 flex">
          {[
            { id: "all", label: "All", icon: null },
            { id: "bus", label: "Bus", icon: <FaBus /> },
            { id: "train", label: "Train", icon: <FaTrain /> },
            { id: "hiace", label: "Hiace", icon: <FaCar /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 md:py-4 px-4 md:px-6 border-b-2 transition-all min-w-[72px] md:min-w-[96px] ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-black uppercase tracking-wider">
                {tab.icon} {tab.label}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* ============ MAIN CONTENT ============ */}
      <div className="w-full px-3 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-8 py-5 sm:py-8">

        {/* SIDEBAR FILTERS */}
        <aside className="hidden md:block space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-800 mb-4 pb-2.5 border-b text-sm uppercase tracking-widest">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-semibold outline-none text-gray-700 cursor-pointer hover:border-orange-300 transition"
            >
              <option value="recommended">⭐ Recommended</option>
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💸 Price: High to Low</option>
              <option value="duration_asc">⚡ Shortest Duration</option>
            </select>
          </div>

          {/* <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-800 mb-4 pb-2.5 border-b text-sm uppercase tracking-widest">Amenities</h3>
            <div className="space-y-3.5">
              {['A/C', 'WiFi', 'TV', 'USB Charger'].map(item => (
                <label key={item} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 accent-orange-500 rounded cursor-pointer" />
                  <span className="group-hover:text-orange-500 transition font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div> */}
        </aside>

        {/* TRIP CARDS LIST */}
        <main className="md:col-span-3 space-y-4">
          {/* Mobile sort */}
          <div className="flex items-center justify-between md:hidden">
            <h2 className="text-gray-500 font-bold text-xs uppercase tracking-widest">
              {filteredTrips.length} Results
            </h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none text-gray-700"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="duration_asc">Shortest</option>
            </select>
          </div>

          <div className="hidden md:flex justify-between items-center mb-1">
            <h2 className="text-gray-500 font-bold text-xs uppercase tracking-widest">
              {filteredTrips.length} Results Found
            </h2>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 sm:p-20 text-center border-2 border-dashed border-gray-200">
              <img src={ErrorImg} className="mx-auto w-28 sm:w-40 mb-4 opacity-40" alt="No results" />
              <p className="text-gray-500 font-semibold text-sm sm:text-base">No trips found matching your criteria.</p>
              <button
                onClick={() => setShowModify(true)}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold text-sm transition"
              >
                Modify Search
              </button>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <TripResultCard key={trip.id} trip={trip} navigate={navigate} auth={auth} />
            ))
          )}
        </main>
      </div>

      {/* ============ MODIFY MODAL ============ */}
      <ModifyModal isOpen={showModify} onClose={() => setShowModify(false)}>
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
      </ModifyModal>

      {/* ============ MAP MODAL ============ */}
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

// --- SUB-COMPONENT: TRIP CARD ---
function TripResultCard({ trip, navigate, auth }) {
  const handleSelect = () => {
    if (!auth.user) {
      auth.toastError("Log in first");
      return navigate("/auth/login", { replace: true });
    }
    navigate(`details/${trip.id}`, { state: { trip } });
  };

  // Image — use bus.bus_image path, fall back to image_link
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imgBase = apiUrl?.replace("/api", "") || "";
  const imageSrc = trip.bus?.bus_image
    ? `${imgBase}/storage/${trip.bus.bus_image}`
    : trip.image_link || null;

  // Currency & price
  const currencyName = trip.currency?.name || "";
  const priceDisplay = `${trip.price}${currencyName ? " " + currencyName : ""}`;

  // Route city names from API
  const fromCity = trip.city?.name || "";
  const toCity = trip.to_city?.name || "";
  const fromCountry = trip.country?.name || "";
  const toCountry = trip.to_country?.name || "";

  // Dynamic icon
  const TripIcon = trip.trip_type === "bus" ? FaBus : trip.trip_type === "train" ? FaTrain : FaCar;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">

      {/* Image */}
      <div className="relative w-full md:w-52 xl:w-64 h-44 md:h-auto overflow-hidden flex-shrink-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt={trip.trip_name}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <TripIcon className="text-gray-300 text-4xl" />
          </div>
        )}
        {/* Trip type badge */}
        <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow capitalize">
          {trip.trip_type}
        </div>
        {/* Date badge */}
        {trip.date && (
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {trip.date}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-between min-w-0">
        <div>
          {/* Trip name + mobile price */}
          <div className="flex items-start justify-between mb-4 gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-gray-800 font-extrabold text-base sm:text-lg mb-1">
                <TripIcon className="text-orange-400 flex-shrink-0 text-sm" />
                <span className="truncate">{trip.trip_name}</span>
              </div>
              {trip.bus?.bus_number && (
                <div className="text-[11px] text-gray-400 font-semibold">Bus #{trip.bus.bus_number}</div>
              )}
            </div>
            {/* Price shown inline on mobile */}
            <div className="flex-shrink-0 md:hidden text-right">
              <div className="text-lg font-black text-gray-900">{priceDisplay}</div>
              <div className="text-[10px] text-gray-400 uppercase font-bold">Total</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between mb-5">
            {/* Departure */}
            <div className="text-center min-w-0">
              <div className="text-xl sm:text-2xl font-black text-gray-900">{to12Hour(trip.deputre_time)}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 truncate max-w-[90px]">
                {trip.pickup_station?.name}
              </div>
              {fromCity && (
                <div className="text-[11px] text-orange-500 font-semibold mt-0.5 truncate max-w-[90px]">{fromCity}</div>
              )}
              {fromCountry && (
                <div className="text-[10px] text-gray-400 truncate max-w-[90px]">{fromCountry}</div>
              )}
            </div>

            {/* Arrow */}
            <div className="flex-1 px-3 sm:px-5 flex flex-col items-center">
              <div className="w-full h-[2px] bg-gray-100 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-200 border-2 border-white" />
                <div className="absolute -top-[3px] right-0 w-2 h-2 border-t-2 border-r-2 border-orange-500 rotate-45" />
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center min-w-0">
              <div className="text-xl sm:text-2xl font-black text-gray-900">{to12Hour(trip.arrival_time)}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 truncate max-w-[90px]">
                {trip.dropoff_station?.name}
              </div>
              {toCity && (
                <div className="text-[11px] text-orange-500 font-semibold mt-0.5 truncate max-w-[90px]">{toCity}</div>
              )}
              {toCountry && (
                <div className="text-[10px] text-gray-400 truncate max-w-[90px]">{toCountry}</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: seats + cancellation + service fees */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 gap-2 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {trip.avalible_seats != null && (
              <span className="text-[11px] font-bold text-gray-400">🪑 {trip.avalible_seats} seats left</span>
            )}
            {trip.cancelation_hours != null && (
              <span className="text-[11px] font-bold text-gray-400">
                ↩ Cancel &lt;{trip.cancelation_hours}h
              </span>
            )}
          </div>
          {trip.service_fees != null && (
            <span className="text-[11px] text-gray-400 font-semibold">
              +{trip.service_fees} fees
            </span>
          )}
        </div>
      </div>

      {/* Price / CTA — desktop */}
      <div className="hidden md:flex w-44 lg:w-52 bg-gradient-to-b from-gray-50 to-gray-100/50 border-l border-gray-100 p-4 lg:p-6 flex-col items-center justify-center gap-4 flex-shrink-0">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Total Price</p>
          <div className="text-2xl lg:text-3xl font-black text-gray-900">{priceDisplay}</div>
          {trip.service_fees != null && (
            <p className="text-[10px] text-gray-400 mt-1">+{trip.service_fees} fees</p>
          )}
        </div>
        <button
          onClick={handleSelect}
          className="bg-orange-500 text-white px-6 py-3 w-full rounded-xl font-black text-sm hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 group/btn"
        >
          SELECT <FaChevronRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Mobile CTA bar */}
      <div className="md:hidden flex items-center justify-between px-4 pb-4 pt-2 gap-3 border-t border-gray-50">
        <div className="text-xs text-gray-400 font-bold">
          {trip.avalible_seats} seats left
        </div>
        <button
          onClick={handleSelect}
          className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-black text-sm hover:bg-orange-600 transition-all flex items-center gap-1.5"
        >
          SELECT <FaChevronRight className="text-[10px]" />
        </button>
      </div>
    </div>
  );
}