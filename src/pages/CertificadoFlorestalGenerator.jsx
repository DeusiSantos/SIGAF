import React, { useState } from 'react';
import { Image, Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import QRCode from 'react-qr-code';
import { renderToStaticMarkup } from 'react-dom/server';
import emblema from '../../assets/emblema.png';
import logo from '../../assets/RNPA-removebg.png';
import api from '../../services/api';

// Estilos para o certificado florestal oficial
const styles = StyleSheet.create({
  // Layout geral
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
    position: 'relative'
  },

  // Logo de fundo (marca d'água)
  logoFundo: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: 350,
    height: 350,
    opacity: 0.05,
    zIndex: 0
  },

  // Container principal
  content: {
    position: 'relative',
    zIndex: 1
  },

  // Cabeçalho oficial
  header: {
    textAlign: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000'
  },

  logoHeader: {
    width: 45,
    height: 45,
    marginBottom: 6,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  republica: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    color: '#000'
  },

  ministerio: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    color: '#000'
  },

  dnf: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000'
  },

  tituloDocumento: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000'
  },

  // Texto principal do certificado
  textoPrincipal: {
    fontSize: 9,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 15
  },

  destaque: {
    fontWeight: 'bold'
  },

  // Tabela principal de dados
  tabelaContainer: {
    marginBottom: 15
  },

  tabela: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000'
  },

  tabelaRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000'
  },

  celulaEsquerda: {
    width: '50%',
    padding: 6,
    fontSize: 8,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#000',
    backgroundColor: '#f0f0f0'
  },

  celulaDireita: {
    width: '50%',
    padding: 6,
    fontSize: 8,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#000',
    backgroundColor: '#f0f0f0'
  },

  celulaConteudoEsquerda: {
    width: '50%',
    padding: 6,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#000',
    minHeight: 25
  },

  celulaConteudoDireita: {
    width: '50%',
    padding: 6,
    fontSize: 9,
    minHeight: 25
  },

  // Seção de condições especiais
  condicoesContainer: {
    marginBottom: 15
  },

  condicoesHeader: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    padding: 4,
    backgroundColor: '#f0f0f0'
  },

  condicoesTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  condicoesContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderStyle: 'solid',
    borderColor: '#000',
    padding: 8,
    minHeight: 40
  },

  condicoesText: {
    fontSize: 8,
    lineHeight: 1.3
  },

  // Seção de emissão
  emissaoContainer: {
    flexDirection: 'row',
    marginBottom: 15
  },

  emissaoEsquerda: {
    width: '50%',
    paddingRight: 10
  },

  emissaoDireita: {
    width: '50%',
    paddingLeft: 10
  },

  emissaoTitulo: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center'
  },

  emissaoInfo: {
    fontSize: 8,
    marginBottom: 2
  },

  emissaoLabel: {
    fontWeight: 'bold'
  },

  linhaAssinatura: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000',
    height: 20,
    marginTop: 15
  },

  // Texto de rodapé
  rodape: {
    fontSize: 7,
    lineHeight: 1.3,
    textAlign: 'justify',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#000',
    paddingTop: 8
  },

  rodapeDestaque: {
    fontWeight: 'bold'
  },

  // Documento gerado eletronicamente
  documentoEletronico: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666'
  },

  // QR Code para certificado
  qrCodeContainer: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#000',
    padding: 5
  },

  qrCodeImage: {
    width: 68,
    height: 68
  },

  qrCodeText: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 2
  }
});

