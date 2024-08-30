import { GoogleAuth } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getAuthToken() {
  const auth = new GoogleAuth({
    scopes: SCOPES
  });
  return auth.getClient();
}

async function fetchFromGoogleSheets(url, options = {}) {
  const authClient = await getAuthToken();
  const response = await authClient.request({ url, ...options });
  return response.data;
}

export async function getSpreadSheetValues({ spreadsheetId, sheetName }) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}`;
  return fetchFromGoogleSheets(url);
}

export async function appendSpreadSheetValues({ spreadsheetId, sheetName, values }) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}:append`;
  const options = {
    method: 'POST',
    params: { valueInputOption: 'USER_ENTERED' },
    data: { values }
  };
  return fetchFromGoogleSheets(url, options);
}

export async function updateSpreadSheetValues({ spreadsheetId, range, values }) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
  const options = {
    method: 'PUT',
    params: { valueInputOption: 'USER_ENTERED' },
    data: { values }
  };
  return fetchFromGoogleSheets(url, options);
}
