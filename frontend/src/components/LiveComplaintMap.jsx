import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Filter, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function LiveComplaintMap({ complaints = [], onSelectComplaint }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map centered at Virudhunagar / Sivakasi district (lat: 9.50, lng: 77.80)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([9.50, 77.80], 10);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add Markers for each complaint
    complaints.forEach((comp) => {
      if (!comp.gps || !comp.gps.lat) return;

      let markerColor = '#f97316'; // Orange High default
      if (comp.status === 'Resolved') markerColor = '#16a34a'; // Green
      else if (comp.priority === 'Emergency') markerColor = '#dc2626'; // Red Emergency
      else if (comp.priority === 'Medium') markerColor = '#d97706'; // Yellow/Amber

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
          background-color: ${markerColor};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: justify-center;
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([comp.gps.lat, comp.gps.lng], { icon: customIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-xs space-y-1 font-sans';
      popupContent.innerHTML = `
        <div style="font-weight: 800; font-size: 13px; color: #1e1b4b;">${comp.complaintId}</div>
        <div style="font-weight: 700; color: #4338ca;">${comp.category}</div>
        <div style="color: #6b7280;">Location: <b>${comp.location}</b></div>
        <div style="margin-top: 4px; display: inline-block; padding: 2px 8px; border-radius: 99px; background: ${comp.status === 'Resolved' ? '#dcfce7' : '#fee2e2'}; color: ${comp.status === 'Resolved' ? '#16a34a' : '#dc2626'}; font-weight: 700;">
          ${comp.status}
        </div>
      `;

      marker.bindPopup(popupContent);
    });

  }, [complaints]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
      
      {/* Top Controls */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          <h3 className="font-extrabold text-indigo-950 text-sm">
            Live GIS Grievance Map (District Monitoring Engine)
          </h3>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-bold">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-600" /> Emergency
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-orange-500" /> High Priority
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-600" /> Resolved
          </span>
        </div>
      </div>

      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-[450px] z-0" />

    </div>
  );
}
