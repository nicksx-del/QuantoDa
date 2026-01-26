declare module 'abacatepay' {
    export class AbacatePay {
        constructor(apiKey: string);
        billing: {
            create(data: any): Promise<any>;
        };
    }
}
