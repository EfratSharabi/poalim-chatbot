export interface ChatAnswerPending {
    senderId: string;
    questionId: string;
    mode: 'on' | 'off';
}
