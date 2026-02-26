// import React, { useState, useEffect } from 'react';
// import backgroundImage from "../../Assets/Images/backgroundImage.png";
// import { usePost } from '../../Hooks/usePostJson';
// import { useGet } from '../../Hooks/useGet';
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "@/Components/ui/tabs";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/Components/ui/select";
// import { Input } from "@/Components/ui/input";
// import { Button } from '@/Components/ui/button';
// import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { useAuth } from '../../Context/Auth';
// import { useNavigate } from 'react-router-dom';
// // MapClickHandler that updates the position without closing the modal
// const MapClickHandler = ({ onMapClick }) => {
//   useMapEvent("click", onMapClick);
//   return null;
// };

// const TravelBooking = () => {
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const { refetch: refetchBookingList, data: bookingListData } = useGet({ url: `https://bcknd.ticket-hub.net/user/booking/lists` });
//   const { postData: postGeneral, loadingPost, response } = usePost({ url: `${apiUrl}/user/booking` });
//   const { postData: postPrivate, loadingPost: loadingPrivate, response: responsePrivate } = usePost({ url: `${apiUrl}/user/booking/private_request` });
//   const auth = useAuth();
//   const navigate = useNavigate();

//   // Lists Data
//   const [countries, setCountries] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [cars, setCars] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedCar, setSelectedCar] = useState("");

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedFromCity, setSelectedFromCity] = useState("");
//   const [selectedToCity, setSelectedToCity] = useState("");

//   // Main filters state
//   const today = new Date().toISOString().split("T")[0];

//   const [travelDate, setTravelDate] = useState(today);
//   const [roundDate, setRoundDate] = useState("");
//   const [travelers, setTravelers] = useState(1);
//   const [tripType, setTripType] = useState("");

//   const minRoundDate = travelDate
//     ? new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + 1)).toISOString().split("T")[0]
//     : today;

//   // Main route type and filter mode
//   const [routeType, setRouteType] = useState("all");
//   const [filterMode, setFilterMode] = useState("general");
//   const [activeTab, setActiveTab] = useState("all");

//   // Private mode extra fields
//   const [addressFrom, setAddressFrom] = useState("");
//   const [addressTo, setAddressTo] = useState("");

//   const [mapLocationFrom, setMapLocationFrom] = useState([26.8206, 30.8025]); // Default: Egypt's center
//   const [mapLocationTo, setMapLocationTo] = useState([26.8206, 30.8025]); // Default: Egypt's center
//   const [showMapFrom, setShowMapFrom] = useState(false); // To toggle "From" map modal
//   const [showMapTo, setShowMapTo] = useState(false); // To toggle "To" map modal

//   useEffect(() => {
//     refetchBookingList();
//   }, [refetchBookingList]);

//   useEffect(() => {
//     if (bookingListData && bookingListData.countries && bookingListData.cities) {
//       setCountries(bookingListData.countries);
//       setCities(bookingListData.cities);
//       setCars(bookingListData.car_category);
//     }
//   }, [bookingListData]);

//   // Instead of auto-closing on click, we only update the marker:
//   const handleMapClickFrom = (e) => {
//     const { lat, lng } = e.latlng;
//     setMapLocationFrom([lat, lng]);
//   };

//   const handleMapClickTo = (e) => {
//     const { lat, lng } = e.latlng;
//     setMapLocationTo([lat, lng]);
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//     // Optionally, navigate or perform other actions after closing the modal
//   };

//   useEffect(() => {
//     if (response && !loadingPost) {
//       console.log('Response:', response.data);
//       console.log('service:', activeTab);
//       navigate('/trips', {
//         state: {
//           trips: response.data, service: activeTab, searchData: {  // Add the form data you want to pass
//             from: selectedFromCity,
//             to: selectedToCity,
//             date: travelDate,
//             roundDate: roundDate,
//             travelers: travelers,
//             tripType: roundDate ? "round_trip" : "one_way"
//           }
//         }
//       });
//     }
//   }, [response]);

//   useEffect(() => {
//     if (responsePrivate && !loadingPrivate) {
//       setModalVisible(true)
//     }
//   }, [responsePrivate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedFromCity) {
//       auth.toastError("Please Select Departure From");
//       return;
//     } if (!selectedToCity) {
//       auth.toastError("Please Select Arrival To");
//       return;
//     }
//     const formData = {
//       // from: selectedFromCity,
//       // to: selectedToCity,
//       date: travelDate,
//       traveler: travelers,
//     };

