import React, { useState } from 'react';
import { Image, Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import emblema from '../../assets/emblema.png';
import logo from '../../assets/RNPA-removebg.png';
import api from '../../services/api';

// Estilos para o certificado oficial
const styles = StyleSheet.create({
  // Layout geral
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 35,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
    position: 'relative'
  },

  // Logo de fundo (marca d'água) - MAIOR
  logoFundo: {
    position: 'absolute',
    top: '35%',
    left: '25%',
    width: 300,
    height: 300,
    opacity: 0.08,
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
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000'
  },

  logoHeader: {
    width: 50,
    height: 50,
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  republica: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    color: '#000'
  },

  ministerio: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    color: '#000'
  },

  instituto: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    color: '#000'
  },

  rnpa: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#000'
  },

  tituloDocumento: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    textDecoration: 'underline',
    color: '#000'
  },

  // Número do certificado
  numeroCertificado: {
    textAlign: 'right',
    marginBottom: 20,
    fontSize: 11,
    fontWeight: 'bold'
  },

  // Texto "CERTIFICA-SE QUE"
  certificaSeQue: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    textDecoration: 'underline'
  },

  // Texto principal do certificado
  textoPrincipal: {
    fontSize: 10,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 20
  },

  destaque: {
    fontWeight: 'bold'
  },

  // Tabelas de produção
  tabelaContainer: {
    marginBottom: 15
  },

  tabelaTitulo: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    textDecoration: 'underline'
  },

  tabela: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000'
  },

  tabelaHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000'
  },

  tabelaRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000'
  },

  celula: {
    padding: 3,
    fontSize: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#000',
    minHeight: 18
  },

  celulaHeader: {
    padding: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#000'
  },

  // Larguras das colunas para agricultura
  colEpoca: { width: '15%' },
  colCultura: { width: '20%' },
  colArea: { width: '12%' },
  colProducao: { width: '15%' },
  colUnidade: { width: '12%' },
  colDestino: { width: '26%' },

  // Larguras das colunas para pecuária
  colEspeciePec: { width: '20%' },
  colRaca: { width: '18%' },
  colCabecas: { width: '15%' },
  colProducaoPec: { width: '20%' },
  colObsPec: { width: '27%' },

  // Finalidades do certificado - EM LINHA
  finalidades: {
    marginBottom: 15
  },

  finalidadesTitulo: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6
  },

  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10
  },

  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    marginRight: 15,
    width: '45%'
  },

  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    marginRight: 6,
    backgroundColor: '#fff'
  },

  checkboxChecked: {
    backgroundColor: '#000'
  },

  checkboxLabel: {
    fontSize: 9
  },

  // Validade
  validade: {
    marginBottom: 15,
    flexDirection: 'row'
  },

  validadeLabel: {
    fontSize: 10,
    fontWeight: 'bold'
  },

  // Dados de emissão
  emissao: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  emissaoItem: {
    fontSize: 10
  },

  emissaoLabel: {
    fontWeight: 'bold'
  },

  // Assinaturas
  assinaturas: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  assinaturaSection: {
    width: '45%',
    textAlign: 'center'
  },

  assinaturaTitulo: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6
  },

  linhaAssinatura: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000',
    height: 20,
    marginTop: 30
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
  return `${numero}/${ano}`;
};

// Componente do cabeçalho
const HeaderSection = ({ tipo }) => (
  <View style={styles.header}>
    <Image src={emblema} style={styles.logoHeader} />
    <Text style={styles.republica}>REPÚBLICA DE ANGOLA</Text>
    <Text style={styles.ministerio}>MINISTÉRIO DA AGRICULTURA E FLORESTAS</Text>
    <Text style={styles.instituto}>INSTITUTO DE DESENVOLVIMENTO AGRÁRIO</Text>
    <Text style={styles.rnpa}>REGISTO NACIONAL DE PRODUTORES AGROPECUÁRIOS</Text>
    <Text style={styles.tituloDocumento}>
      CERTIFICADO DE VALIDAÇÃO DA PRODUÇÃO {tipo === 'agricultura' ? 'AGRÍCOLA' : 'PECUÁRIA'}
    </Text>
  </View>
);

// Componente da tabela de produção agrícola
const TabelaAgricolaSection = ({ producaoAgricola }) => (
  <View style={styles.tabelaContainer}>
    <Text style={styles.tabelaTitulo}>DADOS DA PRODUÇÃO AGRÍCOLA VALIDADA</Text>
    <View style={styles.tabela}>
      {/* Cabeçalho */}
      <View style={styles.tabelaHeader}>
        <Text style={[styles.celulaHeader, styles.colEpoca]}>Época Agrícola</Text>
        <Text style={[styles.celulaHeader, styles.colCultura]}>Cultura/Criação</Text>
        <Text style={[styles.celulaHeader, styles.colArea]}>Área (ha)</Text>
        <Text style={[styles.celulaHeader, styles.colProducao]}>Produção Total</Text>
        <Text style={[styles.celulaHeader, styles.colUnidade]}>Unidade</Text>
        <Text style={[styles.celulaHeader, styles.colDestino]}>Destino (Venda/Consumo)</Text>
      </View>

      {/* Dados */}
      {producaoAgricola && producaoAgricola.length > 0 ? (
        producaoAgricola.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.tabelaRow}>
            <Text style={[styles.celula, styles.colEpoca]}>{item.ano || 'N/A'}</Text>
            <Text style={[styles.celula, styles.colCultura]}>{item.produto || 'N/A'}</Text>
            <Text style={[styles.celula, styles.colArea]}>{item.areaCultivada || '0'}</Text>
            <Text style={[styles.celula, styles.colProducao]}>{item.producao || '0'}</Text>
            <Text style={[styles.celula, styles.colUnidade]}>ton</Text>
            <Text style={[styles.celula, styles.colDestino]}>
              {item.producao ? `V: ${Math.floor(parseFloat(item.producao) * 0.7)} / C: ${Math.floor(parseFloat(item.producao) * 0.3)}` : 'N/A'}
            </Text>
          </View>
        ))
      ) : (
        <>
          <View style={styles.tabelaRow}>
            <Text style={[styles.celula, styles.colEpoca]}>2024/2025</Text>
            <Text style={[styles.celula, styles.colCultura]}>________________</Text>
            <Text style={[styles.celula, styles.colArea]}>_____</Text>
            <Text style={[styles.celula, styles.colProducao]}>_____</Text>
            <Text style={[styles.celula, styles.colUnidade]}>_____</Text>
            <Text style={[styles.celula, styles.colDestino]}>____________________</Text>
          </View>
          <View style={styles.tabelaRow}>
            <Text style={[styles.celula, styles.colEpoca]}>2023/2024</Text>
            <Text style={[styles.celula, styles.colCultura]}>________________</Text>
            <Text style={[styles.celula, styles.colArea]}>_____</Text>
            <Text style={[styles.celula, styles.colProducao]}>_____</Text>
            <Text style={[styles.celula, styles.colUnidade]}>_____</Text>
            <Text style={[styles.celula, styles.colDestino]}>____________________</Text>
          </View>
          <View style={styles.tabelaRow}>
            <Text style={[styles.celula, styles.colEpoca]}>2022/2023</Text>
            <Text style={[styles.celula, styles.colCultura]}>________________</Text>
            <Text style={[styles.celula, styles.colArea]}>_____</Text>
            <Text style={[styles.celula, styles.colProducao]}>_____</Text>
            <Text style={[styles.celula, styles.colUnidade]}>_____</Text>
            <Text style={[styles.celula, styles.colDestino]}>____________________</Text>
          </View>
        </>
      )}
    </View>
  </View>
);

