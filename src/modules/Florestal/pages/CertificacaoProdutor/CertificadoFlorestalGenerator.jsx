import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { useState } from 'react';
import emblema from '../../../../assets/emblema.png';
import logo from '../../../../assets/SIGAF.png';

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

  rnpaSubtitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#000'
  },

  // Texto principal do certificado
  textoPrincipal: {
    fontSize: 9,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 15
  },

  textoLicencas: {
    fontSize: 9,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 15,
    fontStyle: 'italic',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2d5a27',
    borderLeftStyle: 'solid'
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

  // Seção do QR Code
  qrCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#000'
  },

  qrCodeSection: {
    alignItems: 'center',
    width: '30%'
  },

  qrCodeImage: {
    width: 80,
    height: 80,
    marginBottom: 5
  },

  qrCodeText: {
    fontSize: 7,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  verificacaoSection: {
    width: '65%',
    paddingLeft: 10
  },

  verificacaoTitulo: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 3
  },

  verificacaoTexto: {
    fontSize: 7,
    lineHeight: 1.3,
    marginBottom: 2
  },

  numeroCertificado: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5
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
  }
});

// Tipos de licença com preços atualizados
const tiposLicencaOptions = [
  { label: 'Licença de Exploração Florestal', value: 'EXPLORACAO_FLORESTAL', preco: 77000 },
  { label: 'Licença de Plantio Florestal', value: 'PLANTIO_FLORESTAL', preco: 150000 },
  { label: 'Licença de Manejo Florestal', value: 'MANEJO_FLORESTAL', preco: 12000 },
  { label: 'Licença de Reflorestamento', value: 'REFLORESTAMENTO', preco: 32000 },
  { label: 'Licença de exploração de Madeira em toro', value: 'MADEIRA_TORO', preco: 50000 },
  { label: 'Licença de exploração de lenha', value: 'LENHA', preco: 15000 },
  { label: 'Licença de exploração de carvão vegetal', value: 'CARVAO', preco: 20000 },
  { label: 'Licença de exploração de produtos não lenhosos', value: 'NAO_LENHOSOS', preco: 25000 },
  { label: 'Licença de exploração Comunitária', value: 'COMUNITARIA', preco: 10000 },
  { label: 'Licença de aproveitamento de desperdícios', value: 'DESPERDICIOS', preco: 8000 }
];

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

// Função para calcular valores da fatura com IVA - CORRIGIDA
const calcularValoresFatura = (dadosFormulario) => {
  console.log('🔍 Calculando valores da fatura com dados:', dadosFormulario);

  const TAXA_IVA = 0.14; // 14% IVA em Angola

  // Processar os tipos de licença que podem vir em diferentes formatos
  let tiposParaCalcular = [];

  // Primeiro, tentar pegar de tiposLicenca (formato já processado)
  if (dadosFormulario.tiposLicenca && Array.isArray(dadosFormulario.tiposLicenca)) {
    tiposParaCalcular = dadosFormulario.tiposLicenca;
    console.log('✅ Usando tiposLicenca:', tiposParaCalcular);
  }
  // Se não tiver, tentar pegar de tipoDeLicencaFlorestal (formato da API)
  else if (dadosFormulario.tipoDeLicencaFlorestal && Array.isArray(dadosFormulario.tipoDeLicencaFlorestal)) {
    try {
      const tiposString = dadosFormulario.tipoDeLicencaFlorestal[0];
      if (typeof tiposString === 'string') {
        tiposParaCalcular = JSON.parse(tiposString);
        console.log('✅ Processando tipoDeLicencaFlorestal:', tiposParaCalcular);
      } else if (Array.isArray(tiposString)) {
        tiposParaCalcular = tiposString;
      }
    } catch (e) {
      console.warn('⚠️ Erro ao processar tipoDeLicencaFlorestal:', e);
      tiposParaCalcular = [];
    }
  }

  console.log('🎯 Tipos para calcular:', tiposParaCalcular);

  if (!Array.isArray(tiposParaCalcular) || tiposParaCalcular.length === 0) {
    console.log('⚠️ Nenhum tipo de licença encontrado para calcular');
    return { subtotal: 0, iva: 0, total: 0, itens: [] };
  }

  const itens = tiposParaCalcular.map(tipoLicenca => {
    const tipoValue = typeof tipoLicenca === 'object' ? tipoLicenca.value : tipoLicenca;
    const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);

    if (licenca) {
      const precoUnitario = licenca.preco;
      const quantidade = 1;
      const subtotalItem = precoUnitario * quantidade;
      const ivaItem = subtotalItem * TAXA_IVA;
      const totalItem = subtotalItem + ivaItem;

      console.log(`💰 Item calculado: ${licenca.label} - Preço: ${precoUnitario} AOA`);

      return {
        produto: licenca.label,
        codigo: licenca.value,
        unidade: 'UN',
        quantidade,
        precoUnitario,
        subtotal: subtotalItem,
        iva: ivaItem,
        total: totalItem
      };
    } else {
      console.warn(`❌ Licença não encontrada para: ${tipoValue}`);
    }
    return null;
  }).filter(Boolean);

  const subtotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
  const iva = itens.reduce((acc, item) => acc + item.iva, 0);
  const total = subtotal + iva;

  console.log('📊 Valores calculados:', { subtotal, iva, total, itens: itens.length });

  return { subtotal, iva, total, itens };
};