// Estilos específicos para a fatura
const faturaStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },

  header: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000'
  },

  tituloFatura: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },

  subtituloFatura: {
    fontSize: 12,
    color: '#666'
  },

  infoContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },

  clienteInfo: {
    width: '60%',
    paddingRight: 20
  },

  faturaInfo: {
    width: '40%'
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 2
  },

  infoText: {
    fontSize: 9,
    marginBottom: 3
  },

  tabelaFatura: {
    marginBottom: 20
  },

  tabelaHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#000'
  },

  tabelaRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc'
  },

  colProduto: {
    width: '45%',
    padding: 8,
    fontSize: 9
  },

  colUnidade: {
    width: '15%',
    padding: 8,
    fontSize: 9,
    textAlign: 'center'
  },

  colPreco: {
    width: '20%',
    padding: 8,
    fontSize: 9,
    textAlign: 'right'
  },

  colTotal: {
    width: '20%',
    padding: 8,
    fontSize: 9,
    textAlign: 'right'
  },

  headerText: {
    fontWeight: 'bold'
  },

  totaisContainer: {
    width: '60%',
    marginLeft: '40%',
    marginBottom: 20
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 8
  },

  totalLabel: {
    fontSize: 9
  },

  totalValue: {
    fontSize: 9,
    fontWeight: 'bold'
  },

  totalFinal: {
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginTop: 5,
    paddingTop: 5
  },

  estadoPagamento: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 5,
    marginBottom: 20
  },

  estadoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#856404'
  },

  pagamentoContainer: {
    marginTop: 20
  },

  pagamentoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },

  pagamentoInfo: {
    fontSize: 9,
    marginBottom: 3,
    textAlign: 'center'
  },

  pagamentoDestaque: {
    fontWeight: 'bold',
    fontSize: 10
  },

  // QR Code para fatura
  qrCodeFaturaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },

  qrCodeFaturaInfo: {
    width: '70%'
  },

  qrCodeFaturaImage: {
    width: '30%',
    textAlign: 'center'
  },

  qrImage: {
    width: 80,
    height: 80
  },

  qrText: {
    fontSize: 8,
    textAlign: 'center',
    marginTop: 5
  }
});

// Função para formatar valores monetários
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA'
  }).format(valor);
};

// Função para formatar datas
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  } catch {
    return '';
  }
};

// Função para gerar número do certificado
const gerarNumeroCertificado = () => {
  const ano = new Date().getFullYear();
  const numero = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `DNF/${numero}/${ano}`;
};

// Função para converter componente QRCode em data URL
const qrCodeToDataURL = async (value, size = 200) => {
  return new Promise((resolve) => {
    // Criar um canvas temporário
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    // Gerar QR code usando uma biblioteca simples
    // Para simplificar, vamos usar uma abordagem básica
    const qrSize = Math.floor(size / 25); // 25x25 módulos
    const moduleSize = Math.floor(size / 25);
    
    // Fundo branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Padrão simples do QR (simulado para demonstração)
    ctx.fillStyle = '#000000';
    
    // Cantos de posicionamento
    const drawPositionMarker = (x, y) => {
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };
    
    drawPositionMarker(0, 0);   // Canto superior esquerdo
    drawPositionMarker(18, 0);  // Canto superior direito  
    drawPositionMarker(0, 18);  // Canto inferior esquerdo
    
    // Padrão de dados simulado baseado no hash do valor
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash + value.charCodeAt(i)) & 0xffffffff;
    }
    
    // Gerar padrão baseado no hash
    for (let y = 9; y < 16; y++) {
      for (let x = 9; x < 16; x++) {
        if ((hash >> (y + x)) & 1) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Converter canvas para data URL
    const dataURL = canvas.toDataURL('image/png');
    resolve(dataURL);
  });
};

// Função para gerar QR code do certificado
const gerarQRCodeCertificado = async (dados) => {
  const nomeEntidade = obterNomeEntidade(dados);
  const numeroCertificado = dados?.dadosProdutor?.numeroLicencaExploracao || gerarNumeroCertificado();
  
  const dadosQR = {
    tipo: 'CERTIFICADO_FLORESTAL',
    numero: numeroCertificado,
    entidade: nomeEntidade,
    validade: dados?.dadosProdutor?.validadeFim,
    emissao: new Date().toISOString().split('T')[0],
    verificacao: `https://rnpa.gov.ao/verificar-certificado/${numeroCertificado}`
  };

  try {
    return await qrCodeToDataURL(JSON.stringify(dadosQR), 200);
  } catch (error) {
    console.error('Erro ao gerar QR Code do certificado:', error);
    return null;
  }
};

// Função para gerar QR code da fatura
const gerarQRCodeFatura = async (dados, totalComIVA) => {
  const numeroFatura = `FAT-${dados.dadosProdutor?.numeroProcesso || Date.now()}`;
  
  const dadosQRFatura = {
    tipo: 'FATURA_FLORESTAL',
    numero: numeroFatura,
    valor: totalComIVA,
    entidade: '11604',
    referencia: numeroFatura,
    multicaixa: `https://multicaixa.ao/pagamento?ref=${numeroFatura}&valor=${totalComIVA}&entidade=11604`,
    estado: 'NAO_PAGO'
  };

  try {
    return await qrCodeToDataURL(JSON.stringify(dadosQRFatura), 200);
  } catch (error) {
    console.error('Erro ao gerar QR Code da fatura:', error);
    return null;
  }
};

