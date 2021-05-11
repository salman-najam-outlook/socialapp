import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  socketHost: any;
  socket: any;

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.socketHost = 'http://localhost:3000';
    this.socket = io(this.socketHost);
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.postForm = this.fb.group({
      post: ['', Validators.required],
    });
  }

  submitPost() {
    this.postService.addPost(this.postForm.value).subscribe((response) => {
      this.socket.emit('refresh', {});
      this.postForm.reset();
    }),
      // tslint:disable-next-line: no-unused-expression
      (err) => {
        console.log(err);
      };
  }
}
