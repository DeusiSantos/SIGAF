import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useEtapas, useGroupings, useProgressao, useScout } from '../../hooks/useScoutData';
import { Tag } from 'primereact/tag';

const ScoutDetailsView = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [imageError, setImageError] = useState(false);
    const { id } = useParams();

    // Data hooks
    const { scout, loading: loadingScout } = useScout();
    const { etapas, loading: loadingEtapas } = useEtapas();
    const { progressao, loading: loadingProgressao } = useProgressao();
    const { groupings: agrupamentos, loading: loadingAgrupamentos } = useGroupings();

    // Current etapa calculation
    const [currentEtapa, setCurrentEtapa] = useState(0);

    // API base URL
    const API_URL = 'https://d3gwhrg5-7133.uks1.devtunnels.ms/api';

    // Find the scout from the scout data
    const scoutDetails = useMemo(() => {
        return scout?.find(s => s.id.toString() === id);
    }, [scout, id]);

    // Find agrupamento based on scout's agrupamentoId
    const agrupamentoDetails = useMemo(() => {
        if (!scoutDetails?.agrupamentoId || !agrupamentos?.length) return null;
        return agrupamentos.find(a => a.id === scoutDetails.agrupamentoId);
    }, [scoutDetails, agrupamentos]);

    // Parse JSON fields helper
    const parseJsonField = (jsonString, defaultValue = []) => {
        try {
            // If input is already an array, return it
            if (Array.isArray(jsonString)) {
                return jsonString.map(item => {
                    try {
                        return typeof item === 'string' ? JSON.parse(item) : item;
                    } catch {
                        return item;
                    }
                }).flat();
            }

            // If it's a string, try to parse it
            const parsed = JSON.parse(jsonString);
            return typeof parsed === 'string' ? JSON.parse(parsed) : parsed || defaultValue;
        } catch {
            return defaultValue;
        }
    };

    // Determine etapa when progressao and etapas load
    useEffect(() => {
        if (progressao?.length > 0 && etapas?.length > 0) {
            // Find the scout's progression
            const escuteiroProgressao = progressao.find(p => p.escuteiro_id === parseInt(id));

            if (escuteiroProgressao) {
                // Find the corresponding etapa
                const etapaAtual = etapas.find(e => e.id === escuteiroProgressao.etapa_id);
                if (etapaAtual) {
                    setCurrentEtapa(etapaAtual.etapa);
                }
            }
        }
    }, [id, progressao, etapas]);

    // Handle image loading
    const getImageUrl = (escuteiroId) => {
        if (!escuteiroId || imageError) return '/assets/placeholder-profile.png';
        return `${API_URL}/escuteiro/${escuteiroId}/imagem`;
    };

    // Check if data is still loading
    const isLoading = loadingScout || loadingAgrupamentos || loadingEtapas || loadingProgressao || !scoutDetails;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
        );
    }

    // Parse scout data
    const educationalQualifications = parseJsonField(scoutDetails.nivelAcademico);
    const courses = parseJsonField(scoutDetails.cursos);
    const sacraments = parseJsonField(scoutDetails.sacramentos);

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Get category color
    const getCategoryColor = (categoria) => {
        switch (categoria) {
            case 'LOBITO': return 'bg-yellow-500';
            case 'JUNIORS': return 'bg-green-500';
            case 'SENIORS': return 'bg-blue-500';
            case 'CAMINHEIROS': return 'bg-red-700';
            case 'DIRIGENTES': return 'bg-green-800';
            default: return 'bg-gray-300';
        }
    };

    // Navigation Items
    const navItems = [
        { id: 'profile', icon: 'pi pi-user', label: 'Perfil' },
        { id: 'address', icon: 'pi pi-home', label: 'Morada' },
        { id: 'education', icon: 'pi pi-book', label: 'Educação' },
        { id: 'family', icon: 'pi pi-users', label: 'Filiação' },
        { id: 'religion', icon: 'pi pi-heart', label: 'Religião' },
        { id: 'health', icon: 'pi pi-heart-fill', label: 'Saúde' },
        { id: 'emergency', icon: 'pi pi-exclamation-triangle', label: 'Emergência' },
        { id: 'documents', icon: 'pi pi-file', label: 'Anexos' },
        { id: 'group', icon: 'pi pi-sitemap', label: 'Agrupamento' }
    ];

    // UI Components
    const NavItem = ({ icon, label, active, onClick }) => (
        <div
            onClick={onClick}
            className={`
                flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all
                ${active
                    ? 'bg-purple-50 text-purple-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }
            `}
        >
            <i className={`${icon} text-lg mr-3`}></i>
            <span>{label}</span>
        </div>
    );

    const InfoCard = ({ title, children }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            {children}
        </div>
    );

    const InfoRow = ({ label, value, icon }) => (
        <div className="flex items-center mb-4 last:mb-0">
            {icon && <i className={`${icon} text-purple-500 mr-3 text-lg`}></i>}
            <div>
                <div className="text-sm text-gray-500 mb-1">{label}</div>
                <div className="text-gray-800 font-medium">{value || 'N/A'}</div>
            </div>
        </div>
    );

    // Main layout
    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 h-24"></div>
                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <img
                            src={getImageUrl(scoutDetails.id)}
                            alt={scoutDetails.nome}
                            className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-lg -mt-14"
                            onError={() => setImageError(true)}
                        />
                        <div className="flex-1 mt-4 md:mt-0">
                            <h1 className="text-2xl font-bold text-gray-900">{scoutDetails.nome}</h1>
                            <p className="text-gray-500 mt-1">Código: {scoutDetails.codigo}</p>
                            <div className="mt-4">
                                <div className="inline-flex flex-wrap items-center p-1 rounded-xl">
                                    {/* Category chip */}
                                    <div className={`m-1 px-4 py-1.5 rounded-lg ${getCategoryColor(scoutDetails.categoria)} text-white font-medium flex items-center`}>
                                        <i className="pi pi-tag mr-2 text-white"></i>
                                        {scoutDetails.categoria}
                                    </div>

                                    {/* Province chip */}
                                    <div className="m-1 px-4 py-1.5 rounded-lg bg-blue-600 text-white font-medium flex items-center">
                                        <i className="pi pi-map-marker mr-2"></i>
                                        {scoutDetails.provincia}
                                    </div>

                                    {/* Gender chip */}
                                    <div className="m-1 px-4 py-1.5 rounded-lg bg-purple-600 text-white font-medium flex items-center">
                                        <i className="pi pi-user mr-2"></i>
                                        {scoutDetails.genero}
                                    </div>

                                    {/* Status chip */}
                                    <div className={`m-1 px-4 py-1.5 rounded-lg ${scoutDetails.estado === 'Ativo'
                                        ? 'bg-green-600'
                                        : 'bg-blue-600'
                                        } text-white font-medium flex items-center`}>
                                        <i className={`${scoutDetails.estado === 'Ativo'
                                            ? 'pi pi-check-circle'
                                            : 'pi pi-times-circle'
                                            } mr-2`}></i>
                                        {scoutDetails.estado}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {currentEtapa > 0 && (
                            <div className="flex-shrink-0 bg-white p-3 rounded-lg shadow-sm">
                                <img
                                    src={`${API_URL}/images/Etapas/Etapa${currentEtapa}.png`}
                                    alt={`Etapa ${currentEtapa}`}
                                    className="w-32 h-24 object-contain"
                                />
                                <p className="text-center text-sm font-medium text-gray-600 mt-1">Etapa {currentEtapa}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-6">
                            {navItems.map(item => (
                                <NavItem
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    active={activeSection === item.id}
                                    onClick={() => setActiveSection(item.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Profile Section */}
                            {activeSection === 'profile' && (
                                <>
                                    <InfoCard title="Informações Pessoais">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InfoRow label="Código" value={scoutDetails.codigo} icon="pi pi-key" />
                                            <InfoRow label="Nome Completo" value={scoutDetails.nome} icon="pi pi-user" />
                                            <InfoRow label="BI" value={scoutDetails.bi} icon="pi pi-id-card" />
                                            <InfoRow
                                                label="Data de Nascimento"
                                                value={formatDate(scoutDetails.dataDeNascimento)}
                                                icon="pi pi-calendar"
                                            />
                                            <InfoRow
                                                label="Local de Nascimento"
                                                value={scoutDetails.paisDeNascimento}
                                                icon="pi pi-map-marker"
                                            />
                                            <InfoRow label="Província de Nascimento" value={scoutDetails.provincia} icon="pi pi-compass" />
                                            <InfoRow label="Estado Civil" value={scoutDetails.estadoCivil} icon="pi pi-heart" />
                                            <InfoRow label="Profissão" value={scoutDetails.profissao} icon="pi pi-briefcase" />
                                        </div>
                                    </InfoCard>

                                    <InfoCard title="Contatos">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InfoRow label="Telefone" value={scoutDetails.telefone} icon="pi pi-phone" />
                                            <InfoRow label="Telefone Opcional" value={scoutDetails.telefoneOpcional} icon="pi pi-phone" />
                                        </div>
                                    </InfoCard>
                                </>
                            )}

                            {/* Address Section */}
                            {activeSection === 'address' && (
                                <InfoCard title="Endereço">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <InfoRow label="Cidade" value={scoutDetails.provinciaDeResidencia} icon="pi pi-globe" />
                                        <InfoRow label="Município" value={scoutDetails.municipio} icon="pi pi-map" />
                                        <InfoRow label="Rua" value={scoutDetails.rua} icon="pi pi-map-marker" />
                                        <InfoRow label="Paróquia" value={agrupamentoDetails.paroquia} icon="pi pi-home" />
                                    </div>
                                </InfoCard>
                            )}

                            {/* Education Section */}
                            {activeSection === 'education' && (
                                <>
                                    <InfoCard title="Formação Educacional">
                                        <div className="space-y-4">
                                            {educationalQualifications.length > 0 ? (
                                                educationalQualifications.map((edu, index) => (
                                                    <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg">
                                                        <i className="pi pi-bookmark text-purple-500 mr-3"></i>
                                                        <span className="text-gray-800">{edu}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">Nenhuma formação educacional registrada</p>
                                            )}
                                        </div>
                                    </InfoCard>

                                    <InfoCard title="Cursos">
                                        <div className="space-y-4">
                                            {courses.length > 0 ? (
                                                courses.map((course, index) => (
                                                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                                                        <i className="pi pi-book text-blue-500 mr-3"></i>
                                                        <span className="text-gray-800">{course}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">Nenhum curso registrado</p>
                                            )}
                                        </div>
                                    </InfoCard>
                                </>
                            )}

                            {/* Family Section */}
                            {activeSection === 'family' && (
                                <InfoCard title="Informações dos Pais">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-blue-700 mb-4 flex items-center">
                                                <i className="pi pi-user mr-2"></i>
                                                Pai
                                            </h4>
                                            <div className="space-y-4">
                                                <InfoRow label="Nome" value={scoutDetails.nomeDoPai} />
                                                <InfoRow label="Contato" value={scoutDetails.contactoDoPai} icon="pi pi-phone" />
                                            </div>
                                        </div>
                                        <div className="bg-pink-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-pink-700 mb-4 flex items-center">
                                                <i className="pi pi-user mr-2"></i>
                                                Mãe
                                            </h4>
                                            <div className="space-y-4">
                                                <InfoRow label="Nome" value={scoutDetails.nomeDaMae} />
                                                <InfoRow label="Contato" value={scoutDetails.contactoDaMae} icon="pi pi-phone" />
                                            </div>
                                        </div>
                                    </div>
                                </InfoCard>
                            )}

                            {/* Religion Section */}
                            {activeSection === 'religion' && (
                                <>
                                    <InfoCard title="Religião">
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <InfoRow label="Religião" value={scoutDetails.religiao} icon="pi pi-heart-fill" />
                                        </div>
                                    </InfoCard>

                                    <InfoCard title="Sacramentos">
                                        <div className="flex flex-wrap gap-2">
                                            {sacraments.length > 0 ? (
                                                sacraments.map((sacrament, index) => (
                                                    <Tag
                                                        key={index}
                                                        value={sacrament}
                                                        className="bg-purple-100 text-purple-800 p-2"
                                                        icon="pi pi-check"
                                                    />
                                                ))
                                            ) : (
                                                <p className="text-gray-500">Nenhum sacramento registrado</p>
                                            )}
                                        </div>
                                    </InfoCard>
                                </>
                            )}

                            {/* Health Section */}
                            {activeSection === 'health' && (
                                <InfoCard title="Informações de Saúde">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className={`p-4 rounded-lg ${scoutDetails.remedio === "1" ? 'bg-yellow-50' : 'bg-green-50'}`}>
                                            <InfoRow
                                                label="Toma Medicamentos"
                                                value={scoutDetails.remedio === "1" ? 'Sim' : 'Não'}
                                                icon={`pi ${scoutDetails.remedio === "1" ? 'pi-exclamation-circle text-yellow-500' : 'pi-check-circle text-green-500'}`}
                                            />
                                        </div>
                                        <div className={`p-4 rounded-lg ${scoutDetails.alergia === "1" ? 'bg-yellow-50' : 'bg-green-50'}`}>
                                            <InfoRow
                                                label="Possui Alergias"
                                                value={scoutDetails.alergia === "1" ? 'Sim' : 'Não'}
                                                icon={`pi ${scoutDetails.alergia === "1" ? 'pi-exclamation-circle text-yellow-500' : 'pi-check-circle text-green-500'}`}
                                            />
                                        </div>
                                        <div className={`p-4 rounded-lg ${scoutDetails.restricaoMedica === "1" ? 'bg-yellow-50' : 'bg-green-50'}`}>
                                            <InfoRow
                                                label="Restrição Medicamentosa"
                                                value={scoutDetails.restricaoMedica === "1" ? 'Sim' : 'Não'}
                                                icon={`pi ${scoutDetails.restricaoMedica === "1" ? 'pi-ban text-yellow-500' : 'pi-check-circle text-green-500'}`}
                                            />
                                        </div>
                                        <div className="p-4 rounded-lg bg-blue-50">
                                            <InfoRow
                                                label="Plano de Saúde"
                                                value={scoutDetails.planoDeSaude}
                                                icon="pi pi-heart text-blue-500"
                                            />
                                        </div>
                                        <div className="p-4 rounded-lg bg-blue-50 md:col-span-2">
                                            <InfoRow
                                                label="Tipo Sanguíneo"
                                                value={scoutDetails.grupoSanguineo}
                                                icon="pi pi-tint text-blue-500"
                                            />
                                        </div>
                                    </div>
                                </InfoCard>
                            )}

                            {/* Emergency Section */}
                            {activeSection === 'emergency' && (
                                <InfoCard title="Contato de Emergência">
                                    <div className="bg-blue-50 p-6 rounded-lg border border-red-100">
                                        <div className="flex items-center mb-4">
                                            <i className="pi pi-exclamation-triangle text-blue-500 text-xl mr-3"></i>
                                            <h4 className="text-lg font-medium text-red-700">Informações para Emergência</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <InfoRow
                                                label="Nome"
                                                value={scoutDetails.nomeDeEmergencia}
                                                icon="pi pi-user"
                                            />
                                            <InfoRow
                                                label="Parentesco"
                                                value={scoutDetails.parentesco}
                                                icon="pi pi-users"
                                            />
                                            <InfoRow
                                                label="Contato"
                                                value={scoutDetails.contactoDeEmergencia}
                                                icon="pi pi-phone"
                                            />
                                        </div>
                                    </div>
                                </InfoCard>
                            )}

                            {/* Documents Section */}
                            {activeSection === 'documents' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {scoutDetails.biFilePath && (
                                        <InfoCard title="Bilhete de Identidade" icon="pi pi-id-card">
                                            <div className="relative h-[600px] rounded-lg overflow-hidden border border-gray-200">
                                                {/* PDF Viewer */}
                                                <object
                                                    data={`${API_URL}/escuteiro/${scoutDetails.id}/bi`}
                                                    type="application/pdf"
                                                    width="100%"
                                                    height="100%"
                                                    className="bg-white"
                                                >
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                                                        <i className="pi pi-file-pdf text-blue-500 text-4xl mb-4"></i>
                                                        <p className="text-gray-700 mb-4">Não foi possível exibir o PDF diretamente.</p>
                                                        <a
                                                            href={`${API_URL}/escuteiro/${scoutDetails.id}/bi`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors flex items-center"
                                                        >
                                                            <i className="pi pi-external-link mr-2"></i>
                                                            Abrir em nova aba
                                                        </a>
                                                    </div>
                                                </object>
                                            </div>
                                        </InfoCard>
                                    )}

                                    {scoutDetails.outrosFilePath && (
                                        <InfoCard title="Outros Documentos" icon="pi pi-file">
                                            <div className="relative h-[600px] rounded-lg overflow-hidden border border-gray-200">
                                                <object
                                                    data={`${API_URL}/escuteiro/${scoutDetails.id}/documento/outros`}
                                                    type="application/pdf"
                                                    width="100%"
                                                    height="100%"
                                                    className="bg-white"
                                                >
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                                                        <i className="pi pi-file-pdf text-blue-500 text-4xl mb-4"></i>
                                                        <p className="text-gray-700 mb-4">Não foi possível exibir o PDF diretamente.</p>
                                                        <a
                                                            href={`${API_URL}/escuteiro/${scoutDetails.id}/documento/outros`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors flex items-center"
                                                        >
                                                            <i className="pi pi-external-link mr-2"></i>
                                                            Abrir em nova aba
                                                        </a>
                                                    </div>
                                                </object>
                                            </div>
                                        </InfoCard>
                                    )}
                                </div>
                            )}

                            {/* Agrupamento Section */}
                            {activeSection === 'group' && (
                                <>
                                    <InfoCard title="Informações do Agrupamento">
                                        {agrupamentoDetails ? (
                                            <div className="space-y-6">
                                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center mb-4">
                                                    <i className="pi pi-building text-indigo-600 text-3xl mr-4"></i>
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-indigo-800">{agrupamentoDetails.nome}</h4>
                                                        <p className="text-indigo-600">Número: {agrupamentoDetails.numero} - Código: {agrupamentoDetails.codigo}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <InfoRow
                                                        label="Paróquia"
                                                        value={agrupamentoDetails.paroquia}
                                                        icon="pi pi-home"
                                                    />
                                                    <InfoRow
                                                        label="Credo"
                                                        value={agrupamentoDetails.credo}
                                                        icon="pi pi-heart"
                                                    />
                                                    <InfoRow
                                                        label="Cidade"
                                                        value={agrupamentoDetails.cidade}
                                                        icon="pi pi-globe"
                                                    />
                                                    <InfoRow
                                                        label="Município"
                                                        value={agrupamentoDetails.municipio}
                                                        icon="pi pi-map"
                                                    />
                                                    <InfoRow
                                                        label="Rua"
                                                        value={agrupamentoDetails.rua}
                                                        icon="pi pi-map-marker"
                                                    />
                                                    <InfoRow
                                                        label="Telefone"
                                                        value={agrupamentoDetails.telefone}
                                                        icon="pi pi-phone"
                                                    />
                                                    <InfoRow
                                                        label="Email"
                                                        value={agrupamentoDetails.email}
                                                        icon="pi pi-envelope"
                                                    />
                                                    <InfoRow
                                                        label="Data de Fundação"
                                                        value={formatDate(agrupamentoDetails.dataDeFundacao)}
                                                        icon="pi pi-calendar"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                                <div className="flex items-center text-yellow-700">
                                                    <i className="pi pi-exclamation-circle mr-3 text-xl"></i>
                                                    <p>Informações do agrupamento não disponíveis</p>
                                                </div>
                                            </div>
                                        )}
                                    </InfoCard>

                                    <InfoCard title="Progresso e Especialidades">
                                        <div className="space-y-6">
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-green-700 flex items-center">
                                                        <i className="pi pi-chart-line mr-2"></i>
                                                        Progresso de Etapas
                                                    </h4>
                                                    <div className="w-10 h-10 flex justify-center items-center rounded-full text-center bg-green-500 text-white font-bold">
                                                        {currentEtapa}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                                <h4 className="text-sm font-medium text-purple-700 mb-3 flex items-center">
                                                    <i className="pi pi-star mr-2"></i>
                                                    Especialidades
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {scoutDetails.especialidades?.length > 0 ? (
                                                        scoutDetails.especialidades.map((especialidade, index) => (
                                                            <Tag
                                                                key={index}
                                                                value={especialidade}
                                                                className="bg-purple-100 text-purple-800"
                                                                icon="pi pi-star"
                                                            />
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500">Nenhuma especialidade registrada</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </InfoCard>
                                </>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScoutDetailsView;
