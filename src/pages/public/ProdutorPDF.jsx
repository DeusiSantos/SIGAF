import React from 'react';
import { Image, Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import emblema from '../../assets/emblema.png';
// Estilos para o PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 20,
        fontSize: 10,
        fontFamily: 'Helvetica'
    },
    header: {
        marginBottom: 20,
        textAlign: 'center'
    },
    logo: {
        fontSize: 8,
        marginBottom: 5,
        color: '#666'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    topInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        borderBottom: 1,
        paddingBottom: 10
    },
    section: {
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
        backgroundColor: '#f0f0f0',
        padding: 5
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3
    },
    label: {
        fontWeight: 'bold',
        width: '40%'
    },
    value: {
        width: '60%'
    },
    table: {
        marginTop: 5
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        padding: 3,
        fontWeight: 'bold',
        fontSize: 9
    },
    tableRow: {
        flexDirection: 'row',
        padding: 3,
        borderBottom: 0.5,
        fontSize: 8
    },
    col1: { width: '15%' },
    col2: { width: '20%' },
    col3: { width: '25%' },
    col4: { width: '20%' },
    col5: { width: '20%' },
    twoColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    column: {
        width: '48%'
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
        borderTop: 1,
        paddingTop: 10
    }
});

// Componente do PDF
const ProdutorSIGAFPDF = ({ dadosProdutor }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        if (!value) return '0,00 AOA';
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <Image src={emblema} style={{
                        width: 50,
                        height: 50,
                        marginBottom: 10,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }} />
                    <Text style={styles.logo}>REPÚBLICA DE ANGOLA</Text>
                    <Text style={styles.logo}>MINISTÉRIO DA AGRICULTURA E FLORESTAS</Text>
                    <Text style={styles.title}>FICHA DO PRODUTOR</Text>
                </View>

                {/* Informações do topo */}
                <View style={styles.topInfo}>
                    <View>
                        <Text style={styles.label}>Nº de registro: {dadosProdutor.numeroRegistro || dadosProdutor.id}</Text>
                    </View>
                    <View>
Z                    </View>
                </View>

                {/* Dados da Escola de Campo */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dados da Escola de Campo</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nome da ECA:</Text>
                        <Text style={styles.value}>{dadosProdutor.nomeECA || 'MOSAP'}</Text>
                    </View>
                </View>

                {/* Identificação do Pequeno Produtor */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Identificação do Pequeno Produtor</Text>
                    <View style={styles.twoColumn}>
                        <View style={styles.column}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Nome:</Text>
                                <Text style={styles.value}>{dadosProdutor.nome}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Data de Nascimento:</Text>
                                <Text style={styles.value}>{formatDate(dadosProdutor.dataNascimento)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>BI:</Text>
                                <Text style={styles.value}>{dadosProdutor.bi || 'Não informado'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Nº de Agregados:</Text>
                                <Text style={styles.value}>{dadosProdutor.numeroAgregados || 1}</Text>
                            </View>
                        </View>
                        <View style={styles.column}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Telefone:</Text>
                                <Text style={styles.value}>{dadosProdutor.telefone || 'Não informado'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Gênero:</Text>
                                <Text style={styles.value}>{dadosProdutor.genero || 'Não informado'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Nome do Pai:</Text>
                                <Text style={styles.value}>{dadosProdutor.nomePai || 'Sebstiao Santos'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Nome da Mãe:</Text>
                                <Text style={styles.value}>{dadosProdutor.nomeMae || 'Maria'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Localização */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Localização</Text>
                    <View style={styles.twoColumn}>
                        <View style={styles.column}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Província:</Text>
                                <Text style={styles.value}>{dadosProdutor.provincia || 'Não informado'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Município:</Text>
                                <Text style={styles.value}>{dadosProdutor.municipio || 'Não informado'}</Text>
                            </View>
                        </View>
                        <View style={styles.column}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Comuna:</Text>
                                <Text style={styles.value}>{dadosProdutor.comuna || 'Não informado'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Aldeia:</Text>
                                <Text style={styles.value}>{dadosProdutor.aldeia || 'Não informado'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>

            {/* Segunda página - Históricos */}
            <Page size="A4" style={styles.page}>
                {/* Histórico de Produção */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Histórico de Produção</Text>
                    {dadosProdutor.historicoProducao && dadosProdutor.historicoProducao.length > 0 ? (
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.col1}>Ano</Text>
                                <Text style={styles.col2}>Cultura</Text>
                                <Text style={styles.col1}>Área (ha)</Text>
                                <Text style={styles.col2}>Produção</Text>
                                <Text style={styles.col1}>Vendido</Text>
                                <Text style={styles.col3}>Status</Text>
                            </View>
                            {dadosProdutor.historicoProducao.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.col1}>{item.ano}</Text>
                                    <Text style={styles.col2}>{item.cultura}</Text>
                                    <Text style={styles.col1}>{item.area}</Text>
                                    <Text style={styles.col2}>{item.producao} {item.unidade}</Text>
                                    <Text style={styles.col1}>{item.vendido}</Text>
                                    <Text style={styles.col3}>{item.status}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text>Nenhum histórico de produção encontrado.</Text>
                    )}
                </View>

                {/* Histórico de Benefícios */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Histórico de Benefícios</Text>
                    {dadosProdutor.historicoBeneficios && dadosProdutor.historicoBeneficios.length > 0 ? (
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.col1}>Data</Text>
                                <Text style={styles.col3}>Tipo de Benefício</Text>
                                <Text style={styles.col2}>Valor</Text>
                                <Text style={styles.col2}>Fonte</Text>
                                <Text style={styles.col2}>Status</Text>
                            </View>
                            {dadosProdutor.historicoBeneficios.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.col1}>{formatDate(item.data)}</Text>
                                    <Text style={styles.col3}>{item.descricao || item.categoria}</Text>
                                    <Text style={styles.col2}>{item.valor} {item.unidade}</Text>
                                    <Text style={styles.col2}>{item.fonte}</Text>
                                    <Text style={styles.col2}>{item.status}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text>Nenhum histórico de benefícios encontrado.</Text>
                    )}
                </View>

                {/* Histórico de Transações */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Histórico de Transações</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Saldo Inicial: {formatCurrency(dadosProdutor.saldoInicial)}</Text>
                    </View>
                    {dadosProdutor.historicoTransacoes && dadosProdutor.historicoTransacoes.length > 0 ? (
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.col1}>Data</Text>
                                <Text style={styles.col2}>Produto</Text>
                                <Text style={styles.col3}>Empresa</Text>
                                <Text style={styles.col2}>Valor</Text>
                                <Text style={styles.col2}>Status</Text>
                            </View>
                            {dadosProdutor.historicoTransacoes.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.col1}>{formatDate(item.data)}</Text>
                                    <Text style={styles.col2}>{item.produto}</Text>
                                    <Text style={styles.col3}>{item.empresa}</Text>
                                    <Text style={styles.col2}>{formatCurrency(item.valor)}</Text>
                                    <Text style={styles.col2}>{item.status}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text>Nenhuma transação encontrada.</Text>
                    )}
                    <View style={styles.row}>
                        <Text style={styles.label}>Saldo Final: {formatCurrency(dadosProdutor.saldoFinal)}</Text>
                    </View>
                </View>

                {/* Resumo Financeiro */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
                    <View style={styles.twoColumn}>
                        <View style={styles.column}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Total de Vendas:</Text>
                                <Text style={styles.value}>{formatCurrency(dadosProdutor.totalVendas)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Total de Compras:</Text>
                                <Text style={styles.value}>{formatCurrency(dadosProdutor.totalCompras)}</Text>
                            </View>
                        </View>
                        <View style={styles.column}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Saldo Líquido:</Text>
                                <Text style={styles.value}>{formatCurrency(dadosProdutor.saldoLiquido)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>SIGAF - Registo Nacional de Produtores Agrícolas | Ministério da Agricultura e Florestas</Text>
                    <Text>Data de geração: {new Date().toLocaleDateString('pt-BR')}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ProdutorSIGAFPDF;


export const gerarFichaProdutorPDF = async (dadosProdutor) => {
    try {
        // Gerar o PDF
        const pdfBlob = await pdf(<ProdutorSIGAFPDF dadosProdutor={dadosProdutor} />).toBlob();

        // Criar URL do blob
        const url = URL.createObjectURL(pdfBlob);

        // Criar elemento de download
        const link = document.createElement('a');
        link.href = url;
        link.download = `ficha_produtor_${dadosProdutor.numeroRegistro || dadosProdutor.id}_${new Date().toISOString().split('T')[0]}.pdf`;

        // Executar download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpar URL do blob
        URL.revokeObjectURL(url);

        return Promise.resolve();
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        throw new Error('Erro ao gerar o relatório PDF');
    }
};

// Função alternativa que pode ser usada no seu handleDownloadReport
;