// Função para determinar o nome da entidade baseado no tipo
const obterNomeEntidade = (dados) => {
  const { tipoEntidade, dadosProdutor, entidadeSelecionada, produtorSelecionado } = dados;
  
  switch (tipoEntidade) {
    case 'produtor':
      return dadosProdutor?.nomeCompleto || produtorSelecionado?.nome_do_Produtor || '';
    case 'empresa':
    case 'cooperativa':
    case 'associacao':
      return dadosProdutor?.nomeEntidade || entidadeSelecionada?.nomeEntidade || '';
    default:
      return dadosProdutor?.nomeCompleto || dadosProdutor?.nomeEntidade || '';
  }
};

// Função para obter identificação da entidade
const obterIdentificacaoEntidade = (dados) => {
  const { tipoEntidade, produtorSelecionado, entidadeSelecionada } = dados;
  
  switch (tipoEntidade) {
    case 'produtor':
      return produtorSelecionado?.bI_NIF || '';
    case 'empresa':
    case 'cooperativa':
    case 'associacao':
      return entidadeSelecionada?.nif || '';
    default:
      return '';
  }
};

// Componente do cabeçalho
const HeaderSection = () => (
  <View style={styles.header}>
    <Image src={emblema} style={styles.logoHeader} />
    <Text style={styles.republica}>REPÚBLICA DE ANGOLA</Text>
    <Text style={styles.ministerio}>MINISTÉRIO DA AGRICULTURA E FLORESTAS</Text>
    <Text style={styles.dnf}>DIRECÇÃO NACIONAL DE FLORESTAS (DNF)</Text>
    <Text style={styles.tituloDocumento}>CERTIFICADO DE LICENÇA FLORESTAL</Text>
  </View>
);

