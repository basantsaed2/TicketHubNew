import React, { useRef, useEffect } from 'react';
import { MapPin, Calendar, Users, Car, Globe, Map as MapIcon, Navigation, Plus, Minus, ArrowLeftRight, ChevronDown } from 'lucide-react';
import Select from 'react-select';
import { Button } from '@/Components/ui/button';

const BookingSearchForm = ({
  // Data
  cities,
  countries,
  cars,
  // State
  filterMode,
  setFilterMode,
  activeTab,
  setActiveTab,
  selectedFromCity,
  setSelectedFromCity,
  selectedToCity,
  setSelectedToCity,
  selectedCountry,
  setSelectedCountry,
  selectedCar,
  setSelectedCar,
  travelDate,
  setTravelDate,
  roundDate,
  setRoundDate,
  passengerCounts,
  setPassengerCounts,
  addressFrom,
  setAddressFrom,
  addressTo,
  setAddressTo,
  // UI State
  showTravelerMenu,
  setShowTravelerMenu,
  loadingPost,
  loadingPrivate,
  // Handlers
  onSearch,
  onMapFromOpen,
  onMapToOpen,
  onSwitchCities
}) => {
  const travelerMenuRef = useRef(null);
  const dateInputRef = useRef(null);
  const roundDateInputRef = useRef(null);
  
  const today = new Date().toISOString().split("T")[0];
  const totalTravelers = passengerCounts.adult + passengerCounts.child;
  
  const minRoundDate = travelDate 
    ? new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + 1)).toISOString().split("T")[0] 
    : today;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (travelerMenuRef.current && !travelerMenuRef.current.contains(event.target)) {
        setShowTravelerMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowTravelerMenu]);

  const updateCount = (type, operation) => {
    setPassengerCounts(prev => ({
      ...prev,
      [type]: operation === 'inc' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const selectStyles = {
    control: (base) => ({
      ...base, border: 'none', boxShadow: 'none', background: 'transparent',
      fontWeight: '800', minHeight: '35px', cursor: 'pointer',
      padding: '0',
    }),
    valueContainer: (base) => ({ ...base, padding: '0' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({ ...base, padding: '0 4px', color: '#cbd5e1' }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: base => ({ ...base, borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '8px' }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      borderRadius: '12px',
      margin: '2px 0',
      backgroundColor: isSelected ? '#f97316' : isFocused ? '#fff7ed' : 'transparent',
      color: isSelected ? 'white' : '#475569',
      fontWeight: '700',
      fontSize: '13px',
      cursor: 'pointer',
      ':active': { backgroundColor: '#fdba74' }
    }),
    placeholder: (base) => ({ ...base, color: '#64748b', fontSize: '14px', fontWeight: '900' })
  };

  return (
    <div className="w-full">
      {/* TABS */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-end gap-4 px-4 md:px-8 mb-[-1px]">
        <div className="flex bg-slate-100/60 backdrop-blur-md p-1.5 rounded-2xl md:rounded-t-[24px] md:rounded-b-none border border-slate-200/50 shadow-sm self-start">
          <button type="button" onClick={() => setFilterMode("general")} className={`px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all duration-300 ${filterMode === 'general' ? 'bg-white text-slate-900 shadow-md scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>Standard</button>
          <button type="button" onClick={() => setFilterMode("private")} className={`px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all duration-300 ${filterMode === 'private' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'text-slate-500 hover:text-orange-600 hover:bg-white/50'}`}>Private Request</button>
        </div>
        
        {filterMode === "general" && (
          <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl md:rounded-t-[24px] md:rounded-b-none border-t border-x border-slate-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar whitespace-nowrap">
            {['all', 'hiace', 'train', 'bus'].map((t) => (
              <button 
                key={t} 
                type="button" 
                onClick={() => setActiveTab(t)} 
                className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${
                  activeTab === t 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-100 transform -translate-y-0.5' 
                    : 'text-slate-500 hover:text-orange-500 hover:bg-orange-50/50'
                }`}
              >
                {t === 'hiace' ? 'Mini Van' : t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH BOX */}
      <div className="bg-white rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-50">
        <form onSubmit={onSearch} className="flex flex-col">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center lg:divide-x divide-slate-100 p-3">

            {filterMode === "private" && (
              <div className="flex-1 px-5 py-4 group hover:bg-slate-50/80 transition-all cursor-pointer">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-orange-500">
                  <Globe size={13} className="text-orange-500" /> Country
                </label>
                <Select options={countries} value={selectedCountry} onChange={setSelectedCountry} placeholder="Select Country" styles={selectStyles} menuPortalTarget={document.body} />
              </div>
            )}

            <div className="flex-[1.8] px-5 py-4 group hover:bg-slate-50/80 transition-all flex items-center gap-3">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-orange-500">
                  <MapPin size={13} className="text-orange-500" /> From
                </label>
                <Select options={cities} value={selectedFromCity} onChange={setSelectedFromCity} placeholder="Origin" styles={selectStyles} menuPortalTarget={document.body} />
              </div>
              <button type="button" onClick={onSwitchCities} className="mt-5 p-2.5 bg-slate-100/50 rounded-full hover:bg-orange-500 hover:text-white transition-all transform hover:rotate-180 duration-500 text-slate-400 shadow-sm border border-slate-200/50">
                <ArrowLeftRight size={16} />
              </button>
            </div>

            <div className="flex-[1.8] px-5 py-4 group hover:bg-slate-50/80 transition-all cursor-pointer">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-orange-500">
                <Navigation size={13} className="text-orange-500" /> To
              </label>
              <Select options={cities} value={selectedToCity} onChange={setSelectedToCity} placeholder="Destination" styles={selectStyles} menuPortalTarget={document.body} />
            </div>

            <div className="flex-1 px-5 py-4 group hover:bg-slate-50/80 transition-all cursor-pointer border-t md:border-t-0" onClick={() => dateInputRef.current?.showPicker()}>
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-orange-500">
                <Calendar size={13} className="text-orange-500" /> Date
              </label>
              <input ref={dateInputRef} type="date" min={today} value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full border-none p-0 text-[15px] font-extrabold text-slate-800 bg-transparent focus:ring-0 outline-none cursor-pointer" />
            </div>

            {filterMode === "general" && (
               <div className="flex-1 px-5 py-4 group hover:bg-slate-50/80 transition-all cursor-pointer border-t md:border-t-0" onClick={() => roundDateInputRef.current?.showPicker()}>
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-orange-500">
                    <Calendar size={13} className="text-orange-500" /> Return?
                  </label>
                  <input ref={roundDateInputRef} type="date" min={minRoundDate} value={roundDate} onChange={(e) => setRoundDate(e.target.value)} className="w-full border-none p-0 text-[15px] font-extrabold text-slate-800 bg-transparent focus:ring-0 outline-none cursor-pointer" />
               </div>
            )}

            <div className="flex-1 px-5 py-4 group hover:bg-slate-50/80 transition-all relative border-t md:border-t-0" ref={travelerMenuRef}>
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-orange-500">
                <Users size={13} className="text-orange-500" /> Travelers
              </label>
              <div onClick={() => setShowTravelerMenu(!showTravelerMenu)} className="text-[15px] font-extrabold text-slate-800 cursor-pointer flex items-center gap-2.5 h-[35px]">
                <Users size={16} className="text-slate-400" />
                <span>{totalTravelers} {totalTravelers === 1 ? 'Traveler' : 'Travelers'}</span>
                <ChevronDown size={14} className={`ml-auto transition-transform duration-300 text-slate-400 ${showTravelerMenu ? 'rotate-180' : ''}`} />
              </div>

              {showTravelerMenu && (
                <div className="absolute top-[100%] right-0 lg:left-0 mt-4 w-72 bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-50 p-6 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-800">Adult</p>
                        <p className="text-[10px] text-slate-400 font-medium">18-59</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => updateCount('adult', 'dec')} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-orange-500"><Minus size={14} /></button>
                        <span className="font-bold text-slate-800 w-4 text-center">{passengerCounts.adult}</span>
                        <button type="button" onClick={() => updateCount('adult', 'inc')} className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white"><Plus size={14} /></button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-800">Child</p>
                        <p className="text-[10px] text-slate-400 font-medium">0-17</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => updateCount('child', 'dec')} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-orange-500"><Minus size={14} /></button>
                        <span className="font-bold text-slate-800 w-4 text-center">{passengerCounts.child}</span>
                        <button type="button" onClick={() => updateCount('child', 'inc')} className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white"><Plus size={14} /></button>
                      </div>
                    </div>
                    <Button type="button" onClick={() => setShowTravelerMenu(false)} className="w-full bg-slate-900 text-white rounded-full py-6 font-bold">Done</Button>
                  </div>
                </div>
              )}
            </div>

            {filterMode === "general" && (
              <div className="p-2">
                <Button type="submit" disabled={loadingPost} className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 h-[64px] px-12 rounded-full text-base font-black transition-all shadow-xl shadow-orange-100">
                  {loadingPost ? "Searching..." : "Find tickets"}
                </Button>
              </div>
            )}
          </div>

          {/* PRIVATE ROW */}
          {filterMode === "private" && (
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center border-t border-slate-100 lg:divide-x divide-slate-100/50 p-2.5 bg-slate-50/50 rounded-b-[40px]">
              <div className="flex-1 px-5 py-4 group hover:bg-white/60 transition-all cursor-pointer">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-orange-500">
                  <Car size={13} className="text-orange-500" /> Car Type
                </label>
                <Select options={cars} value={selectedCar} onChange={setSelectedCar} placeholder="Select Vehicle" styles={selectStyles} menuPortalTarget={document.body} />
              </div>
              <div className="flex-1 px-5 py-4 group hover:bg-white/60 transition-all cursor-pointer">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-orange-500">
                  <MapIcon size={13} className="text-orange-500" /> Map Locations
                </label>
                <div className="flex gap-4 text-[11px] font-black">
                  <button type="button" onClick={onMapFromOpen} className="text-blue-600 hover:text-blue-700 hover:underline uppercase tracking-wide decoration-2 underline-offset-4">Pickup Pin</button>
                  <button type="button" onClick={onMapToOpen} className="text-blue-600 hover:text-blue-700 hover:underline uppercase tracking-wide decoration-2 underline-offset-4">Drop Pin</button>
                </div>
              </div>
              <div className="flex-1 px-5 py-4 group hover:bg-white/60 transition-all cursor-pointer">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 block transition-colors group-hover:text-orange-500">Address From</label>
                <input value={addressFrom} onChange={(e) => setAddressFrom(e.target.value)} placeholder="Hotel or Street name" className="w-full border-none p-0 text-[14px] font-extrabold text-slate-800 bg-transparent focus:ring-0 outline-none placeholder:text-slate-300" />
              </div>
              <div className="flex-1 px-5 py-4 group hover:bg-white/60 transition-all cursor-pointer">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 block transition-colors group-hover:text-orange-500">Address To</label>
                <input value={addressTo} onChange={(e) => setAddressTo(e.target.value)} placeholder="Specific drop-off point" className="w-full border-none p-0 text-[14px] font-extrabold text-slate-800 bg-transparent focus:ring-0 outline-none placeholder:text-slate-300" />
              </div>
              <div className="p-3">
                <Button type="submit" disabled={loadingPrivate} className="w-full lg:w-auto bg-slate-900 hover:bg-black text-white h-[58px] px-12 rounded-2xl text-[11px] font-black uppercase tracking-[2px] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 active:scale-95">
                  {loadingPrivate ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingSearchForm;
