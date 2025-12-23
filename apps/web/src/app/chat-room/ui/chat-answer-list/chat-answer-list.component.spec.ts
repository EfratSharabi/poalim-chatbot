import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAnswerListComponent } from './chat-answer-list.component';

describe('ChatAnswerListComponent', () => {
  let component: ChatAnswerListComponent;
  let fixture: ComponentFixture<ChatAnswerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAnswerListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatAnswerListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
