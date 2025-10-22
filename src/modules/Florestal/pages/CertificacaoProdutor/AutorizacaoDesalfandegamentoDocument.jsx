// AutorizacaoDesalfandegamentoGenerator.jsx
import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import emblema from '../../../../assets/emblema.png';

// Estilos para o documento de autorização
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
        lineHeight: 1.4,
    },

    // Cabeçalho
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },

    logo: {
        width: 70,
        height: 70,
        marginBottom: 8,
    },

    headerText: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
        lineHeight: 1.2,
    },

    // Número da autorização
    numeroAutorizacao: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },

    // Texto principal
    paragrafo: {
        fontSize: 11,
        lineHeight: 1.5,
        textAlign: 'justify',
        marginBottom: 8,
    },

    bold: {
        fontWeight: 'bold',
    },

    // Dados da empresa - INLINE
    dadosEmpresaContainer: {
        marginBottom: 15,
    },

    itemEmpresaInline: {
        fontSize: 11,
        marginBottom: 2,
        lineHeight: 1.4,
    },

    // Texto destaque
    textoDestaque: {
        fontSize: 11,
        marginBottom: 8,
        marginTop: 8,
        fontWeight: 'bold',
    },

    // Tabela de mercadorias
    tabela: {
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000',
    },

    tabelaHeader: {
        flexDirection: 'row',
        backgroundColor: '#e8e8e8',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        padding: 6,
    },

    tabelaRow: {
        flexDirection: 'row',
        padding: 6,
        minHeight: 30,
    },

    colMercadoria: {
        width: '30%',
        fontSize: 10,
        fontWeight: 'bold',
    },

    colQuantidade: {
        width: '15%',
        fontSize: 10,
        fontWeight: 'bold',
    },

    colValor: {
        width: '15%',
        fontSize: 10,
        fontWeight: 'bold',
    },

    colMoeda: {
        width: '15%',
        fontSize: 10,
        fontWeight: 'bold',
    },

    colOrigem: {
        width: '25%',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Valores das células
    colMercadoriaValue: {
        width: '30%',
        fontSize: 10,
    },

    colQuantidadeValue: {
        width: '15%',
        fontSize: 10,
    },

    colValorValue: {
        width: '15%',
        fontSize: 10,
    },

    colMoedaValue: {
        width: '15%',
        fontSize: 10,
    },

    colOrigemValue: {
        width: '25%',
        fontSize: 10,
    },

    // Informações da fatura - INLINE
    infoFaturaContainer: {
        marginTop: 10,
        marginBottom: 15,
    },

    itemFaturaInline: {
        fontSize: 11,
        marginBottom: 2,
        lineHeight: 1.4,
    },

    // Observações
    observacoes: {
        fontSize: 11,
        lineHeight: 1.5,
        textAlign: 'justify',
        marginBottom: 8,
    },

    italico: {
        fontStyle: 'italic',
    },

    // Rodapé
    rodape: {
        marginTop: 30,
        alignItems: 'center',
    },

    rodapeText: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2,
        textAlign: 'center',
        lineHeight: 1.2,
    },

    assinatura: {
        fontSize: 11,
        marginTop: 20,
        textAlign: 'center',
    },

    documentoEletronico: {
        fontSize: 9,
        fontStyle: 'italic',
        marginTop: 5,
        textAlign: 'center',
        color: '#666',
    },
});

// Componente do Documento de Autorização
const AutorizacaoDesalfandegamentoDocument = ({ dados }) => {
    const numeroAutorizacao = `${Math.floor(Math.random() * 900000000000) + 100000000000}`;
    const dataAtual = new Date().toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <Image src={emblema} style={styles.logo} />
                    <Text style={styles.headerText}>REPÚBLICA DE ANGOLA</Text>
                    <Text style={styles.headerText}>Ministério da Agricultura e Pescas</Text>
                    <Text style={styles.headerText}>Instituto de Desenvolvimento Florestal</Text>
                    <Text style={styles.headerText}>Gabinete do Director Geral</Text>
                </View>

                {/* Número da Autorização */}
                <Text style={styles.numeroAutorizacao}>
                    AUTORIZAÇÃO Nº: {numeroAutorizacao}
                </Text>

                {/* Texto Principal */}
                <Text style={styles.paragrafo}>
                    Por esta Direcção Geral do Instituto de Desenvolvimento Florestal (IDF) faz-se constar as autoridades a quem o conhecimento desta competir que, a {dados.isProdutorExistente ? 'Empresa' : 'Entidade'}:
                </Text>

                {/* Dados da Empresa/Produtor - INLINE */}
                <View style={styles.dadosEmpresaContainer}>
                    <Text style={styles.itemEmpresaInline}>
                        <Text style={styles.bold}>NOME: </Text>
                        {dados.isProdutorExistente
                            ? (dados.produtorSelecionado?.nome || 'N/A').toUpperCase()
                            : (dados.formData?.nome || 'N/A').toUpperCase()}
                    </Text>
                    <Text style={styles.itemEmpresaInline}>
                        <Text style={styles.bold}>NIF: </Text>
                        {dados.isProdutorExistente
                            ? (dados.produtorSelecionado?.bi || 'N/A')
                            : (dados.formData?.nif || 'N/A')}
                    </Text>
                    <Text style={styles.itemEmpresaInline}>
                        <Text style={styles.bold}>ENDEREÇO: </Text>
                        {dados.isProdutorExistente
                            ? `${dados.produtorSelecionado?.endereco || dados.produtorSelecionado?.provincia || ''}, ${dados.produtorSelecionado?.municipio || ''}, ${dados.produtorSelecionado?.provincia || ''}, ANGOLA`
                            : `${dados.formData?.endereco || ''}, ${dados.formData?.municipio || ''}, ${dados.formData?.provincia || ''}, ANGOLA`}
                    </Text>
                </View>

                {/* Texto de Autorização */}
                <Text style={styles.textoDestaque}>
                    está autorizada a desalfandegar:
                </Text>

                {/* Tabela de Mercadorias */}
                <View style={styles.tabela}>
                    {/* Cabeçalho da Tabela */}
                    <View style={styles.tabelaHeader}>
                        <Text style={styles.colMercadoria}>Mercadoria</Text>
                        <Text style={styles.colQuantidade}>Quantidade</Text>
                        <Text style={styles.colValor}>Valor</Text>
                        <Text style={styles.colMoeda}>moeda</Text>
                        <Text style={styles.colOrigem}>Origem</Text>
                    </View>

                    {/* Linhas de Mercadorias */}
                    {dados.mercadorias && dados.mercadorias.map((item, index) => (
                        <View key={index} style={styles.tabelaRow}>
                            <Text style={styles.colMercadoriaValue}>{item.mercadoria || 'N/A'}</Text>
                            <Text style={styles.colQuantidadeValue}>{item.quantidade || '0'}</Text>
                            <Text style={styles.colValorValue}>{item.valor || '0'}</Text>
                            <Text style={styles.colMoedaValue}>{item.moeda || 'AOA'}</Text>
                            <Text style={styles.colOrigemValue}>{(item.origem || 'N/A').toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                {/* Informações da Fatura - INLINE */}
                <View style={styles.infoFaturaContainer}>
                    <Text style={styles.itemFaturaInline}>
                        <Text style={styles.bold}>provenientes de: </Text>
                        {dados.mercadorias?.[0]?.origem || 'N/A'}
                    </Text>
                    <Text style={styles.itemFaturaInline}>
                        <Text style={styles.bold}>Nº FACTURA PROFORMA: </Text>
                        {numeroAutorizacao.substring(0, 8)}
                    </Text>
                    <Text style={styles.itemFaturaInline}>
                        <Text style={styles.bold}>DATA FACTURA PROFORMA: </Text>
                        {dataAtual}
                    </Text>
                    <Text style={[styles.itemFaturaInline, styles.italico]}>
                        * Este documento é apenas válido para a importação dos bens inscritos nas facturas indicadas.
                    </Text>
                </View>

                {/* Observações Legais */}
                <Text style={styles.observacoes}>
                    O portador deverá cumprir com os preceitos técnicos estabelecidos no RF. 153 do Decreto Presidencial nº 171/18 do Regulamento Florestal e Fauna Selvagem.
                </Text>

                <Text style={styles.observacoes}>
                    Para que não haja impedimento mandei passar a presente autorização que vai por mim assinada e autenticada.
                </Text>

                <Text style={[styles.observacoes, styles.bold]}>
                    OBS: O produto deve fazer-se acompanhar do Certificado Fitossanitário da origem.
                </Text>

                {/* Rodapé */}
                <View style={styles.rodape}>
                    <Text style={styles.rodapeText}>
                        DIRECÇÃO GERAL DO INSTITUTO DE DESENVOLVIMENTO FLORESTAL
                    </Text>
                    <Text style={styles.rodapeText}>
                        EM LUANDA aos {dataAtual}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

// Função para gerar e baixar o PDF
export const gerarAutorizacaoDesalfandegamento = async (dados) => {
    try {
        console.log('📄 Gerando autorização de desalfandegamento...', dados);

        // Validar se há mercadorias
        if (!dados.mercadorias || dados.mercadorias.length === 0) {
            throw new Error('É necessário adicionar pelo menos uma mercadoria para gerar a autorização.');
        }

        // Gerar número de autorização
        const numeroAutorizacao = `${Math.floor(Math.random() * 900000000000) + 100000000000}`;

        // Gerar o PDF
        const blob = await pdf(
            <AutorizacaoDesalfandegamentoDocument dados={dados} />
        ).toBlob();

        // Criar nome do arquivo
        const nomeArquivo = `Autorizacao_Desalfandegamento_${numeroAutorizacao}_${new Date().toISOString().split('T')[0]}.pdf`;

        // Download do arquivo
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('✅ Autorização de desalfandegamento gerada com sucesso!');

        return {
            success: true,
            message: 'Autorização de desalfandegamento gerada com sucesso!',
            numeroAutorizacao
        };

    } catch (error) {
        console.error('❌ Erro ao gerar autorização:', error);
        throw new Error(`Erro ao gerar autorização: ${error.message}`);
    }
};

export default AutorizacaoDesalfandegamentoDocument;