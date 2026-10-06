import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const createRoverIcon = (isConnected) => {
  const color = isConnected ? '#059669' : '#e11d48';
  return L.divIcon({
    className: 'custom-rover-marker',
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        border: 3px solid ${color};
        border-radius: 50%;
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: ${color};
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

export default function FieldMap({ telemetry, isConnected = false }) {
  const { t } = useTranslation();

  const lat = isConnected && telemetry?.gps?.lat ? telemetry.gps.lat : 16.5062;
  const lng = isConnected && telemetry?.gps?.lng ? telemetry.gps.lng : 80.6480;
  const status = telemetry?.status || 'Idle';

  const fieldPolygon = [
    [16.5075, 80.6465],
    [16.5075, 80.6495],
    [16.5050, 80.6495],
    [16.5050, 80.6465],
  ];

  const [pathTrail, setPathTrail] = useState([
    [16.5060, 80.6470],
    [16.5062, 80.6475],
    [16.5062, 80.6480],
  ]);

  useEffect(() => {
    if (isConnected && telemetry?.gps?.lat && telemetry?.gps?.lng) {
      setPathTrail((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last[0] !== telemetry.gps.lat || last[1] !== telemetry.gps.lng) {
          return [...prev.slice(-30), [telemetry.gps.lat, telemetry.gps.lng]];
        }
        return prev;
      });
    }
  }, [isConnected, telemetry?.gps?.lat, telemetry?.gps?.lng]);

  return (
    <Card className="p-0 border-slate-200 overflow-hidden shadow-canva-card space-y-0 bg-white">
      {/* Map Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">{t('robot.title') || 'GPS Field Trajectory & Geo-Fencing'}</h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Sector A-4 • {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'success' : 'danger'} pulse={isConnected}>
            {isConnected ? 'LIVE WAYPOINTS' : 'OFFLINE'}
          </Badge>
        </div>
      </div>

      {/* Leaflet Map Viewport Container */}
      <div className="relative h-[380px] w-full bg-slate-50">
        <MapContainer
          center={[lat, lng]}
          zoom={17}
          scrollWheelZoom={false}
          className="h-full w-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polygon
            positions={fieldPolygon}
            pathOptions={{
              color: '#059669',
              fillColor: '#10b981',
              fillOpacity: 0.15,
              weight: 2,
              dashArray: '4, 8',
            }}
          />

          <Polyline
            positions={pathTrail}
            pathOptions={{
              color: '#0284c7',
              weight: 3,
              opacity: 0.8,
            }}
          />

          <Marker position={[lat, lng]} icon={createRoverIcon(isConnected)}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 space-y-1 text-slate-900 font-sans">
                <div className="font-black text-xs">AgriRover V2.4</div>
                <div className="text-[11px]">Status: <strong>{status}</strong></div>
                <div className="text-[11px]">Speed: <strong>{telemetry?.speed_kmh || 0} km/h</strong></div>
                <div className="text-[10px] text-slate-600 font-mono">{lat.toFixed(5)}, {lng.toFixed(5)}</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 rounded-2xl bg-white/90 border border-slate-200 p-2.5 backdrop-blur-md text-[10px] font-bold text-slate-700 space-y-1 shadow-md pointer-events-none">
          <div className="flex items-center gap-1.5 text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600" /> Sector A-4 (12.5 Acres)
          </div>
          <div className="flex items-center gap-1.5 text-sky-800">
            <span className="h-0.5 w-3 bg-sky-600" /> Autonomous Waypoint Path
          </div>
        </div>
      </div>
    </Card>
  );
}
