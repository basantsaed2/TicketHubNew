import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { usePost } from "../../Hooks/usePostJson";
import { useGet } from "../../Hooks/useGet";
import { FaWallet, FaCreditCard, FaPaypal, FaChair, FaUserAlt, FaBus, FaCheckCircle } from "react-icons/fa";
import { IoMdClose, IoIosArrowForward } from "react-icons/io";
import { useAuth } from '../../Context/Auth';

const SeatSelection = ({ trip, travelers, onSeatsSelected, selectedSeats }) => {
  const isSeatAvailable = (seatNumber) => {
    return trip.bus?.new_areas?.[seatNumber] === false;
  };

  const toggleSeatSelection = (seatNumber) => {
    if (!isSeatAvailable(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      onSeatsSelected(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < travelers) {
      onSeatsSelected([...selectedSeats, seatNumber]);
    }
  };

  const renderHiaceLayout = () => {
    const seatLayout = [
      // Row 0: Driver + seat 1
      [
        { type: 'driver' },
        null,
        { number: 1 },
        null,
      ],
      // Row 1: 2, 3, 4
      [
        { number: 2 },
        { number: 3 },
        { number: 4 },
        null,

      ],
      // Row 2: 5, 6 (left), 7 (right)
      [
        { number: 5 },
        { number: 6 },
        null,
        { number: 7 }
      ],
      // Row 3: 8, 9 (left), 10 (right)
      [
        { number: 8 },
        { number: 9 },
        null,
        { number: 10 }
      ],
      // Row 4: 11, 12, 13, 14
      [
        { number: 11 },
        { number: 12 },
        { number: 13 },
        { number: 14 }
      ]
    ];

    return (
      <div className="relative bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 className="text-center mb-4 font-medium text-gray-700">Select An Available Seat</h3>

        <div className="flex flex-col gap-4">
          {seatLayout.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center gap-4">
              {row.map((seat, seatIndex) => {
                if (!seat) {
                  return <div key={`empty-${seatIndex}`} className="w-12 h-12" />;
                }

                if (seat.type === 'driver') {
                  return (
                    <div key="driver" className="w-12 h-12 flex items-center justify-center bg-black text-white rounded">
                      D
                    </div>
                  );
                }

                const seatNumber = seat.number;
                const isAvailable = isSeatAvailable(seatNumber);
                const isSelected = selectedSeats.includes(seatNumber);

                return (
                  <button
                    key={`seat-${seatNumber}`}
                    type="button"
                    onClick={() => toggleSeatSelection(seatNumber)}
                    disabled={!isAvailable}
                    className={`w-12 h-12 flex items-center justify-center rounded-md border-2 relative transition-all
                      ${isSelected ? 'bg-orange-500 border-orange-600 text-white shadow-md' :
                        isAvailable ? 'bg-white border-gray-300 hover:border-orange-400' :
                          'bg-gray-200 border-gray-300 cursor-not-allowed'}`}
                  >
                    {isAvailable ? (
                      <>
                        <span className="font-medium">{seatNumber}</span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </>
                    ) : (
                      <IoMdClose className="text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBusLayout = () => {
    const seatRows = [];
    let seatNumber = 1;

    // First row with driver seat
    seatRows.push([
      { type: 'driver' },
      null,
      null,
      null,
      null
    ]);

    // Middle rows: seats 3 to 44 (4 per row with a null between seat 2 and 3 visually)
    while (seatNumber <= 44) {
      const row = [];

      // Left seats
      for (let i = 0; i < 2 && seatNumber <= 44; i++) {
        row.push({ number: seatNumber++ });
      }

      // Add space between left and right
      row.push(null);

      // Right seats
      for (let i = 0; i < 2 && seatNumber <= 44; i++) {
        row.push({ number: seatNumber++ });
      }

      seatRows.push(row);
    }

    // Last row: 5 special seats (45 to 49) with bottom driver seat
    const lastRow = [
      { number: seatNumber++ },
      { number: seatNumber++ },
      { number: seatNumber++ },
      { number: seatNumber++ },
      { number: seatNumber++ },
    ];
    seatRows.push(lastRow);

    return (
      <div className="relative bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 className="text-center mb-4 font-medium text-gray-700">Select An Available Seat</h3>

        <div className="flex flex-col gap-4">
          {seatRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center gap-4">
              {row.map((seat, seatIndex) => {
                if (!seat) {
                  return <div key={`empty-${rowIndex}-${seatIndex}`} className="w-12 h-12" />;
                }

                if (seat.type === 'driver') {
                  return (
                    <div
                      key={`driver-${rowIndex}-${seatIndex}`}
                      className="w-12 h-12 flex items-center justify-center bg-black text-white rounded font-bold"
                    >
                      D
                    </div>
                  );
                }

                const seatNumber = seat.number;
                const isAvailable = isSeatAvailable(seatNumber);
                const isSelected = selectedSeats.includes(seatNumber);

                return (
                  <button
                    key={`seat-${seatNumber}`}
                    type="button"
                    onClick={() => toggleSeatSelection(seatNumber)}
                    disabled={!isAvailable}
                    className={`w-12 h-12 flex items-center justify-center rounded-md border-2 relative transition-all
                    ${isSelected
                        ? 'bg-orange-500 border-orange-600 text-white shadow-md'
                        : isAvailable
                          ? 'bg-white border-gray-300 hover:border-orange-400'
                          : 'bg-gray-200 border-gray-300 cursor-not-allowed'
                      }`}
                  >
                    {isAvailable ? (
                      <>
                        <span className="font-medium">{seatNumber}</span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </>
                    ) : (
                      <IoMdClose className="text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h2 className="text-xl font-bold text-gray-800">Select Your Seats</h2>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium">
          {selectedSeats.length} of {travelers} selected
        </div>
      </div>


      {
        trip.trip_type === "MiniVan" &&
        renderHiaceLayout()
      }
      {
        trip.trip_type === "bus" &&
        renderBusLayout()
      }

      <div className="flex flex-wrap justify-center gap-8 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-500 rounded-sm shadow"></div>
          <span className="text-gray-700 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-sm"></div>
          <span className="text-gray-700 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 border-2 border-gray-300 rounded-sm"></div>
          <span className="text-gray-700 font-medium">Unavailable</span>
        </div>
      </div>
    </div>
  );
};
const TravelerInfoCard = ({ index, traveler, onChange, seatNumber }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Traveler {index + 1}</h3>
        {seatNumber && (
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <FaChair className="mr-1" /> Seat {seatNumber}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
          <Input
            type="text"
            value={traveler.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            className="w-full border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">Age</label>
          <Input
            type="number"
            value={traveler.age}
            onChange={(e) => onChange(index, "age", e.target.value)}
            min="1"
            max="120"
            className="w-full border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter age"
            required
          />
        </div>
      </div>
    </div>
  );
};



const PaymentMethodCard = ({ method, selected, onChange, receiptImage, onReceiptChange }) => {
  return (
    <div
      onClick={() => onChange(method.id)}
      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${selected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
        }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${selected ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"}`}>
          {method.icon || <FaCreditCard className="text-xl" />}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{method.name}</h3>
          {method.id === "wallet" && (
            <p className="text-sm text-gray-500">Balance: {method.balance || 0}</p>
          )}
        </div>
        <div className="ml-auto">
          <IoIosArrowForward className={`text-xl ${selected ? "text-orange-500" : "text-gray-400"}`} />
        </div>
      </div>

      {method.name && String(method.name).toLowerCase().includes('vodafone') && (
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-3">Receipt Image (Required for Vodafone Cash)</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition">
                <span className="text-gray-600">Click to upload payment receipt</span>
                <input
                  type="file"
                  onChange={onReceiptChange}
                  className="hidden"
                  accept="image/*"
                  required
                />
              </div>
            </label>
            {receiptImage && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">{receiptImage.name}</span>
                <FaCheckCircle className="text-green-500" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">Please upload a clear image of your Vodafone Cash payment receipt</p>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { trip } = state || {};
  console.log("Trip", trip)
  const auth = useAuth();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData: postPayment, loadingPost: loadingBookWallet, response: responseBookWallet } = usePost({ url: `${apiUrl}/user/booking/payment` });
  const { postData: postPaymentWallet, loadingPost, response } = usePost({ url: `${apiUrl}/user/booking/payment_wallet` });
  const { refetch: refetchBookingList, data: bookingListData } = useGet({ url: `${apiUrl}/user/booking/lists` });

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [travelDate] = useState(trip ? trip.date : "");
  // const [receiptImage, setReceiptImage] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [travelerDetails, setTravelerDetails] = useState([{ name: "", age: "" }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [receiptImage, setReceiptImage] = useState(null);

  const handleReceiptChange = (e) => {
    setReceiptImage(e.target.files[0]);
  };

  useEffect(() => {
    refetchBookingList();
  }, [refetchBookingList]);

  useEffect(() => {
    if (bookingListData?.payment_methods) {
      const methods = bookingListData.payment_methods.map(m => ({
        ...m,
        icon: <FaCreditCard className="text-mainColor" />
      }));

      if (!methods.find(m => m.id === "wallet")) {
        methods.unshift({
          id: "wallet",
          name: "Wallet",
          image: "https://via.placeholder.com/50?text=Wallet",
          icon: <FaWallet className="text-mainColor" />,
          balance: auth.user?.wallet_balance
        });
      }

      setPaymentMethods(methods);
      setSelectedPaymentMethod(methods[0]?.id || "");
    }
  }, [bookingListData]);

  useEffect(() => {
    if ((response && !loadingPost) || (responseBookWallet && !loadingBookWallet)) {
      console.log("response", response)
      if (responseBookWallet.data && responseBookWallet.data?.paymentLink) {
        window.open(responseBookWallet.data?.paymentLink, '_blank');
      } else {
        setModalVisible(true);
      }
    }
  }, [response, loadingPost, responseBookWallet, loadingBookWallet]);

  const handleTravelersChange = (e) => {
    const newTravelers = Math.min(Math.max(parseInt(e.target.value) || 1, 1), trip.avalible_seats);
    setTravelers(newTravelers);

    // Reset traveler details
    setTravelerDetails(Array.from({ length: newTravelers }, (_, i) => ({
      name: travelerDetails[i]?.name || "",
      age: travelerDetails[i]?.age || "",
    })));

    // Remove excess seats if decreasing travelers
    if (newTravelers < selectedSeats.length) {
      setSelectedSeats(selectedSeats.slice(0, newTravelers));
    }
  };

  const handleTravelerChange = (index, field, value) => {
    const updated = [...travelerDetails];
    updated[index][field] = value;
    setTravelerDetails(updated);
  };


  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Convert selectedSeats to array if it isn't already
    const seatsArray = Array.isArray(selectedSeats) ? selectedSeats :
      typeof selectedSeats === 'string' ? selectedSeats.split(',').map(Number) :
        [];

    // Validate seat count matches travelers
    if (seatsArray.length !== travelers) {
      auth.toastError(`Please select exactly ${travelers} seat(s)`);
      return;
    }

    const formData = new FormData();
    formData.append("trip_id", trip.id);
    formData.append("travelers", travelers);
    formData.append("amount", trip.price * travelers);
    formData.append("travel_date", travelDate);

    // Append each seat individually with index
    seatsArray.forEach((seat, index) => {
      formData.append(`seats[${index}]`, seat);
    });

    // Append traveler details (your existing code)
    travelerDetails.forEach((traveler, index) => {
      formData.append(`travellers_data[${index}][name]`, traveler.name);
      formData.append(`travellers_data[${index}][age]`, traveler.age);
    });

    if (receiptImage) {
      formData.append("receipt_image", receiptImage);
    }

    if (selectedPaymentMethod === "wallet") {
      await postPaymentWallet(formData, "Payment submitted successfully!");
    } else {
      formData.append("payment_method_id", selectedPaymentMethod);
      await postPayment(formData, "Payment submitted successfully!");
    }
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Trip Selected</h2>
          <p className="text-gray-600 mb-6">Please go back and select a trip to continue.</p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = (trip.price * travelers) + trip.service_fees;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium">
            <FaBus className="inline mr-2" />
            {trip.trip_name}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Trip summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip summary card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-5 text-white">
                <h2 className="text-xl font-bold">Trip Details</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Route</h3>
                    <p className="text-gray-600">{trip.pickup_station?.name} → {trip.dropoff_station?.name}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {trip.trip_type === 'bus' ? 'Bus' : 'Mini Van'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Departure</h3>
                    <p className="text-gray-600">{new Date(trip.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-gray-600">{trip.deputre_time}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Arrival</h3>
                    <p className="text-gray-600">{trip.arrival_time}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Price per seat</span>
                    <span className="font-semibold">{trip.price} {trip.currency?.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-gray-700">Service fee</span>
                    <span className="font-semibold">{trip.service_fees} {trip.currency?.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <span className="font-bold text-lg text-gray-800">Total</span>
                    <span className="font-bold text-xl text-orange-600">{totalPrice.toFixed(2)} {trip.currency?.symbol}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat selection */}
            {
              (trip.trip_type === "bus" || trip.trip_type === "MiniVan") &&
              <SeatSelection
                trip={trip}
                travelers={travelers}
                onSeatsSelected={setSelectedSeats}
                selectedSeats={selectedSeats}
              />
            }

            {/* Traveler information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Traveler Information</h2>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Number of Travelers</label>
                <Input
                  type="number"
                  value={travelers}
                  onChange={handleTravelersChange}
                  min="1"
                  max={trip.avalible_seats}
                  className="w-full max-w-xs border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {travelerDetails.map((traveler, index) => (
                <TravelerInfoCard
                  key={index}
                  index={index}
                  traveler={traveler}
                  onChange={handleTravelerChange}
                  seatNumber={selectedSeats[index]}
                />
              ))}
            </div>
          </div>

          {/* Right column - Payment */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    selected={selectedPaymentMethod === method.id}
                    onChange={setSelectedPaymentMethod}
                    receiptImage={receiptImage}
                    onReceiptChange={handleReceiptChange}
                  />
                ))}
              </div>

              <div className="mt-8">
                <Button
                  onClick={handlePaymentSubmit}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                  disabled={loadingPost || loadingBookWallet || (selectedPaymentMethod === "vodafone" && !receiptImage)}
                >
                  {loadingPost || loadingBookWallet ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Confirm & Pay"
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3">Cancellation Policy</h3>
              <p className="text-gray-600 text-sm">
                {trip.cancelation_hours > 0 ? (
                  `Free cancellation up to ${trip.cancelation_hours} hours before departure.`
                ) : (
                  "No cancellations allowed for this trip."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your booking for {travelers} seat{travelers !== 1 ? 's' : ''} on {trip.trip_name} is confirmed.
            </p>
            <div className="space-y-3">
              {/* <Button
                onClick={() => navigate("/my-trips")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
              >
                View My Trips
              </Button> */}
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3 rounded-lg"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;