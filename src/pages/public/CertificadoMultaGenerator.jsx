import React, { useState } from 'react';
import { Image, Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import emblema from '../../assets/emblema.png';
import logo from '../../assets/SIGAF.png';

// Estilos para o auto de infração oficial
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

  numeroProcesso: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#d32f2f'
  },

  // Texto principal do auto
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
    width: '40%',
    padding: 6,
    fontSize: 8,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#000',
    backgroundColor: '#f0f0f0'
  },

  celulaDireita: {
    width: '60%',
    padding: 6,
    fontSize: 9,
    minHeight: 25
  },

  // Seção de infrações
  infracaoContainer: {
    marginBottom: 15
  },

  infracaoHeader: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    padding: 6,
    backgroundColor: '#ffe6e6'
  },

  infracaoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#d32f2f'
  },

  infracaoContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderStyle: 'solid',
    borderColor: '#000',
    padding: 8,
    minHeight: 60
  },

  infracaoText: {
    fontSize: 9,
    lineHeight: 1.4
  },

  // Seção de sanção
  sancaoContainer: {
    marginBottom: 15,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#d32f2f',
    backgroundColor: '#fff5f5'
  },

  sancaoHeader: {
    backgroundColor: '#d32f2f',
    padding: 8
  },

  sancaoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff'
  },

  sancaoContent: {
    padding: 10
  },

  valorDestaque: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginVertical: 5
  },

  // Seção de responsáveis
  responsavelContainer: {
    flexDirection: 'row',
    marginBottom: 15
  },

  responsavelEsquerda: {
    width: '50%',
    paddingRight: 10
  },

  responsavelDireita: {
    width: '50%',
    paddingLeft: 10
  },

  responsavelTitulo: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center'
  },

  responsavelInfo: {
    fontSize: 8,
    marginBottom: 2
  },

  responsavelLabel: {
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

  numeroAuto: {
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
    fontWeight: 'bold',
    color: '#d32f2f'
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

// Função para formatar valores monetários
const formatCurrency = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA'
  }).format(value);
};

// Função para traduzir tipos de sanção
const getTipoSancaoLabel = (tipo) => {
  const tipos = {
    'MULTA': 'Multa Pecuniária',
    'APREENSAO_EQUIPAMENTOS': 'Apreensão de Equipamentos',
    'APREENSAO_MADEIRA': 'Apreensão de Madeira',
    'SUSPENSAO_ATIVIDADE': 'Suspensão de Atividade',
    'EMBARGAMENTO_OBRA': 'Embargamento de Obra'
  };
  return tipos[tipo] || tipo;
};

// Função para traduzir motivos de sanção
const getMotivoSancaoLabel = (motivo) => {
  const motivos = {
    'DESMATAMENTO_ILEGAL': 'Desmatamento Ilegal',
    'EXPLORACAO_SEM_LICENCA': 'Exploração sem Licença',
    'QUEIMADAS_NAO_AUTORIZADAS': 'Queimadas não Autorizadas',
    'TRANSPORTE_ILEGAL_MADEIRA': 'Transporte Ilegal de Madeira',
    'VIOLACAO_AREA_PROTEGIDA': 'Violação de Área Protegida',
    'OUTROS': 'Outros'
  };
  return motivos[motivo] || motivo;
};

// Função para gerar QR Code com os dados da multa
const gerarQRCodeMulta = async (dados) => {
  try {
    const numeroProcesso = dados?.numeroProcesso || Math.floor(100000 + Math.random() * 900000);

    // Dados que serão codificados no QR Code
    const dadosQR = {
      processo: `AUTO-${numeroProcesso}`,
      infrator: dados?.nomeCompleto || dados?.nomeEmpresa || '',
      documento: dados?.bi || '',
      tipoSancao: getTipoSancaoLabel(dados?.tipoSancao) || '',
      valorMulta: dados?.valorMulta || '',
      motivo: getMotivoSancaoLabel(dados?.motivoSancao) || '',
      dataOcorrencia: formatDate(dados?.dataOcorrencia) || '',
      dataAplicacao: formatDate(dados?.dataAplicacao) || '',
      responsavel: dados?.nomeResponsavel || '',
      verificacao: `https://rnpa.gov.ao/verificar/multa/${numeroProcesso}`
    };

    // Converter para string formatada
    const dadosString = `Auto de Infração: ${dadosQR.processo}
Infrator: ${dadosQR.infrator}
Documento: ${dadosQR.documento}
Sanção: ${dadosQR.tipoSancao}
Valor: ${dadosQR.valorMulta ? `${dadosQR.valorMulta} AOA` : 'N/A'}
Motivo: ${dadosQR.motivo}
Data Ocorrência: ${dadosQR.dataOcorrencia}
Data Aplicação: ${dadosQR.dataAplicacao}
Responsável: ${dadosQR.responsavel}
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
    console.error('Erro ao gerar QR Code da multa:', error);
    return null;
  }
};

// Componente do cabeçalho
const HeaderSection = ({ numeroProcesso }) => (
  <View style={styles.header}>
    <Image src={emblema} style={styles.logoHeader} />
    <Text style={styles.republica}>REPÚBLICA DE ANGOLA</Text>
    <Text style={styles.ministerio}>MINISTÉRIO DA AGRICULTURA E FLORESTAS</Text>
    <Text style={styles.dnf}>DIRECÇÃO NACIONAL DE FLORESTAS (DNF)</Text>
    <Text style={styles.tituloDocumento}>AUTO DE INFRAÇÃO E MULTA FLORESTAL</Text>
    <Text style={styles.numeroProcesso}>Processo Nº: AUTO-{numeroProcesso}</Text>
  </View>
);

// Componente da tabela principal de dados do infrator
const DadosInfratorSection = ({ dados, propriedadeSelecionada }) => (
  <View style={styles.tabelaContainer}>
    <View style={styles.tabela}>
      {/* Nome/Empresa */}
      <View style={styles.tabelaRow}>
        <Text style={styles.celulaEsquerda}>Nome/Empresa:</Text>
        <Text style={styles.celulaDireita}>
          {dados?.nomeCompleto || dados?.nomeEmpresa || 'Não informado'}
        </Text>
      </View>

      {/* Documento */}
      <View style={styles.tabelaRow}>
        <Text style={styles.celulaEsquerda}>Documento:</Text>
        <Text style={styles.celulaDireita}>{dados?.bi || 'Não informado'}</Text>
      </View>

      {/* Contacto */}
      <View style={styles.tabelaRow}>
        <Text style={styles.celulaEsquerda}>Contacto:</Text>
        <Text style={styles.celulaDireita}>{dados?.telefone || 'Não informado'}</Text>
      </View>

      {/* Localização */}
      <View style={styles.tabelaRow}>
        <Text style={styles.celulaEsquerda}>Localização:</Text>
        <Text style={styles.celulaDireita}>
          {dados?.provincia && dados?.municipio 
            ? `${dados.provincia} - ${dados.municipio}`
            : 'Não informado'}
        </Text>
      </View>

      {/* Propriedade/Floresta */}
      <View style={[styles.tabelaRow, { borderBottomWidth: 0 }]}>
        <Text style={styles.celulaEsquerda}>Propriedade/Floresta:</Text>
        <Text style={styles.celulaDireita}>
          {propriedadeSelecionada 
            ? `${propriedadeSelecionada.nome} - ${propriedadeSelecionada.area} (${propriedadeSelecionada.localizacao})`
            : 'Não informado'}
        </Text>
      </View>
    </View>
  </View>
);

// Componente da descrição da infração
const DescricaoInfracaoSection = ({ dados }) => (
  <View style={styles.infracaoContainer}>
    <View style={styles.infracaoHeader}>
      <Text style={styles.infracaoTitle}>DESCRIÇÃO DA INFRAÇÃO COMETIDA</Text>
    </View>
    <View style={styles.infracaoContent}>
      <Text style={styles.infracaoText}>
        <Text style={styles.destaque}>Motivo: </Text>
        {getMotivoSancaoLabel(dados?.motivoSancao) || 'Não especificado'}
      </Text>
      <Text style={styles.infracaoText}>
        <Text style={styles.destaque}>Data da Ocorrência: </Text>
        {formatDate(dados?.dataOcorrencia) || 'Não informado'}
      </Text>
      <Text style={styles.infracaoText}>
        <Text style={styles.destaque}>Local: </Text>
        {dados?.localOcorrencia || 'Não informado'}
      </Text>
      {dados?.descricaoDetalhada && (
        <Text style={[styles.infracaoText, { marginTop: 5 }]}>
          <Text style={styles.destaque}>Descrição: </Text>
          {dados.descricaoDetalhada}
        </Text>
      )}
    </View>
  </View>
);

// Componente da sanção aplicada
const SancaoAplicadaSection = ({ dados }) => (
  <View style={styles.sancaoContainer}>
    <View style={styles.sancaoHeader}>
      <Text style={styles.sancaoTitle}>SANÇÃO APLICADA</Text>
    </View>
    <View style={styles.sancaoContent}>
      <Text style={[styles.infracaoText, { textAlign: 'center', marginBottom: 5 }]}>
        <Text style={styles.destaque}>Tipo de Sanção: </Text>
        {getTipoSancaoLabel(dados?.tipoSancao) || 'Não especificado'}
      </Text>
      
      {dados?.valorMulta && (
        <Text style={styles.valorDestaque}>
          VALOR: {formatCurrency(dados.valorMulta)}
        </Text>
      )}

      <Text style={[styles.infracaoText, { textAlign: 'center', marginTop: 10 }]}>
        Fundamentação legal: Lei nº 17/91 - Lei de Base do Ambiente e regulamentação florestal vigente
      </Text>
    </View>
  </View>
);

// Componente dos responsáveis
const ResponsaveisSection = ({ dados }) => (
  <View style={styles.responsavelContainer}>
    <View style={styles.responsavelEsquerda}>
      <Text style={styles.responsavelTitulo}>Aplicado por</Text>
      <Text style={styles.responsavelInfo}>
        <Text style={styles.responsavelLabel}>Nome: </Text>
        {dados?.nomeResponsavel || '_________________________'}
      </Text>
      <Text style={styles.responsavelInfo}>
        <Text style={styles.responsavelLabel}>Cargo: </Text>
        {dados?.cargoResponsavel || '_________________________'}
      </Text>
      <Text style={styles.responsavelInfo}>
        <Text style={styles.responsavelLabel}>Instituição: </Text>
        {dados?.instituicaoResponsavel || '_________________________'}
      </Text>
      <Text style={styles.responsavelInfo}>
        <Text style={styles.responsavelLabel}>Assinatura: </Text>
      </Text>
      <View style={styles.linhaAssinatura} />
    </View>

    <View style={styles.responsavelDireita}>
      <Text style={styles.responsavelTitulo}>Data e Local</Text>
      <Text style={styles.responsavelInfo}>
        <Text style={styles.responsavelLabel}>Data de Aplicação: </Text>
        {formatDate(dados?.dataAplicacao) || formatDate(new Date())}
      </Text>
      <Text style={styles.responsavelInfo}>
        <Text style={styles.responsavelLabel}>Local: </Text>
        {dados?.municipio || '_________________________'}
      </Text>
      
      {dados?.observacoes && (
        <>
          <Text style={[styles.responsavelInfo, { marginTop: 10 }]}>
            <Text style={styles.responsavelLabel}>Observações: </Text>
          </Text>
          <Text style={[styles.responsavelInfo, { fontSize: 7, marginTop: 2 }]}>
            {dados.observacoes}
          </Text>
        </>
      )}
    </View>
  </View>
);

// Componente da seção do QR Code
const QRCodeSection = ({ qrCodeData, numeroProcesso }) => (
  <View style={styles.qrCodeContainer}>
    <View style={styles.qrCodeSection}>
      {qrCodeData && (
        <>
          <Image src={qrCodeData} style={styles.qrCodeImage} />
          <Text style={styles.qrCodeText}>Verificação Digital</Text>
          <Text style={styles.numeroAuto}>AUTO-{numeroProcesso}</Text>
        </>
      )}
    </View>

    <View style={styles.verificacaoSection}>
      <Text style={styles.verificacaoTitulo}>Verificação de Autenticidade:</Text>
      <Text style={styles.verificacaoTexto}>
        1. Escaneie o QR Code com seu dispositivo móvel
      </Text>
      <Text style={styles.verificacaoTexto}>
        2. Ou acesse: https://rnpa.gov.ao/verificar/multa/{numeroProcesso}
      </Text>
      <Text style={styles.verificacaoTexto}>
        3. Confirme os dados apresentados com este auto
      </Text>
      <Text style={styles.verificacaoTexto}>
        <Text style={styles.rodapeDestaque}>Atenção:</Text> Documentos adulterados ou falsificados
        não passarão na verificação digital.
      </Text>
    </View>
  </View>
);

// Componente do rodapé
const RodapeSection = () => (
  <View>
    <Text style={styles.rodape}>
      <Text style={styles.rodapeDestaque}>Este auto de infração tem força legal.</Text> O não pagamento da multa no prazo estabelecido
      resultará em cobrança executiva e outras medidas cabíveis conforme a lei.
    </Text>
    <Text style={styles.rodape}>
      <Text style={styles.rodapeDestaque}>Prazo para recurso:</Text> 15 dias úteis a partir da data de notificação.
      <Text style={styles.rodapeDestaque}> Prazo para pagamento:</Text> 30 dias úteis para pagamento com desconto de 20%.
    </Text>
    <Text style={styles.documentoEletronico}>
      Documento gerado eletronicamente pelo RNPA/DNF. Assinatura digital e QR para verificação.
    </Text>
  </View>
);

// Componente principal do auto de infração
const AutoInfracaoDocument = ({ dados, propriedadeSelecionada, qrCodeData }) => {
  const numeroProcesso = dados?.numeroProcesso || Math.floor(100000 + Math.random() * 900000);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo de fundo */}
        <Image src={logo} style={styles.logoFundo} />

        <View style={styles.content}>
          <HeaderSection numeroProcesso={numeroProcesso} />

          <Text style={styles.textoPrincipal}>
            Em cumprimento às disposições legais vigentes sobre a proteção florestal e ambiental, 
            constata-se que o(a) infrator(a) abaixo identificado(a) cometeu infração às normas 
            florestais, sendo-lhe aplicada a seguinte sanção administrativa:
          </Text>

          <DadosInfratorSection dados={dados} propriedadeSelecionada={propriedadeSelecionada} />

          <DescricaoInfracaoSection dados={dados} />

          <SancaoAplicadaSection dados={dados} />

          <ResponsaveisSection dados={dados} />

          <QRCodeSection qrCodeData={qrCodeData} numeroProcesso={numeroProcesso} />

          <RodapeSection />
        </View>
      </Page>
    </Document>
  );
};

// Função principal para gerar o auto de infração
export const gerarAutoInfracao = async (dadosFormulario, propriedadeSelecionada) => {
  try {
    console.log('Gerando Auto de Infração e Multa...', dadosFormulario);

    // Gerar QR Code com os dados da multa
    console.log('Gerando QR Code com dados da multa...');
    const qrCodeData = await gerarQRCodeMulta(dadosFormulario);

    if (!qrCodeData) {
      console.warn('Não foi possível gerar o QR Code, continuando sem ele...');
    }

    // Gerar PDF do auto
    console.log('Gerando PDF do auto de infração...');

    const pdfBlob = await pdf(
      <AutoInfracaoDocument 
        dados={dadosFormulario} 
        propriedadeSelecionada={propriedadeSelecionada}
        qrCodeData={qrCodeData} 
      />
    ).toBlob();

    // Download do PDF
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auto_infracao_${dadosFormulario.numeroProcesso || 'multa'}_${new Date().toISOString().split('T')[0]}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Download do auto de infração iniciado');

    return { success: true, message: 'Auto de Infração e Multa gerado com sucesso!' };

  } catch (error) {
    console.error('Erro ao gerar auto de infração:', error);
    throw new Error(`Erro ao gerar auto de infração: ${error.message}`);
  }
};

// Componente React para interface
const CertificadoMultaGenerator = ({ dados, propriedadeSelecionada, onSuccess, onError }) => {
  const [gerando, setGerando] = useState(false);

  const handleGerar = async () => {
    setGerando(true);
    try {
      await gerarAutoInfracao(dados, propriedadeSelecionada);
      onSuccess?.('Auto de Infração e Multa gerado com sucesso!');
    } catch (error) {
      onError?.(error.message);
    } finally {
      setGerando(false);
    }
  };

  // Verificar se pode gerar auto
  const podeGerar = dados && (dados.nomeCompleto || dados.nomeEmpresa) && dados.tipoSancao;

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
          ⚠️ Complete os dados necessários para gerar o auto de infração
        </div>
      )}

      {/* Debug: Mostrar dados do auto */}
      {dados && podeGerar && (
        <div style={{
          backgroundColor: '#ffe6e6',
          border: '1px solid #ffb3b3',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '15px',
          fontSize: '12px',
          color: '#d32f2f',
          textAlign: 'left'
        }}>
          <strong>🚨 Dados do Auto de Infração:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li><strong>Infrator:</strong> {dados.nomeCompleto || dados.nomeEmpresa || 'N/A'}</li>
            <li><strong>Documento:</strong> {dados.bi || 'N/A'}</li>
            <li><strong>Tipo de Sanção:</strong> {getTipoSancaoLabel(dados.tipoSancao) || 'N/A'}</li>
            <li><strong>Valor da Multa:</strong> {dados.valorMulta ? `${dados.valorMulta} AOA` : 'N/A'}</li>
            <li><strong>Motivo:</strong> {getMotivoSancaoLabel(dados.motivoSancao) || 'N/A'}</li>
            <li><strong>Propriedade:</strong> {propriedadeSelecionada?.nome || 'N/A'}</li>
            <li><strong>Responsável:</strong> {dados.nomeResponsavel || 'N/A'}</li>
            <li><strong>QR Code:</strong> ✅ Será gerado com dados da multa</li>
          </ul>
        </div>
      )}

      <button
        onClick={handleGerar}
        disabled={gerando || !podeGerar}
        style={{
          padding: '12px 24px',
          backgroundColor: gerando || !podeGerar ? '#6c757d' : '#d32f2f',
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
          <>⏳ Gerando Auto com QR Code...</>
        ) : (
          '🚨 Gerar Auto de Infração e Multa'
        )}
      </button>

      {gerando && (
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          color: '#666'
        }}>
          📱 Gerando QR Code com dados da multa...
        </div>
      )}
    </div>
  );
};

export default CertificadoMultaGenerator;