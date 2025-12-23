import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAnswerComposerComponent } from './chat-answer-composer.component';

describe('AnswerComposerComponent', () => {
  let component: ChatAnswerComposerComponent;
  let fixture: ComponentFixture<ChatAnswerComposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAnswerComposerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatAnswerComposerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
