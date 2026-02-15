# realtime-chat

O aplicatie de chat in timp real facuta cu Angular + Node.js + Socket.io

## Cum functioneaza

Userul isi alege un username si poate trimite mesaje care apar instant la toti cei conectati. Nu e nevoie de baza de date, mesajele sunt tinute in memorie (dispar la restart).

## Tech stack

- Frontend: Angular 17
- Backend: Node.js + Express
- Websockets: Socket.io

## Cum rulezi proiectul

ai nevoie de Node.js instalat

### backend
```bash
cd backend
npm install
npm start
```

porneste pe http://localhost:3000

### frontend
```bash
cd frontend
npm install
npm start
```

deschide http://localhost:4200 in browser

ca sa testezi deschide 2 tab-uri cu username-uri diferite

## Ce am implementat

- mesaje in timp real intre utilizatori
- istoricul mesajelor cand te conectezi (le vezi pe cele trimise inainte)
- mesajele tale apar diferit fata de ale altora
- timestamp la fiecare mesaj
- notificare cand un user nou intra in chat
- merge si pe mobil

## Structura
```
realtime-chat/
├── backend/
│   ├── package.json
│   └── server.js
└── frontend/
    └── src/
        └── app/
            ├── app.component.ts
            ├── app.component.html
            ├── app.component.css
            └── chat.service.ts
```

## Note

prima data am incercat sa pun toata logica de socket direct in componenta dar nu era ok asa ca am mutat intr-un service separat

socket.io pe frontend l-am folosit prima data, e destul de simplu de integrat cu observables din rxjs

nu am folosit baza de date cum era specificat in cerinte, mesajele sunt doar intr-un array in memorie pe server
