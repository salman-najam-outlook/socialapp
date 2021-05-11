import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { PeopleService } from 'src/app/services/people.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit, AfterViewInit {
  receiver: string;
  user: any;
  message: string;
  receiverData: any;
  messagesArray = [];
  socket: any;
  typingMessage: any;
  typing: boolean;

  constructor(
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private peopleService: PeopleService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.typing = false;
    this.user = this.tokenService.getPayload();
    this.route.params.subscribe((params) => {
      this.receiver = params.name;
      this.getUserByUsername(this.receiver);
    });
    this.socket.on('refreshPage', () => {
      this.getUserByUsername(this.receiver);
    });
    this.socket.on('is_typing', (data) => {
      if(data.sender === this.receiver) {
        this.typing = true;
      }
    });

    this.socket.on('has_stopped_typing', (data) => {
      if(data.sender === this.receiver) {
        this.typing = false;
      }
    });

  }

  ngAfterViewInit() {
    const params = {
      room1: this.user.username,
      room2: this.receiver
    };

    this.socket.emit('join chat', params);
  }

  getUserByUsername(name) {
    this.peopleService.getUserByUsername(name).subscribe(
      (res) => {
        this.receiverData = res.result;
        this.getMessages(this.user._id, this.receiverData._id);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  sendMessage() {
    if (this.message) {
      this.messageService
        .sendMessage(
          this.user._id,
          this.receiverData._id,
          this.receiverData.username,
          this.message
        )
        .subscribe(
          (res) => {
            this.socket.emit('refresh', {});
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  getMessages(senderId, reveiverId) {
    this.messageService.getAllMessages(senderId, reveiverId).subscribe(
      (res) => {
        this.messagesArray = res.messages.message;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  isTyping() {
    this.socket.emit('start_typing', {
      sender: this.user.username,
      receiver: this.receiver
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.username,
        receiver: this.receiver
      });
    }, 1000);
  }
}
