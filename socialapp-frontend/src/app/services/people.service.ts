import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:3000/api/socialapp';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(private http: HttpClient) {}

  getAllPeople(): Observable<any> {
    return this.http.get(`${baseURL}/people`);
  }

  followUser(userFollowed): Observable<any> {
    return this.http.post(`${baseURL}/follow-user`, { userFollowed });
  }

  unFollowUser(userFollowed): Observable<any> {
    return this.http.post(`${baseURL}/unfollow-user`, { userFollowed });
  }

  getUserById(id): Observable<any> {
    return this.http.get(`${baseURL}/people/${id}`);
  }

  getUserByUsername(username): Observable<any> {
    return this.http.get(`${baseURL}/people/username/${username}`);
  }

  markNofitication(id, deleteValue?): Observable<any> {
    return this.http.post(`${baseURL}/mark/${id}`, {
      id,
      deleteValue
    });
  }

  markAllNotificationsAsRead(): Observable<any> {
    return this.http.post(`${baseURL}/mark-all`, {
      all: true
    });
  }
}
