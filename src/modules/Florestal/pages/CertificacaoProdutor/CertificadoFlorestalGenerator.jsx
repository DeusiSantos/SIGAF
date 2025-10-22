import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import { useState } from 'react';
import emblema from '../../../../assets/emblema.png';

// Estilos para o certificado florestal oficial - LAYOUT CORRETO
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.2,
  },

  // Cabeçalho com 3 colunas
  header: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
  },

  headerLeft: {
    width: '100%',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoEmblema: {
    width: 45,
    height: 45,
    marginBottom: 4,
  },

  headerCenter: {
    width: '50%',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  republica: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },

  ministerio: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },

  instituto: {
    fontSize: 11,
    textAlign: 'center',
  },

  headerRight: {
    width: '100%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  codigoBarras: {
    width: '100%',
    height: 30,
    backgroundColor: '#f0f0f0',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  codigoBarrasTexto: {
    fontSize: 20,
    fontFamily: 'Courier',
    letterSpacing: 1,
  },

  // Título da licença
  tituloContainer: {
    width: '100%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#000',
    padding: 6,
    backgroundColor: '#f9f9f9',
  },

  titulo: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },

  numeroLicenca: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
  },

  validade: {
    fontSize: 11,
    textAlign: 'center',
  },

  // Texto legal
  textoLegal: {
    fontSize: 11,
    lineHeight: 1.3,
    textAlign: 'justify',
    marginTop: 10,
    marginBottom: 8,
  },

  bold: {
    fontWeight: 'bold',
  },

  // Dados da empresa
  dadosEmpresa: {
    fontSize: 11,
    lineHeight: 1.3,
    marginBottom: 10,
  },

  // Tabela de espécies
  tabela: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },

  tabelaHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#e0e0e0',
  },

  tabelaHeaderCell: {
    padding: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },

  tabelaRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },

  tabelaCell: {
    padding: 4,
    fontSize: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
    minHeight: 20,
  },

  tabelaCellLeft: {
    textAlign: 'left',
  },

  tabelaCellRight: {
    textAlign: 'right',
  },

  // Seção de produtos não lenhosos
  secaoNaoLenhosos: {
    marginTop: 10,
    marginBottom: 10,
  },

  secaoTitulo: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  // Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
    paddingRight: 10,
  },

  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 20,
  },

  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Taxas e custos
  taxasContainer: {
    marginTop: 15,
    marginBottom: 15,
  },

  taxaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 10,
  },

  taxaLabel: {
    width: '40%',
  },

  taxaValue: {
    width: '20%',
    textAlign: 'right',
  },

  totalFinal: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 4,
    marginTop: 4,
  },

  // Rodapé
  rodape: {
    marginTop: 20,
    fontSize: 11,
    textAlign: 'center',
  },

  localData: {
    fontSize: 8,
    marginBottom: 20,
  },

  assinatura: {
    marginTop: 30,
    textAlign: 'center',
  },

  linhaAssinatura: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginTop: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  cargoAssinatura: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
};

// Função para gerar número da licença
const gerarNumeroLicenca = () => {
  const ano = new Date().getFullYear();
  const numero = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `Nº ${numero}/IDF/${ano}`;
};

// Função para calcular valores da fatura com IVA
const calcularValoresFatura = (dadosFormulario) => {
  const TAXA_IVA = 0.14; // 14% IVA
  const TAXA_RL = 0.10; // 10% RL

  let tiposParaCalcular = [];

  if (dadosFormulario.tiposLicenca && Array.isArray(dadosFormulario.tiposLicenca)) {
    tiposParaCalcular = dadosFormulario.tiposLicenca;
  } else if (dadosFormulario.tipoDeLicencaFlorestal && Array.isArray(dadosFormulario.tipoDeLicencaFlorestal)) {
    try {
      const tiposString = dadosFormulario.tipoDeLicencaFlorestal[0];
      if (typeof tiposString === 'string') {
        tiposParaCalcular = JSON.parse(tiposString);
      } else if (Array.isArray(tiposString)) {
        tiposParaCalcular = tiposString;
      }
    } catch (e) {
      console.warn('Erro ao processar tipoDeLicencaFlorestal:', e);
    }
  }

  if (!Array.isArray(tiposParaCalcular) || tiposParaCalcular.length === 0) {
    return { taxa: 0, subtotal: 0, rl: 0, total: 0, itens: [] };
  }

  const itens = tiposParaCalcular.map(tipoLicenca => {
    const tipoValue = typeof tipoLicenca === 'object' ? tipoLicenca.value : tipoLicenca;
    const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);

    if (licenca) {
      return {
        produto: licenca.label,
        valor: licenca.preco
      };
    }
    return null;
  }).filter(Boolean);

  const taxa = itens.reduce((acc, item) => acc + item.valor, 0);
  const subtotal = taxa;
  const rl = subtotal * TAXA_RL;
  const total = subtotal + rl;

  return { taxa, subtotal, rl, total, itens };
};

