import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

/**
 * Tabela genérica e reutilizável com paginação
 * 
 * @param {Array} columns - Colunas da tabela: [{ key, label, render?, className? }]
 * @param {Array} data - Dados a serem exibidos
 * @param {number} itemsPerPage - Itens por página (default: 10)
 * @param {boolean} showPagination - Mostrar paginação (default: true)
 * @param {Function} onRowClick - Callback ao clicar na linha (opcional)
 * @param {boolean} loading - Estado de carregamento
 * @param {string} emptyMessage - Mensagem quando não há dados
 * @param {React.ReactNode} emptyIcon - Ícone quando não há dados
 * @param {string} maxHeight - Altura máxima da tabela
 * @param {boolean} hoverable - Hover nas linhas (default: true)
 * @param {Function} getRowClassName - Função para classes customizadas por linha
 */
const GenericTable = ({
  columns = [],
  data = [],
  itemsPerPage = 10,
  showPagination = true,
  onRowClick,
  loading = false,
  emptyMessage = "Nenhum resultado encontrado",
  emptyIcon = <Search className="w-16 h-16 text-gray-300 mb-4" />,
  maxHeight = "calc(100vh - 12rem)",
  hoverable = true,
  getRowClassName
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Paginação
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = showPagination ? data.slice(startIndex, endIndex) : data;

  // Reset página ao mudar dados
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data.length, currentPage, totalPages]);

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tabela - Desktop */}
      <div className="hidden md:block overflow-auto" style={{ maxHeight }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
            <span className="ml-3 text-gray-600">Carregando...</span>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key || index}
                    className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b ${column.headerClassName || ''}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`
                    ${hoverable ? 'hover:bg-amber-50' : ''} 
                    ${onRowClick ? 'cursor-pointer' : ''} 
                    transition-colors
                    ${getRowClassName ? getRowClassName(row) : ''}
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={column.key || colIndex}
                      className={`px-6 py-4 ${column.className || ''}`}
                    >
                      {column.render 
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {showPagination && (
              <tfoot>
                <tr>
                  <td colSpan={columns.length}>
                    {/* Paginação */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-white">
                      <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        <div className="text-sm text-gray-700">
                          Mostrando{' '}
                          <span className="font-medium">{data.length > 0 ? startIndex + 1 : 0}</span>
                          {' '}a{' '}
                          <span className="font-medium">{Math.min(endIndex, data.length)}</span>
                          {' '}de{' '}
                          <span className="font-medium">{data.length}</span>
                          {' '}resultados
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                              ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-800'
                              }`}
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Anterior
                          </button>

                          {/* Números das páginas */}
                          <div className="flex space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                                    currentPage === pageNum
                                      ? 'bg-amber-800 text-white'
                                      : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-800'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                              ${currentPage === totalPages || totalPages === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-800'
                              }`}
                          >
                            Próximo
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}

        {/* Nenhum resultado */}
        {!loading && data.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            {emptyIcon}
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {emptyMessage}
            </h3>
          </div>
        )}
      </div>

      {/* Visualização Mobile - Cards */}
      <div className="md:hidden overflow-auto" style={{ maxHeight }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border--600"></div>
            <span className="ml-3 text-gray-600">Carregando...</span>
          </div>
        ) : currentData.length > 0 ? (
          currentData.map((row, rowIndex) => (
            <div
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`p-4 border-b border-gray-200 ${hoverable ? 'hover:bg-amber-50' : ''} ${onRowClick ? 'cursor-pointer' : ''} transition-colors`}
            >
              {columns.map((column, colIndex) => (
                <div key={column.key || colIndex} className="mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase">{column.label}: </span>
                  <span className="text-sm text-gray-900">
                    {column.render 
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]
                    }
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            {emptyIcon}
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {emptyMessage}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericTable;