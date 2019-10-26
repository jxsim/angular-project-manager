const filterByString = (text, searchedTerm) => {
  return !!searchedTerm ? text.includes(searchedTerm) : true;
};


export const FILTERS = {
  filterByString
};
