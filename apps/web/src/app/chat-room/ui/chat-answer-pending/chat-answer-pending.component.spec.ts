import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAnswerPendingComponent } from './chat-answer-pending.component';

describe('ChatAnswerPendingComponent', () => {
  let component: ChatAnswerPendingComponent;
  let fixture: ComponentFixture<ChatAnswerPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAnswerPendingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatAnswerPendingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
