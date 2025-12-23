import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatQuestionComponent } from './chat-question.component';

describe('ChatQuestionComponent', () => {
  let component: ChatQuestionComponent;
  let fixture: ComponentFixture<ChatQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatQuestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatQuestionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