//     if (filterMode === "general") {
//       if (roundDate) {
//         formData.round_date = roundDate;
//         formData.type = "round_trip";
//       } else {
//         formData.type = "one_way";
//       }
//       formData.from = selectedFromCity;
//       formData.to = selectedToCity;
//       postGeneral(formData);
//     }
//     else if (filterMode === "private") {
//       if (!auth.user) {
//         auth.toastError('You must be logged in to continue.');
//         navigate('/auth/login', { replace: true });
//         return;
//       }
//       formData.country_id = selectedCountry;
//       formData.city_id = selectedToCity;
//       formData.address = addressTo;
//       formData.from_address = addressFrom;
//       formData.map = `https://www.google.com/maps?q=${mapLocationTo[0].toFixed(4)},${mapLocationTo[1].toFixed(4)}`; // Google Maps link for "To"
//       formData.category_id = selectedCar;
//       formData.from_city_id = selectedFromCity;
//       formData.from_map = `https://www.google.com/maps?q=${mapLocationFrom[0].toFixed(4)},${mapLocationFrom[1].toFixed(4)}`; // Google Maps link for "From"

//       postPrivate(formData);
//     }
//   };

//   return (
//     <div className="relative w-full h-screen lg:mb-10 xl:mb-5 mb-20">
//       {/* Top Section: Background Image with Overlapping Search Box */}
//       <div className="relative">
//         <img
//           src={backgroundImage}
//           alt="background"
//           className="w-full object-cover"
//         />
//         {/* Overlapping Container starts at the bottom of the image */}
//         <div className="absolute bottom-0 left-5 right-5 transform translate-y-1/2">
//           <div className="bg-white shadow-xl rounded-lg p-4">
//             {/* Secondary Filter Mode Tabs */}
//             <div className="flex mb-4">
//               <button
//                 onClick={() => setFilterMode("general")}
//                 className={`px-4 py-2 font-semibold ${filterMode === "general" ? "bg-mainColor text-white" : "bg-gray-200 text-black"}`}
//               >
//                 Request
//               </button>
//               <button
//                 onClick={() => setFilterMode("private")}
//                 className={`px-4 py-2 font-semibold ml-2 ${filterMode === "private" ? "bg-mainColor text-white" : "bg-gray-200 text-black"}`}
//               >
//                 Private Request
//               </button>
//             </div>
//             {/* Main Tabs: All, Hivace, Trains, Bus */}
//             {
//               filterMode === "general" &&
//               <div className="w-full md:w-2/4 mx-auto bg-white rounded-t-md border-b border-fifthColor">
//                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                   <TabsList className="grid grid-cols-4 w-full p-0 text-black bg-white">
//                     <TabsTrigger value="all" className="w-full text-lg data-[state=active]:bg-mainColor data-[state=active]:text-white">
//                       All
//                     </TabsTrigger>
//                     <TabsTrigger value="hiace" className="w-full text-lg data-[state=active]:bg-mainColor data-[state=active]:text-white">
//                       Mini Van
//                     </TabsTrigger>
//                     <TabsTrigger value="train" className="w-full text-lg data-[state=active]:bg-mainColor data-[state=active]:text-white">
//                       Trains
//                     </TabsTrigger>
//                     <TabsTrigger value="bus" className="w-full text-lg data-[state=active]:bg-mainColor data-[state=active]:text-white">
//                       Bus
//                     </TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="all" />
//                   <TabsContent value="hivace" />
//                   <TabsContent value="trains" />
//                   <TabsContent value="bus" />
//                 </Tabs>
//               </div>
//             }

//             {/* Form Section */}
//             <div className="w-full md:p-4 p-2">
//               <form onSubmit={handleSubmit}>
//                 <div className={`grid grid-cols-2 lg:grid-cols-3 ${filterMode === "general" ? 'xl:grid-cols-5' : 'xl:grid-cols-5'} gap-2`}>
//                   {/* Conditional Fields Based on Filter Mode */}
//                   {filterMode === "private" && (
//                     <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                       <label className="text-sm font-semibold mb-1">Country</label>
//                       <Select defaultValue={selectedCountry} onValueChange={setSelectedCountry}>
//                         <SelectTrigger className="border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
//                           <SelectValue placeholder="Select Country" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {countries.map((Country) => (
//                             <SelectItem key={Country.id} value={String(Country.id)}>
//                               {Country.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   )}

