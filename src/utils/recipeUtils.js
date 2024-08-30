export const gameTypes = [
  'Deer', 'Elk', 'Moose', 'Wild Boar', 'Duck', 'Pheasant', 'Quail', 'Turkey', 'Rabbit', 'Other'
];

export const cookingMethods = [
  'Grilling', 'Roasting', 'Smoking', 'Frying', 'Braising', 'Slow Cooking', 'Sous Vide', 'Other'
];

export const formatRating = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
};
