import React, { useState, useEffect } from "react";
import { useGet } from "../../Hooks/useGet";
import StaticLoader from "../../Components/StaticLoader";
import { usePost } from "../../Hooks/usePostJson";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 float-right text-xl">&times;</button>
        <div className="clear-both">{children}</div>
      </div>
    </div>
  );
};

const WalletPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchWallet, loading: loadingWallet, data: walletData } = useGet({
    url: `${apiUrl}/user/wallet`,
  });
  const { refetch: refetchWalletHistory, loading: loadingWalletHistory, data: walletHistoryData } = useGet({
    url: `${apiUrl}/user/wallet/history`,
  });
  const { refetch: refetchWalletList, data: walletListData } = useGet({
    url: `${apiUrl}/user/wallet/lists`,
  });
  const { postData, loadingPost ,response } = usePost({ url: `${apiUrl}/user/wallet/charge` });
  const [activeTab, setActiveTab] = useState("current");

  const [wallets, setWallets] = useState([]);
  const [walletHistory, setWalletHistory] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [chargeAmount, setChargeAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    refetchWallet();
    refetchWalletHistory();
    refetchWalletList();
  }, [refetchWallet,refetchWalletHistory, refetchWalletList]);
  useEffect(() => {
    if (walletData?.wallets) {
      setWallets(walletData.wallets);
      console.log("Wallets updated:", walletData.wallets);
    }
  }, [walletData]);
  

  useEffect(() => {
    if (walletHistoryData && walletHistoryData.history) setWalletHistory(walletHistoryData.history);
  }, [walletHistoryData]);

  useEffect(() => {
    if (walletListData) {
      setCurrencies(walletListData.currencies || []);
      setPaymentMethods(walletListData.payment_methods || []);
    }
  }, [walletListData]);

  const openRechargeModal = (wallet) => {
    setSelectedWallet(wallet);
    setChargeAmount("");
    setMessage("");
    setIsModalOpen(true);
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!chargeAmount || !selectedPaymentMethod || !receiptImage) {
      setMessage("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("wallet_id", selectedWallet.id);
    formData.append("amount", chargeAmount);
    formData.append("payment_method_id", selectedPaymentMethod);
    formData.append("image", receiptImage);

    postData(formData, "Recharge request is under review!");
  };

  useEffect(() => {
    if (!loadingPost && response) {
      setSelectedPaymentMethod();
      setReceiptImage();
      setChargeAmount("");
      setSelectedWallet("");
      setSelectedCurrency();
      refetchWallet();
      setIsModalOpen(false);
    }
  }, [loadingPost, response]);

  if (loadingWallet) return <StaticLoader />;

  return (
    <div className="p-6 w-full min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">My Wallets</h1>
  
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`p-2 w-1/2 ${activeTab === "current" ? "border-b-2 border-secoundColor font-semibold" : ""}`}
          onClick={() => setActiveTab("current")}
        >
          Current Wallet
        </button>
        <button
          className={`p-2 w-1/2 ${activeTab === "history" ? "border-b-2 border-secoundColor font-semibold" : ""}`}
          onClick={() => {
            setActiveTab("history");
            refetchWalletHistory();
          }}
        >
          Pending Wallet
        </button>
      </div>
  
      {/* Show Content Based on Active Tab */}
      {activeTab === "current" ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="flex flex-col gap-5 border border-mainColor p-4 rounded-lg shadow-md">
                <p className="text-md font-semibold">Currancy : {wallet.currency?.name} {`(${wallet.currency?.symbol})`}</p>
                <p className="text-gray-500">Balance: <span className="text-black text-xl font-semibold">{wallet.amount} {wallet.currency.symbol}</span></p>
                {/* <p className="text-gray-500">Total: {wallet.total !== null ? wallet.currency.symbol + wallet.total : "N/A"}</p> */}
                {/* <p className="text-gray-500">Pending: {wallet.pending_amount !== null ? wallet.currency.symbol + wallet.pending_amount : "N/A"}</p> */}
              <button className="bg-orange-500 text-white px-3 py-2 rounded-md" onClick={() => openRechargeModal(wallet)}>Recharge</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 shadow-lg rounded-lg p-4">
          {loadingWalletHistory ? (
            <StaticLoader />
          ) : walletHistory.length > 0 ? (
            walletHistory.map((history, index) => (
              <div key={index} className="border-b py-3">
                <p className="text-md font-semibold">{history.currency?.name}</p>
                <p className="text-gray-500">Amount: {history.amount}{history.currency?.symbol}</p>
                <p className="text-gray-500">Status: {history.status}</p>
                <p className="text-gray-500">Date: {new Date(history.created_at).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No wallet history found.</p>
          )}
        </div>
      )}

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <h2 className="text-lg font-semibold mb-4">Recharge Wallet</h2>
      <form onSubmit={handleRecharge} className="space-y-4">
        
        {/* Amount Input */}
        <input
          type="number"
          value={chargeAmount}
          onChange={(e) => setChargeAmount(e.target.value)}
          placeholder="Enter Amount"
          className="w-full p-2 border rounded"
        />

        {/* Currency Selection */}
        <select
          value={selectedCurrency || selectedWallet?.currency?.id} 
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Currency</option>

          {/* Optionally, show other currencies */}
          {currencies
            .filter((currency) => currency.id === selectedWallet?.currency_id) 
            .map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.name} ({currency.symbol})
              </option>
            ))}
        </select>

        {/* Payment Method Selection */}
        <select
          value={selectedPaymentMethod}
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Payment Method</option>
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>{method.name}</option>
          ))}
        </select>

        {/* Receipt Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setReceiptImage(e.target.files[0])}
          className="w-full p-2 border rounded"
        />

        {/* Submit Button */}
        <button type="submit" className="bg-mainColor text-white px-4 py-2 rounded w-full">
          {loadingPost ? "Processing..." : "Confirm Recharge"}
        </button>

        {/* Error Message */}
        {message && <p className="text-red-500 mt-2">{message}</p>}
      </form>
    </Modal>

    </div>
  );
};

export default WalletPage;
