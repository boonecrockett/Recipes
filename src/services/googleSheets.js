import { google } from 'googleapis';

const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}

export async function getSpreadSheetValues({ spreadsheetId, auth, sheetName }) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

export async function appendSpreadSheetValues({ spreadsheetId, auth, sheetName, values }) {
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    auth,
    range: sheetName,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values
    },
  });
  return res;
}

export async function updateSpreadSheetValues({ spreadsheetId, auth, range, values }) {
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId,
    auth,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values
    },
  });
  return res;
}
