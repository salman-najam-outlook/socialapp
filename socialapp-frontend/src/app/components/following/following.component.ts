import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { PeopleService } from 'src/app/services/people.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
})
export class FollowingComponent implements OnInit {
  following: [];
  user: any;
  socket: any;

  constructor(
    private tokenService: TokenService,
    private peopleService: PeopleService
  ) {
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
    this.peopleService.getUserById(this.user._id).subscribe(
      (res) => {
        this.following = res.result.following;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  unFollowUser(followedUser) {
    this.peopleService.unFollowUser(followedUser._id).subscribe(
      (res) => {
        this.socket.emit('refresh', {});
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
