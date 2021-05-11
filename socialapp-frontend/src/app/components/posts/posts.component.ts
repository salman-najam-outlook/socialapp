import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment/moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: [];
  sockeHost: any;
  socket: any;
  user: any;
  constructor(private postService: PostService,
              private tokenService: TokenService,
              private router: Router) {
    this.sockeHost = 'http://localhost:3000';
    this.socket = io(this.sockeHost);
   }

  ngOnInit(): void {
    this.user = this.tokenService.getPayload();
    this.allPosts();
    this.socket.on('refreshPage', (data) => {
      this.allPosts();
    });
  }

  allPosts() {
    this.postService.getAllPosts().subscribe(
      (res) => {
        this.posts = res.posts;
      },
      (err) => {
        if(err.err.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  public timeFromNow(time) {
    return moment(time).fromNow();
  }

  likePost(post) {
    this.postService.addLike(post).subscribe(
      (res) => {
        console.log(res);
        this.socket.emit('refresh', {});
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkInLikesArray(array, username) {
    return _.some(array, {username});
  }

  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }
}
