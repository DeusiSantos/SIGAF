import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    ArrowLeft,
    ChevronRight,
    ChevronLeft,
    Droplets,
    MapPin,
    Settings,
    DollarSign,
    UserCheck,
    Wrench,
    AlertTriangle,
    FileText,
    Upload,
    Users,
    Target,
    Activity,
    CheckCircle,
    X,
    Info,
    BarChart2,
    Download,
    SquarePen,
    Save,
    AlertCircle
} from 'lucide-react';
import CustomInput from '../../components/CustomInput';
import { useIrrigacao } from '../../hooks/useIrrigacao .jsx';

const VisualizarIrrigacao = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchIrrigacaoById, updateIrrigacao, updateFotografiaDeFonteDeAgua, loading } = useIrrigacao();
    const [activeIndex, setActiveIndex] = useState(0);
    const [sistemaIrrigacao, setSistemaIrrigacao] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);

    const steps = [
        { label: 'Informações Gerais', icon: FileText },
        { label: 'Localização', icon: MapPin },
        { label: 'Características', icon: Settings },
        { label: 'Potencial', icon: Target },
        { label: 'Recomendações', icon: Droplets }
    ];

    useEffect(() => {
        const loadSistema = async () => {
            if (id) {
                try {
                    const sistema = await fetchIrrigacaoById(id);
                    const sistemaFormatado = {
                        id: sistema._id,
                        codigoSistema: `SIR-${new Date(sistema.data_de_Registo).getFullYear()}-${String(sistema._id).padStart(3, '0')}`,
                        nomeProjeto: sistema.nome_Local_se_aplic_vel || 'N/A',
                        localizacao: {
                            provincia: sistema.provincia || 'N/A',
                            municipio: sistema.municipio || 'N/A',
                            aldeia: sistema.aldeia || 'N/A',
                            coordenadas: sistema.coordenadas_GPS || 'N/A'
                        },
                        fonteAgua: sistema.tipo || 'N/A',
                        areaIrrigada: parseFloat(sistema._rea_irrig_vel_estimada_h) || 0,
                        numeroFamiliasAtendidas: Math.floor(Math.random() * 50) + 10,
                        culturasPrincipais: sistema.culturas_recomendadas ? sistema.culturas_recomendadas.split(',').map(c => c.trim()) : [],
                        tipoIrrigacao: sistema.tipo_de_irriga_o_vi_vel || 'N/A',
                        statusSistema: sistema.estado_de_conserva_o === 'bom' ? 'ACTIVO' : sistema.estado_de_conserva_o === 'regular' ? 'MANUTENCAO' : 'INATIVO',
                        dataInstalacao: sistema.data_de_Registo,
                        responsavelTecnico: {
                            nome: sistema.equipe_t_cnica || 'N/A',
                            telefone: 'N/A',
                            instituicao: ''
                        },
                        eficienciaHidrica: Math.floor(Math.random() * 30) + 60,
                        producaoAnual: parseFloat(sistema.volume_til_estimado) || 0,
                        observacoes: sistema.observa_es_Finais || 'Sem observações',
                        problemasRecentes: sistema.desafios ? [sistema.desafios] : [],
                        documentosAnexados: sistema._attachments?.map(att => att.filename) || [],
                        // Additional fields from API
                        distanciaParcelas: sistema.dist_ncia_em_rela_o_celas_dos_produtores || 'N/A',
                        vazaoEstimada: sistema.vaz_o_estimada_se_rio_vala || 'N/A',
                        profundidadeMedia: sistema.profundidade_m_dia_se_lago_lagoa || 'N/A',
                        variacaoSazonal: sistema.varia_o_sazonal_per_odo_de_cheia_seca || 'N/A',
                        aspectoVisual: sistema.aspecto_visual || 'N/A',
                        contaminacoes: sistema.poss_veis_contamina_es || 'N/A',
                        recomendadaIrrigacao: sistema.recomenda_es_para_uso_na_irriga_o || 'N/A',
                        temBarragens: sistema.barragens_ou_represas || 'N/A',
                        bombasCanais: sistema.bombas_ou_canais_pr_ximos || 'N/A',
                        acoesImediatas: sistema.ac_es_imediatas || 'N/A',
                        intervencoes: sistema.interven_es_a_m_dio_longo_prazo || 'N/A',
                        parcerias: sistema.parcerias_sugeridas || 'N/A'
                    };
                    setSistemaIrrigacao(sistemaFormatado);
                } catch (error) {
                    console.error('Erro ao carregar sistema:', error);
                }
            }
        };

        loadSistema();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch {
            return 'N/A';
        }
    };

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 0
        }).format(value);
    };

    const getStatusLabel = (status) => {
        const labels = {
            'ACTIVO': 'Activo',
            'MANUTENCAO': 'Manutenção',
            'INATIVO': 'Inativo',
            'PLANEJAMENTO': 'Planejamento'
        };
        return labels[status] || status;
    };

    const handleEdit = () => {
        setOriginalData({ ...sistemaIrrigacao });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancelEdit = () => {
        setSistemaIrrigacao(originalData);
        setIsEditing(false);
        setShowCancelModal(false);
        setOriginalData(null);
    };

    const handleSave = async () => {
        try {
            // Map frontend data to API format
            const apiData = {
                id: sistemaIrrigacao.id,
                data_de_Registo: sistemaIrrigacao.dataInstalacao,
                equipe_t_cnica: sistemaIrrigacao.responsavelTecnico.nome,
                provincia: sistemaIrrigacao.localizacao.provincia,
                municipio: sistemaIrrigacao.localizacao.municipio,
                aldeia: sistemaIrrigacao.localizacao.aldeia,
                tipo: sistemaIrrigacao.fonteAgua,
                nome_Local_se_aplic_vel: sistemaIrrigacao.nomeProjeto,
                coordenadas_GPS: sistemaIrrigacao.localizacao.coordenadas,
                dist_ncia_em_rela_o_celas_dos_produtores: sistemaIrrigacao.distanciaParcelas,
                vaz_o_estimada_se_rio_vala: sistemaIrrigacao.vazaoEstimada,
                profundidade_m_dia_se_lago_lagoa: sistemaIrrigacao.profundidadeMedia,
                volume_til_estimado: sistemaIrrigacao.producaoAnual.toString(),
                varia_o_sazonal_per_odo_de_cheia_seca: sistemaIrrigacao.variacaoSazonal,
                aspecto_visual: sistemaIrrigacao.aspectoVisual,
                poss_veis_contamina_es: sistemaIrrigacao.contaminacoes,
                recomenda_es_para_uso_na_irriga_o: sistemaIrrigacao.recomendadaIrrigacao,
                barragens_ou_represas: sistemaIrrigacao.temBarragens,
                bombas_ou_canais_pr_ximos: sistemaIrrigacao.bombasCanais,
                estado_de_conserva_o: sistemaIrrigacao.statusSistema === 'ACTIVO' ? 'bom' : sistemaIrrigacao.statusSistema === 'MANUTENCAO' ? 'regular' : 'ruim',
                _rea_irrig_vel_estimada_h: sistemaIrrigacao.areaIrrigada.toString(),
                culturas_recomendadas: sistemaIrrigacao.culturasPrincipais.join(', '),
                tipo_de_irriga_o_vi_vel: sistemaIrrigacao.tipoIrrigacao,
                desafios: sistemaIrrigacao.problemasRecentes.join(', '),
                ac_es_imediatas: sistemaIrrigacao.acoesImediatas,
                interven_es_a_m_dio_longo_prazo: sistemaIrrigacao.intervencoes,
                parcerias_sugeridas: sistemaIrrigacao.parcerias,
                croqui_ou_mapa_da_localiza_o: '',
                registros_de_entrevi_om_produtores_locais: sistemaIrrigacao.entrevistasLocais || '',
                observa_es_Finais: sistemaIrrigacao.observacoes
            };

            await updateIrrigacao(sistemaIrrigacao.id, apiData);
            
            // Handle photo update if there's a new image
            if (sistemaIrrigacao.novaImagem) {
                const formData = new FormData();
                formData.append('fotografiaDeFonteDeAgua', sistemaIrrigacao.novaImagem);
                await updateFotografiaDeFonteDeAgua(sistemaIrrigacao.id, formData);
            }
            
            setIsEditing(false);
            setOriginalData(null);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            // Keep editing mode on error
        }
    };

    const handleInputChange = (field, value) => {
        setSistemaIrrigacao(prev => ({ ...prev, [field]: value }));
    };

    const renderStepContent = (index) => {
        if (!sistemaIrrigacao) return null;

        switch (index) {
            case 0: // Informações Gerais
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 mb-8 border border-cyan-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-cyan-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-cyan-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Informações Gerais</h3>
                            </div>
                            <p className="text-gray-600">Dados básicos do sistema de irrigação.</p>
                        </div>

                        <div className="bg-white rounded-2xl  p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="date"
                                    label="Data de Registro"
                                    value={sistemaIrrigacao.dataInstalacao}
                                    onChange={(value) => handleInputChange('dataInstalacao', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="text"
                                    label="Equipe Técnica"
                                    value={sistemaIrrigacao.responsavelTecnico.nome}
                                    onChange={(value) => handleInputChange('responsavelTecnico', { ...sistemaIrrigacao.responsavelTecnico, nome: value })}
                                    disabled={!isEditing}
                                    iconStart={<Users size={18} />}
                                />
                            </div>
                        </div>
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
                                <h4 className="text-lg font-semibold mb-10">Localização</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Província"
                                        value={sistemaIrrigacao.localizacao.provincia}
                                        onChange={(value) => handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, provincia: value })}
                                        disabled={!isEditing}
                                        iconStart={<MapPin size={18} />}
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Município"
                                        value={sistemaIrrigacao.localizacao.municipio}
                                        onChange={(value) => handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, municipio: value })}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Aldeia"
                                        value={sistemaIrrigacao.localizacao.aldeia}
                                        onChange={(value) => handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, aldeia: value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            {/* Identificação da Fonte */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-10">Identificação da Fonte de Água</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <CustomInput
                                        type="text"
                                        label="Tipo"
                                        value={sistemaIrrigacao.fonteAgua}
                                        onChange={(value) => handleInputChange('fonteAgua', value)}
                                        disabled={!isEditing}
                                        iconStart={<Droplets size={18} />}
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Nome Local (se aplicável)"
                                        value={sistemaIrrigacao.nomeProjeto}
                                        onChange={(value) => handleInputChange('nomeProjeto', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Distância em relação às parcelas dos produtores"
                                        value={sistemaIrrigacao.distanciaParcelas}
                                        onChange={(value) => handleInputChange('distanciaParcelas', value)}
                                        disabled={!isEditing}
                                    />



                                </div>

                                {/* Coordenadas GPS */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h5 className="text-md font-semibold mb-4 flex items-center">
                                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                        Coordenadas GPS
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <CustomInput
                                            type="number"
                                            label="Latitude"
                                            value={sistemaIrrigacao.localizacao.coordenadas.split(',')[0]?.trim() || ''}
                                            onChange={(value) => {
                                                const coords = sistemaIrrigacao.localizacao.coordenadas.split(',');
                                                const newCoords = `${value}, ${coords[1]?.trim() || ''}`;
                                                handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, coordenadas: newCoords });
                                            }}
                                            disabled={!isEditing}
                                            step="any"
                                        />
                                        <CustomInput
                                            type="number"
                                            label="Longitude"
                                            value={sistemaIrrigacao.localizacao.coordenadas.split(',')[1]?.trim() || ''}
                                            onChange={(value) => {
                                                const coords = sistemaIrrigacao.localizacao.coordenadas.split(',');
                                                const newCoords = `${coords[0]?.trim() || ''}, ${value}`;
                                                handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, coordenadas: newCoords });
                                            }}
                                            disabled={!isEditing}
                                            step="any"
                                        />
                                        <CustomInput
                                            type="number"
                                            label="Altitude (m)"
                                            value={sistemaIrrigacao.altitude || ''}
                                            onChange={(value) => handleInputChange('altitude', value)}
                                            disabled={!isEditing}
                                        />
                                        <CustomInput
                                            type="number"
                                            label="Precisão (m)"
                                            value={sistemaIrrigacao.precisao || ''}
                                            onChange={(value) => handleInputChange('precisao', value)}
                                            disabled={!isEditing}
                                        />

                                       


                                    </div>
                                    {isEditing && (
                                        <div className="mt-4">
                                            <MapaGPS
                                                latitude={sistemaIrrigacao.localizacao.coordenadas.split(',')[0]?.trim()}
                                                longitude={sistemaIrrigacao.localizacao.coordenadas.split(',')[1]?.trim()}
                                                onLocationSelect={(lat, lng) => {
                                                    const newCoords = `${lat}, ${lng}`;
                                                    handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, coordenadas: newCoords });
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
                                <h4 className="text-lg font-semibold mb-10">Disponibilidade Hídrica</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="Vazão estimada (se rio/vala)"
                                        value={sistemaIrrigacao.vazaoEstimada}
                                        onChange={(value) => handleInputChange('vazaoEstimada', value)}
                                        disabled={!isEditing}
                                        step="any"
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Unidade de vazão"
                                        value={sistemaIrrigacao.unidadeVazao || 'litros/s'}
                                        onChange={(value) => handleInputChange('unidadeVazao', value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Profundidade média (se lago/lagoa)"
                                        value={sistemaIrrigacao.profundidadeMedia}
                                        onChange={(value) => handleInputChange('profundidadeMedia', value)}
                                        disabled={!isEditing}
                                        step="any"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Volume útil estimado"
                                        value={sistemaIrrigacao.producaoAnual.toString()}
                                        onChange={(value) => handleInputChange('producaoAnual', parseFloat(value) || 0)}
                                        disabled={!isEditing}
                                        step="any"
                                    />
                                </div>
                                <CustomInput
                                    type="textarea"
                                    label="Variação sazonal (período de cheia/seca)"
                                    value={sistemaIrrigacao.variacaoSazonal}
                                    onChange={(value) => handleInputChange('variacaoSazonal', value)}
                                    disabled={!isEditing}
                                    rows={3}
                                />
                            </div>

                            {/* Qualidade da Água */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-10">Qualidade da Água</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Aspecto visual"
                                        value={sistemaIrrigacao.aspectoVisual}
                                        onChange={(value) => handleInputChange('aspectoVisual', value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Possíveis contaminações"
                                        value={sistemaIrrigacao.contaminacoes}
                                        onChange={(value) => handleInputChange('contaminacoes', value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Recomendações para uso na irrigação"
                                        value={sistemaIrrigacao.recomendadaIrrigacao}
                                        onChange={(value) => handleInputChange('recomendadaIrrigacao', value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            {/* Infraestrutura Existente */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-10">Infraestrutura Existente</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Barragens ou represas"
                                        value={sistemaIrrigacao.temBarragens}
                                        onChange={(value) => handleInputChange('temBarragens', value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Bombas ou canais próximos"
                                        value={sistemaIrrigacao.bombasCanais}
                                        onChange={(value) => handleInputChange('bombasCanais', value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Estado de conservação"
                                        value={getStatusLabel(sistemaIrrigacao.statusSistema)}
                                        onChange={(value) => handleInputChange('statusSistema', value)}
                                        disabled={!isEditing}
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
                                    value={sistemaIrrigacao.areaIrrigada.toString()}
                                    onChange={(value) => handleInputChange('areaIrrigada', parseFloat(value) || 0)}
                                    disabled={!isEditing}
                                    iconStart={<Target size={18} />}
                                    step="any"
                                />
                                <CustomInput
                                    type="text"
                                    label="Culturas recomendadas"
                                    value={sistemaIrrigacao.culturasPrincipais.join(', ')}
                                    onChange={(value) => handleInputChange('culturasPrincipais', value.split(',').map(c => c.trim()))}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="text"
                                    label="Tipo de irrigação viável"
                                    value={sistemaIrrigacao.tipoIrrigacao}
                                    onChange={(value) => handleInputChange('tipoIrrigacao', value)}
                                    disabled={!isEditing}
                                    iconStart={<Droplets size={18} />}
                                />
                                <CustomInput
                                    type="text"
                                    label="Desafios"
                                    value={sistemaIrrigacao.problemasRecentes.join(', ') || 'N/A'}
                                    onChange={(value) => handleInputChange('problemasRecentes', value.split(',').map(c => c.trim()))}
                                    disabled={!isEditing}
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
                                <h4 className="text-lg font-semibold mb-10">Recomendações</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="textarea"
                                        label="Ações imediatas"
                                        value={sistemaIrrigacao.acoesImediatas}
                                        onChange={(value) => handleInputChange('acoesImediatas', value)}
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                    <CustomInput
                                        type="textarea"
                                        label="Intervenções a médio/longo prazo"
                                        value={sistemaIrrigacao.intervencoes}
                                        onChange={(value) => handleInputChange('intervencoes', value)}
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                    <CustomInput
                                        type="textarea"
                                        label="Parcerias sugeridas"
                                        value={sistemaIrrigacao.parcerias}
                                        onChange={(value) => handleInputChange('parcerias', value)}
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Anexos */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-10">Anexos</h4>
                                <div className="space-y-6">
                                    {sistemaIrrigacao.documentosAnexados?.length > 0 ? (
                                        <div className="space-y-3">
                                            {sistemaIrrigacao.documentosAnexados.map((doc, index) => (
                                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <Upload className="w-5 h-5 text-gray-500 mr-3" />
                                                    <span className="text-sm text-gray-700">{doc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Nenhum documento anexado</p>
                                        </div>
                                    )}

                                    {/* Croqui ou mapa da localização */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h5 className="text-md font-semibold mb-4">Croqui ou mapa da localização</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <CustomInput
                                                type="number"
                                                label="Latitude"
                                                value={sistemaIrrigacao.localizacao.coordenadas.split(',')[0]?.trim() || ''}
                                                onChange={(value) => {
                                                    const coords = sistemaIrrigacao.localizacao.coordenadas.split(',');
                                                    const newCoords = `${value}, ${coords[1]?.trim() || ''}`;
                                                    handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, coordenadas: newCoords });
                                                }}
                                                disabled={!isEditing}
                                                step="any"
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Longitude"
                                                value={sistemaIrrigacao.localizacao.coordenadas.split(',')[1]?.trim() || ''}
                                                onChange={(value) => {
                                                    const coords = sistemaIrrigacao.localizacao.coordenadas.split(',');
                                                    const newCoords = `${coords[0]?.trim() || ''}, ${value}`;
                                                    handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, coordenadas: newCoords });
                                                }}
                                                disabled={!isEditing}
                                                step="any"
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Altitude (m)"
                                                value={sistemaIrrigacao.altitude || ''}
                                                onChange={(value) => handleInputChange('altitude', value)}
                                                disabled={!isEditing}
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Precisão (m)"
                                                value={sistemaIrrigacao.precisao || ''}
                                                onChange={(value) => handleInputChange('precisao', value)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <CustomInput
                                        type="textarea"
                                        label="Registros de entrevistas com produtores locais"
                                        value={sistemaIrrigacao.entrevistasLocais || ''}
                                        onChange={(value) => handleInputChange('entrevistasLocais', value)}
                                        disabled={!isEditing}
                                        rows={4}
                                    />

                                    <CustomInput
                                        type="textarea"
                                        label="Observações Finais"
                                        value={sistemaIrrigacao.observacoes}
                                        onChange={(value) => handleInputChange('observacoes', value)}
                                        disabled={!isEditing}
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    if (!sistemaIrrigacao) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Sistema não encontrado</h2>
                    <p className="text-gray-500 mb-4">O sistema de irrigação solicitado não foi encontrado.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                        Voltar à Lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow p-6 mb-6 border">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-gray-100 text-gray-600">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className='flex flex-col'>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Detalhes do Sistema de Irrigação
                                </h2>
                                <div className="text-gray-600">Código: {sistemaIrrigacao.codigoSistema || '--'}
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap items-center mt-2">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border 
                                    ${sistemaIrrigacao.statusSistema === 'ACTIVO' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                    ${sistemaIrrigacao.statusSistema === 'INATIVO' ? 'bg-gray-100 text-gray-500 border-gray-300' : ''}
                                    ${sistemaIrrigacao.statusSistema === 'MANUTENCAO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                                    `}
                                >
                                    {sistemaIrrigacao.statusSistema === 'ACTIVO' && <CheckCircle className="w-4 h-4 mr-1 text-green-600" />}
                                    {sistemaIrrigacao.statusSistema === 'INATIVO' && <X className="w-4 h-4 mr-1 text-gray-400" />}
                                    {sistemaIrrigacao.statusSistema === 'MANUTENCAO' && <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />}
                                    {getStatusLabel(sistemaIrrigacao.statusSistema)}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blue-200 bg-white text-blue-700">
                                    <Droplets className="w-4 h-4 mr-1" /> Sistema de Irrigação
                                </span>
                            </div>
                        </div>
                          {/*  */}
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mt-4 md:mt-0">
                        {isEditing ? (
                            <div className="flex gap-3 w-full" key="editando">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                                >
                                    <X className="w-5 h-5" /> Cancelar
                                </button>
                               
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                >
                                    <Save className="w-5 h-5" /> Salvar
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3 w-full" key="visualizando">
                                <button
                                    onClick={handleEdit}
                                    className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base"
                                >
                                    <SquarePen className="w-5 h-5" /> Editar
                                </button>
                                <button
                                    className="flex h-[45px]  items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                >
                                    <Download className="w-5 h-5" /> Relatório
                                </button>
                            </div>
                        )}
                    </div>
                    </div>
                </div>

                <div className='bg-white max-w-7xl mx-auto  rounded-lg shadow-sm border border-gray-200'>
                    {/* Steps Navigation */}
                    <div className="bg-white border-b">
                        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 overflow-x-auto">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index === activeIndex;
                                const isCompleted = index < activeIndex;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${!isActive && !isCompleted ? 'opacity-50' : ''
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-colors ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : isCompleted
                                                ? 'bg-cyan-600 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-sm text-center font-medium ${isActive
                                            ? 'text-blue-700'
                                            : isCompleted
                                                ? 'text-cyan-700'
                                                : 'text-gray-500'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-full bg-gray-200 h-2 mb-0">
                            <div
                                className="bg-cyan-600 h-2 transition-all duration-300"
                                style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {renderStepContent(activeIndex)}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                                disabled={activeIndex === 0}
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeIndex === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Anterior
                            </button>

                            <button
                                onClick={() => setActiveIndex(prev => Math.min(steps.length - 1, prev + 1))}
                                disabled={activeIndex === steps.length - 1}
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeIndex === steps.length - 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-cyan-600 text-white hover:bg-cyan-700'
                                    }`}
                            >
                                Próximo
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                </div>


            </div>

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

        </div>
    );
};

export default VisualizarIrrigacao;