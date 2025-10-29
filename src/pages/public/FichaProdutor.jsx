import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Função utilitária para gerar PDF da ficha do produtor
export const gerarFichaProdutorPDF = async (producerData) => {
  if (!producerData) {
    throw new Error('Dados do produtor não disponíveis.');
  }

  try {
    // Criar um novo documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    // Carregar fontes
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const DEFAULT_FONT_SIZE = 11;
    const TITLE_FONT_SIZE = 14;

    // Cores
    const blackColor = rgb(0, 0, 0);
    const redColor = rgb(0.8, 0, 0);

    // Função para formatar data
    const formatarData = (dataStr) => {
      try {
        const data = new Date(dataStr);
        if (isNaN(data.getTime())) {
          return dataStr;
        }
        return `${String(data.getDate()).padStart(2, '0')}-${String(data.getMonth() + 1).padStart(2, '0')}-${data.getFullYear()}`;
      } catch (error) {
        console.error('Erro ao formatar data:', error);
        return dataStr;
      }
    };

    // Função para desenhar texto
    const drawText = (text, x, y, fontSize = DEFAULT_FONT_SIZE, font = helvetica, color = blackColor) => {
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color
      });
    };

    // Função para desenhar texto centralizado
    const drawCenteredText = (text, y, fontSize = DEFAULT_FONT_SIZE, font = helvetica, color = blackColor) => {
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const x = (width - textWidth) / 2;
      drawText(text, x, y, fontSize, font, color);
    };

    // Função para desenhar linha
    const drawLine = (x1, y1, x2, y2, thickness = 1) => {
      page.drawLine({
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
        thickness,
        color: blackColor
      });
    };

    // Função para desenhar retângulo
    const drawRectangle = (x, y, width, height, borderColor = blackColor) => {
      page.drawRectangle({
        x,
        y,
        width,
        height,
        borderColor,
        borderWidth: 1
      });
    };

    let currentY = height - 50;

    // CABEÇALHO
    // Logo placeholder (retângulo com X)
    drawRectangle(50, currentY - 50, 80, 50);
    drawLine(50, currentY - 50, 130, currentY, 1);
    drawLine(130, currentY - 50, 50, currentY, 1);

    // Texto do governo
    drawText('GOVERNO DE', 140, currentY - 15, 10, helvetica);
    drawText('ANGOLA', 140, currentY - 30, 12, helveticaBold, redColor);
    drawText('minagrif.gov.ao', 140, currentY - 45, 8, helvetica);

    currentY -= 80;

    // TÍTULO PRINCIPAL
    drawCenteredText('FICHA DO PRODUTOR', currentY, 18, timesBold);
    currentY -= 40;

    // Informações do registro
    const infoY = currentY;
    drawText(`Nº de registro:`, 400, infoY, DEFAULT_FONT_SIZE, helvetica);
    drawText(`${producerData.numeroRegistro || producerData.codigoSIGAF || producerData.id}`, 500, infoY, DEFAULT_FONT_SIZE, helveticaBold);
    
    drawText(`Data de registro:`, 400, infoY - 20, DEFAULT_FONT_SIZE, helvetica);
    drawText(`${formatarData(producerData.dataRegistro || new Date().toISOString())}`, 500, infoY - 20, DEFAULT_FONT_SIZE, helveticaBold);

    currentY -= 60;

    // DADOS DA ESCOLA DE CAMPO
    drawLine(50, currentY, width - 50, currentY, 1);
    currentY -= 15;
    drawText('DADOS DA ESCOLA DE CAMPO', 50, currentY, TITLE_FONT_SIZE, helveticaBold);
    currentY -= 25;
    drawLine(50, currentY, width - 50, currentY, 1);
    currentY -= 20;

    drawText('Nome da ECA:', 50, currentY, DEFAULT_FONT_SIZE, helvetica);
    drawText(producerData.nomeECA || producerData.escolaCampo || 'N/A', 150, currentY, DEFAULT_FONT_SIZE, helvetica);
    currentY -= 30;

    // IDENTIFICAÇÃO DO PEQUENO PRODUTOR
    drawText('Identificação do Pequeno Produtor', 50, currentY, TITLE_FONT_SIZE, helveticaBold);
    currentY -= 25;
    drawLine(50, currentY, width - 50, currentY, 1);
    currentY -= 25;

    // Dados do produtor
    drawText('Nome:', 50, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.nome || 'N/A', 150, currentY, DEFAULT_FONT_SIZE, helvetica);
    currentY -= 20;

    drawText('Data de Nascimento:', 50, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(formatarData(producerData.dataNascimento || ''), 180, currentY, DEFAULT_FONT_SIZE, helvetica);
    
    drawText('Telefone:', 350, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.telefone || 'N/A', 420, currentY, DEFAULT_FONT_SIZE, helvetica);
    currentY -= 20;

    drawText('BI:', 50, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.bi || producerData.numeroBI || 'N/A', 150, currentY, DEFAULT_FONT_SIZE, helvetica);
    
    drawText('Gênero:', 350, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.genero || producerData.sexo || 'N/A', 420, currentY, DEFAULT_FONT_SIZE, helvetica);
    currentY -= 20;

    drawText('Nº de Agregados:', 50, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.numeroAgregados?.toString() || producerData.agregadosFamiliares?.toString() || 'N/A', 180, currentY, DEFAULT_FONT_SIZE, helvetica);
    currentY -= 20;

    drawText('Nome do Pai:', 50, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.nomePai || 'N/A', 150, currentY, DEFAULT_FONT_SIZE, helvetica);
    currentY -= 20;

    drawText('Nome da Mãe:', 50, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.nomeMae || 'N/A', 150, currentY, DEFAULT_FONT_SIZE, helvetica);
    currentY -= 30;

    // LOCALIZAÇÃO
    drawText('Localização', 50, currentY, TITLE_FONT_SIZE, helveticaBold);
    currentY -= 25;
    drawLine(50, currentY, width - 50, currentY, 1);
    currentY -= 25;

    drawText('Província:', 50, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.provincia || 'N/A', 150, currentY, DEFAULT_FONT_SIZE, helvetica);
    
    drawText('Município:', 280, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.municipio || 'N/A', 360, currentY, DEFAULT_FONT_SIZE, helvetica);
    
    drawText('Comuna:', 480, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    currentY -= 20;

    drawText('Aldeia:', 50, currentY, DEFAULT_FONT_SIZE, helveticaBold);
    drawText(producerData.aldeia || producerData.bairro || 'N/A', 150, currentY, DEFAULT_FONT_SIZE, helvetica);

    // SEGUNDA PÁGINA - HISTÓRICO DE PRODUÇÃO
    if (producerData.historicoProducao && producerData.historicoProducao.length > 0) {
      const page2 = pdfDoc.addPage([595.28, 841.89]);
      let currentY2 = height - 50;

      const drawText2 = (text, x, y, fontSize = DEFAULT_FONT_SIZE, font = helvetica, color = blackColor) => {
        page2.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color
        });
      };

      const drawCenteredText2 = (text, y, fontSize = DEFAULT_FONT_SIZE, font = helvetica, color = blackColor) => {
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const x = (width - textWidth) / 2;
        drawText2(text, x, y, fontSize, font, color);
      };

      const drawLine2 = (x1, y1, x2, y2, thickness = 1) => {
        page2.drawLine({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          thickness,
          color: blackColor
        });
      };

      // TÍTULO DA SEGUNDA PÁGINA
      drawCenteredText2('HISTÓRICO DE PRODUÇÃO', currentY2, 18, timesBold);
      currentY2 -= 40;

      // Cabeçalho da tabela
      const tableStartY2 = currentY2;
      const colPositions2 = [50, 110, 190, 250, 310, 390, 450];

      drawLine2(50, tableStartY2, width - 50, tableStartY2, 1);
      drawLine2(50, tableStartY2 - 25, width - 50, tableStartY2 - 25, 1);

      colPositions2.forEach(pos => {
        drawLine2(pos, tableStartY2, pos, tableStartY2 - 25, 1);
      });
      drawLine2(width - 50, tableStartY2, width - 50, tableStartY2 - 25, 1);

      drawText2('Ano', colPositions2[0] + 2, tableStartY2 - 18, 9, helveticaBold);
      drawText2('Cultura', colPositions2[1] + 2, tableStartY2 - 18, 9, helveticaBold);
      drawText2('Tipo', colPositions2[2] + 2, tableStartY2 - 18, 9, helveticaBold);
      drawText2('Área(ha)', colPositions2[3] + 2, tableStartY2 - 18, 9, helveticaBold);
      drawText2('Produção', colPositions2[4] + 2, tableStartY2 - 18, 9, helveticaBold);
      drawText2('Vendido', colPositions2[5] + 2, tableStartY2 - 18, 9, helveticaBold);
      drawText2('Status', colPositions2[6] + 2, tableStartY2 - 18, 9, helveticaBold);

      currentY2 = tableStartY2 - 25;

      producerData.historicoProducao.forEach((producao) => {
        currentY2 -= 20;
        
        drawLine2(50, currentY2, width - 50, currentY2, 0.5);
        colPositions2.forEach(pos => {
          drawLine2(pos, currentY2 + 20, pos, currentY2, 0.5);
        });
        drawLine2(width - 50, currentY2 + 20, width - 50, currentY2, 0.5);

        drawText2(producao.ano || '', colPositions2[0] + 2, currentY2 + 5, 9, helvetica);
        drawText2(producao.cultura || '', colPositions2[1] + 2, currentY2 + 5, 9, helvetica);
        drawText2(producao.tipo || '', colPositions2[2] + 2, currentY2 + 5, 9, helvetica);
        drawText2((producao.area || 0).toString(), colPositions2[3] + 2, currentY2 + 5, 9, helvetica);
        drawText2(`${producao.producao || 0} ${producao.unidade || ''}`, colPositions2[4] + 2, currentY2 + 5, 8, helvetica);
        drawText2((producao.vendido || 0).toString(), colPositions2[5] + 2, currentY2 + 5, 9, helvetica);
        drawText2(producao.status || '', colPositions2[6] + 2, currentY2 + 5, 8, helvetica);
      });

      drawLine2(50, currentY2, width - 50, currentY2, 1);
    }

    // TERCEIRA PÁGINA - HISTÓRICO DE BENEFÍCIOS
    if (producerData.historicoBeneficios && producerData.historicoBeneficios.length > 0) {
      const page3 = pdfDoc.addPage([595.28, 841.89]);
      let currentY3 = height - 50;

      const drawText3 = (text, x, y, fontSize = DEFAULT_FONT_SIZE, font = helvetica, color = blackColor) => {
        page3.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color
        });
      };

      const drawCenteredText3 = (text, y, fontSize = DEFAULT_FONT_SIZE, font = helvetica, color = blackColor) => {
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const x = (width - textWidth) / 2;
        drawText3(text, x, y, fontSize, font, color);
      };

      const drawLine3 = (x1, y1, x2, y2, thickness = 1) => {
        page3.drawLine({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          thickness,
          color: blackColor
        });
      };

      drawCenteredText3('HISTÓRICO DE BENEFÍCIOS', currentY3, 18, timesBold);
      currentY3 -= 40;

      const tableStartY3 = currentY3;
      const colPositions3 = [50, 130, 230, 350, 430, 510];

      drawLine3(50, tableStartY3, width - 50, tableStartY3, 1);
      drawLine3(50, tableStartY3 - 25, width - 50, tableStartY3 - 25, 1);

      colPositions3.forEach(pos => {
        drawLine3(pos, tableStartY3, pos, tableStartY3 - 25, 1);
      });
      drawLine3(width - 50, tableStartY3, width - 50, tableStartY3 - 25, 1);

      drawText3('Data', colPositions3[0] + 2, tableStartY3 - 18, 9, helveticaBold);
      drawText3('Categoria', colPositions3[1] + 2, tableStartY3 - 18, 9, helveticaBold);
      drawText3('Descrição', colPositions3[2] + 2, tableStartY3 - 18, 9, helveticaBold);
      drawText3('Valor', colPositions3[3] + 2, tableStartY3 - 18, 9, helveticaBold);
      drawText3('Fonte', colPositions3[4] + 2, tableStartY3 - 18, 9, helveticaBold);
      drawText3('Status', colPositions3[5] + 2, tableStartY3 - 18, 9, helveticaBold);

      currentY3 = tableStartY3 - 25;

      producerData.historicoBeneficios.forEach((beneficio) => {
        currentY3 -= 20;
        
        drawLine3(50, currentY3, width - 50, currentY3, 0.5);
        colPositions3.forEach(pos => {
          drawLine3(pos, currentY3 + 20, pos, currentY3, 0.5);
        });
        drawLine3(width - 50, currentY3 + 20, width - 50, currentY3, 0.5);

        drawText3(formatarData(beneficio.data), colPositions3[0] + 2, currentY3 + 5, 8, helvetica);
        drawText3(beneficio.categoria || '', colPositions3[1] + 2, currentY3 + 5, 8, helvetica);
        
        const descricao = beneficio.descricao || '';
        const descricaoTruncada = descricao.length > 20 ? descricao.substring(0, 20) + '...' : descricao;
        drawText3(descricaoTruncada, colPositions3[2] + 2, currentY3 + 5, 8, helvetica);
        
        const valorFormatado = beneficio.unidade === 'AOA' ? 
          `${(beneficio.valor || 0).toLocaleString()} AOA` : 
          `${beneficio.valor || 0} ${beneficio.unidade || ''}`;
        drawText3(valorFormatado, colPositions3[3] + 2, currentY3 + 5, 8, helvetica);
        
        drawText3(beneficio.fonte || '', colPositions3[4] + 2, currentY3 + 5, 8, helvetica);
        drawText3(beneficio.status || '', colPositions3[5] + 2, currentY3 + 5, 8, helvetica);
      });

      drawLine3(50, currentY3, width - 50, currentY3, 1);
    }

    // Número da ficha
    const fichaNum = `N° Ficha-${Math.floor(Math.random() * 9000) + 1000}`;
    page.drawText(fichaNum, {
      x: 50,
      y: 40,
      size: DEFAULT_FONT_SIZE,
      font: timesRoman,
      color: blackColor
    });

    // Salvar e fazer download do PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ficha_produtor_${(producerData.nome || 'sem_nome').toLowerCase().replace(/ /g, '_')}_${producerData.numeroRegistro || producerData.id || Date.now()}.pdf`;
    link.click();

    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'PDF gerado com sucesso!' };
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error(`Erro ao gerar o PDF: ${error.message || 'Tente novamente.'}`);
  }
};