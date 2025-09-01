import React, { useState } from 'react';
import { Shield, Save, X, Camera, MapPin } from 'lucide-react';

const CadastroFiscalizacao = () => {
  const [formData, setFormData] = useState({
    licenca: '',
    dataInspecao: '',
    fiscal: '',
    resultado: '',
    descricao: '',
    latitude: '',
    longitude: '',
    evidencias: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Fiscalização cadastrada:', formData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Nova Fiscalização</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Licença Fiscalizada
              </label>
              <select
                value={formData.licenca}
                onChange={(e) => setFormData({...formData, licenca: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione a licença</option>
                <option value="LIC-2024-001">LIC-2024-001 - Corte (João Silva)</option>
                <option value="LIC-2024-002">LIC-2024-002 - Transporte (Maria Costa)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Inspeção
              </label>
              <input
                type="date"
                value={formData.dataInspecao}
                onChange={(e) => setFormData({...formData, dataInspecao: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiscal Responsável
              </label>
              <select
                value={formData.fiscal}
                onChange={(e) => setFormData({...formData, fiscal: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o fiscal</option>
                <option value="Carlos Mendes">Carlos Mendes</option>
                <option value="Ana Santos">Ana Santos</option>
                <option value="Pedro Silva">Pedro Silva</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultado da Inspeção
              </label>
              <select
                value={formData.resultado}
                onChange={(e) => setFormData({...formData, resultado: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o resultado</option>
                <option value="Conforme">Conforme</option>
                <option value="Irregularidade">Irregularidade</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: -8.838333"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 13.234444"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição da Fiscalização
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva os detalhes da fiscalização..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="w-4 h-4 inline mr-1" />
              Evidências (Fotos/Documentos)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Clique para adicionar fotos ou documentos</p>
              <input type="file" multiple accept="image/*,.pdf" className="hidden" />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2 inline" />
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2 inline" />
              Salvar Fiscalização
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroFiscalizacao;