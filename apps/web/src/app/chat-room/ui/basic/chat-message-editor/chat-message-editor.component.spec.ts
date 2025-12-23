import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMessageEditorComponent } from './chat-message-editor.component';

describe('ChatMessageEditorComponent', () => {
  let component: ChatMessageEditorComponent;
  let fixture: ComponentFixture<ChatMessageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessageEditorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
