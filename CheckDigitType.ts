export type checkDigitType = {
    isValid: (value: string) => boolean,
    create: (value: string) => string,
    apply: (value: string) => string
}
