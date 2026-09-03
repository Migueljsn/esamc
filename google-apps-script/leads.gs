/**
 * Escola Santa Angélica — Google Apps Script (Leads)
 *
 * Este script recebe leads de TRÊS páginas diferentes do mesmo site:
 *   - Home (matrícula geral, Infantil ao Médio)      → aba "Leads Matrícula ESA"
 *   - /teste-bolsa (Teste Bolsa, a partir do 2º ano) → aba "Leads Teste Bolsa ESA"
 *   - /masterclass (turma antiga, foco ENEM/R$70)    → aba "Leads ESA MasterClass"
 *
 * A escolha da aba é feita pelo campo `produto` enviado no payload
 * ("matricula", "teste_bolsa" ou "masterclass"). Se vier vazio/desconhecido,
 * cai em "matricula" por padrão.
 *
 * Para publicar uma mudança:
 *   1. Abra a planilha → Extensões → Apps Script.
 *   2. Substitua o conteúdo de Code.gs por este arquivo.
 *   3. Salve. Se já existir uma implantação (Web App) ativa, use
 *      "Implantar → Gerenciar implantações → editar (lápis) → Nova versão"
 *      para manter a MESMA URL (assim não precisa mudar APPS_SCRIPT_URL).
 */

const SPREADSHEET_ID = ""; // preencha só se for script standalone

const SHEET_MATRICULA    = "Leads Matrícula ESA";
const SHEET_TESTE_BOLSA  = "Leads Teste Bolsa ESA";
const SHEET_MASTERCLASS  = "Leads ESA MasterClass";

const HEADERS_MATRICULA = [
  "Data/Hora", "Etapa", "Nome do Responsável", "WhatsApp", "E-mail", "Bairro",
  "Nome do Aluno(a)", "Série Pretendida", "Quando Pretende Matricular",
  "UTM Source", "UTM Medium", "UTM Campaign", "UTM Term", "UTM Content", "UTM ID",
  "URL da Página", "Referrer", "Resolução de Tela", "Viewport",
  "Idioma", "Fuso Horário", "Plataforma", "Tipo de Conexão", "User Agent",
];

const HEADERS_TESTE_BOLSA = [
  "Data/Hora", "Etapa", "Nome do Responsável", "WhatsApp", "E-mail", "Bairro",
  "Nome do Aluno(a)", "Série do Teste", "Quando Pretende Matricular (se aprovado)",
  "UTM Source", "UTM Medium", "UTM Campaign", "UTM Term", "UTM Content", "UTM ID",
  "URL da Página", "Referrer", "Resolução de Tela", "Viewport",
  "Idioma", "Fuso Horário", "Plataforma", "Tipo de Conexão", "User Agent",
];

const HEADERS_MASTERCLASS = [
  "Data/Hora", "Etapa", "Nome", "WhatsApp", "E-mail", "Bairro",
  "Curso Desejado", "Maior Dificuldade no ENEM", "Quando Quer Começar",
  "UTM Source", "UTM Medium", "UTM Campaign", "UTM Term", "UTM Content", "UTM ID",
  "URL da Página", "Referrer", "Resolução de Tela", "Viewport",
  "Idioma", "Fuso Horário", "Plataforma", "Tipo de Conexão", "User Agent",
];

// ─────────────────────────────────────────────────────────────────────────────

const ETAPAS = ["NOVA", "CONTATO FEITO", "VENDA", "PERDIDO"];

// Aplica dropdown de etapa e formatação condicional por cor na coluna 2
function aplicarDropdownEtapa_(sheet, startRow, endRow) {
  const range = sheet.getRange(startRow, 2, endRow - startRow + 1, 1);

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(ETAPAS, true)
    .setAllowInvalid(false)
    .setHelpText("Selecione a etapa da lead")
    .build();
  range.setDataValidation(rule);

  // Formatação condicional por cor para cada etapa
  const cores = {
    "NOVA":          { bg: "#dbeafe", fg: "#1e40af" }, // azul
    "CONTATO FEITO": { bg: "#fef9c3", fg: "#854d0e" }, // amarelo
    "VENDA":         { bg: "#dcfce7", fg: "#166534" }, // verde
    "PERDIDO":       { bg: "#fee2e2", fg: "#991b1b" }, // vermelho
  };

  const fullCol = sheet.getRange(2, 2, 1000, 1);
  // Remove regras anteriores para não duplicar
  const existingRules = sheet.getConditionalFormatRules().filter(
    r => r.getRanges().every(rng => rng.getColumn() !== 2)
  );

  const newRules = ETAPAS.map(etapa => {
    const c = cores[etapa];
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(etapa)
      .setBackground(c.bg)
      .setFontColor(c.fg)
      .setBold(true)
      .setRanges([fullCol])
      .build();
  });

  sheet.setConditionalFormatRules([...existingRules, ...newRules]);
}

// Retorna fórmula HYPERLINK para o número aparecer clicável no Sheets
function whatsappLink_(rawNumber) {
  if (!rawNumber) return "";
  const digits = rawNumber.replace(/\D/g, "");
  // Garante código do país 55 (Brasil)
  const intl = digits.startsWith("55") ? digits : "55" + digits;
  return '=HYPERLINK("https://wa.me/' + intl + '";"' + rawNumber + '")';
}

