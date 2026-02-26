import React, { useState, useEffect } from "react";
import { useGet } from "../../Hooks/useGet";
import StaticLoader from '../../Components/StaticLoader';

// React Icons (install with: npm install react-icons)
import { FaCalendarAlt, FaUserAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const MyTripsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch booking data (both upcoming and history) from your API
  const { refetch: refetchBookingData,loading: loadingBookingData, data: bookingData } = useGet({
    url: `${apiUrl}/user/booking/history`,
  });

  // State for storing upcoming and previous (history) trips
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [previousTrips, setPreviousTrips] = useState([]);

  // State to control which tab is active
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch data on component mount
  useEffect(() => {
    refetchBookingData();
  }, [refetchBookingData]);

  // Update state when new data arrives
  useEffect(() => {
    if (bookingData) {
      // If the data structure is { upcoming: [], history: [] }
      setUpcomingTrips(bookingData.upcoming || []);
      setPreviousTrips(bookingData.history || []);
    }
  }, [bookingData]);

  // Function to switch between tabs
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // A reusable card component for displaying trip info
  const TripCard = ({ trip }) => {
    return (
      <div className="border p-4 rounded-lg shadow bg-white">
        <h3 className="text-lg font-semibold mb-2">{trip.trip?.trip_name || "Trip"}</h3>

        {/* Travel Date */}
        <div className="flex items-center mb-2">
          <FaCalendarAlt className="mr-2 text-secoundColor" />
          <span>{trip.travel_date}</span>
        </div>

        {/* Number of Travelers */}
        <div className="flex items-center mb-2">
          <FaUserAlt className="mr-2 text-secoundColor" />
          <span>{trip.travelers} Traveler(s)</span>
        </div>

        {/* Departure & Arrival Times */}
        <div className="flex items-center mb-2">
          <FaClock className="mr-2 text-secoundColor" />
          <span>
            Depart: {trip.trip?.deputre_time} | Arrive: {trip.trip?.arrival_time}
          </span>
        </div>

        {/* City & Stations */}
        <div className="flex items-center mb-2">
          <FaMapMarkerAlt className="mr-2 text-secoundColor" />
          <span>
            From: {trip.trip?.city?.name} - {trip.trip?.pickup_station?.name}
            <br />
            To: {trip.trip?.to_city?.name} - {trip.trip?.dropoff_station?.name}
          </span>
        </div>

        <div className="flex flex-col space-y-2">
  {/* <div className="flex items-center">
    <span className="text-sm font-medium text-gray-600 mr-2">Status:</span>
    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
      {trip.status}
    </span>
  </div> */}
  <div className="flex items-center">
    <span className="text-sm font-medium text-gray-600 mr-2">Travel Status:</span>
    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
      {trip.travel_status}
    </span>
  </div>
  <div className="flex items-center">
    <span className="text-sm font-medium text-gray-600 mr-2">Total:</span>
    <span className="px-3 py-1 text-sm font-semibold rounded bg-yellow-100 text-yellow-800">
      {trip.total}
    </span>
  </div>
</div>

      </div>
    );
  };
  if (loadingBookingData) {
    return <StaticLoader />;
  }
  return (
    <div className="p-6 w-full bg-gray-100 min-h-screen">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => handleTabClick("upcoming")}
          className={`px-4 py-2 font-semibold text-xl ${
            activeTab === "upcoming"
              ? "border-b-2 border-secoundColor text-secoundColor"
              : "text-gray-500"
          }`}
        >
          UpComing
        </button>
        <button
          onClick={() => handleTabClick("previous")}
          className={`px-4 py-2 font-semibold text-xl ${
            activeTab === "previous"
              ? "border-b-2 border-secoundColor text-secoundColor"
              : "text-gray-500"
          }`}
        >
          Previous
        </button>
      </div>

      {/* Upcoming Trips Tab */}
      {activeTab === "upcoming" && (
        <section className="mb-6">
          {upcomingTrips.length === 0 ? (
            <p className="text-gray-600">
              You currently have no upcoming trips. Why not plan your next adventure and explore new horizons?
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTrips.map((trip, index) => (
                <TripCard key={index} trip={trip} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Previous (History) Trips Tab */}
      {activeTab === "previous" && (
        <section>
          {previousTrips.length === 0 ? (
            <p className="text-gray-600">
              It appears you haven't taken any trips yet. Start your journey today and create unforgettable memories!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {previousTrips.map((trip, index) => (
                <TripCard key={index} trip={trip} />
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
};

export default MyTripsPage;
