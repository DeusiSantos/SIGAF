import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
  MapPin, Users, User, Tractor, TreePine, Fish, 
  BarChart3, TrendingUp, Target, Zap
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para os ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Dados das províncias de Angola com coordenadas
const provinciasAngola = [
  {
    value: 'luanda',
    label: 'Luanda',
    coordenadas: [-8.8390, 13.2894],
    populacao: 8330000,
    area: 2418
  },
  {
    value: 'benguela',
    label: 'Benguela',
    coordenadas: [-12.5763, 13.4055],
    populacao: 2530000,
    area: 31788
  },
  {
    value: 'huila',
    label: 'Huíla',
    coordenadas: [-14.9177, 15.7406],
    populacao: 2497000,
    area: 79023
  },
  {
    value: 'bie',
    label: 'Bié',
    coordenadas: [-12.5085, 17.9145],
    populacao: 1455000,
    area: 70314
  },
  {
    value: 'malanje',
    label: 'Malanje',
    coordenadas: [-9.5402, 16.3410],
    populacao: 1016000,
    area: 97602
  },
  {
    value: 'huambo',
    label: 'Huambo',
    coordenadas: [-12.7756, 15.7631],
    populacao: 2019000,
    area: 34274
  },
  {
    value: 'uige',
    label: 'Uíge',
    coordenadas: [-7.6086, 15.0527],
    populacao: 1483000,
    area: 58698
  },
  {
    value: 'cunene',
    label: 'Cunene',
    coordenadas: [-16.9644, 15.1906],
    populacao: 990000,
    area: 89342
  },
  {
    value: 'lunda_norte',
    label: 'Lunda Norte',
    coordenadas: [-8.8067, 20.3306],
    populacao: 970000,
    area: 103760
  },
  {
    value: 'lunda_sul',
    label: 'Lunda Sul',
    coordenadas: [-10.7617, 20.0153],
    populacao: 537000,
    area: 77637
  },
  {
    value: 'moxico',
    label: 'Moxico',
    coordenadas: [-11.6866, 19.9089],
    populacao: 758000,
    area: 223023
  },
  {
    value: 'cuando_cubango',
    label: 'Cuando Cubango',
    coordenadas: [-17.0567, 18.2578],
    populacao: 534000,
    area: 199049
  },
  {
    value: 'namibe',
    label: 'Namibe',
    coordenadas: [-15.1955, 12.1522],
    populacao: 471000,
    area: 57091
  },
  {
    value: 'cabinda',
    label: 'Cabinda',
    coordenadas: [-5.5560, 12.2020],
    populacao: 716000,
    area: 7270
  },
  {
    value: 'zaire',
    label: 'Zaire',
    coordenadas: [-6.2697, 14.1975],
    populacao: 594000,
    area: 40130
  },
  {
    value: 'bengo',
    label: 'Bengo',
    coordenadas: [-8.8276, 13.8283],
    populacao: 356000,
    area: 31371
  },
  {
    value: 'cuanza_norte',
    label: 'Cuanza Norte',
    coordenadas: [-9.1815, 15.0846],
    populacao: 443000,
    area: 24110
  },
  {
    value: 'cuanza_sul',
    label: 'Cuanza Sul',
    coordenadas: [-11.2059, 14.9175],
    populacao: 1881000,
    area: 55660
  }
];

