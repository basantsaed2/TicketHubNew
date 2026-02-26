import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaClock, FaChair, FaMoneyBillAlt, FaBus, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineCancel, MdEvent, MdDirectionsBus } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { BsCalendarDate, BsCashCoin } from "react-icons/bs";

// Utility functions remain the same
const getDuration = (start, end) => {
  if (!start || !end) return "N/A";
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  let startMinutes = h1 * 60 + m1;
  let endMinutes = h2 * 60 + m2;
  if (endMinutes < startMinutes) endMinutes += 24 * 60;
  const total = endMinutes - startMinutes;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
};

const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const TripDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const trip = state.trip;
  console.log("trip",trip)

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen text-gray-800">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header with bus image - Stack on mobile, row on larger screens */}
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 mb-8 sm:mb-10">
          {trip.bus?.image_link && (
            <div className="w-full md:w-1/3 rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg">
              <img
                src={trip.bus.image_link}
                alt="Trip"
                className="w-full h-48 sm:h-56 md:h-64 object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                <MdDirectionsBus className="text-orange-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-medium text-gray-500">{trip.trip_type} Trip</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
                  {trip.trip_name}
                </h1>
                <p className="text-orange-600 font-medium text-sm sm:text-base">
                  {trip.trip_type} #{trip.bus?.bus_number}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
              <InfoBlock
                label="Departure Date"
                value={formatDate(trip.date)}
                icon={<BsCalendarDate />}
              />
              <InfoBlock
                label="Capacity"
                value={`${trip.avalible_seats} Avalible seats`}
                icon={<FaChair />}
              />
              <InfoBlock
                label="Ticket Price"
                value={`${trip.price} ${trip.currency?.symbol}`}
                icon={<BsCashCoin />}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Route Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500 text-sm sm:text-base" />
                Route Details
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                <StationCard
                  type="departure"
                  city={trip.city.name}
                  station={trip.pickup_station}
                  time={trip.deputre_time}
                />

                <div className="flex flex-col items-center my-2 sm:my-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <FaBus className="text-orange-500 text-lg sm:text-xl" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 sm:mt-2">
                    {getDuration(trip.deputre_time, trip.arrival_time)}
                  </div>
                </div>

                <StationCard
                  type="arrival"
                  city={trip.to_city.name}
                  station={trip.dropoff_station}
                  time={trip.arrival_time}
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          {/* <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <BsCashCoin className="text-orange-500 text-sm sm:text-base" />
                Pricing Details
              </h2>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <PriceBlock
                label="Ticket Price"
                value={`${trip.price} ${trip.currency?.symbol}`}
                highlight={false}
              />
              <PriceBlock
                label="Service Fees"
                value={`${trip.service_fees} ${trip.currency?.symbol}`}
                highlight={false}
              />
              <PriceBlock
                label="Total Price"
                value={`${trip.price + trip.service_fees} ${trip.currency?.symbol}`}
                highlight={true}
              />
            </div>
          </div> */}

          {/* Additional Info - Stack on mobile, side-by-side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Bus Amenities */}
            {trip.bus?.aminity && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Bus Amenities</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {trip.bus.aminity.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-orange-100 p-1 sm:p-2 rounded-full">
                        {amenity.image_link || <FaChair className="text-orange-500 text-sm sm:text-base" />}
                      </div>
                      <span className="text-sm sm:text-base text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <MdOutlineCancel className="text-orange-500 text-sm sm:text-base" />
                Cancellation Policy
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 sm:mt-1 text-orange-500">
                    <IoTimeOutline className="text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Cancellation Window</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {trip.cancelation_hours > 0
                        ? `Allowed up to ${trip.cancelation_hours} hours before departure`
                        : 'No cancellations allowed'}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 sm:mt-1 text-orange-500">
                    <FaMoneyBillAlt className="text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Cancellation Fee</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {trip.cancelation_pay_value > 0 ? (
                        trip.cancelation_pay_amount === "percentage" ? (
                          `${trip.cancelation_pay_value}%`
                        ) : (
                          `${trip.cancelation_pay_value} ${trip.currency?.symbol}`
                        )
                      ) : (
                        'No fee'
                      )}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 sm:mt-1 text-orange-500">
                    <MdEvent className="text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Policy Details</p>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">
                      {trip.cancellation_policy}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
            <div className="text-center sm:text-left mb-3 sm:mb-0">
              <h3 className="text-base sm:text-lg font-semibold">Ready to book your trip?</h3>
              <p className="text-xs sm:text-sm text-gray-600">Secure your seat now</p>
            </div>
            <button
              onClick={() => navigate("/checkout", { state: { trip } })}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              Continue To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Responsive reusable components
const InfoBlock = ({ label, value, icon }) => (
  <div className="flex items-center gap-2 sm:gap-3">
    <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
      {React.cloneElement(icon, { className: "text-orange-500 text-base sm:text-xl" })}
    </div>
    <div>
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className="font-medium text-sm sm:text-base text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

const StationCard = ({ type,city, station, time }) => (
  <div className={`w-full md:w-1/2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border ${type === 'departure' ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'
    }`}>
    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
      <div className={`p-1 sm:p-2 rounded-full ${type === 'departure' ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-600'
        }`}>
        <FaMapMarkerAlt className="text-sm sm:text-base" />
      </div>
      <span className="font-medium text-xs sm:text-sm text-gray-700 capitalize">{type}</span>
    </div>
    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">{station?.name} ({city})</h3>
    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
      <FaClock className="text-xs sm:text-sm" />
      <span>{time?.substring(0, 5) || "N/A"}</span>
    </div>
  </div>
);

const PriceBlock = ({ label, value, highlight }) => (
  <div className={`p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border ${highlight ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
    }`}>
    <p className="text-xs sm:text-sm text-gray-500">{label}</p>
    <p className={`text-lg sm:text-xl md:text-2xl font-bold ${highlight ? 'text-orange-600' : 'text-gray-800'
      }`}>
      {value}
    </p>
  </div>
);

export default TripDetailsPage;