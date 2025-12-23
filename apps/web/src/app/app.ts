import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { HeaderComponent } from './core/ui/header/header.component';

@Component({
  imports: [RouterModule, HeaderComponent, ChatRoomComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {

  private readonly translateService = inject(TranslateService);

  ngOnInit(): void {
    this.translateService.onFallbackLangChange.subscribe(event => {
      console.log('Default language changed:', event.lang);
    });
  }

}
