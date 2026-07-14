/**
 * PDF Report Generator — Rapport d'Analyse Immobilière
 *
 * Generates a professional French-language PDF from the property statistics dashboard.
 * Uses jsPDF's built-in Helvetica (WinAnsiEncoding) which supports all French
 * accented characters (é, è, ê, ë, à, â, ç, ù, û, î, ô, etc.).
 *
 * EMOJIS are NEVER used — they fall outside WinAnsiEncoding and corrupt glyphs.
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/* ═══════════════════════════════════════════════════════════════════════════════
   COLOUR PALETTE — matches the web app (#023927 / #0a4d3a / #c8a97e)
   ═══════════════════════════════════════════════════════════════════════════════ */
type RGB = [number, number, number];

const C = {
  green:       [2, 57, 39]     as RGB,
  greenMed:    [10, 77, 58]    as RGB,
  greenLight:  [220, 240, 232] as RGB,
  greenPale:   [237, 247, 242] as RGB,
  gold:        [200, 169, 126] as RGB,
  goldDark:    [168, 139, 96]  as RGB,
  goldLight:   [245, 238, 225] as RGB,
  white:       [255, 255, 255] as RGB,
  ivory:       [253, 251, 247] as RGB,
  gray50:      [249, 250, 251] as RGB,
  gray100:     [243, 244, 246] as RGB,
  gray200:     [229, 231, 235] as RGB,
  gray300:     [209, 213, 219] as RGB,
  gray400:     [156, 163, 175] as RGB,
  gray500:     [107, 114, 128] as RGB,
  gray600:     [75, 85, 99]    as RGB,
  gray700:     [55, 65, 81]    as RGB,
  gray800:     [31, 41, 55]    as RGB,
  gray900:     [17, 24, 39]    as RGB,
  blue:        [59, 130, 246]  as RGB,
  blueLight:   [239, 246, 255] as RGB,
  purple:      [139, 92, 246]  as RGB,
  purpleLight: [245, 243, 255] as RGB,
  red:         [239, 68, 68]   as RGB,
  redLight:    [254, 242, 242] as RGB,
  emerald:     [16, 185, 129]  as RGB,
  emeraldLight:[236, 253, 245] as RGB,
  amber:       [245, 158, 11]  as RGB,
  amberLight:  [255, 251, 235] as RGB,
};

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */
export interface PdfPropertyData {
  title: string;
  location: string;
  price: number;
  currency: string;
  surface: number;
  bedrooms: number;
  engagementScore: number;
}

export interface PdfMetrics {
  views: number;
  inquiries: number;
  favorites: number;
  clicks: number;
  totalInteractions: number;
  engagementRate: number;
  inquiryRate: number;
}

