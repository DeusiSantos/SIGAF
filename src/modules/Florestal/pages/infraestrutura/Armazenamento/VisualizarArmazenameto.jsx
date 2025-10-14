import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Building,
    Camera,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    FileText,
    Info,
    MapPin,
    Package,
    Save,
    Settings,
    Shield,
    SquarePen,
    UserCheck,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import CustomInput from '../../../../../core/components/CustomInput';
import provinciasData from '../../../../../core/components/Provincias.json';
import { useSilo } from '../../../hooks/useSilo';


const VisualizarArmazenameto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchSiloById, updateSilo, fetchLicencaOperacao, fetchCertificacaoSanitaria, fetchDocumentoProprietario, fetchComprovanteEndereco, fetchFotoSilo, updateFotoSilo } = useSilo();
    const [activeIndex, setActiveIndex] = useState(0);
    const [siloData, setSiloData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [municipiosOptions, setMunicipiosOptions] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const [consultingNif, setConsultingNif] = useState(false);
    const [nifData, setNifData] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [documents, setDocuments] = useState({});
    const [imagemUrlFotografia, setImagemUrlFotografia] = useState('');
    const [novaFotografia, setNovaFotografia] = useState(null);
    const [previewFotografia, setPreviewFotografia] = useState('');
    const [uploadingFotografia, setUploadingFotografia] = useState(false);
    const [modalPreviewUrl, setModalPreviewUrl] = useState(null);
    const [modalPreviewTitle, setModalPreviewTitle] = useState('');

    const steps = [
        { label: 'Identificação', icon: Building },
        { label: 'Localização', icon: MapPin },
        { label: 'Proprietário', icon: UserCheck },
        { label: 'Capacidade', icon: Package },
        { label: 'Infraestrutura', icon: Settings },
        { label: 'Situação Legal', icon: Shield },
        { label: 'Documentos', icon: FileText }
    ];

    const loadDocuments = async (siloId) => {
        try {
            const [licenca, certificacao, documento, comprovante, foto] = await Promise.allSettled([
                fetchLicencaOperacao(siloId),
                fetchCertificacaoSanitaria(siloId),
                fetchDocumentoProprietario(siloId),
                fetchComprovanteEndereco(siloId),
                fetchFotoSilo(siloId)
            ]);

            setDocuments({
                licencaOperacao: licenca.status === 'fulfilled' ? licenca.value : null,
                certificacaoSanitaria: certificacao.status === 'fulfilled' ? certificacao.value : null,
                documentoProprietario: documento.status === 'fulfilled' ? documento.value : null,
                comprovanteEndereco: comprovante.status === 'fulfilled' ? comprovante.value : null,
                fotoSilo: foto.status === 'fulfilled' ? foto.value : null
            });

            // Set photo URL if available
            if (foto.status === 'fulfilled' && foto.value) {
                setImagemUrlFotografia(foto.value);
            }
        } catch (error) {
            console.error('Erro ao carregar documentos:', error);
        }
    };

    useEffect(() => {
        const loadSilo = async () => {
            if (id) {
                setDataLoading(true);
                try {
                    const silo = await fetchSiloById(id);
                    setSiloData(silo);
                    await loadDocuments(id);
                } catch (error) {
                    console.error('Erro ao carregar silo:', error);
                } finally {
                    setDataLoading(false);
                }
            }
        };

        loadSilo();
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
                                    <strong>Localização do Silo</strong><br />
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

    const handleEdit = () => {
        setOriginalData({ ...siloData });

        // Load municipalities for current province when editing starts
        if (siloData?.provincia) {
            const provinciaSelected = provinciasData.find(
                p => p.nome.toUpperCase() === siloData.provincia.toUpperCase()
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
        setSiloData(originalData);
        setIsEditing(false);
        setShowCancelModal(false);
        setOriginalData(null);
    };

    // Função para consultar NIF na API
    const consultarNIF = async (nifValue) => {
        if (!nifValue || nifValue.length < 9) return;

        setConsultingNif(true);

        try {
            const username = 'minagrif';
            const password = 'Nz#$20!23Mg';
            const credentials = btoa(`${username}:${password}`);

            const response = await axios.get(`https://api.gov.ao/nif/v1/consultarNIF`, {
                params: {
                    tipoDocumento: 'NIF',
                    numeroDocumento: nifValue
                },
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (response.status === 200 && data.code === 200 && data.data) {
                const nifInfo = data.data;
                setNifData(nifInfo);

                setSiloData(prev => ({
                    ...prev,
                    nomeDoProprietario: nifInfo.nome_contribuinte || '',
                    emailDoProprietario: nifInfo.email || '',
                    telefoneDoProprietario: nifInfo.numero_contacto || ''
                }));

                setToastMessage({ type: 'success', message: 'NIF consultado! Dados preenchidos automaticamente.' });
                setTimeout(() => setToastMessage(null), 3000);
            } else {
                setNifData(null);
                setToastMessage({ type: 'error', message: 'NIF não encontrado.' });
                setTimeout(() => setToastMessage(null), 3000);
            }
        } catch (error) {
            setNifData(null);
            setToastMessage({ type: 'error', message: 'Erro ao consultar NIF.' });
            setTimeout(() => setToastMessage(null), 3000);
            console.error('Erro ao consultar NIF:', error);
        } finally {
            setConsultingNif(false);
        }
    };

    const debounceTimer = React.useRef(null);
    const handleNifChange = (value) => {
        setSiloData(prev => ({ ...prev, nifDoProprietario: value }));

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            if (value && value.length >= 9) {
                consultarNIF(value);
            }
        }, 1500);
    };

    // Utility function to remove underscores and format text
    const formatDisplayValue = (value) => {
        if (!value) return '';
        return value.toString().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Photo upload functions
    const uploadFotografia = async (file) => {
        if (!file) {
            setToastMessage({ type: 'error', message: 'Selecione uma foto primeiro' });
            setTimeout(() => setToastMessage(null), 3000);
            return;
        }

        setUploadingFotografia(true);
        try {
            const formData = new FormData();
            formData.append('novaImagem', file);

            await updateFotoSilo(id, formData); // PATCH para /api/silo/{id}/fotoDoSiloFile

            setToastMessage({ type: 'success', message: 'Fotografia atualizada com sucesso!' });
            setTimeout(() => setToastMessage(null), 3000);
            const url = URL.createObjectURL(file);
            setImagemUrlFotografia(url);
            setNovaFotografia(null);
            setPreviewFotografia('');
        } catch (error) {
            console.error('Erro ao fazer upload da fotografia:', error);
            setToastMessage({ type: 'error', message: 'Erro ao atualizar fotografia' });
            setTimeout(() => setToastMessage(null), 3000);
        } finally {
            setUploadingFotografia(false);
        }
    };

    const handleFotografiaChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNovaFotografia(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewFotografia(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const cancelarFotografia = () => {
        setNovaFotografia(null);
        setPreviewFotografia('');
    };

    // Document preview function
    const handlePreview = (document, title) => {
        if (document && document.url) {
            setModalPreviewUrl(document.url);
            setModalPreviewTitle(title);
        }
    };

    // Document upload function
    const handleDocumentUpload = async (documentType, fetchFunction, updateFunction, file) => {
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('novaImagem', file);

            await updateFunction(id, formData);

            // Reload the document
            const updatedDoc = await fetchFunction(id);
            setDocuments(prev => ({
                ...prev,
                [documentType]: updatedDoc
            }));

            setToastMessage({ type: 'success', message: 'Documento atualizado com sucesso!' });
            setTimeout(() => setToastMessage(null), 3000);
        } catch (error) {
            console.error('Erro ao atualizar documento:', error);
            setToastMessage({ type: 'error', message: 'Erro ao atualizar documento' });
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const handleSave = async () => {
        try {
            setDataLoading(true);

            // Create FormData if there are files to upload
            const hasFiles = Object.keys(uploadedFiles).length > 0;
            let dataToSend = siloData;

            if (hasFiles) {
                const formData = new FormData();

                // Add all text fields
                Object.keys(siloData).forEach(key => {
                    if (siloData[key] !== null && siloData[key] !== undefined && !(siloData[key] instanceof File)) {
                        if (Array.isArray(siloData[key])) {
                            siloData[key].forEach(item => formData.append(key, item));
                        } else {
                            formData.append(key, siloData[key]);
                        }
                    }
                });

                // Add files
                Object.keys(uploadedFiles).forEach(key => {
                    if (uploadedFiles[key]) {
                        formData.append(key, uploadedFiles[key]);
                    }
                });

                dataToSend = formData;
            }

            await updateSilo(id, dataToSend);
            setToastMessage({ type: 'success', message: 'Silo atualizado com sucesso!' });
            setTimeout(() => setToastMessage(null), 3000);
            setIsEditing(false);
            setOriginalData(null);
            setUploadedFiles({});
        } catch (error) {
            console.error('Erro ao atualizar silo:', error);
            setToastMessage({ type: 'error', message: 'Erro ao atualizar silo.' });
            setTimeout(() => setToastMessage(null), 3000);
        } finally {
            setDataLoading(false);
        }
    };

    const handleFileUpload = (fieldName, file) => {
        if (!file) return;

        setUploadedFiles(prev => ({
            ...prev,
            [fieldName]: file
        }));

        // Add file to siloData for API submission
        setSiloData(prev => ({
            ...prev,
            [fieldName]: file
        }));

        setToastMessage({ type: 'success', message: `Arquivo ${file.name} carregado com sucesso!` });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleInputChange = (field, value) => {
        setSiloData(prev => ({ ...prev, [field]: value }));

        // Handle province change to update municipalities
        if (field === 'provincia') {
            const provinciaValue = typeof value === 'object' ? value.value : value;
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

            // Clear municipality when province changes
            setSiloData(prev => ({ ...prev, municipio: '' }));
        }
    };

    const renderStepContent = (index) => {
        if (!siloData) return null;

        switch (index) {
            case 0: // Identificação
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-start rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex justify-start items-center text-start space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação do Silo</h3>
                            </div>
                            <p className="text-gray-600">
                                Dados da unidade de armazenamento.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <CustomInput
                                    type="text"
                                    label="Nome do Silo/Centro"
                                    value={siloData.nomeDoSilo || ''}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('nomeDoSilo', value)}
                                    iconStart={<Building size={18} />}
                                />
                            </div>
                            <CustomInput
                                type={isEditing ? "select" : "text"}
                                label="Tipo de Unidade"
                                value={isEditing ? { label: formatDisplayValue(siloData.tipoDeUnidade) || '', value: siloData.tipoDeUnidade || '' } : formatDisplayValue(siloData.tipoDeUnidade)}
                                options={isEditing ? [
                                    { label: 'Silo Metálico', value: 'SILO_METALICO' },
                                    { label: 'Silo de Concreto', value: 'SILO_CONCRETO' },
                                    { label: 'Armazém Convencional', value: 'ARMAZEM_CONVENCIONAL' },
                                    { label: 'Armazém Graneleiro', value: 'ARMAZEM_GRANELEIRO' },
                                    { label: 'Centro de Distribuição', value: 'CENTRO_DISTRIBUICAO' },
                                    { label: 'Outro', value: 'OUTRO' }
                                ] : undefined}
                                disabled={!isEditing}
                                onChange={(value) => handleInputChange('tipoDeUnidade', typeof value === 'object' ? value.value : value)}
                                iconStart={<Package size={18} />}
                            />
                            <CustomInput
                                type="text"
                                label="Código de Registro"
                                value={siloData.codigoDeRegistro || ''}
                                disabled={!isEditing}
                                onChange={(value) => handleInputChange('codigoDeRegistro', value)}
                                iconStart={<FileText size={18} />}
                            />
                        </div>
                    </div>
                );

            case 1: // Localização
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-start mb-8 border border-green-100">
                            <div className="flex justify-start items-center text-start space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Localização</h3>
                            </div>
                            <p className="text-gray-600">
                                Localização do silo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <CustomInput
                                    type="text"
                                    label="Endereço"
                                    value={siloData.endereço || ''}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('endereço', value)}
                                    iconStart={<MapPin size={18} />}
                                />
                            </div>
                            <CustomInput
                                type={isEditing ? "select" : "text"}
                                label="Província/Estado"
                                value={isEditing ? { label: siloData.provincia || '', value: siloData.provincia || '' } : (siloData.provincia || '')}
                                options={isEditing ? provinciasData.map(provincia => ({
                                    label: provincia.nome,
                                    value: provincia.nome.toUpperCase()
                                })) : undefined}
                                disabled={!isEditing}
                                onChange={(value) => handleInputChange('provincia', typeof value === 'object' ? value.value : value)}
                                iconStart={<MapPin size={18} />}
                            />
                            <CustomInput
                                type={isEditing ? "select" : "text"}
                                label="Distrito/Município"
                                value={isEditing ? { label: siloData.municipio || '', value: siloData.municipio || '' } : (siloData.municipio || '')}
                                options={isEditing ? municipiosOptions : undefined}
                                disabled={!isEditing || !siloData.provincia}
                                onChange={(value) => handleInputChange('municipio', typeof value === 'object' ? value.value : value)}
                                iconStart={<MapPin size={18} />}
                            />
                            <CustomInput
                                type="text"
                                label="Latitude"
                                value={siloData.latitude || ''}
                                disabled={!isEditing}
                                onChange={(value) => handleInputChange('latitude', value)}
                                iconStart={<MapPin size={18} />}
                            />
                            <CustomInput
                                type="text"
                                label="Longitude"
                                value={siloData.longitude || ''}
                                disabled={!isEditing}
                                onChange={(value) => handleInputChange('longitude', value)}
                                iconStart={<MapPin size={18} />}
                            />
                        </div>

                        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                Coordenadas GPS
                            </h4>
                            <MapaGPS
                                latitude={siloData.latitude}
                                longitude={siloData.longitude}
                                onLocationSelect={isEditing ? (lat, lng) => {
                                    handleInputChange('latitude', lat);
                                    handleInputChange('longitude', lng);
                                } : () => { }}
                            />
                            {isEditing && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600 flex items-center">
                                        <Info size={16} className="mr-2" />
                                        Clique no mapa para selecionar uma localização automaticamente
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 2: // Proprietário
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 text-start to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <UserCheck className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Proprietário/Responsável</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações do proprietário ou responsável pela unidade de armazenamento.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <CustomInput
                                        type="text"
                                        label="Nome Completo"
                                        value={siloData.nomeDoProprietario || ''}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('nomeDoProprietario', value)}
                                        iconStart={<UserCheck size={18} />}
                                    />
                                </div>
                                <CustomInput
                                    type="text"
                                    label="Entidade"
                                    value={siloData.empresaDoProprietario || ''}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('empresaDoProprietario', value)}
                                    iconStart={<Building size={18} />}
                                />
                                <CustomInput
                                    type="text"
                                    label="NIF/ID Fiscal"
                                    value={siloData.nifDoProprietario || ''}
                                    disabled={!isEditing}
                                    onChange={isEditing ? handleNifChange : (value) => handleInputChange('nifDoProprietario', value)}
                                    iconStart={<FileText size={18} />}
                                    helperText={isEditing && consultingNif ? 'Consultando NIF...' : (isEditing ? 'Digite o NIF para consulta automática' : undefined)}
                                />
                                <CustomInput
                                    type="text"
                                    label="Telefone"
                                    value={siloData.telefoneDoProprietario || ''}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('telefoneDoProprietario', value)}
                                    iconStart={<UserCheck size={18} />}
                                />
                                <CustomInput
                                    type="text"
                                    label="E-mail"
                                    value={siloData.emailDoProprietario || ''}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('emailDoProprietario', value)}
                                    iconStart={<UserCheck size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3: // Capacidade
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 text-start to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Package className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Capacidade de Armazenamento</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre a capacidade e produtos armazenados.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Package className="w-5 h-5 mr-2 text-orange-600" />
                                    Capacidade Física
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="Capacidade Total (toneladas)"
                                        value={siloData.capacidadeMaxima?.toString() || ''}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('capacidadeMaxima', parseFloat(value) || 0)}
                                        iconStart={<Package size={18} />}
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Capacidade Utilizada (toneladas)"
                                        value={siloData.capacidadeUtilizada?.toString() || ''}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('capacidadeUtilizada', parseFloat(value) || 0)}
                                        iconStart={<Package size={18} />}
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Número de Unidades"
                                        value={siloData.numeroDeUnidade?.toString() || ''}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('numeroDeUnidade', parseInt(value) || 0)}
                                        iconStart={<Building size={18} />}
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Package className="w-5 h-5 mr-2 text-orange-600" />
                                    Produtos Armazenados
                                </h4>
                                <CustomInput
                                    type={isEditing ? "multiselect" : "text"}
                                    label="Produtos"
                                    value={isEditing ?
                                        (Array.isArray(siloData.produtosArmazenados) ?
                                            siloData.produtosArmazenados.map(p => ({ label: formatDisplayValue(p), value: p })) : []) :
                                        (Array.isArray(siloData.produtosArmazenados) ? siloData.produtosArmazenados.map(p => formatDisplayValue(p)).join(', ') : '')
                                    }
                                    options={isEditing ? [
                                        { label: 'Milho', value: 'MILHO' },
                                        { label: 'Arroz', value: 'ARROZ' },
                                        { label: 'Feijão', value: 'FEIJAO' },
                                        { label: 'Trigo', value: 'TRIGO' },
                                        { label: 'Soja', value: 'SOJA' },
                                        { label: 'Sorgo', value: 'SORGO' },
                                        { label: 'Amendoim', value: 'AMENDOIM' },
                                        { label: 'Outros', value: 'OUTROS' }
                                    ] : undefined}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('produtosArmazenados', Array.isArray(value) ? value.map(v => v.value) : value.split(',').map(p => p.trim()))}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4: // Infraestrutura
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 text-start rounded-2xl p-6 mb-8 border border-teal-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-teal-100 rounded-lg">
                                    <Settings className="w-6 h-6 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Infraestrutura e Equipamentos</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre a infraestrutura e equipamentos disponíveis.
                            </p>
                        </div>
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Settings className="w-5 h-5 mr-2 text-teal-600" />
                                    Sistemas Técnicos
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Sistema de Secagem"
                                        value={isEditing ? { label: siloData.sistemaDeSecagem === 'true' ? 'Sim' : 'Não', value: siloData.sistemaDeSecagem } : (siloData.sistemaDeSecagem === 'true' ? 'Sim' : 'Não')}
                                        options={isEditing ? [{ label: 'Sim', value: 'true' }, { label: 'Não', value: 'false' }] : undefined}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('sistemaDeSecagem', typeof value === 'object' ? value.value : value)}
                                    />
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Sistema de Ventilação"
                                        value={isEditing ? { label: siloData.sistemaDeVentilacao === 'true' ? 'Sim' : 'Não', value: siloData.sistemaDeVentilacao } : (siloData.sistemaDeVentilacao === 'true' ? 'Sim' : 'Não')}
                                        options={isEditing ? [{ label: 'Sim', value: 'true' }, { label: 'Não', value: 'false' }] : undefined}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('sistemaDeVentilacao', typeof value === 'object' ? value.value : value)}
                                    />
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Proteção contra Pragas"
                                        value={isEditing ? { label: siloData.protecaoContraPragas === 'true' ? 'Sim' : 'Não', value: siloData.protecaoContraPragas } : (siloData.protecaoContraPragas === 'true' ? 'Sim' : 'Não')}
                                        options={isEditing ? [{ label: 'Sim', value: 'true' }, { label: 'Não', value: 'false' }] : undefined}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('protecaoContraPragas', typeof value === 'object' ? value.value : value)}
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Settings className="w-5 h-5 mr-2 text-teal-600" />
                                    Energia e Acesso
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Tipo de Energia"
                                        value={isEditing ? { label: formatDisplayValue(siloData.tipoDeEnergia) || '', value: siloData.tipoDeEnergia || '' } : formatDisplayValue(siloData.tipoDeEnergia)}
                                        options={isEditing ? [
                                            { label: 'Rede Pública', value: 'REDE_PUBLICA' },
                                            { label: 'Gerador', value: 'GERADOR' },
                                            { label: 'Solar', value: 'SOLAR' },
                                            { label: 'Híbrido', value: 'HIBRIDO' }
                                        ] : undefined}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('tipoDeEnergia', typeof value === 'object' ? value.value : value)}
                                    />
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Estado das Vias de Acesso"
                                        value={isEditing ? { label: formatDisplayValue(siloData.estadoDasViasDeAcesso) || '', value: siloData.estadoDasViasDeAcesso || '' } : formatDisplayValue(siloData.estadoDasViasDeAcesso)}
                                        options={isEditing ? [
                                            { label: 'Boa', value: 'BOA' },
                                            { label: 'Regular', value: 'REGULAR' },
                                            { label: 'Má', value: 'MA' }
                                        ] : undefined}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('estadoDasViasDeAcesso', typeof value === 'object' ? value.value : value)}
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Package className="w-5 h-5 mr-2 text-teal-600" />
                                    Equipamentos Disponíveis
                                </h4>
                                <CustomInput
                                    type={isEditing ? "multiselect" : "text"}
                                    label="Equipamentos"
                                    value={isEditing ?
                                        (Array.isArray(siloData.equipamentosDisponiveis) ?
                                            siloData.equipamentosDisponiveis.map(e => ({ label: formatDisplayValue(e), value: e })) : []) :
                                        (Array.isArray(siloData.equipamentosDisponiveis) ? siloData.equipamentosDisponiveis.map(e => formatDisplayValue(e)).join(', ') : '')
                                    }
                                    options={isEditing ? [
                                        { label: 'Balanças', value: 'BALANCAS' },
                                        { label: 'Esteiras Transportadoras', value: 'ESTEIRAS' },
                                        { label: 'Elevadores de Grãos', value: 'ELEVADORES' },
                                        { label: 'Sistemas de Limpeza', value: 'LIMPEZA' },
                                        { label: 'Termometria', value: 'TERMOMETRIA' },
                                        { label: 'Equipamentos de Carga/Descarga', value: 'CARGA_DESCARGA' }
                                    ] : undefined}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('equipamentosDisponiveis', Array.isArray(value) ? value.map(v => v.value) : value.split(',').map(e => e.trim()))}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5: // Situação Legal
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 text-start rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Situação Legal</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre licenças e certificações da unidade.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Licença de Operação"
                                    value={isEditing ? { label: siloData.licencaDeOperacao === 'true' ? 'Sim' : 'Não', value: siloData.licencaDeOperacao } : (siloData.licencaDeOperacao === 'true' ? 'Sim' : 'Não')}
                                    options={isEditing ? [{ label: 'Sim', value: 'true' }, { label: 'Não', value: 'false' }] : undefined}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('licencaDeOperacao', typeof value === 'object' ? value.value : value)}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Certificação Sanitária"
                                    value={isEditing ? { label: siloData.certificacaoSanitaria === 'true' ? 'Sim' : 'Não', value: siloData.certificacaoSanitaria } : (siloData.certificacaoSanitaria === 'true' ? 'Sim' : 'Não')}
                                    options={isEditing ? [{ label: 'Sim', value: 'true' }, { label: 'Não', value: 'false' }] : undefined}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('certificacaoSanitaria', typeof value === 'object' ? value.value : value)}
                                />
                                <CustomInput
                                    type={isEditing ? "date" : "text"}
                                    label="Data da Licença"
                                    value={isEditing ? (typeof siloData.dataDeLicenca === 'string' ? siloData.dataDeLicenca.split('T')[0] : siloData.dataDeLicenca || '') : (siloData.dataDeLicenca ? new Date(siloData.dataDeLicenca).toLocaleDateString() : '')}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('dataDeLicenca', value)}
                                />
                                <CustomInput
                                    type={isEditing ? "date" : "text"}
                                    label="Validade da Licença"
                                    value={isEditing ? (typeof siloData.validadeDaLicenca === 'string' ? siloData.validadeDaLicenca.split('T')[0] : siloData.validadeDaLicenca || '') : (siloData.validadeDaLicenca ? new Date(siloData.validadeDaLicenca).toLocaleDateString() : '')}
                                    disabled={!isEditing}
                                    onChange={(value) => handleInputChange('validadeDaLicenca', value)}
                                />
                                <div className="md:col-span-2 lg:col-span-4">
                                    <CustomInput
                                        type="textarea"
                                        label="Outras Autorizações"
                                        value={siloData.outrasAutorizacoes || ''}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('outrasAutorizacoes', value)}
                                        rows={3}
                                    />
                                    <CustomInput
                                        type="textarea"
                                        label="Observações Gerais"
                                        value={siloData.observacoesGerais || ''}
                                        disabled={!isEditing}
                                        onChange={(value) => handleInputChange('observacoesGerais', value)}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 6: // Documentos
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 text-start rounded-2xl p-6 mb-8 border border-indigo-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Documentos Obrigatórios' : 'Documentos'}</h3>
                            </div>
                            <p className="text-gray-600">
                                {isEditing ? 'Faça o upload dos documentos necessários.' : 'Documentos anexados ao registro do silo.'}
                            </p>
                        </div>

                        {/* Fotografia do Silo - SEMPRE visível, só aqui */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                <Camera className="w-5 h-5 mr-2 text-indigo-600" />
                                Fotografia do Silo
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Fotografia do Silo</h3>
                                    {imagemUrlFotografia ? (
                                        <img
                                            src={previewFotografia || imagemUrlFotografia}
                                            alt="Foto do Silo"
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
                            </div>
                        </div>

                        {/* Documentos Anexados */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                                Documentos Anexados
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {/* Licença de Operação */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Licença de Operação
                                    </label>
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <Shield className="w-5 h-5 text-gray-500 mr-3" />
                                        <div className="flex-1">
                                            <span className="text-sm text-gray-700">
                                                {documents.licencaOperacao ? 'Documento disponível' : 'Não anexado'}
                                            </span>
                                        </div>
                                        {documents.licencaOperacao && (
                                            <>
                                                <button
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                    onClick={() => handlePreview(documents.licencaOperacao, 'Licença de Operação')}
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        {isEditing && (
                                            <label className="ml-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors">
                                                <input
                                                    type="file"
                                                    accept="application/pdf,image/*"
                                                    className="hidden"
                                                    onChange={e => handleDocumentUpload(
                                                        'licencaOperacao',
                                                        fetchLicencaOperacao,
                                                        async (id, formData) => {

                                                            await api.patch(`/silo/${id}/licencaDeOperacaoFile`, formData, {
                                                                headers: { 'Content-Type': 'multipart/form-data' }
                                                            });
                                                        },
                                                        e.target.files[0]
                                                    )}
                                                />
                                                {documents.licencaOperacao ? 'Atualizar' : 'Anexar'}
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Certificação Sanitária */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Certificação Sanitária
                                    </label>
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-gray-500 mr-3" />
                                        <div className="flex-1">
                                            <span className="text-sm text-gray-700">
                                                {documents.certificacaoSanitaria ? 'Documento disponível' : 'Não anexado'}
                                            </span>
                                        </div>
                                        {documents.certificacaoSanitaria && (
                                            <>
                                                <button
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                    onClick={() => handlePreview(documents.certificacaoSanitaria, 'Certificação Sanitária')}
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        {isEditing && (
                                            <label className="ml-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors">
                                                <input
                                                    type="file"
                                                    accept="application/pdf,image/*"
                                                    className="hidden"
                                                    onChange={e => handleDocumentUpload(
                                                        'certificacaoSanitaria',
                                                        fetchCertificacaoSanitaria,
                                                        async (id, formData) => {
                                                            // PATCH para /silo/{id}/certificacaoSanitariaFile
                                                            await api.patch(`/silo/${id}/certificacaoSanitariaFile`, formData, {
                                                                headers: { 'Content-Type': 'multipart/form-data' }
                                                            });
                                                        },
                                                        e.target.files[0]
                                                    )}
                                                />
                                                {documents.certificacaoSanitaria ? 'Atualizar' : 'Anexar'}
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Documento do Proprietário */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Documento do Proprietário
                                    </label>
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <FileText className="w-5 h-5 text-gray-500 mr-3" />
                                        <div className="flex-1">
                                            <span className="text-sm text-gray-700">
                                                {documents.documentoProprietario ? 'Documento disponível' : 'Não anexado'}
                                            </span>
                                        </div>
                                        {documents.documentoProprietario && (
                                            <>
                                                <button
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                    onClick={() => handlePreview(documents.documentoProprietario, 'Documento do Proprietário')}
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        {isEditing && (
                                            <label className="ml-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors">
                                                <input
                                                    type="file"
                                                    accept="application/pdf,image/*"
                                                    className="hidden"
                                                    onChange={e => handleDocumentUpload(
                                                        'documentoProprietario',
                                                        fetchDocumentoProprietario,
                                                        async (id, formData) => {
                                                            // PATCH para /silo/{id}/documentoDoProprietarioFile
                                                            await api.patch(`/silo/${id}/documentoDoProprietarioFile`, formData, {
                                                                headers: { 'Content-Type': 'multipart/form-data' }
                                                            });
                                                        },
                                                        e.target.files[0]
                                                    )}
                                                />
                                                {documents.documentoProprietario ? 'Atualizar' : 'Anexar'}
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Comprovante de Endereço */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Comprovante de Endereço
                                    </label>
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                                        <div className="flex-1">
                                            <span className="text-sm text-gray-700">
                                                {documents.comprovanteEndereco ? 'Documento disponível' : 'Não anexado'}
                                            </span>
                                        </div>
                                        {documents.comprovanteEndereco && (
                                            <>
                                                <button
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                    onClick={() => handlePreview(documents.comprovanteEndereco, 'Comprovante de Endereço')}
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        {isEditing && (
                                            <label className="ml-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors">
                                                <input
                                                    type="file"
                                                    accept="application/pdf,image/*"
                                                    className="hidden"
                                                    onChange={e => handleDocumentUpload(
                                                        'comprovanteEndereco',
                                                        fetchComprovanteEndereco,
                                                        async (id, formData) => {
                                                            // PATCH para /silo/{id}/comprovanteDeEnderecoFile
                                                            await api.patch(`/silo/${id}/comprovanteDeEnderecoFile`, formData, {
                                                                headers: { 'Content-Type': 'multipart/form-data' }
                                                            });
                                                        },
                                                        e.target.files[0]
                                                    )}
                                                />
                                                {documents.comprovanteEndereco ? 'Atualizar' : 'Anexar'}
                                            </label>
                                        )}
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                );

            default:
                return null;
        }
    };

    if (dataLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            </div>
        );
    }

    if (!siloData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Silo não encontrado</h2>
                    <p className="text-gray-500 mb-4">O silo solicitado não foi encontrado.</p>
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
                                    <div className="flex rounded-full top-0">
                                        <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-gray-100 text-gray-600">
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Detalhes do Silo
                                        </h2>
                                        <div className="text-gray-600">{siloData.nomeDoSilo || '--'}</div>
                                        <div className="flex gap-2 flex-wrap items-center mt-2">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-yellow-200 bg-yellow-50  text-yellow-700">
                                                <Building className="w-4 h-4 mr-1" /> {formatDisplayValue(siloData.tipoDeUnidade) || 'Silo'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mt-4 md:mt-0">
                                <div className="flex gap-3 w-full">
                                    {isEditing ? (
                                        <React.Fragment key="editing-buttons">
                                            <button
                                                key="cancel-btn"
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                                            >
                                                <X className="w-5 h-5" /> Cancelar
                                            </button>
                                            <button
                                                key="save-btn"
                                                onClick={handleSave}
                                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                            >
                                                <Save className="w-5 h-5" /> Salvar
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment key="view-buttons">
                                            <button
                                                key="edit-btn"
                                                onClick={handleEdit}
                                                className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base"
                                            >
                                                <SquarePen className="w-5 h-5" /> Editar
                                            </button>
                                            <button
                                                key="report-btn"
                                                className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                            >
                                                <Download className="w-5 h-5" /> Relatório
                                            </button>
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bg-white max-w-7xl mx-auto rounded-lg shadow-sm border border-gray-200'>
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
                                            ? ' bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg'
                                            : isCompleted
                                                ? ' bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-sm text-center font-medium ${isActive
                                            ? 'text-yellow-700'
                                            : isCompleted
                                                ? 'text-yellow-700'
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
                                className="bg-yellow-600 h-2 transition-all duration-300"
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
                                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
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

            {/* Modal de Preview */}
            {modalPreviewUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col items-center relative">
                        <button
                            onClick={() => setModalPreviewUrl(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{modalPreviewTitle}</h3>
                        {modalPreviewUrl && (
                            <iframe src={modalPreviewUrl} title="Preview" className="w-full h-96" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisualizarArmazenameto;