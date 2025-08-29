import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import {
    ArrowLeft,
    Download,
    Save,
    Printer,
    Eye,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    RotateCcw,
    User,
    Loader
} from 'lucide-react';

import image from '../../assets/emblema.png'
import IDA from '../../assets/IDA.png'
import ISV from '../../assets/ISV.png'
import MinAdriPesca from '../../assets/MINISTERIO-DA-AGRICULTURA-removebg-preview.png';
import fotoC from '../../assets/fotoC.jpeg';
import api from '../../services/api';
import logoRNPA from '../../assets/RNPA-removebg.png'
import logo5 from '../../assets/logo5.png'
import sense from '../../assets/sense.png'
import iiv from '../../assets/iiiv.png'

// Função para mapear dados da API para o cartão
const mapApiDataToCard = (apiData) => {
    if (!apiData) return null;

    // Mapear gênero
    const mapGenero = (genero) => {
        return genero === 'm' ? 'M' : 'F';
    };

    // Mapear atividades
    const mapAtividades = (atividadesString) => {
        if (!atividadesString) return [];
        const atividades = atividadesString.split(' ');
        return atividades.map(atividade => {
            switch (atividade) {
                case 'agricultura': return 'Agricultura';
                case 'pecuaria': return 'Pecuária';
                case 'agropecuaria': return 'Agropecuária';
                case 'aquicultura': return 'Aquicultura';
                case 'produtos_florestais': return 'Produtos Florestais';
                default: return atividade.charAt(0).toUpperCase() + atividade.slice(1);
            }
        });
    };

    // Mapear tipo de organização
    const mapTipoOrganizacao = (tipo) => {
        switch (tipo) {
            case '1': return 'ECA';
            case '2': return 'Associação';
            case '3': return 'Cooperativa';
            default: return 'Outro';
        }
    };

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            return 'N/A';
        }
    };

    // Gerar datas de emissão e validade
    const dataEmissao = new Date();
    const dataValidade = new Date();
    dataValidade.setFullYear(dataValidade.getFullYear() + 5);

    return {
        id: apiData._uuid || apiData._id?.toString(),
        codigoRNPA: `RNPA${new Date(apiData.registration_date || '2025-01-01').getFullYear()}${apiData._id?.toString().slice(-3)}`,
        nome: apiData.beneficiary_name || `${apiData.nome_produtor || ''} ${apiData.nome_meio_produtor || ''} ${apiData.sobrenome_produtor || ''}`.trim(),
        bi: apiData.beneficiary_id_number || 'N/A',
        dataNascimento: formatDate(apiData.beneficiary_date_of_birth),
        genero: mapGenero(apiData.beneficiary_gender),
        naturalidade: apiData.lugar_nascimento || 'N/A',
        nacionalidade: 'Angolana',
        provincia: apiData.Provincia?.charAt(0).toUpperCase() + apiData.Provincia?.slice(1).toLowerCase() || 'N/A',
        municipio: apiData.Municipio || 'N/A',
        bairro: apiData.geo_level_4 || 'N/A',
        endereco: `${apiData.geo_level_5 || ''} - ${apiData.geo_level_6 || ''}`.trim(),
        telefone: apiData.beneficiary_phone_number || 'N/A',
        atividades: mapAtividades(apiData.atividades_produtor),
        tipoOrganizacao: mapTipoOrganizacao(apiData.tipo_organizacao),
        inquiridor: `${apiData.nome_inquiridor || ''} ${apiData.sobrenome_inquiridor || ''}`.trim(),
        dataEmissao: formatDate(dataEmissao.toISOString()),
        dataValidade: formatDate(dataValidade.toISOString()),
        fotoBiometrica: apiData.beneficiary_biometrics,
        fotoNaoBiometrica: apiData.beneficiary_photo,
        fotoDocumento: apiData.foto_documento,
        anexos: apiData._attachments || [],
        dadosOriginais: apiData
    };
};

