import { TestBed } from '@angular/core/testing';
import { ChatAnswer, ChatQuestion } from '@poalim-chatbot/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationService } from '../../shared/services/notification.service';
import { ChatSocketService } from './chat-socket.service';
import { ChatStateService } from './chat-state.service';

class ChatSocketServiceMock {
  onHistory = vi.fn();
  onNewQuestion = vi.fn();
  onNewAnswer = vi.fn();
}

class NotificationServiceMock {
  info = vi.fn();
}

describe('ChatStateService', () => {
  let service: ChatStateService;
  let socket: ChatSocketServiceMock;
  let notification: NotificationServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatStateService,
        { provide: ChatSocketService, useClass: ChatSocketServiceMock },
        { provide: NotificationService, useClass: NotificationServiceMock }
      ]
    });

    service = TestBed.inject(ChatStateService);
    socket = TestBed.inject(ChatSocketService) as unknown as ChatSocketServiceMock;;
    notification = TestBed.inject(NotificationService) as unknown as NotificationServiceMock;;
  });

  it('should register socket listeners on init', () => {
    expect(socket.onHistory).toHaveBeenCalled();
    expect(socket.onNewQuestion).toHaveBeenCalled();
    expect(socket.onNewAnswer).toHaveBeenCalled();
  });

  it('should add a temporary question', () => {
    service.addTempQuestion({
      id: 'ignored',
      title: 'Temp title',
      content: 'Temp content',
      senderId: 'user-1',
      timestamp: 100,
      correlationId: 'corr-1'
    });

    const questions = service.questions();
    expect(questions.length).toBe(1);
    expect(questions[0].id).toContain('tmp-');
    expect(questions[0].answers).toEqual([]);
    expect(questions[0].title).toBe('Temp title');
  });

  it('should initialize history and sort by timestamp desc', () => {
    const history: ChatQuestion[] = [
      {
        id: '1',
        title: 'Old',
        content: 'Old content',
        senderId: 'u1',
        timestamp: 10,
        answers: [],
        correlationId: 'a'
      },
      {
        id: '2',
        title: 'New',
        content: 'New content',
        senderId: 'u2',
        timestamp: 20,
        answers: [],
        correlationId: 'b'
      }
    ];

    const historyCb = socket.onHistory.mock.calls[0][0];
    historyCb(history);

    const questions = service.questions();
    expect(questions[0].id).toBe('2');
    expect(questions[1].id).toBe('1');
  });

  it('should replace temp question with server question by correlationId', () => {
    service.addTempQuestion({
      id: 'ignored',
      title: 'Temp',
      content: 'Temp content',
      senderId: 'user-1',
      timestamp: 1,
      correlationId: 'corr-123'
    });

    const serverQuestion: ChatQuestion = {
      id: 'real-id',
      title: 'From server',
      content: 'Server content',
      senderId: 'bot',
      timestamp: 2,
      answers: [],
      correlationId: 'corr-123'
    };

    const cb = socket.onNewQuestion.mock.calls[0][0];
    cb(serverQuestion);

    const questions = service.questions();
    expect(questions.length).toBe(1);
    expect(questions[0].id).toBe('real-id');
    expect(notification.info).not.toHaveBeenCalled();
  });

  it('should notify when receiving a new server question', () => {
    const serverQuestion: ChatQuestion = {
      id: 'q1',
      title: 'New question',
      content: 'Hello',
      senderId: 'bot',
      timestamp: 5,
      answers: [],
      correlationId: 'x'
    };

    const cb = socket.onNewQuestion.mock.calls[0][0];
    cb(serverQuestion);

    expect(notification.info).toHaveBeenCalledWith('chat.new-question-received');
    expect(service.questions().length).toBe(1);
  });

  it('should append answer to existing question', () => {
    const question: ChatQuestion = {
      id: 'q1',
      title: 'Question',
      content: 'Question content',
      senderId: 'user',
      timestamp: 1,
      answers: [],
      correlationId: 'c'
    };

    const historyCb = socket.onHistory.mock.calls[0][0];
    historyCb([question]);

    const answer: ChatAnswer = {
      id: 'a1',
      questionId: 'q1',
      content: 'Answer content',
      senderId: 'bot',
      timestamp: 2
    };

    const answerCb = socket.onNewAnswer.mock.calls[0][0];
    answerCb(answer);

    const updated = service.questions()[0];
    expect(updated.answers.length).toBe(1);
    expect(updated.answers[0].id).toBe('a1');
  });

  it('should ignore answer for unknown question', () => {
    const answer: ChatAnswer = {
      id: 'a1',
      questionId: 'missing',
      content: 'Answer',
      senderId: 'bot',
      timestamp: 1
    };

    const answerCb = socket.onNewAnswer.mock.calls[0][0];
    expect(() => answerCb(answer)).not.toThrow();
    expect(service.questions().length).toBe(0);
  });
});