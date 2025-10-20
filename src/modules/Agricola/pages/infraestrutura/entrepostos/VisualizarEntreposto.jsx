import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Building,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    FileText,
    Info,
    MapPin,
    Save,
    Settings,
    SquarePen,
    UserCheck,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';

import CustomInput from '../../../../../core/components/CustomInput';
import provinciasData from '../../../../../core/components/Provincias.json';
import api from '../../../../../core/services/api';

const VisualizarEntreposto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [entreposto, setEntreposto] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [municipiosOptions, setMunicipiosOptions] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const steps = [
        { label: 'Identificação', icon: Building },
        { label: 'Localização', icon: MapPin },
        { label: 'Responsável', icon: UserCheck },
        { label: 'Estrutura', icon: Settings },
        { label: 'Produtos', icon: Activity },
        { label: 'Funcionamento', icon: Calendar },
        { label: 'Situação Legal', icon: FileText },
        { label: 'Observações', icon: Info }
    ];

    useEffect(() => {
        const loadEntreposto = async () => {
            if (id) {
                try {
                    const response = await api.get(`/entreposto/${id}`);
                    setEntreposto(response.data);
                } catch (error) {
                    console.error('Erro ao carregar entreposto:', error);
                }
            }
        };

        loadEntreposto();
    }, [id]);

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
                                    <strong>Localização do Entreposto</strong><br />
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

    // Função para mostrar toast
    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    const handleEdit = () => {
        setOriginalData({ ...entreposto });

        // Load municipalities for current province when editing starts
        if (entreposto.provincia) {
            const provinciaSelected = provinciasData.find(
                p => p.nome.toUpperCase() === entreposto.provincia.toUpperCase()
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
            }
        }

        setIsEditing(true);
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancelEdit = () => {
        setEntreposto(originalData);
        setIsEditing(false);
        setShowCancelModal(false);
        setOriginalData(null);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            
            const dataToSend = {
                command: "UPDATE",
                id: entreposto.id,
                nomeDoEntreposto: entreposto.nomeDoEntreposto,
                codigoDoRegistro: entreposto.codigoDoRegistro,
                tipoDeUnidade: entreposto.tipoDeUnidade,
                outroTipoDeUnidade: entreposto.outroTipoDeUnidade,
                endereco: entreposto.endereco,
                provincia: entreposto.provincia,
                municipio: entreposto.municipio,
                latitude: entreposto.latitude,
                longitude: entreposto.longitude,
                nomeCompletoDoResponsavel: entreposto.nomeCompletoDoResponsavel,
                nomeDaEntidadeGestora: entreposto.nomeDaEntidadeGestora,
                nif: entreposto.nif,
                telefone: entreposto.telefone,
                email: entreposto.email,
                numeroDeBancas: entreposto.numeroDeBancas || 0,
                numeroDeArmazens: entreposto.numeroDeArmazens || 0,
                numeroDeLojasFixas: entreposto.numeroDeLojasFixas || 0,
                areaTotal: entreposto.areaTotal || 0,
                infraestruturasDeApoio: entreposto.infraestruturasDeApoio?.map(i => typeof i === 'string' ? i : i.value) || [],
                outraInfraestrutura: entreposto.outraInfraestrutura,
                produtosComercializados: entreposto.produtosComercializados?.map(p => typeof p === 'string' ? p : p.value) || [],
                capacidadeMedia: entreposto.capacidadeMedia || 0,
                diasEspecificos: entreposto.diasEspecificos?.map(d => typeof d === 'string' ? d : d.value) || [],
                horarioDeInicio: entreposto.horarioDeInicio,
                horarioDoFim: entreposto.horarioDoFim,
                licencaDeFuncionamento: entreposto.licencaDeFuncionamento,
                certificacaoSanitaria: entreposto.certificacaoSanitaria,
                outrasAutorizacoes: entreposto.outrasAutorizacoes,
                observacoes: entreposto.observacoes
            };
            
            await api.put(`/entreposto/${id}`, dataToSend);
            setIsEditing(false);
            setOriginalData(null);
            showToast('success', 'Entreposto atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar entreposto.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEntreposto(prev => ({ ...prev, [field]: value }));
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

        handleInputChange('provincia', provinciaValue);
        handleInputChange('municipio', '');
    };

    const renderStepContent = (index) => {
        if (!entreposto) return null;

        switch (index) {
            case 0: // Identificação
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação</h3>
                            </div>
                            <p className="text-gray-600">Dados de identificação do entreposto ou mercado.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Nome do Entreposto/Mercado"
                                    value={entreposto.nomeDoEntreposto}
                                    onChange={(value) => handleInputChange('nomeDoEntreposto', value)}
                                    disabled={!isEditing}
                                    iconStart={<Building size={18} />}
                                />
                                <CustomInput
                                    type="text"
                                    label="Código/Registro"
                                    value={entreposto.codigoDoRegistro}
                                    onChange={(value) => handleInputChange('codigoDoRegistro', value)}
                                    disabled={!isEditing}
                                    iconStart={<FileText size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Tipo de Unidade"
                                    value={isEditing ? { label: entreposto.tipoDeUnidade, value: entreposto.tipoDeUnidade } : entreposto.tipoDeUnidade}
                                    options={isEditing ? [
                                        { label: 'Entreposto', value: 'ENTREPOSTO' },
                                        { label: 'Mercado Municipal', value: 'MERCADO_MUNICIPAL' },
                                        { label: 'Mercado Informal/Feira', value: 'MERCADO_INFORMAL' },
                                        { label: 'Outro', value: 'OUTRO' }
                                    ] : undefined}
                                    onChange={(value) => handleInputChange('tipoDeUnidade', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                />
                                {entreposto.outroTipoUnidade && (
                                    <CustomInput
                                        type="text"
                                        label="Especificar Outro Tipo"
                                        value={entreposto.outroTipoUnidade}
                                        onChange={(value) => handleInputChange('outroTipoUnidade', value)}
                                        disabled={!isEditing}
                                    />
                                )}
                            </div>
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
                                <h3 className="text-xl font-bold text-gray-800">Localização</h3>
                            </div>
                            <p className="text-gray-600">Localização geográfica do entreposto ou mercado.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <CustomInput
                                            type="text"
                                            label="Endereço"
                                            value={entreposto.endereco}
                                            onChange={(value) => handleInputChange('endereco', value)}
                                            disabled={!isEditing}
                                            iconStart={<MapPin size={18} />}
                                        />
                                    </div>
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Província"
                                        value={isEditing ? { label: entreposto.provincia, value: entreposto.provincia } : entreposto.provincia}
                                        options={isEditing ? provinciasData.map(p => ({ label: p.nome, value: p.nome })) : undefined}
                                        onChange={isEditing ? handleProvinciaChange : (value) => handleInputChange('provincia', value)}
                                        disabled={!isEditing}
                                        iconStart={<MapPin size={18} />}
                                    />
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Município"
                                        value={isEditing ? { label: entreposto.municipio, value: entreposto.municipio } : entreposto.municipio}
                                        options={isEditing ? municipiosOptions : undefined}
                                        onChange={(value) => handleInputChange('municipio', typeof value === 'object' ? value.value : value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Latitude"
                                        value={entreposto.latitude}
                                        onChange={(value) => handleInputChange('latitude', value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Longitude"
                                        value={entreposto.longitude}
                                        onChange={(value) => handleInputChange('longitude', value)}
                                        disabled={!isEditing}
                                    />
                                </div>

                                {isEditing && (
                                    <div className="mt-8">
                                        <MapaGPS
                                            latitude={entreposto.latitude}
                                            longitude={entreposto.longitude}
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
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 2: // Responsável
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <UserCheck className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Responsável/Entidade Gestora</h3>
                            </div>
                            <p className="text-gray-600">Informações do responsável e entidade gestora.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Nome Completo"
                                    value={entreposto.nomeCompletoDoResponsavel}
                                    onChange={(value) => handleInputChange('nomeCompletoDoResponsavel', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="text"
                                    label="Entidade Gestora"
                                    value={entreposto.nomeDaEntidadeGestora}
                                    onChange={(value) => handleInputChange('nomeDaEntidadeGestora', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="text"
                                    label="NIF/ID Fiscal"
                                    value={entreposto.nif}
                                    onChange={(value) => handleInputChange('nif', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="tel"
                                    label="Telefone"
                                    value={entreposto.telefone}
                                    onChange={(value) => handleInputChange('telefone', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="email"
                                    label="Email"
                                    value={entreposto.email}
                                    onChange={(value) => handleInputChange('email', value)}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3: // Estrutura
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Settings className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Estrutura do Mercado/Entreposto</h3>
                            </div>
                            <p className="text-gray-600">Informações sobre a estrutura física.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <CustomInput
                                    type="number"
                                    label="Número de Bancas/Stands"
                                    value={entreposto.numeroDeBancas}
                                    onChange={(value) => handleInputChange('numeroDeBancas', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="number"
                                    label="Número de Armazéns/Salas"
                                    value={entreposto.numeroDeArmazens}
                                    onChange={(value) => handleInputChange('numeroDeArmazens', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="number"
                                    label="Número de Lojas Fixas"
                                    value={entreposto.numeroDeLojasFixas}
                                    onChange={(value) => handleInputChange('numeroDeLojasFixas', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="number"
                                    label="Área Total (m²)"
                                    value={entreposto.areaTotal}
                                    onChange={(value) => handleInputChange('areaTotal', value)}
                                    disabled={!isEditing}
                                />
                            </div>

                            <CustomInput
                                type={isEditing ? "multiselect" : "text"}
                                label="Infraestruturas de Apoio"
                                value={isEditing ? entreposto.infraestruturasDeApoio : entreposto.infraestruturasDeApoio?.join(', ')}
                                options={isEditing ? [
                                    { label: 'Frio', value: 'FRIO' },
                                    { label: 'Câmara de Congelação', value: 'CAMARA_CONGELACAO' },
                                    { label: 'Água Potável', value: 'AGUA_POTAVEL' },
                                    { label: 'Saneamento', value: 'SANEAMENTO' },
                                    { label: 'Gestão de Resíduos', value: 'GESTAO_RESIDUOS' },
                                    { label: 'Energia', value: 'ENERGIA' },
                                    { label: 'Estacionamento', value: 'ESTACIONAMENTO' },
                                    { label: 'Outro', value: 'OUTRO' }
                                ] : undefined}
                                onChange={(value) => handleInputChange('infraestruturasDeApoio', value)}
                                disabled={!isEditing}
                            />

                            {entreposto.outraInfraestrutura && (
                                <div className="mt-4">
                                    <CustomInput
                                        type="text"
                                        label="Especificar Outra Infraestrutura"
                                        value={entreposto.outraInfraestrutura}
                                        onChange={(value) => handleInputChange('outraInfraestrutura', value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 4: // Produtos
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Produtos Comercializados</h3>
                            </div>
                            <p className="text-gray-600">Tipos de produtos comercializados.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <CustomInput
                                type={isEditing ? "multiselect" : "text"}
                                label="Produtos"
                                value={isEditing ? entreposto.produtosComercializados : entreposto.produtosComercializados?.join(', ')}
                                options={isEditing ? [
                                    { label: 'Produtos Agrícolas', value: 'PRODUTOS_AGRICOLAS' },
                                    { label: 'Hortícolas e Frutas', value: 'HORTICOLAS_FRUTAS' },
                                    { label: 'Produtos Pecuários', value: 'PRODUTOS_PECUARIOS' },
                                    { label: 'Peixe/Frutos do Mar', value: 'PEIXE_FRUTOS_MAR' },
                                    { label: 'Produtos Processados', value: 'PRODUTOS_PROCESSADOS' },
                                    { label: 'Artesanato/Outro', value: 'ARTESANATO_OUTRO' }
                                ] : undefined}
                                onChange={(value) => handleInputChange('produtosComercializados', value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                );

            case 5: // Funcionamento
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Capacidade e Funcionamento</h3>
                            </div>
                            <p className="text-gray-600">Informações sobre capacidade e horários de funcionamento.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="space-y-6">
                                <CustomInput
                                    type="text"
                                    label="Capacidade Média"
                                    value={entreposto.capacidadeMedia}
                                    onChange={(value) => handleInputChange('capacidadeMedia', value)}
                                    disabled={!isEditing}
                                />

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <label className="flex items-center space-x-2 mb-4">
                                        <input
                                            type="checkbox"
                                            checked={entreposto.todosDias}
                                            onChange={(e) => handleInputChange('todosDias', e.target.checked)}
                                            disabled={!isEditing}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Todos os dias</span>
                                    </label>

                                    {!entreposto.todosDias && (
                                        <CustomInput
                                            type={isEditing ? "multiselect" : "text"}
                                            label="Dias Específicos"
                                            value={isEditing ? entreposto.diasEspecificos : entreposto.diasEspecificos?.join(', ')}
                                            options={isEditing ? [
                                                { label: 'Segunda-feira', value: 'SEGUNDA' },
                                                { label: 'Terça-feira', value: 'TERCA' },
                                                { label: 'Quarta-feira', value: 'QUARTA' },
                                                { label: 'Quinta-feira', value: 'QUINTA' },
                                                { label: 'Sexta-feira', value: 'SEXTA' },
                                                { label: 'Sábado', value: 'SABADO' },
                                                { label: 'Domingo', value: 'DOMINGO' }
                                            ] : undefined}
                                            onChange={(value) => handleInputChange('diasEspecificos', value)}
                                            disabled={!isEditing}
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="time"
                                        label="Horário de Início"
                                        value={entreposto.horarioDeInicio}
                                        onChange={(value) => handleInputChange('horarioDeInicio', value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type="time"
                                        label="Horário de Fim"
                                        value={entreposto.horarioDoFim}
                                        onChange={(value) => handleInputChange('horarioDoFim', value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 6: // Situação Legal
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mb-8 border border-red-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Situação Legal</h3>
                            </div>
                            <p className="text-gray-600">Informações sobre licenças e autorizações.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Licença de Funcionamento"
                                        value={isEditing ? { label: entreposto.licencaDeFuncionamento, value: entreposto.licencaDeFuncionamento } : entreposto.licencaDeFuncionamento}
                                        options={isEditing ? [
                                            { label: 'Sim', value: 'SIM' },
                                            { label: 'Não', value: 'NAO' }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('licencaDeFuncionamento', typeof value === 'object' ? value.value : value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Certificação Sanitária"
                                        value={isEditing ? { label: entreposto.certificacaoSanitaria, value: entreposto.certificacaoSanitaria } : entreposto.certificacaoSanitaria}
                                        options={isEditing ? [
                                            { label: 'Sim', value: 'SIM' },
                                            { label: 'Não', value: 'NAO' }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('certificacaoSanitaria', typeof value === 'object' ? value.value : value)}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <CustomInput
                                    type="textarea"
                                    label="Outras Autorizações"
                                    value={entreposto.outrasAutorizacoes}
                                    onChange={(value) => handleInputChange('outrasAutorizacoes', value)}
                                    disabled={!isEditing}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 7: // Observações
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Info className="w-6 h-6 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Observações Gerais</h3>
                            </div>
                            <p className="text-gray-600">Informações adicionais sobre o entreposto ou mercado.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <CustomInput
                                type="textarea"
                                label="Observações"
                                value={entreposto.observacoes}
                                onChange={(value) => handleInputChange('observacoes', value)}
                                disabled={!isEditing}
                                rows={6}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const nextStep = () => {
        setActiveIndex(prev => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
        setActiveIndex(prev => Math.max(prev - 1, 0));
    };

    if (!entreposto) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando dados do entreposto...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${
                    toastMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                    'bg-red-100 border-l-4 border-red-500 text-red-700'
                }`}>
                    <div className="flex items-center">
                        <div className="mr-3">
                            {toastMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <p className="font-medium">{toastMessage.message}</p>
                    </div>
                </div>
            )}

             {/* Cancel Confirmation Modal */}
                        {showCancelModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Cancelamento</h3>
                                    <p className="text-gray-600 text-center text-sm mb-4">
                                        Tem certeza que deseja cancelar? <br />Os dados não salvos serão perdidos.
                                    </p>
                                    <div className="flex gap-3 mt-2 w-full">
                                        <button
                                            onClick={confirmCancelEdit}
                                            className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                                        >
                                            Sim, cancelar
                                        </button>
                                        <button
                                              onClick={() => setShowCancelModal(false)}
                                            className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-700 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                                        >
                                            Não
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

            <div className="mx-auto px-4 py-8">
                <div>
                     {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow p-6 mb-6 border">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <div className="flex rounded-full top-0">
                                            <button 
                                                onClick={() => navigate(-1)}
                                                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                                            >
                                                <ArrowLeft className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Detalhes do Entreposto/Mercado</h2>
                                            <div className="text-gray-600">Nome: {entreposto.nomeDoEntreposto}</div>
                                            <div className="flex gap-2 flex-wrap items-center mt-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-yellow-50 text-yellow-700 border-yellow-200">
                                                    <Building className="w-4 h-4 mr-1 text-yellow-600" />
                                                    {entreposto.tipoDeUnidade}
                                                </span>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blue-200 bg-white text-blue-700">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    Entreposto/Mercado
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mt-4 md:mt-0">
                            <div className="flex gap-3 w-full">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                                        >
                                            <X className="w-5 h-5" />
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base disabled:opacity-50"
                                        >
                                            <Save className="w-5 h-5" />
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleEdit}
                                            className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base"
                                        >
                                            <SquarePen className="w-5 h-5" />
                                            Editar
                                        </button>
                                        <button className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base">
                                            <FileText className="w-5 h-5" />
                                            Relatório
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200">
                   
                    {/* Stepper */}
                    <div className="flex justify-between items-center px-8 mb-8 mt-8 overflow-x-auto">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === activeIndex;
                            const isCompleted = index < activeIndex;

                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${
                                        !isActive && !isCompleted ? 'opacity-50' : ''
                                    }`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-800 to-blue-500 text-white'
                                            : isCompleted
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className={`text-sm text-center font-medium ${
                                        isActive ? 'text-blue-700' : isCompleted ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
                        <div
                            className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
                            style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Content */}
                    <div className="px-8 pb-8">
                        {renderStepContent(activeIndex)}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={activeIndex === 0}
                                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                                    activeIndex === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <ChevronLeft size={20} className="mr-2" />
                                Anterior
                            </button>

                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={activeIndex === steps.length - 1}
                                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                                    activeIndex === steps.length - 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                Próximo
                                <ChevronRight size={20} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualizarEntreposto;