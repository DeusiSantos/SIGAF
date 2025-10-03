import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    MapPin,
    ChevronRight,
    ChevronLeft,
    Info,
    Camera,
    TestTube,
    User,
    CheckCircle,
    Loader
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
            <MapContainer center={center} zoom={hasCoordinates ? 16 : 6} className="w-full h-full" key={`${latitude}-${longitude}`}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                <MapClickHandler onLocationSelect={onLocationSelect} />
                {hasCoordinates && (
                    <Marker position={center} icon={defaultIcon}>
                        <Popup>
                            <div className="text-center">
                                <strong>Local da Amostra</strong><br />
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
    const [produtores, setProdutores] = useState([]);
    const [loadingProdutores, setLoadingProdutores] = useState(false);

    const provincias = [
        { label: "Bengo", value: "BENGO" },
        { label: "Benguela", value: "BENGUELA" },
        { label: "Bié", value: "BIE" },
        { label: "Cabinda", value: "CABINDA" },
        { label: "Cuando Cubango", value: "CUANDO_CUBANGO" },
        { label: "Cuanza Norte", value: "CUANZA_NORTE" },
        { label: "Cuanza Sul", value: "CUANZA_SUL" },
        { label: "Cunene", value: "CUNENE" },
        { label: "Huambo", value: "HUAMBO" },
        { label: "Huíla", value: "HUILA" },
        { label: "Icolo e Bengo", value: "ICOLO_BENGO" },
        { label: "Luanda", value: "LUANDA" },
        { label: "Lunda Norte", value: "LUNDA_NORTE" },
        { label: "Lunda Sul", value: "LUNDA_SUL" },
        { label: "Malanje", value: "MALANJE" },
        { label: "Moxico", value: "MOXICO" },
        { label: "Moxico Leste", value: "MOXICO_LESTE" },
        { label: "Namibe", value: "NAMIBE" },
        { label: "Uíge", value: "UIGE" },
        { label: "Zaire", value: "ZAIRE" }
    ];

    const culturas = [
        { label: "Milho", value: "milho" },
        { label: "Mandioca", value: "mandioca" },
        { label: "Amendoim", value: "amendoim" },
        { label: "Feijões", value: "feijoes" },
        { label: "Batata-doce", value: "batata_doce" },
        { label: "Banana", value: "banana" },
        { label: "Massambala", value: "massambala" },
        { label: "Massango", value: "massango" },
        { label: "Café", value: "cafe" },
        { label: "Cebola", value: "cebola" },
        { label: "Tomate", value: "tomate" },
        { label: "Couve", value: "couve" },
        { label: "Batata Rena", value: "batata_rena" },
        { label: "Trigo", value: "trigo" },
        { label: "Arroz", value: "arroz" },
        { label: "Soja", value: "soja" },
        { label: "Outras", value: "outras" }
    ];

    const initialState = {
        // Identificação do Produtor
        pertenceProdutor: null,
        produtorSelecionado: null,
        
        // Localização
        provincia: null,
        municipio: '',
        comuna: '',
        aldeia: '',
        latitude: '',
        longitude: '',
        
        // Identificação da Mostra
        identificacaoMostra: '',
        profundidadeColeta: null,
        metodoColeta: null,
        
        // Culturas
        culturasAtuais: [],
        culturasAtuaisOutra: '',
        culturaAnterior: '',
        
        // Tipo de Solo
        tipoSolo: null,
        
        // Características Visuais
        corSolo: null,
        textura: null,
        drenagem: null,
        
        // Upload
        fotografiaAmostra: null,
        
        // Observações e Responsáveis
        observacoesGerais: '',
        codigoTecnicoResponsavel: '',
        codigoSupervisor: '',
        dataColeta: new Date().toISOString().split('T')[0]
    };

    const [formData, setFormData] = useState(initialState);

    // Buscar produtores da API
    useEffect(() => {
        const fetchProdutores = async () => {
            setLoadingProdutores(true);
            try {
                const response = await fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/formulario/all');
                const data = await response.json();
                setProdutores(data);
            } catch (error) {
                console.error('Erro ao buscar produtores:', error);
                alert('Erro ao carregar lista de produtores');
            } finally {
                setLoadingProdutores(false);
            }
        };

        fetchProdutores();
    }, []);

    // Determinar steps baseado na seleção
    const getSteps = () => {
        const baseSteps = [
            { label: 'Identificação', icon: User }
        ];

        // Adicionar step de localização apenas se não pertencer a produtor
        if (formData.pertenceProdutor?.value === 'nao') {
            baseSteps.push({ label: 'Localização', icon: MapPin });
        }

        baseSteps.push(
            { label: 'Coleta', icon: TestTube },
            { label: 'Finalização', icon: CheckCircle }
        );

        return baseSteps;
    };

    const steps = getSteps();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Se mudar pertenceProdutor, resetar activeIndex se necessário
        if (field === 'pertenceProdutor') {
            if (activeIndex > 0) {
                setActiveIndex(0);
            }
        }

        // Se selecionar um produtor, preencher automaticamente os dados de localização
        if (field === 'produtorSelecionado' && value) {
            const produtor = produtores.find(p => p._id === parseInt(value.value));
            if (produtor) {
                // Extrair coordenadas GPS
                const coords = produtor.gps_coordinates?.split(' ') || [];
                
                // Encontrar a província correspondente
                const provinciaEncontrada = provincias.find(p => 
                    p.value.toLowerCase() === produtor.provincia?.toLowerCase()
                );
                
                setFormData(prev => ({
                    ...prev,
                    produtorSelecionado: value,
                    provincia: provinciaEncontrada || null,
                    municipio: produtor.municipio || '',
                    comuna: produtor.comuna || '',
                    aldeia: produtor.geo_level_4 || '',
                    latitude: coords[0] || '',
                    longitude: coords[1] || ''
                }));
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log('Dados da coleta de solo:', formData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Coleta de amostra registrada com sucesso!');
            setFormData(initialState);
            setActiveIndex(0);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao registrar coleta. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const renderStepContent = (index) => {
        const stepType = steps[index]?.label;

        if (stepType === 'Identificação') {
            return (
                <div className="max-w-full mx-auto">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Identificação do Produtor</h3>
                        </div>
                        <p className="text-gray-600">Dados do produtor associado à amostra de solo.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                        <CustomInput
                            type="select"
                            label="Este solo pertence a um produtor?"
                            value={formData.pertenceProdutor}
                            options={[
                                { label: "Sim", value: "sim" },
                                { label: "Não", value: "nao" }
                            ]}
                            onChange={(value) => handleInputChange('pertenceProdutor', value)}
                            required
                        />

                        {formData.pertenceProdutor?.value === 'sim' && (
                            <div className="space-y-6">
                                {loadingProdutores ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
                                        <span className="text-gray-600">Carregando produtores...</span>
                                    </div>
                                ) : (
                                    <CustomInput
                                        type="select"
                                        label="Selecione o Produtor"
                                        value={formData.produtorSelecionado}
                                        options={produtores.map(p => ({
                                            label: `${p.beneficiary_name} - ${p.beneficiary_id_number || 'Sem BI'} (${p.provincia || 'N/A'})`,
                                            value: p._id.toString()
                                        }))}
                                        onChange={(value) => handleInputChange('produtorSelecionado', value)}
                                        required
                                    />
                                )}

                                {formData.produtorSelecionado && (
                                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                        <div className="flex items-center mb-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                            <h4 className="font-semibold text-green-900">Dados do Produtor</h4>
                                        </div>
                                        {(() => {
                                            const produtor = produtores.find(p => p._id === parseInt(formData.produtorSelecionado.value));
                                            if (!produtor) return null;
                                            return (
                                                <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                                                    <div>
                                                        <span className="font-medium text-gray-700">Nome:</span>
                                                        <p className="text-gray-600">{produtor.beneficiary_name}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">BI:</span>
                                                        <p className="text-gray-600">{produtor.beneficiary_id_number || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Província:</span>
                                                        <p className="text-gray-600">{produtor.provincia || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Município:</span>
                                                        <p className="text-gray-600">{produtor.municipio || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        )}

                        <CustomInput
                            type="text"
                            label="Identificação da Mostra"
                            value={formData.identificacaoMostra}
                            onChange={(value) => handleInputChange('identificacaoMostra', value)}
                            placeholder="Código ou nome da amostra"
                            required
                        />

                        <CustomInput
                            type="date"
                            label="Data da Coleta"
                            value={formData.dataColeta}
                            onChange={(value) => handleInputChange('dataColeta', value)}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="text"
                                label="Código Técnico Responsável"
                                value={formData.codigoTecnicoResponsavel}
                                onChange={(value) => handleInputChange('codigoTecnicoResponsavel', value)}
                                placeholder="Código do técnico"
                                required
                            />

                            <CustomInput
                                type="text"
                                label="Código Supervisor"
                                value={formData.codigoSupervisor}
                                onChange={(value) => handleInputChange('codigoSupervisor', value)}
                                placeholder="Código do supervisor"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (stepType === 'Localização') {
            return (
                <div className="max-w-full mx-auto">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <MapPin className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Localização da Amostra</h3>
                        </div>
                        <p className="text-gray-600">Localização geográfica onde foi coletada a amostra.</p>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold mb-4">Localização Administrativa</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="select"
                                    label="Província"
                                    value={formData.provincia}
                                    options={provincias}
                                    onChange={(value) => handleInputChange('provincia', value)}
                                    required
                                />

                                <CustomInput
                                    type="text"
                                    label="Município"
                                    value={formData.municipio}
                                    onChange={(value) => handleInputChange('municipio', value)}
                                    placeholder="Nome do município"
                                    required
                                />

                                <CustomInput
                                    type="text"
                                    label="Comuna"
                                    value={formData.comuna}
                                    onChange={(value) => handleInputChange('comuna', value)}
                                    placeholder="Nome da comuna"
                                />

                                <CustomInput
                                    type="text"
                                    label="Aldeia"
                                    value={formData.aldeia}
                                    onChange={(value) => handleInputChange('aldeia', value)}
                                    placeholder="Nome da aldeia"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                Coordenadas GPS
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                    Clique no mapa para selecionar a localização
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (stepType === 'Coleta') {
            return (
                <div className="max-w-full mx-auto">
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-orange-100">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <TestTube className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Dados da Coleta</h3>
                        </div>
                        <p className="text-gray-600">Informações sobre método e características da amostra.</p>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold mb-4">Método de Coleta</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="select"
                                    label="Profundidade da Coleta"
                                    value={formData.profundidadeColeta}
                                    options={[
                                        { label: "0-15cm", value: "0-15cm" },
                                        { label: "15-30cm", value: "15-30cm" },
                                        { label: "30-60cm", value: "30-60cm" },
                                        { label: "60-100cm", value: "60-100cm" }
                                    ]}
                                    onChange={(value) => handleInputChange('profundidadeColeta', value)}
                                    required
                                />

                                <CustomInput
                                    type="select"
                                    label="Método de Coleta"
                                    value={formData.metodoColeta}
                                    options={[
                                        { label: "Tradagem", value: "tradagem" },
                                        { label: "Perfil de Solo", value: "perfil_solo" },
                                        { label: "Amostragem Simples", value: "amostragem_simples" },
                                        { label: "Amostragem Composta", value: "amostragem_composta" }
                                    ]}
                                    onChange={(value) => handleInputChange('metodoColeta', value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold mb-4">Culturas</h4>
                            <CustomInput
                                type="multiselect"
                                label="Culturas Atuais"
                                value={formData.culturasAtuais}
                                options={culturas}
                                onChange={(value) => handleInputChange('culturasAtuais', value)}
                                helperText="Selecione múltiplas culturas"
                            />

                            {formData.culturasAtuais?.some(c => c.value === 'outras') && (
                                <div className="mt-4">
                                    <CustomInput
                                        type="text"
                                        label="Especifique outras culturas"
                                        value={formData.culturasAtuaisOutra}
                                        onChange={(value) => handleInputChange('culturasAtuaisOutra', value)}
                                        placeholder="Digite as culturas"
                                    />
                                </div>
                            )}

                            <div className="mt-6">
                                <CustomInput
                                    type="text"
                                    label="Cultura Anterior"
                                    value={formData.culturaAnterior}
                                    onChange={(value) => handleInputChange('culturaAnterior', value)}
                                    placeholder="Última cultura plantada"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold mb-4">Características do Solo</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="select"
                                    label="Tipo de Solo"
                                    value={formData.tipoSolo}
                                    options={[
                                        { label: "Arenoso", value: "arenoso" },
                                        { label: "Argiloso", value: "argiloso" },
                                        { label: "Franco", value: "franco" },
                                        { label: "Franco-Arenoso", value: "franco_arenoso" },
                                        { label: "Franco-Argiloso", value: "franco_argiloso" }
                                    ]}
                                    onChange={(value) => handleInputChange('tipoSolo', value)}
                                />

                                <CustomInput
                                    type="select"
                                    label="Cor do Solo"
                                    value={formData.corSolo}
                                    options={[
                                        { label: "Escuro/Preto", value: "escuro_preto" },
                                        { label: "Marrom", value: "marrom" },
                                        { label: "Vermelho", value: "vermelho" },
                                        { label: "Amarelo", value: "amarelo" },
                                        { label: "Cinza", value: "cinza" }
                                    ]}
                                    onChange={(value) => handleInputChange('corSolo', value)}
                                />

                                <CustomInput
                                    type="select"
                                    label="Textura"
                                    value={formData.textura}
                                    options={[
                                        { label: "Muito fina", value: "muito_fina" },
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
                                        { label: "Muito Deficiente", value: "muito_deficiente" }
                                    ]}
                                    onChange={(value) => handleInputChange('drenagem', value)}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold mb-4">Upload da Fotografia da Amostra</h4>
                            <div className="relative">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleInputChange('fotografiaAmostra', e.target.files[0])}
                                    id="foto-upload"
                                />
                                <label
                                    htmlFor="foto-upload"
                                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                        formData.fotografiaAmostra
                                            ? 'bg-green-50 border-green-300 hover:bg-green-100'
                                            : 'bg-gray-50 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
                                    }`}
                                >
                                    <Camera className={`w-8 h-8 mb-3 ${formData.fotografiaAmostra ? 'text-green-500' : 'text-gray-400'}`} />
                                    <p className={`text-sm font-medium ${formData.fotografiaAmostra ? 'text-green-600' : 'text-gray-500'}`}>
                                        {formData.fotografiaAmostra ? 'Foto carregada' : 'Carregar fotografia da amostra'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Máximo 10MB</p>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (stepType === 'Finalização') {
            return (
                <div className="max-w-full mx-auto">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Finalização</h3>
                        </div>
                        <p className="text-gray-600">Observações adicionais e revisão dos dados.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                        <CustomInput
                            type="textarea"
                            label="Observações Gerais"
                            value={formData.observacoesGerais}
                            onChange={(value) => handleInputChange('observacoesGerais', value)}
                            placeholder="Observações adicionais sobre a coleta"
                            rows={5}
                        />
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                        <h4 className="text-lg font-semibold mb-4 text-blue-900">Resumo da Coleta</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Identificação:</strong> {formData.identificacaoMostra || 'Não informado'}</div>
                            <div><strong>Data:</strong> {formData.dataColeta}</div>
                            <div><strong>Pertence a Produtor:</strong> {formData.pertenceProdutor?.label || 'Não informado'}</div>
                            {formData.pertenceProdutor?.value === 'sim' && formData.produtorSelecionado && (
                                <div><strong>Produtor:</strong> {formData.produtorSelecionado.label?.split(' - ')[0] || 'N/A'}</div>
                            )}
                            <div><strong>Província:</strong> {formData.provincia?.label || 'Não informado'}</div>
                            <div><strong>Profundidade:</strong> {formData.profundidadeColeta?.label || 'Não informado'}</div>
                            <div><strong>Método:</strong> {formData.metodoColeta?.label || 'Não informado'}</div>
                            <div><strong>Tipo de Solo:</strong> {formData.tipoSolo?.label || 'Não informado'}</div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="text-center mb-6 p-10 border-b border-gray-100 bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-t-lg">
                <h1 className="text-4xl font-bold mb-3 text-white">Formulário de Coleta de Amostras de Solo</h1>
            
            </div>

            <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
                {steps.map((stepObj, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${
                            idx > activeIndex ? 'opacity-50' : ''
                        }`}
                        onClick={() => idx <= activeIndex && setActiveIndex(idx)}
                    >
                        <div
                            className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${
                                idx < activeIndex
                                    ? 'bg-gradient-to-r from-emerald-700 to-emerald-500 text-white'
                                    : idx === activeIndex
                                    ? 'bg-gradient-to-r from-emerald-700 to-emerald-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                            }`}
                        >
                            {React.createElement(stepObj.icon, { size: 28, className: "mx-auto" })}
                        </div>
                        <span className={`text-sm text-center font-medium ${idx === activeIndex ? 'text-emerald-700' : 'text-gray-500'}`}>
                            {stepObj.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
                <div
                    className="bg-gradient-to-r from-emerald-700 to-emerald-500 h-2 transition-all duration-300 rounded-full"
                    style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                ></div>
            </div>

            <div className="step-content p-8 bg-white min-h-[600px]">
                {renderStepContent(activeIndex)}
            </div>

            <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
                <button
                    className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${
                        activeIndex === 0
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

                <button
                    className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${
                        activeIndex === steps.length - 1
                            ? (saving ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg')
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'
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
                            'Finalizar Coleta'
                        )
                    ) : (
                        'Próximo'
                    )}
                    <ChevronRight className="ml-2" size={16} />
                </button>
            </div>
        </div>
    );
};

export default TesteAmostrasSolo;