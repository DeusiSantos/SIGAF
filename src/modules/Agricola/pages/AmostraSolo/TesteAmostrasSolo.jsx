import axios from 'axios';
import html2canvas from 'html2canvas';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Camera,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Info,
    Loader,
    MapPin,
    TestTube,
    User
} from 'lucide-react';
import QRCode from 'qrcode';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import CustomInput from '../../../../core/components/CustomInput';
import insiginia from '../../../../assets/emblema.png';
import SIGAF from '../../../../assets/SIGAF.png';

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
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const cardRef = useRef(null);
    const [produtorSelected, setProdutorSelected] = useState({});

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
        dataColeta: new Date().toISOString().split('T')[0],

        // Análise do Solo
        ph: '',
        materiaOrganica: '',
        nitrogenio: '',
        fosforo: '',
        potassio: '',
        calcio: '',
        magnesio: '',
        ctc: '',
        saturacaoBases: '',
        aluminio: '',
        boro: '',
        ferro: '',
        zinco: '',
        manganes: ''
    };

    const [formData, setFormData] = useState(initialState);

    // Generate QR Code when identificacaoMostra changes
    useEffect(() => {
        const generateQRCode = async () => {
            if (formData.identificacaoMostra) {
                try {
                    const url = await QRCode.toDataURL(formData.identificacaoMostra, {
                        width: 80,
                        margin: 1,
                        color: {
                            dark: '#000000',
                            light: '#FFFFFF'
                        }
                    });
                    setQrCodeUrl(url);
                } catch (error) {
                    console.error('Erro ao gerar QR Code:', error);
                }
            }
        };
        generateQRCode();
    }, [formData.identificacaoMostra]);

    // Buscar produtores da API
    useEffect(() => {
        const fetchProdutores = async () => {
            setLoadingProdutores(true);
            try {
                const response = await axios.get('https://mwangobrainsa-001-site2.mtempurl.com/api/formulario/all');
                setProdutores(response.data);
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

    // Function to download card as image
    const downloadCard = async () => {
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true,
                    allowTaint: true
                });

                const link = document.createElement('a');
                link.download = `cartao-coleta-${formData.identificacaoMostra || 'amostra'}.png`;
                link.href = canvas.toDataURL();
                link.click();
            } catch (error) {
                console.error('Erro ao gerar imagem:', error);
                alert('Erro ao gerar imagem do cartão');
            }
        }
    };

    const handleSave = async () => {
        // Validação básica
        if (!formData.identificacaoMostra) {
            alert('Por favor, preencha a Identificação da Mostra');
            return;
        }

        if (!formData.profundidadeColeta || !formData.metodoColeta) {
            alert('Por favor, preencha todos os campos obrigatórios da coleta');
            return;
        }

        if (!formData.codigoTecnicoResponsavel) {
            alert('Por favor, preencha o Código do Técnico Responsável');
            return;
        }

        setSaving(true);
        try {
            // Criar FormData para multipart/form-data
            const apiFormData = new FormData();

            // Campos simples
            apiFormData.append('Este_solo_pertence_a_um_produt', formData.pertenceProdutor?.value || "nao");
            apiFormData.append('Profundidade_da_Coleta', formData.profundidadeColeta?.value || "");
            apiFormData.append('M_todo_de_Coleta', formData.metodoColeta?.value || "");
            apiFormData.append('Tipo_de_Solo', formData.tipoSolo?.value || "");
            apiFormData.append('Cor_do_Solo', formData.corSolo?.value || "");
            apiFormData.append('Textura', formData.textura?.value || "");
            apiFormData.append('Drenagem', formData.drenagem?.value || "");
            apiFormData.append('Observa_es_Gerais', formData.observacoesGerais || "");
            apiFormData.append('Tecnico_Responsavel', formData.codigoTecnicoResponsavel || "");
            apiFormData.append('C_digo_Supervisor', formData.codigoSupervisor || "");
            apiFormData.append('Data_da_Coleta', formData.dataColeta || "");
            apiFormData.append('Estado', formData.estado || "pendente");

            // Código do produtor
            if (formData.pertenceProdutor?.value === 'sim' && formData.produtorSelecionado?.value) {
                apiFormData.append('C_digo_do_', parseInt(formData.produtorSelecionado.value));
            } else {
                apiFormData.append('C_digo_do_', 0);
            }

            // Arrays - verificar como a API espera (pode ser JSON string ou múltiplos campos)
            // Opção 1: Enviar como JSON string
            apiFormData.append('Cultura_Actual', JSON.stringify(formData.culturasAtuais?.map(c => c.value) || []));
            apiFormData.append('Cultura_Anterior', JSON.stringify(formData.culturaAnterior || []));

            // OU Opção 2: Enviar cada item separadamente (se a API esperar assim)
            // formData.culturasAtuais?.forEach((cultura, index) => {
            //     apiFormData.append(`Cultura_Actual[${index}]`, cultura.value);
            // });

            // Upload da foto (arquivo real, não o nome)
            if (formData.fotografiaAmostra) {
                apiFormData.append('Upload_da_Fotografia_da_Amostra', formData.fotografiaAmostra);
            }

            console.log('📤 Enviando dados para API (FormData)');
            // Para debug do FormData
            for (let pair of apiFormData.entries()) {
                console.log(pair[0] + ': ', pair[1]);
            }

            const response = await axios.post(
                'https://mwangobrainsa-001-site2.mtempurl.com/api/testeDeAmostraDeSolo',
                apiFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            console.log('✅ Resposta da API:', response.data);
            alert('✅ Coleta de amostra registrada com sucesso!');
            downloadCard();
            setFormData(initialState);
            setActiveIndex(0);
        } catch (error) {
            console.error('❌ Erro completo:', error);
            console.error('❌ Response data:', error.response?.data);
            console.error('❌ Response status:', error.response?.status);

            let errorMessage = 'Erro ao registrar coleta. ';
            if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else if (error.response?.data) {
                errorMessage += JSON.stringify(error.response.data);
            } else {
                errorMessage += error.message;
            }

            alert(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (produtores?.length && formData?.produtorSelecionado?.value) {
            const produtor = produtores.find(p => p._id === parseInt(formData.produtorSelecionado.value));
            setProdutorSelected(produtor);
        }
    }, [produtores, formData]);


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

                                            console.log('Produtor selecionado:', produtor.provincia);
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
                                    type="multiselect"
                                    label="Cultura Anterior"
                                    options={culturas}
                                    value={formData.culturaAnterior}
                                    onChange={(value) => handleInputChange('culturaAnterior', value)}
                                    placeholder="Última cultura plantada (ex: milho, feijão)"
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
                                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${formData.fotografiaAmostra
                                        ? 'bg-green-50 border-green-300 hover:bg-green-100'
                                        : 'bg-gray-50 border-gray-300 hover:border-cyan-400 hover:bg-cyan-50'
                                        }`}
                                >
                                    <Camera className={`w-8 h-8 mb-3 ${formData.fotografiaAmostra ? 'text-green-500' : 'text-gray-400'}`} />
                                    <p className={`text-sm font-medium ${formData.fotografiaAmostra ? 'text-green-600' : 'text-gray-500'}`}>
                                        {formData.fotografiaAmostra ? `Foto: ${formData.fotografiaAmostra.name}` : 'Carregar fotografia da amostra'}
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

                    {/* Cartão de Coleta de Solo */}
                    {<div className="relative z-20 p-6 pt-4 pb-12">
                        <div className="flex justify-center mb-6">
                            <div
                                ref={cardRef}
                                className="w-[1063 px] h-[700px] bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden relative"
                                style={{
                                    background: 'linear-gradient(135deg, rgb(232, 244, 253) 0%, rgb(240, 249, 255) 25%, rgb(255, 255, 255) 50%, rgb(240, 249, 255) 75%, rgb(232, 244, 253) 100%)'
                                }}
                            >
                                {/* Padrão de fundo */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#grid)" />
                                    </svg>
                                </div>

                                {/* Marca d'água */}
                                <div className="absolute inset-0 bottom-12 flex items-center justify-center pointer-events-none">
                                    <div className="w-64 h-64 opacity-25  flex items-center justify-center">
                                        <img src={SIGAF} alt="" srcset="" />
                                    </div>
                                </div>

                                {/* QR Code no topo direito */}
                                <div className="absolute top-4 right-4 z-30">
                                    {qrCodeUrl && (
                                        <div className="bg-white p-2 rounded border ">
                                            <img src={qrCodeUrl} alt="QR Code" className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Conteúdo */}
                                <div className="relative z-20 p-6 pt-4 h-full">
                                    {/* Cabeçalho */}
                                    <div className="flex flex-col mb-8 items-center text-center">
                                        <div className="w-10 h-10 mb-2 bg-green-800 rounded-full flex items-center justify-center">
                                            <img src={insiginia} alt="" srcset="" />
                                        </div>
                                        <h1 className="text-[11px] font-bold text-green-800">REPÚBLICA DE ANGOLA</h1>
                                        <p className="text-[11px] font-bold text-green-800">MINISTÉRIO DA AGRICULTURA E FLORESTAS</p>
                                        <p className="text-[11px] font-bold text-green-800">INSTITUTO DE DESENVOLVIMENTO AGRÁRIO</p>

                                        <p className="text-[11px] font-bold text-gray-600">Sistema Integrado de Gestão Agro-Florestal</p>

                                    </div>

                                    {/* Dados principais */}
                                    <div className="space-y-3 mb-4">
                                        <div className="grid grid-cols-[auto_1fr_auto]  ">
                                            <span className="text-[11px] font-semibold text-gray-700">Identificação da Amostra:</span>
                                            <div className="flex-1 border-b border-dashed border-gray-400 mx-2"></div>
                                            <span className="text-[11px] font-bold text-gray-900">{formData.identificacaoMostra || 'Não informado'}</span>
                                        </div>

                                        <div className="grid grid-cols-[auto_1fr_auto]  ">
                                            <span className="text-xs font-semibold text-gray-700">Nome do Produtor:</span>
                                            <div className="flex-1 border-b border-dashed border-gray-400 mx-2"></div>
                                            <span className="grid grid-cols-[auto_1fr_auto] text-xs font-bold text-gray-900 text-right max-w-[200px] ">
                                                {formData.pertenceProdutor?.value === 'sim' && formData.produtorSelecionado
                                                    ? formData.produtorSelecionado.label?.split(' - ')[0]
                                                    : 'Não informado'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-[auto_1fr_auto]">
                                            <span className="text-xs font-semibold text-gray-700">Localização:</span>
                                            <div className="flex-1 border-b border-dashed border-gray-400 mx-2"></div>
                                            <span className="grid grid-cols-[auto_1fr_auto] text-xs font-bold text-gray-900 text-right max-w-[200px]">
                                                {[
                                                    produtorSelected?.provincia,
                                                    produtorSelected?.municipio
                                                ].filter(Boolean).join(', ') || 'Não informado'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-[auto_1fr_auto]  ">
                                            <span className="text-xs font-semibold text-gray-700">Data da Coleta:</span>
                                            <div className="flex-1 border-b border-dashed border-gray-400 mx-2"></div>
                                            <span className="text-xs font-bold text-gray-900">{formData.dataColeta || 'Não informado'}</span>
                                        </div>

                                        <div className="grid grid-cols-[auto_1fr_auto]  ">
                                            <span className="text-xs font-semibold text-gray-700">Método de Coleta:</span>
                                            <div className="flex-1 border-b border-dashed border-gray-400 mx-2"></div>
                                            <span className="text-xs font-bold text-gray-900">{formData.metodoColeta?.label || 'Não informado'}</span>
                                        </div>

                                        <div className="grid grid-cols-[auto_1fr_auto]  ">
                                            <span className="text-xs font-semibold text-gray-700">Tipo de Solo:</span>
                                            <div className="flex-1 border-b border-dashed border-gray-400 mx-2"></div>
                                            <span className="text-xs font-bold text-gray-900">{formData.tipoSolo?.label || 'Não informado'}</span>
                                        </div>

                                        <div className="grid grid-cols-[auto_1fr_auto]  ">
                                            <span className="text-xs font-semibold text-gray-700">Técnico Responsável:</span>
                                            <div className="flex-1 border-b border-dashed border-gray-400 mx-2"></div>
                                            <span className="text-xs font-bold text-gray-900">{formData.codigoTecnicoResponsavel || 'Não informado'}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span className=" flex justify-center items-center  text-xs align-middle  w-full  p-1 font-semibold bg-emerald-600 text-white ">Análise do Solo </span>
                                    </div>

                                    {/* Campos de Análise do Solo */}
                                    <table className="w-full text-[11px] mt-2 border-collapse mb-5 " >
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-400 p-1 text-center w-20 font-semibold" >Parâmetro</th>
                                                <th className="border border-gray-400 p-1 text-center font-semibold">Valor</th>
                                                <th className="border w-20 border-gray-400 p-1 text-center font-semibold">Unidade</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{lineHeight: 0.2}}>
                                            {[
                                                { param: "pH", unit: "-" },
                                                { param: "MO", unit: "g/dm³" },
                                                { param: "P", unit: "mg/dm³" },
                                                { param: "K", unit: "cmolc/dm³" },
                                                { param: "Ca", unit: "cmolc/dm³" },
                                                { param: "Mg", unit: "cmolc/dm³" },
                                                { param: "CTC", unit: "cmolc/dm³" },
                                                { param: "V", unit: "%" },
                                                { param: "Al", unit: "cmolc/dm³" },
                                                { param: "B", unit: "mg/dm³" },
                                                { param: "Fe", unit: "mg/dm³" },
                                                { param: "Zn", unit: "mg/dm³" },
                                                { param: "Mn", unit: "mg/dm³" },
                                            ].map((item, index) => (
                                                <tr key={index}>
                                                    <td className="border border-gray-400 font-semibold text-gray-700 p-1 text-center text-[11px] align-middle" style={{lineHeight: 0.8}}>{item.param}</td>
                                                    <td className="border border-gray-400 p-1 text-center align-middle"></td>
                                                    <td className="border border-gray-400 p-1 font-semibold text-gray-700 text-center text-[11px] align-middle" style={{lineHeight: 0.8}}>{item.unit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>





                                    {/* Rodapé */}
                                    <div className="absolute bottom-4 left-4 text-xs text-gray-500">
                                        <p>SIGAF - {new Date().getFullYear()}</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}

                    {/* Botão para baixar */}
                    <div className="flex justify-center">
                        <button
                            onClick={downloadCard}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Download className="w-5 h-5" />
                            Baixar Cartão PNG
                        </button>
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
                        className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${idx > activeIndex ? 'opacity-50' : ''
                            }`}
                        onClick={() => idx <= activeIndex && setActiveIndex(idx)}
                    >
                        <div
                            className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${idx < activeIndex
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

                <button
                    className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${activeIndex === steps.length - 1
                        ? (saving ? 'bg-gradient-to-r from-emerald-700 to-emerald-500 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-700 to-emerald-500 hover:bg-emerald-700 text-white shadow-lg')
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