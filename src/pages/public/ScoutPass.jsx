import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdministracoes, useGroupings, useScout } from '../../hooks/useScoutData';
import { Download, Printer, QrCode, MapPin, UserCircle, Mail, ArrowLeft, Users, Building, Calendar } from 'lucide-react';
import logo from "../../assets/LogoAngola.png";
import api from '../../services/api';

const ScoutCard = () => {
  const BASE_URL = 'https://d3gwhrg5-7133.uks1.devtunnels.ms/api';
  const navigate = useNavigate();
  const { id } = useParams();
  const { scout, loading } = useScout();
  const { groupings, loading: loadingGroupings } = useGroupings();
  const { administracoes, loading: loadingAdministracoes } = useAdministracoes();
  const [imageError, setImageError] = useState(false);
  const [showFront, setShowFront] = useState(true);

  const scoutData = scout?.find(s => s.id.toString() === id);

  // Encontrar o agrupamento do escuteiro
  const agrupamento = useMemo(() => {
    if (!scoutData?.agrupamentoId || !groupings?.length) return null;
    return groupings.find(g => g.id === scoutData.agrupamentoId);
  }, [scoutData, groupings]);

  // Encontrar a administração regional (região)
  const administracaoRegional = useMemo(() => {
    if (!agrupamento?.adminRegionalId || !administracoes?.length) return null;
    return administracoes.find(a => a.id === agrupamento.adminRegionalId);
  }, [agrupamento, administracoes]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Aqui você poderia implementar a lógica para download do cartão como PDF
    alert('Funcionalidade de download em implementação');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading || loadingGroupings || loadingAdministracoes) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="h-full ">
      {/* Header e Ações */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Cartão de Identificação</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Visualização do ID Card • {scoutData?.nome || 'Escuteiro'}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowFront(!showFront)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <QrCode className="w-4 h-4" />
              {showFront ? 'Ver Verso' : 'Ver Frente'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl shadow-sm hover:bg-purple-700 transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Container dos Cartões */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          {showFront ? (
            // Frente do Cartão
            <div className="w-[450px] h-[280px]">
              <div className="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden relative">
                {/* Elementos decorativos de fundo */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                  <svg width="100%" height="100%" className="opacity-10">
                    <circle cx="400" cy="-50" r="200" fill="url(#purpleGradient)" />
                    <circle cx="50" cy="300" r="150" fill="url(#purpleGradient)" />
                    <defs>
                      <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#7c3aed' }} />
                        <stop offset="100%" style={{ stopColor: '#a855f7' }} />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Padrão de segurança */}
                  <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10">
                    <div className="absolute -right-12 -top-12 w-64 h-64 border border-purple-500 rounded-full"></div>
                    <div className="absolute -right-6 -top-6 w-48 h-48 border border-purple-500 rounded-full"></div>
                    <div className="absolute -right-0 -top-0 w-32 h-32 border border-purple-500 rounded-full"></div>
                  </div>
                </div>

                <div className="relative p-6">
                  {/* Header com Logos */}
                  <div className="flex justify-between items-start mb-4">
                    {/* Logo Principal */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <img src={logo} alt="Logo Angola" className="w-full h-full object-contain" />
                    </div>
                    {/* Logo Scouts */}
                  
                  </div>

                  {/* Informações Principais */}
                  <div className="flex gap-6">
                    {/* Foto */}
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-200 to-indigo-200 opacity-50 blur"></div>
                      <div className="relative w-28 h-36 rounded-xl overflow-hidden border-2 border-white shadow-md">
                        <img
                          src={!imageError ? `${BASE_URL}/escuteiro/${scoutData?.id}/imagem` : '/placeholder-avatar.png'}
                          alt={scoutData?.nome}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      </div>
                    </div>

                    {/* Dados */}
                    <div className="flex-1">
                      <h2 className="text-gray-800 font-bold text-xl mb-3 truncate">{scoutData?.nome}</h2>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserCircle className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-gray-600 text-sm">{scoutData?.categoria}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-gray-600 text-sm truncate">
                            {agrupamento ? `${agrupamento.nome} Nº ${agrupamento.numero}` : scoutData?.provincia}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Building className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-gray-600 text-sm">
                            {administracaoRegional?.nome || scoutData?.regiao}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-gray-600 text-sm">{scoutData?.codigo || 'ID: 000000'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-500 text-sm">
                        Válido até: 12/{new Date().getFullYear() + 1}
                      </div>
                      <div className="text-gray-500 text-sm">
                        www.scouts.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Verso do Cartão
            <div className="w-[450px] h-[280px]">
              <div className="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden relative">
                {/* Elementos decorativos */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5"></div>
                  
                  {/* Padrão de linhas */}
                  <svg width="100%" height="100%" className="opacity-10">
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#7c3aed" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="relative h-full flex flex-col items-center justify-between p-6">
                  {/* Logo Superior */}
                 

                  {/* Informações Adicionais */}
                  <div className="w-full px-4 py-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-purple-800">ASSOCIAÇÃO DE ESCUTEIROS DE ANGOLA</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-3 h-3 text-purple-600" />
                      <span className="text-xs text-gray-600">
                        {agrupamento?.nome || "Paróquia"} • {"Nº" + agrupamento?.numero || "Agrupamento"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-purple-600" />
                      <span className="text-xs text-gray-600">
                        {administracaoRegional?.nome || scoutData?.regiao || "Região"} • {administracaoRegional?.provincia || "Província"}
                      </span>
                    </div>
                    
                  </div>

                  {/* Lema */}
                  <div className="text-center my-2">
                    <h4 className="text-gray-800 font-bold text-xl tracking-wider">SEMPRE ALERTA</h4>
                    <div className="w-16 h-0.5 bg-purple-200 mx-auto my-2" />
                    <h4 className="text-gray-700 font-medium">PARA SERVIR</h4>
                  </div>

                  {/* QR Code */}
                  <div className="relative mb-2">
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-200 to-indigo-200 opacity-50 blur"></div>
                    <div className="relative bg-white p-2 rounded-lg shadow-md">
                      <QrCode className="w-8 h-8 text-gray-800" />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800">SCOUTS</div>
                    <div className="text-gray-600 text-xs font-medium">Creating a Better World</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Instruções */}
          <div className="mt-8 text-center text-gray-500 text-sm max-w-lg">
            <p>Clique em "{showFront ? 'Ver Verso' : 'Ver Frente'}" para visualizar o outro lado do cartão. Este cartão é apenas para visualização digital. Para obter a versão física, entre em contato com a administração.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutCard;