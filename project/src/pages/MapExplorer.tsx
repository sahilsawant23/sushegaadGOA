import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, Navigation, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Mock Data for Map Pins
const locations = [
    { id: 1, name: "Calangute Beach", lat: 15.5494, lng: 73.7535, type: "Beach", link: "/beach/calangute" },
    { id: 2, name: "Baga Beach", lat: 15.5553, lng: 73.7517, type: "Beach", link: "/beach/baga" },
    { id: 3, name: "Dudhsagar Falls", lat: 15.3144, lng: 74.3143, type: "Waterfall", link: "/waterfalls/dudhsagar" },
    { id: 4, name: "Basilica of Bom Jesus", lat: 15.5009, lng: 73.9116, type: "Heritage", link: "/churches/bom-jesus" },
    { id: 5, name: "Fort Aguada", lat: 15.4920, lng: 73.7737, type: "Heritage", link: "/forts/aguada" },
    { id: 6, name: "Anjuna Flea Market", lat: 15.5844, lng: 73.7432, type: "Market", link: "/markets/anjuna" },
    { id: 7, name: "Chapora Fort", lat: 15.6056, lng: 73.7378, type: "Heritage", link: "/forts/chapora" },
    { id: 8, name: "Palolem Beach", lat: 15.0100, lng: 74.0200, type: "Beach", link: "/beach/palolem" },
    { id: 9, name: "Shanta Durga Temple", lat: 15.3992, lng: 73.9934, type: "Temple", link: "/temples/shantadurga" },
    { id: 10, name: "Tito's Lane", lat: 15.5540, lng: 73.7515, type: "Nightlife", link: "/nightlife/titos" }
];

const MapExplorer: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            {/* Header */}
            <div className="bg-white shadow border-b py-6 px-4">
                <div className="max-w-7xl mx-auto flex items-center space-x-3">
                    <MapIcon className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Interactive Map</h1>
                        <p className="text-gray-500 text-sm">Discover Goa's gems</p>
                    </div>
                </div>
            </div>

            {/* Map Container - Explicit Height */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-200px)] min-h-[500px]">
                <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100 z-0 relative">
                    <MapContainer
                        center={[15.4, 74.0]}
                        zoom={10}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {locations.map((loc) => (
                            <Marker
                                key={loc.id}
                                position={[loc.lat, loc.lng]}
                                icon={DefaultIcon}
                            >
                                <Popup>
                                    <div className="p-1 min-w-[150px]">
                                        <span className="text-xs font-bold text-blue-500 uppercase">{loc.type}</span>
                                        <h3 className="font-bold text-gray-900">{loc.name}</h3>
                                        <Link
                                            to={loc.link}
                                            className="text-sm text-blue-600 hover:underline flex items-center mt-1"
                                        >
                                            View Details
                                            <Navigation className="h-3 w-3 ml-1" />
                                        </Link>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Legend / Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center space-x-3 mb-3">
                            <Info className="h-6 w-6 text-blue-500" />
                            <h3 className="font-semibold text-gray-900">How to use</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Zoom in and out with mouse wheel. Click on any marker to see details.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapExplorer;
