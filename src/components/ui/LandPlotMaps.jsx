import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { ExternalLink, X } from 'lucide-react';

// --- Main Map Component Configuration ---
const containerStyle = {
  width: '100%',
  height: '100%'
};

const mapCenter = {
  lat: 3.507431,
  lng: 101.1077
};

// --- MOCK DATA for the 9 land plots ---
const landPlotsData = [
  { id: 1, position: { lat: 3.5085, lng: 101.1070 }, title: "Plot A-1", description: "North-West quadrant, primarily clay soil. Excellent morning sun exposure.", imageUrl: "https://images.unsplash.com/photo-1589531739832-34f3a73c33a9?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, position: { lat: 3.5085, lng: 101.1077 }, title: "Plot A-2", description: "North-Central plot with loam soil. Equipped with drip irrigation.", imageUrl: "https://images.unsplash.com/photo-1445199149999-b8830b134a62?q=80&w=1952&auto=format&fit=crop" },
  { id: 3, position: { lat: 3.5085, lng: 101.1084 }, title: "Plot A-3", description: "North-East plot, slightly sloped, providing excellent drainage.", imageUrl: "https://images.unsplash.com/photo-1599547464332-84337d12f550?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, position: { lat: 3.5074, lng: 101.1070 }, title: "Plot B-1", description: "West-Central plot with high organic matter.", imageUrl: "https://images.unsplash.com/photo-1625824539692-a14a42b1029c?q=80&w=2070&auto=format&fit=crop" },
  { id: 5, position: { lat: 3.5074, lng: 101.1077 }, title: "Plot B-2 (Central Hub)", description: "The main operational plot where the primary sensor array is located.", imageUrl: "https://images.unsplash.com/photo-1605375109313-2647c4c9594f?q=80&w=1974&auto=format&fit=crop" },
  { id: 6, position: { lat: 3.5074, lng: 101.1084 }, title: "Plot B-3", description: "East-Central plot reserved for crop rotation.", imageUrl: "https://images.unsplash.com/photo-1516253459639-65a88a04c143?q=80&w=2070&auto=format&fit=crop" },
  { id: 7, position: { lat: 3.5063, lng: 101.1070 }, title: "Plot C-1", description: "South-West quadrant with sandy loam. Best suited for root vegetables.", imageUrl: "https://images.unsplash.com/photo-1624511037223-28f8f047432f?q=80&w=1974&auto=format&fit=crop" },
  { id: 8, position: { lat: 3.5063, lng: 101.1077 }, title: "Plot C-2", description: "South-Central area, adjacent to the water reservoir.", imageUrl: "https://images.unsplash.com/photo-1563246282-33737c35a643?q=80&w=1939&auto=format&fit=crop" },
  { id: 9, position: { lat: 3.5063, lng: 101.1084 }, title: "Plot C-3", description: "South-East corner with a natural windbreak. Used for delicate plants.", imageUrl: "https://images.unsplash.com/photo-1560962322-7935412499d2?q=80&w=2070&auto=format&fit=crop" }
];


const LandPlotsMap = () => {
    // This hook loads the Google Maps script and tells you when it's ready
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const [activeMarker, setActiveMarker] = useState(null);

    const handleMarkerClick = (marker) => {
        setActiveMarker(marker);
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Land Plots Overview</h3>
            <div className="h-96 w-full rounded-lg overflow-hidden">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={17}
                    options={{ 
                        mapTypeControl: false, 
                        streetViewControl: false, 
                        fullscreenControl: false,
                        mapId: "YOUR_CUSTOM_MAP_ID" // Optional: for custom styling in Cloud Console
                    }}
                >
                    {landPlotsData.map((plot) => (
                        <Marker
                            key={plot.id}
                            position={plot.position}
                            onClick={() => handleMarkerClick(plot)}
                        />
                    ))}

                    {activeMarker && (
                        <InfoWindow
                            position={activeMarker.position}
                            onCloseClick={() => setActiveMarker(null)}
                        >
                            <div className="w-64">
                                <img src={activeMarker.imageUrl} alt={activeMarker.title} className="w-full h-32 object-cover rounded-md" />
                                <h4 className="font-bold text-md my-2 text-gray-800">{activeMarker.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{activeMarker.description}</p>
                                <a href={`https://www.google.com/maps?q=${activeMarker.position.lat},${activeMarker.position.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-blue-600 hover:underline">
                                    View Details <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};

export default LandPlotsMap;