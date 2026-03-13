
// src/utils/generateContract.js (versão corrigida — fiel ao modelo)
// Correções aplicadas:
// 1) Logo não sobrepõe título (logo pequeno, à esquerda, com margem superior controlada)
// 2) Quadro de dados gerais em 4 colunas (com mesclas como no modelo)
// 3) Tamanhos de fonte ajustados para o modelo (título 14, subtítulo 9, corpo 9, cláusula 11)
// 4) "Serviço Contratado" integrado ao cabeçalho da tabela (não fica separado)
// 5) Texto explicativo CONTRATADA/CONTRATANTE fiel ao modelo, com dados da contratada dinâmicos
// 6) Fechamento com data por extenso no formato: "Cidade, 23 de janeiro de 2026."
// 7) Removido bloco "Data e Hora"
// 8) Formatação automática de CPF/CNPJ e Telefone (pt-BR)

import jsPDF from 'jspdf';

/**
 * Gera o contrato FT-16 fiel ao modelo.
 * @param {Object} params
 * @param {string} [params.logoUrl]
 * @param {Object} params.header
 * @param {string} params.header.numeroOS
 * @param {Date|string|number} params.header.dataContrato
 * @param {string} [params.header.numeroCliente]
 * @param {string} params.header.nomeCliente
 * @param {string} params.header.cpfCnpj
 * @param {string} params.header.enderecoCompleto
 * @param {string} [params.header.telefone]
 * @param {string} params.header.servico
 * @param {number|string} params.header.valorTotal
 * @param {string} [params.header.tipoImovel]
 * @param {Object} params.header.dadosContratada
 * @param {string} params.header.dadosContratada.razaoSocial
 * @param {string} params.header.dadosContratada.cnpj
 * @param {string} params.header.dadosContratada.endereco
 * @param {string|string[]} [params.header.instrucoesNormativas] // opcional — linha separada, mas o parágrafo usa o texto do modelo
 * @param {string} [params.header.cidade='Rio de Janeiro']
 * @param {Object} [params.signatures] - { tecnico?: DataURL, cliente?: DataURL }
 * @param {Object} [params.options]
 * @param {boolean} [params.options.showMetaLine=true]
 * @param {string} [params.options.metaLine]
 * @param {string} [params.options.filename]
 */
