import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode'; // QR CODE IMPORT ADICIONADO
import { useEffect, useState } from 'react';

import emblema from '../../assets/emblema.png';
import { default as fotoC, default as logo } from '../../assets/SIGAF.png';
import api from '../../core/services/api';

// Estilos organizados com alinhamentos aperfeiçoados e cores uniformizadas
const styles = StyleSheet.create({
  // Layout geral
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    position: 'relative'
  },

  // Marca d'água (emblema de fundo)
  logoFundo: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: 280,
    height: 280,
    opacity: 0.05,
    transform: 'translate(-50%, -50%)',
    zIndex: 0
  },

  // Container do conteúdo
  content: {
    position: 'relative',
    zIndex: 1
  },

  // Cabeçalho
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  logo: {
    fontSize: 8,
    marginBottom: 3,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  titleRepublica: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'center',
    textDecoration: 'underline'
  },

  // Informações do topo
  topInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: '#333',
    paddingBottom: 10
  },
  numeroRegistro: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333'
  },

  // Seções
  section: {
    marginBottom: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd'
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 0,
    textTransform: 'uppercase',
    backgroundColor: '#e8e8e8',
    padding: 8,
    color: '#333'
  },
  sectionContent: {
    padding: 10
  },

  // Layout de linhas e colunas - MELHORADO
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start'
  },

  // Layout específico para identificação com foto
  identificacaoLayout: {
    flexDirection: 'row',
    gap: 15
  },
  fotoContainer: {
    width: '25%',
    alignItems: 'center'
  },
  dadosContainer: {
    width: '75%'
  },

  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15
  },
  threeColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  column: {
    width: '48%'
  },
  columnThird: {
    width: '32%'
  },

  // Foto do produtor
  fotoProdutorContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  fotoProdutor: {
    width: 80,
    height: 100,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    objectFit: 'cover'
  },
  fotoLabel: {
    fontSize: 8,
    color: '#666',
    marginTop: 5,
    textAlign: 'center'
  },
  fotoPlaceholder: {
    width: 80,
    height: 100,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Texto - ALINHAMENTOS APERFEIÇOADOS
  label: {
    fontWeight: 'bold',
    width: '45%',
    fontSize: 9,
    color: '#444',
    textAlign: 'left',
    paddingRight: 5
  },
  value: {
    width: '55%',
    fontSize: 9,
    color: '#000',
    textAlign: 'left',
    paddingLeft: 5
  },
  labelFull: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#444',
    marginBottom: 3
  },
  valueFull: {
    fontSize: 9,
    color: '#000',
    marginBottom: 6,
    paddingLeft: 10
  },

  // Seções especiais
  coordenadas: {
    backgroundColor: '#f8f8f8',
    padding: 8,
    marginTop: 8
  },

  // Estilos específicos para histórico de produção - UNIFORMIZADOS
  historicoHeader: {
    backgroundColor: '#e8e8e8',
    color: '#333',
    padding: 10,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd'
  },

  registroItem: {
    marginBottom: 15,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd',
    backgroundColor: '#fafafa'
  },

  registroHeader: {
    backgroundColor: '#e8e8e8',
    color: '#333',
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#ddd'
  },

  subSecao: {
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    borderLeftColor: '#ccc',
    paddingLeft: 8
  },

  subSecaoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textTransform: 'uppercase'
  },

  culturaItem: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd'
  },

  animalItem: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd'
  },

  itemHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },

  // Rodapé
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#ccc',
    paddingTop: 10
  }
});

