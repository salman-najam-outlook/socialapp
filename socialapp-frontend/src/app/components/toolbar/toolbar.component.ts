import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { PeopleService } from 'src/app/services/people.service';
import * as moment from 'moment/moment';
import _ from 'lodash';
import io from 'socket.io-client';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  user: any;
  notifications: any;
  socket: any;
  count = [];

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private peopleService: PeopleService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    const dropdownElement = document.querySelector('.dropdown-trigger');
    M.Dropdown.init(dropdownElement, {
      alignment: 'left',
      hover: true,
      coverTrigger: false,
    });
    this.user = this.tokenService.getPayload();
    this.getUser();

    this.socket.on('refreshPage', () => {
      this.getUser();
    });
  }

  getUser() {
    this.peopleService.getUserById(this.user._id).subscribe(
      (res) => {
        this.notifications = res.result.notifications.reverse();
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
      },
      (err) => {
        if (err.err.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  onLogout() {
    this.tokenService.deleteToken();
    this.router.navigate(['/']);
  }

  goToHome() {
    this.router.navigate(['/streams']);
  }

  public timeFromNow(time) {
    return moment(time).fromNow();
  }

  markAll() {
    this.peopleService.markAllNotificationsAsRead().subscribe(
      (res) => {
        this.socket.emit('refresh', {});
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
