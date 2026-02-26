import React, { useState, useEffect } from "react";
import { useGet } from "../../../Hooks/useGet";
import { usePost } from "../../../Hooks/usePostJson";
import { FaUserCircle, FaPhone, FaEnvelope, FaEdit, FaWallet, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
import StaticLoader from "../../../Components/StaticLoader";

const ProfilePage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // Fetch profile data from your API
  const { refetch: refetchProfile,loading, data: profileData } = useGet({
    url: `${apiUrl}/user/profile`,
  });
  const { postData, loadingPost ,response } = usePost({ url: `${apiUrl}/user/profile/update` });

  const [profile, setProfile] = useState({});
  const [nationalities, setNationalities] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  useEffect(() => {
    if (profileData && profileData.user && profileData.nationalities) {
      setProfile(profileData.user);
      setNationalities(profileData.nationalities);
      setFormData({ ...profileData.user, nationality_id: profileData.user.nationality_id || "" });
    }
  }, [profileData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    postData(formData,"Profile Updated Success!");
  };

  useEffect(() => {
      if (!loadingPost && response) {
        setShowModal(false);
        refetchProfile();
      }
    }, [loadingPost, response]);

  // Fallback values if any fields are missing
  const userName = profile.name || "User Name";
  const userHandle = profile.username || "username";
  const userPoints = profile.points || 0;
  const userPhone = profile.phone || "No phone number";
  const userEmail = profile.email || "-";
  const userCountry = profile.country || "-";

    if (loading || loadingPost) return <StaticLoader />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Top Header Card */}
      <div className="bg-gray-800 text-white rounded-xl p-6 flex items-center">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
          {/* If user has an avatar, replace FaUserCircle with an <img> tag */}
          <FaUserCircle className="text-4xl text-gray-300" />
        </div>
        {/* Name & Handle */}
        <div className="ml-4 flex-1">
          <h2 className="text-xl font-bold">{userName}</h2>
          <p className="text-sm text-gray-200">{userEmail}</p>
        </div>
        {/* Points */}
        <div className="ml-auto text-right">
          <span className="text-xl font-bold">{userPoints}</span>
          <p className="text-sm">Points</p>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white rounded-xl shadow mt-6">
        <div className="p-4 space-y-4">
          {/* Phone */}
          <div className="flex items-center">
            <FaPhone className="text-mainColor mr-3" />
            <span className="text-gray-700">{userPhone}</span>
          </div>
          {/* Email */}
          <div className="flex items-center">
            <FaEnvelope className="text-mainColor mr-3" />
            <span className="text-gray-700">{userEmail}</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Action Items */}
        <div className="p-4 space-y-4">
          {/* Edit Profile */}
          <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => setShowModal(true)}>
          <FaEdit className="text-mainColor mr-3" />
            <span className="text-gray-700 font-medium">Edit Profile</span>
          </div>

          {/* Wallet */}
          <Link to="/wallet" className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
            <FaWallet className="text-mainColor mr-3" />
            <span className="text-gray-700 font-medium">Wallet</span>
          </Link>

        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 mb-2 border rounded" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 mb-2 border rounded" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 mb-2 border rounded" />
            <select name="nationality_id" value={formData.nationality_id} onChange={handleChange} className="w-full p-2 mb-2 border rounded">
              <option value="">Select Nationality</option>
              {nationalities.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
              <button onClick={handleSubmit} className="bg-mainColor text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
