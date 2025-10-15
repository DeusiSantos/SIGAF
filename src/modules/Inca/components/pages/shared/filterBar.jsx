import React from 'react';
import CustomInput from '../../../../../core/components/CustomInput';
import { Search, Filter, MapPin, Tractor } from 'lucide-react';

/**
 * Barra de filtros reutilizável
 * 
 * @param {Object} filters - Objeto com os valores dos filtros
 * @param {Function} onFilterChange - Função chamada quando qualquer filtro muda: (filterName, value) => void
 * @param {Array} customFilters - Array de filtros customizados (opcional)
 * @param {boolean} showSearch - Mostrar campo de busca (default: true)
 * @param {boolean} showStatus - Mostrar filtro de status (default: true)
 * @param {boolean} showProvince - Mostrar filtro de província (default: true)
 * @param {boolean} showActivity - Mostrar filtro de atividade (default: true)
 * @param {string} searchPlaceholder - Placeholder do campo de busca
 */
const FilterBar = ({
  filters = {},
  onFilterChange,
  customFilters = [],
  showSearch = true,
  showStatus = true,
  showProvince = true,
  showActivity = true,
  searchPlaceholder = "Pesquisar por nome, BI ou código RNPA..."
}) => {
  
  // Opções padrão para os filtros
  const statusOptions = [
    { label: 'Todos os Estados', value: '' },
    { label: 'Processo Recebido', value: 'PROCESSO_RECEBIDO' },
    { label: 'Pendente', value: 'PENDENTE' },
    { label: 'Aprovado', value: 'APROVADO' },
    { label: 'Rejeitado', value: 'REJEITADO' },
    { label: 'Cancelado', value: 'CANCELADO' }
  ];

  const provinceOptions = [
    { label: 'Todas as Províncias', value: '' },
    { label: 'Luanda', value: 'LUANDA' },
    { label: 'Benguela', value: 'BENGUELA' },
    { label: 'Huíla', value: 'HUILA' },
    { label: 'Bié', value: 'BIE' },
    { label: 'Malanje', value: 'MALANJE' },
    { label: 'Huambo', value: 'HUAMBO' },
    { label: 'Cabinda', value: 'CABINDA' },
    { label: 'Zaire', value: 'ZAIRE' },
    { label: 'Uíge', value: 'UIGE' },
    { label: 'Cunene', value: 'CUNENE' },
    { label: 'Namibe', value: 'NAMIBE' },
    { label: 'Lunda Norte', value: 'LUNDA_NORTE' },
    { label: 'Lunda Sul', value: 'LUNDA_SUL' },
    { label: 'Moxico', value: 'MOXICO' },
    { label: 'Cuando Cubango', value: 'CUANDO_CUBANGO' },
    { label: 'Bengo', value: 'BENGO' },
    { label: 'Cuanza Norte', value: 'CUANZA_NORTE' },
    { label: 'Cuanza Sul', value: 'CUANZA_SUL' }
  ];

  const activityOptions = [
    { label: 'Todas as Actividades', value: '' },
    { label: 'Agricultura', value: 'AGRICULTURA' },
    { label: 'Pecuária', value: 'PECUARIA' },
    { label: 'Aquicultura', value: 'AQUICULTURA' },
    { label: 'Agropecuária', value: 'AGROPECUARIA' },
    { label: 'Produtos Florestais', value: 'FLORESTAIS' }
  ];

  // Calcular o número de colunas baseado nos filtros visíveis
  const totalFilters = 
    (showSearch ? 1 : 0) + 
    (showStatus ? 1 : 0) + 
    (showProvince ? 1 : 0) + 
    (showActivity ? 1 : 0) + 
    customFilters.length;

  const gridCols = totalFilters <= 2 ? 'lg:grid-cols-2' : 
                   totalFilters === 3 ? 'lg:grid-cols-3' : 
                   'lg:grid-cols-4';

  return (
    <div className=" border-b border-gray-200 bg-white">
      <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-4`}>
        
        {/* Busca */}
        {showSearch && (
          <div className={!showStatus && !showProvince && !showActivity && customFilters.length === 0 ? 'lg:col-span-1' : ''}>
            <CustomInput
              type="text"
              placeholder={searchPlaceholder}
              value={filters.searchTerm || ''}
              onChange={(value) => onFilterChange('searchTerm', value)}
              iconStart={<Search size={18} />}
            />
          </div>
        )}

        {/* Filtro Status */}
        {showStatus && (
          <div>
            <CustomInput
              type="select"
              placeholder="Estado do Processo"
              value={filters.selectedStatus ? { label: filters.selectedStatus, value: filters.selectedStatus } : null}
              options={statusOptions}
              onChange={(option) => onFilterChange('selectedStatus', option?.value || '')}
              iconStart={<Filter size={18} />}
            />
          </div>
        )}

        {/* Filtro por província */}
        {showProvince && (
          <div>
            <CustomInput
              type="select"
              placeholder="Selecione a Província"
              value={filters.selectedProvince ? { label: filters.selectedProvince, value: filters.selectedProvince } : null}
              options={provinceOptions}
              onChange={(option) => onFilterChange('selectedProvince', option?.value || '')}
              iconStart={<MapPin size={18} />}
            />
          </div>
        )}

        {/* Filtro Atividade */}
        {showActivity && (
          <div>
            <CustomInput
              type="select"
              placeholder="Tipo de Actividade"
              value={filters.selectedActivity ? { label: filters.selectedActivity, value: filters.selectedActivity } : null}
              options={activityOptions}
              onChange={(option) => onFilterChange('selectedActivity', option?.value || '')}
              iconStart={<Tractor size={18} />}
            />
          </div>
        )}

        {/* Filtros customizados */}
        {customFilters.map((customFilter, index) => (
          <div key={index}>
            <CustomInput
              type={customFilter.type || 'select'}
              placeholder={customFilter.placeholder}
              value={customFilter.value}
              options={customFilter.options}
              onChange={(value) => onFilterChange(customFilter.name, value)}
              iconStart={customFilter.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;