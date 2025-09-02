import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Droplets,
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
    Leaf
} from 'lucide-react';
import CustomInput from '../../components/CustomInput';
import provinciasData from '../../components/Provincias.json';

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
}

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
                                <strong>Localização da Fonte de Água</strong><br />
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



const CadastroFontesAgua = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const [municipiosOptions, setMunicipiosOptions] = useState([]);

    // Estado inicial
    const initialState = {
        // Informações Gerais
        dataRegistro: new Date().toISOString().split('T')[0],
        informacoesGerais: '',
        equipeTecnica: '',

        // Localização
        provincia: '',
        municipio: '',
        aldeia: '',

        // Identificação da Fonte de Água
        tipoFonte: '',
        outroTipo: '',
        nomeLocal: '',
        latitude: '',
        longitude: '',
        altitude: '',
        precisao: '',
        distanciaParcelas: '',

        // Disponibilidade Hídrica
        vazaoEstimada: '',
        unidadeVazao: '',
        profundidadeMedia: '',
        volumeUtil: '',
        variacaoSazonal: '',

        // Qualidade da Água
        aspectoVisual: '',
        contaminacoes: [],
        recomendadaIrrigacao: '',

        // Infraestrutura Existente
        temBarragens: '',
        bombasCanais: '',
        estadoConservacao: '',

        // Potencial para Irrigação
        areaIrrigavel: '',
        culturasRecomendadas: [],
        tipoIrrigacao: '',
        desafios: [],

        // Recomendações
        acoesImediatas: [],
        intervencoesMedioLongo: [],
        parceriasSugeridas: [],

        // Anexos
        fotografias: null,
        croquiLatitude: '',
        croquiLongitude: '',
        croquiAltitude: '',
        croquiPrecisao: '',
        entrevistasLocais: '',
        observacoesFinais: ''
    };

    const [formData, setFormData] = useState(initialState);

    const steps = [
        { label: 'Informações Gerais', icon: FileText },
        { label: 'Localização', icon: MapPin },
        { label: 'Características', icon: Settings },
        { label: 'Potencial', icon: Target },
        { label: 'Recomendações', icon: Droplets }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleProvinciaChange = (value) => {
        const provinciaValue = value?.value || value;
        const provinciaSelected = provinciasData.find(
            p => p.nome.toUpperCase() === provinciaValue?.toUpperCase()
        );

        if (provinciaSelected) {
            try {
                const municipiosArray = JSON.parse(provinciaSelected.municipios);
                const municipios = municipiosArray.map(mun => ({
                    label: mun,
                    value: mun
                }));
                setMunicipiosOptions(municipios);
            } catch (error) {
                console.error("Erro ao processar municípios:", error);
                setMunicipiosOptions([]);
            }
        } else {
            setMunicipiosOptions([]);
        }

        setFormData(prev => ({ ...prev, provincia: value, municipio: '' }));
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            // Simular envio para API
            console.log('Dados da fonte de água:', formData);

            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert('Fonte de água registrada com sucesso!');

            // Reset do formulário
            setFormData(initialState);
            setActiveIndex(0);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao registrar fonte de água. Tente novamente.');
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
                                Dados básicos sobre o registro da fonte de água para irrigação.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="date"
                                label="Data de Registro"
                                value={formData.dataRegistro}
                                onChange={(value) => handleInputChange('dataRegistro', value)}
                                required
                            />

                            <CustomInput
                                type="text"
                                label="Equipe Técnica"
                                value={formData.equipeTecnica}
                                onChange={(value) => handleInputChange('equipeTecnica', value)}
                                placeholder="Nome da equipe técnica responsável"
                                iconStart={<Users size={18} />}
                            />
                        </div>

                        <CustomInput
                            type="textarea"
                            label="Informações Gerais"
                            value={formData.informacoesGerais}
                            onChange={(value) => handleInputChange('informacoesGerais', value)}
                            placeholder="Informações gerais sobre o registro"
                            rows={3}
                        />
                    </div>
                );

            case 1: // Localização e Identificação
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Localização e Identificação</h3>
                            </div>
                            <p className="text-gray-600">
                                Localização geográfica e identificação da fonte de água.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Localização */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Localização</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Província"
                                        value={formData.provincia}
                                        options={provinciasData.map(provincia => ({
                                            label: provincia.nome,
                                            value: provincia.nome.toUpperCase()
                                        }))}
                                        onChange={handleProvinciaChange}
                                        required
                                        iconStart={<MapPin size={18} />}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Município"
                                        value={formData.municipio}
                                        options={municipiosOptions}
                                        onChange={(value) => handleInputChange('municipio', value)}
                                        required
                                        disabled={!formData.provincia}
                                        helperText={!formData.provincia ? "Selecione primeiro a província" : ""}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Aldeia"
                                        value={formData.aldeia}
                                        onChange={(value) => handleInputChange('aldeia', value)}
                                        required
                                        placeholder="Nome da aldeia"
                                    />
                                </div>
                            </div>

                            {/* Identificação da Fonte */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Identificação da Fonte de Água</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <CustomInput
                                        type="select"
                                        label="Tipo"
                                        value={formData.tipoFonte}
                                        options={[
                                            { label: "Rio", value: "rio" },
                                            { label: "Vala", value: "vala" },
                                            { label: "Lago", value: "lago" },
                                            { label: "Lagoa", value: "lagoa" },
                                            { label: "Outro", value: "outro" }
                                        ]}
                                        onChange={(value) => handleInputChange('tipoFonte', value)}
                                        required
                                        placeholder="Selecione o tipo de fonte"
                                        iconStart={<Droplets size={18} />}
                                    />

                                    {formData.tipoFonte?.value === 'outro' && (
                                        <CustomInput
                                            type="text"
                                            label="Especificar Outro Tipo"
                                            value={formData.outroTipo}
                                            onChange={(value) => handleInputChange('outroTipo', value)}
                                            required
                                            placeholder="Especifique o tipo de fonte"
                                        />
                                    )}

                                    <CustomInput
                                        type="text"
                                        label="Nome Local (se aplicável)"
                                        value={formData.nomeLocal}
                                        onChange={(value) => handleInputChange('nomeLocal', value)}
                                        placeholder="Nome conhecido localmente"
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Distância em relação às parcelas dos produtores"
                                        value={formData.distanciaParcelas}
                                        onChange={(value) => handleInputChange('distanciaParcelas', value)}
                                        placeholder="Ex: 500 metros, 2 km"
                                    />
                                </div>

                                {/* Coordenadas GPS */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h5 className="text-md font-semibold mb-4 flex items-center">
                                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                        Coordenadas GPS
                                    </h5>
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
                                            Clique no mapa para selecionar uma localização automaticamente
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Características Técnicas
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Settings className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Características Técnicas</h3>
                            </div>
                            <p className="text-gray-600">
                                Características técnicas da fonte de água e infraestrutura existente.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Disponibilidade Hídrica */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">2.1. Disponibilidade Hídrica</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                                    <CustomInput
                                        type="number"
                                        label="Vazão estimada (se rio/vala)"
                                        value={formData.volumeUtil}
                                        onChange={(value) => handleInputChange('volumeUtil', value)}
                                        placeholder="Ex: 1000"
                                        step="any"
                                    />
                                    <CustomInput
                                        type="select"
                                        label="Unidade de vazão"
                                        value={formData.aspectoVisual}
                                        options={[
                                            { label: "m³/s", value: "m³/s" },
                                            { label: "litros/s", value: "litros/s" },

                                        ]}
                                        onChange={(value) => handleInputChange('unidadeVazao', value)}
                                        iconStart={<Eye size={18} />}
                                    />


                                    <CustomInput
                                        type="number"
                                        label="Profundidade média (se lago/lagoa)"
                                        value={formData.profundidadeMedia}
                                        onChange={(value) => handleInputChange('profundidadeMedia', value)}
                                        placeholder="Ex: 5"
                                        helperText="Metros"
                                        step="any"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Volume útil estimado"
                                        value={formData.volumeUtil}
                                        onChange={(value) => handleInputChange('volumeUtil', value)}
                                        placeholder="Ex: 1000"
                                        step="any"
                                    />
                                </div>

                                <CustomInput
                                    type="textarea"
                                    label="Variação sazonal (período de cheia/seca)"
                                    value={formData.variacaoSazonal}
                                    onChange={(value) => handleInputChange('variacaoSazonal', value)}
                                    placeholder="Descreva as variações sazonais do volume de água"
                                    rows={3}
                                />
                            </div>

                            {/* Qualidade da Água */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">2.2. Qualidade da Água</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Aspecto visual"
                                        value={formData.aspectoVisual}
                                        options={[
                                            { label: "Limpa", value: "limpa" },
                                            { label: "Turva", value: "turva" },
                                            { label: "Com sedimentos", value: "com_sedimentos" }
                                        ]}
                                        onChange={(value) => handleInputChange('aspectoVisual', value)}
                                        iconStart={<Eye size={18} />}
                                    />

                                    <CustomInput
                                        type="multiselect"
                                        label="Possíveis contaminações"
                                        value={formData.contaminacoes}
                                        options={[
                                            { label: "Agricultura", value: "agricultura" },
                                            { label: "Esgoto", value: "esgoto" },
                                            { label: "Industrial", value: "industrial" },
                                            { label: "Doméstica", value: "domestica" },
                                            { label: "Pecuária", value: "pecuaria" },
                                            { label: "Outras", value: "outras" }
                                        ]}
                                        onChange={(value) => handleInputChange('contaminacoes', value)}
                                        placeholder="Selecione as possíveis contaminações"
                                        iconStart={<AlertCircle size={18} />}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Recomendações para uso na irrigação"
                                        value={formData.recomendadaIrrigacao}
                                        options={[
                                            { label: "Sim", value: "sim" },
                                            { label: "Não", value: "nao" }
                                        ]}
                                        onChange={(value) => handleInputChange('recomendadaIrrigacao', value)}
                                        iconStart={<CheckCircle size={18} />}
                                    />
                                </div>
                            </div>

                            {/* Infraestrutura Existente */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">2.3. Infraestrutura Existente</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Barragens ou represas"
                                        value={formData.temBarragens}
                                        options={[
                                            { label: "Sim", value: "sim" },
                                            { label: "Não", value: "nao" }
                                        ]}
                                        onChange={(value) => handleInputChange('temBarragens', value)}
                                        iconStart={<Settings size={18} />}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Bombas ou canais próximos"
                                        value={formData.bombasCanais}
                                        onChange={(value) => handleInputChange('bombasCanais', value)}
                                        placeholder="Descreva bombas ou canais existentes"
                                        iconStart={<Settings size={18} />}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Estado de conservação"
                                        value={formData.estadoConservacao}
                                        options={[
                                            { label: "Bom", value: "bom" },
                                            { label: "Regular", value: "regular" },
                                            { label: "Ruim", value: "ruim" }
                                        ]}
                                        onChange={(value) => handleInputChange('estadoConservacao', value)}
                                        iconStart={<CheckCircle size={18} />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Potencial para Irrigação
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Target className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Potencial para Irrigação</h3>
                            </div>
                            <p className="text-gray-600">
                                Avaliação do potencial da fonte de água para uso na irrigação.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="number"
                                    label="Área irrigável estimada (ha)"
                                    value={formData.areaIrrigavel}
                                    onChange={(value) => handleInputChange('areaIrrigavel', value)}
                                    placeholder="Ex: 10"
                                    step="any"
                                    iconStart={<Target size={18} />}
                                />

                                <CustomInput
                                    type="multiselect"
                                    label="Culturas recomendadas"
                                    value={formData.culturasRecomendadas}
                                    options={[
                                        { label: "Milho", value: "milho" },
                                        { label: "Feijão", value: "feijao" },
                                        { label: "Arroz", value: "arroz" },
                                        { label: "Batata-doce", value: "batata_doce" },
                                        { label: "Mandioca", value: "mandioca" },
                                        { label: "Tomate", value: "tomate" },
                                        { label: "Cebola", value: "cebola" },
                                        { label: "Couve", value: "couve" },
                                        { label: "Alface", value: "alface" },
                                        { label: "Pimentão", value: "pimentao" },
                                        { label: "Hortícolas em geral", value: "horticolas" },
                                        { label: "Outras", value: "outras" }
                                    ]}
                                    onChange={(value) => handleInputChange('culturasRecomendadas', value)}
                                    placeholder="Selecione as culturas recomendadas"
                                    iconStart={<Leaf size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Tipo de irrigação viável"
                                    value={formData.tipoIrrigacao}
                                    options={[
                                        { label: "Gotejo", value: "gotejo" },
                                        { label: "Aspersão", value: "aspersao" },
                                        { label: "Superfície (gravidade)", value: "superficie" },
                                        { label: "Micro aspersão", value: "micro_aspersao" },
                                        { label: "Sulcos", value: "sulcos" }
                                    ]}
                                    onChange={(value) => handleInputChange('tipoIrrigacao', value)}
                                    placeholder="Selecione o tipo de irrigação"
                                    iconStart={<Droplets size={18} />}
                                />

                                <CustomInput
                                    type="multiselect"
                                    label="Desafios"
                                    value={formData.desafios}
                                    options={[
                                        { label: "Distância das parcelas", value: "distancia" },
                                        { label: "Topografia desfavorável", value: "topografia" },
                                        { label: "Custo de bombeamento", value: "custo_bombeamento" },
                                        { label: "Variação sazonal", value: "variacao_sazonal" },
                                        { label: "Qualidade da água", value: "qualidade_agua" },
                                        { label: "Falta de infraestrutura", value: "falta_infraestrutura" },
                                        { label: "Questões ambientais", value: "questoes_ambientais" },
                                        { label: "Conflitos pelo uso da água", value: "conflitos_uso" }
                                    ]}
                                    onChange={(value) => handleInputChange('desafios', value)}
                                    placeholder="Selecione os principais desafios"
                                    iconStart={<AlertCircle size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4: // Recomendações e Anexos
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Droplets className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Recomendações e Anexos</h3>
                            </div>
                            <p className="text-gray-600">
                                Recomendações para desenvolvimento e documentos anexos.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Recomendações */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">4. Recomendações</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="multiselect"
                                        label="Ações imediatas"
                                        value={formData.acoesImediatas}
                                        options={[
                                            { label: "Limpeza da vala", value: "limpeza_vala" },
                                            { label: "Construção de pequena represa", value: "construcao_represa" },
                                            { label: "Instalação de sistema de captação", value: "sistema_captacao" },
                                            { label: "Limpeza da margem", value: "limpeza_margem" },
                                            { label: "Teste de qualidade da água", value: "teste_qualidade" },
                                            { label: "Mapeamento detalhado", value: "mapeamento_detalhado" }
                                        ]}
                                        onChange={(value) => handleInputChange('acoesImediatas', value)}
                                        placeholder="Selecione as ações imediatas recomendadas"
                                        iconStart={<CheckCircle size={18} />}
                                    />

                                    <CustomInput
                                        type="multiselect"
                                        label="Intervenções a médio/longo prazo"
                                        value={formData.intervencoesMedioLongo}
                                        options={[
                                            { label: "Instalação de bombas solares", value: "bombas_solares" },
                                            { label: "Construção de sistema de distribuição", value: "sistema_distribuicao" },
                                            { label: "Implementação de tecnologias de irrigação", value: "tecnologias_irrigacao" },
                                            { label: "Capacitação de produtores", value: "capacitacao_produtores" },
                                            { label: "Estudos de viabilidade", value: "estudos_viabilidade" },
                                            { label: "Parcerias com setor privado", value: "parcerias_privadas" }
                                        ]}
                                        onChange={(value) => handleInputChange('intervencoesMedioLongo', value)}
                                        placeholder="Selecione as intervenções de médio/longo prazo"
                                        iconStart={<Target size={18} />}
                                    />

                                    <CustomInput
                                        type="multiselect"
                                        label="Parcerias sugeridas"
                                        value={formData.parceriasSugeridas}
                                        options={[
                                            { label: "Governo local", value: "governo_local" },
                                            { label: "ONGs", value: "ongs" },
                                            { label: "Setor privado", value: "setor_privado" },
                                            { label: "Cooperativas agrícolas", value: "cooperativas" },
                                            { label: "Universidades/Institutos", value: "universidades" },
                                            { label: "Organizações internacionais", value: "organizacoes_internacionais" },
                                            { label: "Ministério da Agricultura", value: "minagri" }
                                        ]}
                                        onChange={(value) => handleInputChange('parceriasSugeridas', value)}
                                        placeholder="Selecione as parcerias sugeridas"
                                        iconStart={<Users size={18} />}
                                    />
                                </div>
                            </div>

                            {/* Anexos */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">5. Anexos</h4>
                                <div className="space-y-6">
                                    {/* Upload de Fotografias */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fotografias da fonte de água
                                        </label>
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
                                                    {formData.fotografias ? `${formData.fotografias.length} foto(s) carregada(s)` : 'Carregar fotografias'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">Máximo 10MB por arquivo</p>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Croqui ou mapa da localização */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h5 className="text-md font-semibold mb-4">Croqui ou mapa da localização</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <CustomInput
                                                type="number"
                                                label="Latitude"
                                                value={formData.croquiLatitude}
                                                onChange={(value) => handleInputChange('croquiLatitude', value)}
                                                step="any"
                                                placeholder="Ex: -8.838333"
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Longitude"
                                                value={formData.croquiLongitude}
                                                onChange={(value) => handleInputChange('croquiLongitude', value)}
                                                step="any"
                                                placeholder="Ex: 13.234444"
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Altitude (m)"
                                                value={formData.croquiAltitude}
                                                onChange={(value) => handleInputChange('croquiAltitude', value)}
                                                placeholder="Ex: 1628"
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Precisão (m)"
                                                value={formData.croquiPrecisao}
                                                onChange={(value) => handleInputChange('croquiPrecisao', value)}
                                                placeholder="Ex: 3"
                                            />
                                        </div>
                                        <MapaGPS
                                            latitude={formData.croquiLatitude}
                                            longitude={formData.croquiLongitude}
                                            onLocationSelect={(lat, lng) => {
                                                handleInputChange('croquiLatitude', lat);
                                                handleInputChange('croquiLongitude', lng);
                                            }}
                                        />
                                    </div>

                                    <CustomInput
                                        type="textarea"
                                        label="Registros de entrevistas com produtores locais"
                                        value={formData.entrevistasLocais}
                                        onChange={(value) => handleInputChange('entrevistasLocais', value)}
                                        placeholder="Registre as principais informações obtidas em entrevistas com produtores locais"
                                        rows={4}
                                    />

                                    <CustomInput
                                        type="textarea"
                                        label="Observações Finais"
                                        value={formData.observacoesFinais}
                                        onChange={(value) => handleInputChange('observacoesFinais', value)}
                                        placeholder="Observações finais sobre a fonte de água e potencial para irrigação"
                                        rows={4}
                                    />
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
                <h1 className="text-4xl font-bold mb-3 text-gray-800">Registo de Fontes de Água para Irrigação</h1>
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
                                'Finalizar Registro'
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

export default CadastroFontesAgua;