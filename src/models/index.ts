export enum FOOD_TYPE {
  PASTRIES = 1,
  GROCERIES = 2,
  MEALS = 3,
  OTHERS = 4
}

export enum DIET_TYPE {
  VEGAN = 1,
  VEGETARIAN = 2
}

export enum CURRENCY {
  BGN = 'bgn',
  EUR = 'eur',
  RON = 'ron'
}

export const BE_CURRENCY_TO_CURRENCY_MAPPER : {[key in string]: CURRENCY} = {
  'RON': CURRENCY.RON,
  'BGN': CURRENCY.BGN,
  'EUR': CURRENCY.EUR,
};
