import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import { X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import "leaflet/dist/leaflet.css";

const MapClickHandler = ({ onMapClick }) => {
  useMapEvent("click", onMapClick);
  return null;
};

const MapModal = ({ 
  isOpen, 
  onClose, 
  centerLocation, 
  onLocationSelect, 
  markerLocation,
  title = "Pin Location on Map"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[2000] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl h-[70vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <span className="font-black text-slate-800 uppercase text-xs">{title}</span>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow">
          <MapContainer center={centerLocation} zoom={13} className="w-full h-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={markerLocation || centerLocation} />
            <MapClickHandler onMapClick={onLocationSelect} />
          </MapContainer>
        </div>
        <div className="p-6 bg-white border-t flex justify-end">
          <Button onClick={onClose} className="bg-orange-500 rounded-full px-12 h-14 font-black hover:bg-orange-600 transition-all">
            Confirm Position
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