export interface PdfChartRefs {
  trendChartRef: React.RefObject<HTMLDivElement | null>;
  pieChartRef: React.RefObject<HTMLDivElement | null>;
  performanceRef: React.RefObject<HTMLDivElement | null>;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LAYOUT CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════════ */
const PW   = 210;
const PH   = 297;
const ML   = 20;
const MR   = 20;
const CW   = PW - ML - MR;   // 170
const CX   = PW / 2;         // 105
const HDR  = 28;

/* ═══════════════════════════════════════════════════════════════════════════════
   LOW-LEVEL HELPERS
   ═══════════════════════════════════════════════════════════════════════════════ */

function sf(d: jsPDF, c: RGB) { d.setFillColor(c[0], c[1], c[2]); }
function st(d: jsPDF, c: RGB) { d.setTextColor(c[0], c[1], c[2]); }
function ss(d: jsPDF, c: RGB) { d.setDrawColor(c[0], c[1], c[2]); }

function rfill(d: jsPDF, x: number, y: number, w: number, h: number, r: number, c: RGB) {
  sf(d, c); d.roundedRect(x, y, w, h, r, r, 'F');
}

function rfs(d: jsPDF, x: number, y: number, w: number, h: number, r: number, fill: RGB, stroke: RGB, lw = 0.25) {
  sf(d, fill); ss(d, stroke); d.setLineWidth(lw);
  d.roundedRect(x, y, w, h, r, r, 'FD');
}

/** Measure how tall a block of text will be WITHOUT drawing it. */
function measureText(d: jsPDF, str: string, maxW: number, size: number, lineH?: number): number {
  const lines = d.splitTextToSize(str, maxW);
  return lines.length * (lineH ?? size * 0.45);
}

/** Render text on the page. Does NOT return any measurement. */
function writeText(
  d: jsPDF, str: string, x: number, y: number,
  opts?: {
    size?: number;
    style?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    color?: RGB;
    align?: 'left' | 'center' | 'right';
    maxW?: number;
    lineH?: number;
  }
) {
  const sz   = opts?.size   ?? 10;
  const styl = opts?.style  ?? 'normal';
  d.setFontSize(sz);
  d.setFont('helvetica', styl);
  if (opts?.color) st(d, opts.color);
  const lines = opts?.maxW ? d.splitTextToSize(str, opts.maxW) : [str];
  d.text(lines, x, y, { align: opts?.align ?? 'left' });
}

/** Render raw lines (already split) on the page. */
function writeLines(d: jsPDF, lines: string[], x: number, y: number, size: number, color: RGB) {
  d.setFontSize(size);
  d.setFont('helvetica', 'normal');
  st(d, color);
  d.text(lines, x, y);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   REUSABLE CHROME
   ═══════════════════════════════════════════════════════════════════════════════ */

function pageHeader(d: jsPDF, title: string) {
  sf(d, C.green);  d.rect(0, 0, PW, HDR, 'F');
  sf(d, C.gold);   d.rect(0, HDR, PW, 1.2, 'F');
  writeText(d, title, CX, 17, { size: 13, style: 'bold', color: C.white, align: 'center' });
}

function pageFooter(d: jsPDF, num: number) {
  ss(d, C.gold); d.setLineWidth(0.3);
  d.line(ML, PH - 14, PW - MR, PH - 14);
  writeText(d, `Page ${num}`, CX, PH - 9, { size: 7, color: C.gray400, align: 'center' });
}

function nextPage(d: jsPDF, y: number, needed: number, footerNum: number): number {
  if (y + needed > PH - 25) {
    pageFooter(d, footerNum);
    d.addPage();
    return 20;
  }
  return y;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CHART CAPTURE
   ═══════════════════════════════════════════════════════════════════════════════ */

async function captureEl(el: HTMLElement | null): Promise<string | null> {
  if (!el) return null;
  try {
    const c = await html2canvas(el, {
      scale: 2, useCORS: true, allowTaint: true,
      backgroundColor: '#ffffff', logging: false,
    });
    return c.toDataURL('image/png', 1.0);
  } catch { return null; }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE 1 — COVER
   ═══════════════════════════════════════════════════════════════════════════════ */

function pageCover(d: jsPDF, p: PdfPropertyData, date: string) {
  sf(d, C.green); d.rect(0, 0, PW, PH, 'F');
  sf(d, C.gold);  d.rect(0, 0, PW, 5, 'F');

  d.setGState(new d.GState({ opacity: 0.06 }));
  sf(d, C.gold);
  d.circle(170, 55, 70, 'F');
  d.circle(35, 240, 45, 'F');
  d.setGState(new d.GState({ opacity: 1 }));

  writeText(d, 'SQUARE METER', CX, 30, { size: 11, style: 'bold', color: C.gold, align: 'center' });
  writeText(d, 'ANALYSE IMMOBILI\u00c8RE', CX, 37, { size: 7, color: C.gold, align: 'center' });

  ss(d, C.gold); d.setLineWidth(0.6);
  d.line(CX - 28, 43, CX + 28, 43);

  writeText(d, "RAPPORT D'ANALYSE", CX, 100, { size: 28, style: 'bold', color: C.white, align: 'center' });
  writeText(d, 'IMMOBILI\u00c8RE', CX, 115, { size: 28, style: 'bold', color: C.white, align: 'center' });
  writeText(d, 'Performance & Statistiques D\u00e9taill\u00e9es', CX, 132, { size: 10, color: C.gold, align: 'center' });

  // centred property card
  const cardW = 120;
  const cardX = (PW - cardW) / 2;
  const cardY = 150;
  const cardH = 60;
  rfs(d, cardX, cardY, cardW, cardH, 5, [10, 30, 22], C.gold);

  writeText(d, p.title, CX, cardY + 16, { size: 14, style: 'bold', color: C.white, align: 'center', maxW: cardW - 16 });
  writeText(d, p.location, CX, cardY + 28, { size: 10, color: C.gold, align: 'center' });

  const detY = cardY + 42;
  const third = cardW / 3;
  writeText(d, `Prix : ${p.price.toLocaleString('fr-FR')} ${p.currency}`,
    cardX + third * 0.5, detY, { size: 8, color: C.gray300, align: 'center' });
  writeText(d, `Surface : ${p.surface} m\u00b2`,
    cardX + third * 1.5, detY, { size: 8, color: C.gray300, align: 'center' });
  writeText(d, `Chambres : ${p.bedrooms}`,
    cardX + third * 2.5, detY, { size: 8, color: C.gray300, align: 'center' });

  writeText(d, `Rapport g\u00e9n\u00e9r\u00e9 le ${date}`, CX, 250, { size: 9, color: C.gray400, align: 'center' });

  sf(d, C.gold); d.rect(0, PH - 5, PW, 5, 'F');
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE 2 — KPIs + EXPLANATIONS
   ═══════════════════════════════════════════════════════════════════════════════ */

function pageKpis(d: jsPDF, p: PdfPropertyData, m: PdfMetrics) {
  pageHeader(d, 'INDICATEURS CL\u00c9S DE PERFORMANCE');
  let y = 42;

  const intro = `Ce tableau r\u00e9sume les indicateurs essentiels de la performance de votre propri\u00e9t\u00e9 << ${p.title} >>. Chaque m\u00e9trique refl\u00e8te le comportement des visiteurs et leur niveau d\u2019int\u00e9r\u00eat pour votre annonce.`;
  y += measureText(d, intro, CW, 9, 4.5);
  writeText(d, intro, ML, y - measureText(d, intro, CW, 9, 4.5), { size: 9, color: C.gray600, maxW: CW, lineH: 4.5 });
  y += 10;

  // KPI cards 2x2
  const gap = 8;
  const cw  = (CW - gap) / 2;
  const ch  = 40;
  const x1  = ML;
  const x2  = ML + cw + gap;

  const kpis = [
    { label: 'VUES TOTALES',     val: m.views.toLocaleString('fr-FR'),            sub: 'Consultations compl\u00e8tes de l\u2019annonce',         accent: C.blue,    bg: C.blueLight    },
    { label: 'DEMANDES',          val: m.inquiries.toLocaleString('fr-FR'),         sub: 'Demandes de renseignement directes',                  accent: C.purple,  bg: C.purpleLight  },
    { label: 'FAVORIS',           val: m.favorites.toLocaleString('fr-FR'),         sub: 'Ajouts en liste de souhaits',                        accent: C.red,     bg: C.redLight     },
    { label: 'INTERACTIONS',      val: m.totalInteractions.toLocaleString('fr-FR'), sub: 'Total des actions engag\u00e9es par les visiteurs',     accent: C.emerald, bg: C.emeraldLight },
  ];

  kpis.forEach((k, i) => {
    const cx = i % 2 === 0 ? x1 : x2;
    const cy = y + Math.floor(i / 2) * (ch + gap);
    rfs(d, cx, cy, cw, ch, 4, C.white, C.gray200);
    sf(d, k.accent); d.roundedRect(cx, cy, cw, 3, 4, 4, 'F'); d.rect(cx, cy + 2, cw, 1, 'F');
    writeText(d, k.label, cx + cw / 2, cy + 11, { size: 7, style: 'bold', color: C.gray500, align: 'center' });
    writeText(d, k.val,   cx + cw / 2, cy + 22, { size: 20, style: 'bold', color: C.gray900, align: 'center' });
    writeText(d, k.sub,   cx + cw / 2, cy + 30, { size: 7, color: C.gray400, align: 'center', maxW: cw - 8 });
  });

  y += 2 * (ch + gap) + 14;

  // ── explanation cards (measure FIRST, draw box, THEN render text) ──
  const exps = [
    {
      title: 'Que mesure \u00ab Vues Totales \u00bb ?',
      body:  `Le nombre de fois o\u00f9 votre annonce a \u00e9t\u00e9 consult\u00e9e. Une vue correspond \u00e0 l\u2019ouverture compl\u00e8te de la page de votre propri\u00e9t\u00e9. C\u2019est un indicateur direct de la visibilit\u00e9 de votre annonce sur le march\u00e9 immobilier.`,
      accent: C.blue, bg: C.blueLight,
    },
    {
      title: 'Que mesure \u00ab Taux d\u2019Engagement \u00bb ?',
      body:  `Avec un score de ${m.engagementRate.toFixed(1)}%, ce taux calcule le ratio entre les actions des visiteurs (favoris, demandes, clics) et le nombre total de vues. Un taux \u00e9lev\u00e9 signale un fort int\u00e9r\u00eat pour votre propri\u00e9t\u00e9 et un positionnement attractif sur le march\u00e9.`,
      accent: C.gold, bg: C.goldLight,
    },
    {
      title: 'Que mesure \u00ab Taux de Conversion \u00bb ?',
      body:  `Avec ${m.inquiryRate.toFixed(1)}%, ce taux mesure la proportion de visiteurs qui transforment leur consultation en demande de renseignement. C\u2019est le KPI le plus directement li\u00e9 \u00e0 la g\u00e9n\u00e9ration de leads commerciaux et \u00e0 la finalisation de ventes.`,
      accent: C.purple, bg: C.purpleLight,
    },
  ];

  for (const exp of exps) {
    const bodyH = measureText(d, exp.body, CW - 18, 8, 3.8);
    const eh = Math.max(36, 16 + bodyH + 4);
    y = nextPage(d, y, eh, d.getNumberOfPages());
    rfill(d, ML, y, CW, eh, 3, exp.bg);
    sf(d, exp.accent); d.rect(ML, y + 3, 2, eh - 6, 'F');
    writeText(d, exp.title, ML + 10, y + 9, { size: 9, style: 'bold', color: exp.accent });
    writeText(d, exp.body,  ML + 10, y + 15, { size: 8, color: C.gray600, maxW: CW - 18, lineH: 3.8 });
    y += eh + 8;
  }

  pageFooter(d, d.getNumberOfPages());
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE 3 — TREND CHART + INTERPRETATION
   ═══════════════════════════════════════════════════════════════════════════════ */

function pageTrend(d: jsPDF, img: string | null, m: PdfMetrics) {
  pageHeader(d, 'TENDANCES DE PERFORMANCE');
  let y = 42;

  writeText(d, '\u00c9volution des vues, demandes et clics sur la p\u00e9riode s\u00e9lectionn\u00e9e.', ML, y, { size: 9, color: C.gray500, maxW: CW });
  y += 10;

  if (img) {
    const ih = 82;
    y = nextPage(d, y, ih + 30, d.getNumberOfPages());
    rfill(d, ML - 2, y - 2, CW + 4, ih + 4, 3, C.gray50);
    d.addImage(img, 'PNG', ML, y, CW, ih);
    y += ih + 12;
  } else {
    rfill(d, ML, y, CW, 50, 3, C.gray100);
    writeText(d, 'Graphique non disponible', CX, y + 28, { size: 10, style: 'italic', color: C.gray400, align: 'center' });
    y += 60;
  }

  // legend
  const legends = [{ c: C.blue, l: 'Vues' }, { c: C.purple, l: 'Demandes' }, { c: C.emerald, l: 'Clics' }];
  let lx = ML;
  for (const lg of legends) {
    sf(d, lg.c); d.circle(lx + 3, y, 2.5, 'F');
    writeText(d, lg.l, lx + 8, y + 1, { size: 8, color: C.gray600 });
    lx += 40;
  }
  y += 16;

  // ── INTERPRETATION box — measure text first, draw box, THEN render text ──
  const body = `Ce graphique combin\u00e9 pr\u00e9sente l\u2019\u00e9volution temporelle des principales m\u00e9triques. La zone bleue repr\u00e9sente les vues, les barres violettes les demandes, et la ligne verte les clics. Avec ${m.views} vues et ${m.totalInteractions} interactions, ${m.engagementRate > 10
    ? 'votre propri\u00e9t\u00e9 affiche une dynamique positive sur le march\u00e9.'
    : 'des leviers d\u2019optimisation existent pour accro\u00eetre l\u2019engagement.'}`;

  const bodyMaxW = CW - 16;
  const bodyLineH = 3.8;
  const bodyLines = d.splitTextToSize(body, bodyMaxW);
  const bodyTextH = bodyLines.length * bodyLineH;
  const boxH = 14 + bodyTextH + 8;

  y = nextPage(d, y, boxH, d.getNumberOfPages());

  // 1. Draw the box
  rfs(d, ML, y, CW, boxH, 3, C.greenPale, C.green);
  // 2. Render title ON TOP
  writeText(d, 'INTERPR\u00c9TATION DES R\u00c9SULTATS', ML + 8, y + 8, { size: 9, style: 'bold', color: C.green });
  // 3. Render body text ON TOP
  writeLines(d, bodyLines, ML + 8, y + 14, 8, C.gray600);

  y += boxH;
  pageFooter(d, d.getNumberOfPages());
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE 4 — ENGAGEMENT ANALYSIS
   ═══════════════════════════════════════════════════════════════════════════════ */

function pageEngagement(d: jsPDF, m: PdfMetrics, score: number, pieImg: string | null, perfImg: string | null) {
  pageHeader(d, "ANALYSE DE L'ENGAGEMENT");
  let y = 42;

  const intro = `L\u2019engagement mesure la qualit\u00e9 de l\u2019interaction des visiteurs avec votre annonce. Un score \u00e9lev\u00e9 indique que votre propri\u00e9t\u00e9 suscite un int\u00e9r\u00eat fort et d\u00e9clenche des actions concr\u00e8tes de la part des acheteurs potentiels.`;
  y += measureText(d, intro, CW, 9, 4.5);
  writeText(d, intro, ML, y - measureText(d, intro, CW, 9, 4.5), { size: 9, color: C.gray600, maxW: CW, lineH: 4.5 });
  y += 12;

  // Two columns
  const half = (CW - 8) / 2;

  rfs(d, ML, y, half, 68, 3, C.ivory, C.gray200);
  writeText(d, 'R\u00c9PARTITION DES INTERACTIONS', ML + half / 2, y + 7, { size: 7, style: 'bold', color: C.green, align: 'center' });
  if (pieImg) d.addImage(pieImg, 'PNG', ML + 4, y + 10, half - 8, 54);
  else writeText(d, 'N/A', ML + half / 2, y + 40, { size: 9, style: 'italic', color: C.gray400, align: 'center' });

  const px = ML + half + 8;
  rfs(d, px, y, half, 68, 3, C.green, C.greenMed);
  writeText(d, 'INDICE DE PERFORMANCE', px + half / 2, y + 7, { size: 7, style: 'bold', color: C.gold, align: 'center' });
  if (perfImg) d.addImage(perfImg, 'PNG', px + 4, y + 10, half - 8, 54);
  else writeText(d, 'N/A', px + half / 2, y + 40, { size: 9, style: 'italic', color: C.gray300, align: 'center' });

  y += 78;

  // Score summary
  rfs(d, ML, y, CW, 28, 3, C.white, C.gold);
  writeText(d, `Score de performance : ${score} / 100`, ML + 8, y + 10, { size: 10, style: 'bold', color: C.gray900 });
  const pos = score > 70 ? 'Top 10% \u2014 Excellente performance' : score > 40 ? 'Top 40% \u2014 Bonne performance' : 'Performance moyenne \u2014 Potentiel d\u2019am\u00e9lioration';
  writeText(d, `Position march\u00e9 : ${pos}`, ML + 8, y + 17, { size: 8, color: C.gray600 });
  writeText(d, `Taux de conversion vue > demande : ${m.inquiryRate.toFixed(1)}%`, ML + 8, y + 24, { size: 8, color: C.green });
  y += 38;

  // ── Explanation blocks — measure FIRST, draw box, THEN render text ONCE ──
  const exps = [
    {
      title: 'R\u00e9partition des Interactions',
      body:  `Le graphique circulaire montre la proportion relative des Demandes (${m.inquiries}), Favoris (${m.favorites}) et Clics (${m.clicks}). Une bonne r\u00e9partition avec des demandes significatives indique un fort potentiel de conversion commerciale. Analysez l\u2019\u00e9volution de ces proportions pour mesurer l\u2019impact de vos modifications d\u2019annonce.`,
      accent: C.purple, bg: C.purpleLight,
    },
    {
      title: 'Taux d\u2019Engagement Global',
      body:  `Avec ${m.engagementRate.toFixed(1)}%, ce taux mesure la probabilit\u00e9 qu\u2019un visiteur interagisse avec votre annonce apr\u00e8s l\u2019avoir consult\u00e9e. La moyenne du secteur se situe entre 5% et 15%. Votre performance ${m.engagementRate > 15 ? 'd\u00e9passe largement' : m.engagementRate > 5 ? 'est conforme \u00e0' : 'est inf\u00e9rieure \u00e0'} la moyenne. Un taux sup\u00e9rieur \u00e0 15% positionne votre annonce parmi les meilleures du march\u00e9.`,
      accent: C.emerald, bg: C.emeraldLight,
    },
    {
      title: 'Impact sur la Vente',
      body:  'Un engagement \u00e9lev\u00e9 signifie que votre annonce attire des acheteurs qualifi\u00e9s. Les interactions mesur\u00e9es (favoris, demandes, clics) sont des signaux d\u2019intention d\u2019achat r\u00e9els, bien au-del\u00e0 d\u2019une simple curiosit\u00e9. Optimisez vos photos, descriptions et prix pour maximiser ces indicateurs et acc\u00e9l\u00e9rer la finalisation de votre transaction.',
      accent: C.gold, bg: C.goldLight,
    },
  ];

  for (const exp of exps) {
    const bodyH = measureText(d, exp.body, CW - 18, 8, 3.8);
    const eh = Math.max(38, 16 + bodyH + 4);
    y = nextPage(d, y, eh, d.getNumberOfPages());
    // draw bg THEN text — ONCE
    rfill(d, ML, y, CW, eh, 3, exp.bg);
    sf(d, exp.accent); d.rect(ML, y + 3, 2, eh - 6, 'F');
    writeText(d, exp.title, ML + 10, y + 9, { size: 9, style: 'bold', color: exp.accent });
    writeText(d, exp.body,  ML + 10, y + 15, { size: 8, color: C.gray600, maxW: CW - 18, lineH: 3.8 });
    y += eh + 10;
  }

  pageFooter(d, d.getNumberOfPages());
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE 5 — SUMMARY & RECOMMENDATIONS
   ═══════════════════════════════════════════════════════════════════════════════ */

function pageSummary(d: jsPDF, p: PdfPropertyData, m: PdfMetrics) {
  pageHeader(d, 'SYNTH\u00c8SE & RECOMMANDATIONS');
  let y = 42;

  const intro = `Voici la synth\u00e8se de la performance de votre propri\u00e9t\u00e9 << ${p.title} >> situ\u00e9e \u00e0 ${p.location}. Ce rapport offre une vision claire des interactions enregistr\u00e9es et permet d\u2019identifier les axes d\u2019am\u00e9lioration prioritaires.`;
  y += measureText(d, intro, CW, 9, 4.5);
  writeText(d, intro, ML, y - measureText(d, intro, CW, 9, 4.5), { size: 9, color: C.gray600, maxW: CW, lineH: 4.5 });
  y += 12;

  const findings = [
    {
      label: 'Volume de trafic',
      val:   `${m.views} vues au total`,
      detail: m.views > 50
        ? 'Un trafic \u00e9lev\u00e9 t\u00e9moigne d\u2019une bonne visibilit\u00e9 et d\u2019un positionnement favorable sur les moteurs de recherche.'
        : 'Le trafic peut \u00eatre am\u00e9lior\u00e9 par une meilleure mise en avant, des mots-cl\u00e9s cibl\u00e9s et des photos de qualit\u00e9.',
    },
    {
      label: 'Qualit\u00e9 des leads',
      val:   `${m.inquiries} demandes g\u00e9n\u00e9r\u00e9es`,
      detail: m.inquiries > 5
        ? 'D\u2019excellents leads qualifi\u00e9s. Votre annonce suscite un int\u00e9r\u00eat commercial r\u00e9el et des demandes concr\u00e8tes.'
        : 'Augmentez la visibilit\u00e9 et affinez votre description pour g\u00e9n\u00e9rer davantage de demandes qualifi\u00e9es.',
    },
    {
      label: 'Int\u00e9r\u00eat manifest\u00e9',
      val:   `${m.favorites} favoris enregistr\u00e9s`,
      detail: 'Les favoris indiquent un int\u00e9r\u00eat durable et un retour probable. Les visiteurs qui ajoutent en favoris sont souvent en phase finale de d\u00e9cision.',
    },
    {
      label: 'Score d\u2019engagement',
      val:   `${m.engagementRate.toFixed(1)}% de taux`,
      detail: m.engagementRate > 10
        ? 'Un excellent niveau d\u2019engagement global. Votre annonce se distingue par sa capacit\u00e9 \u00e0 retenir l\u2019attention.'
        : 'Des ajustements sur l\u2019annonce (photos, description, prix) pourraient am\u00e9liorer significativement ce taux.',
    },
  ];

  for (const f of findings) {
    const fh = 26;
    y = nextPage(d, y, fh + 5, d.getNumberOfPages());
    rfs(d, ML, y, CW, fh, 3, C.white, C.gray200);
    sf(d, C.green); d.rect(ML, y + 3, 2.5, fh - 6, 'F');
    writeText(d, `${f.label}  \u2014  ${f.val}`, ML + 8, y + 10, { size: 9, style: 'bold', color: C.gray900 });
    writeText(d, f.detail, ML + 8, y + 17, { size: 8, color: C.gray500, maxW: CW - 14 });
    y += fh + 5;
  }

  y += 8;

  // Recommendations — measure total height first
  const recs = [
    '1.  Optimisez vos photos : Les annonces avec 10+ photos haute r\u00e9solution g\u00e9n\u00e8rent en moyenne 2x plus de vues et suscitent davantage de demandes.',
    '2.  Affinez votre description : Mettez en avant les atouts uniques de la propri\u00e9t\u00e9 (lumi\u00e8re naturelle, vue panoramique, proximit\u00e9 des commerces).',
    '3.  Prix comp\u00e9titif : Analysez les propri\u00e9t\u00e9s similaires dans votre quartier pour positionner votre prix de fa\u00e7on juste et attractive.',
    '4.  R\u00e9activit\u00e9 : R\u00e9pondez aux demandes dans les 2 heures pour maximiser la conversion. Les acheteurs actifs contactent plusieurs annonces.',
  ];

  const recLineH = 4;
  const recLinesArr: string[][] = [];
  let recTotalH = 0;
  for (const r of recs) {
    const lines = d.splitTextToSize(r, CW - 18);
    recLinesArr.push(lines);
    recTotalH += lines.length * recLineH + 3;
  }
  const recBoxH = 14 + recTotalH + 4;

  y = nextPage(d, y, recBoxH, d.getNumberOfPages());
  rfs(d, ML, y, CW, recBoxH, 3, C.goldLight, C.gold);
  writeText(d, 'RECOMMANDATIONS', ML + 8, y + 9, { size: 10, style: 'bold', color: C.goldDark });

  let ry = y + 18;
  for (const lines of recLinesArr) {
    writeLines(d, lines, ML + 8, ry, 8, C.gray700);
    ry += lines.length * recLineH + 3;
  }

  y += recBoxH + 10;

  pageFooter(d, d.getNumberOfPages());
  writeText(d, 'Ce rapport est g\u00e9n\u00e9r\u00e9 automatiquement par Square Meter. Les donn\u00e9es refl\u00e8tent les interactions enregistr\u00e9es \u00e0 la date de g\u00e9n\u00e9ration.', ML, PH - 20, { size: 6, style: 'italic', color: C.gray400, maxW: CW });
  writeText(d, 'Les statistiques ne constituent pas une garantie de performance future.', ML, PH - 16, { size: 6, style: 'italic', color: C.gray400 });
}

/* ═══════════════════════════════════════════════════════════════════════════════
   BUILD HELPER
   ═══════════════════════════════════════════════════════════════════════════════ */

async function buildDoc(opts: {
  property: PdfPropertyData;
  metrics: PdfMetrics;
  chartRefs: PdfChartRefs;
  engagementScore: number;
}): Promise<{ doc: jsPDF; filename: string }> {
  const { property: p, metrics: m, chartRefs, engagementScore } = opts;
  const d = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const [trendImg, pieImg, perfImg] = await Promise.all([
    captureEl(chartRefs.trendChartRef.current),
    captureEl(chartRefs.pieChartRef.current),
    captureEl(chartRefs.performanceRef.current),
  ]);

  pageCover(d, p, dateStr);
  d.addPage(); pageKpis(d, p, m);
  d.addPage(); pageTrend(d, trendImg, m);
  d.addPage(); pageEngagement(d, m, engagementScore, pieImg, perfImg);
  d.addPage(); pageSummary(d, p, m);

  const safeName = p.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
  const filename = `Rapport_Analyse_${safeName}_${now.toISOString().slice(0, 10)}.pdf`;

  return { doc: d, filename };
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════════════════════════════════════ */

export async function generatePropertyStatsPdf(opts: {
  property: PdfPropertyData; metrics: PdfMetrics; chartRefs: PdfChartRefs; engagementScore: number;
}): Promise<{ blobUrl: string; filename: string }> {
  const { doc, filename } = await buildDoc(opts);
  doc.save(filename);
  const blobUrl = URL.createObjectURL(doc.output('blob'));
  return { blobUrl, filename };
}

export async function buildPropertyStatsPdfBlob(opts: {
  property: PdfPropertyData; metrics: PdfMetrics; chartRefs: PdfChartRefs; engagementScore: number;
}): Promise<{ blobUrl: string; filename: string }> {
  const { doc, filename } = await buildDoc(opts);
  const blobUrl = URL.createObjectURL(doc.output('blob'));
  return { blobUrl, filename };
}

export function downloadPdfBlob(blobUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
