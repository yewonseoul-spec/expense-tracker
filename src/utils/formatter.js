export const formatMoney = (amount, currencyCode, rate = 1500) => {
  let finalAmount = amount;

  if (currencyCode === 'USD') {
    finalAmount = amount / rate;
  }

  return new Intl.NumberFormat(currencyCode === 'KRW' ? 'ko-KR' : 'en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(finalAmount);
};
