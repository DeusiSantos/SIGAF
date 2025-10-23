import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
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

  // Layout de linhas e colunas
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

  // Texto
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

  // Estilos específicos para histórico de produção
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

// Funções utilitárias
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Função para gerar QR Code do produtor florestal
const gerarQRCodeProdutor = async (dados) => {
  try {
    const numeroRegistro = dados?.numeroRegistro || 'RNPF000000';

    const dadosQR = {
      registro: numeroRegistro,
      nome: dados?.nome || '',
      bi: dados?.bi || '',
      telefone: dados?.telefone || '',
      provincia: dados?.provincia || '',
      municipio: dados?.municipio || '',
      dataRegistro: formatDate(dados?.dataRegistro) || formatDate(new Date()),
      verificacao: `https://rnpf.gov.ao/verificar/${numeroRegistro}`,
      propriedade: dados?.propriedade || '',
      tipoLicenca: dados?.tipoLicenca || '',
      estado: dados?.estado || ''
    };

    const dadosString = `Registro RNPF: ${dadosQR.registro}
Nome: ${dadosQR.nome}
BI/NIF: ${dadosQR.bi}
Telefone: ${dadosQR.telefone}
Província: ${dadosQR.provincia}
Município: ${dadosQR.municipio}
Propriedade: ${dadosQR.propriedade}
Tipo Licença: ${dadosQR.tipoLicenca}
Estado: ${dadosQR.estado}
Registrado em: ${dadosQR.dataRegistro}
Verificar: ${dadosQR.verificacao}`;

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
    console.error('Erro ao gerar QR Code do produtor florestal:', error);
    return null;
  }
};

