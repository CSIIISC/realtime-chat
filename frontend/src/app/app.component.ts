import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  // modelele pentru form
  username = '';
  messageText = '';

  // lista de mesaje afisate
  messages: any[] = [];

  // daca userul si-a setat username-ul
  hasJoined = false;

  // subscriptions pe care le dezabonez la destroy
  private subs: Subscription[] = [];

  // flag ca sa stim cand sa scrollam jos
  private shouldScroll = false;

  constructor(private chatSvc: ChatService) {}

  ngOnInit() {
    // primim istoricul la conectare
    const historySub = this.chatSvc.onHistory().subscribe(msgs => {
      this.messages = msgs.map(m => ({ ...m, type: 'message' }));
      this.shouldScroll = true;
    });

    // ascultam mesaje noi
    const msgSub = this.chatSvc.onNewMsg().subscribe(msg => {
      this.messages.push({ ...msg, type: 'message' });
      this.shouldScroll = true;
    });

    // ascultam system messages (user joined)
    const sysSub = this.chatSvc.onSystemMsg().subscribe(msg => {
      this.messages.push({ ...msg, type: 'system' });
      this.shouldScroll = true;
    });

    this.subs.push(historySub, msgSub, sysSub);
  }

  ngAfterViewChecked() {
    // dupa fiecare render, daca avem mesaje noi scrollam jos
    if (this.shouldScroll) {
      this.scrollDown();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy() {
    // curatam subscriptiile ca sa nu avem memory leaks
    this.subs.forEach(s => s.unsubscribe());
  }

  joinChat() {
    if (!this.username.trim()) return;
    this.hasJoined = true;
    this.chatSvc.notifyJoin(this.username.trim());
  }

  sendMessage() {
    if (!this.messageText.trim() || !this.username.trim()) return;

    this.chatSvc.sendMsg(this.username.trim(), this.messageText.trim());
    this.messageText = ''; // golim inputul dupa trimitere
  }

  // helper sa verificam daca mesajul e al meu
  isMine(msg: any): boolean {
    return msg.username === this.username;
  }

  // formatam timestamp-ul
  formatTime(ts: number): string {
    const d = new Date(ts);
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  private scrollDown() {
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (e) {}
  }
}