export async function generateContract({ logoUrl, header, signatures = {}, options = {} }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' }); // 595 x 842
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ---- Layout constants ----
  const marginTop = 64; // topo
  const marginX = 48;   // laterais
  const bottomMargin = 60;

  // Tamanhos de fonte (modelo)
  const FONT_TITLE = 14;
  const FONT_SUB = 9;
  const FONT_CLAUSE_TITLE = 11;
  const FONT_BODY = 9;

  const showMetaLine = options.showMetaLine !== false;
  const metaLine = options.metaLine || 'Elaboração: nucleoIA - 2025';
  const cidade = header?.cidade || 'Rio de Janeiro';

  // ----------------- Utils -----------------
  function fmtDate(d) {
    try { return new Intl.DateTimeFormat('pt-BR').format(new Date(d ?? Date.now())); } catch { return '—'; }
  }
  function fmtDateLong(d) {
    try { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(d ?? Date.now())); } catch { return fmtDate(d); }
  }
  function currencyBRL(v) {
    try {
      const n = (typeof v === 'number') ? v : Number(String(v).replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.'));
      return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch { return String(v); }
  }
  function onlyDigits(s) { return String(s || '').replace(/\D+/g, ''); }
  /**
   * Formata automaticamente CPF (11 dígitos) ou CNPJ (14 dígitos).
   *  - 14 ⇒ CNPJ => 99.999.999/9999-99
   *  - 11 ⇒ CPF  => 999.999.999-99
   *  - outro ⇒ retorna como veio
   */
  function formatCpfCnpj(value) {
    if (value == null) return '';
    const digits = String(value).replace(/\D+/g, '');
    if (digits.length === 14) {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return String(value);
  }
  function formatPhoneBR(v) {
    const d = onlyDigits(v);
    if (d.length === 11) { // (99) 99999.9999
      return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2.$3');
    }
    if (d.length === 10) { // (99) 9999.9999
      return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2.$3');
    }
    return v ?? '—';
  }
  function ensureSpace(y, need) {
    const pageH = doc.internal.pageSize.getHeight();
    if (y + need > pageH - bottomMargin) { doc.addPage(); return marginTop; }
    return y;
  }

  let y = marginTop;

  // ---- Cabeçalho: logo (esquerda), título central, subtítulo e meta line ----
  if (logoUrl) {
    try {
      const dataUrl = await toDataUrl(logoUrl);
      const { w: lw, h: lh } = await getImgNaturalSize(dataUrl).catch(() => ({ w: 3, h: 1 }));
      const target = fitRect(lw, lh, 110, 32); // pequeno para não colidir
      doc.addImage(dataUrl, guessImageType(dataUrl), marginX, y - 10, target.w, target.h);
    } catch {}
  }

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(FONT_TITLE);
  doc.text('Contrato de Prestação de Serviços', pageWidth/2, y + 8, { align: 'center', baseline: 'middle' });

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(FONT_SUB);
  doc.text('Revisado - Março/2026', pageWidth/2, y + 24, { align: 'center' });

  if (showMetaLine) {
    doc.setFontSize(FONT_SUB);
    doc.text(metaLine, pageWidth/2, y + 38, { align: 'center' });
  }

  y += showMetaLine ? 52 : 42;

  // ---- Quadro de dados gerais (4 colunas) ----
  // L1: [OS][valor] [Data][valor]
  // L2: [Nº Cliente][valor] [Nome Cliente][valor]
  // L3: [CPF/CNPJ][valor] [Telefone][valor]
  // L4: [Endereço Completo][valor (colSpan 3)]

  const boxX = marginX;
  const boxW = pageWidth - marginX*2;
  const colW = boxW / 4;
  const rowH = 18;

  function drawLabel(cx, cy, text) {
  // fundo cinza-claro como antes
  doc.setFillColor(245);
  doc.rect(cx, cy, colW, rowH, 'F');

  // 🔥 adiciona borda preta (antes só existia no drawValue)
  doc.setDrawColor(0);
  doc.setLineWidth(0.6);
  doc.rect(cx, cy, colW, rowH); // desenha borda

  // texto
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(FONT_SUB);
  doc.setTextColor(0);
  doc.text(String(text), cx + 6, cy + 12);
}
  function drawValue(cx, cy, value, spanCols = 1) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(FONT_SUB);
    const w = colW * spanCols;
    const max = w - 10;
    const lines = doc.splitTextToSize(String(value ?? '—'), max);
    const h = Math.max(rowH, lines.length * 10 + 6);
    doc.setDrawColor(0);
    doc.setLineWidth(0.6);
    doc.rect(cx, cy, w, h);
    doc.text(lines, cx + 6, cy + 12);
    return h;
  }

  let boxY = y;
  // L1
  drawLabel(boxX, boxY, 'Ordem de Serviço:');
  const h1v1 = drawValue(boxX + colW, boxY, header?.numeroOS || '—');
  drawLabel(boxX + colW*2, boxY, 'Data do Contrato:');
  const h1v2 = drawValue(boxX + colW*3, boxY, fmtDate(header?.dataContrato));
  y += Math.max(rowH, h1v1, h1v2);

  // L2
  drawLabel(boxX, y, 'Nº Cliente Naturgy:');
  const h2v1 = drawValue(boxX + colW, y, header?.numeroCliente || '—');
  drawLabel(boxX + colW*2, y, 'Nome Cliente:');
  const h2v2 = drawValue(boxX + colW*3, y, header?.nomeCliente || '—');
  y += Math.max(rowH, h2v1, h2v2);

  // L3
  drawLabel(boxX, y, 'CPF/CNPJ:');
  const h3v1 = drawValue(boxX + colW, y, formatCpfCnpj(header?.cpfCnpj));
  drawLabel(boxX + colW*2, y, 'Telefone:');
  const h3v2 = drawValue(boxX + colW*3, y, formatPhoneBR(header?.telefone));
  y += Math.max(rowH, h3v1, h3v2);

  // L4
  drawLabel(boxX, y, 'Endereço Completo:');
  const h4v1 = drawValue(boxX + colW, y, header?.enderecoCompleto || '—', 3);
  y += Math.max(rowH, h4v1) + 8;

  // ---- Tabela Serviço Contratado (integrada) ----
  const tX = marginX;
  const tW = pageWidth - marginX*2;
  const col1 = 120; // "Serviço Contratado"
  const col3 = 110; // "Valor Total"
  const col2 = tW - col1 - col3; // "Serviço"

  const headerH = 18;
  const bodyH = 20;

  doc.setFillColor(245);
  doc.rect(tX, y, tW, headerH, 'F');
  doc.setDrawColor(0); doc.setLineWidth(0.6); doc.rect(tX, y, tW, headerH + bodyH);
  doc.setDrawColor(0); doc.setLineWidth(0.5);
  doc.line(tX + col1, y, tX + col1, y + headerH + bodyH);
  doc.line(tX + col1 + col2, y, tX + col1 + col2, y + headerH + bodyH);
  doc.line(tX, y + headerH, tX + tW, y + headerH);

  doc.setFont('Helvetica', 'bold'); doc.setFontSize(FONT_SUB);
  doc.text('Serviços Contratado', tX + 6, y + 12);
  doc.text('Descrição', tX + col1 + 6, y + 12);
  doc.text('Valor Total', tX + col1 + col2 + 6, y + 12);

  doc.setFont('Helvetica', 'normal'); doc.setFontSize(FONT_SUB);
  const servicoStr = `${String(header?.servico ?? 'Serviço')} ${header?.tipoImovel ? String(header.tipoImovel) : ''}`;
  const valorStr = currencyBRL(header?.valorTotal);
  doc.text('', tX + 6, y + headerH + 14);
  doc.text(servicoStr.trim(), tX + col1 + 6, y + headerH + 14);
  doc.text(valorStr, tX + tW - 6, y + headerH + 14, { align: 'right' });

  y += headerH + bodyH + 8;
  // Linha opcional de Instrução Normativa
  const ins = Array.isArray(header?.instrucoesNormativas) ? header.instrucoesNormativas.join(', ') : (header?.instrucoesNormativas || header?.instrucaoNormativa || '');
  if (ins) {
    y = writeParagraph(doc, `Instrução Normativa: IN 113/2024 CODIR/AGENERSA,  ${ins} CODIR/AGENERSA`, marginX, y, pageWidth - marginX*2, bottomMargin, FONT_SUB);
    y += 4;
  }
  // ---- Parágrafo explicativo (contratada/contratante) — com CPF/CNPJ formatado ----
  y += 14;
  const paragrafo = `A ${String(header?.dadosContratada?.razaoSocial || '').toUpperCase()}, inscrita no CNPJ ${formatCpfCnpj(header?.dadosContratada?.cnpj)}, estabelecida na ${String(header?.dadosContratada?.endereco || '')}, denominada CONTRATADA, e, de outro lado, o CONTRATANTE, identificado acima. Estabelecem o seguinte contrato referente a INSPEÇÃO PERIÓDICA DE GÁS conforme estabelecido pela Lei Estadual nº 6.890/14 RJ e Instrução Normativa nº 113/24 - CODIR/AGENERSA ou Instrução Normativa nº 48/2015 CODIR/AGENERSA (conforme sinalizado acima) mediante as cláusulas e condições adiante descritas.`;
  y = writeParagraph(doc, paragrafo, marginX, y, pageWidth - marginX*2, bottomMargin, FONT_BODY);
  y += 6;

  // Linha opcional de Instrução Normativa
  //const ins = Array.isArray(header?.instrucoesNormativas) ? header.instrucoesNormativas.join(', ') : (header?.instrucoesNormativas || header?.instrucaoNormativa || '');
 // if (ins) {
 //   y = writeParagraph(doc, `Instrução Normativa: ${ins}`, marginX, y, pageWidth - marginX*2, bottomMargin, FONT_SUB);
  //  y += 4;
  //}

  // ---- Cláusulas ----
  const { clauses } = buildContractSections(header);
  for (const cl of clauses) {
    const titleLines = doc.splitTextToSize(cl.heading, pageWidth - marginX*2);
    y = ensureSpace(y, titleLines.length * 12 + 6);
    doc.setFont('Helvetica', 'bold'); doc.setFontSize(FONT_CLAUSE_TITLE);
    doc.text(titleLines, marginX, y);
    y += titleLines.length * 12;

    doc.setFont('Helvetica', 'normal'); doc.setFontSize(FONT_BODY);
    const blocks = splitWithIndent(doc, cl.body, pageWidth - marginX*2, 16);
    for (const b of blocks) {
      const need = b.lines.length * 11 + 2;
      y = ensureSpace(y, need);
      doc.text(b.lines, marginX + (b.indent ? 16 : 0), y);
      y += b.lines.length * 11 + 2;
    }
    y += 4;
  }

  // ---- Fechamento com data por extenso (sem Data e Hora adicional) ----
  
  y += 14;
  const dataExtenso = fmtDateLong(header?.dataContrato);
  const fechamentoStr = `${cidade}, ${dataExtenso}.`;
  const fechamentoLines = doc.splitTextToSize(fechamentoStr, pageWidth - marginX*2);
  y = ensureSpace(y, fechamentoLines.length * 11 + 6);
  doc.setFont('Helvetica', 'normal'); doc.setFontSize(FONT_SUB);
  doc.text(fechamentoLines, marginX, y);
  y += fechamentoLines.length * 11 + 14;

  // ---- Assinaturas (duas colunas) ----
const zoneY = y + 30;
const zoneWidth = pageWidth - marginX * 2;
const colGap = 24;
const colWidth = (zoneWidth - colGap) / 2;
const leftX = marginX;
const rightX = marginX + colWidth + colGap;
const sigW = 150, sigH = 50;

// 🔒 Assinatura fixa da empresa (CONTRATADA)
const companySignatureUrl = options.companySignatureUrl ?? '/images/signature_company.png';

try {
  if (companySignatureUrl) {
    const dataUrlCompany = await toDataUrl(companySignatureUrl);
    doc.addImage(
      dataUrlCompany,
      guessImageType(dataUrlCompany),
      leftX,
      zoneY - sigH + 6,
      sigW,
      sigH
    );
    //doc.setDrawColor(0); //
    //doc.setLineWidth(1); //
    //doc.rect(leftX, zoneY - sigH + 6, sigW, sigH); // borda ao redor da assinatura da empresa
  }
} catch { /* silencioso */ }

// 🧾 Assinatura do cliente
if (signatureOk(signatures?.cliente)) {
  try {
    doc.addImage(
      signatures.cliente,
      'PNG',
      rightX,
      zoneY - sigH + 6,
      sigW,
      sigH
    );
  } catch {}
}

// Linhas sob as assinaturas
doc.setDrawColor(60); 
doc.setLineWidth(0.8);
doc.line(leftX, zoneY, leftX + colWidth, zoneY);
doc.line(rightX, zoneY, rightX + colWidth, zoneY);

// Rótulos
doc.setFont('Helvetica', 'normal');
doc.setFontSize(FONT_SUB);
doc.text(
  `Assinatura da Contratada: ${String(header?.dadosContratada?.razaoSocial ?? '')}`,
  leftX,
  zoneY + 14
);
doc.text(
  `Assinatura do Contratante: ${String(header?.nomeCliente ?? '')}`,
  rightX,
  zoneY + 14
);
  // Rodapé com numeração
  addFooter(doc);

  const filename = options.filename || `contrato_servico_${sanitizeFile(header?.numeroOS || 'sem_os')}.pdf`;
  doc.save(filename);
}

// ---------------- Helpers ----------------
function sanitizeFile(s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_'); }

async function toDataUrl(url) {
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

function guessImageType(dataUrl) {
  if (!dataUrl) return 'PNG';
  if (dataUrl.startsWith('data:image/png')) return 'PNG';
  if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) return 'JPEG';
  return 'PNG';
}

async function getImgNaturalSize(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function fitRect(w, h, maxW, maxH) {
  if (!(w && h)) return { w: maxW, h: maxH };
  const r = Math.min(maxW / w, maxH / h);
  return { w: Math.round(w * r), h: Math.round(h * r) };
}

function addFooter(doc) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerY = pageHeight - 18;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 48, footerY, { align: 'right' });
    doc.setTextColor(0);
  }
}

