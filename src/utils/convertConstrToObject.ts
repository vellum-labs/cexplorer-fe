import { Constr } from "@lucid-evolution/lucid";

export const convertConstrToObject = constr => {
  return {
    fields: constr.fields.map(field => {
      if (field instanceof Constr) {
        return convertConstrToObject(field);
      }

      if (typeof field === "string") {
        return { bytes: field };
      }

      if (Array.isArray(field)) {
        return field.map(subField => {
          if (subField instanceof Constr) {
            return convertConstrToObject(subField);
          }
          return subField;
        });
      }

      return field;
    }),
    constructor: constr.index,
  };
};
