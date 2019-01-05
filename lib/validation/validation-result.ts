export class ValidationResult {
    private errors: Array<string> = [];

    get valid(): boolean {
        return this.errors.length === 0;
    }

    get error(): string {
        return this.errors.join("\n");
    }

    constructor(message?: string) {
        if (message != null) {
            this.addError(message);
        }
    }

    addError(message: string): this {
        this.errors.push(message);
        return this;
    }
}
