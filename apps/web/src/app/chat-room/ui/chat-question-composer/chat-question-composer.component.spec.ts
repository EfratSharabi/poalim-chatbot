import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatQuestionComposerComponent } from './chat-question-composer.component';

describe('QuestionComposerComponent', () => {
  let component: ChatQuestionComposerComponent;
  let fixture: ComponentFixture<ChatQuestionComposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatQuestionComposerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatQuestionComposerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
