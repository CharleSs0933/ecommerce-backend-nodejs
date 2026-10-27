import _ from "lodash";
import { Types } from "mongoose";

export function convertToObjectId(id) {
  return new Types.ObjectId(id);
}

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

export function removeUndefinedObject(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null) {
      delete obj[key];
    }
  });

  return obj;
}

export function updateNestedObjectParser(obj, prefix = "") {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, updateNestedObjectParser(value, path));
    } else {
      result[path] = value;
    }
  }

  return result;
}
