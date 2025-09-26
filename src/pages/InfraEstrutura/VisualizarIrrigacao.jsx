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
    AlertCircle,
    Camera
} from 'lucide-react';
import CustomInput from '../../components/CustomInput';
import { useIrrigacao } from '../../hooks/useIrrigacao .jsx';
import provinciasData from '../../components/Provincias.json';

const VisualizarIrrigacao = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchIrrigacaoById, updateIrrigacao, updateFotografiaDeFonteDeAgua, fetchFotografiaDeFonteDeAgua, loading } = useIrrigacao();
    const [activeIndex, setActiveIndex] = useState(0);
    const [sistemaIrrigacao, setSistemaIrrigacao] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [municipiosOptions, setMunicipiosOptions] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);

    // Estados para upload de imagem - seguindo padrão do VisualizarProdutor
    const [imagemUrlFotografia, setImagemUrlFotografia] = useState('');
    const [uploadingFotografia, setUploadingFotografia] = useState(false);
    const [novaFotografia, setNovaFotografia] = useState(null);
    const [previewFotografia, setPreviewFotografia] = useState('');

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
                        statusSistema: sistema.estado_de_conserva_o || 'ruim',
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

                    // Load photo - usando URL direta da API
                    setImagemUrlFotografia(`https://mwangobrainsa-001-site2.mtempurl.com/api/irrigacao/${id}/fotografiaDeFonteDeAgua`);
                } catch (error) {
                    console.error('Erro ao carregar sistema:', error);
                }
            }
        };

        loadSistema();
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

    const getStatusLabel = (status) => {
        const labels = {
            'bom': 'Bom',
            'regular': 'Regular',
            'ruim': 'Ruim'
        };
        return labels[status] || status;
    };

    // Função para mostrar toast
    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    // Funções para upload de imagem - seguindo padrão do VisualizarProdutor
    const uploadFotografia = async (file) => {
        if (!file) {
            showToast('error', 'Selecione uma foto primeiro');
            return;
        }

        setUploadingFotografia(true);
        try {
            const formData = new FormData();
            formData.append('novaImagem', file); // Corrigido para usar 'novaImagem'
            
            await updateFotografiaDeFonteDeAgua(sistemaIrrigacao.id, formData);
            
            showToast('success', 'Fotografia atualizada com sucesso!');
            const url = URL.createObjectURL(file);
            setImagemUrlFotografia(url);
            setNovaFotografia(null);
            setPreviewFotografia('');
        } catch (error) {
            console.error('Erro ao fazer upload da fotografia:', error);
            showToast('error', 'Erro ao atualizar fotografia');
        } finally {
            setUploadingFotografia(false);
        }
    };

    // Handler para mudança de arquivo - seguindo padrão do VisualizarProdutor
    const handleFotografiaChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNovaFotografia(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewFotografia(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Função para cancelar upload - seguindo padrão do VisualizarProdutor
    const cancelarFotografia = () => {
        setNovaFotografia(null);
        setPreviewFotografia('');
    };

    const handleEdit = () => {
        setOriginalData({ ...sistemaIrrigacao });

        // Load municipalities for current province when editing starts
        if (sistemaIrrigacao.localizacao.provincia) {
            const provinciaSelected = provinciasData.find(
                p => p.nome.toUpperCase() === sistemaIrrigacao.localizacao.provincia.toUpperCase()
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
        setSistemaIrrigacao(originalData);
        setIsEditing(false);
        setShowCancelModal(false);
        setOriginalData(null);
        setNovaFotografia(null);
        setPreviewFotografia('');
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
                estado_de_conserva_o: sistemaIrrigacao.statusSistema,
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

            setIsEditing(false);
            setOriginalData(null);
            setNovaFotografia(null);
            setPreviewFotografia('');
            setToastMessage({ type: 'success', message: 'Sistema atualizado com sucesso!' });
            setTimeout(() => setToastMessage(null), 3000);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setToastMessage({ type: 'error', message: 'Erro ao salvar sistema.' });
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const handleInputChange = (field, value) => {
        setSistemaIrrigacao(prev => ({ ...prev, [field]: value }));
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

        handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, provincia: provinciaValue, municipio: '' });
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
                                        type={isEditing ? "select" : "text"}
                                        label="Província"
                                        value={isEditing ? { label: sistemaIrrigacao.localizacao.provincia, value: sistemaIrrigacao.localizacao.provincia } : sistemaIrrigacao.localizacao.provincia}
                                        options={isEditing ? provinciasData.map(p => ({ label: p.nome, value: p.nome })) : undefined}
                                        onChange={isEditing ? handleProvinciaChange : (value) => handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, provincia: value })}
                                        disabled={!isEditing}
                                        iconStart={<MapPin size={18} />}
                                    />
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Município"
                                        value={isEditing ? { label: sistemaIrrigacao.localizacao.municipio, value: sistemaIrrigacao.localizacao.municipio } : sistemaIrrigacao.localizacao.municipio}
                                        options={isEditing ? municipiosOptions : undefined}
                                        onChange={(value) => handleInputChange('localizacao', { ...sistemaIrrigacao.localizacao, municipio: typeof value === 'object' ? value.value : value })}
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
                                        type={isEditing ? "select" : "text"}
                                        label="Tipo"
                                        value={isEditing ? { label: sistemaIrrigacao.fonteAgua, value: sistemaIrrigacao.fonteAgua } : sistemaIrrigacao.fonteAgua.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        options={isEditing ? [
                                            { label: "Rio", value: "rio" },
                                            { label: "Vala", value: "vala" },
                                            { label: "Lago", value: "lago" },
                                            { label: "Lagoa", value: "lagoa" },
                                            { label: "Outro", value: "outro" }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('fonteAgua', typeof value === 'object' ? value.value : value)}
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
                                        type={isEditing ? "select" : "text"}
                                        label="Unidade de vazão"
                                        value={isEditing ? { label: sistemaIrrigacao.unidadeVazao || 'litros/s', value: sistemaIrrigacao.unidadeVazao || 'litros/s' } : (sistemaIrrigacao.unidadeVazao || 'litros/s').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        options={isEditing ? [
                                            { label: "m³/s", value: "m³/s" },
                                            { label: "litros/s", value: "litros/s" }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('unidadeVazao', typeof value === 'object' ? value.value : value)}
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
                                        type={isEditing ? "select" : "text"}
                                        label="Aspecto visual"
                                        value={isEditing ? { label: sistemaIrrigacao.aspectoVisual, value: sistemaIrrigacao.aspectoVisual } : sistemaIrrigacao.aspectoVisual.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        options={isEditing ? [
                                            { label: "Limpa", value: "limpa" },
                                            { label: "Turva", value: "turva" },
                                            { label: "Com sedimentos", value: "com_sedimentos" }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('aspectoVisual', typeof value === 'object' ? value.value : value)}
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type={isEditing ? "multiselect" : "text"}
                                        label="Possíveis contaminações"
                                        value={
                                            isEditing
                                                ? (sistemaIrrigacao.contaminacoes && sistemaIrrigacao.contaminacoes !== 'N/A'
                                                    ? sistemaIrrigacao.contaminacoes.split(',').map(c => ({
                                                        label: c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                                                        value: c.trim()
                                                    }))
                                                    : [])
                                                : (sistemaIrrigacao.contaminacoes || '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                        }
                                        options={isEditing ? [
                                            { label: "Agricultura", value: "agricultura" },
                                            { label: "Esgoto", value: "esgoto" },
                                            { label: "Industrial", value: "industrial" },
                                            { label: "Doméstica", value: "domestica" },
                                            { label: "Pecuária", value: "pecuaria" },
                                            { label: "Outras", value: "outras" }
                                        ] : undefined}
                                        onChange={(value) =>
                                            handleInputChange(
                                                'contaminacoes',
                                                Array.isArray(value)
                                                    ? value.map(v => v.value).join(', ')
                                                    : value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Recomendações para uso na irrigação"
                                        value={isEditing ? { label: sistemaIrrigacao.recomendadaIrrigacao, value: sistemaIrrigacao.recomendadaIrrigacao } : sistemaIrrigacao.recomendadaIrrigacao.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        options={isEditing ? [
                                            { label: "Sim", value: "sim" },
                                            { label: "Não", value: "nao" }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('recomendadaIrrigacao', typeof value === 'object' ? value.value : value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            {/* Infraestrutura Existente */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-10">Infraestrutura Existente</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Barragens ou represas"
                                        value={isEditing ? { label: sistemaIrrigacao.temBarragens, value: sistemaIrrigacao.temBarragens } : sistemaIrrigacao.temBarragens.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        options={isEditing ? [
                                            { label: "Sim", value: "sim" },
                                            { label: "Não", value: "nao" }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('temBarragens', typeof value === 'object' ? value.value : value)}
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
                                        type={isEditing ? "select" : "text"}
                                        label="Estado de conservação"
                                        value={isEditing ? { label: getStatusLabel(sistemaIrrigacao.statusSistema), value: sistemaIrrigacao.statusSistema } : getStatusLabel(sistemaIrrigacao.statusSistema)}
                                        options={isEditing ? [
                                            { label: "Bom", value: "bom" },
                                            { label: "Regular", value: "regular" },
                                            { label: "Ruim", value: "ruim" }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('statusSistema', typeof value === 'object' ? value.value : value)}
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
                                    type={isEditing ? "multiselect" : "text"}
                                    label="Culturas recomendadas"
                                    value={isEditing ? sistemaIrrigacao.culturasPrincipais : sistemaIrrigacao.culturasPrincipais.map(c => c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')}
                                    options={isEditing ? [
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
                                    ] : undefined}
                                    onChange={(value) => handleInputChange('culturasPrincipais', Array.isArray(value) ? value : value.split(',').map(c => c.trim()))}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Tipo de irrigação viável"
                                    value={isEditing ? { label: sistemaIrrigacao.tipoIrrigacao, value: sistemaIrrigacao.tipoIrrigacao } : sistemaIrrigacao.tipoIrrigacao.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    options={isEditing ? [
                                        { label: "Gotejo", value: "gotejo" },
                                        { label: "Aspersão", value: "aspersao" },
                                        { label: "Superfície (gravidade)", value: "superficie" },
                                        { label: "Micro aspersão", value: "micro_aspersao" },
                                        { label: "Sulcos", value: "sulcos" }
                                    ] : undefined}
                                    onChange={(value) => handleInputChange('tipoIrrigacao', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                    iconStart={<Droplets size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "multiselect" : "text"}
                                    label="Desafios"
                                    value={isEditing ? sistemaIrrigacao.problemasRecentes : sistemaIrrigacao.problemasRecentes.map(p => p.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ') || 'N/A'}
                                    options={isEditing ? [
                                        { label: "Distância das parcelas", value: "distancia" },
                                        { label: "Topografia desfavorável", value: "topografia" },
                                        { label: "Custo de bombeamento", value: "custo_bombeamento" },
                                        { label: "Variação sazonal", value: "variacao_sazonal" },
                                        { label: "Qualidade da água", value: "qualidade_agua" },
                                        { label: "Falta de infraestrutura", value: "falta_infraestrutura" },
                                        { label: "Questões ambientais", value: "questoes_ambientais" },
                                        { label: "Conflitos pelo uso da água", value: "conflitos_uso" }
                                    ] : undefined}
                                    onChange={(value) => handleInputChange('problemasRecentes', Array.isArray(value) ? value : value.split(',').map(c => c.trim()))}
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
                                        type={isEditing ? "select" : "textarea"}
                                        label="Ações imediatas"
                                        value={isEditing ? { label: sistemaIrrigacao.acoesImediatas, value: sistemaIrrigacao.acoesImediatas } : sistemaIrrigacao.acoesImediatas.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        options={isEditing ? [
                                            { label: "Limpeza da vala", value: "limpeza_vala" },
                                            { label: "Construção de pequena represa", value: "construcao_represa" },
                                            { label: "Instalação de sistema de captação", value: "sistema_captacao" },
                                            { label: "Limpeza da margem", value: "limpeza_margem" },
                                            { label: "Teste de qualidade da água", value: "teste_qualidade" },
                                            { label: "Mapeamento detalhado", value: "mapeamento_detalhado" }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('acoesImediatas', typeof value === 'object' ? value.value : value)}
                                        disabled={!isEditing}
                                        rows={isEditing ? undefined : 3}
                                    />
                                    <CustomInput
                                        type={isEditing ? "select" : "textarea"}
                                        label="Intervenções a médio/longo prazo"
                                        value={isEditing ? { label: sistemaIrrigacao.intervencoes, value: sistemaIrrigacao.intervencoes } : sistemaIrrigacao.intervencoes.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        options={isEditing ? [
                                            { label: "Instalação de bombas solares", value: "bombas_solares" },
                                            { label: "Construção de sistema de distribuição", value: "sistema_distribuicao" },
                                            { label: "Implementação de tecnologias de irrigação", value: "tecnologias_irrigacao" },
                                            { label: "Capacitação de produtores", value: "capacitacao_produtores" },
                                            { label: "Estudos de viabilidade", value: "estudos_viabilidade" },
                                            { label: "Parcerias com setor privado", value: "parcerias_privadas" }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('intervencoes', typeof value === 'object' ? value.value : value)}
                                        disabled={!isEditing}
                                        rows={isEditing ? undefined : 3}
                                    />
                                    <CustomInput
                                        type={isEditing ? "select" : "textarea"}
                                        label="Parcerias sugeridas"
                                        value={isEditing ? { label: sistemaIrrigacao.parcerias, value: sistemaIrrigacao.parcerias } : sistemaIrrigacao.parcerias.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        options={isEditing ? [
                                            { label: "Governo local", value: "governo_local" },
                                            { label: "ONGs", value: "ongs" },
                                            { label: "Setor privado", value: "setor_privado" },
                                            { label: "Cooperativas agrícolas", value: "cooperativas" },
                                            { label: "Universidades/Institutos", value: "universidades" },
                                            { label: "Organizações internacionais", value: "organizacoes_internacionais" },
                                            { label: "Ministério da Agricultura", value: "minagri" }
                                        ] : undefined}
                                        onChange={(value) => handleInputChange('parcerias', typeof value === 'object' ? value.value : value)}
                                        disabled={!isEditing}
                                        rows={isEditing ? undefined : 3}
                                    />
                                </div>
                            </div>

                            {/* Anexos - Sistema de upload seguindo padrão do VisualizarProdutor */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-10">Anexos</h4>
                                <div className="space-y-6">
                                    {/* Fotografia da Fonte de Água */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Fotografia da fonte de água</h3>
                                        {imagemUrlFotografia ? (
                                            <img
                                                src={previewFotografia || imagemUrlFotografia}
                                                alt="Fonte de Água"
                                                className="w-full h-auto rounded-lg max-h-96 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Camera className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}

                                        {isEditing && (
                                            <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors mt-2 inline-block">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFotografiaChange}
                                                    className="hidden"
                                                />
                                                Alterar Foto
                                            </label>
                                        )}

                                        {isEditing && novaFotografia && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => uploadFotografia(novaFotografia)}
                                                    disabled={uploadingFotografia}
                                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors disabled:bg-green-300"
                                                >
                                                    {uploadingFotografia ? 'Enviando...' : 'Confirmar Upload'}
                                                </button>
                                                <button
                                                    onClick={cancelarFotografia}
                                                    disabled={uploadingFotografia}
                                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Outros Documentos */}
                                    {sistemaIrrigacao.documentosAnexados?.length > 0 ? (
                                        <div className="space-y-3">
                                            <h5 className="text-md font-semibold">Outros Documentos</h5>
                                            {sistemaIrrigacao.documentosAnexados.map((doc, index) => (
                                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <Upload className="w-5 h-5 text-gray-500 mr-3" />
                                                    <span className="text-sm text-gray-700">{doc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}

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
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${toastMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                    toastMessage.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
                        'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                    }`}>
                    <div className="flex items-center">
                        {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                        {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
                        {toastMessage.type === 'info' && <Info className="w-5 h-5 mr-2" />}
                        <p>{toastMessage.message}</p>
                        <button
                            onClick={() => setToastMessage(null)}
                            className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow p-6 mb-6 border">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">

                            <div className='flex flex-col'>
                                <div className="flex items-center gap-3">
                                    <div className="flex  rounded-full top-0">
                                        <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-gray-100 text-gray-600">
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Detalhes do Sistema de Irrigação
                                        </h2>
                                        <div className="text-gray-600">Código: {sistemaIrrigacao.codigoSistema || '--'}
                                        </div>
                                        <div className="flex gap-2 flex-wrap items-center mt-2">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border 
                                    ${sistemaIrrigacao.statusSistema === 'bom' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                    ${sistemaIrrigacao.statusSistema === 'ruim' ? 'bg-red-100 text-red-700 border-red-300' : ''}
                                    ${sistemaIrrigacao.statusSistema === 'regular' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                                    `}
                                            >
                                                {sistemaIrrigacao.statusSistema === 'bom' && <CheckCircle className="w-4 h-4 mr-1 text-green-600" />}
                                                {sistemaIrrigacao.statusSistema === 'ruim' && <X className="w-4 h-4 mr-1 text-red-400" />}
                                                {sistemaIrrigacao.statusSistema === 'regular' && <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />}
                                                {getStatusLabel(sistemaIrrigacao.statusSistema)}
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blue-200 bg-white text-blue-700">
                                                <Droplets className="w-4 h-4 mr-1" /> Sistema de Irrigação
                                            </span>
                                        </div>
                                    </div>

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