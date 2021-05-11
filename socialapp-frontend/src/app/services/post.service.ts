import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:3000/api/socialapp';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  addPost(body): Observable<any> {
    return this.http.post(`${baseURL}/post/add-post`, body);
  }

  getAllPosts(): Observable<any> {
    return this.http.get(`${baseURL}/posts`);
  }

  getPost(id): Observable<any> {
    return this.http.get(`${baseURL}/post/${id}`);
  }

  addLike(body): Observable<any> {
    return this.http.post(`${baseURL}/post/add-like`, body);
  }

  addComment(postId, comment): Observable<any> {
    return this.http.post(`${baseURL}/post/add-comment`, {
      postId, comment
    });
  }

}