// Funções utilitárias aperfeiçoadas
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// NOVA FUNÇÃO PARA GERAR QR CODE DO PRODUTOR
const gerarQRCodeProdutor = async (dados) => {
  try {
    const numeroRegistro = dados?.numeroRegistro || 'RNPA000000';

    // Dados que serão codificados no QR Code
    const dadosQR = {
      registro: numeroRegistro,
      nome: dados?.nome || '',
      bi: dados?.bi || '',
      telefone: dados?.telefone || '',
      provincia: dados?.provincia || '',
      municipio: dados?.municipio || '',
      dataRegistro: formatDate(dados?.dataRegistro) || formatDate(new Date()),
      verificacao: `https://rnpa.gov.ao/verificar/${numeroRegistro}`,
      // Informações adicionais do agregado
      totalAgregados: dados?.numeroAgregados || 0,
      atividades: dados?.atividades || '',
      chefeAgregado: dados?.chefeAgregado ? 'Sim' : 'Não'
    };

    // Converter para string formatada
    const dadosString = `Registro RNPA: ${dadosQR.registro}
Nome: ${dadosQR.nome}
BI: ${dadosQR.bi}
Telefone: ${dadosQR.telefone}
Província: ${dadosQR.provincia}
Município: ${dadosQR.municipio}
Registrado em: ${dadosQR.dataRegistro}
Total Agregados: ${dadosQR.totalAgregados}
Atividades: ${dadosQR.atividades}
Verificar: ${dadosQR.verificacao}`;

    // Gerar QR Code como base64
    const qrCodeDataURL = await QRCode.toDataURL(dadosString, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Erro ao gerar QR Code do produtor:', error);
    return null;
  }
};

// Função para formatar unidade de medida
const formatUnidadeMedida = (unidade) => {
  const unidades = {
    'sacos_50kg': 'Sacos 50kg',
    'sacos_25kg': 'Sacos 25kg',
    'toneladas': 'Toneladas',
    'quilos': 'Quilos',
    'litros': 'Litros'
  };
  return unidades[unidade] || unidade;
};

// Função para formatar modo de produção
const formatModoProducao = (modo) => {
  const modos = {
    'manual': 'Manual',
    'mecanizada': 'Mecanizada',
    'tracao_animal': 'Tração Animal',
    'mista': 'Mista'
  };
  return modos[modo] || modo;
};

// Função para formatar sistema de produção
const formatSistemaProducao = (sistema) => {
  const sistemas = {
    'extensivo': 'Extensivo',
    'semi_intensivo': 'Semi-intensivo',
    'intensivo': 'Intensivo',
    'tradicional': 'Tradicional'
  };
  return sistemas[sistema] || sistema;
};

// Função para formatar cultura
const formatCultura = (cultura) => {
  const culturas = {
    'milho': 'Milho',
    'mandioca': 'Mandioca',
    'amendoim': 'Amendoim/Ginguba',
    'feijao': 'Feijão',
    'batata_doce': 'Batata-doce',
    'banana': 'Banana',
    'massambla': 'Massambla',
    'massango': 'Massango',
    'cafe': 'Café',
    'cebola': 'Cebola',
    'tomate': 'Tomate',
    'couve': 'Couve',
    'batata_rena': 'Batata Rena',
    'trigo': 'Trigo',
    'arroz': 'Arroz',
    'soja': 'Soja'
  };
  return culturas[cultura] || cultura;
};

// Função para formatar tipo de animal
const formatTipoAnimal = (tipo) => {
  const animais = {
    'avicultura': 'Avicultura',
    'ovinocultura': 'Ovinocultura',
    'piscicultura': 'Piscicultura',
    'aquicultura': 'Aquicultura',
    'caprinocultura': 'Caprinocultura',
    'suinocultura': 'Suinocultura',
    'bovinocultura': 'Bovinocultura'
  };
  return animais[tipo] || tipo;
};

// Função para carregar foto da API
const carregarFotoAPI = async (produtorId) => {
  if (!produtorId) return null;

  try {
    console.log(`Buscando foto para produtor ID: ${produtorId}`);

    const response = await api.get(`/formulario/${produtorId}/foto-beneficiary`, {
      responseType: 'blob',
      timeout: 10000
    });

    if (response.data && response.data.size > 0) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('Foto convertida para base64 com sucesso');
          resolve(reader.result);
        };
        reader.readAsDataURL(response.data);
      });
    } else {
      console.log('Resposta da API não contém dados de imagem');
      return null;
    }
  } catch (error) {
    console.error('Erro ao carregar foto da API:', error);
    return null;
  }
};

// Função para buscar histórico de produção
const buscarHistoricoProducao = async (produtorId) => {
  try {
    console.log(`Buscando histórico de produção para produtor ID: ${produtorId}`);
    const response = await api.get(`/historicoDeProducao/produtores/${produtorId}`);
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar histórico de produção:', error);
    return [];
  }
};

