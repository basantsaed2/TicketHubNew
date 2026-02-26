// import React, { useMemo } from "react";
// import { useLocation } from "react-router-dom";
// import {FaBus,FaTrain,FaCar,FaStar,} from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from '../../Context/Auth';
// import Error from './../../Assets/Images/Error.png'
// // Helper function to calculate the time difference (assuming times are in "HH:MM:SS" format)
// const getTimeDifference = (startTime, endTime) => {
//   if (!startTime || !endTime) return "";
//   const [sh, sm, ss] = startTime.split(":").map(Number);
//   const [eh, em, es] = endTime.split(":").map(Number);
//   const start = new Date(0, 0, 0, sh, sm, ss);
//   const end = new Date(0, 0, 0, eh, em, es);
//   let diff = end - start;
//   if (diff < 0) diff += 24 * 60 * 60 * 1000; // handle midnight wrap
//   const hours = Math.floor(diff / 1000 / 60 / 60);
//   const minutes = Math.floor((diff / 1000 / 60) % 60);
//   return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} min${minutes !== 1 ? "s" : ""}`;
// };

// // Helper function to get an icon component based on trip type
// const getServiceIcon = (tripType) => {
//   switch (tripType) {
//     case "bus":
//       return <FaBus className="text-white text-4xl" />;
//     case "train":
//       return <FaTrain className="text-white text-4xl" />;
//     case "hiace":
//       return <FaCar className="text-white text-4xl" />;
//     default:
//       return null;
//   }
// };

// const TripCard = ({ trip }) => {
//   const busImage =
//     trip.bus && trip.bus.image_link
//       ? `${trip.bus.image_link}`
//       : "https://via.placeholder.com/150x100?text=No+Image";

//   // Use default values if rating or reviews are missing
//   const rating = trip.rating || 4.5;
//   const reviewsCount = trip.reviewsCount || 42;

//   const departureTime = trip.deputre_time || "N/A";
//   const arrivalTime = trip.arrival_time || "N/A";

//   // Operator info: add label for bus number if available
//   const operator =
//     trip.bus && trip.bus.bus_number
//       ? `Bus Number: ${trip.bus.bus_number}`
//       : "Unknown Operator";

//   const amenities = trip.bus?.aminity || [];
//   const navigate = useNavigate();
//   const auth = useAuth();

//   return (
//     <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200">
//       {/* Left Section: Image or Icon */}
//       <div className="relative w-full md:w-40 h-32 md:h-full p-4 flex-shrink-0">
//         {trip.bus && trip.bus.bus_image ? (
//           <img src={busImage} alt="Service" className="w-full h-full object-cover rounded-md" />
//         ) : (
//           <div className="w-full h-full bg-mainColor flex items-center justify-center rounded-md">
//             {getServiceIcon(trip.trip_type)}
//           </div>
//         )}
//         <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-sm py-1 px-3">
//           {trip.trip_name}
//         </div>
//       </div>

//       {/* Middle Section: Trip Details */}
//       <div className="flex-1 p-4">
//         <div className="flex flex-row items-center gap-3 mb-2">
//           <h2 className="text-xl font-semibold">{trip.trip_name}</h2>
//           <div className="flex items-center text-yellow-500 text-sm">
//             <FaStar className="mr-1" />
//             <span>{rating}</span>
//             <span className="ml-1 text-gray-500">({reviewsCount})</span>
//           </div>
//         </div>
//         <div className="flex flex-col gap-2 mb-2">
        // <div className="text-gray-700 text-md" dir="ltr">
        //     <span className="font-medium" dir="ltr">
        //       {trip.pickup_station?.name || "Unknown Pickup"}
        //     </span>
        //     <span className="mx-1 text-gray-400">→</span>
        //     <span className="font-medium" dir="ltr">
        //       {trip.dropoff_station?.name || "Unknown Dropoff"}
        //     </span>
        //   </div>
        //   <div className="text-sm text-gray-500">
        //     From: {departureTime}<span className="mx-1 text-gray-400">→</span> To :{arrivalTime} <br />
        //     ({getTimeDifference(departureTime, arrivalTime)})
        //   </div>
        // </div>
//           {/* <span className="text-gray-600">{trip.avalible_seats} seats left</span> */}
//           <div className="flex items-center justify-between text-sm space-x-2">
//             {amenities.map((amenity) => (
//               <div
//                 key={amenity.id}
//                 className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
//               >
//                 <img src={amenity.icon_link} alt={amenity.name} className="w-4 h-4 mr-1" />
//                 <span>{amenity.name}</span>
//               </div>
//             ))}
//           </div>
//       </div>

//       {/* Right Section: Price & Action Button */}
      // <div className="flex flex-col items-end justify-between p-4">
      //   <div className="flex flex-col items-end space-y-1">
      //   <span className="text-orange-500 font-semibold text-lg">
      //     Price: {trip.price}{trip.currency?.symbol} / Person
      //   </span>
      //   <span className="text-gray-600">{trip.avalible_seats} seats left</span>
      //   <span className="text-gray-600">{trip.trip_type} number :{trip.bus?.bus_number} </span>
      //   </div>
//         <button
//           onClick={() => {
//             if (!auth.user) {
//               auth.toastError('You must be logged in to continue.');
//               navigate('/auth/login', { replace: true });
//               return;
//             }
//             navigate(`details/${trip.id}`, { state: { trip } });
//           }}
//           className="w-full bg-mainColor hover:bg-mainColor/90 text-white font-semibold px-4 py-2 rounded"
//         >
//           Select
//         </button>
//       </div>
//     </div>
//   );
// };

// const SearchResultPage = () => {
//   const { state } = useLocation();
//   // Expected state: { trips: { all_trips: [...] }, service: "all" | "bus" | "train" | "hiace" }
//   const { trips, service } = state || {};

//   const filteredTrips = useMemo(() => {
//     if (!trips || !trips.all_trips) return [];
//     if (service === "all") return trips.all_trips;
//     return trips.all_trips.filter((trip) => trip.trip_type === service);
//   }, [trips, service]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-3xl font-bold text-center mb-6">Search Results</h1>
//       <p className="text-center text-gray-600 mb-8">
//         Service: <span className="font-semibold">{service ? service.toUpperCase() : "ALL"}</span>
//       </p>

//       {filteredTrips.length === 0 ? (
//         <div className="flex flex-col justify-center items-center">
//         <p className="text-center text-gray-700">
//           No trips available for the selected service.
//         </p>
//         <img src={Error} alt="" />
//         </div>
//       ) : (
        // <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//           {filteredTrips.map((trip) => (
//             <TripCard key={trip.id} trip={trip} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResultPage;


import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // or next/navigation
import { FaBus, FaTrain, FaCar, FaStar, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../../Context/Auth";
import ErrorImg from "../../Assets/Images/Error.png";

// Helpers
const toMinutes = (t = "00:00:00") => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const hhmm = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};
const diffText = (s, e) => {
  const d = toMinutes(e) - toMinutes(s);
  const pd = d >= 0 ? d : d + 24 * 60;
  const h = Math.floor(pd / 60), m = pd % 60;
  return `${h} hr${h!==1?"s":""} ${m} min${m!==1?"s":""}`;
};
const getIcon = (type) => {
  switch(type) {
    case "bus": return <FaBus className="text-white text-2xl"/>;
    case "train": return <FaTrain className="text-white text-2xl"/>;
    case "hiace": return <FaCar className="text-white text-2xl"/>;
    default: return null;
  }
};
// helpers
const to12Hour = (timeStr = "") => {
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  if (h === 0) h = 12;
  else if (h > 12) h = h - 12;
  return `${h}:${mStr}`;
};