//                   <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                     <label className="text-sm font-semibold mb-1">Departure From</label>
//                     <Select defaultValue={selectedFromCity} onValueChange={setSelectedFromCity} className="w-full">
//                       <SelectTrigger className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
//                         <SelectValue placeholder="Select City" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {cities.map((city) => (
//                           <SelectItem key={city.id} value={String(city.id)}>
//                             {city.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                     <label className="text-sm font-semibold mb-1">Arrival To</label>
//                     <Select defaultValue={selectedToCity} onValueChange={setSelectedToCity} className="w-full">
//                       <SelectTrigger className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
//                         <SelectValue placeholder="Select City" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {cities.map((city) => (
//                           <SelectItem key={city.id} value={String(city.id)}>
//                             {city.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Travel Date */}
//                   <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                     <label className="text-sm font-semibold mb-1">Travel Date</label>
//                     <Input
//                       type="date"
//                       value={travelDate}
//                       min={today}
//                       max={roundDate || ""}
//                       onChange={(e) => setTravelDate(e.target.value)}
//                       className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
//                     />
//                   </div>

//                   {/* Round Date */}
//                   {filterMode === "general" && (
//                     <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                       <label className="text-sm font-semibold mb-1">Return Date</label>
//                       <Input
//                         type="date"
//                         value={roundDate}
//                         min={minRoundDate}
//                         onChange={(e) => setRoundDate(e.target.value)}
//                         className="w-full border-b border-secoundColor px-3 py-2 text-black focus-visible:ring-0 focus-visible:border-secoundColor"
//                       />
//                     </div>
//                   )}

//                   {/* Number of Travelers */}
//                   <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                     <label className="text-sm font-semibold mb-1">Number of Travelers</label>
//                     <Input
//                       type="number"
//                       min="1"
//                       value={travelers}
//                       onChange={(e) => setTravelers(e.target.value)}
//                       className="w-full border-b border-secoundColor px-3 py-2 text-black focus-visible:ring-0 focus-visible:border-secoundColor"
//                     />
//                   </div>

//                   {filterMode === "private" && (
//                     <>
//                       <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                         <label className="text-sm font-semibold mb-1">Car Category</label>
//                         <Select onValueChange={setSelectedCar}>
//                           <SelectTrigger className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
//                             <SelectValue placeholder="Select Car Category" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {cars.map((car) => (
//                               <SelectItem key={car.id} value={String(car.id)}>
//                                 {car.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                         <label className="text-sm font-semibold mb-1">Address From</label>
//                         <Input
//                           type="text"
//                           value={addressFrom}
//                           onChange={(e) => setAddressFrom(e.target.value)}
//                           required
//                           placeholder="Enter address here"
//                           className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
//                         />
//                       </div>

//                       <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                         <label className="text-sm font-semibold mb-1">Address To</label>
//                         <Input
//                           type="text"
//                           value={addressTo}
//                           onChange={(e) => setAddressTo(e.target.value)}
//                           required
//                           placeholder="Enter address here"
//                           className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
//                         />
//                       </div>

//                       {/* --- From Location Input --- */}
//                       <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
//                         <label className="text-sm font-semibold mb-1">PickUp Location (From)</label>
//                         <Input
//                           type="text"
//                           value={
//                             mapLocationFrom[0] !== 0 && mapLocationFrom[1] !== 0
//                               ? `https://www.google.com/maps?q=${mapLocationFrom[0].toFixed(4)},${mapLocationFrom[1].toFixed(4)}`
//                               : ""
//                           }
//                           placeholder="Click to select on map"
//                           onFocus={() => setShowMapFrom(true)}
//                           readOnly
//                           className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
//                         />
//                       </div>

