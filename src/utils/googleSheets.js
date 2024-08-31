import { GoogleSpreadsheet } from 'google-spreadsheet';

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SHEETS_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SHEETS_PRIVATE_KEY;

export const submitRecipe = async (recipe) => {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  await sheet.addRow({
    'Recipe Name': recipe.name,
    'Ingredients': recipe.ingredients,
    'Preparation Steps': recipe.steps,
    'Game Type': recipe.gameType,
    'Cooking Method': recipe.cookingMethod,
    'Cooking/Preparation Time': recipe.cookingTime,
  });
};
