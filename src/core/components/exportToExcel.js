
import * as XLSX from 'xlsx';


/**
 * @param {Array} data 
 * @param {string} fileName 
 * @param {function} showToast 
 */
export const exportToExcel = (data = [], fileName = 'dados_exportados', showToast) => {
    if (!data.length) {
        showToast?.('warning', 'Sem dados', 'Não há dados para exportar.');
        return;
    }

    // Cria a planilha a partir dos dados recebidos
    const ws = XLSX.utils.json_to_sheet(data);

    // Define largura automática das colunas
    const colWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(key.length, ...data.map(row => (row[key]?.toString().length || 10))) + 5
    }));
    ws['!cols'] = colWidths;

    // Cabeçalhos em negrito e centralizados
    const headerCells = Object.keys(data[0]);
    headerCells.forEach((key, idx) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: idx });
        if (!ws[cellAddress]) return;
        ws[cellAddress].s = {
            font: { bold: true },
            alignment: { horizontal: 'center', vertical: 'center' }
        };
    });

    //  workbook e salva
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados Exportados');
    const formattedName = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, formattedName);

    showToast?.('success', 'Exportado', 'Dados exportados com sucesso!');
};