export default function SearchResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const trips = state?.trips?.all_trips || [];
  const searchData= state?.searchData || [];
  console.log("searchData",searchData)

  // derive slider bounds
  const deps = trips.map(t => toMinutes(t.deputre_time));
  const arrs = trips.map(t => toMinutes(t.arrival_time));
  const ps   = trips.map(t => t.price);
  const depMin = Math.min(...deps, 0), depMax = Math.max(...deps, 1440);
  const arrMin = Math.min(...arrs, 0), arrMax = Math.max(...arrs, 1440);
  const priceMin = Math.min(...ps, 0), priceMax = Math.max(...ps, 0);

  // filter/sort state
  const [sortBy, setSortBy] = useState("recommended");
  const [types, setTypes] = useState(["all"]);
  const [services, setServices] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [depRange, setDepRange] = useState([depMin, depMax]);
  const [arrRange, setArrRange] = useState([arrMin, arrMax]);
  const [priceRange, setPriceRange] = useState([priceMin, priceMax]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (arr, set, v) =>
    arr.includes(v) ? set(arr.filter(x=>x!==v)) : set([...arr, v]);

  // filtered + sorted
  const filtered = useMemo(() => {
    return trips
      .filter(t => {
        if (!types.includes("all") && !types.includes(t.trip_type)) return false;
        const d = toMinutes(t.deputre_time);
        if (d < depRange[0] || d > depRange[1]) return false;
        const a = toMinutes(t.arrival_time);
        if (a < arrRange[0] || a > arrRange[1]) return false;
        if (t.price < priceRange[0] || t.price > priceRange[1]) return false;
        // TODO: services/amenities
        return true;
      })
      .sort((a,b) => {
        if (sortBy==="price_asc") return a.price - b.price;
        if (sortBy==="price_desc") return b.price - a.price;
        if (sortBy==="duration_asc")
          return (toMinutes(a.arrival_time)-toMinutes(a.deputre_time))
               - (toMinutes(b.arrival_time)-toMinutes(b.deputre_time));
        return 0;
      });
  }, [trips, types, depRange, arrRange, priceRange, sortBy]);

  // --- Sidebar JSX (desktop + mobile) ---
  const Sidebar = () => {
    const transports = [
      {label:"All",value:"all"},
      {label:"Hiace",value:"hiace"},
      {label:"Private",value:"private"},
      {label:"Trains",value:"train"},
      {label:"Bus",value:"bus"},
    ];
    const servicesOpts = [
      {label:"Instant Confirmation",value:"instant_confirmation"},
    ];
    const amenityOpts = [
      {label:"A/C",value:"ac"},
      {label:"WC",value:"wc"},
      {label:"Food & Drinks",value:"food_drinks"},
      {label:"USB Charger",value:"usb_charger"},
      {label:"TV",value:"tv"},
      {label:"Wheelchair Accessibility",value:"wheelchair"},
    ];

    return (
      <div className="w-72 bg-white p-6 rounded-lg shadow">
        {/* title */}
        <h2 className="font-semibold text-lg mb-4">Filters</h2>

        {/* Sort */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1 text-sm">Sort by</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={sortBy}
            onChange={e=>setSortBy(e.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="duration_asc">Duration: Short → Long</option>
          </select>
        </div>

        {/* Transport */}
        {/* <div className="mb-6">
          <p className="text-gray-600 mb-2 text-sm">Transport Type</p>
          {transports.map(o=>(
            <label key={o.value} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                className="accent-secoundColor mr-2"
                checked={types.includes(o.value)}
                onChange={()=>toggle(types,setTypes,o.value)}
              />
              {o.label}
            </label>
          ))}
        </div> */}

        {/* Services */}
        {/* <div className="mb-6">
          <p className="text-gray-600 mb-2 text-sm">Services</p>
          {servicesOpts.map(o=>(
            <label key={o.value} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                className="accent-secoundColor mr-2"
                checked={services.includes(o.value)}
                onChange={()=>toggle(services,setServices,o.value)}
              />
              {o.label}
            </label>
          ))}
        </div> */}

        {/* Amenities */}
        {/* <div className="mb-6">
          <p className="text-gray-600 mb-2 text-sm">Amenities</p>
          {amenityOpts.map(o=>(
            <label key={o.value} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                className="accent-secoundColor mr-2"
                checked={amenities.includes(o.value)}
                onChange={()=>toggle(amenities,setAmenities,o.value)}
              />
              {o.label}
            </label>
          ))}
        </div> */}

        {/* Departure */}
        <div className="mb-6">
          <p className="text-gray-600 mb-1 text-sm">Departure Time</p>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{hhmm(depRange[0])}</span>
            <span>{hhmm(depRange[1])}</span>
          </div>
          <input
            type="range"
            min={depMin}
            max={depMax}
            value={depRange[0]}
            onChange={e=>setDepRange([+e.target.value,depRange[1]])}
            className="w-full h-1 rounded-lg accent-secoundColor"
          />
          <input
            type="range"
            min={depMin}
            max={depMax}
            value={depRange[1]}
            onChange={e=>setDepRange([depRange[0],+e.target.value])}
            className="w-full h-1 rounded-lg accent-secoundColor mt-1"
          />
        </div>

        {/* Arrival */}
        <div className="mb-6">
          <p className="text-gray-600 mb-1 text-sm">Arrival Time</p>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{hhmm(arrRange[0])}</span>
            <span>{hhmm(arrRange[1])}</span>
          </div>
          <input
            type="range"
            min={arrMin}
            max={arrMax}
            value={arrRange[0]}
            onChange={e=>setArrRange([+e.target.value,arrRange[1]])}
            className="w-full h-1 rounded-lg accent-secoundColor"
          />
          <input
            type="range"
            min={arrMin}
            max={arrMax}
            value={arrRange[1]}
            onChange={e=>setArrRange([arrRange[0],+e.target.value])}
            className="w-full h-1 rounded-lg accent-secoundColor mt-1"
          />
        </div>

        {/* Price */}
        <div>
          <p className="text-gray-600 mb-1 text-sm">Price</p>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>US${priceRange[0]}</span>
            <span>US${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            value={priceRange[0]}
            onChange={e=>setPriceRange([+e.target.value,priceRange[1]])}
            className="w-full h-1 rounded-lg accent-secoundColor"
          />
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            value={priceRange[1]}
            onChange={e=>setPriceRange([priceRange[0],+e.target.value])}
            className="w-full h-1 rounded-lg accent-secoundColor mt-1"
          />
        </div>
      </div>
    );
  };

  // --- Trip Card ---
  const TripCard = ({ trip }) => {
    const img = trip.bus?.image_link || "https://via.placeholder.com/150x100";
    const rating = trip.rating ?? 4.8;
    const reviews = trip.reviewsCount ?? 86;

    return (
      <div className="flex flex-col lg:flex-row bg-[#E8E8EA] md:h-[160px] h-[500px] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        {/* image/icon */}
        <div className="relative w-full md:w-48 md:h-auto h-48  p-4">
          {trip.bus ? (
            <img src={img} className="w-full h-full object-fill rounded" />
          ) : (
            <div className="w-full h-full bg-mainColor flex items-center justify-center rounded">
              {getIcon(trip.trip_type)}
            </div>
          )}
        </div>

        {/* details */}
        <div className="flex-1 p-4">
          <div className="flex items-center gap-5 mb-2">
            <h3 className="text-lg font-semibold">{trip.trip_name} ({trip.trip_type})</h3>
            <div className="flex items-center text-yellow-400 text-sm">
              <FaStar className="mr-1" /> {rating} <span className="text-gray-500 ml-1">({reviews})</span>
            </div>
          </div>
          
          {/* <div className="text-black text-md mb-2" dir="ltr">
            <span className="font-medium" dir="ltr">
              {trip.country?.name || "Unknown Pickup"}
            </span>
            <span className="mx-1 text-gray-400">→</span>
            <span className="font-medium" dir="ltr">
              {trip.to_country?.name || "Unknown Dropoff"}
            </span>
          </div> */}
          {/* <div className="text-black text-md mb-2" dir="ltr">
            <span className="font-medium" dir="ltr">
              {trip.city?.name || "Unknown Pickup"}
            </span>
            <span className="mx-1 text-gray-400">→</span>
            <span className="font-medium" dir="ltr">
              {trip.to_city?.name || "Unknown Dropoff"}
            </span>
          </div> */}
          <div className="text-black text-md mb-2" dir="ltr">
            <span className="font-medium" dir="ltr">
              Route : {trip.pickup_station?.name || "Unknown Pickup"} ({trip.city?.name})
            </span>
            <span className="mx-1 text-gray-400">→</span>
            <span className="font-medium" dir="ltr">
              {trip.dropoff_station?.name || "Unknown Dropoff"} ({trip.to_city?.name})
            </span>
          </div>
          <div className="text-black text-sm mb-2">
              Time : {to12Hour(trip.deputre_time)} → {to12Hour(trip.arrival_time)} (
                {diffText(trip.deputre_time, trip.arrival_time)}
              )
            </div>

          <div className="flex flex-wrap gap-2">
            {trip.bus?.aminity?.map(am => (
              <span
                key={am.id}
                className="flex items-center bg-green-100 text-black px-2 py-1 rounded-full text-xs"
              >
                <img src={am.icon_link} className="w-3 h-3 mr-1" />
                {am.name}
              </span>
            ))}
          </div>
        </div>

        {/* price & button */}
        <div className="p-4 flex flex-col justify-between items-end">
        {/* <div className="flex flex-col items-end justify-between p-4"> */}
        <div className="flex flex-col items-end space-y-1">
          <span className="text-orange-500 font-semibold md:text-md xl:text-lg">
            Price: {trip.price} {trip.currency?.symbol} / Person
          </span>
          <span className="text-gray-600">{trip.avalible_seats} seats left</span>
          {
            (trip.trip_type === "bus")&& 
            <span className="text-gray-600">{trip.trip_type} number :{trip.bus?.bus_number} </span>
          }
        </div>
          <button
            onClick={() => {
              if (!auth.user) {
                auth.toastError("Log in first");
                return navigate("/auth/login", { replace: true });
              }
              navigate(`details/${trip.id}`, { state: { trip } });
            }}
            className="mt-2 bg-secoundColor hover:bg-secoundColor/90 text-white text-md font-semibold px-8 py-2 rounded"
          >
            Select
          </button>
        </div>
      </div>
    );
  };

  // --- render ---
  return (
    <div className="min-h-screen bg-white md:p-8 p-4">
      {/* <div>
        <h1 className="font-semibold text-2xl mb-2">Results:</h1>
      </div> */}
      {/* desktop header */}
      {/* <div className="hidden md:flex bg-mainColor text-white rounded-lg px-6 py-4 mb-8 items-center justify-between">
        <div>
          <div className="text-xl font-semibold">Alexandria,</div>
          <div className="text-sm text-gray-300">Moharam Bek</div>
        </div>
        <FaArrowRight className="text-secoundColor text-lg" />
        <div className="text-right">
          <div className="text-xl font-semibold">Cairo,</div>
          <div className="text-sm text-gray-300">Giza</div>
        </div>
      </div> */}

      {/* mobile header */}
      <div className="flex md:hidden items-center justify-between mb-4">
        {/* <h1 className="text-xl font-semibold">Results</h1> */}
        <button
          onClick={()=>setMobileOpen(true)}
          className="bg-secoundColor text-white px-3 py-1 rounded text-sm"
        >
          Filters
        </button>
      </div>

      <div className="flex">
        {/* sidebar */}
        <div className="hidden md:block mr-8">
          <Sidebar />
        </div>

        <div className="border border-gray-500 mr-5"></div>

        {/* results */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-600">
              No trips match your filters.
              <img src={ErrorImg} className="mx-auto mt-4 w-32" />
            </div>
          ) : (
            <div className="space-y-6">
                <div>
                  <h1 className="font-semibold text-2xl">Results:</h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-3">
              {filtered.map(t => <TripCard key={t.id} trip={t} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={()=>setMobileOpen(false)}
          />
          <div className="relative bg-white w-82 p-2 overflow-x-hidden">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={()=>setMobileOpen(false)}
            >
              ✕
            </button>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}

