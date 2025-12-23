import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { HeaderComponent } from './core/ui/header/header.component';

@Component({
  imports: [HeaderComponent, ChatRoomComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {

}
