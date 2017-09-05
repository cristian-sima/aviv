// @flow

const getShouldModify = (lists : any, id : string) => {
  for (const list of lists) {
    if (list.includes(id)) {
      return true;
    }
  }

  return false;
};

export default getShouldModify;
