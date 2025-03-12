// MapComponent.tsx
import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    L: any;
  }
}

interface MapComponentProps {
  address: string;
}

function MapComponent({ address }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // If we already have a map instance, do nothing
    if (mapInstanceRef.current) return;

    if (!mapRef.current || !window.L) return; // Safety checks

    // Initialize the map
    const lat = 42.0984;
    const lng = -75.9139;

    const map = window.L.map(mapRef.current).setView([lat, lng], 16);
    mapInstanceRef.current = map;

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add a custom icon & marker
    const customIcon = window.L.divIcon({
      className: "custom-map-marker",
      html: `
        <div class="pin-image-container">
          <img
            src="https://d2s742iet3d3t1.cloudfront.net/restaurants/restaurant-169145000000000000/banner_1704835055.png?size=medium"
            alt="Crowbar Arcade"
            class="pin-image"
          />
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    window.L.marker([lat, lng], { icon: customIcon }).addTo(map);

    // Cleanup: remove the map instance on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    />
  );
}

export default MapComponent;