// Função para gerar QR Code com os dados do certificado
const gerarQRCode = async (dados) => {
  try {
    const numeroCertificado = dados?.numeroLicencaExploracao || gerarNumeroCertificado();

    // Dados que serão codificados no QR Code
    const dadosQR = {
      certificado: numeroCertificado,
      empresa: dados?.nomeEmpresa || dados?.nomeEntidade || dados?.nomeCompleto || '',
      licenca: dados?.numeroLicencaExploracao || '',
      tipo: dados?.tipoLicenca || '',
      validadeInicio: formatDate(dados?.validadeInicio || dados?.validoDe) || '',
      validadeFim: formatDate(dados?.validadeFim || dados?.validoAte) || '',
      tecnico: dados?.tecnicoResponsavel || dados?.nomeDoTecnicoResponsavel || '',
      dataEmissao: formatDate(new Date()),
      verificacao: `https://rnpa.gov.ao/verificar/${numeroCertificado}`,
      // Adicionar resumo das áreas e espécies
      totalAreas: dados?.areasFlorestais?.length || 0,
      totalEspecies: dados?.especiesAutorizadas?.length || 0,
      volumeTotal: dados?.especiesAutorizadas?.reduce((acc, esp) =>
        acc + (parseFloat(esp.volumeAutorizado) || 0), 0).toFixed(1) || '0.0'
    };

    // Converter para JSON string
    const dadosString = `Certificado: ${dadosQR.certificado}
Empresa: ${dadosQR.empresa}
Licença: ${dadosQR.licenca}
Tipo: ${dadosQR.tipo}
Válido de: ${dadosQR.validadeInicio}
Válido até: ${dadosQR.validadeFim}
Técnico: ${dadosQR.tecnico}
Emitido em: ${dadosQR.dataEmissao}
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
    console.error('Erro ao gerar QR Code:', error);
    return null;
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

// Função para processar tipos de licença e gerar texto
const processarTiposLicenca = (dados) => {
  let tiposProcessados = [];

  // Processar tipos de licença
  if (dados?.tiposLicenca && Array.isArray(dados.tiposLicenca)) {
    tiposProcessados = dados.tiposLicenca;
  } else if (dados?.tipoDeLicencaFlorestal && Array.isArray(dados.tipoDeLicencaFlorestal)) {
    try {
      const tiposString = dados.tipoDeLicencaFlorestal[0];
      if (typeof tiposString === 'string') {
        tiposProcessados = JSON.parse(tiposString);
      } else if (Array.isArray(tiposString)) {
        tiposProcessados = tiposString;
      }
    } catch (e) {
      console.warn('Erro ao processar tipos de licença no certificado:', e);
    }
  }

  if (tiposProcessados.length > 0) {
    const nomesLicencas = tiposProcessados.map(tipo => {
      const tipoValue = typeof tipo === 'object' ? tipo.value : tipo;
      const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);
      return licenca ? licenca.label : tipoValue.replace(/_/g, ' ');
    });

    // Formatação elegante da lista
    if (nomesLicencas.length === 1) {
      return nomesLicencas[0];
    } else if (nomesLicencas.length === 2) {
      return `${nomesLicencas[0]} e ${nomesLicencas[1]}`;
    } else {
      const ultimaLicenca = nomesLicencas.pop();
      return `${nomesLicencas.join(', ')}, e ${ultimaLicenca}`;
    }
  }

  return null;
};

// Componente da tabela principal de dados - ATUALIZADA SEM TIPOS DE LICENÇA
const TabelaDadosSection = ({ dados }) => {
  // Preparar dados das áreas florestais
  const areasInfo = dados?.areasFlorestais?.length > 0
    ? dados.areasFlorestais.map(area =>
      `${area.nomeOuIdDaArea || area.nomeArea || 'Área'} (${area.area || area.areaHectares || 0}ha)`
    ).join(', ')
    : '________________________________';

  const localizacaoInfo = dados?.areasFlorestais?.length > 0
    ? dados.areasFlorestais.map(area => area.localizacao || 'Localização não informada').join(', ')
    : '________________________________';

  // Preparar dados das espécies
  const especiesInfo = dados?.especiesAutorizadas?.length > 0
    ? dados.especiesAutorizadas.map(esp =>
      esp.nomeCientifico || esp.nomeComum || esp.especie || 'Espécie não informada'
    ).join(', ')
    : '________________________________';

  const volumeTotal = dados?.especiesAutorizadas?.length > 0
    ? dados.especiesAutorizadas.reduce((acc, esp) =>
      acc + (parseFloat(esp.volumeAutorizado) || 0), 0
    ).toFixed(1)
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
            {formatDate(dados?.validadeInicio || dados?.validoDe) || '____/____/______'}
          </Text>
          <Text style={styles.celulaConteudoDireita}>
            {formatDate(dados?.validadeFim || dados?.validoAte) || '____/____/______'}
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
        {dados?.condicoesEspeciais || dados?.observacoes ||
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
        {dados?.municipio || '________________________'}
      </Text>
      <Text style={styles.emissaoInfo}>
        {formatDate(new Date())}
      </Text>
    </View>

    <View style={styles.emissaoDireita}>
      <Text style={styles.emissaoTitulo}>Emitido por (DNF)</Text>
      <Text style={styles.emissaoInfo}>
        <Text style={styles.emissaoLabel}>Nome: </Text>
        {dados?.tecnicoResponsavel || dados?.nomeDoTecnicoResponsavel || '__________________________'}
      </Text>
      <Text style={styles.emissaoInfo}>
        <Text style={styles.emissaoLabel}>Cargo: </Text>
        {dados?.cargoTecnico || dados?.cargo || '__________________________'}
      </Text>
      <Text style={styles.emissaoInfo}>
        <Text style={styles.emissaoLabel}>Assinatura: </Text>
      </Text>
      <View style={styles.linhaAssinatura} />
    </View>
  </View>
);

// Componente da seção do QR Code
const QRCodeSection = ({ qrCodeData, numeroCertificado }) => (
  <View style={styles.qrCodeContainer}>
    <View style={styles.qrCodeSection}>
      {qrCodeData && (
        <>
          <Image src={qrCodeData} style={styles.qrCodeImage} />
          <Text style={styles.qrCodeText}>Verificação Digital</Text>
          <Text style={styles.numeroCertificado}>{numeroCertificado}</Text>
        </>
      )}
    </View>

    <View style={styles.verificacaoSection}>
      <Text style={styles.verificacaoTitulo}>Verificação de Autenticidade:</Text>
      <Text style={styles.verificacaoTexto}>
        1. Escaneie o QR Code com seu dispositivo móvel
      </Text>
      <Text style={styles.verificacaoTexto}>
        2. Ou acesse: https://rnpa.gov.ao/verificar/{numeroCertificado}
      </Text>
      <Text style={styles.verificacaoTexto}>
        3. Confirme os dados apresentados com este certificado
      </Text>
      <Text style={styles.verificacaoTexto}>
        <Text style={styles.rodapeDestaque}>Atenção:</Text> Certificados adulterados ou falsificados
        não passarão na verificação digital.
      </Text>
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

// Componente principal do certificado florestal - ATUALIZADO
const CertificadoFlorestalDocument = ({ dados, qrCodeData }) => {
  const numeroCertificado = dados?.numeroLicencaExploracao || gerarNumeroCertificado();

  // Determinar o nome da entidade baseado no tipo
  const nomeEntidade = dados?.nomeEntidade || dados?.nomeCompleto || '________________________________________';

  // Processar tipos de licença para o texto principal
  const tiposLicencaTexto = processarTiposLicenca(dados);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo de fundo */}
        <Image src={logo} style={styles.logoFundo} />

        <View style={styles.content}>
          <HeaderSection />

          <Text style={styles.textoPrincipal}>
            Nos termos da legislação florestal em vigor, certifica-se que a licença acima identificada autoriza a
            empresa <Text style={styles.destaque}>{nomeEntidade}</Text>, Portadora da Licença de Exploração
            Nº<Text style={styles.destaque}>{numeroCertificado}</Text> exercer a actividade de Produtor florestal especificada, limitada às
            espécies, volumes e prazos indicados.
          </Text>

          {/* Texto das licenças autorizadas */}
          {tiposLicencaTexto && (
            <Text style={styles.textoLicencas}>
              Esta licença serve para efeito de <Text style={styles.destaque}>{tiposLicencaTexto}</Text>,
              conforme especificado na legislação florestal vigente e mediante o cumprimento das condições estabelecidas.
            </Text>
          )}

          <TabelaDadosSection dados={dados} />

          <CondicoesSection dados={dados} />

          <EmissaoSection dados={dados} />

          {/* Seção do QR Code */}
          <QRCodeSection qrCodeData={qrCodeData} numeroCertificado={numeroCertificado} />

          <RodapeSection />
        </View>
      </Page>
    </Document>
  );
};

// Componente da Fatura em PDF - ATUALIZADA
const FaturaDocument = ({ dadosFatura, valoresFatura }) => {
  const numeroFatura = `FAT-${dadosFatura.numeroProcesso}-${Date.now()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          {/* Cabeçalho da Fatura */}
          <View style={styles.header}>
            <Image src={emblema} style={styles.logoHeader} />
            <Text style={styles.republica}>REPÚBLICA DE ANGOLA</Text>
            <Text style={styles.ministerio}>MINISTÉRIO DA AGRICULTURA E FLORESTAS</Text>
            <Text style={styles.dnf}>DIRECÇÃO NACIONAL DE FLORESTAS (DNF)</Text>
            <Text style={styles.tituloDocumento}>FATURA DE LICENCIAMENTO FLORESTAL</Text>
          </View>

          {/* Informações da Fatura */}
          <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 10, marginBottom: 3, fontWeight: 'bold' }}>Número da Fatura:</Text>
              <Text style={{ fontSize: 10, marginBottom: 8 }}>{numeroFatura}</Text>

              <Text style={{ fontSize: 10, marginBottom: 3, fontWeight: 'bold' }}>Data de Emissão:</Text>
              <Text style={{ fontSize: 10, marginBottom: 8 }}>{new Date().toLocaleDateString('pt-PT')}</Text>

              <Text style={{ fontSize: 10, marginBottom: 3, fontWeight: 'bold' }}>Estado:</Text>
              <Text style={{ fontSize: 10, color: '#dc2626', fontWeight: 'bold' }}>NÃO PAGO</Text>
            </View>

            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 10, marginBottom: 3, fontWeight: 'bold' }}>Cliente:</Text>
              <Text style={{ fontSize: 10, marginBottom: 2 }}>{dadosFatura.nomeEntidade}</Text>
              <Text style={{ fontSize: 10, marginBottom: 2 }}>Tipo: {dadosFatura.tipoEntidade}</Text>
              <Text style={{ fontSize: 10, marginBottom: 2 }}>Processo Nº: {dadosFatura.numeroProcesso}</Text>
            </View>
          </View>

          {/* Tabela de Itens - Verifica se há itens antes de renderizar */}
          {valoresFatura.itens && valoresFatura.itens.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 8, borderWidth: 1, borderColor: '#000' }}>
                <Text style={{ width: '40%', fontSize: 9, fontWeight: 'bold' }}>Produto/Licença</Text>
                <Text style={{ width: '10%', fontSize: 9, fontWeight: 'bold' }}>Unid.</Text>
                <Text style={{ width: '10%', fontSize: 9, fontWeight: 'bold' }}>Qtd.</Text>
                <Text style={{ width: '15%', fontSize: 9, fontWeight: 'bold' }}>Preço Unit.</Text>
                <Text style={{ width: '12.5%', fontSize: 9, fontWeight: 'bold' }}>Subtotal</Text>
                <Text style={{ width: '12.5%', fontSize: 9, fontWeight: 'bold' }}>Total</Text>
              </View>

              {valoresFatura.itens.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', padding: 8, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#000' }}>
                  <Text style={{ width: '40%', fontSize: 8 }}>{item.produto}</Text>
                  <Text style={{ width: '10%', fontSize: 8 }}>{item.unidade}</Text>
                  <Text style={{ width: '10%', fontSize: 8 }}>{item.quantidade}</Text>
                  <Text style={{ width: '15%', fontSize: 8 }}>{item.precoUnitario.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</Text>
                  <Text style={{ width: '12.5%', fontSize: 8 }}>{item.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</Text>
                  <Text style={{ width: '12.5%', fontSize: 8 }}>{item.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Mostrar mensagem se não há itens */}
          {(!valoresFatura.itens || valoresFatura.itens.length === 0) && (
            <View style={{ marginBottom: 20, padding: 20, borderWidth: 1, borderColor: '#000', textAlign: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#dc2626' }}>
                ATENÇÃO: Nenhum tipo de licença foi processado para esta fatura.
              </Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>
                Verifique se os tipos de licença foram corretamente informados no sistema.
              </Text>
            </View>
          )}

          {/* Totais - só mostrar se há valores */}
          {valoresFatura.total > 0 && (
            <View style={{ marginLeft: 'auto', width: '40%', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                <Text style={{ fontSize: 9 }}>Subtotal:</Text>
                <Text style={{ fontSize: 9 }}>{valoresFatura.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                <Text style={{ fontSize: 9 }}>IVA (14%):</Text>
                <Text style={{ fontSize: 9 }}>{valoresFatura.iva.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#000', paddingTop: 3 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Total:</Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{valoresFatura.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</Text>
              </View>
            </View>
          )}

          {/* Informações de Pagamento - só mostrar se há valor total */}
          {valoresFatura.total > 0 && (
            <View style={{ marginBottom: 20, borderWidth: 1, borderColor: '#000', padding: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>INFORMAÇÕES DE PAGAMENTO</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '48%' }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5 }}>TRANSFERÊNCIA BANCÁRIA:</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>Banco: Banco de Poupança e Crédito</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>Conta: 45.156.000.000.100.101.12</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>IBAN: AO06.0045.0000.4515.6174.1012.1</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>Titular: Ministério da Agricultura</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>Descrição: Licença Florestal - {dadosFatura.numeroProcesso}</Text>
                </View>

                <View style={{ width: '48%' }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5 }}>MULTICAIXA EXPRESS:</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>Código da Entidade: 10524</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>Referência: {dadosFatura.numeroProcesso}</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>Valor: {valoresFatura.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>Terminal: Qualquer terminal Multicaixa</Text>
                  <Text style={{ fontSize: 8, marginBottom: 2 }}>Validade: 30 dias</Text>
                </View>
              </View>
            </View>
          )}

          {/* Instruções */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5 }}>INSTRUÇÕES IMPORTANTES:</Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>1. Guarde o comprovativo de pagamento para levantamento do certificado.</Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>2. O certificado será emitido após confirmação do pagamento (até 48h úteis).</Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>3. Para pagamento por transferência, envie o comprovativo para: licencas.florestais@minagrif.gov.ao</Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>4. Em caso de dúvidas, contacte: +244 222 322 037</Text>
          </View>

          {/* Rodapé da Fatura */}
          <View style={{ borderTopWidth: 1, borderColor: '#000', paddingTop: 10 }}>
            <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 2 }}>Ministério da Agricultura e Florestas - Direcção Nacional de Florestas</Text>
            <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 2 }}>Luanda - Angola | Tel: +244 222 322 037 | Email: dnf@minagrif.gov.ao</Text>
            <Text style={{ fontSize: 6, textAlign: 'center', fontStyle: 'italic', color: '#666' }}>
              Documento gerado eletronicamente em {new Date().toLocaleString('pt-PT')}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Função para verificar se há dados válidos
const temDadosValidos = (lista) => {
  return lista && Array.isArray(lista) && lista.length > 0 &&
    lista.some(item => {
      const valores = Object.values(item || {});
      return valores.some(valor => valor && valor.toString().trim() !== '' && valor !== 'N/A');
    });
};

// Função principal para enviar dados para API e gerar certificado florestal
export const gerarCertificadoFlorestal = async (dadosFormulario) => {
  try {
    console.log('🔍 Verificando dados florestais disponíveis:', dadosFormulario);

    // Verificar se há dados necessários
    const temAreas = temDadosValidos(dadosFormulario.areasFlorestais);
    const temEspecies = temDadosValidos(dadosFormulario.especiesAutorizadas);

    console.log('✅ Tem áreas florestais:', temAreas);
    console.log('✅ Tem espécies autorizadas:', temEspecies);

    if (!temAreas || !temEspecies) {
      throw new Error('É necessário ter pelo menos uma área florestal e uma espécie autorizada para gerar o certificado florestal.');
    }

    // Dados preparados para o certificado
    const dadosCertificado = {
      ...dadosFormulario.dadosProdutor,
      areasFlorestais: dadosFormulario.areasFlorestais,
      especiesAutorizadas: dadosFormulario.especiesAutorizadas,
      historicoExploracoes: dadosFormulario.historicoExploracoes || []
    };

    console.log('📋 Dados do certificado preparados:', dadosCertificado);

    // Calcular valores da fatura
    const valoresFatura = calcularValoresFatura(dadosCertificado);
    console.log('💰 Valores da fatura calculados:', valoresFatura);

    // Dados da fatura
    const dadosFatura = {
      numeroProcesso: dadosCertificado.numeroProcesso || `PROC-${Date.now()}`,
      nomeEntidade: dadosCertificado.nomeEntidade || dadosCertificado.nomeCompleto || 'Entidade',
      tipoEntidade: dadosFormulario.tipoSelecionado || 'Produtor',
      tiposLicenca: dadosCertificado.tiposLicenca || dadosCertificado.tipoDeLicencaFlorestal || [],
      dataEmissao: new Date().toLocaleDateString('pt-PT')
    };

    // Gerar QR Code com os dados do certificado
    console.log('🔄 Gerando QR Code com dados do certificado...');
    const qrCodeData = await gerarQRCode(dadosCertificado);

    if (!qrCodeData) {
      console.warn('⚠️ Não foi possível gerar o QR Code, continuando sem ele...');
    }

    // Gerar fatura PDF primeiro
    console.log('📄 Gerando PDF da fatura...');
    const faturaBlob = await pdf(
      <FaturaDocument dadosFatura={dadosFatura} valoresFatura={valoresFatura} />
    ).toBlob();

    // Download da fatura
    const faturaUrl = URL.createObjectURL(faturaBlob);
    const faturaLink = document.createElement('a');
    faturaLink.href = faturaUrl;
    faturaLink.download = `fatura_florestal_${dadosFatura.numeroProcesso}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(faturaLink);
    faturaLink.click();
    document.body.removeChild(faturaLink);
    URL.revokeObjectURL(faturaUrl);

    // Gerar certificado PDF
    console.log('📜 Gerando PDF do certificado florestal...');
    const certificadoBlob = await pdf(
      <CertificadoFlorestalDocument dados={dadosCertificado} qrCodeData={qrCodeData} />
    ).toBlob();

    // Download do certificado
    const certificadoUrl = URL.createObjectURL(certificadoBlob);
    const certificadoLink = document.createElement('a');
    certificadoLink.href = certificadoUrl;
    certificadoLink.download = `certificado_florestal_${dadosFatura.numeroProcesso}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(certificadoLink);
    certificadoLink.click();
    document.body.removeChild(certificadoLink);
    URL.revokeObjectURL(certificadoUrl);

    console.log('✅ Download da fatura e certificado florestal concluídos');

    return {
      success: true,
      message: `Fatura e Certificado de Licença Florestal gerados com sucesso! ${valoresFatura.total > 0 ? 'Valor total: ' + valoresFatura.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) : ''}`,
      valorTotal: valoresFatura.total
    };

  } catch (error) {
    console.error('❌ Erro ao gerar certificado florestal:', error);
    throw new Error(`Erro ao gerar certificado florestal: ${error.message}`);
  }
};

// Componente React para interface
const CertificadoFlorestalGenerator = ({ dados, onSuccess, onError }) => {
  const [gerando, setGerando] = useState(false);

  const handleGerar = async () => {
    setGerando(true);
    try {
      const resultado = await gerarCertificadoFlorestal(dados);
      onSuccess?.(resultado.message);
    } catch (error) {
      onError?.(error.message);
    } finally {
      setGerando(false);
    }
  };

  // Verificar se pode gerar certificado
  const temAreas = dados?.areasFlorestais && dados.areasFlorestais.length > 0;
  const temEspecies = dados?.especiesAutorizadas && dados.especiesAutorizadas.length > 0;
  const podeGerar = dados && temAreas && temEspecies;

  // Calcular valores da fatura para preview
  const valoresFatura = dados ? calcularValoresFatura(dados.dadosProdutor || dados) : { subtotal: 0, iva: 0, total: 0, itens: [] };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
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
          ⚠️ Adicione pelo menos uma área florestal e uma espécie autorizada para gerar o certificado
        </div>
      )}

      {/* Preview da Fatura */}
      {dados && podeGerar && valoresFatura.itens && valoresFatura.itens.length > 0 && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '15px',
          fontSize: '12px',
          color: '#495057',
          textAlign: 'left'
        }}>
          <strong>💰 Resumo da Fatura:</strong>
          <div style={{ marginTop: '10px' }}>
            {valoresFatura.itens.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>{item.produto}</span>
                <span>{item.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
              </div>
            ))}
            <hr style={{ margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>Subtotal:</span>
              <span>{valoresFatura.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>IVA (14%):</span>
              <span>{valoresFatura.iva.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
              <span>Total:</span>
              <span style={{ color: '#28a745' }}>{valoresFatura.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
          </div>
        </div>
      )}

      {/* Aviso se não há tipos de licença */}
      {dados && podeGerar && (!valoresFatura.itens || valoresFatura.itens.length === 0) && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c2c7',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '15px',
          fontSize: '12px',
          color: '#721c24',
          textAlign: 'left'
        }}>
          <strong>⚠️ Aviso:</strong>
          <div style={{ marginTop: '10px' }}>
            Nenhum tipo de licença foi detectado nos dados. A fatura pode não conter informações de preços.
            Verifique se o campo <strong>tipoDeLicencaFlorestal</strong> ou <strong>tiposLicenca</strong> está presente nos dados.
          </div>
        </div>
      )}

      {/* Debug: Mostrar dados que serão enviados para API */}
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
          <strong>🌲 Dados para Certificação:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li><strong>Entidade:</strong> {dados.dadosProdutor?.nomeEntidade || dados.dadosProdutor?.nomeCompleto || 'N/A'}</li>
            <li><strong>Tipo:</strong> {dados.tipoSelecionado || 'N/A'}</li>
            <li><strong>Licenças:</strong> {
              dados.dadosProdutor?.tiposLicenca?.length ||
              dados.dadosProdutor?.tipoDeLicencaFlorestal?.length ||
              0
            } tipos</li>
            <li><strong>Áreas Florestais:</strong> {dados.areasFlorestais?.length || 0} itens</li>
            <li><strong>Espécies Autorizadas:</strong> {dados.especiesAutorizadas?.length || 0} itens</li>
            <li><strong>Histórico:</strong> {dados.historicoExploracoes?.length || 0} itens</li>
            <li><strong>Técnico:</strong> {dados.dadosProdutor?.tecnicoResponsavel || dados.dadosProdutor?.nomeDoTecnicoResponsavel || 'N/A'}</li>
            <li><strong>QR Code:</strong> ✅ Será gerado com dados do certificado</li>
          </ul>
        </div>
      )}

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
          <>⏳ Gerando Fatura e Certificado...</>
        ) : (
          '🌲 Gerar Fatura e Certificado Florestal'
        )}
      </button>

      {gerando && (
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          color: '#666'
        }}>
          📄 Gerando fatura com IVA e certificado com QR Code...
        </div>
      )}
    </div>
  );
};

export default CertificadoFlorestalGenerator;