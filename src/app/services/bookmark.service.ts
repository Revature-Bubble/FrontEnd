import { Post } from 'app/models/post';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Profile } from 'app/models/profile';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private _unsubscribeAll = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  //grabs bookmarks to be displayed on the Favorites tab in profile view
  getBookmarkByPid(pid: number): Observable<any> {
    const requestOptions = {
      headers: new HttpHeaders({
        Authorization: `${sessionStorage.getItem('Authorization')}`,
      }),
    };
    return this.httpClient.get(`${environment.url}/bookmark`, requestOptions)
    .pipe(takeUntil(this._unsubscribeAll));
  }

  //creates a bookmark when the bookmark button on a post is clicked
  postBookmark(post: Post): Observable<Profile> {
    console.log("posting bookmark: " + JSON.stringify(post))
    const requestOptions = {
      headers: new HttpHeaders({
        Authorization: `${sessionStorage.getItem('Authorization')}`,
      }),
    };
    return this.httpClient
      .post<Profile>(environment.url + '/bookmark', post, requestOptions)
      .pipe(takeUntil(this._unsubscribeAll));
  }

  //checks if a bookmark is actually bookmarked. will return true or false
  getBookmarked(post: Post): Observable<number> {
    const headerDict = {
      post: `${post.psid}`,
      Authorization: `${sessionStorage.getItem('Authorization')}`,
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.httpClient
      .get<number>(environment.url + '/bookmark/has', requestOptions)
      .pipe(takeUntil(this._unsubscribeAll));
  }

  //removed a bookmark from the table when the bookmark button is selected
  //a second time 
  deleteBookmark(post: Post): Observable<Profile> {
    const options = {
      headers: new HttpHeaders({
        Authorization: `${sessionStorage.getItem('Authorization')}`,
      }),
      body: post,
    };
    return this.httpClient
      .delete<Profile>(environment.url + '/bookmark', options)
      .pipe(takeUntil(this._unsubscribeAll));
  }
}
