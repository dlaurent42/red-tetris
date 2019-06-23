const isEmpty = (any) => {
  if (typeof any === 'undefined') return true;
  if (!any) return true;
  if (any.length === 0) return true;
  if (JSON.stringify(any) === '{}') return true;
  return false;
};

export default isEmpty;
