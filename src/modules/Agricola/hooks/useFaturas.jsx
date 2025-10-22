import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

export const useFaturas = () => {
    const [faturas, setFaturas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Dados institucionais fixos
    const dadosInstitucionais = {
        nome: 'ECOSAPIEN',
        endereco: 'Rua 2, nº 34, Benfica, Luanda',
        telefone: '+244 926 224 354',
        email: 'ecb@ecosapien.co.ao',
        banco: 'BFA',
        agencia: 'Universidade Independente',
        conta: '11444744830',
        iban: 'AO06.0006.0000.1444.7448.3016.7',
        nif: '5417181900'
    };

    // Preços dos ensaios (baseado nos dados de MetodosEnsaios)
    const precosPorEnsaio = {
        'ph-agua': { metodo: 'Potenciométrico', preco: 1500 },
        'ph-cacl2': { metodo: 'Potenciométrico', preco: 1500 },
        'fosforo': { metodo: 'Fotocolorimetria', preco: 2000 },
        'potassio': { metodo: 'Fotometria de Chama', preco: 2500 },
        'calcio': { metodo: 'Espectrofotometria', preco: 1700 },
        'magnesio': { metodo: 'Espectrofotometria', preco: 1700 },
        'materia-organica': { metodo: 'Walkley-Black', preco: 2500 },
        'aluminio': { metodo: 'Espectrofotometria', preco: 1800 },
        'acidez-potencial': { metodo: 'Titulação', preco: 1600 },
        'enxofre': { metodo: 'Turbidimetria', preco: 1900 },
        'ctc': { metodo: 'Cálculo', preco: 1000 },
        'saturacao-bases': { metodo: 'Cálculo', preco: 1000 },
        'micronutrientes': { metodo: 'Espectrofotometria', preco: 3000 }
    };

    // Função para gerar número da fatura
    const gerarNumeroFatura = () => {
        const now = new Date();
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
        const sequencia = String(faturas.length + 1).padStart(3, '0');
        return `FPN.${sequencia}.${mes}.${ano}`;
    };

    // Função para converter número para extenso (simplificada)
    const numeroParaExtenso = (valor) => {
        if (valor < 1000) return `${valor} kwanzas`;
        if (valor < 10000) {
            const milhares = Math.floor(valor / 1000);
            const resto = valor % 1000;
            return `${milhares} mil${resto > 0 ? ` e ${resto}` : ''} kwanzas`;
        }
        return `${Math.floor(valor / 1000)} mil e ${valor % 1000} kwanzas`;
    };

    // Função para gerar fatura automática
    const gerarFaturaAutomatica = async (dadosAmostra) => {
        setLoading(true);
        try {
            // Processar ensaios selecionados
            const ensaiosCalculados = dadosAmostra.ensaiosSelecionados.map(ensaio => {
                const ensaioKey = typeof ensaio === 'string' ? ensaio : ensaio.value || ensaio;
                const precoInfo = precosPorEnsaio[ensaioKey] || { metodo: 'Método Padrão', preco: 1500 };
                
                return {
                    parametro: ensaioKey.replace(/-/g, ' ').toUpperCase(),
                    metodo: precoInfo.metodo,
                    numeroAmostra: dadosAmostra.codigoAmostra,
                    precoUnitario: precoInfo.preco,
                    total: precoInfo.preco
                };
            });

            // Serviços adicionais
            const servicosAdicionais = [
                { servico: 'Coleta de amostras', qtde: 1, preco: 2500, total: 2500 }
            ];

            // Cálculos
            const subtotalEnsaios = ensaiosCalculados.reduce((sum, item) => sum + item.total, 0);
            const subtotalServicos = servicosAdicionais.reduce((sum, item) => sum + item.total, 0);
            const subtotal = subtotalEnsaios + subtotalServicos;
            const iva = Math.round(subtotal * 0.07);
            const total = subtotal + iva;

            // Criar objeto da fatura
            const novaFatura = {
                id: Date.now(),
                numeroFatura: gerarNumeroFatura(),
                data: new Date().toLocaleDateString('pt-BR'),
                prazoValidade: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
                cliente: {
                    nome: dadosAmostra.nomeProdutor,
                    endereco: `${dadosAmostra.aldeia || ''}, ${dadosAmostra.municipio}, ${dadosAmostra.provincia}`.replace(/^, /, ''),
                    telefone: dadosAmostra.telefone || 'Não informado',
                    nif: dadosAmostra.nif || 'Não informado'
                },
                ensaios: ensaiosCalculados,
                servicos: servicosAdicionais,
                subtotal,
                iva,
                total,
                valorExtenso: numeroParaExtenso(total),
                preparadoPor: 'Sistema ECOSAPIEN',
                amostra: dadosAmostra
            };

            // Adicionar à lista de faturas
            setFaturas(prev => [...prev, novaFatura]);

            // Gerar PDF automaticamente
            await gerarPDF(novaFatura);

            return novaFatura;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Função para gerar PDF
    const gerarPDF = async (fatura) => {
        const doc = new jsPDF();
        
        // Configurações de fonte
        doc.setFont('helvetica');
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('ECOSAPIEN', 20, 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(dadosInstitucionais.endereco, 20, 30);
        doc.text(`Tel: ${dadosInstitucionais.telefone}`, 20, 35);
        doc.text(`Email: ${dadosInstitucionais.email}`, 20, 40);
        
        // Informações da fatura
        doc.text(`Data: ${fatura.data}`, 150, 30);
        doc.text(`Nº da Fatura: ${fatura.numeroFatura}`, 150, 35);
        doc.text(`Preparado por: ${fatura.preparadoPor}`, 150, 40);
        doc.text(`Prazo de Validade: ${fatura.prazoValidade}`, 150, 45);
        
        // Linha separadora
        doc.line(20, 50, 190, 50);
        
        // Cliente
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CLIENTE:', 20, 60);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nome: ${fatura.cliente.nome}`, 20, 70);
        doc.text(`Endereço: ${fatura.cliente.endereco}`, 20, 75);
        doc.text(`Contactos: ${fatura.cliente.telefone}`, 20, 80);
        doc.text(`NIF: ${fatura.cliente.nif}`, 20, 85);
        
        // Tabela de ensaios
        let yPos = 100;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('ENSAIOS SOLICITADOS:', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(9);
        doc.text('Parâmetro', 20, yPos);
        doc.text('Método de Análise', 60, yPos);
        doc.text('Nº da Amostra', 110, yPos);
        doc.text('Preço Unitário', 150, yPos);
        doc.text('Total', 180, yPos);
        
        yPos += 5;
        doc.line(20, yPos, 200, yPos);
        
        fatura.ensaios.forEach(ensaio => {
            yPos += 8;
            doc.text(ensaio.parametro.substring(0, 25), 20, yPos);
            doc.text(ensaio.metodo.substring(0, 20), 60, yPos);
            doc.text(ensaio.numeroAmostra, 110, yPos);
            doc.text(`${ensaio.precoUnitario.toLocaleString()} kz`, 150, yPos);
            doc.text(`${ensaio.total.toLocaleString()} kz`, 180, yPos);
        });
        
        // Serviços adicionais
        yPos += 15;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SERVIÇOS ADICIONAIS:', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(9);
        doc.text('Serviço', 20, yPos);
        doc.text('Qtde', 100, yPos);
        doc.text('Preço', 130, yPos);
        doc.text('Total', 160, yPos);
        
        yPos += 5;
        doc.line(20, yPos, 180, yPos);
        
        fatura.servicos.forEach(servico => {
            yPos += 8;
            doc.text(servico.servico, 20, yPos);
            doc.text(servico.qtde.toString(), 100, yPos);
            doc.text(`${servico.preco.toLocaleString()} kz`, 130, yPos);
            doc.text(`${servico.total.toLocaleString()} kz`, 160, yPos);
        });
        
        // Totais
        yPos += 20;
        doc.line(130, yPos, 200, yPos);
        yPos += 5;
        doc.setFontSize(10);
        doc.text(`Subtotal: ${fatura.subtotal.toLocaleString()} kz`, 130, yPos);
        yPos += 8;
        doc.text(`IVA (7%): ${fatura.iva.toLocaleString()} kz`, 130, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'bold');
        doc.text(`Total a Pagar: ${fatura.total.toLocaleString()} kz`, 130, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.text(`Valor por extenso: ${fatura.valorExtenso}`, 20, yPos);
        
        // Coordenadas bancárias
        yPos += 20;
        doc.setFont('helvetica', 'bold');
        doc.text('COORDENADAS BANCÁRIAS:', 20, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.text(`Banco: ${dadosInstitucionais.banco}`, 20, yPos);
        yPos += 5;
        doc.text(`Agência: ${dadosInstitucionais.agencia}`, 20, yPos);
        yPos += 5;
        doc.text(`Nº Conta AKZ: ${dadosInstitucionais.conta}`, 20, yPos);
        yPos += 5;
        doc.text(`IBAN: ${dadosInstitucionais.iban}`, 20, yPos);
        yPos += 5;
        doc.text(`Beneficiário: ${dadosInstitucionais.nome}`, 20, yPos);
        yPos += 5;
        doc.text(`NIF da Empresa: ${dadosInstitucionais.nif}`, 20, yPos);
        yPos += 5;
        doc.text(`Total a Pagar: ${fatura.total.toLocaleString()} kz`, 20, yPos);
        
        // Rodapé
        yPos += 15;
        doc.line(20, yPos, 190, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Obrigado pela preferência!', 20, yPos);
        yPos += 5;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Fatura gerada automaticamente pelo Sistema de Gestão de Laboratório ECOSAPIEN.', 20, yPos);
        
        // Salvar PDF
        doc.save(`Fatura_${fatura.numeroFatura}.pdf`);
    };

    // Carregar faturas do localStorage na inicialização
    useEffect(() => {
        const faturasSalvas = localStorage.getItem('faturas_ecosapien');
        if (faturasSalvas) {
            setFaturas(JSON.parse(faturasSalvas));
        }
    }, []);

    // Salvar faturas no localStorage sempre que a lista mudar
    useEffect(() => {
        if (faturas.length > 0) {
            localStorage.setItem('faturas_ecosapien', JSON.stringify(faturas));
        }
    }, []);

    return {
        faturas,
        loading,
        error,
        gerarFaturaAutomatica,
        gerarPDF
    };
};