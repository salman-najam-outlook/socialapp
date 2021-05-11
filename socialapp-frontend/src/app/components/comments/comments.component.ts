import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  commentForm: FormGroup;
  postId: any;
  commentsArray: [];
  socket: any;
  post: string;

  constructor(private fb: FormBuilder, private postService: PostService,
              private activatedRoute: ActivatedRoute) {
                this.socket = io('http://localhost:3000');
              }

  ngOnInit(): void {
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.toolbarElement = document.querySelector('.nav-content');
    this.init();
    this.getPost();
    this.socket.on('refreshPage', (data) => {
      this.getPost();
    });
  }

  init() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  addComment() {
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(
      (res) => {
        this.socket.emit('refresh', {});
        this.commentForm.reset();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getPost() {
    this.postService.getPost(this.postId).subscribe(
      (res) => {
        console.log(res);
        this.post = res.post.post;
        this.commentsArray = res.post.comments.reverse();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public timeFromNow(time) {
    return moment(time).fromNow();
  }

}