// Componente da tabela de produção pecuária
const TabelaPecuariaSection = ({ producaoPecuaria }) => (
  <View style={styles.tabelaContainer}>
    <Text style={styles.tabelaTitulo}>DADOS DA PRODUÇÃO PECUÁRIA VALIDADA</Text>
    <View style={styles.tabela}>
      {/* Cabeçalho */}
      <View style={styles.tabelaHeader}>
        <Text style={[styles.celulaHeader, styles.colEpoca]}>Ano</Text>
        <Text style={[styles.celulaHeader, styles.colEspeciePec]}>Espécie</Text>
        <Text style={[styles.celulaHeader, styles.colRaca]}>Raça/Variedade</Text>
        <Text style={[styles.celulaHeader, styles.colCabecas]}>Nº Cabeças</Text>
        <Text style={[styles.celulaHeader, styles.colProducaoPec]}>Produção</Text>
        <Text style={[styles.celulaHeader, styles.colObsPec]}>Observações</Text>
      </View>

      {/* Dados */}
      {producaoPecuaria && producaoPecuaria.length > 0 ? (
        producaoPecuaria.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.tabelaRow}>
            <Text style={[styles.celula, styles.colEpoca]}>{item.ano || 'N/A'}</Text>
            <Text style={[styles.celula, styles.colEspeciePec]}>{item.especie || 'N/A'}</Text>
            <Text style={[styles.celula, styles.colRaca]}>{item.racaVariedade || 'N/A'}</Text>
            <Text style={[styles.celula, styles.colCabecas]}>{item.numeroCabecas || '0'}</Text>
            <Text style={[styles.celula, styles.colProducaoPec]}>{item.producao || 'N/A'}</Text>
            <Text style={[styles.celula, styles.colObsPec]}>{item.observacoes || ''}</Text>
          </View>
        ))
      ) : (
        <>
          <View style={styles.tabelaRow}>
            <Text style={[styles.celula, styles.colEpoca]}>2024</Text>
            <Text style={[styles.celula, styles.colEspeciePec]}>______________</Text>
            <Text style={[styles.celula, styles.colRaca]}>______________</Text>
            <Text style={[styles.celula, styles.colCabecas]}>_____</Text>
            <Text style={[styles.celula, styles.colProducaoPec]}>______________</Text>
            <Text style={[styles.celula, styles.colObsPec]}>__________________</Text>
          </View>
          <View style={styles.tabelaRow}>
            <Text style={[styles.celula, styles.colEpoca]}>2023</Text>
            <Text style={[styles.celula, styles.colEspeciePec]}>______________</Text>
            <Text style={[styles.celula, styles.colRaca]}>______________</Text>
            <Text style={[styles.celula, styles.colCabecas]}>_____</Text>
            <Text style={[styles.celula, styles.colProducaoPec]}>______________</Text>
            <Text style={[styles.celula, styles.colObsPec]}>__________________</Text>
          </View>
          <View style={styles.tabelaRow}>
            <Text style={[styles.celula, styles.colEpoca]}>2022</Text>
            <Text style={[styles.celula, styles.colEspeciePec]}>______________</Text>
            <Text style={[styles.celula, styles.colRaca]}>______________</Text>
            <Text style={[styles.celula, styles.colCabecas]}>_____</Text>
            <Text style={[styles.celula, styles.colProducaoPec]}>______________</Text>
            <Text style={[styles.celula, styles.colObsPec]}>__________________</Text>
          </View>
        </>
      )}
    </View>
  </View>
);

// Componente das finalidades - EM LINHA
const FinalidadesSection = ({ finalidades }) => (
  <View style={styles.finalidades}>
    <Text style={styles.finalidadesTitulo}>Este certificado é emitido para efeitos de:</Text>
    <View style={styles.checkboxContainer}>
      <View style={styles.checkboxItem}>
        <View style={[
          styles.checkbox,
          (finalidades?.includes('CREDITO_AGRICOLA')) && styles.checkboxChecked
        ]} />
        <Text style={styles.checkboxLabel}>Obtenção de Crédito Agrícola</Text>
      </View>
      <View style={styles.checkboxItem}>
        <View style={[
          styles.checkbox,
          (finalidades?.includes('SEGURO_AGRICOLA')) && styles.checkboxChecked
        ]} />
        <Text style={styles.checkboxLabel}>Contratação de Seguro Agrícola</Text>
      </View>
      <View style={styles.checkboxItem}>
        <View style={[
          styles.checkbox,
          (finalidades?.includes('CARTA_GARANTIA')) && styles.checkboxChecked
        ]} />
        <Text style={styles.checkboxLabel}>Carta de Garantia</Text>
      </View>
      <View style={styles.checkboxItem}>
        <View style={[
          styles.checkbox,
          (finalidades?.includes('PRODUTOR_FORMAL')) && styles.checkboxChecked
        ]} />
        <Text style={styles.checkboxLabel}>Reconhecimento como Produtor Formal</Text>
      </View>
    </View>
  </View>
);

// Componente principal do certificado
const CertificadoValidacaoDocument = ({ dados, tipo }) => {
  const numeroCertificado = gerarNumeroCertificado();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo de fundo - MAIOR */}
        <Image src={logo} style={styles.logoFundo} />

        <View style={styles.content}>
          <HeaderSection tipo={tipo} />

          <View style={styles.numeroCertificado}>
            <Text>N.º: {numeroCertificado}</Text>
          </View>

          <Text style={styles.certificaSeQue}>CERTIFICA-SE QUE</Text>

          <Text style={styles.textoPrincipal}>
            O(a) produtor(a) <Text style={styles.destaque}>{dados?.nomeCompleto || 'DEUSINEUSIO ARTUR DOS SANTOS'}</Text>, portador do bilhete número: <Text style={styles.destaque}>{dados?.bi || '0066449LA098'}</Text>, encontra-se regularmente
            cadastrado(a) junto das autoridades agrícolas e demonstra actividade produtiva contínua e
            verificável durante um período de cinco (5) anos, com base em registos de vistoria técnica anual e
            histórico de produção, cumprindo os critérios estabelecidos para certificação.
          </Text>

          {tipo === 'agricultura' ? (
            <TabelaAgricolaSection producaoAgricola={dados?.producaoAgricola} />
          ) : (
            <TabelaPecuariaSection producaoPecuaria={dados?.producaoPecuaria} />
          )}

          <FinalidadesSection finalidades={dados?.finalidadeCertificado} />

          <View style={styles.validade}>
            <Text style={styles.validadeLabel}>
              Validade do Certificado: {formatDate(dados?.validadeInicio) || '__/__/____'} a {formatDate(dados?.validadeFim) || '__/__/____'}
            </Text>
          </View>

          <View style={styles.emissao}>
            <View style={styles.emissaoItem}>
              <Text style={styles.emissaoLabel}>Emitido em: </Text>
              <Text>{formatDate(new Date()) || '__/__/____'}</Text>
            </View>
            <View style={styles.emissaoItem}>
              <Text style={styles.emissaoLabel}>Município de: </Text>
              <Text>{dados?.municipio || '___________________________'}</Text>
            </View>
          </View>

          <Text style={[styles.emissaoItem, { fontSize: 9, fontWeight: 'bold', marginBottom: 8 }]}>
            Assinatura e carimbo da Direcção Municipal de Agricultura:
          </Text>

          <View style={styles.assinaturas}>
            <View style={styles.assinaturaSection}>
              <Text style={styles.assinaturaTitulo}>Técnico responsável Pela Vistoria</Text>
              <Text style={{ fontSize: 8, marginTop: 3 }}>{dados?.tecnicoResponsavel || ''}</Text>
              <View style={styles.linhaAssinatura} />
            </View>

            <View style={styles.assinaturaSection}>
              <Text style={styles.assinaturaTitulo}>DIRECTOR NACIONAL DO IDA</Text>
              <View style={styles.linhaAssinatura} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Função para verificar se há dados válidos na lista
const temDadosValidos = (lista) => {
  return lista && Array.isArray(lista) && lista.length > 0 &&
    lista.some(item => {
      // Verifica se pelo menos um item tem dados preenchidos
      const valores = Object.values(item || {});
      return valores.some(valor => valor && valor.toString().trim() !== '' && valor !== 'N/A');
    });
};