// Função para mapear dados da API para o formato esperado
const mapearDadosAPI = (dadosAPI, fotoAPI = null) => {
  const getFotoURL = (attachments, xpath) => {
    const attachment = attachments?.find(att => att.question_xpath === xpath);
    return attachment?.download_url || null;
  };

  const parseCoordinates = (gpsString) => {
    if (!gpsString) return { latitude: '', longitude: '', altitude: '', precisao: '' };
    const parts = gpsString.split(' ');
    return {
      latitude: parts[0] || '',
      longitude: parts[1] || '',
      altitude: parts[2] || '',
      precisao: parts[3] || ''
    };
  };

  const coords = parseCoordinates(dadosAPI?.gps_coordinates);

  return {
    id: dadosAPI?._id,
    numeroRegistro: `RNPA${dadosAPI?._id}`,
    dataRegistro: dadosAPI?.registration_date,

    // Dados do produtor
    nome: dadosAPI?.beneficiary_name || `${dadosAPI?.nome_produtor || ''} ${dadosAPI?.nome_meio_produtor || ''} ${dadosAPI?.sobrenome_produtor || ''}`.trim(),
    nomeProdutor: dadosAPI?.nome_produtor,
    nomeMeioProdutor: dadosAPI?.nome_meio_produtor,
    sobrenomeProdutor: dadosAPI?.sobrenome_produtor,
    dataNascimento: dadosAPI?.beneficiary_date_of_birth,
    lugarNascimento: dadosAPI?.lugar_nascimento,
    bi: dadosAPI?.beneficiary_id_number,
    genero: dadosAPI?.beneficiary_gender === 'm' ? 'Masculino' : 'Feminino',
    telefone: dadosAPI?.beneficiary_phone_number,
    estadoCivil: dadosAPI?.estado_civil,
    nivelEscolaridade: dadosAPI?.nivel_escolaridade,
    possuiDeficiencia: dadosAPI?.possui_deficiencia === 'sim' ? 'Sim' : 'Não',

    // Localização
    provincia: dadosAPI?.provincia,
    municipio: dadosAPI?.municipio,
    comuna: dadosAPI?.geo_level_4,
    aldeia: dadosAPI?.geo_level_5,
    localResidencia: dadosAPI?.geo_level_6 === 'urbana' ? 'Urbana' : 'Rural',
    latitude: coords?.latitude,
    longitude: coords?.longitude,
    altitude: coords?.altitude,
    precisao: coords?.precisao,

    // Agregado familiar
    chefeAgregado: dadosAPI?.chefe_familiar === 'sim',
    nomeChefeAgregado: dadosAPI?.nome_chefe,
    nomeDoMeioChefe: dadosAPI?.nome_meio_chefe,
    sobrenomeChefe: dadosAPI?.sobrenome_chefe,
    sexoChefe: dadosAPI?.sexo_chefe === 'm' ? 'Masculino' : 'Feminino',
    relacaoChefe: dadosAPI?.relacao_chefe,
    numeroAgregados: dadosAPI?.total_agregado,
    femininoIdade0a6: dadosAPI?.feminino_0_6,
    masculinoIdade0a6: dadosAPI?.masculino_0_6,
    femininoIdade7a18: dadosAPI?.feminino_7_18,
    masculinoIdade7a18: dadosAPI?.masculino_7_18,
    femininoIdade19a60: dadosAPI?.feminino_19_60,
    masculinoIdade19a60: dadosAPI?.masculino_19_60,
    femininoIdade61mais: dadosAPI?.feminino_61_mais,
    masculinoIdade61mais: dadosAPI?.masculino_61_mais,

    // Organização
    tipoOrganizacao: dadosAPI?.tipo_organizacao === '1' ? 'Associação' :
      dadosAPI?.tipo_organizacao === '2' ? 'Cooperativa' : 'Outro',
    nomeECA: dadosAPI?.E_4_Fazes_parte_de_uma_cooper || 'N/A',

    // Inquiridor
    nomeInquiridor: dadosAPI?.nome_inquiridor,
    nomeDoMeioInquiridor: dadosAPI?.nome_meio,
    sobrenomeInquiridor: dadosAPI?.sobrenome_inquiridor,
    codigoInquiridor: dadosAPI?.codigo_inquiridor,

    // Atividades
    atividades: dadosAPI?.atividades_produtor,
    acessoTerra: dadosAPI?.acesso_terra === 'sim' ? 'Sim' : 'Não',
    acessoRacao: dadosAPI?.acesso_racao === 'sim' ? 'Sim' : 'Não',
    conhecimentoDoencas: dadosAPI?.conhecimento_doencas === 'sim' ? 'Sim' : 'Não',
    creditoBeneficio: dadosAPI?.credito_beneficio === 'sim' ? 'Sim' : 'Não',

    // Bens familiares
    bensFamiliares: dadosAPI?.bens_familiares,
    tipoApoio: dadosAPI?.tipo_apoio,

    // URLs das fotos
    fotoAPI: fotoAPI,
    fotoBiometrica: getFotoURL(dadosAPI?._attachments, 'beneficiary_biometrics'),
    fotoNormal: getFotoURL(dadosAPI?._attachments, 'beneficiary_photo'),
    fotoDocumento: getFotoURL(dadosAPI?._attachments, 'foto_documento'),
    fotoAnimais: getFotoURL(dadosAPI?._attachments, 'fotos_animais'),

    // Dados fictícios para completar
    nomePai: `${dadosAPI?.nome_produtor || 'N/A'} (Pai)`,
    nomeMae: `${dadosAPI?.nome_produtor || 'N/A'} (Mãe)`
  };
};

// Hook personalizado para buscar dados do produtor com foto e histórico
const useProdutorComHistorico = (id) => {
  const [dados, setDados] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      if (!id) {
        setError('ID do produtor não fornecido');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Buscando dados do produtor e histórico...');

        // Buscar dados do formulário e histórico em paralelo
        const [produtorResponse, historicoData] = await Promise.all([
          api.get(`/formulario/${id}`),
          buscarHistoricoProducao(id)
        ]);

        console.log('Dados carregados, buscando foto...');

        // Buscar foto da API
        const fotoAPI = await carregarFotoAPI(id);

        // Mapear dados incluindo a foto da API
        const dadosMapeados = mapearDadosAPI(produtorResponse.data, fotoAPI);

        setDados(dadosMapeados);
        setHistorico(historicoData);

      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [id]);

  return { dados, historico, loading, error };
};