// Dados estatísticos por província (baseado no questionário SIGAF)
const estatisticasPorProvincia = {
  luanda: {
    totalProdutores: 125340,
    produtoresFemininos: 75204,
    produtoresMasculinos: 50136,
    agricultura: 87738,
    pecuaria: 25068,
    agropecuaria: 12534,
    aquicultura: 6254,
    certificadosEmitidos: 98756,
    mediaIdade: 38.2,
    areaMediaHa: 1.8
  },
  benguela: {
    totalProdutores: 156789,
    produtoresFemininos: 78394,
    produtoresMasculinos: 78395,
    agricultura: 109752,
    pecuaria: 31358,
    agropecuaria: 15679,
    aquicultura: 7834,
    certificadosEmitidos: 123456,
    mediaIdade: 41.8,
    areaMediaHa: 3.2
  },
  huila: {
    totalProdutores: 189234,
    produtoresFemininos: 94617,
    produtoresMasculinos: 94617,
    agricultura: 132464,
    pecuaria: 37847,
    agropecuaria: 18923,
    aquicultura: 945,
    certificadosEmitidos: 156789,
    mediaIdade: 44.1,
    areaMediaHa: 4.5
  },
  bie: {
    totalProdutores: 98765,
    produtoresFemininos: 49382,
    produtoresMasculinos: 49383,
    agricultura: 69136,
    pecuaria: 19753,
    agropecuaria: 9876,
    aquicultura: 494,
    certificadosEmitidos: 76543,
    mediaIdade: 43.7,
    areaMediaHa: 3.8
  },
  malanje: {
    totalProdutores: 87654,
    produtoresFemininos: 43827,
    produtoresMasculinos: 43827,
    agricultura: 61358,
    pecuaria: 17531,
    agropecuaria: 8765,
    aquicultura: 438,
    certificadosEmitidos: 65432,
    mediaIdade: 45.2,
    areaMediaHa: 4.1
  },
  huambo: {
    totalProdutores: 143567,
    produtoresFemininos: 71783,
    produtoresMasculinos: 71784,
    agricultura: 100497,
    pecuaria: 28713,
    agropecuaria: 14357,
    aquicultura: 718,
    certificadosEmitidos: 112345,
    mediaIdade: 42.9,
    areaMediaHa: 3.6
  },
  uige: {
    totalProdutores: 76543,
    produtoresFemininos: 38271,
    produtoresMasculinos: 38272,
    agricultura: 53580,
    pecuaria: 15309,
    agropecuaria: 7654,
    aquicultura: 383,
    certificadosEmitidos: 54321,
    mediaIdade: 44.6,
    areaMediaHa: 2.9
  },
  cunene: {
    totalProdutores: 65432,
    produtoresFemininos: 32716,
    produtoresMasculinos: 32716,
    agricultura: 45802,
    pecuaria: 13086,
    agropecuaria: 6543,
    aquicultura: 327,
    certificadosEmitidos: 45678,
    mediaIdade: 46.3,
    areaMediaHa: 5.2
  },
  lunda_norte: {
    totalProdutores: 54321,
    produtoresFemininos: 27160,
    produtoresMasculinos: 27161,
    agricultura: 38025,
    pecuaria: 10864,
    agropecuaria: 5432,
    aquicultura: 271,
    certificadosEmitidos: 38901,
    mediaIdade: 43.8,
    areaMediaHa: 4.7
  },
  lunda_sul: {
    totalProdutores: 43210,
    produtoresFemininos: 21605,
    produtoresMasculinos: 21605,
    agricultura: 30247,
    pecuaria: 8642,
    agropecuaria: 4321,
    aquicultura: 216,
    certificadosEmitidos: 32109,
    mediaIdade: 44.9,
    areaMediaHa: 3.9
  },
  moxico: {
    totalProdutores: 67890,
    produtoresFemininos: 33945,
    produtoresMasculinos: 33945,
    agricultura: 47523,
    pecuaria: 13578,
    agropecuaria: 6789,
    aquicultura: 339,
    certificadosEmitidos: 51234,
    mediaIdade: 45.7,
    areaMediaHa: 6.1
  },
  cuando_cubango: {
    totalProdutores: 45678,
    produtoresFemininos: 22839,
    produtoresMasculinos: 22839,
    agricultura: 31975,
    pecuaria: 9136,
    agropecuaria: 4568,
    aquicultura: 228,
    certificadosEmitidos: 34567,
    mediaIdade: 47.2,
    areaMediaHa: 7.3
  },
  namibe: {
    totalProdutores: 38901,
    produtoresFemininos: 19450,
    produtoresMasculinos: 19451,
    agricultura: 27231,
    pecuaria: 7780,
    agropecuaria: 3890,
    aquicultura: 194,
    certificadosEmitidos: 29876,
    mediaIdade: 44.1,
    areaMediaHa: 4.8
  },
  cabinda: {
    totalProdutores: 56789,
    produtoresFemininos: 28394,
    produtoresMasculinos: 28395,
    agricultura: 39752,
    pecuaria: 11358,
    agropecuaria: 5679,
    aquicultura: 284,
    certificadosEmitidos: 42345,
    mediaIdade: 41.6,
    areaMediaHa: 2.7
  },
  zaire: {
    totalProdutores: 49876,
    produtoresFemininos: 24938,
    produtoresMasculinos: 24938,
    agricultura: 34913,
    pecuaria: 9975,
    agropecuaria: 4988,
    aquicultura: 249,
    certificadosEmitidos: 37890,
    mediaIdade: 43.4,
    areaMediaHa: 3.1
  },
  bengo: {
    totalProdutores: 32145,
    produtoresFemininos: 16072,
    produtoresMasculinos: 16073,
    agricultura: 22501,
    pecuaria: 6429,
    agropecuaria: 3215,
    aquicultura: 161,
    certificadosEmitidos: 24567,
    mediaIdade: 40.3,
    areaMediaHa: 2.4
  },
  cuanza_norte: {
    totalProdutores: 41234,
    produtoresFemininos: 20617,
    produtoresMasculinos: 20617,
    agricultura: 28864,
    pecuaria: 8247,
    agropecuaria: 4123,
    aquicultura: 206,
    certificadosEmitidos: 31789,
    mediaIdade: 42.7,
    areaMediaHa: 3.3
  },
  cuanza_sul: {
    totalProdutores: 178901,
    produtoresFemininos: 89450,
    produtoresMasculinos: 89451,
    agricultura: 125231,
    pecuaria: 35780,
    agropecuaria: 17890,
    aquicultura: 895,
    certificadosEmitidos: 134567,
    mediaIdade: 43.9,
    areaMediaHa: 4.2
  }
};

