import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { PeopleService } from 'src/app/services/people.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  followers = [];
  user: any;
  socket: any;

  constructor(private tokenService: TokenService, private peopleService: PeopleService) { 
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.user = this.tokenService.getPayload();
    this.getUser();

    this.socket.on('refreshPage', () => {
      this.getUser();
    })
  }

  getUser() {
    this.peopleService.getUserById(this.user._id).subscribe(
      (res) => {
        this.followers = res.result.followers;
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
