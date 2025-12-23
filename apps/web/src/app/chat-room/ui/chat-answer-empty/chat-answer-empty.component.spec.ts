import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAnswerEmptyComponent } from './chat-answer-empty.component';

describe('ChatAnswerEmptyComponent', () => {
  let component: ChatAnswerEmptyComponent;
  let fixture: ComponentFixture<ChatAnswerEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAnswerEmptyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatAnswerEmptyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
