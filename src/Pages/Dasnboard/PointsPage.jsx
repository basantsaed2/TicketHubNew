import React, { useState, useEffect } from "react";
import { useGet } from "../../Hooks/useGet";
import StaticLoader from "../../Components/StaticLoader";
import { usePost } from "../../Hooks/usePostJson";
const PointsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchPoints, loading: loadingPoints, data: pointsData } = useGet({
    url: `${apiUrl}/user/points`,
  });

  const { postData, loadingPost, response } = usePost({url: `${apiUrl}/user/points/convert`, })
  const [userData, setUserData] = useState({});
  const [points, setPoints] = useState([]);

  useEffect(() => {
    refetchPoints();
  }, [refetchPoints]);

  useEffect(() => {
    if (pointsData && pointsData.redeem_points && pointsData.user_data) {
      setUserData(pointsData.user_data);
      setPoints(pointsData.redeem_points);
    }
  }, [pointsData]);

  const handleConvert = async (currencyId) => {

    const formData = new FormData();
    formData.append("currency_id", currencyId);
    formData.append("points", userData.points);

    postData(formData, "Converted Success!");
  };

  if (loadingPoints || loadingPost) {
    return <StaticLoader />;
  }

  return (
    <div className="w-full p-6">
      {/* Header Section */}
      <div className="bg-gray-900 text-white p-4 md:p-6 rounded-lg flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={userData.profile_image || "https://via.placeholder.com/50"}
            alt={userData.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">{userData.name}</h2>
            <p className="text-sm">{userData.email}</p>
          </div>
        </div>
        <span className="text-lg font-semibold">{userData.points} Points</span>
      </div>

      {/* User Balance List */}
      <div className="mt-4 bg-white shadow-lg rounded-lg p-4">
        {/* <h3 className="text-lg font-semibold">User Balance</h3> */}
        {points.map((item, index) => (
          <div key={index} className="flex justify-between items-center border-b py-3">
            <div>
              <p className="text-md font-semibold">{item.currency?.name}</p>
              <p className="text-gray-500"> {item.points} Points → {item.currencies} {item.currency?.symbol}</p>
            </div>
            <button
              onClick={() => handleConvert(item.currency.id)}
              disabled={userData.points === 0}
              className={`px-3 py-1 rounded-md text-white transition 
                ${userData.points === 0 
                  ? "bg-orange-500 opacity-50 cursor-not-allowed" 
                  : "bg-orange-500 hover:bg-orange-600"}`}
            >
              Convert
            </button> 
        </div>
        ))}
      </div>
    </div>
  );
};

export default PointsPage;