// Componente do Cabeçalho
const HeaderSection = ({ numeroLicenca, validadeAte }) => (
  <>
    <View style={styles.header}>
      {/* Coluna Esquerda - Emblema */}
      <View style={styles.headerLeft}>
        <Image src={emblema} style={styles.logoEmblema} />
        <Text style={styles.republica}>REPÚBLICA DE ANGOLA</Text>
        <Text style={styles.ministerio}>MINISTÉRIO DA AGRICULTURA</Text>
        <Text style={styles.instituto}>Instituto de Desenvolvimento Florestal</Text>
      </View>

      {/* Coluna Direita - Código de Barras */}
      <View style={styles.headerRight}>
        <Text style={styles.titulo}>Licença de Exploração Florestal</Text>
        <Text style={styles.numeroLicenca}>Nº{numeroLicenca}/IDF/__________</Text>
        <Text style={styles.validade}>Válido até: {validadeAte}</Text>
      </View>
    </View>


  </>
);

// Componente do Texto Legal
const TextoLegalSection = ({ validadeDe, validadeAte }) => (
  <View style={styles.textoLegal}>
    <Text>
      Nos termos do Artigo 10.º da Lei n.º6/17 de 24 de Janeiro - Lei de Bases de Florestas e Fauna e Selvagem;
    </Text>
    <Text style={{ marginTop: 4 }}>
      De acordo com o Decreto Presidencial n.º 17, de {formatDate(validadeDe)}, que estabelece os procedimentos para o licenciamento da exploração florestal para a campanha florestal {new Date().getFullYear()};
    </Text>
    <Text style={{ marginTop: 4 }}>
      Em conformidade com o Despacho de Autorização do Ministro da Agricultura de {formatDate(validadeDe)};
    </Text>
  </View>
);

// Componente dos Dados da Empresa
const DadosEmpresaSection = ({ dados, areasFlorestais }) => {
  const nomeEntidade = dados?.nomeEntidade || dados?.nomeCompleto || '';
  const nif = dados?.bi || '';
  const endereco = dados?.enderecoResidencial || '';
  const provincia = dados?.provincia || '';
  const municipio = dados?.municipio || '';
  const comuna = dados?.comuna || '';

  // Calcular área total
  const areaTotal = areasFlorestais?.reduce((acc, area) => {
    return acc + (parseFloat(area.areaHectares) || 0);
  }, 0) || 0;

  // Montar localização
  const localizacao = [comuna, municipio, provincia].filter(Boolean).join(', ');

  return (
    <View style={styles.dadosEmpresa}>
      <Text>
        Faz-se constar que estão (Sr.), a (Empresa) <Text style={styles.bold}>{nomeEntidade}</Text>
      </Text>
      <Text style={{ marginTop: 2 }}>
        Contribuinte n.º <Text style={styles.bold}>{nif}</Text> com sede social em <Text style={styles.bold}>{endereco || localizacao}</Text>
      </Text>
      <Text style={{ marginTop: 2 }}>
        Rua {endereco}
      </Text>
      <Text style={{ marginTop: 2 }}>
        autorizada a explorar numa área de <Text style={styles.bold}>{areaTotal.toFixed(1)} ha</Text>, sita na localidade de <Text style={styles.bold}>{localizacao}</Text>, comuna de <Text style={styles.bold}>{comuna}</Text>, município de <Text style={styles.bold}>{municipio}</Text>, província de <Text style={styles.bold}>{provincia}</Text>, seguintes espécies e quantidades:
      </Text>
    </View>
  );
};

