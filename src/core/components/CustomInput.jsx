import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, Check, ChevronDown, Search, X, 
  Eye, EyeOff, Lock, Mail, Phone, User, FileText, 
  Globe, Hash, AlertCircle, ChevronLeft, ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';


const CustomInput = ({
  type = 'text',
  options = [],
  label,
  value,
  onChange,
  required = false,
  placeholder,
  className = '',
  iconStart,
  iconEnd,
  disabled = false,
  errorMessage = '',
  name,
  id,
  minDate,
  maxDate,
  dateFormat = 'dd/MM/yyyy',
  maxLength,
  autoFocus = false,
  rows = 4,
  helperText,
  success = false,
  onBlur,
  onFocus,
}) => {
  // Estados
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentView, setCurrentView] = useState('days');
  const [yearsRange, setYearsRange] = useState([]);
  const [animationDirection, setAnimationDirection] = useState('');
  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Refs
  const dropdownRef = useRef(null);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Função auxiliar para converter strings em objetos Date
  const parseDate = (date) => {
    if (!date) return null;
    
    if (typeof date === 'string') {
      if (date.includes('-')) {
        return new Date(date + 'T00:00:00');
      } else {
        return new Date(date);
      }
    } else if (date instanceof Date) {
      return date;
    }
    
    return null;
  };
  
  // Sincronizar selectedDate e currentMonth com o value recebido
  useEffect(() => {
    if (type === 'date') {
      const dateObj = parseDate(value);
      if (dateObj && !isNaN(dateObj.getTime())) {
        setSelectedDate(dateObj);
        setCurrentMonth(dateObj);
      } else if (!value) {
        setSelectedDate(null);
        setCurrentMonth(new Date());
      }
    }
  }, [value, type]);
  
  // Calcular o intervalo de anos para o seletor
  useEffect(() => {
    if (currentView === 'years') {
      const currentYear = currentMonth.getFullYear();
      const startYear = Math.floor(currentYear / 10) * 10 - 1;
      setYearsRange(Array.from({ length: 12 }, (_, i) => startYear + i));
    }
  }, [currentView, currentMonth]);
  
  // Efeito para focar no campo de busca quando o dropdown abre
  useEffect(() => {
    if (dropdownOpen && searchInputRef.current && (type === 'select' || type === 'multiselect')) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [dropdownOpen, type]);
  
  // Handlers de evento
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  
  const toggleDropdown = () => {
    if (!disabled) {
      setDropdownOpen(!dropdownOpen);
      if (!dropdownOpen) {
        setSearchTerm('');
      }
    }
  };
  
  const toggleCalendar = () => {
    if (!disabled) {
      setCalendarOpen(!calendarOpen);
      if (!calendarOpen) {
        const dateObj = parseDate(value);
        if (dateObj && !isNaN(dateObj.getTime())) {
          setCurrentMonth(dateObj);
        } else {
          setCurrentMonth(new Date());
        }
        setCurrentView('days');
      }
    }
  };
  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setCalendarOpen(false);
    }
  };
  
  // Fechar dropdown/calendar ao clicar fora
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Filtrar opções baseado no termo de busca
  const filteredOptions = options.filter(option => 
    option.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Determinar estilo do container baseado no estado
  const getContainerClasses = () => {
    let classes = "relative bg-white rounded-lg transition-all duration-300";
    
    if (errorMessage) {
      classes += " border-2 border-red-500";
    } else if (success) {
      classes += " border-2 border-emerald-500";
    } else if (focused) {
      classes += " border-2 border-blue-500 shadow-sm shadow-blue-300/30";
    } else {
      classes += " border border-gray-300";
    }
    
    if (disabled) {
      classes += " opacity-70 bg-gray-50";
    }
    
    return `${classes} ${className}`;
  };
  
  // Estilo do label
  const getLabelClasses = () => {
    let classes = "block text-sm font-medium mb-1.5 transition-colors duration-300";
    
    if (errorMessage) {
      classes += " text-red-500";
    } else if (success) {
      classes += " text-emerald-600";
    } else if (focused) {
      classes += " text-blue-600";
    } else {
      classes += " text-gray-700";
    }
    
    return classes;
  };
  
  // Estilo do ícone
  const getIconClasses = (position = 'start') => {
    let classes = "absolute top-1/2 transform -translate-y-1/2 z-10";
    
    if (position === 'start') {
      classes += " left-3";
    } else {
      classes += " right-3";
    }
    
    if (errorMessage) {
      classes += " text-red-500";
    } else if (success) {
      classes += " text-emerald-500";
    } else if (focused) {
      classes += " text-blue-500";
    } else {
      classes += " text-gray-400";
    }
    
    if (disabled) {
      classes += " opacity-50";
    }
    
    return classes;
  };
  
  // Determinar o ícone correto com base no tipo
  const getIconByType = () => {
    if (iconStart) return iconStart;
    
    const iconMap = {
      'text': <FileText size={18} />,
      'email': <Mail size={18} />,
      'password': <Lock size={18} />,
      'tel': <Phone size={18} />,
      'number': <Hash size={18} />,
      'url': <Globe size={18} />,
      'select': <ChevronDown size={18} />,
      'multiselect': <ChevronDown size={18} />,
      'date': <Calendar size={18} />,
      'textarea': <FileText size={18} />,
      'default': <User size={18} />
    };
    
    return iconMap[type] || iconMap.default;
  };
  
  // Estrutura do campo de entrada principal
  const getBaseInputClasses = (paddingLeft = true, paddingRight = false) => {
    let classes = "w-full py-2.5 rounded-lg focus:outline-none transition-all";
    
    if (paddingLeft) {
      classes += " pl-10";
    } else {
      classes += " pl-4";
    }
    
    if (paddingRight || type === 'password') {
      classes += " pr-10";
    } else {
      classes += " pr-4";
    }
    
    if (disabled) {
      classes += " cursor-not-allowed bg-gray-50 text-gray-500";
    } else {
      classes += " bg-white text-gray-800";
    }
    
    return classes;
  };
  
  // Formatar data conforme o formato especificado - CORRIGIDO
  const formatDate = (date) => {
    if (!date) return '';
    
    // Converter para Date se for string
    let dateObj = parseDate(date);
    
    // Verificar se a data é válida
    if (!dateObj || isNaN(dateObj.getTime()) || !(dateObj instanceof Date)) {
      return '';
    }
    
    try {
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      
      return dateFormat
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', year)
        .replace('yy', year.toString().slice(-2));
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };
  
  // Obter os dias do mês atual para o calendário
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => null);
    
    return [...blanks, ...days];
  };
  
  // Mudar mês no calendário
  const changeMonth = (increment) => {
    const newMonth = new Date(currentMonth);
    
    if (currentView === 'days') {
      newMonth.setMonth(newMonth.getMonth() + increment);
    } else if (currentView === 'months') {
      newMonth.setFullYear(newMonth.getFullYear() + increment);
    } else if (currentView === 'years') {
      const currentYear = currentMonth.getFullYear();
      const startYear = Math.floor(currentYear / 10) * 10;
      newMonth.setFullYear(startYear + (increment * 10));
    }
    
    setAnimationDirection(increment > 0 ? 'next' : 'prev');
    setTimeout(() => {
      setCurrentMonth(newMonth);
      setAnimationDirection('');
    }, 10);
  };
  
  // Alternar para a visualização de meses
  const toggleMonthView = () => {
    setCurrentView(currentView === 'months' ? 'days' : 'months');
  };
  
  // Alternar para a visualização de anos
  const toggleYearView = () => {
    setCurrentView(currentView === 'years' ? 'days' : 'years');
  };
  
  // Selecionar um mês
  const selectMonth = (month) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(month);
    setCurrentMonth(newDate);
    setCurrentView('days');
  };
  
  // Selecionar um ano
  const selectYear = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setCurrentView('months');
  };
  
  // Verificar se uma data está selecionada
  const isSelectedDate = (day) => {
    if (!day) return false;
    
    const selectedDateObj = parseDate(selectedDate);
    if (!selectedDateObj) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.getDate() === selectedDateObj.getDate() &&
      date.getMonth() === selectedDateObj.getMonth() &&
      date.getFullYear() === selectedDateObj.getFullYear();
  };
  
  // Verificar se uma data está no passado
  const isPastDate = (day) => {
    if (!day || !minDate) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const minDateObj = parseDate(minDate);
    return minDateObj ? date < minDateObj : false;
  };
  
  // Verificar se uma data está no futuro
  const isFutureDate = (day) => {
    if (!day || !maxDate) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const maxDateObj = parseDate(maxDate);
    return maxDateObj ? date > maxDateObj : false;
  };
  
  // Verificar se uma data está desabilitada
  const isDisabledDate = (day) => {
    return isPastDate(day) || isFutureDate(day);
  };
  
  // Selecionar uma data no calendário
  const selectDate = (day) => {
    if (!day || isDisabledDate(day)) return;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    onChange(date);
    setCalendarOpen(false);
  };
  
  // Selecionar a data de hoje
  const selectToday = () => {
    const today = new Date();
    if (isDisabledDate(today.getDate())) return;
    
    setSelectedDate(today);
    setCurrentMonth(today);
    onChange(today);
    setCalendarOpen(false);
  };
  
  // Limpar data selecionada
  const clearDate = () => {
    setSelectedDate(null);
    onChange(null);
    setCalendarOpen(false);
  };
  
  // Verificar se um mês está selecionado
  const isSelectedMonth = (month) => {
    const selectedDateObj = parseDate(selectedDate);
    if (!selectedDateObj) return false;
    return selectedDateObj.getMonth() === month && 
           selectedDateObj.getFullYear() === currentMonth.getFullYear();
  };
  
  // Verificar se um ano está selecionado
  const isSelectedYear = (year) => {
    const selectedDateObj = parseDate(selectedDate);
    if (!selectedDateObj) return false;
    return selectedDateObj.getFullYear() === year;
  };
  
  // Verificar se um ano é o ano atual
  const isCurrentYear = (year) => {
    const today = new Date();
    return today.getFullYear() === year;
  };
  
  // Verificar se um mês é o mês atual
  const isCurrentMonth = (month) => {
    const today = new Date();
    return today.getMonth() === month && today.getFullYear() === currentMonth.getFullYear();
  };
  
  // Selecionar um item no dropdown - CORRIGIDO
  const selectItem = (option) => {
    if (type === 'multiselect') {
      const isSelected = Array.isArray(value) && value.some(item => item.value === option.value);
      let newValue;
      
      if (isSelected) {
        newValue = value.filter(item => item.value !== option.value);
      } else {
        newValue = [...(value || []), option];
      }
      
      onChange(newValue);
    } else {
      // Para select simples, apenas chama onChange e fecha o dropdown
      onChange(option);
      setDropdownOpen(false);
    }
  };
  
  // Verificar se um item está selecionado no multiselect
  const isItemSelected = (option) => {
    if (type === 'multiselect') {
      return Array.isArray(value) && value.some(item => item.value === option.value);
    } else {
      return value && value.value === option.value;
    }
  };
  
  // Remover um item do multiselect
  const removeItem = (option, e) => {
    e.stopPropagation();
    const newValue = value.filter(item => item.value !== option.value);
    onChange(newValue);
  };
  
  // Renderizar chips do multiselect
  const renderSelectedItems = () => {
    if (!Array.isArray(value) || value.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {value.map(item => (
          <div 
            key={item.value} 
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center"
          >
            {item.label}
            <button
              type="button"
              onClick={(e) => removeItem(item, e)}
              className="ml-1.5 text-blue-500 hover:text-blue-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  // Renderizar a visualização de dias no datepicker
  const renderDaysView = () => {
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const days = getDaysInMonth();
    
    return (
      <>
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map((day, index) => (
            <div key={`weekday-${index}`} className="text-center text-gray-500 text-xs py-1">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => (
            <button
              key={`day-${index}`}
              type="button"
              disabled={!day || isDisabledDate(day)}
              className={`
                relative w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors
                ${!day ? 'invisible' : ''}
                ${isSelectedDate(day) ? 'bg-blue-600 text-white' : ''}
                ${!isSelectedDate(day) && hoveredDay === day ? 'bg-blue-100' : ''}
                ${!isSelectedDate(day) && !isDisabledDate(day) ? 'hover:bg-blue-100 text-gray-700' : ''}
                ${isDisabledDate(day) ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={() => selectDate(day)}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {day}
              {isSelectedDate(day) && (
                <span className="absolute inset-0 animate-ping bg-blue-400 rounded-full opacity-10"></span>
              )}
            </button>
          ))}
        </div>
      </>
    );
  };
  
  // Renderizar a visualização de meses no datepicker
  const renderMonthsView = () => {
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    return (
      <div className="grid grid-cols-3 gap-2 p-1">
        {months.map((month, index) => (
          <button
            key={`month-${index}`}
            type="button"
            className={`
              py-2 rounded-lg text-sm transition-colors
              ${isSelectedMonth(index) ? 'bg-blue-600 text-white' : ''}
              ${isCurrentMonth(index) && !isSelectedMonth(index) ? 'font-bold' : ''}
              ${!isSelectedMonth(index) ? 'hover:bg-blue-100 text-gray-700' : ''}
            `}
            onClick={() => selectMonth(index)}
          >
            {month}
          </button>
        ))}
      </div>
    );
  };
  
  // Renderizar a visualização de anos no datepicker
  const renderYearsView = () => {
    return (
      <div className="grid grid-cols-3 gap-2 p-1">
        {yearsRange.map((year, index) => {
          const isStartEndYear = index === 0 || index === 11;
          
          return (
            <button
              key={`year-${index}`}
              type="button"
              className={`
                py-2 rounded-lg text-sm transition-colors
                ${isSelectedYear(year) ? 'bg-blue-600 text-white' : ''}
                ${isCurrentYear(year) && !isSelectedYear(year) ? 'font-bold' : ''}
                ${isStartEndYear ? 'text-gray-400' : ''}
                ${!isSelectedYear(year) ? 'hover:bg-blue-100 text-gray-700' : ''}
              `}
              onClick={() => selectYear(year)}
            >
              {year}
            </button>
          );
        })}
      </div>
    );
  };
  
  // Renderizar o datepicker
  const renderDatepicker = () => {
    const calendarAnimation = animationDirection === 'next' 
      ? 'animate-slide-left' 
      : animationDirection === 'prev' 
        ? 'animate-slide-right' 
        : '';
    
    const getHeaderText = () => {
      if (currentView === 'days') {
        return currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      } else if (currentView === 'months') {
        return currentMonth.getFullYear().toString();
      } else if (currentView === 'years') {
        const startYear = yearsRange[1];
        const endYear = yearsRange[10];
        return `${startYear} - ${endYear}`;
      }
    };
    
    return (
      <div 
        ref={calendarRef}
        className="absolute z-20 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs w-full animate-fade-in"
      >
        <div className="flex justify-between items-center mb-3">
          <button 
            type="button" 
            onClick={() => changeMonth(-1)}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex gap-1">
            {currentView !== 'months' && (
              <button 
                type="button"
                onClick={toggleMonthView}
                className="font-medium text-gray-800 hover:bg-gray-100 px-2 py-1 rounded"
              >
                {currentMonth.toLocaleDateString('pt-BR', { month: 'long' })}
              </button>
            )}
            
            <button 
              type="button"
              onClick={toggleYearView}
              className="font-medium text-gray-800 hover:bg-gray-100 px-2 py-1 rounded"
            >
              {currentView === 'years' 
                ? getHeaderText()
                : currentMonth.getFullYear()}
            </button>
          </div>
          
          <button 
            type="button" 
            onClick={() => changeMonth(1)}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        
        <div className={`${calendarAnimation}`}>
          {currentView === 'days' && renderDaysView()}
          {currentView === 'months' && renderMonthsView()}
          {currentView === 'years' && renderYearsView()}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between">
          <button 
            type="button"
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
            onClick={selectToday}
          >
            Hoje
          </button>
          <button 
            type="button"
            className="text-xs font-medium text-gray-600 hover:text-gray-800"
            onClick={clearDate}
          >
            Limpar
          </button>
        </div>
      </div>
    );
  };
  
  // Renderizar o dropdown (para select e multiselect) - CORRIGIDO
  const renderDropdown = () => {
    return (
      <div 
        ref={dropdownRef}
        className="absolute z-20 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full max-h-60 overflow-auto animate-fade-in"
      >
        {options.length > 4 && (
          <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <div className="py-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => (
              <div
                key={option.value || idx}
                className={`px-3 py-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  isItemSelected(option) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => selectItem(option)}
              >
                {type === 'multiselect' ? (
                  <input
                    type="checkbox"
                    checked={isItemSelected(option)}
                    onChange={() => {}} // Controlado pelo onClick do div pai
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"
                  />
                ) : (
                  <span className={`w-5 h-5 mr-2.5 rounded-md flex items-center justify-center transition-colors ${
                    isItemSelected(option) ? 'bg-blue-500 text-white' : 'border border-gray-300'
                  }`}>
                    {isItemSelected(option) && <Check size={14} />}
                  </span>
                )}
                <span className="text-sm">{option.label}</span>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm text-center">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Renderizar o campo de entrada com base no tipo
  const renderInput = () => {
    switch (type) {
      case 'password':
        return (
          <div className="relative">
            <span className={getIconClasses('start')}>{getIconByType()}</span>
            <input
              ref={inputRef}
              type={showPassword ? "text" : "password"}
              id={id}
              name={name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              className={getBaseInputClasses(true, true)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={maxLength}
              required={required}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className={`${getIconClasses('end')} focus:outline-none`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        );
        
      case 'select':
        return (
          <div className="relative">
            {(iconStart || !iconStart) && (
              <span className={getIconClasses('start')}>{iconStart || <ChevronDown size={18} />}</span>
            )}
            <button
              ref={inputRef}
              type="button"
              onClick={toggleDropdown}
              disabled={disabled}
              className={`${getBaseInputClasses(iconStart || true, !iconStart)} text-left`}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {value && value.label ? (
                <span className="text-gray-800">{value.label}</span>
              ) : (
                <span className="text-gray-400">
                  {placeholder || 'Selecione uma opção'}
                </span>
              )}
            </button>
            {!iconStart && (
              <span className={`${getIconClasses('end')} transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`}>
                <ChevronDown size={18} />
              </span>
            )}
            {dropdownOpen && renderDropdown()}
          </div>
        );
        
      case 'multiselect':
        return (
          <div className="relative">
            <span className={getIconClasses('start')}>{getIconByType()}</span>
            <button
              ref={inputRef}
              type="button"
              onClick={toggleDropdown}
              disabled={disabled}
              className={`${getBaseInputClasses(true, true)} text-left min-h-[2.5rem]`}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {Array.isArray(value) && value.length > 0 ? (
                <span className="text-gray-800">
                  {value.length} {value.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </span>
              ) : (
                <span className="text-gray-400">
                  {placeholder || 'Selecione opções'}
                </span>
              )}
            </button>
            <span className={`${getIconClasses('end')} transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`}>
              <ChevronDown size={18} />
            </span>
            {renderSelectedItems()}
            {dropdownOpen && renderDropdown()}
          </div>
        );
        
      case 'date':
        return (
          <div className="relative">
            <span className={getIconClasses('start')}>{getIconByType()}</span>
            <button
              ref={inputRef}
              type="button"
              onClick={toggleCalendar}
              disabled={disabled}
              className={`${getBaseInputClasses(true, true)} text-left`}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {selectedDate ? (
                <span className="text-gray-800">{formatDate(selectedDate)}</span>
              ) : (
                <span className="text-gray-400">
                  {placeholder || 'Selecione uma data'}
                </span>
              )}
            </button>
            <span className={getIconClasses('end')}>
              <CalendarIcon size={18} />
            </span>
            {calendarOpen && renderDatepicker()}
          </div>
        );
        
      case 'textarea':
        return (
          <div className="relative">
            <span className={`${getIconClasses('start')} top-3 transform-none`}>{getIconByType()}</span>
            <textarea
              ref={inputRef}
              id={id}
              name={name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              className={`${getBaseInputClasses(true)} resize-none min-h-[5rem]`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              rows={rows}
              maxLength={maxLength}
              required={required}
            ></textarea>
            {maxLength && (
              <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                {value ? value.length : 0}/{maxLength}
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="relative">
            <span className={getIconClasses('start')}>{getIconByType()}</span>
            <input
              ref={inputRef}
              type={type}
              id={id}
              name={name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              className={getBaseInputClasses(true, iconEnd)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={maxLength}
              required={required}
            />
            {iconEnd && (
              <span className={getIconClasses('end')}>{iconEnd}</span>
            )}
          </div>
        );
    }
  };
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={getLabelClasses() + ' text-left'}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={getContainerClasses()}>
        {renderInput()}
      </div>
      
      {errorMessage && (
        <div className="mt-1.5 flex items-start">
          <AlertCircle size={14} className="text-red-500 mr-1.5 mt-0.5" />
          <p className="text-red-500 text-xs">{errorMessage}</p>
        </div>
      )}
      
      {helperText && !errorMessage && (
        <p className="mt-1.5 text-gray-500 text-xs">{helperText}</p>
      )}
    </div>
  );
};


export default CustomInput;