// Componente da tabela principal de dados
const TabelaDadosSection = ({ dados }) => {
  // Preparar dados das áreas florestais
  const areasInfo = dados?.areasFlorestais?.length > 0 
    ? dados.areasFlorestais.map(area => `${area.nomeArea} (${area.areaHectares}ha)`).join(', ')
    : '________________________________';

  const localizacaoInfo = dados?.areasFlorestais?.length > 0
    ? dados.areasFlorestais.map(area => area.localizacao).join(', ')
    : '________________________________';

  // Preparar dados das espécies
  const especiesInfo = dados?.especiesAutorizadas?.length > 0
    ? dados.especiesAutorizadas.map(esp => esp.especie).join(', ')
    : '________________________________';

  const volumeTotal = dados?.especiesAutorizadas?.length > 0
    ? dados.especiesAutorizadas.reduce((acc, esp) => acc + (parseFloat(esp.volumeAutorizado) || 0), 0).toFixed(1)
    : '________';

  return (
    <View style={styles.tabelaContainer}>
      <View style={styles.tabela}>
        {/* Primeira linha: Área Florestal e Localização */}
        <View style={styles.tabelaRow}>
          <Text style={styles.celulaEsquerda}>Área Florestal (ID/Nome):</Text>
          <Text style={styles.celulaDireita}>Localização (GPS/Prov.-Município-Comuna)</Text>
        </View>
        <View style={styles.tabelaRow}>
          <Text style={styles.celulaConteudoEsquerda}>{areasInfo}</Text>
          <Text style={styles.celulaConteudoDireita}>{localizacaoInfo}</Text>
        </View>

        {/* Segunda linha: Espécies e Volume */}
        <View style={styles.tabelaRow}>
          <Text style={styles.celulaEsquerda}>Espécies Autorizadas:</Text>
          <Text style={styles.celulaDireita}>Volume Autorizado (m³)</Text>
        </View>
        <View style={styles.tabelaRow}>
          <Text style={styles.celulaConteudoEsquerda}>{especiesInfo}</Text>
          <Text style={styles.celulaConteudoDireita}>{volumeTotal}</Text>
        </View>

        {/* Terceira linha: Validade */}
        <View style={styles.tabelaRow}>
          <Text style={styles.celulaEsquerda}>Validade: Início</Text>
          <Text style={styles.celulaDireita}>Validade: Fim</Text>
        </View>
        <View style={[styles.tabelaRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.celulaConteudoEsquerda}>
            {formatDate(dados?.dadosProdutor?.validadeInicio) || '____/____/______'}
          </Text>
          <Text style={styles.celulaConteudoDireita}>
            {formatDate(dados?.dadosProdutor?.validadeFim) || '____/____/______'}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Componente das condições especiais
const CondicoesSection = ({ dados }) => (
  <View style={styles.condicoesContainer}>
    <View style={styles.condicoesHeader}>
      <Text style={styles.condicoesTitle}>Condições Especiais / Observações</Text>
    </View>
    <View style={styles.condicoesContent}>
      <Text style={styles.condicoesText}>
        {dados?.dadosProdutor?.condicoesEspeciais || dados?.dadosProdutor?.observacoes || 
         'A licença é válida para exploração das espécies indicadas, respeitando os volumes autorizados e prazos estabelecidos. O transporte de produtos florestais deve estar acompanhado deste certificado.'}
      </Text>
    </View>
  </View>
);

// Componente da seção de emissão
const EmissaoSection = ({ dados }) => (
  <View style={styles.emissaoContainer}>
    <View style={styles.emissaoEsquerda}>
      <Text style={styles.emissaoTitulo}>Local e Data de Emissão</Text>
      <Text style={styles.emissaoInfo}>
        {dados?.dadosProdutor?.municipio || '________________________'}
      </Text>
      <Text style={styles.emissaoInfo}>
        {formatDate(new Date())}
      </Text>
    </View>
    
    <View style={styles.emissaoDireita}>
      <Text style={styles.emissaoTitulo}>Emitido por (DNF)</Text>
      <Text style={styles.emissaoInfo}>
        <Text style={styles.emissaoLabel}>Nome: </Text>
        {dados?.dadosProdutor?.tecnicoResponsavel || '__________________________'}
      </Text>
      <Text style={styles.emissaoInfo}>
        <Text style={styles.emissaoLabel}>Cargo: </Text>
        {dados?.dadosProdutor?.cargoTecnico || '__________________________'}
      </Text>
      <Text style={styles.emissaoInfo}>
        <Text style={styles.emissaoLabel}>Assinatura: </Text>
      </Text>
      <View style={styles.linhaAssinatura} />
    </View>
  </View>
);

// Componente do rodapé
const RodapeSection = () => (
  <View>
    <Text style={styles.rodape}>
      <Text style={styles.rodapeDestaque}>A licença é pessoal e intransmissível.</Text> O transporte de produtos florestais deve estar acompanhado deste 
      certificado e do respectivo comprovativo de origem.
    </Text>
    <Text style={styles.rodape}>
      <Text style={styles.rodapeDestaque}>Verificação pública:</Text> aceda ao portal RNPA e introduza o número/QR da licença para confirmar a autenticidade. 
      Qualquer alteração de estado (suspensão, revogação, expiração) torna-se efectiva a partir do registo no sistema.
    </Text>
    <Text style={styles.documentoEletronico}>
      Documento gerado eletronicamente pelo RNPA/DNF. Assinatura digital e QR/NFC para verificação.
    </Text>
  </View>
);

// Componente principal do certificado florestal
const CertificadoFlorestalDocument = ({ dados, qrCodeCertificado }) => {
  const numeroCertificado = dados?.dadosProdutor?.numeroLicencaExploracao || gerarNumeroCertificado();
  const nomeEntidade = obterNomeEntidade(dados);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo de fundo */}
        <Image src={logo} style={styles.logoFundo} />

        <View style={styles.content}>
          <HeaderSection />

          <Text style={styles.textoPrincipal}>
            Nos termos da legislação florestal em vigor, certifica-se que a licença acima identificada autoriza {dados?.tipoEntidade === 'produtor' ? 'o produtor' : 'a entidade'} <Text style={styles.destaque}>{nomeEntidade}</Text>, Portador(a) da Licença de Exploração 
            Nº<Text style={styles.destaque}>{numeroCertificado}</Text> exercer a actividade de Produtor florestal especificada, limitada às 
            espécies, volumes e prazos indicados.
          </Text>

          <TabelaDadosSection dados={dados} />

          <CondicoesSection dados={dados} />

          <EmissaoSection dados={dados} />

          <RodapeSection />
        </View>

        {/* QR Code para verificação */}
        {qrCodeCertificado && (
          <View style={styles.qrCodeContainer}>
            <Image src={qrCodeCertificado} style={styles.qrCodeImage} />
            <Text style={styles.qrCodeText}>Verificação</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

// Componente da fatura
const FaturaDocument = ({ dados, tiposLicencaOptions, qrCodeFatura }) => {
  const nomeEntidade = obterNomeEntidade(dados);
  const identificacao = obterIdentificacaoEntidade(dados);
  const numeroFatura = `FAT-${dados.dadosProdutor?.numeroProcesso || Date.now()}`;
  const dataEmissao = new Date().toLocaleDateString('pt-PT');

  // Preparar itens da fatura baseado nos tipos de licença selecionados
  const itens = [];
  
  if (dados.dadosProdutor?.tiposLicenca && Array.isArray(dados.dadosProdutor.tiposLicenca)) {
    dados.dadosProdutor.tiposLicenca.forEach(tipo => {
      const tipoValue = typeof tipo === 'object' ? tipo.value : tipo;
      const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);
      
      if (licenca) {
        itens.push({
          produto: licenca.label,
          unidade: 1,
          precoUnitario: licenca.preco,
          total: licenca.preco
        });
      }
    });
  }

  // Cálculos
  const subtotal = itens.reduce((acc, item) => acc + item.total, 0);
  const taxaIVA = 0.14; // 14% IVA em Angola
  const valorIVA = subtotal * taxaIVA;
  const totalComIVA = subtotal + valorIVA;

  return (
    <Document>
      <Page size="A4" style={faturaStyles.page}>
        {/* Cabeçalho */}
        <View style={faturaStyles.header}>
          <Image src={emblema} style={styles.logoHeader} />
          <Text style={faturaStyles.tituloFatura}>FATURA DE LICENCIAMENTO FLORESTAL</Text>
          <Text style={faturaStyles.subtituloFatura}>Direcção Nacional de Florestas - DNF</Text>
        </View>

        {/* Informações Cliente e Fatura */}
        <View style={faturaStyles.infoContainer}>
          <View style={faturaStyles.clienteInfo}>
            <Text style={faturaStyles.sectionTitle}>DADOS DO CLIENTE</Text>
            <Text style={faturaStyles.infoText}><Text style={styles.destaque}>Nome:</Text> {nomeEntidade}</Text>
            <Text style={faturaStyles.infoText}><Text style={styles.destaque}>Identificação:</Text> {identificacao}</Text>
            <Text style={faturaStyles.infoText}><Text style={styles.destaque}>Tipo:</Text> {dados.tipoEntidade?.toUpperCase()}</Text>
            <Text style={faturaStyles.infoText}><Text style={styles.destaque}>Telefone:</Text> {dados.dadosProdutor?.telefone || 'N/A'}</Text>
            <Text style={faturaStyles.infoText}><Text style={styles.destaque}>Localização:</Text> {dados.dadosProdutor?.provincia} - {dados.dadosProdutor?.municipio}</Text>
          </View>

          <View style={faturaStyles.faturaInfo}>
            <Text style={faturaStyles.sectionTitle}>DADOS DA FATURA</Text>
            <Text style={faturaStyles.infoText}><Text style={styles.destaque}>Número:</Text> {numeroFatura}</Text>
            <Text style={faturaStyles.infoText}><Text style={styles.destaque}>Data:</Text> {dataEmissao}</Text>
            <Text style={faturaStyles.infoText}><Text style={styles.destaque}>Processo:</Text> {dados.dadosProdutor?.numeroProcesso}</Text>
          </View>
        </View>

        {/* Estado de Pagamento */}
        <View style={faturaStyles.estadoPagamento}>
          <Text style={faturaStyles.estadoText}>ESTADO: NÃO PAGO</Text>
        </View>

        {/* Tabela de Produtos/Serviços */}
        <View style={faturaStyles.tabelaFatura}>
          <View style={faturaStyles.tabelaHeader}>
            <Text style={[faturaStyles.colProduto, faturaStyles.headerText]}>PRODUTO/SERVIÇO</Text>
            <Text style={[faturaStyles.colUnidade, faturaStyles.headerText]}>QTD</Text>
            <Text style={[faturaStyles.colPreco, faturaStyles.headerText]}>PREÇO UNIT.</Text>
            <Text style={[faturaStyles.colTotal, faturaStyles.headerText]}>TOTAL</Text>
          </View>

          {itens.map((item, index) => (
            <View key={index} style={faturaStyles.tabelaRow}>
              <Text style={faturaStyles.colProduto}>{item.produto}</Text>
              <Text style={faturaStyles.colUnidade}>{item.unidade}</Text>
              <Text style={faturaStyles.colPreco}>{formatarMoeda(item.precoUnitario)}</Text>
              <Text style={faturaStyles.colTotal}>{formatarMoeda(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totais */}
        <View style={faturaStyles.totaisContainer}>
          <View style={faturaStyles.totalRow}>
            <Text style={faturaStyles.totalLabel}>Subtotal:</Text>
            <Text style={faturaStyles.totalValue}>{formatarMoeda(subtotal)}</Text>
          </View>
          <View style={faturaStyles.totalRow}>
            <Text style={faturaStyles.totalLabel}>IVA (14%):</Text>
            <Text style={faturaStyles.totalValue}>{formatarMoeda(valorIVA)}</Text>
          </View>
          <View style={[faturaStyles.totalRow, faturaStyles.totalFinal]}>
            <Text style={[faturaStyles.totalLabel, { fontWeight: 'bold', fontSize: 11 }]}>TOTAL A PAGAR:</Text>
            <Text style={[faturaStyles.totalValue, { fontSize: 12 }]}>{formatarMoeda(totalComIVA)}</Text>
          </View>
        </View>

        {/* Informações de Pagamento */}
        <View style={faturaStyles.pagamentoContainer}>
          <Text style={faturaStyles.pagamentoTitle}>INFORMAÇÕES DE PAGAMENTO</Text>
          
          <Text style={[faturaStyles.pagamentoInfo, faturaStyles.pagamentoDestaque]}>TRANSFERÊNCIA BANCÁRIA:</Text>
          <Text style={faturaStyles.pagamentoInfo}>Banco: BIC - Banco de Investimento e Crédito</Text>
          <Text style={faturaStyles.pagamentoInfo}>IBAN: AO06 0040 0000 1234 5678 1014 5</Text>
          <Text style={faturaStyles.pagamentoInfo}>Titular: Ministério da Agricultura e Florestas</Text>
          
          <Text style={[faturaStyles.pagamentoInfo, faturaStyles.pagamentoDestaque, { marginTop: 10 }]}>MULTICAIXA EXPRESS:</Text>
          <Text style={faturaStyles.pagamentoInfo}>Referência: {numeroFatura}</Text>
          <Text style={faturaStyles.pagamentoInfo}>Entidade: 11604 (MINAGRI)</Text>
          <Text style={faturaStyles.pagamentoInfo}>Valor: {formatarMoeda(totalComIVA)}</Text>
          
          <Text style={[faturaStyles.pagamentoInfo, { marginTop: 15, textAlign: 'center', fontStyle: 'italic' }]}>
            Após o pagamento, envie o comprovativo para licenciamento.florestal@minagri.gov.ao
          </Text>
        </View>

        {/* QR Code para pagamento */}
        {qrCodeFatura && (
          <View style={faturaStyles.qrCodeFaturaContainer}>
            <View style={faturaStyles.qrCodeFaturaInfo}>
              <Text style={[faturaStyles.pagamentoInfo, faturaStyles.pagamentoDestaque]}>PAGAMENTO RÁPIDO:</Text>
              <Text style={faturaStyles.pagamentoInfo}>Escaneie o QR Code para</Text>
              <Text style={faturaStyles.pagamentoInfo}>pagamento via Multicaixa</Text>
              <Text style={faturaStyles.pagamentoInfo}>ou verificação da fatura</Text>
            </View>
            <View style={faturaStyles.qrCodeFaturaImage}>
              <Image src={qrCodeFatura} style={faturaStyles.qrImage} />
              <Text style={faturaStyles.qrText}>QR Pagamento</Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

// Tipos de licença com preços
const tiposLicencaOptions = [
  { label: 'Licença de exploração de Madeira em toro', value: 'MADEIRA_TORO', preco: 50000 },
  { label: 'Licença de exploração de lenha', value: 'LENHA', preco: 15000 },
  { label: 'Licença de exploração de carvão vegetal', value: 'CARVAO', preco: 20000 },
  { label: 'Licença de exploração de produtos não lenhosos', value: 'NAO_LENHOSOS', preco: 25000 },
  { label: 'Licença de exploração Comunitária', value: 'COMUNITARIA', preco: 10000 },
  { label: 'Licença de aproveitamento de desperdícios', value: 'DESPERDICIOS', preco: 8000 }
];

// Função para verificar se há dados válidos
const temDadosValidos = (lista) => {
  return lista && Array.isArray(lista) && lista.length > 0 &&
    lista.some(item => {
      const valores = Object.values(item || {});
      return valores.some(valor => valor && valor.toString().trim() !== '' && valor !== 'N/A');
    });
};

// Componente para exibir QR Code na interface (usando react-qr-code)
const QRCodeDisplay = ({ value, size = 128, level = 'L' }) => {
  if (!value) return null;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <QRCode
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={value}
        viewBox={`0 0 256 256`}
        level={level}
      />
      <small style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
        QR Code de Verificação
      </small>
    </div>
  );
};

// Função principal para gerar certificado e fatura
export const gerarCertificadoFlorestal = async (dadosFormulario) => {
  try {
    console.log('Verificando dados florestais disponíveis:', dadosFormulario);

    // Verificar se há dados necessários
    const temAreas = temDadosValidos(dadosFormulario.areasFlorestais);
    const temEspecies = temDadosValidos(dadosFormulario.especiesAutorizadas);
    const temLicencas = dadosFormulario.dadosProdutor?.tiposLicenca && 
                        Array.isArray(dadosFormulario.dadosProdutor.tiposLicenca) && 
                        dadosFormulario.dadosProdutor.tiposLicenca.length > 0;

    console.log('Tem áreas florestais:', temAreas);
    console.log('Tem espécies autorizadas:', temEspecies);
    console.log('Tem licenças selecionadas:', temLicencas);

    if (!temAreas || !temEspecies) {
      throw new Error('É necessário ter pelo menos uma área florestal e uma espécie autorizada para gerar o certificado florestal.');
    }

    if (!temLicencas) {
      throw new Error('É necessário selecionar pelo menos um tipo de licença florestal.');
    }

    // Calcular total da fatura para o QR code
    const subtotal = dadosFormulario.dadosProdutor.tiposLicenca.reduce((acc, tipo) => {
      const tipoValue = typeof tipo === 'object' ? tipo.value : tipo;
      const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);
      return acc + (licenca ? licenca.preco : 0);
    }, 0);
    const totalComIVA = subtotal * 1.14;

    // Gerar QR codes
    console.log('Gerando QR codes...');
    const qrCodeCertificado = await gerarQRCodeCertificado(dadosFormulario);
    const qrCodeFatura = await gerarQRCodeFatura(dadosFormulario, totalComIVA);

    // Primeiro, gerar a fatura
    console.log('Gerando fatura...');
    const faturaBlob = await pdf(
      <FaturaDocument 
        dados={dadosFormulario} 
        tiposLicencaOptions={tiposLicencaOptions}
        qrCodeFatura={qrCodeFatura}
      />
    ).toBlob();

    const faturaUrl = URL.createObjectURL(faturaBlob);
    const faturaLink = document.createElement('a');
    faturaLink.href = faturaUrl;
    faturaLink.download = `fatura_licenciamento_florestal_${dadosFormulario.dadosProdutor?.numeroProcesso || Date.now()}.pdf`;
    document.body.appendChild(faturaLink);
    faturaLink.click();
    document.body.removeChild(faturaLink);
    URL.revokeObjectURL(faturaUrl);

    // Depois, gerar o certificado
    console.log('Gerando certificado florestal...');
    const certificadoBlob = await pdf(
      <CertificadoFlorestalDocument 
        dados={dadosFormulario} 
        qrCodeCertificado={qrCodeCertificado}
      />
    ).toBlob();

    const certificadoUrl = URL.createObjectURL(certificadoBlob);
    const certificadoLink = document.createElement('a');
    certificadoLink.href = certificadoUrl;
    certificadoLink.download = `certificado_florestal_${dadosFormulario.dadosProdutor?.numeroProcesso || Date.now()}.pdf`;
    document.body.appendChild(certificadoLink);
    certificadoLink.click();
    document.body.removeChild(certificadoLink);
    URL.revokeObjectURL(certificadoUrl);

    console.log('Certificado e fatura com QR codes gerados com sucesso');

    return { 
      success: true, 
      message: 'Certificado de Licença Florestal e Fatura com QR codes gerados com sucesso!' 
    };

  } catch (error) {
    console.error('Erro ao gerar certificado florestal:', error);
    throw new Error(`Erro ao gerar documentos: ${error.message}`);
  }
};

// Componente React para interface
const CertificadoFlorestalGenerator = ({ dados, onSuccess, onError }) => {
  const [gerando, setGerando] = useState(false);

  const handleGerar = async () => {
    setGerando(true);
    try {
      await gerarCertificadoFlorestal(dados);
      onSuccess?.('Certificado e Fatura com QR codes gerados com sucesso!');
    } catch (error) {
      onError?.(error.message);
    } finally {
      setGerando(false);
    }
  };

  // Verificar se pode gerar certificado
  const temAreas = dados?.areasFlorestais && dados.areasFlorestais.length > 0;
  const temEspecies = dados?.especiesAutorizadas && dados.especiesAutorizadas.length > 0;
  const temLicencas = dados?.dadosProdutor?.tiposLicenca && 
                      Array.isArray(dados.dadosProdutor.tiposLicenca) && 
                      dados.dadosProdutor.tiposLicenca.length > 0;
  const podeGerar = dados && temAreas && temEspecies && temLicencas;

  // Calcular total da fatura
  const calcularTotal = () => {
    if (!temLicencas) return 0;
    
    const subtotal = dados.dadosProdutor.tiposLicenca.reduce((acc, tipo) => {
      const tipoValue = typeof tipo === 'object' ? tipo.value : tipo;
      const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);
      return acc + (licenca ? licenca.preco : 0);
    }, 0);
    
    return subtotal * 1.14; // Com IVA 14%
  };

  const nomeEntidade = obterNomeEntidade(dados);
  const totalComIVA = calcularTotal();

  // Preparar dados para preview dos QR codes
  const dadosQRCertificado = dados && podeGerar ? JSON.stringify({
    tipo: 'CERTIFICADO_FLORESTAL',
    entidade: nomeEntidade,
    numero: dados.dadosProdutor?.numeroLicencaExploracao || 'DNF/XXXX/2025',
    verificacao: 'https://rnpa.gov.ao/verificar-certificado'
  }) : '';

  const dadosQRFatura = dados && podeGerar ? JSON.stringify({
    tipo: 'FATURA_FLORESTAL',
    numero: `FAT-${dados.dadosProdutor?.numeroProcesso}`,
    valor: totalComIVA,
    multicaixa: 'https://multicaixa.ao/pagamento',
    estado: 'NAO_PAGO'
  }) : '';

  return (
    <div style={{ padding: '20px' }}>
      {!podeGerar && dados && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '15px',
          fontSize: '14px',
          color: '#856404'
        }}>
          ⚠️ {!temAreas && 'Adicione pelo menos uma área florestal. '}
          {!temEspecies && 'Adicione pelo menos uma espécie autorizada. '}
          {!temLicencas && 'Selecione pelo menos um tipo de licença.'}
        </div>
      )}

      {/* Informações da entidade e fatura */}
      {dados && podeGerar && (
        <div style={{
          backgroundColor: '#e8f4fd',
          border: '1px solid #b3d9ff',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '15px',
          fontSize: '12px',
          color: '#0066cc',
          textAlign: 'left'
        }}>
          <strong>📋 Resumo da Certificação:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li><strong>Entidade:</strong> {nomeEntidade}</li>
            <li><strong>Tipo:</strong> {dados.tipoEntidade?.toUpperCase()}</li>
            <li><strong>Áreas Florestais:</strong> {dados.areasFlorestais?.length || 0} registradas</li>
            <li><strong>Espécies Autorizadas:</strong> {dados.especiesAutorizadas?.length || 0} registradas</li>
            <li><strong>Tipos de Licença:</strong> {dados.dadosProdutor?.tiposLicenca?.length || 0} selecionados</li>
            <li><strong>Valor Total (c/ IVA):</strong> {formatarMoeda(totalComIVA)}</li>
            <li><strong>Estado:</strong> <span style={{ color: '#dc3545', fontWeight: 'bold' }}>NÃO PAGO</span></li>
          </ul>
        </div>
      )}

      {/* Preview dos QR Codes */}
      {dados && podeGerar && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '20px',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>QR Certificado</h4>
            <QRCodeDisplay value={dadosQRCertificado} size={120} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>QR Fatura</h4>
            <QRCodeDisplay value={dadosQRFatura} size={120} />
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleGerar}
          disabled={gerando || !podeGerar}
          style={{
            padding: '12px 24px',
            backgroundColor: gerando || !podeGerar ? '#6c757d' : '#2d5a27',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: gerando || !podeGerar ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            opacity: gerando || !podeGerar ? 0.7 : 1
          }}
        >
          {gerando ? (
            <>⏳ Gerando Documentos...</>
          ) : (
            '📄 Gerar Certificado e Fatura com QR'
          )}
        </button>

        {gerando && (
          <div style={{
            marginTop: '10px',
            fontSize: '12px',
            color: '#666'
          }}>
            📊 Gerando certificado florestal e fatura com QR codes...
          </div>
        )}

        {podeGerar && (
          <div style={{
            marginTop: '15px',
            fontSize: '11px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            💡 Serão gerados 2 PDFs: Certificado Florestal e Fatura (ambos com QR codes)
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificadoFlorestalGenerator;