import {Shape} from "./types";
import {getPayloadShape} from "./payload-converter";
import {validateArrayType, validateObject} from "../validation/validate-object";

export function payloadValidator<T>(recordShape: Shape<T>) {
    const payloadShape = getPayloadShape(recordShape);

    return (payload: any) => validateObject(payload, payloadShape);
}

export function payloadArrayValidator<T>(recordShape: Shape<T>) {
    const payloadShape = getPayloadShape(recordShape);

    return (payloadArr: any) => validateArrayType(payloadArr, payloadShape);
}