function signatureOk(sig) { return !!sig && typeof sig === 'string'; }

function writeParagraph(doc, text, x, y, width, bottomMargin, size = 9) {
  const lines = doc.splitTextToSize(String(text), width);
  const need = lines.length * 11 + 2;
  const pageH = doc.internal.pageSize.getHeight();
  if (y + need > pageH - bottomMargin) { doc.addPage(); y = 64; }
  doc.setFont('Helvetica', 'normal'); doc.setFontSize(size);
  doc.text(lines, x, y);
  return y + lines.length * 11;
}

function splitWithIndent(doc, text, width, indentPx) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  for (const raw of lines) {
    const trimmed = raw.trim();
    const isSub = /^\d+\.\d+/.test(trimmed);
    const content = trimmed.length ? trimmed : ' ';
    const split = doc.splitTextToSize(content, width - (isSub ? indentPx : 0));
    blocks.push({ indent: isSub, lines: split });
  }
  return blocks;
}

// ----- Cláusulas (FT-16) -----
function buildContractSections(header) {
  const c1 = `1.1 - Este contrato estipula as condições para a realização do serviço de AUTOVISTORIA e INSPEÇÃO DE SEGURANÇA nas instalações e redes de distribuição interna residencial/comercial de gás combustível canalizado das unidades autônomas do endereço discriminado acima em atendimento ao disposto na Lei n.º 6.890/2014 RJ e na Instrução Normativa sinalizada no início do presente contrato, e emissão do relatório com o respectivo resultado e certificado correspondente.
1.2 - Para a prestação dos serviços da INSPEÇÃO PERIÓDICA DE GÁS, a CONTRATADA cumprirá integralmente com as disposições da Instrução Normativa sinalizada no início do presente contrato, ou outra regulamentação que se sobreponha a esta; a Lei Estadual nº 6.890/2014; as Normas Técnicas Complementares vigentes editadas pela Concessionária de distribuição gás canalizado e as demais normas técnicas vigentes, legais e regulatórias sobre a matéria.
1.3 - O(A) CONTRATANTE fica desde já ciente e de acordo que a CONTRATADA não se responsabilizará por eventual inviabilidade técnica de abastecimento por parte da Concessionária distribuidora de gás canalizado.
1.4 - Nos casos em que houver mudança de escopo e/ou atividade (suspensão, cancelamento, redução da acreditação e as consequências associadas) a CONTRATADA informará aos seus clientes por meio de telefonemas, mensagens eletrônicas ou e-mail, e fornecerá a seus clientes os meios alternativos de cumprimento de suas obrigações contratuais. (Consideram-se clientes do Organismo para recebimento destas notificações, aqueles que: tiverem sido agendados ou contatados pela CONTRATADA para realização da inspeção no mês corrente e aqueles que necessitarem de reinspeção, dentro do prazo definido nos itens 3.1 e 3.2 deste contrato).`;

  const c2 = `2.1 - A INSPEÇÃO PERIÓDICA DE GÁS dá direito a 1 (uma) visita e 1 (uma) revisita, quando necessário.
2.2 - Entende-se por INSPEÇÃO PERIÓDICA DE GÁS a visita técnica, feita à unidade do(a) CONTRATANTE para averiguar a conformidade das instalações internas de gás, aparelhos e ambiente, de forma preventiva, e apontar ao(à) CONTRATANTE eventuais necessidades de adequação. Esta revisão só poderá ser solicitada pelo(a) CONTRATANTE, agendando com a CONTRATADA, por meio de seus canais de atendimento.
2.3 - A INSPEÇÃO PERIÓDICA DE GÁS será realizada por meio de verificação visual das condições da instalação interna, aparelhos e ambiente, por meio do teste de estanqueidade, com a medição da emissão de monóxido de carbono no ambiente e aparelho, utilizando a Instrução Normativa nº 113/24 - CODIR/AGENERSA ou Instrução Normativa nº 48/2015 - CODIR/AGENERSA (conforme sinalizado no início do presente contrato), ou outra regulamentação que lhe substituta, normas e regulamentos vigentes, na época, como base.
2.4 - Após a realização da INSPEÇÃO PERIÓDICA DE GÁS será emitido um certificado, o qual poderá apresentar como resultado a conformidade, a não conformidade ou a conformidade com restrição.
2.4.1 - Será emitido o certificado Conforme, quando a instalação e os aparelhos a gás estiverem de acordo com as normas vigentes.
2.4.2 - Será emitido o certificado Conforme com Restrição, quando a instalação e/ou os aparelhos a gás não estiverem totalmente em conformidade com as normas vigentes. Nesta circunstância, dependendo do caso, será concedido um prazo de 60 (sessenta) ou 90 (noventa) dias para o(a) CONTRATANTE realizar as adequações necessárias. Após a efetivação da devida adequação o(a) CONTRATANTE deverá entrar em contato com a CONTRATADA para solicitar a sua "reinspeção" (nova visita). Sendo necessário que o(a) CONTRATANTE realize as adequações com urgência, preferencialmente após a realização das adequações o(a) CONTRATANTE deverá entrar em contato com a CONTRATADA para solicitar a revisita até 10 dias antes do prazo constante no laudo, a fim de evitar congestionamento na agenda.
2.4.3 - Será emitido o certificado Não Conforme, quando as instalações e aparelhos de gás estiverem fora dos padrões de segurança aceitáveis. Neste caso a situação verificada será informada imediatamente à Distribuidora Local, podendo a concessionária (a seu critério) interromper o fornecimento de gás, sendo necessário que o(a) CONTRATANTE realize as adequações, passe por nova inspeção e, sendo aprovada, tenha seu abastecimento restabelecido. Imprescindível que após a realização das adequações o(a) CONTRATANTE deverá entrar em contato com a CONTRATADA para solicitar sua "reinspeção" (nova visita), entendendo que será necessário antecedência para evitar congestionamento na agenda de atendimento diário da CONTRATADA.
2.5 - Na hipótese de emissão dos certificados não conformes ou conforme com restrição, o(a) CONTRATANTE terá o prazo máximo de 90 (noventa) dias, a contar da primeira visita, para solicitar a sua revisita, independente da sua condição de fornecimento junto à Concessionária local. Caso isso não ocorra o(a) CONTRATANTE perderá o direito à revisita, tendo que recontratar o serviço.
2.6 - A INSPEÇÃO PERIÓDICA DE GÁS não inclui nenhuma execução dos serviços de adequação e/ou manutenção cuja necessidade seja eventualmente detectada por ocasião da inspeção.`;

  const c3 = `3.1 - O prazo de vigência deste Contrato tem início a partir da assinatura do mesmo até a emissão do laudo final na 1ª visita ou 2ª visita, quando necessária.
3.1.1 - Será considerada data de adesão aquela em que o(a) CONTRATANTE manifestou seu interesse expresso de contratar a Inspeção Periódica de Gás, seja por atendimento telefônico, contratação presencial ou através do site.`;

  const c4 = `4.1 - O(A) CONTRATANTE pagará à CONTRATADA pela prestação dos serviços ora indicados, a quantia descrita no início do presente contrato, conforme ajuste e autorização expressa do(a) CONTRATANTE, ora concedida.
4.2 - Caso o(a) CONTRATANTE atrase o pagamento da obrigação pactuada, é facultado à CONTRATADA promover o vencimento antecipado das obrigações futuras, corrigindo e atualizando o débito, o qual será objeto de cobrança.`;

  const c5 = `5.1 - São obrigações da CONTRATADA: Dar ciência ao CONTRATANTE sobre riscos; prestar esclarecimentos; disponibilizar canais de atendimento; manter o CONTRATANTE informado; elaborar certificado e laudo; definir prazo para adequação; retornar para nova inspeção; notificar a Concessionária sobre riscos; e outras obrigações previstas nas normas.`;

  const c6 = `6.1 - São obrigações do(a) CONTRATANTE: Ter ciência e acatar todos os itens deste Contrato; viabilizar o acesso da CONTRATADA; manter as condições de segurança das instalações; solicitar nova visita em caso de alteração nos equipamentos; fornecer dados verídicos; providenciar a regularização de inadequações; declarar ciência dos riscos; e arquivar o laudo por 05 (cinco) anos.`;

  const c7 = `7.1 - A CONTRATADA garante cumprir as normas, não se responsabilizando por modificações feitas pelo CONTRATANTE.
7.2 - O selo de aprovação tem validade de 5 (cinco) anos, se não houver alterações.
7.3 - Esta garantia não exime a CONTRATADA da responsabilidade por vícios ocultos.`;

  const c8 = `8.1 - As Partes concordam que este instrumento será rescindido na ocorrência das seguintes hipóteses:
8.1.1 - Por manifestação de qualquer das Partes, desde que feita expressamente e com antecedência prévia de 30 (trinta) dias.
8.1.2 - Determinação judicial, legal ou regulamentar que impeça a prestação da INSPEÇÃO PERIÓDICA DE GÁS.
8.2 - Caso o(a) CONTRATANTE venha a solicitar a rescisão deste Contrato após ter sido realizada a inspeção pela CONTRATADA, fica desde já ajustado pelas Partes que o(a) CONTRATANTE deverá honrar, integralmente, com o pagamento das parcelas vencidas e das faltantes (caso haja) referentes à prestação do serviço contratado.`;

  const c9 = `9.1 - As Partes concordam que durante a vigência deste instrumento, os serviços disponibilizados poderão ficar suspensos enquanto perdurarem um dos seguintes eventos: (i) inadimplemento do(a) CONTRATANTE; (ii) quando comprovadamente o(a) CONTRATANTE fornece informação falsa.`;

  const c10 = `10.1 - A CONTRATADA possui uma política de Imparcialidade, Independência, Integridade e Confidencialidade disponíveis ao público mediante consulta, que é aplicada na execução do serviço de INSPEÇÃO PERIÓDICA DE GÁS.
10.2 - A CONTRATADA se compromete a manter em caráter confidencial todas as informações relacionadas com as inspeções, incluindo as recebidas de outras fontes que não seja pelos(as) CONTRATANTES, não podendo ser usadas ou divulgadas a terceiros não autorizados, sem o formal consentimento do(a) CONTRATANTE, salvo quando a lei exige a divulgação desta informação, caso em que a CONTRATADA irá informar o(a) CONTRATANTE afetado, a menos que proibido por lei.`;

  const c11 = `11.1 - A tolerância ou o não exercício de quaisquer direitos assegurados neste Contrato não importará em ato de renúncia ou novação, podendo as partes exercê-los a qualquer tempo.
11.2 - As partes reconhecem que este instrumento tem força de título executivo extrajudicial, nos termos do art. 784, inc. III, do Código de Processo Civil, obrigando aos seus sucessores até a satisfação completa do acordado neste instrumento.
11.3 - A oferta de serviços pela CONTRATADA não possui qualquer relação com as atividades da Concessionária de Distribuição de Gás do Rio de Janeiro, não sendo esta responsável por qualquer problema referente a equipamentos, obras e serviços realizados e corte no fornecimento.`;

  const c12 = `12.1 - Em caso de acidentes o organismo possui seguro contra terceiros para ressarcir seus clientes de qualquer dano causado à propriedade do cliente durante a inspeção, porém não se responsabiliza por danos causados em peças e/ou equipamentos do veículo decorrentes dos testes.`;

  const c13 = `13.1 - Elege-se o foro do domicílio do(a) CONTRATANTE para dirimir os litígios oriundos do presente Contrato.`;

  const clauses = [
    { heading: 'CLÁUSULA 1ª – OBJETO', body: c1 },
    { heading: 'CLÁUSULA 2ª – DAS CARACTERÍSTICAS DA INSPEÇÃO PERIÓDICA DE GÁS', body: c2 },
    { heading: 'CLÁUSULA 3ª – VIGÊNCIA', body: c3 },
    { heading: 'CLÁUSULA 4ª – PAGAMENTO', body: c4 },
    { heading: 'CLÁUSULA 5ª – OBRIGAÇÕES DA CONTRATADA', body: c5 },
    { heading: 'CLÁUSULA 6ª – OBRIGAÇÕES DO CONTRATANTE', body: c6 },
    { heading: 'CLÁUSULA 7ª – GARANTIA', body: c7 },
    { heading: 'CLÁUSULA 8ª – RESCISÃO', body: c8 },
    { heading: 'CLÁUSULA 9ª – EXCLUDENTES', body: c9 },
    { heading: 'CLÁUSULA 10ª – CONFIDENCIALIDADE E IMPARCIALIDADE', body: c10 },
    { heading: 'CLÁUSULA 11ª – DISPOSIÇÕES GERAIS', body: c11 },
    { heading: 'CLÁUSULA 12ª – SEGURO', body: c12 },
    { heading: 'CLÁUSULA 13ª – FORO', body: c13 },
  ];
  return { clauses };
}
