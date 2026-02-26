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
import { BookingSearchForm, MapModal } from '../../Components/Component';

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
      setCities(bookingListData.cities?.map(c => ({ value: String(c.id), label: c.name })) || []);
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

      <div className="relative h-[550px] flex items-center justify-center overflow-hidden">
        <img src={backgroundImage} alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 text-center mb-24 px-4">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">Ready to explore?</h1>
          <p className="text-lg md:text-xl font-bold text-slate-700 opacity-90">Book your next journey instantly</p>
        </div>
      </div>

      <div className="relative -mt-60 z-30 w-full px-4 lg:px-8 xl:px-12">
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