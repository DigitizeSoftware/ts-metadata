import {isJsonDate} from "../validation/simple-types";

export function parseJsonDate(jsonDate: string | null): Date | null {
    if (jsonDate == null) {
        return null;
    }
    else if (isJsonDate(jsonDate)) {
        return new Date(jsonDate);
    }
    else {
        throw new Error(`${JSON.stringify(jsonDate)} is not JSON date`);
    }
}

