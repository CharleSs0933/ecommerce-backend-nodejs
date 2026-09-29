import _ from "lodash";

export function getInfoData({ fields = [], object = {} }) {
  return _.pick(object, fields);
}
