import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, LifeBuoy, MapPin, Radio } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmergencySOSProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSProps> = ({ isOpen, onClose }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);

  const handleBroadcastSOS = () => {
    setIsSOSActive(true);
    toast.error('SOS ALERT BROADCASTED to Drishti Marine Lifesavers & Goa Police (112)!', {
      duration: 6000
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-slate-900 dark:text-white shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-500/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Goa Tourist Emergency Safety Radar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">24/7 Coast Lifeguard & Tourist Helpline Telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* SOS Broadcast Action Button */}
        <div className="my-6 text-center">
          <button
            onClick={handleBroadcastSOS}
            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all ${
              isSOSActive
                ? 'bg-rose-600 text-white shadow-xl shadow-rose-500/40 animate-pulse'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:scale-[1.01]'
            }`}
          >
            <Radio className="h-5 w-5 animate-pulse" />
            <span>{isSOSActive ? 'SOS ACTIVE - DISPATCH NOTIFIED (112)' : 'PRESS TO BROADCAST EMERGENCY SOS'}</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2">Transmits real-time GPS coordinates & safety status to nearest Lifeguard Tower</p>
        </div>

        {/* Emergency Hotlines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href="tel:112"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:border-rose-500 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">All Emergency Hotline</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-rose-500">Dial 112</div>
            </div>
          </a>

          <a
            href="tel:108"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:border-emerald-500 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Medical Ambulance</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-500">Dial 108</div>
            </div>
          </a>
        </div>

        {/* Nearest Lifeguard Stations */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Nearest Lifeguard Patrol Stations</h4>
          
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Baga Beach Sector 4 Lifeguard Station</div>
                <div className="text-slate-400 text-[11px]">Drishti Lifesaving Team Alpha • 3 Lifeguards on Duty</div>
              </div>
            </div>
            <span className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px]">
              350m Away
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Palolem South Beach Control Post</div>
                <div className="text-slate-400 text-[11px]">Coastal Rescue JetSki Unit • Active Watch</div>
              </div>
            </div>
            <span className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px]">
              Active Patrol
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400">Powered by Drishti Marine Safety Telemetry</span>
          <button
            onClick={onClose}
            className="btn-secondary !px-4 !py-2 !text-xs"
          >
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencySOSModal;
