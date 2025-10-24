import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BarChart3,
  Download,
  Fish,
  MapPin,
  Printer, RefreshCw,
  Target,
  Tractor, TreePine,
  User,
  Users
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import CustomInput from '../core/components/CustomInput';

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
    value: 'todas',
    label: 'Todas as Províncias',
    coordenadas: [-12.5, 18.5],
    zoom: 6
  },
  {
    value: 'luanda',
    label: 'Luanda',
    coordenadas: [-8.8390, 13.2894],
    zoom: 10,
    populacao: 8330000,
    area: 2418
  },
  {
    value: 'benguela',
    label: 'Benguela',
    coordenadas: [-12.5763, 13.4055],
    zoom: 9,
    populacao: 2530000,
    area: 31788
  },
  {
    value: 'huila',
    label: 'Huíla',
    coordenadas: [-14.9177, 15.7406],
    zoom: 8,
    populacao: 2497000,
    area: 79023
  },
  {
    value: 'bie',
    label: 'Bié',
    coordenadas: [-12.5085, 17.9145],
    zoom: 8,
    populacao: 1455000,
    area: 70314
  },
  {
    value: 'malanje',
    label: 'Malanje',
    coordenadas: [-9.5402, 16.3410],
    zoom: 8,
    populacao: 1016000,
    area: 97602
  },
  {
    value: 'huambo',
    label: 'Huambo',
    coordenadas: [-12.7756, 15.7631],
    zoom: 9,
    populacao: 2019000,
    area: 34274
  },
  {
    value: 'uige',
    label: 'Uíge',
    coordenadas: [-7.6086, 15.0527],
    zoom: 8,
    populacao: 1483000,
    area: 58698
  },
  {
    value: 'cunene',
    label: 'Cunene',
    coordenadas: [-16.9644, 15.1906],
    zoom: 8,
    populacao: 990000,
    area: 89342
  },
  {
    value: 'lunda_norte',
    label: 'Lunda Norte',
    coordenadas: [-8.8067, 20.3306],
    zoom: 8,
    populacao: 970000,
    area: 103760
  },
  {
    value: 'lunda_sul',
    label: 'Lunda Sul',
    coordenadas: [-10.7617, 20.0153],
    zoom: 8,
    populacao: 537000,
    area: 77637
  },
  {
    value: 'moxico',
    label: 'Moxico',
    coordenadas: [-11.6866, 19.9089],
    zoom: 7,
    populacao: 758000,
    area: 223023
  },
  {
    value: 'cuando_cubango',
    label: 'Cuando Cubango',
    coordenadas: [-17.0567, 18.2578],
    zoom: 7,
    populacao: 534000,
    area: 199049
  },
  {
    value: 'namibe',
    label: 'Namibe',
    coordenadas: [-15.1955, 12.1522],
    zoom: 8,
    populacao: 471000,
    area: 57091
  },
  {
    value: 'cabinda',
    label: 'Cabinda',
    coordenadas: [-5.5560, 12.2020],
    zoom: 9,
    populacao: 716000,
    area: 7270
  },
  {
    value: 'zaire',
    label: 'Zaire',
    coordenadas: [-6.2697, 14.1975],
    zoom: 9,
    populacao: 594000,
    area: 40130
  },
  {
    value: 'bengo',
    label: 'Bengo',
    coordenadas: [-8.8276, 13.8283],
    zoom: 9,
    populacao: 356000,
    area: 31371
  },
  {
    value: 'cuanza_norte',
    label: 'Cuanza Norte',
    coordenadas: [-9.1815, 15.0846],
    zoom: 9,
    populacao: 443000,
    area: 24110
  },
  {
    value: 'cuanza_sul',
    label: 'Cuanza Sul',
    coordenadas: [-11.2059, 14.9175],
    zoom: 9,
    populacao: 1881000,
    area: 55660
  }
];

// Dados estatísticos simulados por província (baseado no questionário SIGAF)
const estatisticasPorProvincia = {
  todas: {
    totalProdutores: 1850672,
    produtoresFemininos: 925336,
    produtoresMasculinos: 925336,
    agricultura: 1295470,
    pecuaria: 370134,
    agropecuaria: 185067,
    aquicultura: 15084,
    programasAtivos: 42,
    certificadosEmitidos: 987654,
    mediaIdade: 42.5,
    areaMediaHa: 2.8
  },
  luanda: {
    totalProdutores: 125340,
    produtoresFemininos: 75204,
    produtoresMasculinos: 50136,
    agricultura: 87738,
    pecuaria: 25068,
    agropecuaria: 12534,
    aquicultura: 6254,
    programasAtivos: 8,
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
    programasAtivos: 6,
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
    programasAtivos: 7,
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
    programasAtivos: 4,
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
    programasAtivos: 3,
    certificadosEmitidos: 65432,
    mediaIdade: 45.2,
    areaMediaHa: 4.1
  },
  // Adicionar dados para as outras províncias...
  huambo: {
    totalProdutores: 143567,
    produtoresFemininos: 71783,
    produtoresMasculinos: 71784,
    agricultura: 100497,
    pecuaria: 28713,
    agropecuaria: 14357,
    aquicultura: 718,
    programasAtivos: 5,
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
    programasAtivos: 3,
    certificadosEmitidos: 54321,
    mediaIdade: 44.6,
    areaMediaHa: 2.9
  }
};