//                       {/* --- To Location Input --- */}
//                       <div className="flex flex-col bg-fifthColor p-2 rounded-lg ">
//                         <label className="text-sm font-semibold mb-1">Drop Location (To)</label>
//                         <Input
//                           type="text"
//                           value={
//                             mapLocationTo[0] !== 0 && mapLocationTo[1] !== 0
//                               ? `https://www.google.com/maps?q=${mapLocationTo[0].toFixed(4)},${mapLocationTo[1].toFixed(4)}`
//                               : ""
//                           }
//                           placeholder="Click to select on map"
//                           onFocus={() => setShowMapTo(true)}
//                           readOnly
//                           className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
//                         />
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* Search Button */}
//                 <div className="w-full flex flex-col justify-center items-center mt-4">
//                   <Button
//                     type='submit'
//                     className="bg-orange-500 text-xl hover:bg-orange-600 text-white font-semibold px-6 py-4 rounded-lg"
//                   >
//                     {filterMode === "general" ? "Search" : "Request"}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- Modal for "From" Location --- */}
//       {showMapFrom && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-[90%] h-[60vh] flex flex-col">
//             {/* Header */}
//             <div className="flex justify-between items-center px-4 py-3 border-b">
//               <h3 className="text-lg font-semibold">Select PickUp Location</h3>
//             </div>
//             {/* Map Container */}
//             <div className="flex-grow relative">
//               <MapContainer
//                 center={mapLocationFrom}
//                 zoom={6}
//                 className="w-full h-full"
//               >
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={mapLocationFrom} />
//                 <MapClickHandler onMapClick={handleMapClickFrom} />
//               </MapContainer>
//             </div>
//             {/* Footer */}
//             <div className="px-4 py-3 border-t flex justify-end">
//               <button
//                 onClick={() => setShowMapFrom(false)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- Modal for "To" Location --- */}
//       {showMapTo && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-[90%] h-[60vh] flex flex-col">
//             {/* Header */}
//             <div className="flex justify-between items-center px-4 py-3 border-b">
//               <h3 className="text-lg font-semibold">Select Drop Location</h3>
//             </div>
//             {/* Map Container */}
//             <div className="flex-grow relative">
//               <MapContainer
//                 center={mapLocationTo}
//                 zoom={6}
//                 className="w-full h-full"
//               >
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={mapLocationTo} />
//                 <MapClickHandler onMapClick={handleMapClickTo} />
//               </MapContainer>
//             </div>
//             {/* Footer */}
//             <div className="px-4 py-3 border-t flex justify-end">
//               <button
//                 onClick={() => setShowMapTo(false)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {modalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
//           <div className="relative bg-white rounded-xl p-8 shadow-2xl max-w-md w-full text-center">
//             {/* Close Button */}
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-2 right-2 btn btn-sm btn-ghost"
//             >
//               ✕
//             </button>
//             {/* Success Icon */}
//             <div className="mb-4">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="mx-auto h-12 w-12 text-mainColor"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-mainColor mb-4">
//               Request Submitted
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Your request is under review. We will contact you soon!
//             </p>
//             <div className='w-full flex justify-center items-center'>
//               <button
//                 onClick={handleCloseModal}
//                 className="btn btn-primary px-4 py-2 rounded-lg bg-mainColor hover:bg-secoundColor text-white"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default TravelBooking;



import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, Car, Globe, Map as MapIcon, X, Navigation, Plus, Minus, ArrowLeftRight, ChevronDown } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Select from 'react-select';

import backgroundImage from "../../Assets/Images/backgroundImage.png";
import { usePost } from '../../Hooks/usePostJson';
import { useGet } from '../../Hooks/useGet';
import { useAuth } from '../../Context/Auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button';

const MapClickHandler = ({ onMapClick }) => {
  useMapEvent("click", onMapClick);
  return null;
};