// Componente wrapper para páginas com marca d'água
const PageWithWatermark = ({ children, showHeader = false }) => (
  <Page size="A4" style={styles.page}>
    <Image src={logo} style={styles.logoFundo} />
    <View style={styles.content}>
      {showHeader && <HeaderSection />}
      {children}
    </View>
  </Page>
);

// Componente do cabeçalho
const HeaderSection = () => (
  <View style={styles.header}>
    <Image src={emblema} style={{
      width: 60,
      height: 60,
      marginBottom: 10,
      marginLeft: 'auto',
      marginRight: 'auto',
    }} />
    <Text style={styles.logo}>REPÚBLICA DE ANGOLA</Text>
    <Text style={styles.logo}>MINISTÉRIO DA AGRICULTURA E FLORESTAS</Text>
    <Text style={styles.logo}>INSTITUTO DE DESENVOLVIMENTO AGRÁRIO</Text>
    <Text style={styles.logo}>SISTEMA INTEGRADO DE GESTÃO DE AGRO-FLORESTAL</Text>
    <Text style={styles.titleRepublica}>FICHA COMPLETA DO PRODUTOR</Text>
  </View>
);

// Componente das informações do topo
const TopInfoSection = ({ dados }) => (
  <View style={styles.topInfo}>
    <View>
      <Text style={styles.numeroRegistro}>Nº de Registro: {dados?.numeroRegistro || 'N/A'}</Text>
    </View>
    <View>
      <Text style={styles.numeroRegistro}>Data: {formatDate(dados?.dataRegistro) || formatDate(new Date())}</Text>
    </View>
  </View>
);

