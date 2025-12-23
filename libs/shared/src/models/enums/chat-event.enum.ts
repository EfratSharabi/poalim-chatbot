/**
 * Event types for WebSocket broadcasting
 */
export enum ChatEvent {
  NEW_QUESTION = 'newQuestion',
  NEW_ANSWER = 'newAnswer',
  ANSWER_PENDING = 'answerPending'
}
