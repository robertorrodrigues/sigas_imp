
// src/utils/generateInspectionReport.js
import jsPDF from 'jspdf';

/**
 * Gera PDF do Relatório de Inspeção.
 * - Inclui cabeçalho com logo e título
 * - Bloco de dados da OS/Cliente/Técnico/Data
 * - Lista de checklist com resultado, observação e fotos
 * - Seção final com data/hora e linhas para assinaturas
 *
 * @param {Object} params
 * @param {string} params.logoUrl URL pública da logo (PNG/JPEG) ou dataURL (base64).
 * @param {Object} params.header Dados do cabeçalho/identificação
 * @param {string} params.header.numeroOS
 * @param {string} params.header.nomeCliente
 * @param {string} params.header.nomeTecnico
 * @param {string|Date|null} params.header.dataConclusao
 * @param {Array<Object>} params.checklist
 *        item: { item_id, descricao, resultado, observacao, foto_url }
 *        - foto_url pode ser string ou array de strings
 * @param {Object} params.signatures Assinaturas capturadas (opcional)
 *        { tecnico: dataURL|null, cliente: dataURL|null }
 */
export async function generateInspectionReport({ logoUrl, header, checklist, signatures = {} }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' }); // 595 x 842 pt em A4
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const bottomMargin = 64;

  // Util: data/hora pt-BR
  const formatDate = (d) => {
    if (!d) return '—';
    try {
      const date = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
      return new Intl.DateTimeFormat('pt-BR').format(date);
    } catch {
      return '—';
    }
  };

  // ===== Cabeçalho =====
  let y = 36;

  const logoDataUrl = await safeToDataURL(logoUrl).catch(() => null);
  if (logoDataUrl) {
    // tenta manter uma proporção agradável
    const { w: lw, h: lh } = await getImgNaturalSize(logoDataUrl).catch(() => ({ w: 3, h: 1 }));
    const target = fitRect(lw, lh, 140, 48);
    doc.addImage(logoDataUrl, guessImageType(logoDataUrl), margin, y, target.w, target.h);
  }

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Relatório de Inspeção', pageWidth / 2, y + 22, { align: 'center', baseline: 'middle' });

  // linha separadora
  const lineY = y + 60;
  doc.setDrawColor(210);
  doc.line(margin, lineY, pageWidth - margin, lineY);

  // ===== Bloco de identificação =====
  y = lineY + 20;
  doc.setFont('Helvetica', 'bold'); doc.setFontSize(12);
  doc.text('Número de OS:', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(String(header?.numeroOS ?? '—'), margin + 160, y);

  y += 18;
  doc.setFont('Helvetica', 'bold');
  doc.text('Nome do Cliente:', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(String(header?.nomeCliente ?? '—'), margin + 160, y);

  y += 18;
  doc.setFont('Helvetica', 'bold');
  doc.text('Nome do Técnico:', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(String(header?.nomeTecnico ?? '—'), margin + 160, y);

  y += 18;
  doc.setFont('Helvetica', 'bold');
  doc.text('Data da Conclusão da OS:', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(formatDate(header?.dataConclusao), margin + 160, y);

  // ===== Título Checklist =====
  y += 28;
  doc.setFont('Helvetica', 'bold'); doc.setFontSize(14);
  doc.text('Revisão do Checklist', margin, y);

  // ===== Itens do Checklist =====
  y += 14;
  doc.setFont('Helvetica', 'normal'); doc.setFontSize(11);

  // pré-carrega fotos (para evitar várias fetches repetidas)
  const allPhotoUrls = [];
  (checklist || []).forEach((it) => {
    if (!it) return;
    if (Array.isArray(it.foto_url)) {
      it.foto_url.forEach(u => u && allPhotoUrls.push(u));
    } else if (it.foto_url) {
      allPhotoUrls.push(it.foto_url);
    }
  });
  const uniqueUrls = Array.from(new Set(allPhotoUrls.filter(Boolean)));
  const dataUrlMap = new Map();
  await Promise.all(
    uniqueUrls.map(async (u) => {
      try {
        const du = await safeToDataURL(u);
        dataUrlMap.set(u, du);
      } catch { /* ignora erro individual */ }
    })
  );

  for (const it of (checklist || [])) {
    const itemTitle = `${it?.item_id ?? ''} - ${it?.descricao ?? ''}`.trim();
    const result = it?.resultado ?? '—';
    const obs = (it?.observacao || '').trim();

    const titleLines = doc.splitTextToSize(itemTitle || '—', pageWidth - (margin * 2));
    const resultLine = `Resultado: ${result}`;
    const obsLines = obs ? doc.splitTextToSize(`Observação: ${obs}`, pageWidth - (margin * 2)) : [];

    // Espaço mínimo para título + resultado + obs (sem fotos)
    let need = titleLines.length * 14 + 16; // título + result
    if (obsLines.length) need += obsLines.length * 12 + 6;

    // Fotos (podem ser 1..n)
    const photos = Array.isArray(it?.foto_url) ? it.foto_url : (it?.foto_url ? [it.foto_url] : []);
    // cada foto ocupa até 180x120 + margem inferior
    const photoSizes = [];
    for (const p of photos) {
      const dataUrl = dataUrlMap.get(p);
      if (!dataUrl) continue;
      // pega proporção natural
      const { w: iw, h: ih } = await getImgNaturalSize(dataUrl).catch(() => ({ w: 4, h: 3 }));
      const fitted = fitRect(iw, ih, 180, 120);
      photoSizes.push({ ...fitted, dataUrl, type: guessImageType(dataUrl) });
    }

    // fotos em linha (máx 2 por linha)
    const perRow = 2;
    if (photoSizes.length > 0) {
      const rows = Math.ceil(photoSizes.length / perRow);
      // altura por linha: maxH(row) + 10
      for (let r = 0; r < rows; r++) {
        const slice = photoSizes.slice(r * perRow, r * perRow + perRow);
        const maxH = Math.max(...slice.map(s => s.h));
        need += maxH + 10;
      }
    }

    // quebra de página, se necessário
    y = ensureSpace(doc, y, need, margin, bottomMargin);

    // título
    doc.setFont('Helvetica', 'bold'); doc.setFontSize(11);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 14;

    // resultado
    doc.setFont('Helvetica', 'normal'); doc.setFontSize(11);
    doc.text(resultLine, margin, y);
    y += 16;

    // observação
    if (obsLines.length) {
      doc.setTextColor(130, 130, 60);
      doc.text(obsLines, margin, y);
      doc.setTextColor(0, 0, 0);
      y += obsLines.length * 12 + 6;
    }

    // fotos
    if (photoSizes.length > 0) {
      let col = 0;
      let rowMaxH = 0;
      for (let idx = 0; idx < photoSizes.length; idx++) {
        const s = photoSizes[idx];
        // se não couber esta linha, quebra antes
        if (col === 0) {
          // assegura espaço para pelo menos uma linha de fotos
          y = ensureSpace(doc, y, s.h + 10, margin, bottomMargin);
        }

        const x = margin + (col * (s.w + 16));
        doc.addImage(s.dataUrl, s.type, x, y, s.w, s.h);
        rowMaxH = Math.max(rowMaxH, s.h);
        col++;

        // 2 por linha
        if (col >= perRow || idx === photoSizes.length - 1) {
          y += rowMaxH + 10;
          col = 0;
          rowMaxH = 0;
        }
      }
    }

    y += 8; // espaçamento entre itens
  }

  // ===== Seção final: data/hora e assinaturas =====
  const emittedAt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
  const signBlockHeight = 150;

  y = ensureSpace(doc, y, signBlockHeight, margin, bottomMargin);

  // data/hora
  doc.setFont('Helvetica', 'bold'); doc.setFontSize(12);
  doc.text('Data e Hora:', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(emittedAt, margin + 100, y);

  // linhas e/ou imagens de assinaturas
  const zoneY = y + 40;
  const zoneWidth = pageWidth - margin * 2;
  const colGap = 24;
  const colWidth = (zoneWidth - colGap) / 2;
  const signatureWidth = 100;
  const signatureHeight = 40;

  // técnico
  const tecnicoSignature = signatures?.tecnico;
  if (tecnicoSignature) {
    // Exibir imagem da assinatura
    try {
      doc.addImage(tecnicoSignature, 'PNG', margin, zoneY, signatureWidth, signatureHeight);
    } catch (e) {
      // Se falhar, desenhar linha
      doc.setDrawColor(60);
      doc.line(margin, zoneY + 36, margin + colWidth, zoneY + 36);
    }
  } else {
    // Desenhar linha em branco
    doc.setDrawColor(60);
    doc.line(margin, zoneY + 36, margin + colWidth, zoneY + 36);
  }
  doc.setFont('Helvetica', 'normal'); doc.setFontSize(11);
  doc.text(`Assinatura do Técnico${header?.nomeTecnico ? `: ${header.nomeTecnico}` : ''}`, margin, zoneY + 52);

  // cliente
  const clienteSignature = signatures?.cliente;
  if (clienteSignature) {
    // Exibir imagem da assinatura
    try {
      doc.addImage(clienteSignature, 'PNG', margin + colWidth + colGap, zoneY, signatureWidth, signatureHeight);
    } catch (e) {
      // Se falhar, desenhar linha
      doc.setDrawColor(60);
      doc.line(margin + colWidth + colGap, zoneY + 36, margin + colWidth + colGap + colWidth, zoneY + 36);
    }
  } else {
    // Desenhar linha em branco
    doc.setDrawColor(60);
    doc.line(margin + colWidth + colGap, zoneY + 36, margin + colWidth + colGap + colWidth, zoneY + 36);
  }
  doc.text(`Assinatura do Cliente${header?.nomeCliente ? `: ${header.nomeCliente}` : ''}`, margin + colWidth + colGap, zoneY + 52);

  // ===== Rodapé: numeração =====
  addFooter(doc);

  // arquivo
  const filename = `relatorio_inspecao_${sanitizeFile(header?.numeroOS || 'sem_os')}.pdf`;
  doc.save(filename);
}

// ---------- Helpers ----------

function sanitizeFile(s) {
  return String(s).replace(/[^\w\-]+/g, '_');
}

/** Garante espaço na página; se não couber "need", adiciona nova página. */
function ensureSpace(doc, y, need, margin, bottomMargin) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + need > pageHeight - bottomMargin) {
    doc.addPage();
    // cabeçalho repetido opcional (omiti para simplificar)
    return margin; // volta ao topo com margem
  }
  return y;
}

/** Converte URL http(s) para dataURL; se já for dataURL, retorna. */
async function safeToDataURL(url) {
  if (!url) return null;
  if (String(url).startsWith('data:image')) return url;

  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Falha ao carregar imagem');
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Descobre tipo a partir do dataURL */
function guessImageType(dataUrl) {
  if (!dataUrl) return 'PNG';
  if (dataUrl.startsWith('data:image/png')) return 'PNG';
  if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) return 'JPEG';
  return 'PNG';
}

/** Obtém dimensões naturais da imagem (para manter proporção). */
async function getImgNaturalSize(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image(); // ambiente browser
    img.onload = () => resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/** Ajusta para caber em maxW x maxH mantendo proporção */
function fitRect(w, h, maxW, maxH) {
  if (!w || !h) return { w: maxW, h: maxH };
  const ratio = Math.min(maxW / w, maxH / h);
  return { w: Math.round(w * ratio), h: Math.round(h * ratio) };
}

function addFooter(doc) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerY = pageHeight - 24;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 48, footerY, { align: 'right' });
    doc.setTextColor(0);
  }
}
