import { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Store } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Navigation, Clock } from 'lucide-react';
import { calculateDistance, estimateTravelTime, formatAddress } from '@/lib/utils';

interface StoreMapProps {
  stores: Store[];
  onStoreSelect?: (store: Store) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

interface LocationInfo {
  latitude: number;
  longitude: number;
}

export function StoreMap({ 
  stores, 
  onStoreSelect,
  initialCenter = [-80.1918, 25.7617], // Default center on Miami
  initialZoom = 11
}: StoreMapProps) {
  const [viewState, setViewState] = useState({
    longitude: initialCenter[0],
    latitude: initialCenter[1],
    zoom: initialZoom
  });
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationInfo | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const getDistanceInfo = (storeLat: number, storeLng: number) => {
    if (!userLocation) return null;

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      storeLat,
      storeLng
    );
    const time = estimateTravelTime(distance);

    return { distance, time };
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border bg-gray-50">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={{
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors',
              maxzoom: 19
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
              paint: {
                'raster-opacity': 0.8,
                'raster-saturation': -0.9,
                'raster-contrast': 0.1
              }
            }
          ]
        }}
        onClick={() => setSelectedStore(null)}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          showUserLocation
          onGeolocate={(position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          }}
        />

        {stores.map(store => {
          const distanceInfo = getDistanceInfo(store.location.lat, store.location.lng);

          return (
            <Marker
              key={store.id}
              longitude={store.location.lng}
              latitude={store.location.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedStore(store.id);
                onStoreSelect?.(store);
              }}
            >
              <div className="relative cursor-pointer">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-8 h-8 fill-red-500 drop-shadow-md"
                  style={{ transform: 'translate(-50%, -100%)' }}
                >
                  <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"/>
                </svg>

                <Card 
                  className={`absolute left-0 w-64 bg-white shadow-lg transition-all duration-200 z-[1000] ${
                    selectedStore === store.id 
                      ? 'opacity-100 translate-y-3' 
                      : 'opacity-0 translate-y-0 pointer-events-none'
                  }`}
                  style={{ transform: 'translateX(-50%)' }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-semibold leading-tight text-black">
                        {store.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 leading-tight">
                      {formatAddress(store.location.address)}
                    </p>
                    {distanceInfo && (
                      <div className="flex items-center gap-2 text-xs mb-3">
                        <div className="inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                          <Navigation className="h-3 w-3 text-blue-500" />
                          <span className="text-blue-700 font-medium">
                            {distanceInfo.distance} mi
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span className="text-blue-700 font-medium">
                            {distanceInfo.time}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 h-7 text-xs font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${store.contact.phone}`, '_self');
                        }}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 h-7 text-xs font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.location.address)}`,
                            '_blank'
                          );
                        }}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}