// Função para carregar foto da API
const carregarFotoAPI = async (produtorId) => {
  if (!produtorId) return null;

  try {
    console.log(`Buscando foto para produtor florestal ID: ${produtorId}`);

    const response = await api.get(`/produtorFlorestal/${produtorId}/foto`, {
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

// Função para buscar histórico de produção florestal
const buscarHistoricoProducao = async (produtorId) => {
  try {
    console.log(`Buscando histórico de produção florestal para produtor ID: ${produtorId}`);
    const response = await api.get(`/historicoDeProducaoFlorestal/produtoreFlorestais/${produtorId}`);
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar histórico de produção florestal:', error);
    return [];
  }
};

// Função para mapear dados da API florestal para o formato esperado
const mapearDadosAPI = (dadosAPI, fotoAPI = null) => {
  // Função auxiliar para parsear coordenadas GPS
  const parseCoordinates = (gpsString) => {
    if (!gpsString) return { latitude: '', longitude: '', altitude: '', precisao: '' };
    const parts = gpsString.trim().split(' ');
    return {
      latitude: parts[0] || '',
      longitude: parts[1] || '',
      altitude: parts[2] || '',
      precisao: parts[3] || ''
    };
  };

  const coords = parseCoordinates(dadosAPI?.localiza_o_GPS);

  // Extrair data de nascimento formatada
  const dataNascimento = dadosAPI?.data_de_Nascimento &&
    dadosAPI.data_de_Nascimento !== '0001-01-01T00:00:00'
    ? dadosAPI.data_de_Nascimento
    : null;

  return {
    id: dadosAPI?._id,
    numeroRegistro: `RNPF${dadosAPI?._id}`, // RNPF = Registro Nacional Produtor Florestal
    dataRegistro: dadosAPI?.data_da_inspe_o || new Date().toISOString(),

    // Dados do produtor florestal
    nome: dadosAPI?.nome_do_Produtor || 'N/A',
    nomeProdutor: dadosAPI?.nome_do_Produtor,
    dataNascimento: dataNascimento,
    bi: dadosAPI?.bI_NIF || 'N/A',
    nif: dadosAPI?.bI_NIF || 'N/A',
    genero: dadosAPI?.g_nero || 'Não informado',
    telefone: dadosAPI?.contacto || 'N/A',
    email: dadosAPI?.e_mail || 'N/A',

    // Localização
    provincia: dadosAPI?.provincia || 'N/A',
    municipio: dadosAPI?.municipio || 'N/A',
    comuna: dadosAPI?.comuna || 'N/A',
    latitude: coords?.latitude,
    longitude: coords?.longitude,
    altitude: coords?.altitude,
    precisao: coords?.precisao,
    coordenadasGPS: dadosAPI?.localiza_o_GPS || 'N/A',

    // Informações florestais específicas
    propriedade: dadosAPI?.propriedade || 'N/A',
    especiesPredominantes: dadosAPI?.esp_cies_predominantes || 'N/A',
    volumeEstimado: dadosAPI?.volume_estimado_m || 'N/A',
    estadoConservacao: dadosAPI?.estado_de_conserva_o || 'N/A',
    tipoLicenca: dadosAPI?.tipo_de_licen_a_solicitada || 'N/A',
    areaAssociada: dadosAPI?._rea_associada || 'N/A',
    validadePretendida: dadosAPI?.validade_pretendida || 'N/A',

    // Inspeção e fiscalização
    idLicencaFiscalizada: dadosAPI?.iD_da_licen_a_fiscalizada || 'N/A',
    dataInspecao: dadosAPI?.data_da_inspe_o || 'N/A',
    resultadoInspecao: dadosAPI?.resultado_da_inspe_o || 'N/A',
    descricaoInfracao: dadosAPI?.descri_o_da_infra_o || 'N/A',
    autoEmitido: dadosAPI?.auto_emitido || 'N/A',
    tipoOcorrencia: dadosAPI?.tipo_de_ocorr_ncia || 'N/A',
    descricaoAdicional: dadosAPI?.descri_o_adicional || 'N/A',

    // Produção
    especieProduzida: dadosAPI?.esp_cie_produzida || 'N/A',
    volumeAnual: dadosAPI?.volume_anual_m || 'N/A',
    origemAreaCadastrada: dadosAPI?.origem_rea_cadastrada || 'N/A',
    documentosTransporte: dadosAPI?.documentos_de_transporte || 'N/A',

    // Sanções
    numeroAuto: dadosAPI?.n_mero_do_auto || 'N/A',
    dataAuto: dadosAPI?.data || 'N/A',
    tipoInfracao: dadosAPI?.tipo_de_infra_o || 'N/A',
    valorAKZ: dadosAPI?.valor_AKZ || 'N/A',
    statusSancao: dadosAPI?.status_da_san_o || 'N/A',
    estado: dadosAPI?.estado || 'N/A',

    // Foto
    fotoAPI: fotoAPI,

    // Atividades (para compatibilidade)
    atividades: 'Produtor Florestal',

    // Campos fictícios para manter compatibilidade
    nomePai: 'N/A',
    nomeMae: 'N/A',
    estadoCivil: 'N/A',
    nivelEscolaridade: 'N/A',
    chefeAgregado: false,
    numeroAgregados: 0
  };
};

// Hook personalizado para buscar dados do produtor florestal com foto e histórico
const useProdutorComHistorico = (id) => {
  const [dados, setDados] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      if (!id) {
        setError('ID do produtor florestal não fornecido');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Buscando dados do produtor florestal e histórico...');

        // Buscar dados do produtor florestal e histórico em paralelo
        const [produtorResponse, historicoData] = await Promise.all([
          api.get(`/produtorFlorestal/${id}`),
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
    <Text style={styles.logo}>SISTEMA INTEGRADO DE GESTÃO AGRO-FLORESTAL</Text>
    <Text style={styles.titleRepublica}>FICHA COMPLETA DO PRODUTOR FLORESTAL</Text>
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

// Componente da identificação do produtor florestal
const IdentificacaoSection = ({ dados }) => {
  const obterFotoProdutor = () => {
    if (dados?.fotoAPI) {
      return dados.fotoAPI;
    } else {
      return fotoC;
    }
  };

  const fotoProdutor = obterFotoProdutor();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Identificação do Produtor Florestal</Text>
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
                  <Text style={styles.label}>BI/NIF:</Text>
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
                  <Text style={styles.label}>E-mail:</Text>
                  <Text style={styles.value}>{dados?.email || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Estado:</Text>
                  <Text style={styles.value}>{dados?.estado || 'N/A'}</Text>
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

// Componente de informações florestais específicas
const InformacoesFlorestaisSection = ({ dados }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Informações Florestais</Text>
    <View style={styles.sectionContent}>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Propriedade:</Text>
            <Text style={styles.value}>{dados?.propriedade || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Licença:</Text>
            <Text style={styles.value}>{dados?.tipoLicenca || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Área Associada:</Text>
            <Text style={styles.value}>{dados?.areaAssociada || 'N/A'} ha</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Volume Estimado:</Text>
            <Text style={styles.value}>{dados?.volumeEstimado || 'N/A'} m³</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Volume Anual:</Text>
            <Text style={styles.value}>{dados?.volumeAnual || 'N/A'} m³</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Espécie Produzida:</Text>
            <Text style={styles.value}>{dados?.especieProduzida || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estado de Conservação:</Text>
            <Text style={styles.value}>{dados?.estadoConservacao || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Validade Pretendida:</Text>
            <Text style={styles.value}>{dados?.validadePretendida ? formatDate(dados.validadePretendida) : 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.labelFull}>Espécies Predominantes:</Text>
        <Text style={styles.valueFull}>{dados?.especiesPredominantes || 'N/A'}</Text>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.labelFull}>Documentos de Transporte:</Text>
        <Text style={styles.valueFull}>{dados?.documentosTransporte || 'N/A'}</Text>
      </View>
    </View>
  </View>
);

// Componente de fiscalização
const FiscalizacaoSection = ({ dados }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Inspeção e Fiscalização</Text>
    <View style={styles.sectionContent}>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>ID Licença Fiscalizada:</Text>
            <Text style={styles.value}>{dados?.idLicencaFiscalizada || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data da Inspeção:</Text>
            <Text style={styles.value}>{formatDate(dados?.dataInspecao) || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Resultado:</Text>
            <Text style={styles.value}>{dados?.resultadoInspecao || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Auto Emitido:</Text>
            <Text style={styles.value}>{dados?.autoEmitido || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Ocorrência:</Text>
            <Text style={styles.value}>{dados?.tipoOcorrencia || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Número do Auto:</Text>
            <Text style={styles.value}>{dados?.numeroAuto || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Infração:</Text>
            <Text style={styles.value}>{dados?.tipoInfracao || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status da Sanção:</Text>
            <Text style={styles.value}>{dados?.statusSancao || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {dados?.descricaoInfracao && dados.descricaoInfracao !== 'N/A' && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.labelFull}>Descrição da Infração:</Text>
          <Text style={styles.valueFull}>{dados.descricaoInfracao}</Text>
        </View>
      )}

      {dados?.descricaoAdicional && dados.descricaoAdicional !== 'N/A' && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.labelFull}>Descrição Adicional:</Text>
          <Text style={styles.valueFull}>{dados.descricaoAdicional}</Text>
        </View>
      )}
    </View>
  </View>
);

// Componente da seção do QR Code
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
            2. Ou acesse: https://rnpf.gov.ao/verificar/{numeroRegistro}
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

// Componente do Histórico de Produção Florestal
const HistoricoProducaoFlorestalSection = ({ historico }) => {
  if (!historico || historico.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico de Produção Florestal</Text>
        <View style={styles.sectionContent}>
          <Text style={{ textAlign: 'center', color: '#666', fontSize: 10 }}>
            Nenhum registro de produção florestal encontrado.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.historicoHeader}>
        HISTÓRICO DE PRODUÇÃO FLORESTAL
      </Text>

      {historico.map((registro, index) => (
        <View key={registro.id || index} style={styles.registroItem}>
          <Text style={styles.registroHeader}>
            Registro #{index + 1} - {formatDate(registro.anoDeInicioDeProducao)} a {formatDate(registro.anoDeFimDeProducao)} - {registro.safraOuEpocaAgricola}
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

            {/* Produtos Florestais Produzidos */}
            {registro.produtosFlorestaisProduzidos && registro.produtosFlorestaisProduzidos.length > 0 && (
              <View style={styles.subSecao}>
                <Text style={styles.subSecaoTitle}>
                  Produtos Florestais Produzidos ({registro.produtosFlorestaisProduzidos.length})
                </Text>
                {registro.produtosFlorestaisProduzidos.map((produto, produtoIndex) => (
                  <View key={produtoIndex} style={styles.culturaItem}>
                    <Text style={styles.itemHeader}>
                      {produto.tipoDeProduto} - {produto.especieFlorestal}
                    </Text>
                    <View style={styles.threeColumn}>
                      <View style={styles.columnThird}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Área de Exploração:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{produto.areaDeExploracao} ha</Text>
                      </View>
                      <View style={styles.columnThird}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Volume/Quantidade:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>
                          {produto.volumePorQuantidadeDeProducao} {produto.unidadeDeMedida}
                        </Text>
                      </View>
                      <View style={styles.columnThird}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Tipo de Manejo:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{produto.tipoDeManejo}</Text>
                      </View>
                    </View>
                    <View style={styles.twoColumn}>
                      <View style={styles.column}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Idade da Plantação:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{produto.idadeDaPlantacao} anos</Text>
                      </View>
                      <View style={styles.column}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Número de Árvores:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>{produto.numeroDeArvores}</Text>
                      </View>
                    </View>
                    <View style={styles.twoColumn}>
                      <View style={styles.column}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Certificação Florestal:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>
                          {produto.possuiCertificacaoFlorestal ? 'Sim' : 'Não'}
                        </Text>
                      </View>
                      <View style={styles.column}>
                        <Text style={[styles.label, { fontSize: 8 }]}>Licença Ambiental:</Text>
                        <Text style={[styles.value, { fontSize: 8 }]}>
                          {produto.possuiLicencaAmbiental ? 'Sim' : 'Não'}
                        </Text>
                      </View>
                    </View>
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
// Componente do rodapé
const FooterSection = () => (
  <View style={styles.footer}>
    <Text>RNPF - Registo Nacional de Produtores Florestais | Ministério da Agricultura e Florestas - República de Angola</Text>
    <Text>Data de geração: {new Date().toLocaleDateString('pt-BR')} | Este documento possui validade oficial</Text>
  </View>
);

// Componente principal do PDF completo com histórico E QR CODE
const ProdutorFlorestalCompletoDocument = ({ dados, historico, qrCodeData }) => {
  return (
    <Document>
      {/* Primeira página - Identificação e Localização */}
      <PageWithWatermark showHeader={true}>
        <TopInfoSection dados={dados} />
        <IdentificacaoSection dados={dados} />
        <LocalizacaoSection dados={dados} />
      </PageWithWatermark>

      {/* Segunda página - Informações Florestais e Fiscalização */}
      <PageWithWatermark>
        <InformacoesFlorestaisSection dados={dados} />
        <FiscalizacaoSection dados={dados} />
      </PageWithWatermark>

      {/* Páginas do Histórico de Produção Florestal */}
      <PageWithWatermark>
        <HistoricoProducaoFlorestalSection historico={historico} />
      </PageWithWatermark>

      {/* Página final com QR Code e rodapé */}
      <PageWithWatermark>
        <QRCodeSection qrCodeData={qrCodeData} numeroRegistro={dados?.numeroRegistro} />
        <FooterSection />
      </PageWithWatermark>
    </Document>
  );
};

// ============================================
// FUNÇÃO PRINCIPAL PARA GERAR PDF (SEM HOOKS)
// ============================================
// Função principal para gerar PDF completo com histórico E QR CODE
export const gerarFichaCompletaPDF = async (produtorId) => {
  try {
    console.log('Iniciando geração do PDF completo para produtor florestal ID:', produtorId);

    // Buscar dados do produtor florestal
    const produtorResponse = await api.get(`/produtorFlorestal/${produtorId}`);

    // Buscar histórico de produção florestal
    const historicoData = await buscarHistoricoProducao(produtorId);

    // Buscar foto da API
    console.log('Buscando foto da API...');
    const fotoAPI = await carregarFotoAPI(produtorId);

    // Mapear dados incluindo a foto
    const dadosMapeados = mapearDadosAPI(produtorResponse.data, fotoAPI);

    // Gerar QR Code com os dados do produtor florestal
    console.log('Gerando QR Code com dados do produtor florestal...');
    const qrCodeData = await gerarQRCodeProdutor(dadosMapeados);

    if (!qrCodeData) {
      console.warn('Não foi possível gerar o QR Code, continuando sem ele...');
    }

    console.log('Dados do produtor florestal carregados:', dadosMapeados);
    console.log('Histórico de produção florestal carregado:', historicoData.length, 'registros');
    console.log('Foto da API:', fotoAPI ? 'Carregada' : 'Não encontrada');
    console.log('QR Code:', qrCodeData ? 'Gerado com sucesso' : 'Não gerado');

    // Gerar o PDF incluindo QR Code
    const pdfBlob = await pdf(
      <ProdutorFlorestalCompletoDocument dados={dadosMapeados} historico={historicoData} qrCodeData={qrCodeData} />
    ).toBlob();

    console.log('PDF completo gerado com sucesso');

    // Criar URL do blob
    const url = URL.createObjectURL(pdfBlob);

    // Criar elemento de download
    const link = document.createElement('a');
    link.href = url;
    link.download = `ficha_completa_produtor_florestal_${dadosMapeados.numeroRegistro}_${new Date().toISOString().split('T')[0]}.pdf`;

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
    throw new Error(`Erro ao gerar a ficha completa do produtor florestal: ${error.message}`);
  }
};

// ============================================
// COMPONENTE REACT PARA UI (USA HOOKS)
// ============================================
const ProdutorCompletoFlorestal = ({ produtorId, onSuccess, onError }) => {
  const { dados, historico, loading, error } = useProdutorComHistorico(produtorId);
  const [gerando, setGerando] = useState(false);

  const handleGerarPDF = async () => {
    if (!dados) {
      onError?.('Dados do produtor florestal não disponíveis');
      return;
    }

    setGerando(true);
    try {
      // Gerar QR Code com os dados do produtor florestal
      const qrCodeData = await gerarQRCodeProdutor(dados);

      const pdfBlob = await pdf(
        <ProdutorFlorestalCompletoDocument dados={dados} historico={historico} qrCodeData={qrCodeData} />
      ).toBlob();

      const url = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `ficha_completa_produtor_florestal_${dados.numeroRegistro}_${new Date().toISOString().split('T')[0]}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log(`PDF completo gerado com ${historico.length} registros de produção florestal e QR Code`);
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
          Carregando dados do produtor florestal e histórico de produção...
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
            Ficha Completa do Produtor Florestal com Histórico de Produção
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
              <strong>BI/NIF:</strong> {dados.bi}
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
              <strong>Tipo de Propriedade:</strong> {dados.propriedade}
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
              ✅ Dados pessoais ✅ Localização ✅ Informações florestais ✅ Fiscalização ✅ Histórico completo de produção florestal ✅ QR Code de verificação ✅ Marca d'água oficial
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
              <span style={{ marginRight: '8px' }}>🌲</span>
              Gerar Ficha Completa Florestal com Histórico e QR Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Exportação padrão do componente (para uso na UI)
export default ProdutorCompletoFlorestal;