// Ícone customizado para os markers - Tema Azul
const createCustomIcon = (totalProdutores) => {
  // Tamanho otimizado - menor mas ainda visível
  const size = Math.min(Math.max(totalProdutores / 4000, 25), 45);
  const fontSize = Math.max(size/3.5, 11);
  const displayValue = totalProdutores >= 1000 ? `${(totalProdutores / 1000).toFixed(0)}k` : totalProdutores.toString();
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #2563eb, #1d4ed8, #1e40af);
        border: 3px solid white;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 800;
        font-size: ${fontSize}px;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
        box-shadow: 0 4px 15px rgba(0,0,0,0.4), 0 0 0 2px rgba(37,99,235,0.3);
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      " 
      onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.5), 0 0 0 3px rgba(37,99,235,0.5)';"
      onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.4), 0 0 0 2px rgba(37,99,235,0.3)';">
        ${displayValue}
        <div style="
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #fbbf24;
          border: 2px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }
      </style>
    `,
    iconSize: [size + 6, size + 6],
    iconAnchor: [(size + 6)/2, (size + 6)/2]
  });
};

const DashboardAngola = () => {
  const [provinciaSelecionada, setProvinciaSelecionada] = useState('luanda');
  const [hoveredProvincia, setHoveredProvincia] = useState(null);

  const estatisticasAtual = estatisticasPorProvincia[provinciaSelecionada];
  
  // Calcular total geral
  const totalGeral = Object.values(estatisticasPorProvincia).reduce(
    (acc, stats) => acc + stats.totalProdutores, 0
  );

  const percentualFeminino = ((estatisticasAtual.produtoresFemininos / estatisticasAtual.totalProdutores) * 100).toFixed(1);

  const handleProvinciaClick = (provinciaValue) => {
    setProvinciaSelecionada(provinciaValue);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <style jsx>{`
        .leaflet-popup-content-wrapper {
          border-radius: 15px !important;
          box-shadow: 0 15px 50px rgba(0,0,0,0.25) !important;
          border: 3px solid #ddd6fe !important;
        }
        
        .leaflet-popup-tip {
          border-top-color: #ddd6fe !important;
        }
        
        .custom-marker:hover {
          filter: brightness(1.2) saturate(1.3);
        }
        
        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.5 !important;
        }
        
        .leaflet-control-zoom a {
          background: white !important;
          border: 3px solid #e5e7eb !important;
          color: #374151 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          font-weight: bold !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #f8fafc !important;
          border-color: #2563eb !important;
          color: #2563eb !important;
        }
      `}</style>
      <div className="w-full">
        {/* Header Dashboard */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
          
          {/* Estatísticas Gerais */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Nacional</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalGeral.toLocaleString()}
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Províncias</p>
                    <p className="text-2xl font-bold text-gray-900">18</p>
                  </div>
                  <Target className="w-10 h-10 text-indigo-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Certificados</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estatisticasAtual.certificadosEmitidos.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Área Média</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estatisticasAtual.areaMediaHa} ha
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                  Mapa Interativo de Angola
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Clique nos marcadores para ver detalhes por província
                </p>
              </div>
              
              <div className="h-[600px] w-full">
                <MapContainer
                  center={[-12.5, 18.5]}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                  className="leaflet-container"
                  scrollWheelZoom={true}
                  dragging={true}
                  zoomControl={true}
                  worldCopyJump={false}
                  maxBounds={null}
                  minZoom={1}
                  maxZoom={18}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {provinciasAngola.map((provincia) => {
                    const stats = estatisticasPorProvincia[provincia.value];
                    if (!stats) return null;
                    
                    const isSelected = provinciaSelecionada === provincia.value;
                    const isHovered = hoveredProvincia === provincia.value;
                    
                    return (
                      <Marker
                        key={provincia.value}
                        position={provincia.coordenadas}
                        icon={createCustomIcon(stats.totalProdutores)}
                        eventHandlers={{
                          click: () => handleProvinciaClick(provincia.value),
                          mouseover: () => setHoveredProvincia(provincia.value),
                          mouseout: () => setHoveredProvincia(null)
                        }}
                      >
                        <Popup className="custom-popup">
                          <div className="p-4 min-w-[280px]">
                            <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                              {provincia.label}
                            </h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                                <span className="text-gray-700 font-medium">Total Produtores:</span>
                                <span className="font-bold text-lg text-blue-700">
                                  {stats.totalProdutores.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Agricultura:</span>
                                <span className="font-semibold text-green-600">
                                  {stats.agricultura.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Pecuária:</span>
                                <span className="font-semibold text-yellow-600">
                                  {stats.pecuaria.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Agropecuária:</span>
                                <span className="font-semibold text-purple-600">
                                  {stats.agropecuaria.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Aquicultura:</span>
                                <span className="font-semibold text-blue-600">
                                  {stats.aquicultura.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg mt-3">
                                <span className="text-gray-700 font-medium">Certificados:</span>
                                <span className="font-bold text-indigo-700">
                                  {stats.certificadosEmitidos.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleProvinciaClick(provincia.value)}
                              className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md text-sm"
                            >
                              Ver Detalhes Completos
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Painel de Detalhes */}
          <div className="space-y-6">
            {/* Província Selecionada */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white relative">
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-lg font-bold flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  {provinciasAngola.find(p => p.value === provinciaSelecionada)?.label}
                </h3>
                <p className="text-blue-100 text-sm mt-1">Província Ativa</p>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Produtores</p>
                      <p className="text-3xl font-bold text-blue-700">
                        {estatisticasAtual.totalProdutores.toLocaleString()}
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-blue-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-pink-50 rounded-xl p-3">
                    <div className="text-center">
                      <User className="w-6 h-6 text-pink-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Feminino</p>
                      <p className="text-lg font-bold text-pink-700">
                        {percentualFeminino}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-3">
                    <div className="text-center">
                      <User className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Masculino</p>
                      <p className="text-lg font-bold text-indigo-700">
                        {(100 - parseFloat(percentualFeminino)).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Atividades Produtivas */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="p-4 border-b">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Tractor className="w-5 h-5 mr-2 text-blue-600" />
                  Atividades Produtivas
                </h3>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
                  <div className="flex items-center">
                    <TreePine className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Agricultura</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">
                    {estatisticasAtual.agricultura.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-yellow-50 rounded-xl p-3">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium">Pecuária</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-700">
                    {estatisticasAtual.pecuaria.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-purple-50 rounded-xl p-3">
                  <div className="flex items-center">
                    <Tractor className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium">Agropecuária</span>
                  </div>
                  <span className="text-sm font-bold text-purple-700">
                    {estatisticasAtual.agropecuaria.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
                  <div className="flex items-center">
                    <Fish className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Aquicultura</span>
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    {estatisticasAtual.aquicultura.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Indicadores */}
            {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="p-4 border-b">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Indicadores
                </h3>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Idade Média</span>
                  <span className="text-sm font-bold text-gray-900">
                    {estatisticasAtual.mediaIdade} anos
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Área Média</span>
                  <span className="text-sm font-bold text-gray-900">
                    {estatisticasAtual.areaMediaHa} hectares
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Certificados</span>
                  <span className="text-sm font-bold text-gray-900">
                    {estatisticasAtual.certificadosEmitidos.toLocaleString()}
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAngola;