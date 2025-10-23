import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import emblema from '../../../../assets/emblema.png';

// Estilos para o Certificado de Origem - Layout Otimizado
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 50,
        paddingRight: 50,
        fontSize: 7,
        fontFamily: 'Helvetica',
        lineHeight: 1.3,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box', // importante no render
    },


    // Cabeçalho principal - compactado
    headerContainer: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#000',
        marginBottom: 0,
    },

    headerLeft: {
        width: '50%',
        padding: 6,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerRight: {
        width: '50%',
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logoEmblema: {
        width: 35,
        height: 35,
        marginBottom: 3,
    },

    republica: {
        fontSize: 7,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
    },

    ministerio: {
        fontSize: 7,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
    },

    instituto: {
        fontSize: 6,
        textAlign: 'center',
    },

    codigoBarrasContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 4,
    },

    codigoBarras: {
        width: '70%',
        height: 20,
        backgroundColor: '#000',
        marginBottom: 3,
    },

    tituloContainer: {
        alignItems: 'center',
        marginBottom: 3,
    },

    titulo: {
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
    },

    subtitulo: {
        fontSize: 8,
        fontStyle: 'italic',
        textAlign: 'center',
    },

    // Informações de contato
    infoContato: {
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderColor: '#000',
        padding: 4,
        fontSize: 6,
        marginBottom: 5,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    // Seção de validade - integrada com checkboxes
    validadeContainer: {
        borderWidth: 0.5,
        borderColor: '#000',
        padding: 4,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    validadeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    validadeLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        marginRight: 5,
    },

    validadeBox: {
        borderWidth: 0.5,
        borderColor: '#000',
        padding: 3,
        minWidth: 60,
    },

    // Checkboxes de tipo de operação
    checkboxContainer: {
        flexDirection: 'row',
    },

    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },

    checkbox: {
        width: 10,
        height: 10,
        borderWidth: 0.5,
        borderColor: '#000',
        marginRight: 4,
    },

    checkboxChecked: {
        backgroundColor: '#000',
    },

    checkboxLabel: {
        fontSize: 7,
    },

    // Tabela de informações
    table: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#000',
        marginBottom: 2,
    },

    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
    },

    tableRowLast: {
        borderBottomWidth: 0,
    },

    tableCell: {
        padding: 3,
        fontSize: 6.5,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
    },

    tableCellLast: {
        borderRightWidth: 0,
    },

    tableCellLabel: {
        width: '30%',
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    },

    tableCellValue: {
        width: '70%',
    },

    // Tabela de produtos
    produtosTable: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#000',
        marginTop: 3,
        marginBottom: 5,
    },

    produtosHeader: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
    },

    produtosHeaderCell: {
        padding: 3,
        fontSize: 6,
        fontWeight: 'bold',
        textAlign: 'center',
        borderRightWidth: 0.5,
        borderRightColor: '#000',
    },

    produtosRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
        minHeight: 18,
    },

    produtosCell: {
        padding: 2,
        fontSize: 6,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
        justifyContent: 'center',
    },

    // Declaração
    declaracaoContainer: {
        borderWidth: 0.5,
        borderColor: '#000',
        padding: 4,
        marginBottom: 5,
    },

    declaracaoTitulo: {
        fontSize: 6.5,
        fontWeight: 'bold',
        marginBottom: 2,
        textDecoration: 'underline',
    },

    declaracaoTexto: {
        fontSize: 6,
        lineHeight: 1.3,
        textAlign: 'justify',
    },

    // Seção de autoridade
    autoridadeContainer: {
        borderWidth: 0.5,
        borderColor: '#000',
        padding: 4,
        marginBottom: 5,
    },

    autoridadeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },

    autoridadeItem: {
        width: '48%',
    },

    autoridadeLabel: {
        fontSize: 6,
        marginBottom: 1,
    },

    autoridadeBox: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
        paddingBottom: 1,
        minHeight: 15,
    },

    // Seção de alfândega
    alfandegaContainer: {
        borderWidth: 0.5,
        borderColor: '#000',
        padding: 4,
    },

    // Rodapé
    rodape: {
        marginTop: 5,
        fontSize: 5,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    bold: {
        fontWeight: 'bold',
    },
});

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

// Gerar número de certificado
const gerarNumeroCertificado = () => {
    const ano = new Date().getFullYear();
    const numero = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');
    return `${numero}/IDF/${ano}`;
};

// Componente do Cabeçalho
const HeaderSection = ({ numeroCertificado }) => (
    <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
            <Image src={emblema} style={styles.logoEmblema} />
            <Text style={styles.republica}>REPÚBLICA DE ANGOLA</Text>
            <Text style={styles.ministerio}>MINISTÉRIO DA AGRICULTURA</Text>
            <Text style={styles.instituto}>Instituto de Desenvolvimento Agricultura e Florestas</Text>
        </View>

        <View style={styles.headerRight}>
            <View style={styles.codigoBarrasContainer}>
                <View style={styles.codigoBarras} />
            </View>
            <View style={styles.tituloContainer}>
                <Text style={styles.titulo}>Certificado de Origem</Text>
                <Text style={styles.subtitulo}>(Certificate of Origin)</Text>
            </View>
        </View>
    </View>
);

// Componente de Informações de Contato
const InfoContatoSection = ({ numeroCertificado, dataValidade }) => (
    <View style={styles.infoContato}>
        <View style={styles.infoRow}>
            <Text>Largo António Jacinto, Cx Postal nº 74, Telefax +244 222 323934</Text>
            <View>
                <Text style={{ marginBottom: 2 }}>Nº {numeroCertificado}</Text>
                <Text style={{ fontSize: 6 }}>Válido até (Valid until): {formatDate(dataValidade) || '__/__/____'}</Text>
            </View>
        </View>
        <Text>Luanda; E-mail: idf.luanda@gmail.com</Text>
    </View>
);

// Componente de Validade e Tipo de Operação - apenas checkboxes
const ValidadeSection = ({ tipoCertificado }) => (
    <View style={styles.validadeContainer}>
        <View style={styles.checkboxItem}>
            <View style={[styles.checkbox, tipoCertificado === 'exportacao' && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>Exportação (Export)</Text>
        </View>
        <View style={styles.checkboxItem}>
            <View style={[styles.checkbox, tipoCertificado === 'importacao' && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>Importação (Import)</Text>
        </View>
        <View style={styles.checkboxItem}>
            <View style={[styles.checkbox, tipoCertificado === 'reexportacao' && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>Reexportação (Re-export)</Text>
        </View>
    </View>
);

// Componente de Partes Envolvidas
const PartesEnvolvidasSection = ({ formData }) => (
    <>
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>(1) Exportador:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.exportadorNome || ''}
                </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>Endereço:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.exportadorEndereco || ''}
                </Text>
            </View>
        </View>

        <View style={styles.table}>
            <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>(2) Importador:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.importadorNome || ''}
                </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>Endereço:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.importadorEndereco || ''}
                </Text>
            </View>
        </View>

        <View style={styles.table}>
            <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>(3) Destinatário:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.destinatarioNome || ''}
                </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>Endereço:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.destinatarioEndereco || ''}
                </Text>
            </View>
        </View>
    </>
);

// Componente de Transporte
const TransporteSection = ({ formData }) => (
    <>
        <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>(4) País de Origem:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.paisOrigem || ''}
                </Text>
            </View>
        </View>

        <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>(5) Via de transporte:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.viaTransporte || ''}
                </Text>
            </View>
        </View>

        <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>(6) Ponto de saída:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.pontoSaida || ''}
                </Text>
            </View>
        </View>

        <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>(7) País destino:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.paisDestino || ''}
                </Text>
            </View>
        </View>

        <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={[styles.tableCell, styles.tableCellLabel]}>(8) Ponto de entrada:</Text>
                <Text style={[styles.tableCell, styles.tableCellValue, styles.tableCellLast]}>
                    {formData.pontoEntrada || ''}
                </Text>
            </View>
        </View>
    </>
);

// Componente de Produtos - compactado
const ProdutosSection = ({ produtos }) => (
    <View>
        <Text style={{ fontSize: 7, fontWeight: 'bold', marginTop: 2, marginBottom: 2 }}>
            (9) Descrição do produto:
        </Text>

        <View style={styles.produtosTable}>
            <View style={styles.produtosHeader}>
                <Text style={[styles.produtosHeaderCell, { width: '20%' }]}>Nome vulgar</Text>
                <Text style={[styles.produtosHeaderCell, { width: '20%' }]}>Nome científico</Text>
                <Text style={[styles.produtosHeaderCell, { width: '18%' }]}>Grupo</Text>
                <Text style={[styles.produtosHeaderCell, { width: '14%' }]}>Qualidade</Text>
                <Text style={[styles.produtosHeaderCell, { width: '14%' }]}>Peso (kg)</Text>
                <Text style={[styles.produtosHeaderCell, { width: '14%', borderRightWidth: 0 }]}>Volume (m³)</Text>
            </View>

            {produtos && produtos.length > 0 ? (
                produtos.slice(0, 3).map((produto, index) => (
                    <View key={index} style={[styles.produtosRow, index === Math.min(produtos.length - 1, 2) && { borderBottomWidth: 0 }]}>
                        <Text style={[styles.produtosCell, { width: '20%' }]}>{produto.nomeVulgar || ''}</Text>
                        <Text style={[styles.produtosCell, { width: '20%' }]}>{produto.nomeCientifico || ''}</Text>
                        <Text style={[styles.produtosCell, { width: '18%' }]}>{produto.grupoQualidade || ''}</Text>
                        <Text style={[styles.produtosCell, { width: '14%' }]}>{produto.qualidade || ''}</Text>
                        <Text style={[styles.produtosCell, { width: '14%', textAlign: 'right' }]}>
                            {produto.pesoLiquido || ''}
                        </Text>
                        <Text style={[styles.produtosCell, { width: '14%', borderRightWidth: 0, textAlign: 'right' }]}>
                            {produto.volume || ''}
                        </Text>
                    </View>
                ))
            ) : (
                <>
                    <View style={styles.produtosRow}>
                        <Text style={[styles.produtosCell, { width: '20%' }]}>A.</Text>
                        <Text style={[styles.produtosCell, { width: '20%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '18%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '14%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '14%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '14%', borderRightWidth: 0 }]}></Text>
                    </View>
                    <View style={styles.produtosRow}>
                        <Text style={[styles.produtosCell, { width: '20%' }]}>B.</Text>
                        <Text style={[styles.produtosCell, { width: '20%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '18%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '14%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '14%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '14%', borderRightWidth: 0 }]}></Text>
                    </View>
                    <View style={[styles.produtosRow, { borderBottomWidth: 0 }]}>
                        <Text style={[styles.produtosCell, { width: '20%' }]}>C.</Text>
                        <Text style={[styles.produtosCell, { width: '20%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '18%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '14%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '14%' }]}></Text>
                        <Text style={[styles.produtosCell, { width: '14%', borderRightWidth: 0 }]}></Text>
                    </View>
                </>
            )}
        </View>
    </View>
);

// Componente de Declaração
const DeclaracaoSection = () => (
    <View style={styles.declaracaoContainer}>
        <Text style={styles.declaracaoTitulo}>
            (10) Declaração da Autoridade Florestal e Faunística
        </Text>
        <Text style={styles.declaracaoTexto}>
            Declaramos que o produto ou derivados do produto é proveniente de espécies isentas dos anexos da CITES e foi tratado de acordo com as
            exigências fitossanitárias/zoo-sanitárias internacionais.
        </Text>
    </View>
);

// Componente de Autoridade
const AutoridadeSection = ({ formData }) => (
    <View style={styles.autoridadeContainer}>
        <Text style={{ fontSize: 7, fontWeight: 'bold', marginBottom: 4 }}>
            (11) Autoridade que emite o certificado
        </Text>

        <View style={styles.autoridadeRow}>
            <View style={styles.autoridadeItem}>
                <Text style={styles.autoridadeLabel}>Local</Text>
                <View style={styles.autoridadeBox}>
                    <Text style={{ fontSize: 7 }}>Luanda</Text>
                </View>
            </View>

            <View style={styles.autoridadeItem}>
                <Text style={styles.autoridadeLabel}>Data</Text>
                <View style={styles.autoridadeBox}>
                    <Text style={{ fontSize: 7 }}>{formatDate(new Date())}</Text>
                </View>
            </View>
        </View>

        <View style={styles.autoridadeRow}>
            <View style={styles.autoridadeItem}>
                <Text style={styles.autoridadeLabel}>Cargo, nome e assinatura</Text>
                <View style={styles.autoridadeBox} />
            </View>

            <View style={styles.autoridadeItem}>
                <Text style={styles.autoridadeLabel}>Selo oficial</Text>
                <View style={styles.autoridadeBox} />
            </View>
        </View>
    </View>
);

// Componente de Alfândega
const AlfandegaSection = ({ formData }) => (
    <View style={styles.alfandegaContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 7, fontWeight: 'bold', marginBottom: 3 }}>
                    (12) Alfândegas
                </Text>
                <View style={{ borderWidth: 0.5, borderColor: '#000' }}>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#000' }}>
                        <Text style={[styles.produtosCell, { width: '50%', borderRightWidth: 0.5 }]}>Ver ponto (9)</Text>
                        <Text style={[styles.produtosCell, { width: '50%', borderRightWidth: 0 }]}>Qualidade</Text>
                    </View>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#000' }}>
                        <Text style={[styles.produtosCell, { width: '50%', borderRightWidth: 0.5 }]}>A</Text>
                        <Text style={[styles.produtosCell, { width: '50%', borderRightWidth: 0 }]}></Text>
                    </View>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#000' }}>
                        <Text style={[styles.produtosCell, { width: '50%', borderRightWidth: 0.5 }]}>B</Text>
                        <Text style={[styles.produtosCell, { width: '50%', borderRightWidth: 0 }]}></Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.produtosCell, { width: '50%', borderRightWidth: 0.5, borderBottomWidth: 0 }]}>C</Text>
                        <Text style={[styles.produtosCell, { width: '50%', borderRightWidth: 0, borderBottomWidth: 0 }]}></Text>
                    </View>
                </View>
            </View>

            <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 7, fontWeight: 'bold', marginBottom: 3 }}>
                    (13) Doc. de carga
                </Text>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.autoridadeLabel}>Alfândegas de Saída</Text>
                    <View style={[styles.autoridadeBox, { marginBottom: 6 }]}>
                        <Text style={{ fontSize: 7 }}>{formData.alfandegaSaida || ''}</Text>
                    </View>

                    <Text style={styles.autoridadeLabel}>Data</Text>
                    <View style={styles.autoridadeBox}>
                        <Text style={{ fontSize: 7 }}>{formatDate(formData.dataAlfandega) || ''}</Text>
                    </View>
                </View>
            </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <View style={{ width: '48%' }}>
                <Text style={styles.autoridadeLabel}>Assinatura</Text>
                <View style={styles.autoridadeBox} />
            </View>

            <View style={{ width: '48%' }}>
                <Text style={styles.autoridadeLabel}>Carimbo</Text>
                <View style={styles.autoridadeBox} />
            </View>
        </View>
    </View>
);

// Documento Principal do Certificado de Origem
const CertificadoOrigemDocument = ({ formData, tipoCertificado, produtos }) => {
    const numeroCertificado = gerarNumeroCertificado();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <HeaderSection numeroCertificado={numeroCertificado} />

                <InfoContatoSection numeroCertificado={numeroCertificado} />

                <ValidadeSection formData={formData} tipoCertificado={tipoCertificado} />

                <PartesEnvolvidasSection formData={formData} />

                <TransporteSection formData={formData} />

                <ProdutosSection produtos={produtos} />

                <DeclaracaoSection />

                <AutoridadeSection formData={formData} />

                <AlfandegaSection formData={formData} />

                <Text style={styles.rodape}>
                    Decreto Executivo Nº 385/16, Diário Nº 148 de 1 de Setembro
                </Text>
            </Page>
        </Document>
    );
};

// Função principal para gerar o Certificado de Origem
export const gerarCertificadoOrigem = async (dadosFormulario) => {
    try {
        console.log('🔍 Gerando Certificado de Origem...');
        console.log('📋 Dados recebidos:', dadosFormulario);

        const { formData, tipoCertificado, produtos } = dadosFormulario;

        // Gerar PDF do certificado
        const certificadoBlob = await pdf(
            <CertificadoOrigemDocument
                formData={formData}
                tipoCertificado={tipoCertificado}
                produtos={produtos}
            />
        ).toBlob();

        // Download do PDF
        const numeroCertificado = gerarNumeroCertificado();
        const nomeArquivo = `certificado_origem_${numeroCertificado.replace(/\//g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

        const url = URL.createObjectURL(certificadoBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('✅ Certificado de Origem gerado com sucesso!');

        return {
            success: true,
            numeroCertificado,
            message: `Certificado de Origem ${numeroCertificado} gerado com sucesso!`
        };

    } catch (error) {
        console.error('❌ Erro ao gerar Certificado de Origem:', error);
        throw new Error(`Erro ao gerar certificado: ${error.message}`);
    }
};

export default CertificadoOrigemDocument;