const GerarCartaoRNPAAgricola = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const cardRef = useRef(null);

    // Estados
    const [produtor, setProdutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showFront, setShowFront] = useState(true);
    const [fotoProdutor, setFotoProdutor] = useState(fotoC);
    const [loadingFoto, setLoadingFoto] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Função para carregar a foto do beneficiário
    const carregarFotoBeneficiario = async (produtorId) => {
        if (!produtorId) return;

        setLoadingFoto(true);
        try {
            // Fazer requisição GET para buscar a foto
            const response = await api.get(`/formulario/${produtorId}/foto-beneficiary`, {
                responseType: 'blob', // Importante: definir como blob para imagens
                timeout: 10000 // Timeout de 10 segundos
            });

            // Verificar se a resposta contém dados
            if (response.data && response.data.size > 0) {
                // Criar URL do blob para usar no src da imagem
                const imageUrl = URL.createObjectURL(response.data);
                setFotoProdutor(imageUrl);
                console.log('Foto do beneficiário carregada com sucesso');
            } else {
                console.log('Resposta da API não contém dados de imagem, usando foto padrão');
                setFotoProdutor(fotoC);
            }
        } catch (error) {
            console.error('Erro ao carregar foto do beneficiário:', error);
            // Verificar o tipo de erro para dar feedback mais específico
            if (error.response) {
                // Erro de resposta do servidor
                console.log(`Erro ${error.response.status}: ${error.response.statusText}`);
                if (error.response.status === 404) {
                    console.log('Foto não encontrada para este produtor');
                }
            } else if (error.request) {
                // Erro de rede
                console.log('Erro de rede ao buscar a foto');
            }
            setFotoProdutor(fotoC); // Usar foto padrão em caso de erro
        } finally {
            setLoadingFoto(false);
        }
    };

    // Buscar dados do produtor
    useEffect(() => {
        const fetchProdutor = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response = await api.get(`/formulario/${id}`);
                const produtorMapeado = mapApiDataToCard(response.data);
                setProdutor(produtorMapeado);

                // Carregar foto do beneficiário usando o ID
                await carregarFotoBeneficiario(id);

            } catch (err) {
                console.error('Erro ao buscar produtor:', err);
                setError(err.response?.data?.message || err.message);
                showToast('error', 'Erro ao carregar dados do produtor');
            } finally {
                setLoading(false);
            }
        };

        fetchProdutor();
    }, [id]);

    // Limpar URL do blob quando o componente for desmontado
    useEffect(() => {
        return () => {
            // Revogar URL do blob se não for a foto padrão
            if (fotoProdutor && fotoProdutor !== fotoC && fotoProdutor.startsWith('blob:')) {
                URL.revokeObjectURL(fotoProdutor);
            }
        };
    }, [fotoProdutor]);

    // Função para mostrar toast
    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    // Download como imagem PNG (lado atual)
    const handleDownloadImage = async () => {
        if (!cardRef.current || !produtor) {
            showToast('error', 'Erro: Cartão não encontrado para download');
            return;
        }

        if (isDownloading) {
            return; // Evitar múltiplos downloads simultâneos
        }

        setIsDownloading(true);

        try {
            showToast('info', 'Gerando imagem do cartão...');

            // Configurações do html2canvas
            const options = {
                scale: 2, // Maior qualidade
                useCORS: true, // Permitir imagens de outros domínios
                allowTaint: false,
                backgroundColor: '#ffffff',
                width: 600, // Largura fixa do cartão
                height: 380, // Altura fixa do cartão
                scrollX: 0,
                scrollY: 0,
                windowWidth: 1200, // Largura da janela para renderização
                windowHeight: 800,
                imageTimeout: 15000, // Timeout para carregar imagens
                removeContainer: true,
                logging: false // Desabilitar logs para produção
            };

            // Capturar o elemento do cartão
            const canvas = await html2canvas(cardRef.current, options);

            // Converter para blob
            canvas.toBlob((blob) => {
                if (!blob) {
                    showToast('error', 'Erro ao gerar a imagem');
                    setIsDownloading(false);
                    return;
                }

                // Criar URL para download
                const url = URL.createObjectURL(blob);

                // Criar elemento de link para download
                const link = document.createElement('a');
                link.href = url;

                // Nome do arquivo com informações do produtor
                const nomeArquivo = `cartao_rnpa_${produtor.codigoRNPA}_${showFront ? 'frente' : 'verso'}_${new Date().toISOString().split('T')[0]}.png`;
                link.download = nomeArquivo;

                // Adicionar ao DOM, clicar e remover
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Limpar URL do blob
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 100);

                showToast('success', `Cartão baixado como: ${nomeArquivo}`);
                setIsDownloading(false);

            }, 'image/png', 1.0); // Qualidade máxima para PNG

        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            showToast('error', 'Erro ao gerar imagem do cartão');
            setIsDownloading(false);
        }
    };

    // Download ambos os lados
    const handleDownloadBothSides = async () => {
        if (!cardRef.current || !produtor) {
            showToast('error', 'Erro: Cartão não encontrado para download');
            return;
        }

        if (isDownloading) {
            return;
        }

        setIsDownloading(true);
        showToast('info', 'Gerando imagens da frente e verso...');

        try {
            const options = {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#ffffff',
                width: 600,
                height: 380,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 1200,
                windowHeight: 800,
                imageTimeout: 15000,
                removeContainer: true,
                logging: false
            };

            // Salvar o estado atual
            const currentSide = showFront;

            // Capturar frente
            if (!showFront) {
                setShowFront(true);
                await new Promise(resolve => setTimeout(resolve, 100)); // Aguardar renderização
            }

            const canvasFrente = await html2canvas(cardRef.current, options);

            // Capturar verso
            setShowFront(false);
            await new Promise(resolve => setTimeout(resolve, 100)); // Aguardar renderização

            const canvasVerso = await html2canvas(cardRef.current, options);

            // Restaurar estado original
            setShowFront(currentSide);

            // Download da frente
            canvasFrente.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `cartao_rnpa_${produtor.codigoRNPA}_frente_${new Date().toISOString().split('T')[0]}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(url), 100);
                }
            }, 'image/png', 1.0);

            // Download do verso (com pequeno delay)
            setTimeout(() => {
                canvasVerso.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `cartao_rnpa_${produtor.codigoRNPA}_verso_${new Date().toISOString().split('T')[0]}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(() => URL.revokeObjectURL(url), 100);
                    }
                }, 'image/png', 1.0);
            }, 500);

            showToast('success', 'Frente e verso baixados com sucesso!');
            setIsDownloading(false);

        } catch (error) {
            console.error('Erro ao gerar imagens:', error);
            showToast('error', 'Erro ao gerar imagens do cartão');
            setIsDownloading(false);
        }
    };

    // Gerar cartão em PDF ou imagem
    const handleGenerateCard = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            showToast('success', 'Cartão gerado com sucesso!');
        }, 2000);
    };

    // Imprimir cartão
    const handlePrintCard = () => {
        window.print();
    };

    // Alternar entre frente e verso
    const toggleCard = () => {
        setShowFront(!showFront);
    };

    // Voltar para a lista
    const handleGoBack = () => {
        navigate(-1);
    };

    // Recarregar foto
    const recarregarFoto = async () => {
        if (id) {
            // Limpar URL anterior se for um blob
            if (fotoProdutor && fotoProdutor !== fotoC && fotoProdutor.startsWith('blob:')) {
                URL.revokeObjectURL(fotoProdutor);
            }

            await carregarFotoBeneficiario(id);
            showToast('info', 'Foto recarregada');
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Carregando dados do produtor...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !produtor) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar dados</h1>
                    <p className="text-gray-600 mb-6">{error || 'Produtor não encontrado'}</p>
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Voltar
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
                        <p>{toastMessage.message}</p>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleGoBack}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Gerar Cartão RNPA</h1>
                                    <p className="text-gray-600">Produtor: {produtor.nome}</p>
                                    <p className="text-sm text-gray-500">Código: {produtor.codigoRNPA}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={recarregarFoto}
                                    disabled={loadingFoto}
                                    className="flex items-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingFoto ? 'animate-spin' : ''}`} />
                                    Recarregar Foto
                                </button>
                                <button
                                    onClick={toggleCard}
                                    className="flex items-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    {showFront ? 'Ver Verso' : 'Ver Frente'}
                                </button>
                                {/* <button
                                    onClick={handlePrintCard}
                                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Imprimir
                                </button> */}
                                <button
                                    onClick={handleDownloadImage}
                                    disabled={isDownloading}
                                    className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDownloading ? (
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4 mr-2" />
                                    )}
                                    {isDownloading ? 'Gerando PNG...' : 'Baixar parte visível'}
                                </button>
                                <button
                                    onClick={handleDownloadBothSides}
                                    disabled={isDownloading}
                                    className="flex items-center px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDownloading ? (
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4 mr-2" />
                                    )}
                                    {isDownloading ? 'Gerando...' : 'Baixar  frente/verso'}
                                </button>
                                {/* <button
                                    onClick={handleGenerateCard}
                                    disabled={isGenerating}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    {isGenerating ? 'Gerando...' : 'Gerar Cartão'}
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview do Cartão */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-center">
                        <Eye className="w-5 h-5 mr-2 text-green-600" />
                        Cartão RNPA - {showFront ? 'Frente' : 'Verso'}
                    </h2>

                    {/* Cartão RNPA */}
                    <div className="flex justify-center">
                        <div
                            ref={cardRef}
                            className="w-[600px] h-[420px] bg-white border-2 border-gray-300 rounded-lg shadow-2xl overflow-hidden relative"
                            style={{
                                background: showFront ?
                                    'linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 25%, #ffffff 50%, #f0f9ff 75%, #e8f4fd 100%)' :
                                    'linear-gradient(135deg, #fef7e8 0%, #fffbeb 25%, #ffffff 50%, #fffbeb 75%, #fef7e8 100%)'
                            }}
                        >
                            {/* Padrão de segurança de fundo */}
                            <div className="absolute inset-0 opacity-10">
                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="security-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#0066cc" strokeWidth="0.5" />
                                            <circle cx="20" cy="20" r="3" fill="none" stroke="#0066cc" strokeWidth="0.3" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#security-pattern)" />
                                </svg>
                            </div>

                            <div className="absolute inset-0 bottom-12 flex items-center justify-center pointer-events-none">
                                <img
                                    src={logoRNPA}
                                    alt="Marca d'água"
                                    className="w-48 h-48 opacity-25"
                                    style={{

                                        zIndex: 1
                                    }}
                                />
                            </div>

                            {showFront ? (
                                // FRENTE DO CARTÃO
                                <div className="relative z-20  p-6 pt-4 h-full">
                                    {/* Header */}

                                    <div className="flex flex-col mb-6 items-center text-center">
                                        <div className="w-10 h-10 mb-2">
                                            <img src={image} alt="Emblema" className="w-full h-full object-contain" />
                                        </div>
                                        <h1 className="text-lg text-[13px] font-bold text-green-800 leading-tight">REPÚBLICA DE ANGOLA</h1>
                                        <p className="text-[13px] font-bold text-green-800 leading-tight">MINISTÉRIO DA AGRICULTURA E FLORESTAS</p>
                                        <p className="text-sm font-bold text-gray-600">Registo Nacional de Produtores Agrícolas</p>
                                    </div>

                                    {/* Conteúdo principal */}
                                    <div className="flex gap-6">
                                        {/* Foto */}
                                        <div className="w-28 h-36 relative">
                                            {loadingFoto && (
                                                <div className="absolute inset-0 bg-gray-200 rounded-md flex items-center justify-center">
                                                    <Loader className="w-6 h-6 animate-spin text-gray-500" />
                                                </div>
                                            )}
                                            <img
                                                src={fotoProdutor}
                                                alt="Foto do Produtor"
                                                className="w-full h-full rounded-md object-cover border-2 border-gray-400"
                                                onError={(e) => {
                                                    console.log('Erro ao carregar imagem, usando foto padrão',e);
                                                    // Limpar blob URL se necessário
                                                    if (fotoProdutor && fotoProdutor !== fotoC && fotoProdutor.startsWith('blob:')) {
                                                        URL.revokeObjectURL(fotoProdutor);
                                                    }
                                                    setFotoProdutor(fotoC);
                                                }}
                                                onLoad={() => {
                                                    console.log('Foto carregada com sucesso');
                                                }}
                                                crossOrigin="anonymous"
                                            />

                                            <div className="mt-2">
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">produtor Nº</label>
                                                <p className="text-sm font-bold text-gray-900">{produtor.codigoRNPA}</p>
                                            </div>
                                        </div>

                                        {/* Informações */}
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nome</label>
                                                <p className="text-base font-bold text-gray-900">{produtor.nome}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sexo</label>
                                                    <p className="text-sm font-bold text-gray-900">{produtor.genero}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Naturalidade</label>
                                                    <p className="text-sm font-bold text-gray-900">{produtor.naturalidade}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data de Nascimento</label>
                                                    <p className="text-sm font-bold text-gray-900">{produtor.dataNascimento}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nacionalidade</label>
                                                    <p className="text-sm font-bold text-gray-900">{produtor.nacionalidade}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data de Emissão</label>
                                                    <p className="text-sm font-bold text-gray-900">{produtor.dataEmissao}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data de Validade</label>
                                                    <p className="text-sm font-bold text-gray-900">{produtor.dataValidade}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // VERSO DO CARTÃO
                                <div className="relative z-20 px-6 py-2 h-full">
                                    {/* Header verso */}
                                   

                                    {/* Informações detalhadas */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Bilhete de Identidade</label>
                                                <p className="text-sm font-bold text-gray-900">{produtor.bi}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Província</label>
                                                <p className="text-sm font-bold text-gray-900">{produtor.provincia}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Município</label>
                                                <p className="text-sm font-bold text-gray-900">{produtor.municipio}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Comuna/Bairro</label>
                                                <p className="text-sm font-bold text-gray-900">{produtor.bairro}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Endereço</label>
                                                <p className="text-sm font-bold text-gray-900">{produtor.endereco}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Organização</label>
                                                <p className="text-sm font-bold text-gray-900">{produtor.tipoOrganizacao}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Actividades</label>
                                                <p className="text-sm font-bold text-gray-900">{produtor.atividades?.join(', ')}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Agente Registador</label>
                                                <p className="text-sm font-bold text-gray-900">{produtor.inquiridor}</p>
                                            </div>

                                            {/* QR Code */}
                                            <div className="absolute top-0 right-[20px] flex flex-col items-center mt-6">
                                                <div className="w-20 h-20 bg-white border-2 border-gray-400 p-1 mb-2">
                                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                                        <rect width="100" height="100" fill="white" />
                                                        <rect x="0" y="0" width="30" height="30" fill="black" />
                                                        <rect x="70" y="0" width="30" height="30" fill="black" />
                                                        <rect x="0" y="70" width="30" height="30" fill="black" />
                                                        <rect x="5" y="5" width="20" height="20" fill="white" />
                                                        <rect x="75" y="5" width="20" height="20" fill="white" />
                                                        <rect x="5" y="75" width="20" height="20" fill="white" />
                                                        <rect x="10" y="10" width="10" height="10" fill="black" />
                                                        <rect x="80" y="10" width="10" height="10" fill="black" />
                                                        <rect x="10" y="80" width="10" height="10" fill="black" />
                                                        <rect x="45" y="45" width="10" height="10" fill="black" />
                                                        <rect x="35" y="15" width="5" height="5" fill="black" />
                                                        <rect x="45" y="25" width="5" height="5" fill="black" />
                                                        <rect x="55" y="35" width="5" height="5" fill="black" />
                                                        <rect x="25" y="45" width="5" height="5" fill="black" />
                                                        <rect x="65" y="55" width="5" height="5" fill="black" />
                                                        <rect x="35" y="65" width="5" height="5" fill="black" />
                                                        <rect x="55" y="75" width="5" height="5" fill="black" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                     <div className="flex items-start mt-7 justify-between">
                                        <div className="flex">
                                            <div className="w-14 h-14 mr-3">
                                                <img src={IDA} alt="IDA" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="w-14 h-14 mr-3">
                                                <img src={ISV} alt="ISV" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="w-14 h-14 mr-3">
                                                <img src={MinAdriPesca} alt="ministrtio da agriciltura e pesca" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="w-14 h-14 mr-3">
                                                <img src={logo5} alt="ministrtio da agriciltura e florestas" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="w-14 h-14 mr-3">
                                                <img src={sense} alt="ministrtio da agriciltura e florestas" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="w-14 h-14 mr-3">
                                                <img src={iiv} alt="ministrtio da agriciltura e florestas" className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                       
                                    </div>

                                    {/* Footer */}
                                    <div className="absolute bottom-4 left-6 right-6">
                                        <div className="border-t border-gray-300 pt-2">
                                            <div className="flex justify-between items-center">
                                                <div className="text-xs text-gray-600">
                                                    <p>Este cartão é propriedade da República de Angola</p>
                                                    <p>Em caso de perda ou roubo, contacte: www.minagrif.gov.ao</p>
                                                </div>
                                                <div className="text-right text-xs text-gray-600">
                                                    <p>Válido em todo território nacional</p>
                                                    <p className="font-semibold">RNPA - {new Date().getFullYear()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informações de Download */}
                    {/*<div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-800 mb-2">Opções de Download</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Download PNG:</span>
                                        <p className="text-gray-900">Baixa o lado atual (frente ou verso)</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Baixar Ambos:</span>
                                        <p className="text-gray-900">Baixa frente e verso automaticamente</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Qualidade:</span>
                                        <p className="text-gray-900">Alta resolução (2x scale)</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleCard}
                                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Ver {showFront ? 'Verso' : 'Frente'}
                            </button>
                        </div>
                    </div> */}

                    {/* Resumo dos Dados do Produtor */}
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Resumo dos Dados do Produtor
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Nome Completo:</span>
                                <p className="text-gray-900">{produtor.nome}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Código RNPA:</span>
                                <p className="text-gray-900">{produtor.codigoRNPA}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Localização:</span>
                                <p className="text-gray-900">{produtor.municipio}, {produtor.provincia}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Atividades:</span>
                                <p className="text-gray-900">{produtor.atividades?.join(', ') || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status da Foto e Download */}
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm mb-3">
                            <div className="flex items-center">
                                <span className="font-medium text-gray-700">Estado da Foto:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${loadingFoto ? 'bg-blue-100 text-blue-800' :
                                    fotoProdutor === fotoC ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                    {loadingFoto ? 'Carregando...' :
                                        fotoProdutor === fotoC ? 'Foto padrão' :
                                            fotoProdutor.startsWith('blob:') ? 'Foto da API (carregada)' : 'Foto da API'}
                                </span>
                            </div>
                            <div className="text-gray-600">
                                ID do Produtor: {id}
                            </div>
                        </div>
                        {fotoProdutor !== fotoC && (
                            <div className="mb-3 text-xs text-gray-500">
                                <span className="font-medium">Endpoint:</span> /formulario/{id}/foto-beneficiary
                            </div>
                        )}
                        <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-300">
                            <div className="flex items-center">
                                <span className="font-medium text-gray-700">Estado Download:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${isDownloading ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {isDownloading ? 'Processando...' : 'Pronto'}
                                </span>
                            </div>
                            <div className="text-gray-600">
                                Formato: PNG (Alta Qualidade)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GerarCartaoRNPAAgricola;