const TravelBooking = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dateInputRef = useRef(null);
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

  // Travelers Detailed State (Like the Image)
  const [passengerCounts, setPassengerCounts] = useState({
    adult: 2,
    child: 0,
    senior: 0
  });

  const totalTravelers = passengerCounts.adult + passengerCounts.child + passengerCounts.senior;

  const [selectedFromCity, setSelectedFromCity] = useState(null);
  const [selectedToCity, setSelectedToCity] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split("T")[0]);
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

  const selectStyles = {
    control: (base) => ({
      ...base, border: 'none', boxShadow: 'none', background: 'transparent',
      fontWeight: '700', minHeight: '35px', cursor: 'pointer',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: base => ({ ...base, borderRadius: '15px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }),
    placeholder: (base) => ({ ...base, color: '#94a3b8', fontSize: '14px' })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = filterMode === "general" ?
      { date: travelDate, traveler: totalTravelers, type: "one_way", from: selectedFromCity?.value, to: selectedToCity?.value } :
      { date: travelDate, traveler: totalTravelers, country_id: selectedCountry?.value, city_id: selectedToCity?.value, from_city_id: selectedFromCity?.value, address: addressTo, from_address: addressFrom, category_id: selectedCar?.value };
    filterMode === "general" ? postGeneral(data) : postPrivate(data);
  };

  return (
    <div className="relative min-h-screen bg-[#FDFDFD]">
      <div className="relative h-[550px] flex items-center justify-center overflow-hidden">
        <img src={backgroundImage} alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 text-center mb-24 px-4">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">Ready to explore?</h1>
          <p className="text-lg md:text-xl font-bold text-slate-700 opacity-90">Book your next journey instantly</p>
        </div>
      </div>

      <div className="relative -mt-40 z-30 max-w-7xl mx-auto px-4">
        {/* TABS */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-3 px-6">
          <div className="flex bg-white/90 backdrop-blur-md p-1.5 rounded-t-[20px] border-t border-x border-slate-100 shadow-sm">
            {['all', 'hiace', 'train', 'bus'].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === t ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-orange-500'}`}>
                {t === 'hiace' ? 'Mini Van' : t}
              </button>
            ))}
          </div>
          <div className="flex bg-slate-100/80 backdrop-blur p-1 rounded-t-[20px]">
            <button onClick={() => setFilterMode("general")} className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase ${filterMode === 'general' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Standard</button>
            <button onClick={() => setFilterMode("private")} className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase ${filterMode === 'private' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400'}`}>Private Request</button>
          </div>
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-50">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center lg:divide-x divide-slate-100 p-3">

              {filterMode === "private" && (
                <div className="flex-1 px-4 py-3 group hover:bg-slate-50 transition-colors">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mb-1"><Globe size={13} className="text-orange-500" /> Country</label>
                  <Select options={countries} value={selectedCountry} onChange={setSelectedCountry} placeholder="Select..." styles={selectStyles} menuPortalTarget={document.body} />
                </div>
              )}

              <div className="flex-[1.5] px-4 py-3 group hover:bg-slate-50 transition-colors flex items-center gap-2">
                <div className="flex-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mb-1"><MapPin size={13} className="text-orange-500" /> From</label>
                  <Select options={cities} value={selectedFromCity} onChange={setSelectedFromCity} placeholder="City, Place..." styles={selectStyles} menuPortalTarget={document.body} />
                </div>
                <button type="button" onClick={handleSwitchCities} className="mt-4 p-2 bg-slate-50 rounded-full hover:bg-orange-50 transition-all text-slate-400"><ArrowLeftRight size={16} /></button>
              </div>

              <div className="flex-[1.5] px-4 py-3 group hover:bg-slate-50 transition-colors">
                <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mb-1"><Navigation size={13} className="text-orange-500" /> To</label>
                <Select options={cities} value={selectedToCity} onChange={setSelectedToCity} placeholder="City, Place..." styles={selectStyles} menuPortalTarget={document.body} />
              </div>

              <div className="flex-1 px-4 py-3 group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => dateInputRef.current?.showPicker()}>
                <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mb-1"><Calendar size={13} className="text-orange-500" /> Date</label>
                <input ref={dateInputRef} type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full border-none p-0 text-sm font-bold bg-transparent focus:ring-0 outline-none cursor-pointer" />
              </div>

              {/* TRAVELERS DESIGN - MATCHING THE IMAGE */}
              <div className="flex-1 px-4 py-3 group hover:bg-slate-50 transition-colors relative" ref={travelerMenuRef}>
                <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mb-1"><Users size={13} className="text-orange-500" /> Travelers</label>
                <div onClick={() => setShowTravelerMenu(!showTravelerMenu)} className="text-sm font-bold text-slate-800 cursor-pointer flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  <span>{totalTravelers}</span>
                  <ChevronDown size={14} className={`ml-auto transition-transform ${showTravelerMenu ? 'rotate-180' : ''}`} />
                </div>

                {showTravelerMenu && (
                  <div className="absolute top-[100%] right-0 lg:left-0 mt-4 w-72 bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-50 p-6 z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-6">
                      {/* Adult */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Adult</p>
                          <p className="text-[10px] text-slate-400 font-medium">18-59</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => updateCount('adult', 'dec')} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-orange-500 hover:bg-orange-50"><Minus size={14} /></button>
                          <span className="font-bold text-slate-800 w-4 text-center">{passengerCounts.adult}</span>
                          <button type="button" onClick={() => updateCount('adult', 'inc')} className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600"><Plus size={14} /></button>
                        </div>
                      </div>
                      {/* Child */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Child</p>
                          <p className="text-[10px] text-slate-400 font-medium">0-17</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => updateCount('child', 'dec')} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-orange-500 hover:bg-orange-50"><Minus size={14} /></button>
                          <span className="font-bold text-slate-800 w-4 text-center">{passengerCounts.child}</span>
                          <button type="button" onClick={() => updateCount('child', 'inc')} className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600"><Plus size={14} /></button>
                        </div>
                      </div>
                      {/* Senior */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Senior</p>
                          <p className="text-[10px] text-slate-400 font-medium">60+</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => updateCount('senior', 'dec')} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-orange-500 hover:bg-orange-50"><Minus size={14} /></button>
                          <span className="font-bold text-slate-800 w-4 text-center">{passengerCounts.senior}</span>
                          <button type="button" onClick={() => updateCount('senior', 'inc')} className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600"><Plus size={14} /></button>
                        </div>
                      </div>

                      <Button type="button" onClick={() => setShowTravelerMenu(false)} className="w-full bg-slate-900 hover:bg-black text-white rounded-full py-6 font-bold mt-2">
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {filterMode === "general" && (
                <div className="p-2">
                  <Button type="submit" className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 h-[64px] px-12 rounded-full text-base font-black transition-all shadow-xl shadow-orange-100">Find tickets</Button>
                </div>
              )}
            </div>

            {/* PRIVATE ROW */}
            {filterMode === "private" && (
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center border-t border-slate-50 lg:divide-x divide-slate-100 p-3 bg-slate-50/40 rounded-b-[40px]">
                <div className="flex-1 px-4 py-3">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mb-1"><Car size={13} className="text-orange-500" /> Car Type</label>
                  <Select options={cars} value={selectedCar} onChange={setSelectedCar} placeholder="Select..." styles={selectStyles} menuPortalTarget={document.body} />
                </div>
                <div className="flex-1 px-4 py-3">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mb-1"><MapIcon size={13} className="text-orange-500" /> Locations</label>
                  <div className="flex gap-4 text-[11px] font-black text-blue-600">
                    <button type="button" onClick={() => setShowMapFrom(true)} className="hover:underline">PICKUP</button>
                    <button type="button" onClick={() => setShowMapTo(true)} className="hover:underline">DESTINATION</button>
                  </div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Address From</label>
                  <input value={addressFrom} onChange={(e) => setAddressFrom(e.target.value)} placeholder="Hotel/Street" className="w-full border-none p-0 text-[13px] font-bold bg-transparent focus:ring-0 outline-none" />
                </div>
                <div className="flex-1 px-4 py-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Address To</label>
                  <input value={addressTo} onChange={(e) => setAddressTo(e.target.value)} placeholder="Drop-off point" className="w-full border-none p-0 text-[13px] font-bold bg-transparent focus:ring-0 outline-none" />
                </div>
                <div className="p-2">
                  <Button type="submit" className="w-full lg:w-auto bg-slate-900 hover:bg-black h-[58px] px-10 rounded-[22px] text-xs font-black uppercase tracking-[2px] shadow-xl">Send Request</Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* MAP MODALS */}
      {(showMapFrom || showMapTo) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[1000] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl h-[70vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <span className="font-black text-slate-800 uppercase text-xs">Pin Location</span>
              <button onClick={() => { setShowMapFrom(false); setShowMapTo(false) }} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-grow">
              <MapContainer center={showMapFrom ? mapLocationFrom : mapLocationTo} zoom={13} className="w-full h-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={showMapFrom ? mapLocationFrom : mapLocationTo} />
                <MapClickHandler onMapClick={(e) => {
                  const loc = [e.latlng.lat, e.latlng.lng];
                  showMapFrom ? setMapLocationFrom(loc) : setMapLocationTo(loc);
                }} />
              </MapContainer>
            </div>
            <div className="p-6 bg-white border-t flex justify-end">
              <Button onClick={() => { setShowMapFrom(false); setShowMapTo(false) }} className="bg-orange-500 rounded-full px-12 h-14 font-black">Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelBooking;