function getOrCreateSheet_(sheetName, headers) {
  let ss;

  if (SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    const r = sheet.getRange(1, 1, 1, headers.length);
    r.setValues([headers]);
    r.setFontWeight("bold").setBackground("#000000").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, headers.length, 160);
    sheet.setColumnWidth(2, 140); // Etapa um pouco mais estreita

    // Aplica dropdown na coluna Etapa (col 2) para todas as linhas de dados
    aplicarDropdownEtapa_(sheet, 2, 1000);
  }

  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData ? e.postData.contents : "{}");
    const isMasterclass = data.produto === "masterclass";
    const isTesteBolsa  = data.produto === "teste_bolsa";

    const sheet = isMasterclass
      ? getOrCreateSheet_(SHEET_MASTERCLASS, HEADERS_MASTERCLASS)
      : isTesteBolsa
      ? getOrCreateSheet_(SHEET_TESTE_BOLSA, HEADERS_TESTE_BOLSA)
      : getOrCreateSheet_(SHEET_MATRICULA, HEADERS_MATRICULA);

    const row = isMasterclass ? [
      data.timestamp          || new Date().toISOString(),
      "NOVA",
      data.nome               || "",
      whatsappLink_(data.whatsapp),
      data.email              || "",
      data.bairro             || "",
      data.curso              || "",
      data.dificuldade        || "",
      data.quando_comecar     || "",
      data.utm_source         || "",
      data.utm_medium         || "",
      data.utm_campaign       || "",
      data.utm_term           || "",
      data.utm_content        || "",
      data.utm_id             || "",
      data.page_url           || "",
      data.referrer           || "",
      data.screen_resolution  || "",
      data.viewport           || "",
      data.language           || "",
      data.timezone           || "",
      data.platform           || "",
      data.connection_type    || "",
      data.user_agent         || "",
    ] : [
      data.timestamp          || new Date().toISOString(),
      "NOVA",
      data.nome               || "",
      whatsappLink_(data.whatsapp),
      data.email              || "",
      data.bairro             || "",
      data.nome_aluno         || "",
      data.serie              || "",
      data.quando_matricular  || "",
      data.utm_source         || "",
      data.utm_medium         || "",
      data.utm_campaign       || "",
      data.utm_term           || "",
      data.utm_content        || "",
      data.utm_id             || "",
      data.page_url           || "",
      data.referrer           || "",
      data.screen_resolution  || "",
      data.viewport           || "",
      data.language           || "",
      data.timezone           || "",
      data.platform           || "",
      data.connection_type    || "",
      data.user_agent         || "",
    ];

    // Insere logo abaixo do cabeçalho — leads mais recentes sempre no topo
    sheet.insertRowAfter(1);
    sheet.getRange(2, 1, 1, row.length).setValues([row]);

    // Garante que a célula Etapa da nova linha tenha o dropdown
    aplicarDropdownEtapa_(sheet, 2, 2);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Execute manualmente para testar sem precisar de requisição HTTP
function testarMatricula() {
  const e = {
    postData: {
      contents: JSON.stringify({
        produto: "matricula",
        timestamp: new Date().toISOString(),
        nome: "Teste Matrícula", whatsapp: "(86) 99111-2233",
        email: "teste@esa.com", bairro: "Centro",
        nome_aluno: "Aluno Teste", serie: "Ensino Médio",
        quando_matricular: "Este ano letivo",
        utm_source: "google", utm_medium: "cpc", utm_campaign: "matricula2026",
        page_url: "https://escolasantaangelica.com.br", referrer: "https://google.com",
        screen_resolution: "1920x1080", viewport: "1440x900",
        language: "pt-BR", timezone: "America/Fortaleza",
        platform: "MacIntel", connection_type: "4g", user_agent: "Teste",
      }),
    },
  };
  Logger.log(doPost(e).getContent());
}

function testarTesteBolsa() {
  const e = {
    postData: {
      contents: JSON.stringify({
        produto: "teste_bolsa",
        timestamp: new Date().toISOString(),
        nome: "Teste Bolsa", whatsapp: "(86) 99111-2233",
        email: "teste@esa.com", bairro: "Centro",
        nome_aluno: "Aluno Teste", serie: "Ensino Médio",
        quando_matricular: "Este ano letivo",
        utm_source: "google", utm_medium: "cpc", utm_campaign: "testebolsa2026",
        page_url: "https://escolasantaangelica.com.br/teste-bolsa", referrer: "https://google.com",
        screen_resolution: "1920x1080", viewport: "1440x900",
        language: "pt-BR", timezone: "America/Fortaleza",
        platform: "MacIntel", connection_type: "4g", user_agent: "Teste",
      }),
    },
  };
  Logger.log(doPost(e).getContent());
}

function testarMasterclass() {
  const e = {
    postData: {
      contents: JSON.stringify({
        produto: "masterclass",
        timestamp: new Date().toISOString(),
        nome: "Teste Manual", whatsapp: "(86) 99111-2233",
        email: "teste@esa.com", bairro: "Centro",
        curso: "Medicina", dificuldade: "Redação",
        quando_comecar: "Agora mesmo",
        utm_source: "google", utm_medium: "cpc", utm_campaign: "enem2025",
        page_url: "https://esamasterclass.com.br/masterclass", referrer: "https://google.com",
        screen_resolution: "1920x1080", viewport: "1440x900",
        language: "pt-BR", timezone: "America/Fortaleza",
        platform: "MacIntel", connection_type: "4g", user_agent: "Teste",
      }),
    },
  };
  Logger.log(doPost(e).getContent());
}
