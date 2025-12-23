import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatQuestionListComponent } from './chat-question-list.component';

describe('QuestionListComponent', () => {
  let component: ChatQuestionListComponent;
  let fixture: ComponentFixture<ChatQuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatQuestionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatQuestionListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
