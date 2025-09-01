import React, { useState } from 'react';
import { Shield, Search, Plus, Eye, Edit, MapPin, Filter } from 'lucide-react';

const GestaoFiscalizacao = () => {
  const [fiscalizacoes] = useState([
    {
      id: 1,
      codigo: 'FISC-2024-001',
      licenca: 'LIC-2024-001',
      produtor: 'João Silva Santos',
      dataInspecao: '2024-01-20',
      resultado: 'Conforme',
      fiscal: 'Carlos Mendes',
      status: 'Concluída'
    },
    {
      id: 2,
      codigo: 'FISC-2024-002',
      licenca: 'LIC-2024-002',
      produtor: 'Maria Costa',
      dataInspecao: '2024-02-15',
      resultado: 'Irregularidade',
      fiscal: 'Ana Santos',
      status: 'Em Análise'
    }
  ]);

  const getResultadoColor = (resultado) => {
    switch (resultado) {
      case 'Conforme': return 'bg-green-100 text-green-800';
      case 'Irregularidade': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluída': return 'bg-blue-100 text-blue-800';
      case 'Em Análise': return 'bg-yellow-100 text-yellow-800';
      case 'Pendente': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Fiscalizações</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Fiscalização
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar fiscalizações..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <button className="px-4 py-2 border rounded-lg flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Licença</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produtor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Inspeção</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiscal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fiscalizacoes.map((fiscalizacao) => (
                <tr key={fiscalizacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fiscalizacao.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fiscalizacao.licenca}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fiscalizacao.produtor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fiscalizacao.dataInspecao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fiscalizacao.fiscal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getResultadoColor(fiscalizacao.resultado)}`}>
                      {fiscalizacao.resultado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(fiscalizacao.status)}`}>
                      {fiscalizacao.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestaoFiscalizacao;