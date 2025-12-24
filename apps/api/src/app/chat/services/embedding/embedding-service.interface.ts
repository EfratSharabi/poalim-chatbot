
export interface IEmbeddingService {
    getVector(input: string | string[]): Promise<number[]>;
}
