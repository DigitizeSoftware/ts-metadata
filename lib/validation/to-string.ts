import {isDate} from "./simple-types";

export function toString(value: any) {
    const type = typeof value;
    switch (type) {
        case "object":
            if (value === null) {
                return "null";
            }
            else if (isDate(value)) {
                return "Date";
            }
            else if (Array.isArray(value)) {
                return "Array";
            }
            else {
                return type;
            }
        default:
            return type;
    }
}
