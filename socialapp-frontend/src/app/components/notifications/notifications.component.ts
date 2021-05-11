import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { PeopleService } from 'src/app/services/people.service';
import io from 'socket.io-client';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  socket: any;
  user: any;
  notifications = [];
  constructor(private tokenService: TokenService, private peopleService: PeopleService) { 
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.user = this.tokenService.getPayload();
    this.getUser();

    this.socket.on('refreshPage', () => {
      this.getUser();
    });
  }

  getUser() {
    this.peopleService.getUserByUsername(this.user.username).subscribe(
      (res) => {
        this.notifications = res.result.notifications.reverse();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public timeFromNow(time) {
    return moment(time).fromNow();
  }

  markNotification(notification) {
    this.peopleService.markNofitication(notification._id).subscribe(
      (res) => {
        this.socket.emit('refresh', {});
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteNotification(notification) {
    this.peopleService.markNofitication(notification._id, true).subscribe(
      (res) => {
        this.socket.emit('refresh', {});
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
