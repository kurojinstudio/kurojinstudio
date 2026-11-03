const SPREADSHEET_ID = "1FYt-1w5OuDJ6s9zA7Kg0CdV1rAbbVSYO7ar2NFsdIaM";
const SHEET_NAME = "Sheet1";

function doGet() {
  return jsonResponse({ ok: true, service: "contact-form" });
}

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];

    if (!sheet) {
      throw new Error("No sheet tab found in the spreadsheet");
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.projectType || "",
      data.budget || "",
      data.message || "",
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
