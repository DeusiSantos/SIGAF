import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScout } from '../../hooks/useScoutData';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Download, ChevronLeft, MapPin, Calendar, AlertCircle } from 'lucide-react';
// Importar a imagem de cabeçalho
import headerImg from '../../assets/logoCertificate.png';
import CustomInput from '../../components/CustomInput';

const CertificadoEscuteiro = () => {
    const { id } = useParams();
    const { scout = [], loading = false } = useScout() || {};
    const [gerando, setGerando] = useState(false);
    const [certificadoTipo, setCertificadoTipo] = useState('');
    const [cursoSelecionado, setCursoSelecionado] = useState('');
    const [localCurso, setLocalCurso] = useState('Luanda');
    const [dataCurso, setDataCurso] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    // Definição de variáveis globais para estilo do texto
    const DEFAULT_FONT_SIZE = 12; // Tamanho da fonte padrão
    const DEFAULT_TEXT_COLOR = "#000000"; // Cor de texto padrão

    // Buscar dados do escuteiro de forma segura
    const scoutData = scout?.find(s => s?.id?.toString() === id);

    useEffect(() => {
        // Inicializar a data do curso com a data atual no formato correto
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');
        const diaAtual = String(hoje.getDate()).padStart(2, '0');
        setDataCurso(`${anoAtual}-${mesAtual}-${diaAtual}`);
    }, []);

    // Lista de cursos com mapeamento para tipos de certificados
    const cursosTipos = [
        { curso: 'CI', nome: 'Curso de Iniciação', tipo: 'basico' },
        { curso: 'CIP', nome: 'Curso de Iniciação Pedagógica', tipo: 'basico' },
        { curso: 'CAL', nome: 'Curso Avançado de Liderança', tipo: 'woodbadge' },
        { curso: 'CAR', nome: 'Curso Avançado Regional', tipo: 'woodbadge' },
        { curso: 'CAP I', nome: 'Curso Avançado Pedagógico - Nível I', tipo: 'assistanttrainer' },
        { curso: 'CAP II', nome: 'Curso Avançado Pedagógico - Nível II', tipo: 'assistanttrainer' },
        { curso: 'CAP III', nome: 'Curso Avançado Pedagógico - Nível III', tipo: 'leadertrainer' },
        { curso: 'CAP IV', nome: 'Curso Avançado Pedagógico - Nível IV', tipo: 'leadertrainer' },
        { curso: 'CAF', nome: 'Curso Avançado de Formadores', tipo: 'assistantleader' },
        { curso: 'CDF', nome: 'Curso de Dirigentes e Formadores', tipo: 'leader' }
    ];

    // Opções para o dropdown de cursos
    const cursosOptions = cursosTipos.map(c => ({
        label: `${c.nome} (${c.curso})`,
        value: c.curso
    }));

    const formatarData = (dataStr) => {
        try {
            const data = new Date(dataStr);
            if (isNaN(data.getTime())) {
                console.error('Data inválida:', dataStr);
                return dataStr;
            }
            return `${String(data.getDate()).padStart(2, '0')} de ${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data)} de ${data.getFullYear()}`;
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return dataStr;
        }
    };

    const handleChangeCurso = (value) => {
        // Extrair apenas o value se receber um objeto {value, label}
        const cursoValue = typeof value === 'object' ? value.value : value;
        setCursoSelecionado(cursoValue);

        // Encontrar o tipo de certificado correspondente ao curso
        const curso = cursosTipos.find(c => c.curso === cursoValue);
        if (curso) {
            setCertificadoTipo(curso.tipo);
        }
    };

    // Função para converter a cor hexadecimal para valores RGB normalizados
    const hexToRgb = (hex) => {
        try {
            // Remover o '#' se estiver presente
            hex = hex.replace('#', '');

            // Converter para valores RGB
            const r = parseInt(hex.substring(0, 2), 16) / 255;
            const g = parseInt(hex.substring(2, 4), 16) / 255;
            const b = parseInt(hex.substring(4, 6), 16) / 255;

            return { r, g, b };
        } catch (error) {
            console.error('Erro ao converter cor hex para RGB:', error);
            return { r: 0, g: 0, b: 0 }; // Retornar preto em caso de erro
        }
    };

    const gerarCertificado = async () => {
        setSubmitted(true);

        if (!cursoSelecionado) {
            setError('Por favor, selecione um curso para gerar o certificado.');
            return;
        }

        if (!dataCurso) {
            setError('Por favor, informe a data do curso.');
            return;
        }

        if (!localCurso) {
            setError('Por favor, informe o local do curso.');
            return;
        }

        // Verificar se os dados do escuteiro estão disponíveis
        if (!scoutData?.nome) {
            setError('Dados do escuteiro não disponíveis.');
            return;
        }

        setError('');
        setGerando(true);

        try {
            const cursoDados = cursosTipos.find(c => c.curso === cursoSelecionado);
            if (!cursoDados) {
                throw new Error('Curso não encontrado');
            }

            // Criar um novo documento PDF
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([595.28, 841.89]); // A4
            const { width, height } = page.getSize();

            // Carregar fontes
            const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
            const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

            // Carregar imagem de cabeçalho
            const headerImageBytes = await fetch(headerImg).then(res => res.arrayBuffer());
            const headerImage = await pdfDoc.embedPng(headerImageBytes);

            // Converter cor de texto padrão para valores RGB
            const textColor = hexToRgb(DEFAULT_TEXT_COLOR);

            // Função auxiliar para desenhar texto centralizado
            const drawCenteredText = (text, y, fontSize = DEFAULT_FONT_SIZE, font = timesRoman) => {
                const textWidth = font.widthOfTextAtSize(text, fontSize);
                const x = (width - textWidth) / 2;
                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(textColor.r, textColor.g, textColor.b)
                });
                return fontSize + 2; // Retorna o espaço usado pela linha (altura da fonte + espaço)
            };

            // Função auxiliar para criar espaçamento vertical adequado
            const drawWithSpacing = (textArray, startY, spacingMultiplier = 1.5) => {
                let currentY = startY;
                textArray.forEach(item => {
                    const { text, fontSize = DEFAULT_FONT_SIZE, font = timesRoman } = item;
                    drawCenteredText(text, currentY, fontSize, font);
                    currentY -= fontSize * spacingMultiplier; // Ajuste dinâmico do espaçamento
                });
                return currentY; // Retorna a nova posição Y
            };

            // Função para desenhar texto à esquerda com X e Y específicos
            const drawText = (text, x, y, fontSize = DEFAULT_FONT_SIZE, font = timesRoman) => {
                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(textColor.r, textColor.g, textColor.b)
                });
            };

            // Cabeçalho do certificado - ocupando toda a largura no topo
            page.drawImage(headerImage, {
                x: 0,
                y: height - 150, // Reduzir um pouco a altura do cabeçalho
                width: width,
                height: 150,
            });

            // Iniciar o conteúdo abaixo do cabeçalho com um espaço adequado
            let currentY = height - 180;

            // Gerar o certificado baseado no tipo selecionado
            switch (certificadoTipo) {
                case 'basico':
                    // Certificado Básico (CI, CIP)
                    currentY = drawWithSpacing([
                        { text: 'CERTIFICADO', fontSize: 36, font: timesBold },
                        { text: 'CERTIFICATE', fontSize: 36, font: timesBold },
                    ], currentY);

                    currentY -= 20; // Espaço adicional após os títulos

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'This is to certify that' },
                        { text: 'Nous certifions que' },
                    ], currentY);

                    currentY -= 20; // Espaço adicional

                    drawCenteredText(scoutData.nome.toUpperCase(), currentY, 16, timesBold);
                    currentY -= 30;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'Completed' },
                        { text: 'A suivi' },
                    ], currentY);

                    currentY -= 20;

                    drawCenteredText(`${cursoDados.nome} (${cursoDados.curso})`, currentY, 14, timesBold);
                    currentY -= 30;

                    currentY = drawWithSpacing([
                        { text: 'Held' },
                        { text: 'Qui a eu lieu' },
                    ], currentY);

                    currentY -= 20;

                    drawCenteredText(`at / à ${localCurso}`, currentY);
                    currentY -= 30;

                    drawCenteredText(`Date ${formatarData(dataCurso)}`, currentY);
                    currentY -= 30;

                    currentY -= 20; // Espaço extra antes das assinaturas

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'Course Leader' },
                        { text: 'Le Responsable du Cours' },
                    ], currentY);
                    break;

                case 'woodbadge':
                    // Certificado Wood Badge (CAL, CAR)
                    currentY = drawWithSpacing([
                        { text: 'UNIT LEADER TRAINING', fontSize: 28, font: timesBold },
                        { text: 'FORMATION DE RESPONSABLE D\'UNITÉ', fontSize: 24, font: timesBold },
                    ], currentY);

                    currentY -= 20; // Espaço adicional

                    currentY = drawWithSpacing([
                        { text: 'The Scout Association of' },
                        { text: 'L\'Association Scoute de' },
                    ], currentY);

                    currentY -= 10;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 15;

                    drawCenteredText('Associação dos Escuteiros de Angola', currentY, 14, timesBold);
                    currentY -= 30;

                    currentY = drawWithSpacing([
                        { text: 'THE WOOD BADGE', fontSize: 24, font: timesBold },
                        { text: 'LE BADGE DE BOIS', fontSize: 24, font: timesBold },
                    ], currentY);

                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'has been granted to' },
                        { text: 'a été attribué à' },
                    ], currentY);

                    currentY -= 20;

                    drawCenteredText(scoutData.nome.toUpperCase(), currentY, 16, timesBold);
                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'thereby certifying that the Unit Leader Training requirements' },
                        { text: 'of the Association have been completed' },
                        { text: '' }, // Espaço
                        { text: 'qui a rempli les exigences de l\'Association en matière de formation' },
                        { text: 'de responsable d\'unité' },
                    ], currentY);

                    // Assinaturas
                    // Lado esquerdo
                    drawText('Signed by or on behalf of', 120, 200, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('the Chief Scout', 140, 180, DEFAULT_FONT_SIZE, timesRoman);

                    // Lado direito
                    drawText('National Training Commissioner', 350, 200, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('Le Commissaire National', 350, 180, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('à la Formation', 390, 160, DEFAULT_FONT_SIZE, timesRoman);

                    // Curso info no rodapé
                    drawCenteredText(`${cursoDados.nome} (${cursoDados.curso})`, 120, 14, timesBold);
                    drawCenteredText(`${localCurso}, ${formatarData(dataCurso)}`, 100, DEFAULT_FONT_SIZE);
                    break;

                case 'assistanttrainer':
                    // Certificado para Assistant Leader Trainers (CAP I, CAP II)
                    currentY = drawWithSpacing([
                        { text: 'COURSE FOR ASSISTANT LEADER TRAINERS', fontSize: 24, font: timesBold },
                        { text: 'STAGE POUR FORMATEURS ADJOINTS / FORMATRICES ADJOINTES', fontSize: 18, font: timesBold },
                    ], currentY);

                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'The Scout Association of' },
                        { text: 'L\'Association Scoute de' },
                    ], currentY);

                    currentY -= 10;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 15;

                    drawCenteredText('Associação dos Escuteiros de Angola', currentY, 14, timesBold);
                    currentY -= 25;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'This is to certify that' },
                        { text: 'Nous certifions que' },
                    ], currentY);

                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    drawCenteredText(scoutData.nome.toUpperCase(), currentY, 16, timesBold);
                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'Completed the Course for Assistant Leader Trainers' },
                        { text: 'A suivi le Stage pour Formateurs Adjoints / Formatrices Adjointes' },
                        { text: '' }, // Espaço
                        { text: 'Held' },
                        { text: 'Qui a eu lieu' },
                    ], currentY);

                    currentY -= 20;

                    // Informações do curso
                    drawCenteredText(`${cursoDados.nome} (${cursoDados.curso})`, currentY, 14, timesBold);
                    currentY -= 25;

                    drawCenteredText(`at / à ${localCurso}`, currentY);
                    currentY -= 25;

                    drawCenteredText(`Date ${formatarData(dataCurso)}`, currentY);

                    // Assinaturas
                    const signatureY = 130; // Posição Y base para assinaturas

                    drawText('Course Leader', 140, signatureY, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('Responsable du Stage', 130, signatureY - 20, DEFAULT_FONT_SIZE, timesRoman);

                    drawText('National Training Commissioner', 350, signatureY, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('Le Commissaire National à la Formation', 320, signatureY - 20, DEFAULT_FONT_SIZE, timesRoman);
                    break;

                case 'leadertrainer':
                    // Certificado para Leader Trainers (CAP III, CAP IV)
                    currentY = drawWithSpacing([
                        { text: 'COURSE FOR LEADER TRAINERS', fontSize: 28, font: timesBold },
                        { text: 'STAGE POUR FORMATEURS / FORMATRICES', fontSize: 22, font: timesBold },
                    ], currentY);

                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'The Scout Association of' },
                        { text: 'L\'Association Scoute de' },
                    ], currentY);

                    currentY -= 10;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 15;

                    drawCenteredText('Associação dos Escuteiros de Angola', currentY, 14, timesBold);
                    currentY -= 25;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'This is to certify that' },
                        { text: 'Nous certifions que' },
                    ], currentY);

                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    drawCenteredText(scoutData.nome.toUpperCase(), currentY, 16, timesBold);
                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'Completed the Course for Leader Trainers' },
                        { text: 'A suivi le Stage pour Formateurs / Formatrices' },
                        { text: '' }, // Espaço
                        { text: 'Held' },
                        { text: 'Qui a eu lieu' },
                    ], currentY);

                    currentY -= 20;

                    // Informações do curso
                    drawCenteredText(`${cursoDados.nome} (${cursoDados.curso})`, currentY, 14, timesBold);
                    currentY -= 25;

                    drawCenteredText(`at / à ${localCurso}`, currentY);
                    currentY -= 25;

                    drawCenteredText(`Date ${formatarData(dataCurso)}`, currentY);

                    // Assinaturas
                    const leaderSignatureY = 130; // Posição Y base para assinaturas

                    drawText('Course Leader', 140, leaderSignatureY, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('Responsable du Stage', 130, leaderSignatureY - 20, DEFAULT_FONT_SIZE, timesRoman);

                    drawText('National Training Commissioner', 350, leaderSignatureY, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('Le Commissaire National à la Formation', 320, leaderSignatureY - 20, DEFAULT_FONT_SIZE, timesRoman);
                    break;

                case 'assistantleader':
                    // Certificado para Assistant Leader Trainers (CAF)
                    currentY = drawWithSpacing([
                        { text: 'ASSISTANT LEADER TRAINERS', fontSize: 28, font: timesBold },
                        { text: 'FORMATEURS ADJOINTS / FORMATRICE ADJOINTES', fontSize: 22, font: timesBold },
                    ], currentY);

                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'The Scout Association of' },
                        { text: 'L\'Association Scoute de' },
                    ], currentY);

                    currentY -= 10;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 15;

                    drawCenteredText('Associação dos Escuteiros de Angola', currentY, 14, timesBold);
                    currentY -= 25;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'This is to certify that' },
                        { text: 'Nous certifions que' },
                    ], currentY);

                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    drawCenteredText(scoutData.nome.toUpperCase(), currentY, 16, timesBold);
                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'Is appointed as Assistant Leader Trainer in the expectation that he/she will' },
                        { text: 'contribute to Adult Leader Training.' },
                        { text: 'This appointment remains effective at the discretion of the Association.' },
                        { text: '' }, // Espaço
                        { text: 'Est nommé(e) Formateur Adjoint / Formatrice Adjointe pour contribuer à la' },
                        { text: 'formation des responsables adultes. Cette nomination demeurera en vigueur aussi' },
                        { text: 'longtemps que l\'Association le désire.' },
                    ], currentY, 1.3); // Espaçamento menor para este bloco

                    currentY -= 20;

                    // Informações específicas do curso
                    drawCenteredText(`${cursoDados.nome} (${cursoDados.curso})`, currentY, 14, timesBold);
                    currentY -= 20;
                    drawCenteredText(`${localCurso}, ${formatarData(dataCurso)}`, currentY, DEFAULT_FONT_SIZE);

                    // Assinaturas
                    const assistantSignatureY = 160; // Posição Y base para assinaturas

                    drawText('Signed by or on behalf of', 120, assistantSignatureY, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('the Chief Scout', 140, assistantSignatureY - 20, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('Signé par le Chef scout ou', 115, assistantSignatureY - 40, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('par son mandataire', 135, assistantSignatureY - 60, DEFAULT_FONT_SIZE, timesRoman);

                    drawText('National Training Commissioner', 330, assistantSignatureY, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('Le Commissaire National', 345, assistantSignatureY - 20, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('à la Formation', 360, assistantSignatureY - 40, DEFAULT_FONT_SIZE, timesRoman);
                    break;

                case 'leader':
                    // Certificado para Leader Trainers (CDF)
                    currentY = drawWithSpacing([
                        { text: 'LEADER TRAINERS', fontSize: 32, font: timesBold },
                        { text: 'FORMATEURS / FORMATRICES', fontSize: 26, font: timesBold },
                    ], currentY);

                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'The Scout Association of' },
                        { text: 'L\'Association Scoute de' },
                    ], currentY);

                    currentY -= 10;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 15;

                    drawCenteredText('Associação dos Escuteiros de Angola', currentY, 14, timesBold);
                    currentY -= 25;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'This is to certify that' },
                        { text: 'Nous certifions que' },
                    ], currentY);

                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    drawCenteredText(scoutData.nome.toUpperCase(), currentY, 16, timesBold);
                    currentY -= 20;

                    drawCenteredText('...................................................................', currentY, DEFAULT_FONT_SIZE);
                    currentY -= 20;

                    currentY = drawWithSpacing([
                        { text: 'Is appointed Leader Trainer in the expectation that he/she will' },
                        { text: 'contribute to Adult Leader Training.' },
                        { text: 'This appointment remains effective at the discretion of the Association' },
                        { text: '' }, // Espaço
                        { text: 'Est nommé(e) Formateur / Formatrice pour contribuer à la formation des' },
                        { text: 'responsables adultes. Cette nomination demeurera en vigueur aussi longtemps' },
                        { text: 'que l\'Association le désire.' },
                    ], currentY, 1.3); // Espaçamento menor para este bloco

                    currentY -= 20;

                    // Informações específicas do curso
                    drawCenteredText(`${cursoDados.nome} (${cursoDados.curso})`, currentY, 14, timesBold);
                    currentY -= 20;
                    drawCenteredText(`${localCurso}, ${formatarData(dataCurso)}`, currentY, DEFAULT_FONT_SIZE);

                    // Assinaturas
                    const leaderTrainerSignatureY = 160; // Posição Y base para assinaturas

                    drawText('Signed by or on behalf of', 120, leaderTrainerSignatureY, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('the Chief Scout', 140, leaderTrainerSignatureY - 20, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('Signé par le Chef scout ou', 115, leaderTrainerSignatureY - 40, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('par son mandataire', 135, leaderTrainerSignatureY - 60, DEFAULT_FONT_SIZE, timesRoman);

                    drawText('National Training Commissioner', 330, leaderTrainerSignatureY, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('Le Commissaire National', 345, leaderTrainerSignatureY - 20, DEFAULT_FONT_SIZE, timesRoman);
                    drawText('à la Formation', 360, leaderTrainerSignatureY - 40, DEFAULT_FONT_SIZE, timesRoman);
                    break;

                default:
                    // Certificado padrão caso não encontre um tipo específico
                    currentY = drawWithSpacing([
                        { text: 'CERTIFICADO', fontSize: 32, font: timesBold },
                        { text: '' }, // Espaço
                        { text: 'Associação dos Escuteiros de Angola', fontSize: 16 },
                        { text: 'certifica que' },
                        { text: '' }, // Espaço
                        { text: scoutData.nome.toUpperCase(), fontSize: 20, font: timesBold },
                        { text: '' }, // Espaço
                        { text: `completou o curso ${cursoDados.nome} (${cursoDados.curso})` },
                        { text: `em ${localCurso}, ${formatarData(dataCurso)}` },
                    ], currentY);
                    break;
            }

            // Número do certificado
            const certificadoNum = `N° Cert-${Math.floor(Math.random() * 9000) + 1000}`;
            page.drawText(certificadoNum, {
                x: 50,
                y: 40,
                size: DEFAULT_FONT_SIZE,
                font: timesRoman,
                color: rgb(textColor.r, textColor.g, textColor.b)
            });

            // Salvar e fazer download do PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificado_${scoutData.nome.toLowerCase().replace(/ /g, '_')}_${cursoSelecionado}.pdf`;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            setError(`Erro ao gerar o PDF: ${error.message || 'Tente novamente.'}`);
        } finally {
            setGerando(false);
        }
    };

    const handleVoltar = () => {
        navigate(-1);
    };

    const AcessoRestrito = () => {
        return (
            <div className="min-h-full bg-gray-50 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-blue-600 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
                                <button
                                    onClick={handleVoltar}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg shadow hover:bg-gray-100 transition-all"
                                >
                                    <ChevronLeft size={18} />
                                    Voltar
                                </button>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0 bg-red-100 p-5 rounded-full">
                                    <AlertCircle className="h-20 w-20 text-blue-500" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        Certificados disponíveis apenas para Dirigentes
                                    </h3>

                                    <p className="text-gray-600 mb-4">
                                        A geração de certificados está disponível exclusivamente para escuteiros da categoria <span className="font-semibold text-blue-600">DIRIGENTES</span> que completaram os cursos específicos da Associação dos Escuteiros de Angola.
                                    </p>

                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                        <div className="flex items-center">
                                            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                                            <p className="text-yellow-700">
                                                Sua categoria atual não permite a geração de certificados.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="font-medium text-gray-700 mb-2">Categoria atual:</h4>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                            {scoutData?.categoria || "Não definida"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h4 className="font-semibold text-gray-700 mb-3">Outras opções disponíveis:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={handleVoltar}
                                        className="flex items-center justify-center gap-2 p-3 rounded-lg border border-purple-200 hover:bg-purple-50 text-purple-600 transition-colors"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                        Voltar ao perfil
                                    </button>

                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex items-center justify-center gap-2 p-3 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Voltar à página inicial
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Exibe spinner de carregamento quando estiver buscando os dados
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                <span className="ml-3 text-purple-600 font-medium">Carregando...</span>
            </div>
        );
    }

    // Verifica se os dados do escuteiro foram encontrados
    if (!scoutData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                    <div className="flex flex-col items-center text-center">
                        <AlertCircle className="h-16 w-16 text-blue-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Escuteiro não encontrado</h2>
                        <p className="text-gray-600 mb-6">Não foi possível encontrar os dados do escuteiro solicitado.</p>
                        <button
                            onClick={handleVoltar}
                            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-all"
                        >
                            <ChevronLeft size={18} />
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Verificar se o escuteiro é dirigente
    if (scoutData.categoria !== 'DIRIGENTES') {
        return <AcessoRestrito />;
    }

    return (
        <div className="min-h-full">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Certificado de Curso</h1>
                        <p className="text-gray-600 mt-2">Escuteiro: {scoutData?.nome}</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleVoltar}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-300 transition-all"
                        >
                            <ChevronLeft size={18} />
                            Voltar
                        </button>
                    </div>
                </div>

                {/* Formulário para geração do certificado */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Dados do Certificado</h2>

                    {error && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Curso */}
                        <CustomInput
                            type="select"
                            label="Curso"
                            value={
                                // Se cursoSelecionado for uma string simples, convertê-lo para o formato de objeto que o select espera
                                typeof cursoSelecionado === 'string' && cursoSelecionado !== ''
                                    ? {
                                        value: cursoSelecionado,
                                        label: cursosOptions.find(op => op.value === cursoSelecionado)?.label || cursoSelecionado
                                    }
                                    : cursoSelecionado
                            }
                            onChange={handleChangeCurso}
                            options={cursosOptions}
                            required
                            placeholder="Selecione um curso"
                            errorMessage={!cursoSelecionado && submitted ? "Selecione um curso" : null}
                        />

                        {/* Local do Curso */}
                        <CustomInput
                            type="text"
                            label="Local do Curso"
                            value={localCurso}
                            onChange={(value) => setLocalCurso(value)}
                            required
                            placeholder="Ex: Luanda"
                            errorMessage={!localCurso && submitted ? "Informe o local do curso" : null}
                            iconStart={<MapPin size={18} className="text-gray-500" />}
                        />

                        {/* Data do Curso */}
                        {/* <CustomInput
                            type="date"
                            label="Data do Curso"
                            value={dataCurso}
                            onChange={(value) => setDataCurso(value)}
                            required
                            errorMessage={!dataCurso && submitted ? "Informe a data do curso" : null}
                            placeholder="Selecione a data"
                            iconStart={<Calendar size={18} />}
                            helperText="Data de realização do curso"
                        /> */}

                        {/* Botão de gerar */}
                        <div className="flex items-end">
                            <button
                                onClick={gerarCertificado}
                                disabled={gerando}
                                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:bg-purple-300 shadow-md"
                            >
                                {gerando ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span>Gerando certificado...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        <span>Gerar Certificado</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Informações sobre os tipos de certificados */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Sobre os Certificados</h2>

                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Os certificados são emitidos exclusivamente para escuteiros da categoria DIRIGENTES que concluíram os cursos da Associação dos Escuteiros de Angola.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h3 className="font-semibold text-gray-800 mb-2">Cursos Básicos</h3>
                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                    <li>Curso de Iniciação (CI)</li>
                                    <li>Curso de Iniciação Pedagógica (CIP)</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h3 className="font-semibold text-gray-800 mb-2">Cursos Avançados</h3>
                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                    <li>Curso Avançado de Liderança (CAL)</li>
                                    <li>Curso Avançado Regional (CAR)</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h3 className="font-semibold text-gray-800 mb-2">Cursos Pedagógicos</h3>
                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                    <li>Curso Avançado Pedagógico - Nível I (CAP I)</li>
                                    <li>Curso Avançado Pedagógico - Nível II (CAP II)</li>
                                    <li>Curso Avançado Pedagógico - Nível III (CAP III)</li>
                                    <li>Curso Avançado Pedagógico - Nível IV (CAP IV)</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h3 className="font-semibold text-gray-800 mb-2">Cursos Especializados</h3>
                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                    <li>Curso Avançado de Formadores (CAF)</li>
                                    <li>Curso de Dirigentes e Formadores (CDF)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-blue-700 text-sm">
                                    <strong>Nota:</strong> Cada curso possui um modelo de certificado específico, seguindo os padrões internacionais do Movimento Escoteiro.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificadoEscuteiro;