import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    // ne conectam la backend
    this.socket = io('http://localhost:3000');
  }

  // trimitem un mesaj la server
  sendMsg(username: string, text: string) {
    this.socket.emit('send_message', { username, text });
  }

  // anuntam ca un user s-a conectat
  notifyJoin(username: string) {
    this.socket.emit('user_joined', username);
  }

  // ascultam mesajele noi - returnam Observable ca sa putem subscribe in component
  onNewMsg(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('new_message', (msg) => {
        observer.next(msg);
      });
    });
  }

  // cand ne conectam primim tot istoricul
  onHistory(): Observable<any[]> {
    return new Observable(observer => {
      this.socket.on('history', (msgs) => {
        observer.next(msgs);
      });
    });
  }

  // mesaje de sistem (user joined etc)
  onSystemMsg(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('system_message', (msg) => {
        observer.next(msg);
      });
    });
  }
}