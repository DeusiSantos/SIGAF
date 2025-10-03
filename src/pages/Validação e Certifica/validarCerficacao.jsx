import React, { useEffect, useState } from 'react';
import {
  User,
  Home,
  Users,
  Tractor,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Map,
  Building,
  Camera,
  AlertCircle,
  CheckCircle,
  Info,
  Loader,
  CreditCard,
  Phone,
  Trees,
  Wheat,
  Fish,
  DollarSign,
  Baby,
  UserCheck,
  Car,
  Bike,
  Radio,
  Tv,
  Smartphone,
  Sun,
  Zap,
  Beef,
  Egg,
  Milk,
  Search,
  Plus,
  Trash2,
  Edit,
  Award,
  ClipboardCheck,
  Eye,
  Download,
  X,
} from 'lucide-react';

import CustomInput from '../../components/CustomInput';
import provinciasData from '../../components/Provincias.json'
import { useProdutoresAprovados } from '../../hooks/useRnpaData';
import axios from 'axios';

const CertificacaoProdutor = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [produtorSelecionado, setProdutorSelecionado] = useState(null);
  const [modoBusca, setModoBusca] = useState(true);

  // Estados para consulta de documentos
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroBI, setNumeroBI] = useState('');
  const [numeroNIF, setNumeroNIF] = useState('');
  const [consultingBI, setConsultingBI] = useState(false);
  const [consultingNif, setConsultingNif] = useState(false);
  const [biData, setBiData] = useState(null);
  const [nifData, setNifData] = useState(null);
  const [consultaTimeout, setConsultaTimeout] = useState(null);

  // Hook para buscar produtores aprovados
  const { produtor: produtoresAprovados, loading: loadingProdutores } = useProdutoresAprovados();

  // Estados para as tabelas dinâmicas
  const [producaoAgricola, setProducaoAgricola] = useState([]);
  const [producaoPecuaria, setProducaoPecuaria] = useState([]);
  const [vistorias, setVistorias] = useState([]);

  // Estado inicial do formulário
  const initialState = {
    nomeCompleto: '',
    bi: '',
    dataNascimento: '',
    sexo: '',
    nacionalidade: 'ANGOLANA',
    telefone: '',
    enderecoResidencial: '',
    provincia: '',
    municipio: '',
    comuna: '',
    nomePropriedade: '',
    localizacaoGeografica: '',
    areaTotalExplorada: '',
    atividadePrincipal: '',
    coordenadasGPS: '',
    finalidadeCertificado: [],
    validadeInicio: '',
    validadeFim: '',
    observacoesTecnicas: '',
    tecnicoResponsavel: '',
    numeroProcesso: Math.floor(100000 + Math.random() * 900000),
    proprietario_instituicao: '',
    email: '',
    contacto: '',
    numeroNIF: ''
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Identificação', icon: Search },
    { label: 'Dados Pessoais', icon: User },
    { label: 'Exploração', icon: Tractor },
    { label: 'Produção Agrícola', icon: Wheat },
    { label: 'Produção Pecuária', icon: Fish },
    { label: 'Vistorías', icon: ClipboardCheck },
    { label: 'Certificação', icon: Award }
  ];

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  // Função auxiliar para extrair valores dos objetos select
  const getDisplayValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (typeof value === 'object' && value.hasOwnProperty('value')) return String(value.value || '');
    if (typeof value === 'object' && value.hasOwnProperty('label')) return String(value.label || '');
    return String(value);
  };

  // Função auxiliar para validar se campo tem valor válido
  const hasValidValue = (value) => {
    const displayValue = getDisplayValue(value);
    return displayValue && displayValue.trim() !== '';
  };

  // Função validateCurrentStep adaptada para CertificacaoProdutor
  const validateCurrentStep = () => {
    const newErrors = {};

    console.log('🔍 Validando step:', activeIndex);
    console.log('📋 FormData atual:', formData);

    switch (activeIndex) {
      case 0: // Identificação
        if (modoBusca) {
          // Modo busca - deve ter um produtor selecionado
          if (!produtorSelecionado) {
            newErrors.produtorSelecionado = 'Selecione um produtor existente';
          }
        } else {
          // Modo novo cadastro - validar baseado no tipo de documento
          if (tipoDocumento === 'BI' || tipoDocumento === 'NIF') {
            // Se tem tipo de documento selecionado, deve ter dados consultados ou preenchidos manualmente
            if (!biData && !nifData) {
              if (!hasValidValue(formData.nomeCompleto)) {
                newErrors.nomeCompleto = 'Campo obrigatório';
              }
              if (!hasValidValue(formData.bi)) {
                newErrors.bi = 'Campo obrigatório';
              }
            }
          } else {
            // Se não selecionou tipo de documento, campos básicos são obrigatórios
            if (!hasValidValue(formData.nomeCompleto)) {
              newErrors.nomeCompleto = 'Campo obrigatório';
            }
            if (!hasValidValue(formData.bi)) {
              newErrors.bi = 'Campo obrigatório';
            }
          }
        }
        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 1: // Dados Pessoais
        // if (!hasValidValue(formData.nomeCompleto)) {
        //   newErrors.nomeCompleto = 'Campo obrigatório';
        // }
        // if (!hasValidValue(formData.bi)) {
        //   newErrors.bi = 'Campo obrigatório';
        // }
        // if (!hasValidValue(formData.telefone)) {
        //   newErrors.telefone = 'Campo obrigatório';
        // }
        // if (!hasValidValue(formData.provincia)) {
        //   newErrors.provincia = 'Campo obrigatório';
        // }
        // if (!hasValidValue(formData.municipio)) {
        //   newErrors.municipio = 'Campo obrigatório';
        // }

        // // Validação específica para telefone (deve ter pelo menos 9 dígitos)
        // const telefoneValue = getDisplayValue(formData.telefone);
        // if (telefoneValue && telefoneValue.replace(/\D/g, '').length < 9) {
        //   newErrors.telefone = 'Telefone deve ter pelo menos 9 dígitos';
        // }

        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 2: // Dados da Exploração
        if (!hasValidValue(formData.localizacaoGeografica)) {
          newErrors.localizacaoGeografica = 'Campo obrigatório';
        }

        const areaValue = getDisplayValue(formData.areaTotalExplorada);
        if (!areaValue || parseFloat(areaValue) <= 0) {
          newErrors.areaTotalExplorada = 'Área deve ser maior que zero';
        }

        if (!hasValidValue(formData.atividadePrincipal)) {
          newErrors.atividadePrincipal = 'Campo obrigatório';
        }

        // Validação de coordenadas GPS (opcional, mas se preenchida deve ser válida)
        const coordenadas = getDisplayValue(formData.coordenadasGPS);
        if (coordenadas && coordenadas.trim() !== '') {
          const coordenadasRegex = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
          if (!coordenadasRegex.test(coordenadas.trim())) {
            newErrors.coordenadasGPS = 'Formato inválido. Use: latitude, longitude (ex: -8.838333, 13.234444)';
          }
        }

        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 3: // Produção Agrícola
        // Validação condicional: se a atividade principal inclui agricultura, deve ter pelo menos uma produção
        const atividadeValue = getDisplayValue(formData.atividadePrincipal);
        const temAgricultura = atividadeValue === 'AGRICULTURA' || atividadeValue === 'MISTA';

        if (temAgricultura && producaoAgricola.length === 0) {
          newErrors.producaoAgricola = 'Adicione pelo menos uma produção agrícola para atividades que incluem agricultura';
        }

        // Validar campos obrigatórios em cada linha de produção agrícola
        producaoAgricola.forEach((item, index) => {
          if (!item.produto) {
            newErrors[`producaoAgricola_${index}_produto`] = `Produto é obrigatório na linha ${index + 1}`;
          }
          if (!item.areaCultivada || parseFloat(item.areaCultivada) <= 0) {
            newErrors[`producaoAgricola_${index}_area`] = `Área cultivada deve ser maior que zero na linha ${index + 1}`;
          }
          if (!item.producao || parseFloat(item.producao) <= 0) {
            newErrors[`producaoAgricola_${index}_producao`] = `Produção deve ser maior que zero na linha ${index + 1}`;
          }
        });

        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 4: // Produção Pecuária
        // Validação condicional: se a atividade principal inclui pecuária, deve ter pelo menos uma produção
        const atividadeValuePec = getDisplayValue(formData.atividadePrincipal);
        const temPecuaria = atividadeValuePec === 'PECUARIA' || atividadeValuePec === 'MISTA';

        if (temPecuaria && producaoPecuaria.length === 0) {
          newErrors.producaoPecuaria = 'Adicione pelo menos uma produção pecuária para atividades que incluem pecuária';
        }

        // Validar campos obrigatórios em cada linha de produção pecuária
        producaoPecuaria.forEach((item, index) => {
          if (!item.especie) {
            newErrors[`producaoPecuaria_${index}_especie`] = `Espécie é obrigatória na linha ${index + 1}`;
          }
          if (!item.numeroCabecas || parseInt(item.numeroCabecas) <= 0) {
            newErrors[`producaoPecuaria_${index}_cabecas`] = `Número de cabeças deve ser maior que zero na linha ${index + 1}`;
          }
        });

        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 5: // Vistorias
        // Vistorias são opcionais, mas se existirem, devem ter campos obrigatórios preenchidos
        vistorias.forEach((item, index) => {
          if (item.data || item.tecnico || item.observacoes) {
            // Se algum campo foi preenchido, validar os obrigatórios
            if (!item.data) {
              newErrors[`vistoria_${index}_data`] = `Data é obrigatória na vistoria ${index + 1}`;
            }
            if (!item.tecnico) {
              newErrors[`vistoria_${index}_tecnico`] = `Técnico responsável é obrigatório na vistoria ${index + 1}`;
            }
          }
        });

        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 6: // Certificação
        if (!hasValidValue(formData.tecnicoResponsavel)) {
          newErrors.tecnicoResponsavel = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.validadeInicio)) {
          newErrors.validadeInicio = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.validadeFim)) {
          newErrors.validadeFim = 'Campo obrigatório';
        }

        // Validar se data de fim é posterior à data de início
        const dataInicio = getDisplayValue(formData.validadeInicio);
        const dataFim = getDisplayValue(formData.validadeFim);

        if (dataInicio && dataFim) {
          const inicio = new Date(dataInicio);
          const fim = new Date(dataFim);

          if (fim <= inicio) {
            newErrors.validadeFim = 'Data de validade final deve ser posterior à data inicial';
          }

          // Validar se a data de início não é anterior a hoje
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          if (inicio < hoje) {
            newErrors.validadeInicio = 'Data de início não pode ser anterior a hoje';
          }

          // Validar se o período de validade não excede 2 anos
          const diffTime = fim.getTime() - inicio.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 730) { // 2 anos
            newErrors.validadeFim = 'Período de validade não pode exceder 2 anos';
          }
        }

        // Validar se pelo menos uma finalidade foi selecionada
        if (!formData.finalidadeCertificado || formData.finalidadeCertificado.length === 0) {
          newErrors.finalidadeCertificado = 'Selecione pelo menos uma finalidade para o certificado';
        }

        // Validar se há pelo menos uma produção registrada (agrícola ou pecuária)
        const temProducaoAgricola = producaoAgricola && producaoAgricola.length > 0;
        const temProducaoPecuaria = producaoPecuaria && producaoPecuaria.length > 0;

        if (!temProducaoAgricola && !temProducaoPecuaria) {
          newErrors.producaoGeral = 'É necessário ter pelo menos uma produção registrada (agrícola ou pecuária) para emitir o certificado';
        }

        console.log('❌ Erros encontrados:', newErrors);
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando ele é alterado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleProvinciaChange = (value) => {
    const provinciaValue = typeof value === 'object' ? value.value : value;
    handleInputChange('provincia', provinciaValue);
    handleInputChange('municipio', '');

    const provinciaSelected = provinciasData.find(
      p => p.nome.toUpperCase() === provinciaValue?.toUpperCase()
    );

    if (provinciaSelected) {
      try {
        const municipiosArray = JSON.parse(provinciaSelected.municipios);
        const municipios = municipiosArray.map(mun => ({
          label: mun,
          value: mun
        }));
        setMunicipiosOptions(municipios);
      } catch (error) {
        console.error("Erro ao processar municípios:", error);
        setMunicipiosOptions([]);
      }
    } else {
      setMunicipiosOptions([]);
    }
  };

  const buscarProdutor = (produtorOption) => {
    const produtorId = typeof produtorOption === 'object' ? produtorOption.value : produtorOption;
    const produtor = produtoresAprovados.find(p => p._id === parseInt(produtorId));

    if (produtor) {
      setProdutorSelecionado(produtor);

      // Montar nome completo
      const nomeCompleto = [
        produtor.nome_produtor,
        produtor.nome_meio_produtor,
        produtor.sobrenome_produtor
      ].filter(Boolean).join(' ');

      setFormData(prev => ({
        ...prev,
        nomeCompleto: nomeCompleto,
        bi: produtor.confirmar_documento || '',
        telefone: produtor.beneficiary_phone_number || '',
        provincia: produtor.provincia || '',
        municipio: produtor.municipio || '',
        comuna: produtor.comuna || '',
        areaTotalExplorada: produtor.area_total || '',
        atividadePrincipal: produtor.atividades_produtor?.includes('agricultura') &&
          produtor.atividades_produtor?.includes('pecuaria') ? 'MISTA' :
          produtor.atividades_produtor?.includes('agricultura') ? 'AGRICULTURA' :
            produtor.atividades_produtor?.includes('pecuaria') ? 'PECUARIA' : ''
      }));

      // Atualizar municípios baseado na província
      if (produtor.provincia) {
        const provinciaSelected = provinciasData.find(
          p => p.nome.toUpperCase() === produtor.provincia?.toUpperCase()
        );
        if (provinciaSelected) {
          try {
            const municipiosArray = JSON.parse(provinciaSelected.municipios);
            const municipios = municipiosArray.map(mun => ({
              label: mun,
              value: mun
            }));
            setMunicipiosOptions(municipios);
          } catch (error) {
            console.error("Erro ao processar municípios:", error);
            setMunicipiosOptions([]);
          }
        }
      }

      // Limpar possíveis erros de seleção
      if (errors.produtorSelecionado) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.produtorSelecionado;
          return newErrors;
        });
      }

      showToast('success', 'Produtor Encontrado', 'Dados preenchidos automaticamente!');
    }
  };

  // Preparar opções de produtores para o select
  const produtoresOptions = produtoresAprovados.map(p => {
    const nomeCompleto = [
      p.nome_produtor,
      p.nome_meio_produtor,
      p.sobrenome_produtor
    ].filter(Boolean).join(' ');

    return {
      label: `${nomeCompleto} - ${p.confirmar_documento}`,
      value: p._id.toString()
    };
  });

  // Função para consultar NIF na API
  const consultarNIF = async (nifValue) => {
    if (!nifValue || nifValue.length < 9) return;

    setConsultingNif(true);

    try {
      const username = 'minagrif';
      const password = 'Nz#$20!23Mg';
      const credentials = btoa(`${username}:${password}`);

      const response = await axios.get(`https://api.gov.ao/nif/v1/consultarNIF`, {
        params: {
          tipoDocumento: 'NIF',
          numeroDocumento: nifValue
        },
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (response.status === 200 && data.code === 200 && data.data) {
        const nifInfo = data.data;
        setNifData(nifInfo);

        setFormData(prev => ({
          ...prev,
          nomeCompleto: nifInfo.nome_contribuinte || '',
          bi: nifValue,
          telefone: nifInfo.numero_contacto || '',
          provincia: nifInfo.provincia || '',
          municipio: nifInfo.municipio || '',
          proprietario_instituicao: nifInfo.nome_contribuinte || '',
          email: nifInfo.email || '',
          contacto: nifInfo.numero_contacto || '',
          numeroNIF: nifValue,
        }));

        showToast('success', 'NIF Consultado', 'Dados da entidade responsável preenchidos automaticamente!');
      } else {
        setNifData(null);
        if (data.code === 404) {
          showToast('warn', 'NIF não encontrado', 'Não foi possível encontrar dados para este NIF. Preencha manualmente.');
        } else {
          showToast('warn', 'NIF inválido', 'Este NIF não retornou dados válidos. Verifique o número.');
        }
      }
    } catch (error) {
      setNifData(null);
      if (error.response) {
        showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do NIF'}`);
      } else if (error.request) {
        showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        showToast('error', 'Erro na consulta', 'Erro ao consultar NIF. Tente novamente.');
      }
    } finally {
      setConsultingNif(false);
    }
  };

  // Função para consultar BI na API
  const consultarBI = async (biValue) => {
    if (!biValue || biValue.length < 9) return;

    setConsultingBI(true);

    try {
      const username = 'minagrif';
      const password = 'Nz#$20!23Mg';
      const credentials = btoa(`${username}:${password}`);

      const response = await axios.get(`https://api.gov.ao/bi/v1/getBI`, {
        params: {
          bi: biValue
        },
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (response.status === 200 && data.code === 200 && data.data) {
        const biInfo = data.data;
        setBiData(biInfo);

        const nomeCompleto = `${biInfo.first_name || ''} ${biInfo.last_name || ''}`.trim();
        
        // Mapear província de nascimento
        let provinciaBI = '';
        if (biInfo.birth_province_name) {
          const provinciaEncontrada = provinciasData.find(p => 
            p.nome.toLowerCase().includes(biInfo.birth_province_name.toLowerCase()) ||
            biInfo.birth_province_name.toLowerCase().includes(p.nome.toLowerCase())
          );
          provinciaBI = provinciaEncontrada ? provinciaEncontrada.nome : biInfo.birth_province_name;
        }
        
        // Mapear município de nascimento
        let municipioBI = '';
        if (biInfo.birth_municipality_name && provinciaBI) {
          const provinciaSelected = provinciasData.find(p => p.nome === provinciaBI);
          if (provinciaSelected) {
            try {
              const municipiosArray = JSON.parse(provinciaSelected.municipios);
              const municipioEncontrado = municipiosArray.find(m => 
                m.toLowerCase().includes(biInfo.birth_municipality_name.toLowerCase()) ||
                biInfo.birth_municipality_name.toLowerCase().includes(m.toLowerCase())
              );
              municipioBI = municipioEncontrado || biInfo.birth_municipality_name;
            } catch (error) {
              municipioBI = biInfo.birth_municipality_name;
            }
          }
        }
        
        setFormData(prev => ({
          ...prev,
          nomeCompleto: nomeCompleto,
          bi: biValue,
          telefone: '',
          provincia: provinciaBI,
          municipio: municipioBI,
          comuna: '',
          proprietario_instituicao: nomeCompleto,
          contacto: '',
          email: '',
          numeroBI: biValue,
        }));
        
        // Atualizar municípios se província foi encontrada
        if (provinciaBI) {
          const provinciaSelected = provinciasData.find(p => p.nome === provinciaBI);
          if (provinciaSelected) {
            try {
              const municipiosArray = JSON.parse(provinciaSelected.municipios);
              const municipios = municipiosArray.map(mun => ({
                label: mun,
                value: mun
              }));
              setMunicipiosOptions(municipios);
            } catch (error) {
              console.error("Erro ao processar municípios:", error);
            }
          }
        }

        showToast('success', 'BI Consultado', 'Dados da entidade responsável preenchidos automaticamente!');
      } else {
        setBiData(null);
        if (data.code === 404) {
          showToast('warn', 'BI não encontrado', 'Não foi possível encontrar dados para este BI. Preencha manualmente.');
        } else {
          showToast('warn', 'BI inválido', 'Este BI não retornou dados válidos. Verifique o número.');
        }
      }
    } catch (error) {
      setBiData(null);
      if (error.response) {
        showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do BI'}`);
      } else if (error.request) {
        showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        showToast('error', 'Erro na consulta', 'Erro ao consultar BI. Tente novamente.');
      }
    } finally {
      setConsultingBI(false);
    }
  };

  // Função para lidar com mudança no tipo de documento
  const handleTipoDocumentoChange = (tipo) => {
    setTipoDocumento(tipo);
    setNumeroBI('');
    setNumeroNIF('');
    setBiData(null);
    setNifData(null);

    // Limpar dados preenchidos automaticamente
    setFormData(prev => ({
      ...prev,
      nomeCompleto: '',
      bi: '',
      telefone: '',
      provincia: '',
      municipio: '',
      comuna: '',
      proprietario_instituicao: '',
      email: '',
      contacto: '',
      numeroBI: '',
      numeroNIF: ''
    }));
    setMunicipiosOptions([]);
  };

  // Função para lidar com mudança no número do BI
  const handleBIChange = (value) => {
    setNumeroBI(value);

    // Limpar timeout anterior
    if (consultaTimeout) {
      clearTimeout(consultaTimeout);
    }

    // Definir novo timeout para consulta automática
    if (value && value.length >= 9) {
      const timeout = setTimeout(() => {
        consultarBI(value);
      }, 1500);
      setConsultaTimeout(timeout);
    } else {
      setBiData(null);
    }
  };

  // Função para lidar com mudança no número do NIF
  const handleNIFChange = (value) => {
    setNumeroNIF(value);

    // Limpar timeout anterior
    if (consultaTimeout) {
      clearTimeout(consultaTimeout);
    }

    // Definir novo timeout para consulta automática
    if (value && value.length >= 9) {
      const timeout = setTimeout(() => {
        consultarNIF(value);
      }, 1500);
      setConsultaTimeout(timeout);
    } else {
      setNifData(null);
    }
  };

  // Função para limpar dados consultados
  const limparDadosConsultados = () => {
    setBiData(null);
    setNifData(null);
    setNumeroBI('');
    setNumeroNIF('');
    setTipoDocumento('');

    setFormData(prev => ({
      ...prev,
      nomeCompleto: '',
      bi: '',
      telefone: '',
      provincia: '',
      municipio: '',
      comuna: '',
      proprietario_instituicao: '',
      email: '',
      contacto: '',
      numeroBI: '',
      numeroNIF: ''
    }));
    setMunicipiosOptions([]);

    showToast('info', 'Dados Limpos', 'Agora você pode preencher manualmente.');
  };

  // Funções para gerenciar tabelas dinâmicas
  const adicionarProducaoAgricola = () => {
    const novaProducao = {
      id: Date.now(),
      ano: new Date().getFullYear(),
      produto: '',
      especieVariedade: '',
      areaCultivada: '',
      producao: '',
      modoProducao: '',
      meiosDisponiveis: '',
      observacoes: ''
    };
    setProducaoAgricola([...producaoAgricola, novaProducao]);

    // Limpar erro geral se existir
    if (errors.producaoAgricola) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.producaoAgricola;
        return newErrors;
      });
    }
  };

  const removerProducaoAgricola = (id) => {
    setProducaoAgricola(producaoAgricola.filter(item => item.id !== id));
  };

  const atualizarProducaoAgricola = (id, campo, valor) => {
    setProducaoAgricola(producaoAgricola.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));

    // Limpar erros específicos da linha quando alterada
    const index = producaoAgricola.findIndex(item => item.id === id);
    if (index !== -1) {
      const errorKey = `producaoAgricola_${index}_${campo === 'areaCultivada' ? 'area' : campo === 'produto' ? 'produto' : 'producao'}`;
      if (errors[errorKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    }
  };

  const adicionarProducaoPecuaria = () => {
    const novaProducao = {
      id: Date.now(),
      ano: new Date().getFullYear(),
      especie: '',
      racaVariedade: '',
      numeroCabecas: '',
      producao: '',
      observacoes: ''
    };
    setProducaoPecuaria([...producaoPecuaria, novaProducao]);

    // Limpar erro geral se existir
    if (errors.producaoPecuaria) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.producaoPecuaria;
        return newErrors;
      });
    }
  };

  const removerProducaoPecuaria = (id) => {
    setProducaoPecuaria(producaoPecuaria.filter(item => item.id !== id));
  };

  const atualizarProducaoPecuaria = (id, campo, valor) => {
    setProducaoPecuaria(producaoPecuaria.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));

    // Limpar erros específicos da linha quando alterada
    const index = producaoPecuaria.findIndex(item => item.id === id);
    if (index !== -1) {
      const errorKey = `producaoPecuaria_${index}_${campo === 'numeroCabecas' ? 'cabecas' : 'especie'}`;
      if (errors[errorKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    }
  };

  const adicionarVistoria = () => {
    const novaVistoria = {
      id: Date.now(),
      data: '',
      tecnico: '',
      observacoes: '',
      assinatura: ''
    };
    setVistorias([...vistorias, novaVistoria]);
  };

  const removerVistoria = (id) => {
    setVistorias(vistorias.filter(item => item.id !== id));
  };

  const atualizarVistoria = (id, campo, valor) => {
    setVistorias(vistorias.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));

    // Limpar erros específicos da vistoria quando alterada
    const index = vistorias.findIndex(item => item.id === id);
    if (index !== -1) {
      const errorKey = `vistoria_${index}_${campo}`;
      if (errors[errorKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    }
  };

  // Função para formatar datas
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Identificação
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Identificação do Produtor</h3>
              </div>
              <p className="text-gray-600">
                Primeiro, vamos identificar se o produtor já está cadastrado no sistema ou se é um novo cadastro.
              </p>
            </div>

            {/* Exibir erro geral de seleção */}
            {errors.produtorSelecionado && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.produtorSelecionado}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <button
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${modoBusca
                    ? 'bg-gradient-to-r from-blue-50 to-orange-50 text-slate shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  onClick={() => {
                    setModoBusca(true);
                    setProdutorSelecionado(null);
                    setFormData(initialState);
                    setErrors({});
                  }}
                >
                  <Search size={18} className="mr-2 inline" />
                  Buscar Existente
                </button>
                <button
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${!modoBusca
                    ? 'bg-gradient-to-r from-blue-50 to-orange-50 text-slate shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  onClick={() => {
                    setModoBusca(false);
                    setProdutorSelecionado(null);
                    setFormData(initialState);
                    setErrors({});
                    setTipoDocumento('');
                    setNumeroBI('');
                    setNumeroNIF('');
                    setBiData(null);
                    setNifData(null);
                  }}
                >
                  <Plus size={18} className="mr-2 inline" />
                  Novo Cadastro
                </button>
              </div>

              {modoBusca ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Buscar Produtor Existente</h4>

                  {loadingProdutores ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="animate-spin w-6 h-6 text-blue-600 mr-2" />
                      <span className="text-gray-600">Carregando produtores...</span>
                    </div>
                  ) : (
                    <CustomInput
                      type="select"
                      label="Selecionar Produtor"
                      value=""
                      options={produtoresOptions}
                      onChange={(value) => buscarProdutor(value)}
                      placeholder="Selecione um produtor existente"
                      iconStart={<Search size={18} />}
                      errorMessage={errors.produtorSelecionado}
                    />
                  )}

                  {produtorSelecionado && (
                    <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <h5 className="font-semibold text-green-800">Produtor Selecionado</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Nome:</strong> {formData.nomeCompleto}</div>
                        <div><strong>BI:</strong> {formData.bi}</div>
                        <div><strong>Telefone:</strong> {formData.telefone}</div>
                        <div><strong>Localização:</strong> {formData.provincia} - {formData.municipio}</div>
                        <div><strong>Área Total:</strong> {formData.areaTotalExplorada} ha</div>
                        <div><strong>Atividade:</strong> {formData.atividadePrincipal}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Novo Produtor</h4>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-700 text-sm">
                      <Info size={18} className="inline mr-2" />
                      Selecione o tipo de documento e preencha o número para consulta automática dos dados.
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <CustomInput
                      type="text"
                      label="Nome Completo"
                      value={formData.nomeCompleto}
                      onChange={(value) => handleInputChange('nomeCompleto', value)}
                      required
                      errorMessage={errors.nomeCompleto}
                      placeholder="Digite o nome completo"
                      iconStart={<User size={18} />}
                    />

                    {/* Seleção de Tipo de Documento */}
                    <CustomInput
                      type="select"
                      label="Tipo de Documento"
                      value={tipoDocumento ? { label: tipoDocumento === 'BI' ? 'Bilhete de Identidade' : 'NIF', value: tipoDocumento } : null}
                      options={[
                        { label: 'Bilhete de Identidade', value: 'BI' },
                        { label: 'NIF', value: 'NIF' }
                      ]}
                      onChange={(value) => handleTipoDocumentoChange(typeof value === 'object' ? value.value : value)}
                      placeholder="Selecione o tipo de documento"
                      iconStart={<FileText size={18} />}
                    />

                    {/* Campos Condicionais */}
                    {tipoDocumento === 'BI' && (
                      <div className="space-y-4">
                        <div className="relative">
                          <CustomInput
                            type="text"
                            label="Número do Bilhete de Identidade"
                            value={numeroBI}
                            onChange={handleBIChange}
                            placeholder="Digite o número do BI"
                            iconStart={<CreditCard size={18} />}
                            helperText="A consulta será feita automaticamente"
                          />
                          {consultingBI && (
                            <div className="absolute right-3 top-9">
                              <Loader className="animate-spin w-5 h-5 text-blue-600" />
                            </div>
                          )}
                        </div>

                        {/* Dados do BI Consultado */}
                        {biData && (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <h6 className="font-semibold text-green-800">Dados do BI Consultado</h6>
                              </div>
                              <button
                                onClick={limparDadosConsultados}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Limpar dados e preencher manualmente"
                              >
                                <X size={18} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div><strong>Nome:</strong> {biData.first_name} {biData.last_name}</div>
                              <div><strong>Data Nascimento:</strong> {biData.birth_date}</div>
                              <div><strong>Sexo:</strong> {biData.gender_name}</div>
                              <div><strong>Província Nascimento:</strong> {biData.birth_province_name}</div>
                              <div><strong>Estado Civil:</strong> {biData.marital_status_name}</div>
                              <div><strong>Contacto:</strong> Incluído nos dados</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {tipoDocumento === 'NIF' && (
                      <div className="space-y-4">
                        <div className="relative">
                          <CustomInput
                            type="text"
                            label="Número do NIF"
                            value={numeroNIF}
                            onChange={handleNIFChange}
                            placeholder="Digite o número do NIF"
                            iconStart={<FileText size={18} />}
                            helperText="A consulta será feita automaticamente"
                          />
                          {consultingNif && (
                            <div className="absolute right-3 top-9">
                              <Loader className="animate-spin w-5 h-5 text-blue-600" />
                            </div>
                          )}
                        </div>

                        {/* Dados do NIF Consultado */}
                        {/*nifData && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                                <h6 className="font-semibold text-blue-800">Dados do NIF Consultado</h6>
                              </div>
                              <button
                                onClick={limparDadosConsultados}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Limpar dados e preencher manualmente"
                              >
                                <X size={18} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div><strong>Nome Contribuinte:</strong> {nifData.nome_contribuinte}</div>
                              <div><strong>Email:</strong> {nifData.email || 'Não informado'}</div>
                              <div><strong>Contacto:</strong> {nifData.numero_contacto || 'Não informado'}</div>
                              <div><strong>Proprietário/Instituição:</strong> {nifData.nome_contribuinte}</div>
                            </div>
                          </div>
                        )*/}
                      </div>
                    )}
                  </div>


                </div>
              )}
            </div>
          </div>
        );

      case 1: // Dados Pessoais
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dados Pessoais do Produtor</h3>
              </div>
              <p className="text-gray-600">
                Complete ou verifique as informações pessoais do produtor.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CustomInput
                  type="text"
                  label="Nome Completo"
                  value={formData.nomeCompleto}
                  onChange={(value) => handleInputChange('nomeCompleto', value)}
                  required
                  errorMessage={errors.nomeCompleto}
                  disabled={produtorSelecionado !== null}
                  placeholder="Digite o nome completo"
                  iconStart={<User size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Nº do Bilhete de Identidade"
                  value={formData.bi}
                  onChange={(value) => handleInputChange('bi', value)}
                  required
                  errorMessage={errors.bi}
                  disabled={produtorSelecionado !== null}
                  placeholder="Digite o número do BI"
                  iconStart={<CreditCard size={18} />}
                />

                <CustomInput
                  type="tel"
                  label="Contacto Telefónico"
                  value={formData.telefone}
                  onChange={(value) => handleInputChange('telefone', value)}
                  required
                  errorMessage={errors.telefone}
                  disabled={produtorSelecionado !== null}
                  placeholder="Ex: 923456789"
                  iconStart={<Phone size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Província"
                  value={formData.provincia ? { label: formData.provincia, value: formData.provincia } : null}
                  options={provinciasData.map(provincia => ({
                    label: provincia.nome,
                    value: provincia.nome
                  }))}
                  onChange={(value) => handleProvinciaChange(value)}
                  required
                  errorMessage={errors.provincia}
                  disabled={produtorSelecionado !== null}
                  placeholder="Selecione a província"
                  iconStart={<MapPin size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Município"
                  value={formData.municipio ? { label: formData.municipio, value: formData.municipio } : null}
                  options={municipiosOptions}
                  onChange={(value) => handleInputChange('municipio', typeof value === 'object' ? value.value : value)}
                  required
                  errorMessage={errors.municipio}
                  disabled={produtorSelecionado !== null || !formData.provincia}
                  placeholder="Selecione o município"
                  iconStart={<Map size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Comuna"
                  value={formData.comuna}
                  onChange={(value) => handleInputChange('comuna', value)}
                  placeholder="Digite a comuna"
                  iconStart={<Building size={18} />}
                  disabled={produtorSelecionado !== null}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Dados da Exploração
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Tractor className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dados da Exploração Agrícola/Pecuária</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre a propriedade e área de exploração do produtor.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  type="text"
                  label="Nome da Propriedade"
                  value={formData.nomePropriedade}
                  onChange={(value) => handleInputChange('nomePropriedade', value)}
                  placeholder="Nome da fazenda/propriedade (se aplicável)"
                  iconStart={<Home size={18} />}
                  helperText="Campo opcional"
                />

                <CustomInput
                  type="text"
                  label="Localização Geográfica"
                  value={formData.localizacaoGeografica}
                  onChange={(value) => handleInputChange('localizacaoGeografica', value)}
                  required
                  errorMessage={errors.localizacaoGeografica}
                  placeholder="Coordenadas GPS ou ponto de referência"
                  iconStart={<MapPin size={18} />}
                />

                <CustomInput
                  type="number"
                  label="Área Total Explorada (hectares)"
                  value={formData.areaTotalExplorada}
                  onChange={(value) => handleInputChange('areaTotalExplorada', value)}
                  required
                  errorMessage={errors.areaTotalExplorada}
                  placeholder="0.0"
                  iconStart={<Tractor size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Actividade Principal"
                  value={formData.atividadePrincipal ? {
                    label:
                      formData.atividadePrincipal === 'AGRICULTURA' ? 'Agricultura' :
                        formData.atividadePrincipal === 'PECUARIA' ? 'Pecuária' :
                          formData.atividadePrincipal === 'MISTA' ? 'Mista (Agricultura + Pecuária)' :
                            formData.atividadePrincipal
                    , value: formData.atividadePrincipal
                  } : null}
                  options={[
                    { label: 'Agricultura', value: 'AGRICULTURA' },
                    { label: 'Pecuária', value: 'PECUARIA' },
                    { label: 'Mista (Agricultura + Pecuária)', value: 'MISTA' }
                  ]}
                  onChange={(value) => handleInputChange('atividadePrincipal', typeof value === 'object' ? value.value : value)}
                  required
                  errorMessage={errors.atividadePrincipal}
                  placeholder="Selecione a atividade principal"
                  iconStart={<Wheat size={18} />}
                />

                <div className="md:col-span-2">
                  <CustomInput
                    type="text"
                    label="Coordenadas GPS"
                    value={formData.coordenadasGPS}
                    onChange={(value) => handleInputChange('coordenadasGPS', value)}
                    errorMessage={errors.coordenadasGPS}
                    placeholder="Ex: -8.838333, 13.234444"
                    iconStart={<MapPin size={18} />}
                    helperText="Formato: latitude, longitude"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Produção Agrícola
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wheat className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Detalhamento da Produção Agrícola</h3>
              </div>
              <p className="text-gray-600">
                Registre o histórico de produção agrícola dos últimos anos.
              </p>
            </div>

            {/* Exibir erro geral de produção agrícola */}
            {errors.producaoAgricola && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.producaoAgricola}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Histórico de Produção Agrícola</h4>
                <button
                  onClick={adicionarProducaoAgricola}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Anexar Produção
                </button>
              </div>

              {producaoAgricola.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Ano</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Produto Agrícola</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Espécie/Variedade</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Área Cultivada (ha)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Produção (ton)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Modo de Produção</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Meios Disponíveis</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Observações</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {producaoAgricola.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.ano}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'ano', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              min="2000"
                              max="2030"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.produto}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'produto', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${errors[`producaoAgricola_${index}_produto`]
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                }`}
                            >
                              <option value="">Selecione...</option>
                              <option value="MILHO">Milho</option>
                              <option value="MANDIOCA">Mandioca</option>
                              <option value="FEIJAO">Feijão</option>
                              <option value="ARROZ">Arroz</option>
                              <option value="BATATA_DOCE">Batata-doce</option>
                              <option value="BANANA">Banana</option>
                              <option value="CAFE">Café</option>
                              <option value="TOMATE">Tomate</option>
                              <option value="CEBOLA">Cebola</option>
                              <option value="OUTROS">Outros</option>
                            </select>
                            {errors[`producaoAgricola_${index}_produto`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`producaoAgricola_${index}_produto`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.especieVariedade}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'especieVariedade', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Variedade..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.areaCultivada}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'areaCultivada', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${errors[`producaoAgricola_${index}_area`]
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                }`}
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                            {errors[`producaoAgricola_${index}_area`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`producaoAgricola_${index}_area`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.producao}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'producao', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${errors[`producaoAgricola_${index}_producao`]
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                }`}
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                            {errors[`producaoAgricola_${index}_producao`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`producaoAgricola_${index}_producao`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.modoProducao}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'modoProducao', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="TRADICIONAL">Tradicional</option>
                              <option value="SEMI_INTENSIVO">Semi-intensivo</option>
                              <option value="INTENSIVO">Intensivo</option>
                              <option value="AGROECOLOGICO">Agroecológico</option>
                              <option value="ORGANICO">Orgânico</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.meiosDisponiveis}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'meiosDisponiveis', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Ex: Enxada, Trator..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <textarea
                              value={item.observacoes}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'observacoes', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                              rows="2"
                              placeholder="Observações..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerProducaoAgricola(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover linha"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Wheat size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhuma produção agrícola registrada</p>
                  <p className="text-sm">Clique em "Adicionar Produção" para começar</p>
                </div>
              )}

              {producaoAgricola.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Resumo da Produção Agrícola</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-blue-600">
                        {producaoAgricola.reduce((acc, item) => acc + (parseFloat(item.areaCultivada) || 0), 0).toFixed(1)}
                      </span>
                      <span className="text-gray-600">Total Área (ha)</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-green-600">
                        {producaoAgricola.reduce((acc, item) => acc + (parseFloat(item.producao) || 0), 0).toFixed(1)}
                      </span>
                      <span className="text-gray-600">Total Produção (ton)</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-purple-600">
                        {producaoAgricola.length}
                      </span>
                      <span className="text-gray-600">Registros</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Produção Pecuária
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Fish className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Detalhamento da Produção Pecuária</h3>
              </div>
              <p className="text-gray-600">
                Registre o histórico de produção pecuária dos últimos anos.
              </p>
            </div>

            {/* Exibir erro geral de produção pecuária */}
            {errors.producaoPecuaria && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.producaoPecuaria}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Histórico de Produção Pecuária</h4>
                <button
                  onClick={adicionarProducaoPecuaria}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Anexar Produção
                </button>
              </div>

              {producaoPecuaria.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Ano</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Espécie Pecuária</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Raça/Variedade</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Nº de Cabeças</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Produção</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Observações</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {producaoPecuaria.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.ano}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'ano', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              min="2000"
                              max="2030"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.especie}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'especie', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${errors[`producaoPecuaria_${index}_especie`]
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                }`}
                            >
                              <option value="">Selecione...</option>
                              <option value="BOVINO">Bovino</option>
                              <option value="SUINO">Suíno</option>
                              <option value="CAPRINO">Caprino</option>
                              <option value="OVINO">Ovino</option>
                              <option value="AVES">Aves</option>
                              <option value="PEIXES">Peixes</option>
                              <option value="COELHOS">Coelhos</option>
                              <option value="OUTROS">Outros</option>
                            </select>
                            {errors[`producaoPecuaria_${index}_especie`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`producaoPecuaria_${index}_especie`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.racaVariedade}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'racaVariedade', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Raça/Variedade..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.numeroCabecas}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'numeroCabecas', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${errors[`producaoPecuaria_${index}_cabecas`]
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                }`}
                              min="0"
                              placeholder="0"
                            />
                            {errors[`producaoPecuaria_${index}_cabecas`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`producaoPecuaria_${index}_cabecas`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.producao}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'producao', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Ex: 500kg carne, 200L leite..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <textarea
                              value={item.observacoes}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'observacoes', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                              rows="2"
                              placeholder="Observações..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerProducaoPecuaria(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover linha"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Fish size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhuma produção pecuária registrada</p>
                  <p className="text-sm">Clique em "Adicionar Produção" para começar</p>
                </div>
              )}

              {producaoPecuaria.length > 0 && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-semibold text-orange-800 mb-2">Resumo da Produção Pecuária</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-orange-600">
                        {producaoPecuaria.reduce((acc, item) => acc + (parseInt(item.numeroCabecas) || 0), 0)}
                      </span>
                      <span className="text-gray-600">Total Cabeças</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-red-600">
                        {new Set(producaoPecuaria.map(item => item.especie).filter(Boolean)).size}
                      </span>
                      <span className="text-gray-600">Espécies Diferentes</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-purple-600">
                        {producaoPecuaria.length}
                      </span>
                      <span className="text-gray-600">Registros</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5: // Vistorias
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ClipboardCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Vistorías e Acompanhamento Técnico</h3>
              </div>
              <p className="text-gray-600">
                Registre as vistorias técnicas realizadas na propriedade.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Histórico de Vistorías</h4>
                <button
                  onClick={adicionarVistoria}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Adicionar Vistoría
                </button>
              </div>

              {vistorias.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Data da Visita</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Técnico Responsável</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Observações Técnicas</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Assinatura</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vistorias.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="date"
                              value={item.data}
                              onChange={(e) => atualizarVistoria(item.id, 'data', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${errors[`vistoria_${index}_data`]
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                }`}
                            />
                            {errors[`vistoria_${index}_data`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`vistoria_${index}_data`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.tecnico}
                              onChange={(e) => atualizarVistoria(item.id, 'tecnico', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${errors[`vistoria_${index}_tecnico`]
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                }`}
                              placeholder="Nome do técnico..."
                            />
                            {errors[`vistoria_${index}_tecnico`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`vistoria_${index}_tecnico`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <textarea
                              value={item.observacoes}
                              onChange={(e) => atualizarVistoria(item.id, 'observacoes', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                              rows="3"
                              placeholder="Observações técnicas..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.assinatura}
                              onChange={(e) => atualizarVistoria(item.id, 'assinatura', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Assinatura do técnico..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerVistoria(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover vistoria"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ClipboardCheck size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhuma vistoria registrada</p>
                  <p className="text-sm">Clique em "Adicionar Vistoria" para começar</p>
                </div>
              )}
            </div>
          </div>
        );

      case 6: // Certificação
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Certificado de Produtor Agrícola e Pecuário</h3>
              </div>
              <p className="text-gray-600">
                Complete as informações finais para emissão do certificado.
              </p>
            </div>

            {/* Exibir erro geral de produção */}
            {errors.producaoGeral && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.producaoGeral}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Finalidade do Certificado */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Finalidade do Certificado</h4>
                <p className="text-gray-600 mb-4">Selecione para que fim o certificado será utilizado:</p>
                <CustomInput
                  type="multiselect"
                  label="Finalidade do Certificado"
                  value={formData.finalidadeCertificado}
                  options={[
                    { label: 'Obtenção de Crédito Agrícola', value: 'CREDITO_AGRICOLA' },
                    { label: 'Contratação de Seguro Agrícola', value: 'SEGURO_AGRICOLA' },
                    { label: 'Reconhecimento como Produtor Formal', value: 'PRODUTOR_FORMAL' },
                    { label: 'Participação em Programas Governamentais', value: 'PROGRAMAS_GOVERNAMENTAIS' },
                    { label: 'Outras finalidades', value: 'OUTRAS' }
                  ]}
                  onChange={(value) => handleInputChange('finalidadeCertificado', value)}
                  errorMessage={errors.finalidadeCertificado}
                />
              </div>

              {/* Período de Validade */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Período de Validade</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="date"
                    label="Válido de"
                    value={formData.validadeInicio}
                    onChange={(value) => handleInputChange('validadeInicio', value)}
                    required
                    errorMessage={errors.validadeInicio}
                    iconStart={<Calendar size={18} />}
                  />
                  <CustomInput
                    type="date"
                    label="Válido até"
                    value={formData.validadeFim}
                    onChange={(value) => handleInputChange('validadeFim', value)}
                    required
                    errorMessage={errors.validadeFim}
                    iconStart={<Calendar size={18} />}
                  />
                </div>
              </div>

              {/* Informações Técnicas */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Informações Técnicas</h4>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <CustomInput
                    type="text"
                    label="Técnico Responsável"
                    value={formData.tecnicoResponsavel}
                    onChange={(value) => handleInputChange('tecnicoResponsavel', value)}
                    required
                    errorMessage={errors.tecnicoResponsavel}
                    placeholder="Nome do técnico responsável"
                    iconStart={<User size={18} />}
                  />
                </div>
                <div className="mt-4">
                  <CustomInput
                    type="textarea"
                    label="Observações Técnicas"
                    value={formData.observacoesTecnicas}
                    onChange={(value) => handleInputChange('observacoesTecnicas', value)}
                    placeholder="Observações sobre a atividade produtiva do certificado..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Alerta se não há produção registrada */}
              {producaoAgricola.length === 0 && producaoPecuaria.length === 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-yellow-800">
                    <AlertCircle size={16} className="mr-2" />
                    <span className="text-sm font-medium">Atenção: Nenhuma produção registrada</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    Para um certificado válido, é necessário ter pelo menos uma produção registrada (agrícola ou pecuária).
                  </p>
                </div>
              )}

              {/* Preview do Certificado */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Preview do Certificado</h4>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center">
                    <Eye size={18} className="mr-2" />
                    Visualizar Completo
                  </button>
                </div>

                <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                  {/* Cabeçalho do certificado */}
                  <div className="text-center mb-6 border-b-2 border-gray-400 pb-4">
                    <div className="text-xs font-bold mb-1">REPÚBLICA DE ANGOLA</div>
                    <div className="text-xs font-bold mb-1">MINISTÉRIO DA AGRICULTURA E FLORESTAS</div>
                    <div className="text-xs font-bold mb-1">INSTITUTO DE DESENVOLVIMENTO AGRÁRIO</div>
                    <div className="text-xs font-bold mb-3">SISTEMA NACIONAL DE CADASTRO DE PRODUTORES AGROPECUÁRIOS</div>
                    <div className="text-sm font-bold underline mb-2">CERTIFICADO DE VALIDAÇÃO DA PRODUÇÃO AGRÍCOLA</div>
                  </div>

                  {/* Número do certificado */}
                  <div className="text-right mb-4">
                    <span className="text-xs font-bold">N.º: ____/2025</span>
                  </div>

                  {/* Texto principal */}
                  <div className="text-xs mb-4 text-justify">
                    Serve o presente certificado para atestar, junto das entidades solicitantes, que no período agrícola de
                    <strong> 2020 a 2025</strong>, o(a) agricultor(a) abaixo identificado(a):
                  </div>

                  {/* Dados do agricultor */}
                  <div className="border border-gray-400 p-3 mb-4 bg-gray-100">
                    <div className="text-center font-bold text-xs mb-2">DADOS DO AGRICULTOR</div>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div><strong>Nome:</strong> {getDisplayValue(formData.nomeCompleto) || '[Nome do Produtor]'}</div>
                      <div><strong>N.º do BI:</strong> {getDisplayValue(formData.bi) || '[Número do BI]'}</div>
                      <div><strong>ID de Produtor:</strong> {getDisplayValue(formData.numeroProcesso) || '[Número do Processo]'}</div>
                      <div><strong>Comuna:</strong> {getDisplayValue(formData.comuna) || '[Comuna]'}</div>
                      <div><strong>Município:</strong> {getDisplayValue(formData.municipio) || '[Município]'}</div>
                      <div><strong>Província:</strong> {getDisplayValue(formData.provincia) || '[Província]'}</div>
                    </div>
                  </div>

                  {/* Texto de validação */}
                  <div className="text-xs mb-4 text-justify">
                    Após verificação técnica e validação in loco, certificamos que o(a) referido(a) agricultor(a) realizou
                    produção agrícola conforme os dados apresentados neste certificado.
                  </div>

                  {/* Tabela de produção (resumida) */}
                  <div className="border border-gray-400 mb-4">
                    <div className="bg-gray-200 p-2 text-center font-bold text-xs">DADOS DA PRODUÇÃO VALIDADA</div>
                    {producaoAgricola.length > 0 ? (
                      <div className="p-2">
                        <div className="text-xs">
                          <strong>Produções registradas:</strong> {producaoAgricola.length}
                        </div>
                        <div className="text-xs">
                          <strong>Área total cultivada:</strong> {producaoAgricola.reduce((acc, item) => acc + (parseFloat(item.areaCultivada) || 0), 0).toFixed(1)} ha
                        </div>
                        <div className="text-xs">
                          <strong>Produção total:</strong> {producaoAgricola.reduce((acc, item) => acc + (parseFloat(item.producao) || 0), 0).toFixed(1)} ton
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 text-xs text-gray-600">Nenhuma produção registrada</div>
                    )}
                  </div>

                  {/* Modo de produção */}
                  <div className="border border-gray-400 p-2 mb-4">
                    <div className="text-xs font-bold mb-1">Modo de Produção:</div>
                    <div className="text-xs">
                      ☐ Tradicional  ☐ Semi-Mecanizado  ☐ Mecanizado  ☐ Agroecológico  ☐ Convencional
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="border border-gray-400 p-2 mb-4">
                    <div className="text-xs font-bold mb-1">Observações Técnicas:</div>
                    <div className="text-xs">
                      {getDisplayValue(formData.observacoesTecnicas) || 'Produtor apresenta atividade agrícola regular e contínua conforme verificação técnica realizada.'}
                    </div>
                  </div>

                  {/* Validação */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div><strong>Emitido em:</strong> {formatDate(new Date())}</div>
                      <div><strong>Local:</strong> {getDisplayValue(formData.municipio) || '[Município]'}, {getDisplayValue(formData.provincia) || '[Província]'}</div>
                    </div>
                    <div>
                      <div><strong>Técnico Validador:</strong></div>
                      <div>{getDisplayValue(formData.tecnicoResponsavel) || '[Nome do Técnico]'}</div>
                      <div className="border-b border-gray-400 mt-2"></div>
                      <div className="mt-2"><strong>Assinatura:</strong></div>
                      <div className="border-b border-gray-400 mt-2"></div>
                    </div>
                  </div>

                  <div className="text-center mt-4 text-xs font-bold">
                    CARIMBO DA INSTITUIÇÃO
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Etapa não encontrada</div>;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Validação final antes de submeter
      if (!validateCurrentStep()) {
        setLoading(false);
        showToast('error', 'Validação', 'Por favor, corrija os erros antes de gerar o certificado.');
        return;
      }

      // Validações básicas
      const camposObrigatorios = [
        { campo: 'nomeCompleto', nome: 'Nome Completo' },
        { campo: 'bi', nome: 'Bilhete de Identidade' },
        { campo: 'telefone', nome: 'Telefone' },
        { campo: 'provincia', nome: 'Província' },
        { campo: 'municipio', nome: 'Município' },
        { campo: 'areaTotalExplorada', nome: 'Área Total Explorada' },
        { campo: 'atividadePrincipal', nome: 'Atividade Principal' },
        { campo: 'tecnicoResponsavel', nome: 'Técnico Responsável' }
      ];

      const camposVazios = camposObrigatorios.filter(({ campo }) => {
        const valor = getDisplayValue(formData[campo]);
        return !valor || valor.trim() === '';
      });

      if (camposVazios.length > 0) {
        const mensagem = `Campos obrigatórios não preenchidos: ${camposVazios.map(c => c.nome).join(', ')}`;
        setLoading(false);
        showToast('error', 'Validação', mensagem);
        return;
      }

      // Importar a função de geração de certificado
      const { gerarCertificadoValidacao } = await import('../../pages/public/CertificadoGenerator');

      // Preparar dados para o certificado
      const dadosCertificado = {
        dadosProdutor: {
          ...formData,
          provincia: getDisplayValue(formData.provincia),
          municipio: getDisplayValue(formData.municipio),
          atividadePrincipal: getDisplayValue(formData.atividadePrincipal),
          // Garantir que campos essenciais estejam preenchidos
          numeroProcesso: formData.numeroProcesso || `CERT-${Date.now()}`,
          tecnicoResponsavel: formData.tecnicoResponsavel || 'Técnico Responsável'
        },
        producaoAgricola,
        producaoPecuaria,
        vistorias,
        produtorOriginal: produtorSelecionado
      };

      console.log("📄 Gerando certificado com dados:", dadosCertificado);

      // Gerar certificado PDF
      const resultado = await gerarCertificadoValidacao(dadosCertificado);

      console.log("✅ Certificado gerado:", resultado);

      setLoading(false);
      showToast('success', 'Sucesso', 'Certificado de Validação da Produção Agrícola gerado com sucesso!');

    } catch (error) {
      setLoading(false);
      console.error('Erro ao gerar certificado:', error);
      showToast('error', 'Erro', `Erro ao gerar certificado: ${error.message}`);
    }
  };

  const isLastStep = activeIndex === steps.length - 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
          toastMessage.severity === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
            toastMessage.severity === 'warn' ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' :
              'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
          }`}>
          <div className="flex items-center">
            <div className="mr-3">
              {toastMessage.severity === 'success' && <CheckCircle size={20} />}
              {toastMessage.severity === 'error' && <AlertCircle size={20} />}
              {toastMessage.severity === 'warn' && <AlertCircle size={20} />}
              {toastMessage.severity === 'info' && <Info size={20} />}
            </div>
            <div>
              <p className="font-bold">{toastMessage.summary}</p>
              <p className="text-sm">{toastMessage.detail}</p>
            </div>
          </div>
        </div>
      )}

      <div className="">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-orange-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Certificação de Produtor</h1>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${index > activeIndex ? 'opacity-50' : ''
                    }`}
                  onClick={() => index <= activeIndex && setActiveIndex(index)}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${index < activeIndex ? 'bg-gradient-to-r from-blue-50 to-orange-50 text-slate' :
                    index === activeIndex ? 'bg-gradient-to-r from-blue-200 to-orange-100 text-slate-600 shadow-lg' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                    {index < activeIndex ? (
                      <Check size={24} />
                    ) : (
                      <StepIcon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${index === activeIndex ? 'text-slate-700' : 'text-gray-500'
                    }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
            <div
              className="bg-gradient-to-r from-blue-200 to-orange-50 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          {/* Step Content */}
          <div className="step-content p-8 bg-white min-h-[600px]">
            {renderStepContent(activeIndex)}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
            <button
              className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                }`}
              onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activeIndex === 0}
            >
              <ChevronLeft size={20} className="mr-2" />
              Anterior
            </button>

            <div className="text-sm text-gray-500 font-medium">
              Etapa {activeIndex + 1} de {steps.length}
            </div>

            <button
              className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${isLastStep
                ? 'bg-gradient-to-r from-blue-50 to-orange-50 hover:bg-blue-700 text-slate shadow-lg'
                : 'bg-gradient-to-r from-blue-50 to-orange-50 hover:bg-blue-700 text-slate shadow-lg'
                }`}
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                if (!isLastStep) {
                  // Validar antes de avançar
                  if (validateCurrentStep()) {
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                    setActiveIndex(prev => prev + 1);
                  } else {
                    showToast('error', 'Validação', 'Por favor, corrija os erros antes de continuar.');
                  }
                } else {
                  // Última etapa - submeter formulário
                  if (validateCurrentStep()) {
                    handleSubmit(e);
                  } else {
                    showToast('error', 'Validação', 'Por favor, corrija os erros antes de gerar o certificado.');
                  }
                }
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Gerando Certificado...
                </>
              ) : isLastStep ? (
                <>
                  <Award size={20} className="mr-2" />
                  Gerar Certificado
                </>
              ) : (
                <>
                  <span className="mr-2">Próximo</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificacaoProdutor;