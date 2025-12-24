
export interface ILanguageModelService {
    generate(input: any): Promise<string>;
}