// Componente para controlar o mapa
const MapController = ({ provincia, onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (provincia && provincia.value !== 'todas') {
      const provinciaData = provinciasAngola.find(p => p.value === provincia.value);
      if (provinciaData) {
        map.setView(provinciaData.coordenadas, provinciaData.zoom);
      }
    } else {
      // Visão geral de Angola
      map.setView([-12.5, 18.5], 6);
    }

    if (onMapReady) {
      onMapReady();
    }
  }, [provincia, map, onMapReady]);

  return null;
};

const Geolocalizacao = () => {
  const [provinciaeSelecionada, setProvinciaSelecionada] = useState(provinciasAngola[0]);
  const [loading, setLoading] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef(null);

  // Obter estatísticas da província selecionada
  const estatisticas = estatisticasPorProvincia[provinciaeSelecionada.value] || estatisticasPorProvincia.todas;

  // Função para atualizar província
  const handleProvinciaChange = (provincia) => {
    setLoading(true);
    setProvinciaSelecionada(provincia);

    // Simular carregamento
    setTimeout(() => {
      setLoading(false);
      setMapKey(prev => prev + 1); // Force map re-render
    }, 500);
  };

  // Função para exportar dados
  const handleExportarDados = () => {
    console.log('Exportando dados da província:', provinciaeSelecionada.label);
  };

  // Função para imprimir relatório
  const handleImprimirRelatorio = () => {
    window.print();
  };

  // Calcular percentuais
  const percentualFeminino = ((estatisticas.produtoresFemininos / estatisticas.totalProdutores) * 100).toFixed(1);
  const percentualMasculino = ((estatisticas.produtoresMasculinos / estatisticas.totalProdutores) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-green-600" />
                  Geolocalização das Unidades Produtivas
                </h1>
                <p className="text-gray-600 mt-1">
                  Mapeamento e estatísticas dos produtores por província
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleImprimirRelatorio}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </button>
                <button
                  onClick={handleExportarDados}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seletor de Província */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 relative z-50">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-50">
              <div className="relative z-50">
                <CustomInput
                  type="select"
                  label="Selecionar Província"
                  value={provinciaeSelecionada}
                  onChange={handleProvinciaChange}
                  options={provinciasAngola}
                  placeholder="Escolha uma província"
                  iconStart={<MapPin size={18} />}
                  className="w-full relative z-50"
                />
              </div>

              {provinciaeSelecionada.value !== 'todas' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Informações da Província</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">População:</span> {provinciaeSelecionada.populacao?.toLocaleString()} habitantes</p>
                    <p><span className="font-medium">Área:</span> {provinciaeSelecionada.area?.toLocaleString()} km²</p>
                    <p><span className="font-medium">Coordenadas:</span> {provinciaeSelecionada.coordenadas?.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa */}
          <div className="lg:col-span-2 z-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  {loading && <RefreshCw className="w-5 h-5 mr-2 text-green-600 animate-spin" />}
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Mapa de Angola - {provinciaeSelecionada.label}
                </h2>
              </div>

              <div className="p-4">
                <div className="h-[750px] w-full rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer
                    key={mapKey}
                    ref={mapRef}
                    center={provinciaeSelecionada.coordenadas}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                    className="leaflet-container"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapController
                      provincia={provinciaeSelecionada}
                      onMapReady={() => setLoading(false)}
                    />

                    {/* Marker para a província selecionada */}
                    {provinciaeSelecionada.value !== 'todas' && (
                      <Marker position={provinciaeSelecionada.coordenadas}>
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-gray-900">{provinciaeSelecionada.label}</h3>
                            <p className="text-sm text-gray-600">
                              {estatisticas.totalProdutores.toLocaleString()} produtores registados
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Markers para todas as províncias quando "todas" está selecionado */}
                    {provinciaeSelecionada.value === 'todas' &&
                      provinciasAngola.slice(1).map((provincia) => (
                        <Marker key={provincia.value} position={provincia.coordenadas}>
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-gray-900">{provincia.label}</h3>
                              <p className="text-sm text-gray-600">
                                {estatisticasPorProvincia[provincia.value]?.totalProdutores?.toLocaleString() || 'N/A'} produtores
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      ))
                    }
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="space-y-6">
            {/* Card principal */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Estatísticas Gerais
              </h3>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Produtores</p>
                      <p className="text-2xl font-bold text-green-700">
                        {estatisticas.totalProdutores.toLocaleString()}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-pink-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Feminino</p>
                        <p className="text-lg font-bold text-pink-700">
                          {estatisticas.produtoresFemininos.toLocaleString()}
                        </p>
                        <p className="text-xs text-pink-600">{percentualFeminino}%</p>
                      </div>
                      <User className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Masculino</p>
                        <p className="text-lg font-bold text-blue-700">
                          {estatisticas.produtoresMasculinos.toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-600">{percentualMasculino}%</p>
                      </div>
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Atividades produtivas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tractor className="w-5 h-5 mr-2 text-green-600" />
                Atividades Produtivas
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <TreePine className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Agricultura</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">
                    {estatisticas.agricultura.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Pecuária</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-700">
                    {estatisticas.pecuaria.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Tractor className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Agropecuária</span>
                  </div>
                  <span className="text-sm font-bold text-purple-700">
                    {estatisticas.agropecuaria.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Fish className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Aquicultura</span>
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    {estatisticas.aquicultura.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Indicadores adicionais */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Indicadores
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Programas Ativos</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {estatisticas.programasAtivos}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Certificados Emitidos</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {estatisticas.certificadosEmitidos.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Idade Média</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {estatisticas.mediaIdade} anos
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Área Média</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {estatisticas.areaMediaHa} ha
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Geolocalizacao;