// Componente da identificação do produtor
const IdentificacaoSection = ({ dados }) => {
  const obterFotoProdutor = () => {
    if (dados?.fotoAPI) {
      return dados.fotoAPI;
    } else if (dados?.fotoNormal) {
      return dados.fotoNormal;
    } else if (dados?.fotoBiometrica) {
      return dados.fotoBiometrica;
    } else {
      return fotoC;
    }
  };

  const fotoProdutor = obterFotoProdutor();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Identificação do Pequeno Produtor</Text>
      <View style={styles.sectionContent}>
        <View style={styles.identificacaoLayout}>
          <View style={styles.fotoContainer}>
            <View style={styles.fotoProdutorContainer}>
              {fotoProdutor ? (
                <Image src={fotoProdutor} style={styles.fotoProdutor} />
              ) : (
                <View style={styles.fotoPlaceholder}>
                  <Text style={{ fontSize: 8, color: '#999' }}>Sem Foto</Text>
                </View>
              )}
              <Text style={styles.fotoLabel}>Foto do Produtor</Text>
            </View>
          </View>

          <View style={styles.dadosContainer}>
            <View style={styles.twoColumn}>
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.label}>Nome Completo:</Text>
                  <Text style={styles.value}>{dados?.nome || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Data de Nascimento:</Text>
                  <Text style={styles.value}>{formatDate(dados?.dataNascimento) || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Lugar de Nascimento:</Text>
                  <Text style={styles.value}>{dados?.lugarNascimento || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Bilhete de Identidade:</Text>
                  <Text style={styles.value}>{dados?.bi || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Gênero:</Text>
                  <Text style={styles.value}>{dados?.genero || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.label}>Telefone:</Text>
                  <Text style={styles.value}>{dados?.telefone || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Estado Civil:</Text>
                  <Text style={styles.value}>{dados?.estadoCivil || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Escolaridade:</Text>
                  <Text style={styles.value}>{dados?.nivelEscolaridade || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Nome do Pai:</Text>
                  <Text style={styles.value}>{dados?.nomePai || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Nome da Mãe:</Text>
                  <Text style={styles.value}>{dados?.nomeMae || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Componente da localização
const LocalizacaoSection = ({ dados }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Localização Geográfica</Text>
    <View style={styles.sectionContent}>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Província:</Text>
            <Text style={styles.value}>{dados?.provincia || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Município:</Text>
            <Text style={styles.value}>{dados?.municipio || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Comuna:</Text>
            <Text style={styles.value}>{dados?.comuna || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Aldeia/Bairro:</Text>
            <Text style={styles.value}>{dados?.aldeia || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Residência:</Text>
            <Text style={styles.value}>{dados?.localResidencia || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.labelFull}>Coordenadas GPS:</Text>
          <View style={styles.coordenadas}>
            <View style={styles.row}>
              <Text style={styles.label}>Latitude:</Text>
              <Text style={styles.value}>{dados?.latitude || 'N/A'}°</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Longitude:</Text>
              <Text style={styles.value}>{dados?.longitude || 'N/A'}°</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Altitude:</Text>
              <Text style={styles.value}>{dados?.altitude || 'N/A'} m</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Precisão:</Text>
              <Text style={styles.value}>{dados?.precisao || 'N/A'} m</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
);

// Componente do agregado familiar
const AgregadoFamiliarSection = ({ dados }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Composição do Agregado Familiar</Text>
    <View style={styles.sectionContent}>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text style={styles.labelFull}>Chefe do Agregado:</Text>
          <Text style={styles.valueFull}>
            {dados?.nomeChefeAgregado || ''} {dados?.nomeDoMeioChefe || ''} {dados?.sobrenomeChefe || ''}
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Gênero do Chefe:</Text>
            <Text style={styles.value}>{dados?.sexoChefe || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Relação:</Text>
            <Text style={styles.value}>{dados?.relacaoChefe || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total de Membros:</Text>
            <Text style={styles.value}>{dados?.numeroAgregados || 'N/A'} pessoas</Text>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.labelFull}>Distribuição por Faixa Etária:</Text>
          <View style={styles.row}>
            <Text style={styles.label}>0 a 6 anos:</Text>
            <Text style={styles.value}>F: {dados?.femininoIdade0a6 || '0'} | M: {dados?.masculinoIdade0a6 || '0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>7 a 18 anos:</Text>
            <Text style={styles.value}>F: {dados?.femininoIdade7a18 || '0'} | M: {dados?.masculinoIdade7a18 || '0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>19 a 60 anos:</Text>
            <Text style={styles.value}>F: {dados?.femininoIdade19a60 || '0'} | M: {dados?.masculinoIdade19a60 || '0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>61+ anos:</Text>
            <Text style={styles.value}>F: {dados?.femininoIdade61mais || '0'} | M: {dados?.masculinoIdade61mais || '0'}</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

// Componente de organização
const OrganizacaoSection = ({ dados }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Organização e Escola de Campo</Text>
    <View style={styles.sectionContent}>
      <View style={styles.row}>
        <Text style={styles.label}>Nome da ECA:</Text>
        <Text style={styles.value}>{dados?.nomeECA || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tipo de Organização:</Text>
        <Text style={styles.value}>{dados?.tipoOrganizacao || 'N/A'}</Text>
      </View>
    </View>
  </View>
);

// Componente do inquiridor
const InquiridorSection = ({ dados }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Informações do Inquiridor</Text>
    <View style={styles.sectionContent}>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Nome Completo:</Text>
            <Text style={styles.value}>
              {dados?.nomeInquiridor || ''} {dados?.nomeDoMeioInquiridor || ''} {dados?.sobrenomeInquiridor || ''}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Código:</Text>
            <Text style={styles.value}>{dados?.codigoInquiridor || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Data de Registro:</Text>
            <Text style={styles.value}>{formatDate(dados?.dataRegistro) || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

// Componente de atividades
const AtividadesSection = ({ dados }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Atividades e Ativos</Text>
    <View style={styles.sectionContent}>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Atividades:</Text>
            <Text style={styles.value}>{dados?.atividades || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Acesso à Terra:</Text>
            <Text style={styles.value}>{dados?.acessoTerra || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Acesso à Ração:</Text>
            <Text style={styles.value}>{dados?.acessoRacao || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Conhecimento Doenças:</Text>
            <Text style={styles.value}>{dados?.conhecimentoDoencas || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Benefício Crédito:</Text>
            <Text style={styles.value}>{dados?.creditoBeneficio || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Apoio:</Text>
            <Text style={styles.value}>{dados?.tipoApoio || 'N/A'}</Text>
          </View>
        </View>
      </View>
      {dados?.bensFamiliares && (
        <View style={styles.row}>
          <Text style={styles.label}>Bens Familiares:</Text>
          <Text style={styles.value}>{dados.bensFamiliares}</Text>
        </View>
      )}
    </View>
  </View>
);

// NOVO: Componente da seção do QR Code
const QRCodeSection = ({ qrCodeData, numeroRegistro }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Verificação Digital</Text>
    <View style={styles.sectionContent}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{
          alignItems: 'center',
          width: '30%'
        }}>
          {qrCodeData && (
            <>
              <Image src={qrCodeData} style={{
                width: 80,
                height: 80,
                marginBottom: 5
              }} />
              <Text style={{
                fontSize: 7,
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                Código de Verificação
              </Text>
              <Text style={{
                fontSize: 8,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 5
              }}>
                {numeroRegistro}
              </Text>
            </>
          )}
        </View>

        <View style={{
          width: '65%',
          paddingLeft: 10
        }}>
          <Text style={{
            fontSize: 8,
            fontWeight: 'bold',
            marginBottom: 3
          }}>
            Verificação de Autenticidade:
          </Text>
          <Text style={{
            fontSize: 7,
            lineHeight: 1.3,
            marginBottom: 2
          }}>
            1. Escaneie o QR Code com seu dispositivo móvel
          </Text>
          <Text style={{
            fontSize: 7,
            lineHeight: 1.3,
            marginBottom: 2
          }}>
            2. Ou acesse: https://rnpa.gov.ao/verificar/{numeroRegistro}
          </Text>
          <Text style={{
            fontSize: 7,
            lineHeight: 1.3,
            marginBottom: 2
          }}>
            3. Confirme os dados apresentados com este documento
          </Text>
          <Text style={{
            fontSize: 7,
            lineHeight: 1.3
          }}>
            <Text style={{ fontWeight: 'bold' }}>Atenção:</Text> Documentos adulterados ou falsificados
            não passarão na verificação digital.
          </Text>
        </View>
      </View>
    </View>
  </View>
);

// NOVO: Componente do Histórico de Produção
const HistoricoProducaoSection = ({ historico }) => {
  if (!historico || historico.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico de Produção</Text>
        <View style={styles.sectionContent}>
          <Text style={{ textAlign: 'center', color: '#666', fontSize: 10 }}>
            Nenhum registro de produção encontrado.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.historicoHeader}>
        HISTÓRICO DE PRODUÇÃO AGRÍCOLA E PECUÁRIA
      </Text>

      {historico.map((registro, index) => (
        <View key={registro.id || index} style={styles.registroItem}>
          <Text style={styles.registroHeader}>
            Registro #{index + 1} - {formatDate(registro.anoDeProducao)} - {registro.safraOuEpocaAgricola}
          </Text>

          <View style={styles.sectionContent}>
            {/* Informações Básicas */}
            <View style={styles.subSecao}>
              <Text style={styles.subSecaoTitle}>Informações Básicas</Text>
              <View style={styles.twoColumn}>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Propriedade/Campo:</Text>
                    <Text style={styles.value}>{registro.nomeDaPropriedadeOuCampo || 'N/A'}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Área Total Utilizada:</Text>
                    <Text style={styles.value}>{registro.areaTotalUtilizada || 'N/A'} hectares</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Atividade Principal:</Text>
                    <Text style={styles.value}>{registro.atividadePrincipal || 'N/A'}</Text>
                  </View>
                </View>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Coordenadas GPS:</Text>
                    <Text style={styles.value}>{registro.coordenadasGPS || 'N/A'}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Assistência Técnica:</Text>
                    <Text style={styles.value}>{registro.recebeuAssistenciaTecnica === 'sim' ? 'Sim' : 'Não'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Culturas Produzidas */}
            {registro.culturasProduzidas && registro.culturasProduzidas.length > 0 && (
              <View style={styles.subSecao}>
                <Text style={styles.subSecaoTitle}>Culturas Produzidas ({registro.culturasProduzidas.length})</Text>
                {registro.culturasProduzidas.map((cultura, culturaIndex) => (
                  <View key={culturaIndex} style={styles.culturaItem}>
                    <Text style={styles.itemHeader}>
                      {formatCultura(cultura.cultura)} - {cultura.variedade || 'Variedade não especificada'}
                    </Text>
                    <View style={styles.threeColumn}>
                      <View style={styles.columnThird}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Área Cultivada:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{cultura.areaCultivada} ha</Text>
                      </View>
                      <View style={styles.columnThird}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Produção:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{cultura.producao} {formatUnidadeMedida(cultura.unidadeDeMedida)}</Text>
                      </View>
                      <View style={styles.columnThird}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Modo de Produção:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{formatModoProducao(cultura.modoDeProducao)}</Text>
                      </View>
                    </View>
                    <View style={styles.twoColumn}>
                      <View style={styles.column}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Fertilizantes:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{cultura.usoDeFertilizante ? 'Sim' : 'Não'}</Text>
                      </View>
                      <View style={styles.column}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Irrigação:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{cultura.sistemaDeIrrigacao ? 'Sim' : 'Não'}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Animais Criados */}
            {registro.animaisCriados && registro.animaisCriados.length > 0 && (
              <View style={styles.subSecao}>
                <Text style={styles.subSecaoTitle}>Animais Criados ({registro.animaisCriados.length})</Text>
                {registro.animaisCriados.map((animal, animalIndex) => (
                  <View key={animalIndex} style={styles.animalItem}>
                    <Text style={styles.itemHeader}>
                      {formatTipoAnimal(animal.tipoDeAnimal)} - {animal.racaOuVariedade || 'Raça não especificada'}
                    </Text>
                    <View style={styles.threeColumn}>
                      <View style={styles.columnThird}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Número de Animais:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{animal.numeroDeAnimais} cabeças</Text>
                      </View>
                      <View style={styles.columnThird}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Finalidade:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{animal.finalidade}</Text>
                      </View>
                      <View style={styles.columnThird}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Sistema:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{formatSistemaProducao(animal.sistemaDeProducao)}</Text>
                      </View>
                    </View>
                    {animal.produtividade && (
                      <View style={styles.row}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Produtividade:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{animal.produtividade}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Comercialização */}
            <View style={styles.subSecao}>
              <Text style={styles.subSecaoTitle}>Comercialização e Destino da Produção</Text>
              <View style={styles.twoColumn}>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Mercado Local:</Text>
                    <Text style={styles.value}>{registro.vendaNoMercadoLocal || '0'}%</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Mercado Regional:</Text>
                    <Text style={styles.value}>{registro.vendaNoMercadoRegional || '0'}%</Text>
                  </View>
                </View>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Autoconsumo:</Text>
                    <Text style={styles.value}>{registro.autoConsumo || '0'}%</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Perdas:</Text>
                    <Text style={styles.value}>{registro.perdas || '0'}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Observações */}
            {(registro.observacoesTecnicas || registro.principaisDesafiosEnfrentados || registro.melhoriasERecomendacoes) && (
              <View style={styles.subSecao}>
                <Text style={styles.subSecaoTitle}>Observações e Avaliação</Text>
                {registro.observacoesTecnicas && (
                  <View style={{ marginBottom: 6 }}>
                    <Text style={styles.labelFull}>Observações Técnicas:</Text>
                    <Text style={[styles.valueFull, { fontSize: 8 }]}>{registro.observacoesTecnicas}</Text>
                  </View>
                )}
                {registro.principaisDesafiosEnfrentados && (
                  <View style={{ marginBottom: 6 }}>
                    <Text style={styles.labelFull}>Principais Desafios:</Text>
                    <Text style={[styles.valueFull, { fontSize: 8 }]}>{registro.principaisDesafiosEnfrentados}</Text>
                  </View>
                )}
                {registro.melhoriasERecomendacoes && (
                  <View style={{ marginBottom: 6 }}>
                    <Text style={styles.labelFull}>Melhorias e Recomendações:</Text>
                    <Text style={[styles.valueFull, { fontSize: 8 }]}>{registro.melhoriasERecomendacoes}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

// Componente do rodapé
const FooterSection = () => (
  <View style={styles.footer}>
    <Text>RNPA - Registo Nacional de Produtores Agrícolas | Ministério da Agricultura e Florestas - República de Angola</Text>
    <Text>Data de geração: {new Date().toLocaleDateString('pt-BR')} | Este documento possui validade oficial</Text>
  </View>
);

// MODIFICADO: Componente principal do PDF completo com histórico E QR CODE
const ProdutorCompletoDocument = ({ dados, historico, qrCodeData }) => {
  return (
    <Document>
      {/* Primeira página - Identificação e Localização */}
      <PageWithWatermark showHeader={true}>
        <TopInfoSection dados={dados} />
        <IdentificacaoSection dados={dados} />
        <LocalizacaoSection dados={dados} />
      </PageWithWatermark>

      {/* Segunda página - Agregado Familiar e Organização */}
      <PageWithWatermark>
        <AgregadoFamiliarSection dados={dados} />
        <OrganizacaoSection dados={dados} />
        <InquiridorSection dados={dados} />
        <AtividadesSection dados={dados} />
      </PageWithWatermark>

      {/* Páginas do Histórico de Produção */}
      <PageWithWatermark>
        <HistoricoProducaoSection historico={historico} />
      </PageWithWatermark>

      {/* Página final com QR Code e rodapé */}
      <PageWithWatermark>
        <QRCodeSection qrCodeData={qrCodeData} numeroRegistro={dados?.numeroRegistro} />
        <FooterSection />
      </PageWithWatermark>
    </Document>
  );
};

// MODIFICADA: Função principal para gerar PDF completo com histórico E QR CODE
export const gerarFichaCompletaPDF = async (produtorId) => {
  try {
    console.log('Iniciando geração do PDF completo para produtor ID:', produtorId);

    // Buscar dados do produtor
    const response = await api.get(`/formulario/${produtorId}`);

    // Buscar histórico de produção
    const historicoData = await buscarHistoricoProducao(produtorId);

    // Buscar foto da API
    console.log('Buscando foto da API...');
    const fotoAPI = await carregarFotoAPI(produtorId);

    // Mapear dados incluindo a foto
    const dadosMapeados = mapearDadosAPI(response.data, fotoAPI);

    // NOVO: Gerar QR Code com os dados do produtor
    console.log('Gerando QR Code com dados do produtor...');
    const qrCodeData = await gerarQRCodeProdutor(dadosMapeados);

    if (!qrCodeData) {
      console.warn('Não foi possível gerar o QR Code, continuando sem ele...');
    }

    console.log('Dados do produtor carregados:', dadosMapeados);
    console.log('Histórico de produção carregado:', historicoData.length, 'registros');
    console.log('Foto da API:', fotoAPI ? 'Carregada' : 'Não encontrada');
    console.log('QR Code:', qrCodeData ? 'Gerado com sucesso' : 'Não gerado');

    // MODIFICADO: Gerar o PDF incluindo QR Code
    const pdfBlob = await pdf(
      <ProdutorCompletoDocument dados={dadosMapeados} historico={historicoData} qrCodeData={qrCodeData} />
    ).toBlob();

    console.log('PDF completo gerado com sucesso');

    // Criar URL do blob
    const url = URL.createObjectURL(pdfBlob);

    // Criar elemento de download
    const link = document.createElement('a');
    link.href = url;
    link.download = `ficha_completa_produtor_${dadosMapeados.numeroRegistro}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Executar download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpar URL do blob
    URL.revokeObjectURL(url);

    console.log('Download da ficha completa iniciado com sucesso');
    return Promise.resolve();
  } catch (error) {
    console.error('Erro detalhado ao gerar PDF completo:', error);
    throw new Error(`Erro ao gerar a ficha completa do produtor: ${error.message}`);
  }
};

// MODIFICADO: Componente que pode ser usado diretamente na interface
const ProdutorCompletoRNPAPDF = ({ produtorId, onSuccess, onError }) => {
  const { dados, historico, loading, error } = useProdutorComHistorico(produtorId);
  const [gerando, setGerando] = useState(false);

  const handleGerarPDF = async () => {
    if (!dados) {
      onError?.('Dados do produtor não disponíveis');
      return;
    }

    setGerando(true);
    try {
      // NOVO: Gerar QR Code com os dados do produtor
      const qrCodeData = await gerarQRCodeProdutor(dados);

      const pdfBlob = await pdf(
        <ProdutorCompletoDocument dados={dados} historico={historico} qrCodeData={qrCodeData} />
      ).toBlob();

      const url = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `ficha_completa_produtor_${dados.numeroRegistro}_${new Date().toISOString().split('T')[0]}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log(`PDF completo gerado com ${historico.length} registros de produção e QR Code`);
      onSuccess?.('Ficha completa gerada com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar PDF completo:', err);
      onError?.(`Erro ao gerar PDF: ${err.message}`);
    } finally {
      setGerando(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Carregando dados do produtor e histórico de produção...
        </div>
        <div style={{
          width: '24px',
          height: '24px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontSize: '14px', color: '#d32f2f', textAlign: 'center' }}>
          Erro ao carregar dados: {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Preview dos dados */}
      {dados && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#2c5aa0' }}>
            Ficha Completa do Produtor com Histórico de Produção
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <strong>Nome:</strong> {dados.nome}
            </div>
            <div>
              <strong>BI:</strong> {dados.bi}
            </div>
            <div>
              <strong>Telefone:</strong> {dados.telefone}
            </div>
            <div>
              <strong>Província:</strong> {dados.provincia}
            </div>
            <div>
              <strong>Município:</strong> {dados.municipio}
            </div>
            <div>
              <strong>Registros de Produção:</strong> {historico.length}
            </div>
          </div>

          {/* Status da Foto e Histórico */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '4px', flex: 1 }}>
              <strong>Estado da Foto:</strong>
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                backgroundColor: dados.fotoAPI ? '#4caf50' : '#ff9800',
                color: 'white'
              }}>
                {dados.fotoAPI ? 'Carregada da API' : 'Usando foto padrão'}
              </span>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#f0f8ff', borderRadius: '4px', flex: 1 }}>
              <strong>Histórico:</strong>
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                backgroundColor: historico.length > 0 ? '#4caf50' : '#ff9800',
                color: 'white'
              }}>
                {historico.length > 0 ? `${historico.length} registros` : 'Sem registros'}
              </span>
            </div>
          </div>

          {/* Info sobre conteúdo do PDF COM QR CODE */}
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f8ff', borderRadius: '4px', border: '1px solid #b3d9ff' }}>
            <strong>Conteúdo do PDF:</strong>
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#0066cc' }}>
              ✅ Dados pessoais ✅ Localização ✅ Agregado familiar ✅ Histórico completo de produção ✅ QR Code de verificação ✅ Marca d'água oficial
            </span>
          </div>
        </div>
      )}

      {/* Botão para gerar PDF */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleGerarPDF}
          disabled={gerando || !dados}
          style={{
            padding: '12px 24px',
            backgroundColor: gerando ? '#6c757d' : '#2c5aa0',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: gerando || !dados ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            opacity: gerando || !dados ? 0.7 : 1
          }}
        >
          {gerando ? (
            <>
              <span style={{ marginRight: '8px' }}>⏳</span>
              Gerando PDF Completo com QR Code...
            </>
          ) : (
            <>
              <span style={{ marginRight: '8px' }}>📄</span>
              Gerar Ficha Completa com Histórico e QR Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProdutorCompletoRNPAPDF;