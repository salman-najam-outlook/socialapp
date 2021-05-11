import { Component, OnInit } from '@angular/core';
import { PeopleService } from 'src/app/services/people.service';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  people = [];
  loggedInUser: any;
  userArr = [];
  socket: any;

  constructor(private peopleService: PeopleService, private tokenService: TokenService) { 
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.loggedInUser = this.tokenService.getPayload();
    this.getAllPeople();
    this.getUser();
    this.socket.on('refreshPage', () => {
      this.getAllPeople();
      this.getUser();
    });
  }

  getAllPeople() {
    this.peopleService.getAllPeople().subscribe(
      (res) => {
        _.remove(res.result, {username: this.loggedInUser.username});
        this.people = res.result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getUser() {
    this.peopleService.getUserById(this.loggedInUser._id).subscribe(
      (res) => {
        this.userArr = res.result.following;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  followUser(user) {
    this.peopleService.followUser(user._id).subscribe(
      (res) => {
        this.socket.emit('refresh', {});
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkInArray(arr, id) {
    const result = _.find(arr, ['userFollowed._id', id]);
    if (result) {
      return true;
    } else {
      return false;
    }
  }

}