// Função corrigida para enviar dados para API e gerar certificados
export const gerarCertificadoValidacao = async (dadosFormulario) => {
  try {
    console.log('Verificando dados disponíveis:', dadosFormulario);

    // Função para verificar se há dados válidos na lista
    const temDadosValidos = (lista) => {
      return lista && Array.isArray(lista) && lista.length > 0 &&
        lista.some(item => {
          // Verifica se pelo menos um item tem dados preenchidos
          const valores = Object.values(item || {});
          return valores.some(valor => valor && valor.toString().trim() !== '' && valor !== 'N/A');
        });
    };


    // Verificar quais tipos de produção têm dados
    const temDadosAgricola = temDadosValidos(dadosFormulario.producaoAgricola);
    const temDadosPecuaria = temDadosValidos(dadosFormulario.producaoPecuaria);

    console.log('Dados Agrícola:', temDadosAgricola);
    console.log('Dados Pecuária:', temDadosPecuaria);

    // Verificar se há pelo menos um tipo de produção com dados
    if (!temDadosAgricola && !temDadosPecuaria) {
      throw new Error('Nenhum dado de produção encontrado. Adicione pelo menos uma produção agrícola ou pecuária antes de gerar o certificado.');
    }

    // Preparar finalidades como array se necessário
    let finalidades = dadosFormulario.dadosProdutor?.finalidadeCertificado || [];
    if (typeof finalidades === 'string') {
      finalidades = [finalidades];
    } else if (Array.isArray(finalidades) && finalidades.length > 0 && typeof finalidades[0] === 'object') {
      finalidades = finalidades.map(f => f.value || f);
    }

    // Mapear dados de produção agrícola para o formato da API
    const historicoDeProducaoAgricolas = (dadosFormulario.producaoAgricola || [])
      .filter(item => item && Object.values(item).some(valor => valor && valor.toString().trim() !== ''))
      .map(item => {
        const ano = parseInt(item.ano);
        return {
          ano: isNaN(ano) ? new Date().getFullYear() : ano,
          produto: (item.produto || "").toString().trim() || "Produto não especificado",
          especieOuVariedade: (item.especieVariedade || item.especieOuVariedade || "").toString().trim(),
          areaCultivada: (item.areaCultivada || "0").toString(),
          producao: (item.producao || "0").toString(),
          modoDeProducao: (item.modoProducao || item.modoDeProducao || "Convencional").toString(),
          meiosDisponiveis: (item.meiosDisponiveis || "").toString(),
          observacoes: (item.observacoes || "").toString()
        };
      });

    // Mapear dados de produção pecuária para o formato da API
    const historicoDeProduaooPecuarias = (dadosFormulario.producaoPecuaria || [])
      .filter(item => item && Object.values(item).some(valor => valor && valor.toString().trim() !== ''))
      .map(item => {
        const ano = parseInt(item.ano);
        return {
          ano: isNaN(ano) ? new Date().getFullYear() : ano,
          especiePecuaria: (item.especie || item.especiePecuaria || "").toString().trim() || "Espécie não especificada",
          racaPorVariedade: (item.racaVariedade || item.racaPorVariedade || "").toString().trim(),
          numeroDeCabecasPorLitros: (item.numeroCabecas || item.numeroDeCabecasPorLitros || "0").toString(),
          producaoDeCarneLeiteOvos: (item.producao || item.producaoDeCarneLeiteOvos || "").toString(),
          observacoes: (item.observacoes || "").toString()
        };
      });

    // Mapear dados de vistorias para o formato da API
    const historicoDeVistorias = (dadosFormulario.vistorias || [])
      .filter(item => item && Object.values(item).some(valor => valor && valor.toString().trim() !== ''))
      .map(item => {
        // Garantir formato de data correto (apenas data, sem hora)
        let dataVisita;
        try {
          if (item.dataVisita || item.dataDeVisita) {
            const data = new Date(item.dataVisita || item.dataDeVisita);
            dataVisita = data.toISOString().split('T')[0]; // Formato YYYY-MM-DD
          } else {
            dataVisita = new Date().toISOString().split('T')[0];
          }
        } catch {
          dataVisita = new Date().toISOString().split('T')[0];
        }

        return {
          dataDeVisita: dataVisita,
          tecnicoResponsavel: (item.tecnicoResponsavel || dadosFormulario.dadosProdutor?.tecnicoResponsavel || "").toString(),
          observacoesTecnicas: (item.observacoes || item.observacoesTecnicas || "").toString(),
          assinatura: (item.assinatura || "").toString()
        };
      });

    // Se não há vistorias, criar uma padrão
    if (historicoDeVistorias.length === 0) {
      historicoDeVistorias.push({
        dataDeVisita: new Date().toISOString().split('T')[0],
        tecnicoResponsavel: (dadosFormulario.dadosProdutor?.tecnicoResponsavel || "Técnico Responsável").toString(),
        observacoesTecnicas: "Vistoria realizada conforme procedimentos padrão",
        assinatura: (dadosFormulario.dadosProdutor?.tecnicoResponsavel || "Técnico Responsável").toString()
      });
    }

    // Preparar coordenadas GPS
    const latitude = (dadosFormulario.dadosProdutor?.latitude || "").toString();
    const longitude = (dadosFormulario.dadosProdutor?.longitude || "").toString();
    const coordenadasGPS = latitude && longitude ? `${latitude}, ${longitude}` : "";

    // Validar e preparar produtorId ANTES de usar
    let produtorId = 0;
    if (dadosFormulario.produtorOriginal?._id) {
      produtorId = parseInt(dadosFormulario.produtorOriginal._id);
    } else if (dadosFormulario.dadosProdutor?.produtorId) {
      produtorId = parseInt(dadosFormulario.dadosProdutor.produtorId);
    }

    // Preparar datas de validade no formato YYYY-MM-DD
    const hoje = new Date();
    const validoDeData = dadosFormulario.dadosProdutor?.validadeInicio ?
      new Date(dadosFormulario.dadosProdutor.validadeInicio) : hoje;
    const validoAteData = dadosFormulario.dadosProdutor?.validadeFim ?
      new Date(dadosFormulario.dadosProdutor.validadeFim) :
      new Date(hoje.getFullYear() + 1, hoje.getMonth(), hoje.getDate());

    const validoDe = validoDeData.toISOString().split('T')[0];
    const validoAte = validoAteData.toISOString().split('T')[0];

    // Montar objeto de dados conforme a API espera
    const dadosAPI = {
      // CORREÇÃO 1: Adicionar campo "command" obrigatório
      command: "CriarCertificado", // ou outro valor apropriado

      nomeDaPropriedade: (dadosFormulario.dadosProdutor?.nomePropriedade ||
        dadosFormulario.dadosProdutor?.nomeDaPropriedade || "").toString(),
      latitude: latitude,
      longitude: longitude,
      areaTotalExplorada: (dadosFormulario.dadosProdutor?.areaTotalExplorada || "0").toString(),
      atividadePrincipal: (dadosFormulario.dadosProdutor?.atividadePrincipal || "Agricultura").toString(),
      coordenadasGPS: coordenadasGPS,
      historicoDeProducaoAgricolas: historicoDeProducaoAgricolas,
      historicoDeProduaooPecuarias: historicoDeProduaooPecuarias,
      historicoDeVistorias: historicoDeVistorias,
      finalidadeDoCertificado: finalidades,
      validoDe: validoDe,
      validoAte: validoAte,
      nomeDoTecnicoResponsavel: (dadosFormulario.dadosProdutor?.tecnicoResponsavel || "").toString(),

      // CORREÇÃO 2: Garantir que numeroDoProcesso seja sempre string
      numeroDoProcesso: (dadosFormulario.dadosProdutor?.numeroProcesso ||
        dadosFormulario.produtorOriginal?._id ||
        "PROC-" + Date.now()).toString(),

      observacoesTecnicas: (dadosFormulario.dadosProdutor?.observacoesTecnicas ||
        "Certificação emitida após validação dos dados de produção").toString(),
      produtorId: produtorId
    };

    console.log('🚀 DADOS PREPARADOS PARA API:', dadosAPI);

    // Log de debug detalhado
    console.log('📋 ESTRUTURA DOS DADOS:');
    console.log('- Command:', dadosAPI.command, typeof dadosAPI.command);
    console.log('- ProdutorId:', produtorId, typeof produtorId);
    console.log('- NumeroDoProcesso:', dadosAPI.numeroDoProcesso, typeof dadosAPI.numeroDoProcesso);
    console.log('- Histórico Agrícola:', dadosAPI.historicoDeProducaoAgricolas.length, 'itens');
    console.log('- Histórico Pecuária:', dadosAPI.historicoDeProduaooPecuarias.length, 'itens');
    console.log('- Histórico Vistorias:', dadosAPI.historicoDeVistorias.length, 'itens');
    console.log('- ValidoDe:', dadosAPI.validoDe, typeof dadosAPI.validoDe);
    console.log('- ValidoAte:', dadosAPI.validoAte, typeof dadosAPI.validoAte);
    console.log('- Finalidades:', dadosAPI.finalidadeDoCertificado);

    // Validar campos obrigatórios
    if (!dadosAPI.produtorId || dadosAPI.produtorId === 0) {
      throw new Error('ID do produtor é obrigatório para gerar o certificado');
    }

    if (!dadosAPI.numeroDoProcesso || dadosAPI.numeroDoProcesso.trim() === '') {
      throw new Error('Número do processo é obrigatório para gerar o certificado');
    }

    if (dadosAPI.historicoDeProducaoAgricolas.length === 0 && dadosAPI.historicoDeProduaooPecuarias.length === 0) {
      throw new Error('É necessário ter pelo menos um histórico de produção (agrícola ou pecuária)');
    }

    // 2. ENVIAR PARA API
    try {
      console.log('📡 Enviando para /certificaoDoProdutor...');

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await api.post('/certificaoDoProdutor', dadosAPI, config);

      console.log('✅ Dados salvos na API com sucesso:', response.data);
    } catch (apiError) {
      console.error('❌ Erro ao salvar na API:', apiError);
      console.error('Detalhes do erro:', {
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message,
        config: apiError.config
      });

      // Se for erro 400, mostrar detalhes específicos
      if (apiError.response?.status === 400) {
        console.error('Dados enviados que causaram erro 400:', dadosAPI);
        const errorData = apiError.response?.data;

        let errorMsg = 'Erro de validação (400): ';
        if (errorData?.errors) {
          const errors = Object.entries(errorData.errors).map(([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          }).join('; ');
          errorMsg += errors;
        } else {
          errorMsg += errorData?.message || errorData?.error || JSON.stringify(errorData);
        }

        throw new Error(`${errorMsg}. Verifique se todos os campos obrigatórios estão preenchidos corretamente.`);
      }

      // Se for erro 500, mostrar mais detalhes
      if (apiError.response?.status === 500) {
        console.error('Dados enviados que causaram erro 500:', dadosAPI);
        throw new Error(`Erro interno do servidor (500). Verifique os dados enviados. Detalhes: ${JSON.stringify(apiError.response?.data || apiError.message)}`);
      }

      // Outros erros de API
      throw new Error(`Erro na API (${apiError.response?.status || 'Desconhecido'}): ${apiError.response?.data?.message || apiError.message}`);
    }

    // Dados preparados para o certificado
    const dadosCertificado = {
      ...dadosFormulario.dadosProdutor,
      producaoAgricola: dadosFormulario.producaoAgricola,
      producaoPecuaria: dadosFormulario.producaoPecuaria,
      finalidadeCertificado: finalidades
    };

    // 3. Gerar certificados condicionalmente
    const tiposParaGerar = [];
    if (temDadosAgricola) tiposParaGerar.push('agricultura');
    if (temDadosPecuaria) tiposParaGerar.push('pecuaria');

    console.log(`Gerando ${tiposParaGerar.length} certificado(s):`, tiposParaGerar);

    for (const tipo of tiposParaGerar) {
      console.log(`Gerando PDF do certificado de ${tipo}...`);

      const pdfBlob = await pdf(
        <CertificadoValidacaoDocument dados={dadosCertificado} tipo={tipo} />
      ).toBlob();

      // Download do PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificado_${tipo}_${dadosFormulario.dadosProdutor.numeroProcesso || 'produtor'}_${new Date().toISOString().split('T')[0]}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Download do certificado de ${tipo} iniciado`);

      // Pequena pausa entre downloads se houver mais de um
      if (tiposParaGerar.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Mensagem de sucesso personalizada
    let mensagem = '';
    if (tiposParaGerar.length === 2) {
      mensagem = 'Certificados de Agricultura e Pecuária gerados com sucesso!';
    } else if (tiposParaGerar.includes('agricultura')) {
      mensagem = 'Certificado de Agricultura gerado com sucesso!';
    } else if (tiposParaGerar.includes('pecuaria')) {
      mensagem = 'Certificado de Pecuária gerado com sucesso!';
    }

    console.log(mensagem);
    return { success: true, message: mensagem };

  } catch (error) {
    console.error('Erro ao gerar certificados:', error);
    throw new Error(`Erro ao gerar certificados: ${error.message}`);
  }
};


// Componente React para interface
const CertificadoGenerator = ({ dados, onSuccess, onError }) => {
  const [gerando, setGerando] = useState(false);

  const handleGerar = async () => {
    setGerando(true);
    try {
      await gerarCertificadoValidacao(dados);
      onSuccess?.('Certificados gerados com sucesso!');
    } catch (error) {
      onError?.(error.message);
    } finally {
      setGerando(false);
    }
  };

  // Verificar quais certificados serão gerados
  const temDadosAgricola = temDadosValidos(dados?.producaoAgricola);
  const temDadosPecuaria = temDadosValidos(dados?.producaoPecuaria);

  let textoBotao = '🏆 Gerar Certificado';
  if (temDadosAgricola && temDadosPecuaria) {
    textoBotao = '🏆 Gerar Certificados (Agricultura + Pecuária)';
  } else if (temDadosAgricola) {
    textoBotao = '🌾 Gerar Certificado de Agricultura';
  } else if (temDadosPecuaria) {
    textoBotao = '🐄 Gerar Certificado de Pecuária';
  }

  const podeGerar = dados && (temDadosAgricola || temDadosPecuaria);

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
          ⚠️ Adicione pelo menos uma produção agrícola ou pecuária para gerar o certificado
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
          <strong>🔍 Dados para API (/certificaoDoProdutor):</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li><strong>ProdutorId:</strong> {dados.produtorOriginal?._id || 'N/A'}</li>
            <li><strong>NumeroDoProcesso:</strong> {dados.dadosProdutor?.numeroProcesso || 'N/A'}</li>
            <li><strong>Técnico:</strong> {dados.dadosProdutor?.tecnicoResponsavel || 'N/A'}</li>
            <li><strong>Área Total:</strong> {dados.dadosProdutor?.areaTotalExplorada || 'N/A'} ha</li>
            <li><strong>Atividade:</strong> {dados.dadosProdutor?.atividadePrincipal || 'N/A'}</li>
            <li><strong>Prod. Agrícola:</strong> {dados.producaoAgricola?.length || 0} itens</li>
            <li><strong>Prod. Pecuária:</strong> {dados.producaoPecuaria?.length || 0} itens</li>
            <li><strong>Vistorias:</strong> {dados.vistorias?.length || 0} itens</li>
          </ul>
        </div>
      )}

      <button
        onClick={handleGerar}
        disabled={gerando || !podeGerar}
        style={{
          padding: '12px 24px',
          backgroundColor: gerando || !podeGerar ? '#6c757d' : '#2c5aa0',
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
          <>⏳ Gerando Certificado(s)...</>
        ) : (
          textoBotao
        )}
      </button>

      {gerando && (
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          color: '#666'
        }}>
          📡 Enviando dados para API /certificaoDoProdutor...
        </div>
      )}
    </div>
  );
};

export default CertificadoGenerator;