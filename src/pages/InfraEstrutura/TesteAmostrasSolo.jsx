import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Microscope,
    MapPin,
    Settings,
    Target,
    FileText,
    ChevronRight,
    ChevronLeft,
    Info,
    X,
    Camera,
    Upload,
    Users,
    Eye,
    AlertCircle,
    CheckCircle,
    Leaf,
    Beaker,
    TestTube,
    Activity
} from 'lucide-react';

import CustomInput from '../../components/CustomInput';
// Configuração do ícone do Leaflet
const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


// Componente para capturar cliques no mapa
const MapClickHandler = ({ onLocationSelect }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            onLocationSelect(lat.toFixed(6), lng.toFixed(6));
        }
    });
    return null;
};

// Componente de Mapa
const MapaGPS = ({ latitude, longitude, onLocationSelect }) => {
    const hasCoordinates = latitude && longitude && !isNaN(latitude) && !isNaN(longitude);
    const center = hasCoordinates ? [parseFloat(latitude), parseFloat(longitude)] : [-8.838333, 13.234444];

    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);

    return (
        <div className="w-full h-80 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <MapContainer
                center={center}
                zoom={hasCoordinates ? 16 : 6}
                className="w-full h-full"
                key={`${latitude}-${longitude}`}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler onLocationSelect={onLocationSelect} />
                {hasCoordinates && (
                    <Marker position={center} icon={defaultIcon}>
                        <Popup>
                            <div className="text-center">
                                <strong>Local da Amostra de Solo</strong><br />
                                Latitude: {latitude}°<br />
                                Longitude: {longitude}°
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

const TesteAmostrasSolo = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [saving, setSaving] = useState(false);

    // Dados das províncias
    const provincias = [
        { label: "Luanda", value: "LUANDA" },
        { label: "Benguela", value: "BENGUELA" },
        { label: "Huíla", value: "HUILA" },
        { label: "Cuando Cubango", value: "CUANDO_CUBANGO" },
        { label: "Namibe", value: "NAMIBE" }
    ];

    // Estado inicial
    const initialState = {
        // Informações Gerais
        dataColeta: new Date().toISOString().split('T')[0],
        tecnicoResponsavel: '',
        laboratorio: '',
        numeroAmostra: '',

        // Localização
        provincia: '',
        municipio: '',
        aldeia: '',
        latitude: '',
        longitude: '',
        altitude: '',
        precisao: '',

        // Coleta da Amostra
        profundidadeColeta: '',
        metodocoleta: '',
        culturaAtual: '',
        culturaAnterior: '',
        tipoSolo: '',
        cor: '',
        textura: '',
        drenagem: '',

        // Parâmetros Físicos
        ph: '',
        condutividadeEletrica: '',
        materiaOrganica: '',
        umidade: '',
        densidade: '',
        porosidade: '',

        // Macronutrientes
        nitrogenio: '',
        fosforo: '',
        potassio: '',
        calcio: '',
        magnesio: '',
        enxofre: '',

        // Micronutrientes
        ferro: '',
        manganes: '',
        zinco: '',
        cobre: '',
        boro: '',
        molibdenio: '',

        // Análise Complementar
        cationesTotais: '',
        saturacaoBases: '',
        capacidadeTrocaCationica: '',
        relacaoCN: '',

        // Recomendações
        recomendacoesCalcario: '',
        recomendacoesFertilizante: '',
        culturasRecomendadas: [],
        observacoes: '',

        // Anexos
        fotografias: null,
        resultadosLaboratorio: null
    };

    const [formData, setFormData] = useState(initialState);

    const steps = [
        { label: 'Informações Gerais', icon: FileText },
        { label: 'Localização', icon: MapPin },
        { label: 'Coleta da Amostra', icon: TestTube },
        { label: 'Análises', icon: Beaker },
        { label: 'Resultados', icon: Activity }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log('Dados do teste de solo:', formData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Teste de solo registrado com sucesso!');
            setFormData(initialState);
            setActiveIndex(0);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao registrar teste de solo. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Informações Gerais
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Informações Gerais</h3>
                            </div>
                            <p className="text-gray-600">
                                Dados básicos sobre a coleta e análise da amostra de solo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="date"
                                label="Data da Coleta"
                                value={formData.dataColeta}
                                onChange={(value) => handleInputChange('dataColeta', value)}
                                required
                            />

                            <CustomInput
                                type="text"
                                label="Técnico Responsável"
                                value={formData.tecnicoResponsavel}
                                onChange={(value) => handleInputChange('tecnicoResponsavel', value)}
                                placeholder="Nome do técnico responsável"
                                iconStart={<Users size={18} />}
                                required
                            />

                            <CustomInput
                                type="text"
                                label="Laboratório de Análise"
                                value={formData.laboratorio}
                                onChange={(value) => handleInputChange('laboratorio', value)}
                                placeholder="Nome do laboratório"
                                iconStart={<Microscope size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Número da Amostra"
                                value={formData.numeroAmostra}
                                onChange={(value) => handleInputChange('numeroAmostra', value)}
                                placeholder="Código de identificação da amostra"
                                iconStart={<TestTube size={18} />}
                                required
                            />
                        </div>
                    </div>
                );

            case 1: // Localização
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Localização da Amostra</h3>
                            </div>
                            <p className="text-gray-600">
                                Localização geográfica onde foi coletada a amostra de solo.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Localização Geográfica</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Província"
                                        value={formData.provincia}
                                        options={provincias}
                                        onChange={(value) => handleInputChange('provincia', value)}
                                        required
                                        iconStart={<MapPin size={18} />}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Município"
                                        value={formData.municipio}
                                        onChange={(value) => handleInputChange('municipio', value)}
                                        required
                                        placeholder="Nome do município"
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Aldeia/Zona"
                                        value={formData.aldeia}
                                        onChange={(value) => handleInputChange('aldeia', value)}
                                        required
                                        placeholder="Nome da aldeia"
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                    Coordenadas GPS
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                    <CustomInput
                                        type="number"
                                        label="Latitude"
                                        value={formData.latitude}
                                        onChange={(value) => handleInputChange('latitude', value)}
                                        step="any"
                                        placeholder="Ex: -8.838333"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Longitude"
                                        value={formData.longitude}
                                        onChange={(value) => handleInputChange('longitude', value)}
                                        step="any"
                                        placeholder="Ex: 13.234444"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Altitude (m)"
                                        value={formData.altitude}
                                        onChange={(value) => handleInputChange('altitude', value)}
                                        placeholder="Ex: 1628"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Precisão (m)"
                                        value={formData.precisao}
                                        onChange={(value) => handleInputChange('precisao', value)}
                                        placeholder="Ex: 3"
                                    />
                                </div>
                                <MapaGPS
                                    latitude={formData.latitude}
                                    longitude={formData.longitude}
                                    onLocationSelect={(lat, lng) => {
                                        handleInputChange('latitude', lat);
                                        handleInputChange('longitude', lng);
                                    }}
                                />
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600 flex items-center">
                                        <Info size={16} className="mr-2" />
                                        Clique no mapa para selecionar a localização da coleta
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Coleta da Amostra
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <TestTube className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Coleta da Amostra</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre o método e condições da coleta da amostra.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Método de Coleta</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Profundidade da Coleta"
                                        value={formData.profundidadeColeta}
                                        options={[
                                            { label: "0-15 cm", value: "0-15" },
                                            { label: "15-30 cm", value: "15-30" },
                                            { label: "30-60 cm", value: "30-60" },
                                            { label: "60-100 cm", value: "60-100" }
                                        ]}
                                        onChange={(value) => handleInputChange('profundidadeColeta', value)}
                                        required
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Método de Coleta"
                                        value={formData.metodocoleta}
                                        options={[
                                            { label: "Tradagem", value: "tradagem" },
                                            { label: "Perfil de solo", value: "perfil" },
                                            { label: "Amostragem simples", value: "simples" },
                                            { label: "Amostragem composta", value: "composta" }
                                        ]}
                                        onChange={(value) => handleInputChange('metodocoleta', value)}
                                        required
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Cultura Atual"
                                        value={formData.culturaAtual}
                                        onChange={(value) => handleInputChange('culturaAtual', value)}
                                        placeholder="Ex: Milho, Feijão, etc."
                                        iconStart={<Leaf size={18} />}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <CustomInput
                                        type="text"
                                        label="Cultura Anterior"
                                        value={formData.culturaAnterior}
                                        onChange={(value) => handleInputChange('culturaAnterior', value)}
                                        placeholder="Última cultura plantada"
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Tipo de Solo"
                                        value={formData.tipoSolo}
                                        options={[
                                            { label: "Arenoso", value: "arenoso" },
                                            { label: "Argiloso", value: "argiloso" },
                                            { label: "Franco", value: "franco" },
                                            { label: "Franco-arenoso", value: "franco-arenoso" },
                                            { label: "Franco-argiloso", value: "franco-argiloso" }
                                        ]}
                                        onChange={(value) => handleInputChange('tipoSolo', value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Características Visuais</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Cor do Solo"
                                        value={formData.cor}
                                        options={[
                                            { label: "Escuro/Preto", value: "escuro" },
                                            { label: "Marrom", value: "marrom" },
                                            { label: "Vermelho", value: "vermelho" },
                                            { label: "Amarelo", value: "amarelo" },
                                            { label: "Cinza", value: "cinza" }
                                        ]}
                                        onChange={(value) => handleInputChange('cor', value)}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Textura"
                                        value={formData.textura}
                                        options={[
                                            { label: "Muito fina", value: "muito-fina" },
                                            { label: "Fina", value: "fina" },
                                            { label: "Média", value: "media" },
                                            { label: "Grosseira", value: "grosseira" }
                                        ]}
                                        onChange={(value) => handleInputChange('textura', value)}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Drenagem"
                                        value={formData.drenagem}
                                        options={[
                                            { label: "Boa", value: "boa" },
                                            { label: "Moderada", value: "moderada" },
                                            { label: "Deficiente", value: "deficiente" },
                                            { label: "Muito deficiente", value: "muito-deficiente" }
                                        ]}
                                        onChange={(value) => handleInputChange('drenagem', value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Upload da Foto da Amostra</h4>
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleInputChange('fotografias', e.target.files)}
                                        id="fotografias-upload"
                                    />
                                    <label
                                        htmlFor="fotografias-upload"
                                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${formData.fotografias
                                            ? 'bg-green-50 border-green-300 hover:bg-green-100'
                                            : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                            }`}
                                    >
                                        <Camera className={`w-8 h-8 mb-3 ${formData.fotografias ? 'text-green-500' : 'text-gray-400'}`} />
                                        <p className={`text-sm font-medium ${formData.fotografias ? 'text-green-600' : 'text-gray-500'}`}>
                                            {formData.fotografias ? `${formData.fotografias.length} foto(s) carregada(s)` : 'Carregar fotografias da amostra'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Máximo 10MB por arquivo</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Análises
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Beaker className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Análises Laboratoriais</h3>
                            </div>
                            <p className="text-gray-600">
                                Resultados das análises físico-químicas da amostra de solo.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Parâmetros Físicos */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Parâmetros Físicos</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="pH"
                                        value={formData.ph}
                                        onChange={(value) => handleInputChange('ph', value)}
                                        placeholder="Ex: 6.5"
                                        step="0.1"
                                        helperText="Escala de 0 a 14"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Condutividade Elétrica (dS/m)"
                                        value={formData.condutividadeEletrica}
                                        onChange={(value) => handleInputChange('condutividadeEletrica', value)}
                                        placeholder="Ex: 0.5"
                                        step="0.01"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Matéria Orgânica (%)"
                                        value={formData.materiaOrganica}
                                        onChange={(value) => handleInputChange('materiaOrganica', value)}
                                        placeholder="Ex: 3.2"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Umidade (%)"
                                        value={formData.umidade}
                                        onChange={(value) => handleInputChange('umidade', value)}
                                        placeholder="Ex: 15.5"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Densidade (g/cm³)"
                                        value={formData.densidade}
                                        onChange={(value) => handleInputChange('densidade', value)}
                                        placeholder="Ex: 1.3"
                                        step="0.01"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Porosidade (%)"
                                        value={formData.porosidade}
                                        onChange={(value) => handleInputChange('porosidade', value)}
                                        placeholder="Ex: 45"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            {/* Macronutrientes */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Macronutrientes (mg/kg)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="Nitrogênio (N)"
                                        value={formData.nitrogenio}
                                        onChange={(value) => handleInputChange('nitrogenio', value)}
                                        placeholder="Ex: 120"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Fósforo (P)"
                                        value={formData.fosforo}
                                        onChange={(value) => handleInputChange('fosforo', value)}
                                        placeholder="Ex: 25"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Potássio (K)"
                                        value={formData.potassio}
                                        onChange={(value) => handleInputChange('potassio', value)}
                                        placeholder="Ex: 85"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Cálcio (Ca)"
                                        value={formData.calcio}
                                        onChange={(value) => handleInputChange('calcio', value)}
                                        placeholder="Ex: 150"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Magnésio (Mg)"
                                        value={formData.magnesio}
                                        onChange={(value) => handleInputChange('magnesio', value)}
                                        placeholder="Ex: 45"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Enxofre (S)"
                                        value={formData.enxofre}
                                        onChange={(value) => handleInputChange('enxofre', value)}
                                        placeholder="Ex: 12"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            {/* Micronutrientes */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Micronutrientes (mg/kg)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="Ferro (Fe)"
                                        value={formData.ferro}
                                        onChange={(value) => handleInputChange('ferro', value)}
                                        placeholder="Ex: 25"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Manganês (Mn)"
                                        value={formData.manganes}
                                        onChange={(value) => handleInputChange('manganes', value)}
                                        placeholder="Ex: 8.5"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Zinco (Zn)"
                                        value={formData.zinco}
                                        onChange={(value) => handleInputChange('zinco', value)}
                                        placeholder="Ex: 2.1"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Cobre (Cu)"
                                        value={formData.cobre}
                                        onChange={(value) => handleInputChange('cobre', value)}
                                        placeholder="Ex: 1.5"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Boro (B)"
                                        value={formData.boro}
                                        onChange={(value) => handleInputChange('boro', value)}
                                        placeholder="Ex: 0.8"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Molibdênio (Mo)"
                                        value={formData.molibdenio}
                                        onChange={(value) => handleInputChange('molibdenio', value)}
                                        placeholder="Ex: 0.2"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {/* Análise Complementar */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Análise Complementar</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="CTC - Capacidade de Troca Catiônica (cmolc/dm³)"
                                        value={formData.capacidadeTrocaCationica}
                                        onChange={(value) => handleInputChange('capacidadeTrocaCationica', value)}
                                        placeholder="Ex: 8.5"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Saturação por Bases (%)"
                                        value={formData.saturacaoBases}
                                        onChange={(value) => handleInputChange('saturacaoBases', value)}
                                        placeholder="Ex: 65"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Soma de Bases (cmolc/dm³)"
                                        value={formData.cationesTotais}
                                        onChange={(value) => handleInputChange('cationesTotais', value)}
                                        placeholder="Ex: 5.5"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Relação C/N"
                                        value={formData.relacaoCN}
                                        onChange={(value) => handleInputChange('relacaoCN', value)}
                                        placeholder="Ex: 12"
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Resultados e Recomendações
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Resultados e Recomendações</h3>
                            </div>
                            <p className="text-gray-600">
                                Interpretação dos resultados e recomendações técnicas.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Recomendações de Manejo</h4>
                                
                                <div className="space-y-6">
                                    <CustomInput
                                        type="textarea"
                                        label="Recomendações de Calagem"
                                        value={formData.recomendacoesCalcario}
                                        onChange={(value) => handleInputChange('recomendacoesCalcario', value)}
                                        placeholder="Tipo e quantidade de calcário recomendado"
                                        rows={3}
                                    />

                                    <CustomInput
                                        type="textarea"
                                        label="Recomendações de Fertilização"
                                        value={formData.recomendacoesFertilizante}
                                        onChange={(value) => handleInputChange('recomendacoesFertilizante', value)}
                                        placeholder="Fertilizantes e dosagens recomendadas"
                                        rows={4}
                                    />

                                    <CustomInput
                                        type="multiselect"
                                        label="Culturas Recomendadas"
                                        value={formData.culturasRecomendadas}
                                        options={[
                                            { label: "Milho", value: "milho" },
                                            { label: "Feijão", value: "feijao" },
                                            { label: "Soja", value: "soja" },
                                            { label: "Arroz", value: "arroz" },
                                            { label: "Batata-doce", value: "batata_doce" },
                                            { label: "Mandioca", value: "mandioca" },
                                            { label: "Tomate", value: "tomate" },
                                            { label: "Cebola", value: "cebola" },
                                            { label: "Couve", value: "couve" },
                                            { label: "Alface", value: "alface" },
                                            { label: "Café", value: "cafe" },
                                            { label: "Banana", value: "banana" }
                                        ]}
                                        onChange={(value) => handleInputChange('culturasRecomendadas', value)}
                                        placeholder="Culturas adequadas para este solo"
                                    />

                                    <CustomInput
                                        type="textarea"
                                        label="Observações Gerais"
                                        value={formData.observacoes}
                                        onChange={(value) => handleInputChange('observacoes', value)}
                                        placeholder="Observações adicionais e recomendações específicas"
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* Upload de Resultados */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Anexar Resultados do Laboratório</h4>
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                        multiple
                                        onChange={(e) => handleInputChange('resultadosLaboratorio', e.target.files)}
                                        id="resultados-upload"
                                    />
                                    <label
                                        htmlFor="resultados-upload"
                                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${formData.resultadosLaboratorio
                                            ? 'bg-green-50 border-green-300 hover:bg-green-100'
                                            : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                            }`}
                                    >
                                        <Upload className={`w-8 h-8 mb-3 ${formData.resultadosLaboratorio ? 'text-green-500' : 'text-gray-400'}`} />
                                        <p className={`text-sm font-medium ${formData.resultadosLaboratorio ? 'text-green-600' : 'text-gray-500'}`}>
                                            {formData.resultadosLaboratorio ? `${formData.resultadosLaboratorio.length} arquivo(s) carregado(s)` : 'Carregar resultados do laboratório'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, JPG, PNG - Máximo 10MB por arquivo</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="text-center mb-6 p-10 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                <h1 className="text-4xl font-bold mb-3 text-gray-800">Teste de Amostras de Solo</h1>
                <p className="text-gray-600">Sistema Nacional de Registo de Pequenos Agricultores</p>
            </div>

            {/* Stepper */}
            <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
                {steps.map((stepObj, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${idx > activeIndex ? 'opacity-50' : ''
                            }`}
                        onClick={() => idx <= activeIndex && setActiveIndex(idx)}
                    >
                        <div
                            className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${idx < activeIndex
                                ? 'bg-cyan-500 text-white'
                                : idx === activeIndex
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {React.createElement(stepObj.icon, { size: 28, className: "mx-auto" })}
                        </div>
                        <span
                            className={`text-sm text-center font-medium ${idx === activeIndex ? 'text-cyan-700' : 'text-gray-500'
                                }`}
                        >
                            {stepObj.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
                <div
                    className="bg-cyan-600 h-2 transition-all duration-300 rounded-full"
                    style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                ></div>
            </div>

            {/* Content */}
            <div className="step-content p-8 bg-white min-h-[600px]">
                {renderStepContent(activeIndex)}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
                <button
                    className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0
                        ? 'opacity-50 cursor-not-allowed bg-gray-100'
                        : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                        }`}
                    onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                    disabled={activeIndex === 0}
                >
                    <ChevronLeft className="mr-2" size={16} />
                    Anterior
                </button>

                <div className="text-sm text-gray-500 font-medium">
                    Etapa {activeIndex + 1} de {steps.length}
                </div>

                <div className="flex space-x-3">
                    <button
                        className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${activeIndex === steps.length - 1
                            ? (saving
                                ? 'bg-cyan-400 cursor-not-allowed'
                                : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg')
                            : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg'
                            }`}
                        onClick={() => {
                            if (activeIndex === steps.length - 1) {
                                handleSave();
                            } else {
                                setActiveIndex(Math.min(steps.length - 1, activeIndex + 1));
                            }
                        }}
                        disabled={activeIndex === steps.length - 1 && saving}
                    >
                        {activeIndex === steps.length - 1 ? (
                            saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Salvando...
                                </>
                            ) : (
                                'Finalizar Análise'
                            )
                        ) : (
                            'Próximo'
                        )}
                        <ChevronRight className="ml-2" size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TesteAmostrasSolo;