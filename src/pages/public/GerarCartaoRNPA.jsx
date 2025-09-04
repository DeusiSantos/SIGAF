import React, { useState, useEffect } from 'react';
import { Image, Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import axios from 'axios';
import QRCode from 'qrcode'; // 👈 IMPORTAÇÃO ADICIONADA
import emblema from '../../assets/emblema.png';
import fotoC from '../../assets/RNPA-removebg.png';
import logo from '../../assets/RNPA-removebg.png';

import api from '../../services/api';

// Estilos organizados com alinhamentos aperfeiçoados
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

  // 👈 ESTILOS PARA QR CODE ADICIONADOS
  qrCodeContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderRadius: 5
  },
  qrCodeImage: {
    width: 80,
    height: 80,
    marginBottom: 5
  },
  qrCodeLabel: {
    fontSize: 7,
    color: '#666',
    textAlign: 'center',
    fontWeight: 'bold'
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

// 👈 FUNÇÃO PARA GERAR QR CODE ADICIONADA
const gerarQRCodePDF = async (dados) => {
  try {
    if (!dados) return null;

    // Gerar data de validade (5 anos a partir da data atual)
    const dataValidade = new Date();
    dataValidade.setFullYear(dataValidade.getFullYear() + 5);
    const dataValidadeFormatada = dataValidade.toLocaleDateString('pt-BR');

    // Dados específicos para o QR Code
    const dadosQR = `Produtor Nº: ${dados.numeroRegistro}
Nome: ${dados.nome}
Sexo: ${dados.genero === 'Masculino' ? 'M' : 'F'}
Data de Validade: ${dataValidadeFormatada}
Província: ${dados.provincia}
Município: ${dados.municipio}`;

    console.log('Gerando QR Code para PDF com dados:', dadosQR);

    // Gerar QR Code como base64
    const qrCodeDataURL = await QRCode.toDataURL(dadosQR, {
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
    console.error('Erro ao gerar QR Code para PDF:', error);
    return null;
  }
};

// Funções utilitárias aperfeiçoadas
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Função para carregar foto da API
const carregarFotoAPI = async (produtorId) => {
  if (!produtorId) return null;

  try {
    console.log(`Buscando foto para produtor ID: ${produtorId}`);
    
    // Fazer requisição GET para buscar a foto
    const response = await api.get(`/formulario/${produtorId}/foto-beneficiary`, {
      responseType: 'blob',
      timeout: 10000
    });

    // Verificar se a resposta contém dados
    if (response.data && response.data.size > 0) {
      // Converter blob para base64 para usar no PDF
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
    if (error.response) {
      console.log(`Erro ${error.response.status}: ${error.response.statusText}`);
      if (error.response.status === 404) {
        console.log('Foto não encontrada para este produtor');
      }
    }
    return null;
  }
};

// Função para mapear dados da API para o formato esperado
const mapearDadosAPI = (dadosAPI, fotoAPI = null, qrCodeDataURL = null) => {
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
    provincia: dadosAPI?.Provincia,
    municipio: dadosAPI?.Municipio,
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

    // URLs das fotos - PRIORIZA FOTO DA API
    fotoAPI: fotoAPI,
    fotoBiometrica: getFotoURL(dadosAPI?._attachments, 'beneficiary_biometrics'),
    fotoNormal: getFotoURL(dadosAPI?._attachments, 'beneficiary_photo'),
    fotoDocumento: getFotoURL(dadosAPI?._attachments, 'foto_documento'),
    fotoAnimais: getFotoURL(dadosAPI?._attachments, 'fotos_animais'),

    // 👈 QR CODE ADICIONADO
    qrCode: qrCodeDataURL,

    // Dados fictícios para completar
    nomePai: `${dadosAPI?.nome_produtor || 'N/A'} (Pai)`,
    nomeMae: `${dadosAPI?.nome_produtor || 'N/A'} (Mãe)`
  };
};

// Hook personalizado para buscar dados do produtor com foto da API
const useProdutorData = (id) => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingFoto, setLoadingFoto] = useState(false);

  useEffect(() => {
    const fetchProdutor = async () => {
      if (!id) {
        setError('ID do produtor não fornecido');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Buscando dados do produtor...');
        
        // Buscar dados do formulário
        const response = await api.get(`/formulario/${id}`);
        
        console.log('Dados do formulário carregados, buscando foto...');
        setLoadingFoto(true);
        
        // Buscar foto da API
        const fotoAPI = await carregarFotoAPI(id);
        
        console.log('Foto carregada:', fotoAPI ? 'Sucesso' : 'Não encontrada');
        
        // 👈 GERAR QR CODE ADICIONADO
        console.log('Gerando QR Code...');
        const dadosPreliminar = mapearDadosAPI(response.data, fotoAPI);
        const qrCodeDataURL = await gerarQRCodePDF(dadosPreliminar);
        console.log('QR Code gerado:', qrCodeDataURL ? 'Sucesso' : 'Erro');
        
        // Mapear dados incluindo a foto e QR code
        const dadosMapeados = mapearDadosAPI(response.data, fotoAPI, qrCodeDataURL);
        setDados(dadosMapeados);
        
      } catch (err) {
        console.error('Erro ao buscar produtor:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
        setLoadingFoto(false);
      }
    };

    fetchProdutor();
  }, [id]);

  return { dados, loading, error, loadingFoto };
};

// 👈 COMPONENTE DO QR CODE ADICIONADO
const QRCodeSection = ({ dados }) => {
  if (!dados?.qrCode) return null;

  return (
    <View style={styles.qrCodeContainer}>
      <Image src={dados.qrCode} style={styles.qrCodeImage} />
      <Text style={styles.qrCodeLabel}>QR CODE RNPA</Text>
      <Text style={[styles.qrCodeLabel, { fontSize: 6 }]}>
        {dados.numeroRegistro}
      </Text>
    </View>
  );
};

// Componente wrapper para páginas com marca d'água
const PageWithWatermark = ({ children, showHeader = false, dados = null }) => (
  <Page size="A4" style={styles.page}>
    {/* Marca d'água em cada página */}
    <Image src={logo} style={styles.logoFundo} />
    
    {/* QR Code - apenas na primeira página */}
    {showHeader && <QRCodeSection dados={dados} />}
    
    {/* Conteúdo da página */}
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
    <Text style={styles.logo}>REGISTO NACIONAL DE PRODUTORES AGRÍCOLAS, PECUÁRIOS E FLORESTAIS</Text>
    <Text style={styles.titleRepublica}>FICHA DO PRODUTOR</Text>
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

// Componente da identificação do produtor - COM FOTO DA API
const IdentificacaoSection = ({ dados }) => {
  // Função para determinar qual foto usar (prioriza foto da API)
  const obterFotoProdutor = () => {
    if (dados?.fotoAPI) {
      console.log('Usando foto da API no PDF');
      return dados.fotoAPI;
    } else if (dados?.fotoNormal) {
      console.log('Usando foto normal dos anexos no PDF');
      return dados.fotoNormal;
    } else if (dados?.fotoBiometrica) {
      console.log('Usando foto biométrica dos anexos no PDF');
      return dados.fotoBiometrica;
    } else {
      console.log('Usando foto padrão no PDF');
      return fotoC;
    }
  };

  const fotoProdutor = obterFotoProdutor();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Identificação do Pequeno Produtor</Text>
      <View style={styles.sectionContent}>
        <View style={styles.identificacaoLayout}>
          {/* Container da foto */}
          <View style={styles.fotoContainer}>
            <View style={styles.fotoProdutorContainer}>
              {fotoProdutor ? (
                <Image
                  src={fotoProdutor}
                  style={styles.fotoProdutor}
                />
              ) : (
                <View style={styles.fotoPlaceholder}>
                  <Text style={{ fontSize: 8, color: '#999' }}>Sem Foto</Text>
                </View>
              )}
              <Text style={styles.fotoLabel}>
                Foto do Produtor
                {dados?.fotoAPI && (
                  <Text style={{ fontSize: 6, color: '#007bff' }}>
                    (API)
                  </Text>
                )}
              </Text>
            </View>
          </View>

          {/* Container dos dados */}
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
            <Text style={styles.label}>Sexo do Chefe:</Text>
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

// Componente do rodapé
const FooterSection = () => (
  <View style={styles.footer}>
    <Text>RNPA - Registo Nacional de Produtores Agrícolas | Ministério da Agricultura e Florestas - República de Angola</Text>
    <Text>Data de geração: {new Date().toLocaleDateString('pt-BR')} | Este documento possui validade oficial</Text>
  </View>
);

// Componente principal do PDF com marca d'água em todas as páginas
const ProdutorRNPADocument = ({ dados }) => (
  <Document>
    {/* Primeira página - COM QR CODE */}
    <PageWithWatermark showHeader={true} dados={dados}>
      <TopInfoSection dados={dados} />
      <IdentificacaoSection dados={dados} />
      <LocalizacaoSection dados={dados} />
    </PageWithWatermark>
    
    {/* Segunda página - SEM QR CODE */}
    <PageWithWatermark>
      <AgregadoFamiliarSection dados={dados} />
      <OrganizacaoSection dados={dados} />
      <InquiridorSection dados={dados} />
      <AtividadesSection dados={dados} />
      <FooterSection />
    </PageWithWatermark>
  </Document>
);

// Função principal para gerar PDF (pode ser chamada de outros componentes)
export const gerarFichaProdutorPDF = async (produtorId) => {
  try {
    console.log('Iniciando geração do PDF para produtor ID:', produtorId);

    // Buscar dados do produtor
    const response = await api.get(`/formulario/${produtorId}`);
    
    // Buscar foto da API
    console.log('Buscando foto da API...');
    const fotoAPI = await carregarFotoAPI(produtorId);
    
    // Gerar QR code
    console.log('Gerando QR Code...');
    const dadosPreliminar = mapearDadosAPI(response.data, fotoAPI);
    const qrCodeDataURL = await gerarQRCodePDF(dadosPreliminar);
    
    // Mapear dados incluindo a foto e QR code
    const dadosMapeados = mapearDadosAPI(response.data, fotoAPI, qrCodeDataURL);

    console.log('Dados do produtor carregados:', dadosMapeados);
    console.log('Foto da API:', fotoAPI ? 'Carregada' : 'Não encontrada');
    console.log('QR Code:', qrCodeDataURL ? 'Gerado' : 'Erro');

    // Gerar o PDF
    const pdfBlob = await pdf(<ProdutorRNPADocument dados={dadosMapeados} />).toBlob();

    console.log('PDF gerado com sucesso - 2 páginas com marca d\'água e QR Code');

    // Criar URL do blob
    const url = URL.createObjectURL(pdfBlob);

    // Criar elemento de download
    const link = document.createElement('a');
    link.href = url;
    link.download = `ficha_produtor_${dadosMapeados.numeroRegistro}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Executar download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpar URL do blob
    URL.revokeObjectURL(url);

    console.log('Download da ficha iniciado com sucesso');
    return Promise.resolve();
  } catch (error) {
    console.error('Erro detalhado ao gerar PDF:', error);
    throw new Error(`Erro ao gerar a ficha do produtor: ${error.message}`);
  }
};

// Componente que pode ser usado diretamente na interface
const ProdutorRNPAPDF = ({ produtorId, onSuccess, onError }) => {
  const { dados, loading, error, loadingFoto } = useProdutorData(produtorId);
  const [gerando, setGerando] = useState(false);
  const [pageCount] = useState(2); // Sempre 2 páginas

  const handleGerarPDF = async () => {
    if (!dados) {
      onError?.('Dados do produtor não disponíveis');
      return;
    }

    setGerando(true);
    try {
      const pdfBlob = await pdf(<ProdutorRNPADocument dados={dados} />).toBlob();
      const url = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `ficha_produtor_${dados.numeroRegistro}_${new Date().toISOString().split('T')[0]}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log(`PDF gerado com ${pageCount} páginas, cada uma com marca d'água e QR Code na primeira página`);
      onSuccess?.('Ficha gerada com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
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
          {loadingFoto ? 'Carregando foto da API...' : 'Carregando dados do produtor...'}
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
            Dados para a Ficha ({pageCount} páginas com marca d'água e QR Code)
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
              <strong>Data Registro:</strong> {formatDate(dados.dataRegistro)}
            </div>
          </div>
          
          {/* Status da Foto */}
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
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

          {/* Status do QR Code */}
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
            <strong>QR Code:</strong> 
            <span style={{ 
              marginLeft: '8px',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: dados.qrCode ? '#4caf50' : '#f44336',
              color: 'white'
            }}>
              {dados.qrCode ? 'Gerado com dados específicos' : 'Erro na geração'}
            </span>
            {dados.qrCode && (
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>
                Dados no QR: Produtor Nº, Nome, Sexo, Data Validade, Província, Município
              </div>
            )}
          </div>

          {/* Info sobre marca d'água */}
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f8ff', borderRadius: '4px', border: '1px solid #b3d9ff' }}>
            <strong>Marca d'Água:</strong> 
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#0066cc' }}>
              ✅ Emblema de Angola será aplicado em todas as {pageCount} páginas
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
              Gerando PDF com QR Code...
            </>
          ) : (
            <>
              <span style={{ marginRight: '8px' }}>📄</span>
              Gerar Ficha do Produtor ({pageCount} páginas + QR Code)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProdutorRNPAPDF;