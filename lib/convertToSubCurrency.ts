
function convertToSubCurrency(amount: number, subCurrency: number): number {
  return Math.floor(amount * subCurrency);
}
export default convertToSubCurrency;