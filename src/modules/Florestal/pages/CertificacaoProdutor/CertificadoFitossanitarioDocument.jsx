import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import emblema from '../../../../assets/emblema.png';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 50,
        fontSize: 12,
        fontFamily: 'Helvetica',
        lineHeight: 1.2,
        position: 'relative',
    },

    // 🎨 FAIXAS DIAGONAIS - IGUAIS AO DOCUMENTO ORIGINAL
    faixaDiagonalVermelha: {
        position: 'absolute',
        top: -30, // sobe um pouco para cobrir o topo
        left: 120,
        width: 20,
        height: 400,
        backgroundColor: '#dc2626',
        transform: 'rotate(40deg)', // esta rotação funciona no react-pdf
        transformOrigin: 'top left',
    },

    faixaDiagonalPreta: {
        position: 'absolute',
        top: -40,
        left: 150,
        width: 20,
        height: 400,
        backgroundColor: '#000',
        transform: 'rotate(40deg)',
        transformOrigin: 'top left',
    },

    content: {
        position: 'relative',
        zIndex: 1,
    },

    header: {
        alignItems: 'center',
        marginBottom: 15,
    },

    logo: {
        width: 40,
        height: 40,
        marginBottom: 3,
    },

    headerText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 1.1,
    },

    headerTextRed: {
        fontSize: 12,
        textAlign: 'center',
        color: '#dc2626',
        fontStyle: 'italic',
        marginTop: 3,
        marginBottom: 15,
    },

    numeroCertificado: {
        fontSize: 10,
        textAlign: 'right',
        marginBottom: 10,
        fontWeight: 'bold',
    },

    titulo: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 3,
    },

    tituloIngles: {
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#dc2626',
        marginBottom: 15,
    },

    textoBilingual: {
        fontSize: 12,
        textAlign: 'justify',
        marginBottom: 1,
        lineHeight: 1.2,
    },

    textoIngles: {
        fontStyle: 'italic',
        fontSize: 12,
        color: '#dc2626',
    },

    separador: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        marginVertical: 10,
    },

    tituloSecao: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 3,
    },

    tituloSecaoIngles: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#dc2626',
        marginBottom: 5,
    },

    textoDeclaracao: {
        fontSize: 12,
        marginBottom: 3,
    },

    campoForm: {
        marginBottom: 5,
    },

    campoLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 1,
    },

    campoLabelIngles: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#dc2626',
    },

    campoLinha: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 2,
        minHeight: 12,
    },

    campoValor: {
        fontSize: 12,
    },

    rodape: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    seloValor: {
        width: '30%',
        alignItems: 'center',
    },

    seloTexto: {
        fontSize: 12,
        marginBottom: 3,
    },

    assinatura: {
        width: '65%',
        alignItems: 'center',
    },

    cargoTexto: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 3,
        textAlign: 'center',
    },

    nomeAssinatura: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 2,
        textAlign: 'center',
    },

    cargoAssinatura: {
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    profissao: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 2,
    },
});

const CertificadoFitossanitarioDocument = ({ dados }) => {
    const numeroCertificado = `${Math.floor(Math.random() * 9000) + 1000}/${new Date().getFullYear()}`;
    const dataAtual = new Date(dados.dataEmissao || new Date()).toLocaleDateString('pt-PT');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* 🎨 FAIXAS DECORATIVAS NO TOPO */}
                <View style={styles.faixaDiagonalVermelha} />
                <View style={styles.faixaDiagonalPreta} />

                <View style={styles.content}>
                    {/* 🏛️ CABEÇALHO */}
                    <View style={styles.header}>
                        <Image src={emblema} style={styles.logo} />
                        <Text style={styles.headerText}>REPÚBLICA DE ANGOLA</Text>
                        <Text style={styles.headerText}>MINISTÉRIO DA AGRICULTURA E FLORESTAS</Text>
                        <Text style={styles.headerText}>INSTITUTO DE DESENVOLVIMENTO FLORESTAL</Text>
                        <Text style={styles.headerText}>Departamento Florestal</Text>
                        <Text style={styles.headerTextRed}>Forestry Department.</Text>
                    </View>

                    {/* Nº DO CERTIFICADO */}
                    <Text style={styles.numeroCertificado}>Nº {numeroCertificado}</Text>

                    {/* TÍTULOS */}
                    <Text style={styles.titulo}>CERTIFICADO FITOSSANITÁRIO</Text>
                    <Text style={styles.tituloIngles}>Phytosanitary Certificate</Text>

                    {/* TEXTO PRINCIPAL */}
                    <View>
                        <Text style={styles.textoBilingual}>
                            CERTIFICA-SE QUE AS PLANTAS, PARTE DE PLANTAS OU PRODUTOS VEGETAIS QUE
                        </Text>
                        <Text style={[styles.textoBilingual, styles.textoIngles]}>
                            This is to certify that the plants, parts of plants or plant products
                        </Text>
                        <Text style={styles.textoBilingual}>
                            CONSTITUEM A REMESSA ABAIXO DESCRITA FORAM CUIDADOSAMENTE INSPECCIONADOS, NA
                        </Text>
                        <Text style={[styles.textoBilingual, styles.textoIngles]}>
                            described below or representative samples of them were thoroughly
                        </Text>
                        <Text style={styles.textoBilingual}>
                            TOTALIDADE OU EM PARTE REPRESENTATIVA, EM <Text style={{ fontWeight: 'bold' }}>{dados.localInspecao || '_______________'}</Text> POR <Text style={{ fontWeight: 'bold' }}>{dados.nomeFuncionarioAutorizado || '_______________'}</Text>
                        </Text>
                        <Text style={[styles.textoBilingual, styles.textoIngles]}>
                            examined on by an authorized officer of the plant protection service and were found to the best of
                        </Text>
                        <Text style={styles.textoBilingual}>
                            FUNCIONÁRIO AUTORIZADO DA REPARTIÇÃO DE SANIDADE VEGETAL E CONSIDERADOS PRATICA-
                        </Text>
                        <Text style={[styles.textoBilingual, styles.textoIngles]}>
                            his knowledge to be substantially free from injurious diseases and pests: and that
                        </Text>
                        <Text style={styles.textoBilingual}>
                            MENTE ISENTOS DE DOENÇAS E INIMIGOS PERIGOSOS DAS CULTURAS; E QUE A MESMA REMESSA E
                        </Text>
                        <Text style={[styles.textoBilingual, styles.textoIngles]}>
                            the consignment is believed to conform with the current phytosanitary regulations
                        </Text>
                        <Text style={styles.textoBilingual}>
                            CONSIDERADA NAS CONDIÇÕES EXIGIDAS PELOS REGULAMENTOS FITOSSANITÁRIOS EM VIGOR NO
                        </Text>
                        <Text style={[styles.textoBilingual, styles.textoIngles]}>
                            of the importing country.
                        </Text>
                        <Text style={styles.textoBilingual}>
                            PAÍS IMPORTADOR.
                        </Text>
                    </View>

                    {/* LINHA */}
                    <View style={styles.separador} />

                    {/* DECLARAÇÕES EVENTUAIS */}
                    <View>
                        <Text style={styles.tituloSecao}>
                            DECLARAÇÕES EVENTUAIS (QUANDO EXIGIDAS PELO PAÍS IMPORTADOR):
                        </Text>
                        <Text style={styles.tituloSecaoIngles}>
                            Additional declarations (when demanded by the importing country):
                        </Text>
                        <Text style={styles.textoDeclaracao}>
                            {dados.tratamentoAplicado || 'THE FUMIGATION CONDITION OF 25ºC, 48H, 80G/m³ (CH₃Br)'}
                        </Text>
                    </View>

                    {/* DESCRIÇÃO DA REMESSA */}
                    <View>
                        <View style={styles.separador} />
                        <Text style={[styles.tituloSecao, { textAlign: 'center', marginBottom: 5 }]}>
                            DESCRIÇÃO DA REMESSA
                        </Text>
                        <Text style={[styles.tituloSecaoIngles, { textAlign: 'center', marginBottom: 8 }]}>
                            Description of the consignment
                        </Text>

                        {[
                            ['NATUREZA DA MERCADORIA', 'Name of produce:', dados.naturezaMercadoria],
                            ['NOME BOTÂNICO (QUANDO EXIGIDO PELO PAÍS IMPORTADOR):', 'Botanical name (when demanded by the importing country):', dados.nomeBotanico],
                            ['ORIGEM (QUANDO EXIGIDA PELO PAÍS IMPORTADOR):', 'Origin (when demanded by the importing country):', dados.origem],
                            ['QUANTIDADE, NATUREZA E PESO DOS VOLUMES:', 'Number and description of packages:', `${dados.quantidadeVolumes || ''} ${dados.naturezaVolumes || ''} ${dados.pesoVolumes ? `- ${dados.pesoVolumes}` : ''}`],
                            ['MARCAS E NÚMEROS:', 'Distinguishing marks:', dados.marcasNumeros],
                            ['NOME E ENDEREÇO DO EXPORTADOR:', 'Name and address of the exporter:', `${dados.nomeExportador || ''}${dados.enderecoExportador ? ` - ${dados.enderecoExportador}` : ''}`],
                            ['NOME E ENDEREÇO DO DESTINATÁRIO:', 'Name and address of the consignee:', `${dados.nomeDestinatario || ''}${dados.enderecoDestinatario ? ` - ${dados.enderecoDestinatario}` : ''}`],
                            ['PONTO DE ENTRADA:', 'Point of entry:', dados.pontoEntrada],
                            ['MEIO DE TRANSPORTE:', 'Means of conveyance:', dados.meioTransporte],
                            ['PORTO DE ENTRADA:', 'Port of entry:', dados.portoEntrada],
                        ].map(([pt, en, value], i) => (
                            <View style={styles.campoForm} key={i}>
                                <Text style={styles.campoLabel}>
                                    {pt} <Text style={styles.campoLabelIngles}>{en}</Text>
                                </Text>
                                <View style={styles.campoLinha}>
                                    <Text style={styles.campoValor}>{value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* RODAPÉ */}
                    <View style={styles.rodape}>
                        <View style={styles.seloValor}>
                            <Text style={styles.seloTexto}>____________KZ {dados.valorSelo || '20.00'}____________</Text>
                            <Text style={[styles.seloTexto, { fontWeight: 'bold' }]}>S.R. NACIONAL</Text>
                        </View>

                        <View style={styles.assinatura}>
                            <Text style={styles.cargoTexto}>O DIRECTOR GERAL</Text>
                            <Text style={styles.nomeAssinatura}>
                                {dados.nomeFuncionarioAutorizado?.toUpperCase() || 'SIMÃO ZAU'}
                            </Text>
                            <Text style={styles.cargoAssinatura}>(CARGO - Rank)</Text>
                            <Text style={styles.profissao}>ENGENHEIRO FLORESTAL</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

// Função para gerar e baixar o PDF
export const gerarCertificadoFitossanitario = async (dados) => {
    try {
        const numeroCertificado = `${Math.floor(Math.random() * 9000) + 1000}/${new Date().getFullYear()}`;
        const blob = await pdf(<CertificadoFitossanitarioDocument dados={dados} />).toBlob();

        const nomeArquivo = `Certificado_Fitossanitario_${numeroCertificado.replace('/', '-')}_${new Date().toISOString().split('T')[0]}.pdf`;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { success: true, message: 'Certificado gerado com sucesso!', numeroCertificado };
    } catch (error) {
        console.error('❌ Erro ao gerar certificado:', error);
        throw new Error(`Erro ao gerar certificado: ${error.message}`);
    }
};

export default CertificadoFitossanitarioDocument;
