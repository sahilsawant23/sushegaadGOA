import React, { useState, useEffect } from 'react';
import { goaBeaches } from '../../data/beachesData';
import { 
  BEACH_SAFETY_DATASET, 
  BeachSafetyData, 
  FlagStatus,
  getBeachSafetyData,
  fetchLiveMarineData
} from '../../data/tideWaterSafetyData';
import { 
  Waves, 
  ShieldAlert, 
  ShieldCheck, 
  Wind, 
  Thermometer, 
  Sun, 
  LifeBuoy, 
  PhoneCall, 
  ChevronDown, 
  Info,
  Clock,
  CheckCircle2,
  AlertOctagon,
  X
} from 'lucide-react';

interface Props {
  compact?: boolean;
  beachId?: string;
  beachName?: string;
  region?: string;
}

export const WaterSafetyWidget: React.FC<Props> = ({ compact = false, beachId, beachName, region }) => {
  const [selectedBeachId, setSelectedBeachId] = useState<string>(beachId || 'baga-beach');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (beachId) {
      setSelectedBeachId(beachId);
    }
  }, [beachId]);

  const activeBeach: BeachSafetyData = getBeachSafetyData(selectedBeachId, beachName, region);

  const getFlagBadge = (status: FlagStatus) => {
    switch (status) {
      case 'green':
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-700 dark:text-emerald-300',
          badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70',
          border: 'border-emerald-300 dark:border-emerald-800',
          icon: ShieldCheck
        };
      case 'yellow':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-700 dark:text-amber-300',
          badgeBg: 'bg-amber-100 dark:bg-amber-950/70',
          border: 'border-amber-300 dark:border-amber-800',
          icon: ShieldAlert
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-700 dark:text-purple-300',
          badgeBg: 'bg-purple-100 dark:bg-purple-950/70',
          border: 'border-purple-300 dark:border-purple-800',
          icon: AlertOctagon
        };
      case 'red':
      default:
        return {
          bg: 'bg-red-500',
          text: 'text-red-700 dark:text-red-300',
          badgeBg: 'bg-red-100 dark:bg-red-950/70',
          border: 'border-red-300 dark:border-red-800',
          icon: ShieldAlert
        };
    }
  };

  const flagStyle = getFlagBadge(activeBeach.flagStatus);
  const FlagIcon = flagStyle.icon;

  if (compact) {
    return (
      <>
        <button
          onClick={() => setIsOpenModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 transition-all shadow-sm"
          title="Click to view live water safety & tide predictor"
        >
          <Waves className="h-4 w-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
          <span className="truncate max-w-[120px]">{activeBeach.beachName}</span>
          <span className={`w-2.5 h-2.5 rounded-full ${flagStyle.bg} shrink-0`} />
        </button>

        {/* Modal Popup when compact widget clicked */}
        {isOpenModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsOpenModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
              <WaterSafetyContent 
                activeBeach={activeBeach}
                selectedBeachId={selectedBeachId}
                setSelectedBeachId={setSelectedBeachId}
                flagStyle={flagStyle}
                FlagIcon={FlagIcon}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-xl text-gray-900 dark:text-gray-100">
      <WaterSafetyContent 
        activeBeach={activeBeach}
        selectedBeachId={selectedBeachId}
        setSelectedBeachId={setSelectedBeachId}
        flagStyle={flagStyle}
        FlagIcon={FlagIcon}
      />
    </div>
  );
};

interface InnerProps {
  activeBeach: BeachSafetyData;
  selectedBeachId: string;
  setSelectedBeachId: (id: string) => void;
  flagStyle: any;
  FlagIcon: any;
}

const WaterSafetyContent: React.FC<InnerProps> = ({
  activeBeach,
  selectedBeachId,
  setSelectedBeachId,
  flagStyle,
  FlagIcon
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [liveWave, setLiveWave] = useState<string | null>(null);
  const [liveTemp, setLiveTemp] = useState<string | null>(null);
  const [liveWind, setLiveWind] = useState<string | null>(null);
  const [liveUv, setLiveUv] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLiveApiData = async () => {
      setLastUpdated(new Date());

      // 1. Look up exact GPS coordinates from goaBeaches dataset
      const foundMatch = goaBeaches.find(b => 
        String(b.id).toLowerCase() === activeBeach.beachId.toLowerCase() ||
        b.name.toLowerCase().includes(activeBeach.beachId.toLowerCase())
      );

      const lat = foundMatch?.coordinates?.lat || (activeBeach.region.toLowerCase().includes('south') ? 15.0074 : 15.5555);
      const lng = foundMatch?.coordinates?.lng || (activeBeach.region.toLowerCase().includes('south') ? 74.0245 : 73.7511);

      const liveData = await fetchLiveMarineData(lat, lng);
      if (isMounted && liveData) {
        if (liveData.waveHeight) setLiveWave(liveData.waveHeight);
        if (liveData.waterTemp) setLiveTemp(liveData.waterTemp);
        if (liveData.windSpeed) setLiveWind(liveData.windSpeed);
        if (liveData.uvIndex !== undefined) setLiveUv(liveData.uvIndex);
      }
    };

    loadLiveApiData();

    const interval = setInterval(loadLiveApiData, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeBeach.beachId, activeBeach.region]);

  return (
    <div className="space-y-5">
      {/* Header & Beach Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-extrabold text-lg tracking-tight">Goa Beach Water Safety & Tide Hub</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time ocean conditions • Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        <select
          value={activeBeach.beachId}
          onChange={(e) => setSelectedBeachId(e.target.value)}
          className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        >
          {!BEACH_SAFETY_DATASET.some(b => b.beachId === activeBeach.beachId) && (
            <option value={activeBeach.beachId}>
              {activeBeach.beachName} ({activeBeach.region})
            </option>
          )}
          {BEACH_SAFETY_DATASET.map(b => (
            <option key={b.beachId} value={b.beachId}>
              {b.beachName} ({b.region})
            </option>
          ))}
        </select>
      </div>

      {/* Flag Alert Status Banner */}
      <div className={`p-4 rounded-2xl border ${flagStyle.border} ${flagStyle.badgeBg} flex items-start gap-3.5`}>
        <div className={`p-2.5 rounded-xl ${flagStyle.bg} text-white shrink-0`}>
          <FlagIcon className="h-6 w-6" />
        </div>
        <div>
          <div className={`font-bold text-sm ${flagStyle.text}`}>
            {activeBeach.flagLabel}
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
            {activeBeach.flagDescription}
          </p>
          {(activeBeach.ripCurrentAlert || activeBeach.jellyfishAlert) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {activeBeach.ripCurrentAlert && (
                <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 text-[11px] font-semibold">
                  ⚠️ Rip Current Warning
                </span>
              )}
              {activeBeach.jellyfishAlert && (
                <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[11px] font-semibold">
                  🪼 Jellyfish Advisory
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Ocean Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-gray-400 flex items-center gap-1 mb-1">
            <Waves className="h-3.5 w-3.5 text-cyan-500" /> Wave Height
          </div>
          <div className="text-sm font-bold flex items-center gap-1">
            {liveWave || activeBeach.waveHeight}
            {liveWave && <span className="text-[10px] text-emerald-500 font-bold">API Live</span>}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-gray-400 flex items-center gap-1 mb-1">
            <Thermometer className="h-3.5 w-3.5 text-rose-500" /> Sea Temp
          </div>
          <div className="text-sm font-bold">{liveTemp || activeBeach.waterTemp}</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-gray-400 flex items-center gap-1 mb-1">
            <Wind className="h-3.5 w-3.5 text-blue-500" /> Wind Speed
          </div>
          <div className="text-sm font-bold">{liveWind || activeBeach.windSpeed}</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-gray-400 flex items-center gap-1 mb-1">
            <Sun className="h-3.5 w-3.5 text-amber-500" /> UV Index
          </div>
          <div className="text-sm font-bold">
            {liveUv !== null ? `${liveUv} (${liveUv >= 8 ? 'Very High' : liveUv >= 6 ? 'High' : 'Moderate'})` : `${activeBeach.uvIndex} (High)`}
          </div>
        </div>
      </div>

      {/* Interactive Tide Curve Visualization */}
      <div className="bg-gradient-to-b from-cyan-900/30 to-blue-900/30 p-4 rounded-2xl border border-cyan-800/40">
        <div className="flex items-center justify-between text-xs font-bold mb-3">
          <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-300">
            <Clock className="h-3.5 w-3.5" /> 24-Hour Tide Forecast curve
          </span>
          <span className="text-[11px] text-gray-400 font-normal">Height (Meters)</span>
        </div>

        {/* Visual Wave Chart */}
        <div className="relative h-20 w-full mb-3 flex items-end">
          <svg className="w-full h-full text-cyan-500/80 overflow-visible" viewBox="0 0 400 60">
            <path
              d="M 0,30 C 50,5 100,55 150,30 C 200,5 250,55 300,30 C 350,5 400,30 400,30 L 400,60 L 0,60 Z"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <path
              d="M 0,30 C 50,5 100,55 150,30 C 200,5 250,55 300,30 C 350,5 400,30 400,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Tide Timings list */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          {activeBeach.tidesToday.map((tide, idx) => (
            <div key={idx} className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-xl border border-cyan-500/20">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">{tide.type}</div>
              <div className="font-extrabold text-cyan-600 dark:text-cyan-300">{tide.time}</div>
              <div className="text-[11px] text-gray-400">{tide.heightMeters} m</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lifeguard & Safety Contacts */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs bg-gray-50 dark:bg-gray-700/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <LifeBuoy className="h-4 w-4 text-emerald-500 shrink-0" />
          <span><b>{activeBeach.lifeguardsOnDuty} Lifeguards</b> on duty • Watersports: <b className="text-emerald-600 dark:text-emerald-400">{activeBeach.watersportsStatus}</b></span>
        </div>

        <a
          href={`tel:${activeBeach.rescueStationContact}`}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0"
        >
          <PhoneCall className="h-3.5 w-3.5" /> Rescue: {activeBeach.rescueStationContact}
        </a>
      </div>
    </div>
  );
};

export default WaterSafetyWidget;
