const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { GOOGLE_SHEETS_ID, GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY } = process.env;

  try {
    const recipe = JSON.parse(event.body);
    const doc = new GoogleSpreadsheet(GOOGLE_SHEETS_ID);

    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
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

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Recipe submitted successfully!' }),
    };
  } catch (error) {
    console.error('Error submitting recipe:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit recipe' }),
    };
  }
};
