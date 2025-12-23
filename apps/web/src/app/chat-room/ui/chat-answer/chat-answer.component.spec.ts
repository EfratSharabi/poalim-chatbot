import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAnswerComponent } from './chat-answer.component';

describe('AnswerMessageComponent', () => {
  let component: ChatAnswerComponent;
  let fixture: ComponentFixture<ChatAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAnswerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatAnswerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
