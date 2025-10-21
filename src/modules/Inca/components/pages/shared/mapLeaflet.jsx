import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info, MapPin } from "lucide-react";
import React, { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

// Configuração do ícone padrão do Leaflet
const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Componente para capturar cliques no mapa
const MapClickHandler = ({ onLocationSelect, isClickEnabled }) => {
  useMapEvents({
    click: (e) => {
      if (isClickEnabled && onLocationSelect) {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat.toFixed(6), lng.toFixed(6));
      }
    },
  });
  return null;
};

/**
 * Componente de Mapa Leaflet Reutilizável
 *
 * @param {Object} props - Propriedades do componente
 * @param {string|number} props.latitude - Latitude da localização
 * @param {string|number} props.longitude - Longitude da localização
 * @param {Function} props.onLocationSelect - Callback quando o usuário clica no mapa (lat, lng)
 * @param {string} props.height - Altura do mapa (padrão: 'h-80')
 * @param {number} props.zoom - Nível de zoom quando há coordenadas (padrão: 16)
 * @param {number} props.defaultZoom - Nível de zoom quando não há coordenadas (padrão: 6)
 * @param {Array} props.defaultCenter - Centro padrão do mapa [lat, lng] (padrão: Luanda)
 * @param {boolean} props.showPopup - Mostrar popup no marcador (padrão: true)
 * @param {string} props.popupTitle - Título do popup (padrão: 'Localização')
 * @param {boolean} props.showClickInfo - Mostrar mensagem informativa sobre clique (padrão: true)
 * @param {string} props.clickInfoText - Texto da mensagem informativa
 * @param {boolean} props.isClickEnabled - Habilitar clique no mapa (padrão: true)
 * @param {Object} props.customIcon - Ícone customizado do Leaflet
 * @param {string} props.className - Classes CSS adicionais para o container
 */
const MapaLeaflet = ({
  latitude,
  longitude,
  onLocationSelect,
  height = "h-80",
  zoom = 16,
  defaultZoom = 6,
  defaultCenter = [-8.838333, 13.234444], // Luanda, Angola
  showPopup = true,
  popupTitle = "Localização",
  showClickInfo = true,
  clickInfoText = "Clique no mapa para selecionar uma localização automaticamente",
  isClickEnabled = true,
  customIcon = null,
  className = "",
}) => {
  // Verifica se há coordenadas válidas
  const hasCoordinates =
    latitude && longitude && !isNaN(latitude) && !isNaN(longitude);
  const center = hasCoordinates
    ? [parseFloat(latitude), parseFloat(longitude)]
    : defaultCenter;

  // Configura o ícone padrão do Leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  // Define o ícone a ser usado
  const markerIcon = customIcon || defaultIcon;

  return (
    <div className={className}>
      <div
        className={`w-full ${height} border border-gray-200 rounded-xl overflow-hidden shadow-sm`}
      >
        <MapContainer
          center={center}
          zoom={hasCoordinates ? zoom : defaultZoom}
          className="w-full h-full"
          key={`${latitude}-${longitude}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler
            onLocationSelect={onLocationSelect}
            isClickEnabled={isClickEnabled}
          />
          {hasCoordinates && (
            <Marker position={center} icon={markerIcon}>
              {showPopup && (
                <Popup>
                  <div className="text-center">
                    <strong>{popupTitle}</strong>
                    <br />
                    Latitude: {parseFloat(latitude).toFixed(6)}°<br />
                    Longitude: {parseFloat(longitude).toFixed(6)}°
                  </div>
                </Popup>
              )}
            </Marker>
          )}
        </MapContainer>
      </div>

      {showClickInfo && isClickEnabled && onLocationSelect && (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-600 flex items-center">
            <Info size={16} className="mr-2 flex-shrink-0" />
            {clickInfoText}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapaLeaflet;
