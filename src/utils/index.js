import _ from "lodash";

export function getInfoData({ fields = [], object = {} }) {
  return _.pick(object, fields);
}

// ['a', 'b', 'c'] => { a: 1, b: 1, c: 1 }
export function getSelectData(select = []) {
  return Object.fromEntries(select.map((item) => [item, 1]));
}

// ['a', 'b', 'c'] => { a: 0, b: 0, c: 0 }
export function unGetSelectData(select = []) {
  return Object.fromEntries(select.map((item) => [item, 0]));
}
