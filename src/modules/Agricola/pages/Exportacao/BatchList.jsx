import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Users, Shield, Plus, Search, Calendar, MapPin, Eye, EllipsisVertical, Filter, Tractor } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../core/components/CustomInput';

export default function BatchList() {
  const [batches, setBatches] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const navigate = useNavigate();

  useEffect(() => {
    const batchesDB = JSON.parse(localStorage.getItem('batchesDB') || '[]')
    setBatches(batchesDB.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }, [])

  function getStatusColor(status) {
    switch (status) {
      case 'Entregue': return 'bg-green-100 text-green-800 border-green-200'
      case 'Em trânsito': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Selado': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Criado': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  
    // Navegação para detalhes do lote
    const handleViewBatchDetails = (batchId) => {
        navigate(`/GerenciaRNPA/gestao-agricultores/Exportacao/lote/${batchId}`);
    };

    // Navegação para visualização pública do lote
    const handleViewPublicBatch = (batchId) => {
        navigate(`/GerenciaRNPA/gestao-agricultores/Exportacao/publico/${batchId}`);
    };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || batch.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBatches = filteredBatches.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="w-full shadow-md bg-white rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white shadow-md mb-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold mb-1">Lotes de Exportação</h1>
            <p className="text-white">Gerencie e acompanhe todos os lotes criados</p>
          </div>
        </div>
      </div>
      <div className="w-full bg-white rounded-xl shadow-md overflow-auto" style={{ maxHeight: '1065px' }}>
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <CustomInput
                type="text"
                placeholder="Pesquisar por código, produto..."
                value={searchTerm}
                onChange={setSearchTerm}
                iconStart={<Search className="w-4 h-4" />}
                className="mb-0"
              />
            </div>
            <div>
              <CustomInput
                type="select"
                value={{ label: filterStatus === 'all' ? 'Estado do Processo' : filterStatus, value: filterStatus }}
                options={[
                  { label: 'Estado do Processo', value: 'all' },
                  { label: 'Criado', value: 'Criado' },
                  { label: 'Selado', value: 'Selado' },
                  { label: 'Em trânsito', value: 'Em trânsito' },
                  { label: 'Entregue', value: 'Entregue' }
                ]}
                onChange={(option) => setFilterStatus(option.value)}
                iconStart={<Filter className="w-4 h-4" />}
                className="mb-0"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block overflow-visible" style={{ maxHeight: '1065px' }}>
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Número do Lote</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Produtores</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Produtos</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Toneladas</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Data</th>

                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedBatches.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {batches.length === 0 ? 'Nenhum lote criado' : 'Nenhum lote encontrado'}
                    </h3>
                    <p className="text-gray-500">
                      {batches.length === 0
                        ? 'Crie seu primeiro lote de exportação para começar o rastreamento'
                        : 'Tente ajustar os filtros de busca'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedBatches.map(batch => (
                  <tr key={batch.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{batch.batchCode}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {batch.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        {batch.producers.length} produtores
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{batch.product}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{batch.totalQuantity}t</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(batch.status)}`}>
                          {batch.sealed}
                          {batch.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-500">{new Date(batch.createdAt).toLocaleDateString('pt-BR')}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleViewPublicBatch(batch.id)}
                          className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                          title="Portal Público"
                        >
                            🌍
                        </button>

                         <button
                          onClick={() => handleViewBatchDetails(batch.id)}
                          className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                          title="Ver Lote"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        
                        <div className="relative">
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Mais ações">
                            <EllipsisVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8">
                  <div className="px-6 py-4 border-t border-gray-200 bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                      <div className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredBatches.length)}</span> de <span className="font-medium">{filteredBatches.length}</span> resultados
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                            currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                          }`}
                        >
                          Anterior
                        </button>
                        <div className="flex space-x-1">
                          <button className="px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white">{currentPage}</button>
                        </div>
                        <button 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages || totalPages === 0}
                          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                            currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                          }`}
                        >
                          Próximo
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </div>
  )
}