// Componente da Tabela de Espécies
const TabelaEspeciesSection = ({ especiesAutorizadas }) => {
  // Separar espécies lenhosas e não lenhosas
  const especiesLenhosas = especiesAutorizadas?.filter(esp =>
    !['NAO_LENHOSOS', 'PRODUTOS_NAO_LENHOSOS'].includes(esp.especie?.toUpperCase())
  ) || [];

  const especiesNaoLenhosas = especiesAutorizadas?.filter(esp =>
    ['NAO_LENHOSOS', 'PRODUTOS_NAO_LENHOSOS'].includes(esp.especie?.toUpperCase())
  ) || [];

  return (
    <>
      {/* Tabela de Espécies Lenhosas */}
      {especiesLenhosas.length > 0 && (
        <View style={styles.tabela}>
          <View style={styles.tabelaHeader}>
            <Text style={[styles.tabelaHeaderCell, { width: '33%' }]}>Grupo</Text>
            <Text style={[styles.tabelaHeaderCell, { width: '33%' }]}>Espécie</Text>
            <Text style={[styles.tabelaHeaderCell, { width: '20%' }]}>Volume{'\n'}(m³/StKg)</Text>
            <Text style={[styles.tabelaHeaderCell, { width: '14%', borderRightWidth: 0 }]}>Grupo</Text>
          </View>

          {especiesLenhosas.map((especie, index) => (
            <View key={index} style={[styles.tabelaRow, { borderBottomWidth: index === especiesLenhosas.length - 1 ? 0 : 1 }]}>
              <Text style={[styles.tabelaCell, styles.tabelaCellLeft, { width: '33%' }]}>
                {especie.especie || ''}
              </Text>
              <Text style={[styles.tabelaCell, styles.tabelaCellLeft, { width: '33%' }]}>
                {especie.nomeCientifico || especie.nomeComum || ''}
              </Text>
              <Text style={[styles.tabelaCell, styles.tabelaCellRight, { width: '20%' }]}>
                {especie.volumeAutorizado || '0'}
              </Text>
              <Text style={[styles.tabelaCell, { width: '14%', borderRightWidth: 0 }]}>
                {/* Coluna vazia para segunda parte da tabela */}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Seção de Produtos Florestais Não Lenhosos */}
      {especiesNaoLenhosas.length > 0 && (
        <View style={styles.secaoNaoLenhosos}>
          <Text style={styles.secaoTitulo}>Produtos Florestais não Lenhosos</Text>
          <View style={styles.tabela}>
            <View style={styles.tabelaHeader}>
              <Text style={[styles.tabelaHeaderCell, { width: '40%' }]}>Produto</Text>
              <Text style={[styles.tabelaHeaderCell, { width: '30%' }]}>Especificação</Text>
              <Text style={[styles.tabelaHeaderCell, { width: '30%', borderRightWidth: 0 }]}>Quantidade</Text>
            </View>

            {especiesNaoLenhosas.map((produto, index) => (
              <View key={index} style={[styles.tabelaRow, { borderBottomWidth: index === especiesNaoLenhosas.length - 1 ? 0 : 1 }]}>
                <Text style={[styles.tabelaCell, styles.tabelaCellLeft, { width: '40%' }]}>
                  {produto.nomeComum || produto.especie || ''}
                </Text>
                <Text style={[styles.tabelaCell, styles.tabelaCellLeft, { width: '30%' }]}>
                  {produto.nomeCientifico || produto.observacoes || ''}
                </Text>
                <Text style={[styles.tabelaCell, styles.tabelaCellRight, { width: '30%', borderRightWidth: 0 }]}>
                  {produto.volumeAutorizado || '0'} {produto.unidade || ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );
};

// Componente do Total
const TotalSection = ({ especiesAutorizadas }) => {
  const volumeTotal = especiesAutorizadas?.reduce((acc, esp) => {
    return acc + (parseFloat(esp.volumeAutorizado) || 0);
  }, 0) || 0;

  return (
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>TOTAL</Text>
      <Text style={styles.totalValue}>{volumeTotal.toFixed(1)} m³</Text>
    </View>
  );
};

// Componente das Taxas
const TaxasSection = ({ valoresFatura }) => (
  <View style={styles.taxasContainer}>
    <Text style={[styles.secaoTitulo, { marginBottom: 8 }]}>
      A presente licença vai assinada e autenticada com o selo branco em uso neste Instituto.
    </Text>

    <View style={styles.taxaRow}>
      <Text style={styles.taxaLabel}>Taxa</Text>
      <Text style={styles.taxaValue}>Kz: {valoresFatura.taxa.toLocaleString('pt-AO')}</Text>
    </View>

    <View style={styles.taxaRow}>
      <Text style={styles.taxaLabel}>Sub-total</Text>
      <Text style={styles.taxaValue}>Kz: {valoresFatura.subtotal.toLocaleString('pt-AO')}</Text>
    </View>

    <View style={styles.taxaRow}>
      <Text style={styles.taxaLabel}>10% RL</Text>
      <Text style={styles.taxaValue}>Kz: {valoresFatura.rl.toLocaleString('pt-AO')}</Text>
    </View>

    <View style={[styles.taxaRow, styles.totalFinal]}>
      <Text style={[styles.taxaLabel, styles.bold]}>TOTAL</Text>
      <Text style={[styles.taxaValue, styles.bold]}>Kz: {valoresFatura.total.toLocaleString('pt-AO')}</Text>
    </View>
  </View>
);

// Componente do Rodapé
const RodapeSection = ({ dados }) => {
  const hoje = new Date();
  const mesAno = hoje.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  const dia = hoje.getDate();

  return (
    <View style={styles.rodape}>
      <Text style={styles.localData}>
        Luanda aos {dia} de {mesAno}
      </Text>

      <View style={styles.assinatura}>
        <View style={styles.linhaAssinatura} />
        <Text style={styles.cargoAssinatura}>O Director Geral</Text>
      </View>
    </View>
  );
};

// Componente principal do certificado florestal - LAYOUT OFICIAL
const CertificadoFlorestalDocument = ({ dados, areasFlorestais, especiesAutorizadas, valoresFatura }) => {
  const numeroLicenca = dados?.numeroLicencaExploracao || gerarNumeroLicenca();
  const validadeAte = formatDate(dados?.validadeFim || dados?.validoAte) || '__/__/____';
  const validadeDe = dados?.validadeInicio || dados?.validoDe;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <HeaderSection numeroLicenca={numeroLicenca} validadeAte={validadeAte} />

        <TextoLegalSection validadeDe={validadeDe} validadeAte={dados?.validadeFim} />

        <DadosEmpresaSection dados={dados} areasFlorestais={areasFlorestais} />

        <TabelaEspeciesSection especiesAutorizadas={especiesAutorizadas} />

        <TotalSection especiesAutorizadas={especiesAutorizadas} />

        <TaxasSection valoresFatura={valoresFatura} />

        <RodapeSection dados={dados} />
      </Page>
    </Document>
  );
};

// Componente da Fatura em PDF (mantido igual)
const FaturaDocument = ({ dadosFatura, valoresFatura }) => {
  const numeroFatura = `FAT-${dadosFatura.numeroProcesso}-${Date.now()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={emblema} style={styles.logoEmblema} />
            <Text style={styles.republica}>REPÚBLICA DE ANGOLA</Text>
            <Text style={styles.ministerio}>MINISTÉRIO DA AGRICULTURA E FLORESTAS</Text>
            <Text style={styles.instituto}>INSTITUTO DE DESENVOLVIMENTO FLORESTAL (IDF)</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.titulo}>FATURA</Text>
          </View>
        </View>

        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 10, marginBottom: 3, fontWeight: 'bold' }}>Número da Fatura:</Text>
          <Text style={{ fontSize: 10, marginBottom: 8 }}>{numeroFatura}</Text>

          <Text style={{ fontSize: 10, marginBottom: 3, fontWeight: 'bold' }}>Data de Emissão:</Text>
          <Text style={{ fontSize: 10, marginBottom: 8 }}>{new Date().toLocaleDateString('pt-PT')}</Text>

          <Text style={{ fontSize: 10, marginBottom: 3, fontWeight: 'bold' }}>Cliente:</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>{dadosFatura.nomeEntidade}</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>Tipo: {dadosFatura.tipoEntidade}</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>Processo Nº: {dadosFatura.numeroProcesso}</Text>
        </View>

        {valoresFatura.itens && valoresFatura.itens.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            {valoresFatura.itens.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 9 }}>{item.produto}</Text>
                <Text style={{ fontSize: 9 }}>{item.valor.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</Text>
              </View>
            ))}
          </View>
        )}

        <TaxasSection valoresFatura={valoresFatura} />

        <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: '#000', paddingTop: 10 }}>
          <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 2 }}>
            Ministério da Agricultura - Instituto de Desenvolvimento Florestal
          </Text>
          <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 2 }}>
            Luanda - Angola | Tel: +244 222 322 037 | Email: idf@minagrif.gov.ao
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Função principal para gerar certificado florestal
export const gerarCertificadoFlorestal = async (dadosFormulario) => {
  try {
    console.log('🔍 Gerando certificado florestal com layout oficial...');

    const dadosCertificado = {
      ...dadosFormulario.dadosProdutor,
      areasFlorestais: dadosFormulario.areasFlorestais || [],
      especiesAutorizadas: dadosFormulario.especiesAutorizadas || [],
    };

    const valoresFatura = calcularValoresFatura(dadosCertificado);

    const dadosFatura = {
      numeroProcesso: dadosCertificado.numeroProcesso || `PROC-${Date.now()}`,
      nomeEntidade: dadosCertificado.nomeEntidade || dadosCertificado.nomeCompleto || 'Entidade',
      tipoEntidade: dadosFormulario.tipoSelecionado || 'Produtor',
      tiposLicenca: dadosCertificado.tiposLicenca || [],
      dataEmissao: new Date().toLocaleDateString('pt-PT')
    };

    // Gerar PDF da fatura
    console.log('📄 Gerando PDF da fatura...');
    const faturaBlob = await pdf(
      <FaturaDocument dadosFatura={dadosFatura} valoresFatura={valoresFatura} />
    ).toBlob();

    const faturaUrl = URL.createObjectURL(faturaBlob);
    const faturaLink = document.createElement('a');
    faturaLink.href = faturaUrl;
    faturaLink.download = `fatura_florestal_${dadosFatura.numeroProcesso}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(faturaLink);
    faturaLink.click();
    document.body.removeChild(faturaLink);
    URL.revokeObjectURL(faturaUrl);

    // Gerar PDF do certificado
    console.log('📜 Gerando PDF do certificado florestal...');
    const certificadoBlob = await pdf(
      <CertificadoFlorestalDocument
        dados={dadosCertificado}
        areasFlorestais={dadosFormulario.areasFlorestais}
        especiesAutorizadas={dadosFormulario.especiesAutorizadas}
        valoresFatura={valoresFatura}
      />
    ).toBlob();

    const certificadoUrl = URL.createObjectURL(certificadoBlob);
    const certificadoLink = document.createElement('a');
    certificadoLink.href = certificadoUrl;
    certificadoLink.download = `licenca_exploracao_florestal_${dadosFatura.numeroProcesso}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(certificadoLink);
    certificadoLink.click();
    document.body.removeChild(certificadoLink);
    URL.revokeObjectURL(certificadoUrl);

    console.log('✅ Download da fatura e certificado florestal concluídos');

    return {
      success: true,
      message: `Fatura e Licença de Exploração Florestal geradas com sucesso! Valor total: ${valoresFatura.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}`,
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

  const temAreas = dados?.areasFlorestais && dados.areasFlorestais.length > 0;
  const temEspecies = dados?.especiesAutorizadas && dados.especiesAutorizadas.length > 0;
  const podeGerar = dados && temAreas && temEspecies;

  const valoresFatura = dados ? calcularValoresFatura(dados.dadosProdutor || dados) : { taxa: 0, subtotal: 0, rl: 0, total: 0, itens: [] };

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
          <strong>💰 Resumo dos Custos da Licença:</strong>
          <div style={{ marginTop: '10px' }}>
            {valoresFatura.itens.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>{item.produto}</span>
                <span>{item.valor.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
              </div>
            ))}
            <hr style={{ margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>Taxa:</span>
              <span>{valoresFatura.taxa.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>Sub-total:</span>
              <span>{valoresFatura.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>10% RL:</span>
              <span>{valoresFatura.rl.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #dee2e6' }}>
              <span>TOTAL:</span>
              <span style={{ color: '#28a745' }}>{valoresFatura.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
          </div>
        </div>
      )}

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
          <strong>🌲 Dados para Certificação (Layout Oficial):</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li><strong>Entidade:</strong> {dados.dadosProdutor?.nomeEntidade || dados.dadosProdutor?.nomeCompleto || 'N/A'}</li>
            <li><strong>Tipo:</strong> {dados.tipoSelecionado || 'N/A'}</li>
            <li><strong>Licenças:</strong> {
              dados.dadosProdutor?.tiposLicenca?.length ||
              dados.dadosProdutor?.tipoDeLicencaFlorestal?.length ||
              0
            } tipos</li>
            <li><strong>Áreas Florestais:</strong> {dados.areasFlorestais?.length || 0} áreas cadastradas</li>
            <li><strong>Espécies Autorizadas:</strong> {dados.especiesAutorizadas?.length || 0} espécies</li>
            <li><strong>Província:</strong> {dados.dadosProdutor?.provincia || 'N/A'}</li>
            <li><strong>Município:</strong> {dados.dadosProdutor?.municipio || 'N/A'}</li>
            <li><strong>Layout:</strong> ✅ Conforme documento oficial IDF</li>
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
          <>⏳ Gerando Documentos Oficiais...</>
        ) : (
          '🌲 Gerar Licença de Exploração Florestal'
        )}
      </button>

      {gerando && (
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          color: '#666'
        }}>
          📄 Gerando fatura e licença com layout oficial IDF...
        </div>
      )}
    </div>
  );
};

export default CertificadoFlorestalGenerator;