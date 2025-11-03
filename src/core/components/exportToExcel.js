import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * @param {Array<Object>} data 
 * @param {string} fileName
 * @param {string} title 
 * @param {function} showToast 
 */
export const exportToExcel = async (
  data = [],
  fileName = 'dados_exportados',
  title = 'Relatório de Dados',
  showToast
) => {
  if (!Array.isArray(data) || data.length === 0) {
    showToast?.('warning', 'Sem dados', 'Não há dados para exportar.');
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    // Cabeçalhos
    const headers = Object.keys(data[0]);

    // largura  das colunas
    const columns = headers.map(header => {
      const maxLen = Math.max(
        header.length,
        ...data.map(row => {
          const cell = row[header];
          return cell === undefined || cell === null ? 0 : String(cell).length;
        })
      );
      return { header, key: header, width: Math.min(Math.max(maxLen + 5, 10), 60) };
    });
    worksheet.columns = columns;

    //  título da tabela 
    worksheet.mergeCells(1, 1, 1, headers.length);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = title;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 25;

    // Adiciona o cabeçalho (linha 2)
    worksheet.addRow(headers);

    // Adiciona os dados (a partir da linha 3)
    data.forEach(row => worksheet.addRow(row));

    // Estiliza o cabeçalho
    const headerRow = worksheet.getRow(2);
    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDCE6F1' } 
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Bordas para todas as linhas da tabela
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 1) {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    // Gera e baixa o arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const safeFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, safeFileName);

    showToast?.('success', 'Exportado', 'Dados exportados com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    showToast?.('error', 'Erro', 'Falha ao exportar os dados. Verifique o console.');
  }
};
