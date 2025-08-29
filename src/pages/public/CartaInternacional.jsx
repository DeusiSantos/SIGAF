import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScout } from '../../hooks/useScoutData';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Download, IdCard, Printer, Save } from 'lucide-react';
// Importar as imagens
import headerImg from '../../assets/header.png';
import footerImg from '../../assets/footer.png';
import watermarkImg from '../../assets/LogoAngola.png';
import api from '../../services/api';
import CustomInput from '../../components/CustomInput';

const CartaInternacional = () => {
  const { id } = useParams();
  const { scout, loading, mutate } = useScout();
  const [gerando, setGerando] = useState(false);
  const [passaporte, setPassaporte] = useState('');
  const [passaporteError, setPassaporteError] = useState('');
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  const scoutData = scout?.find(s => s.id.toString() === id);

  // Preencher o passaporte se já estiver disponível
  useEffect(() => {
    if (scoutData?.passaporte) {
      setPassaporte(scoutData.passaporte);
    }
  }, [scoutData]);

  const formatarData = (data) => {
    const date = new Date(data);
    return `${String(date.getDate()).padStart(2, '0')} de ${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date)
      } de ${date.getFullYear()}`;
  };

  // Função para traduzir a categoria para inglês
  const traduzirCategoria = (categoria) => {
    const traducoes = {
      'LOBITO': 'Cub Scout',
      'JUNIORS': 'Junior Scout',
      'SENIORS': 'Senior Scout',
      'CAMINHEIROS': 'Rover Scout',
      'DIRIGENTES': 'Leader'
    };

    return traducoes[categoria] || categoria;
  };

  // Função para salvar o número do passaporte
  const salvarPassaporte = async () => {
    if (!passaporte) {
      setPassaporteError('O número do passaporte é obrigatório');
      return;
    }

    try {
      setSalvando(true);

      // Chamar a API para atualizar o passaporte
      await api.patch(`/escuteiros/${id}`, {
        passaporte: passaporte
      });

      // Atualizar os dados em cache
      mutate();

      setPassaporteError('');
      // Notificação de sucesso
      alert('Passaporte salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar passaporte:', error);
      setPassaporteError('Erro ao salvar o passaporte. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const gerarPDF = async () => {
    if (!passaporte) {
      setPassaporteError('O número do passaporte é obrigatório para gerar a carta');
      return;
    }

    try {
      setGerando(true);

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { width, height } = page.getSize();

      // Carregar e incorporar as imagens
      const [headerImageBytes, footerImageBytes, watermarkImageBytes] = await Promise.all([
        fetch(headerImg).then(res => res.arrayBuffer()),
        fetch(footerImg).then(res => res.arrayBuffer()),
        fetch(watermarkImg).then(res => res.arrayBuffer())
      ]);

      const [headerImageEmbed, footerImageEmbed, watermarkImageEmbed] = await Promise.all([
        pdfDoc.embedPng(headerImageBytes),
        pdfDoc.embedPng(footerImageBytes),
        pdfDoc.embedPng(watermarkImageBytes)
      ]);

      // Desenhar marca d'água na área específica
      const watermarkStartY = height - 200;  // Começa na altura da referência
      const watermarkEndY = 180;             // Termina logo acima da data
      const watermarkHeight = watermarkStartY - watermarkEndY

      page.drawImage(watermarkImageEmbed, {
        x: 50,                           // Começa onde inicia o texto em português
        y: watermarkEndY,
        width: width - 100,              // Termina onde acaba o texto em inglês
        height: watermarkHeight,
        opacity: 0.3
      });

      // Desenhar cabeçalho
      page.drawImage(headerImageEmbed, {
        x: 0,
        y: height - 120,
        width: width,
        height: 120,
      });

      // Fontes
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Função auxiliar para desenho de texto
      const drawText = (text, x, y, { size = 9, font = helvetica, align = 'left' } = {}) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        const actualX = align === 'center' ? x - textWidth / 2 : x;
        page.drawText(text, { x: actualX, y, size, font });
      };

      // Referência
      const refNumber = `Ref nr ${new Date().getFullYear()}/CI/${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
      drawText(refNumber, 50, height - 200, { size: 9 });

      // Títulos
      const titleY = height - 230;
      drawText('CARTA INTERNACIONAL', width * 0.25, titleY, {
        size: 12,
        font: helveticaBold,
        align: 'center'
      });

      drawText('INTERNATIONAL LETTER', width * 0.75, titleY, {
        size: 12,
        font: helveticaBold,
        align: 'center'
      });

      // Tradução da categoria para inglês
      const categoriaEmIngles = traduzirCategoria(scoutData.categoria);

      // Conteúdo em duas colunas
      const contentStartY = titleY - 30;
      const lineHeight = 15;

      // Versão em Português (Coluna Esquerda)
      let currentY = contentStartY;
      // Texto inicial em negrito e maior
      drawText('A ASSOCIAÇÃO DE ESCUTEIROS DE', 50, currentY, {
        size: 11,
        font: helveticaBold
      });
      currentY -= lineHeight;
      drawText('ANGOLA', 50, currentY, {
        size: 11,
        font: helveticaBold
      });
      currentY -= lineHeight;

      drawText('declara que o senhor', 50, currentY, { size: 9 });
      const nameWidth = helvetica.widthOfTextAtSize('declara que o senhor', 9);
      drawText(scoutData.nome.toUpperCase(), 50 + nameWidth + 5, currentY, {
        size: 11,
        font: helveticaBold
      });

      const textoPT = [
        `titular do Passaporte n.º ${passaporte} é membro efectivo,`,
        `na qualidade de ${scoutData.categoria}, exercendo funções nos`,
        'Serviços Centrais desta Associação.',
        '',
        'A seu pedido, emitimos a presente Carta Internacional a fim',
        'de ser apresentada nas Associações Escuteiras das Repúblicas',
        'de Portugal e da Bélgica a fim de, durante o período em que o',
        'mesmo permanecer temporariamente nestes países, possa',
        'interagir e participar de eventos escutistas.',
        '',
        'Mais declara que esta Associação não é responsável pelas',
        'despesas de deslocação, alojamento e outras, do titular',
        'desta Carta.',
        '',
        'Por ser verdade, emite-se a presente Carta Internacional que',
        'vai devidamente assinada e carimbada.'
      ];

      currentY -= lineHeight;
      textoPT.forEach(line => {
        drawText(line, 50, currentY, { size: 9 });
        currentY -= lineHeight;
      });

      // Versão em Inglês (Coluna Direita)
      currentY = contentStartY;
      // Texto inicial em negrito e maior
      drawText('The ANGOLA SCOUTS ASSOCIATION', width / 2 + 20, currentY, {
        size: 11,
        font: helveticaBold
      });
      currentY -= lineHeight;

      drawText('declares that Mr.', width / 2 + 20, currentY, { size: 9 });
      const mrWidth = helvetica.widthOfTextAtSize('declares that Mr.', 9);
      drawText(scoutData.nome.toUpperCase(), width / 2 + 20 + mrWidth + 5, currentY, {
        size: 11,
        font: helveticaBold
      });

      const textoEN = [
        `holder of Passport No. ${passaporte} is an effective`,
        `member, as ${categoriaEmIngles}, working in the National`,
        'Headquarter of this Association.',
        '',
        'As his request, we issue this International Charter to be',
        'presented to the Scout Associations of the Republics of',
        'Portugal and Belgium so that, during the period in which he',
        'temporarily stays in these countries, he can interact and',
        'participate in scout events.',
        '',
        'It is further stated that this Association is not responsible',
        'for the travel, accommodation and other types of expenses',
        'of the holder of this Charter.',
        '',
        'As it is true, this International Charter is hereby issued,',
        'and it is duly signed and stamped.'
      ];

      currentY -= lineHeight;
      textoEN.forEach(line => {
        drawText(line, width / 2 + 20, currentY, { size: 9 });
        currentY -= lineHeight;
      });

      // Assinaturas e slogan - Ajustado para subir mais
      const signatureY = 220;

      // Português - Esquerda
      drawText('SEMPRE ALERTA PARA SERVIR!', width * 0.25, signatureY, {
        size: 10,
        font: helveticaBold,
        align: 'center'
      });

      // Inglês - Direita
      drawText('ALWAYS PREPARED TO SERVE!', width * 0.75, signatureY, {
        size: 10,
        font: helveticaBold,
        align: 'center'
      });

      // Linhas para assinatura
      const underlineY = signatureY - 40;
      page.drawLine({
        start: { x: width * 0.1, y: underlineY },
        end: { x: width * 0.4, y: underlineY },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      page.drawLine({
        start: { x: width * 0.6, y: underlineY },
        end: { x: width * 0.9, y: underlineY },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      // Títulos das assinaturas
      drawText('O COMISSÁRIO INTERNACIONAL', width * 0.25, underlineY - 15, {
        size: 9,
        align: 'center'
      });

      drawText('INTERNATIONAL COMMISSIONER', width * 0.75, underlineY - 15, {
        size: 9,
        align: 'center'
      });

      // Data
      const dataAtual = formatarData(new Date());
      drawText(`Luanda, ${dataAtual}`, width - 200, underlineY - 30, { size: 9 });

      // Desenhar rodapé
      page.drawImage(footerImageEmbed, {
        x: 0,
        y: 0,
        width: width,
        height: 100,
      });

      // Salvar e fazer download do PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carta_internacional_${scoutData.nome.toLowerCase().replace(/ /g, '_')}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Carta Internacional</h1>
            <p className="text-gray-600 mt-2">Escuteiro: {scoutData?.nome}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleVoltar}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-300 transition-all"
            >
              Voltar
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
              disabled={gerando}
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button
              onClick={gerarPDF}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl shadow-sm hover:bg-purple-700 transition-all disabled:bg-purple-400"
              disabled={gerando || !passaporte}
            >
              <Download className="w-4 h-4" />
              {gerando ? 'Gerando...' : 'Gerar PDF'}
            </button>
          </div>
        </div>

        {/* Campo de passaporte */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Número do Passaporte</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4 justify-between">
              <div className="flex-grow">
                <CustomInput
                  type="text"
                  label="Número do Passaporte"
                  value={passaporte}
                  onChange={(value) => {
                    setPassaporte(value);
                    if (value) setPassaporteError('');
                  }}
                  errorMessage={passaporteError}
                  placeholder="Insira o número do passaporte"
                  required
                  id="passaporte"
                  iconStart={<IdCard className="text-gray-500" size={18} />}
                  helperText="Necessário para emissão da carta"
                />
              </div>

             <div className='flex-grow"'>
             
             </div>
            </div>

            {passaporteError && (
              <p className="text-xs text-blue-500 mt-1">{passaporteError}</p>
            )}
          </div>
        </div>

        {/* Prévisualização dos Dados */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados da Carta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nome Completo</p>
              <p className="text-gray-800">{scoutData?.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Passaporte</p>
              <p className="text-gray-800">{passaporte || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Categoria (PT)</p>
              <p className="text-gray-800">{scoutData?.categoria}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Categoria (EN)</p>
              <p className="text-gray-800">{traduzirCategoria(scoutData?.categoria)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data</p>
              <p className="text-gray-800">{formatarData(new Date())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartaInternacional;