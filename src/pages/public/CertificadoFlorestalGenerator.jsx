import React, { useState } from 'react';
import { Image, Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
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

// Função para gerar QR Code com os dados do certificado
const gerarQRCode = async (dados) => {
  try {
    const numeroCertificado = dados?.numeroLicencaExploracao || gerarNumeroCertificado();

    // Dados que serão codificados no QR Code
    const dadosQR = {
      certificado: numeroCertificado,
      empresa: dados?.nomeEmpresa || '',
      licenca: dados?.numeroLicencaExploracao || '',
      tipo: dados?.tipoLicenca || '',
      validadeInicio: formatDate(dados?.validadeInicio) || '',
      validadeFim: formatDate(dados?.validadeFim) || '',
      tecnico: dados?.tecnicoResponsavel || '',
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
            {formatDate(dados?.validadeInicio) || '____/____/______'}
          </Text>
          <Text style={styles.celulaConteudoDireita}>
            {formatDate(dados?.validadeFim) || '____/____/______'}
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
        {dados?.tecnicoResponsavel || '__________________________'}
      </Text>
      <Text style={styles.emissaoInfo}>
        <Text style={styles.emissaoLabel}>Cargo: </Text>
        {dados?.cargoTecnico || '__________________________'}
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

// Componente principal do certificado florestal
const CertificadoFlorestalDocument = ({ dados, qrCodeData }) => {
  const numeroCertificado = dados?.numeroLicencaExploracao || gerarNumeroCertificado();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo de fundo */}
        <Image src={logo} style={styles.logoFundo} />

        <View style={styles.content}>
          <HeaderSection />

          <Text style={styles.textoPrincipal}>
            Nos termos da legislação florestal em vigor, certifica-se que a licença acima identificada autoriza a
            empresa <Text style={styles.destaque}>{dados?.nomeEmpresa || '________________________________________'}</Text>, Portadora da Licença de Exploração
            Nº<Text style={styles.destaque}>{numeroCertificado}</Text> exercer a actividade de Produtor florestal especificada, limitada às
            espécies, volumes e prazos indicados.
          </Text>

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
    console.log('Verificando dados florestais disponíveis:', dadosFormulario);

    // Verificar se há dados necessários
    const temAreas = temDadosValidos(dadosFormulario.areasFlorestais);
    const temEspecies = temDadosValidos(dadosFormulario.especiesAutorizadas);

    console.log('Tem áreas florestais:', temAreas);
    console.log('Tem espécies autorizadas:', temEspecies);

    if (!temAreas || !temEspecies) {
      throw new Error('É necessário ter pelo menos uma área florestal e uma espécie autorizada para gerar o certificado florestal.');
    }

    // Dados preparados para o certificado
    const dadosCertificado = {
      ...dadosFormulario.dadosProdutor,
      areasFlorestais: dadosFormulario.areasFlorestais,
      especiesAutorizadas: dadosFormulario.especiesAutorizadas,
      historicoExploracoes: dadosFormulario.historicoExploracoes
    };

    // Gerar QR Code com os dados do certificado
    console.log('Gerando QR Code com dados do certificado...');
    const qrCodeData = await gerarQRCode(dadosCertificado);

    if (!qrCodeData) {
      console.warn('Não foi possível gerar o QR Code, continuando sem ele...');
    }

    // Gerar certificado PDF
    console.log('Gerando PDF do certificado florestal...');

    const pdfBlob = await pdf(
      <CertificadoFlorestalDocument dados={dadosCertificado} qrCodeData={qrCodeData} />
    ).toBlob();

    // Download do PDF
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificado_florestal_${dadosFormulario.dadosProdutor.numeroProcesso || 'produtor'}_${new Date().toISOString().split('T')[0]}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Download do certificado florestal iniciado');

    return { success: true, message: 'Certificado de Licença Florestal gerado com sucesso!' };

  } catch (error) {
    console.error('Erro ao gerar certificado florestal:', error);
    throw new Error(`Erro ao gerar certificado florestal: ${error.message}`);
  }
};

// Componente React para interface
const CertificadoFlorestalGenerator = ({ dados, onSuccess, onError }) => {
  const [gerando, setGerando] = useState(false);

  const handleGerar = async () => {
    setGerando(true);
    try {
      await gerarCertificadoFlorestal(dados);
      onSuccess?.('Certificado Florestal gerado com sucesso!');
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
          <strong>🌲 Dados para API (/certificadoFlorestal):</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li><strong>Empresa:</strong> {dados.dadosProdutor?.nomeEmpresa || 'N/A'}</li>
            <li><strong>Licença Nº:</strong> {dados.dadosProdutor?.numeroLicencaExploracao || 'N/A'}</li>
            <li><strong>Tipo:</strong> {dados.dadosProdutor?.tipoLicenca || 'N/A'}</li>
            <li><strong>Áreas Florestais:</strong> {dados.areasFlorestais?.length || 0} itens</li>
            <li><strong>Espécies Autorizadas:</strong> {dados.especiesAutorizadas?.length || 0} itens</li>
            <li><strong>Histórico:</strong> {dados.historicoExploracoes?.length || 0} itens</li>
            <li><strong>Técnico:</strong> {dados.dadosProdutor?.tecnicoResponsavel || 'N/A'}</li>
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
          <>⏳ Gerando Certificado com QR Code...</>
        ) : (
          '🌲 Gerar Certificado de Licença Florestal'
        )}
      </button>

      {gerando && (
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          color: '#666'
        }}>
          📱 Gerando QR Code com dados do certificado...
        </div>
      )}
    </div>
  );
};

export default CertificadoFlorestalGenerator;