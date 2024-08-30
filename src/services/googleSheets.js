import axios from 'axios';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_ID;

const sheetsApi = axios.create({
  baseURL: 'https://sheets.googleapis.com/v4/spreadsheets',
  params: { key: API_KEY }
});

export async function getSpreadSheetValues(sheetName) {
  try {
    const response = await sheetsApi.get(`/${SPREADSHEET_ID}/values/${sheetName}`);
    return response.data.values;
  } catch (error) {
    console.error('Error fetching spreadsheet values:', error);
    throw error;
  }
}

export async function appendSpreadSheetValues(sheetName, values) {
  try {
    const response = await sheetsApi.post(`/${SPREADSHEET_ID}/values/${sheetName}:append`, {
      values: values
    }, {
      params: {
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error appending spreadsheet values:', error);
    throw error;
  }
}

export async function updateSpreadSheetValues(range, values) {
  try {
    const response = await sheetsApi.put(`/${SPREADSHEET_ID}/values/${range}`, {
      values: values
    }, {
      params: { valueInputOption: 'USER_ENTERED' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating spreadsheet values:', error);
    throw error;
  }
}
