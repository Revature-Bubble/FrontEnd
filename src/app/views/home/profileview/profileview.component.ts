import { Profile } from './../../../models/profile';
import { Post } from 'app/models/post';
import { PostService } from 'app/services/post.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'app/services/profile.service';
import { FollowService } from 'app/services/follow.service';
import { BookmarkService } from 'app/services/bookmark.service';

@Component({
  selector: 'app-profileview',
  templateUrl: './profileview.component.html',
  styleUrls: ['./profileview.component.css'],
})
export class ProfileviewComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private followService: FollowService,
    private bookmarkService: BookmarkService
  ) {}

  profile: Profile | any;
  followersProfiles: Profile[] | any;
  followersOfThisUser: Profile[] | any;
  bookmarkPosts: Post[] = [];
  id: any;
  sessionId: any;
  firstName: any;
  lastName: any;
  email: any;
  username: any;
  url: any = `../../../../assets/favicon.png`;
  posts: any[] = [];
  profilePosts: Post[] = [];

  failed: boolean = false;
  success: boolean = false;
  followed: boolean = false;

  //Tabs
  showPosts: boolean = true;
  showFollowers: boolean = false;
  showGroups: boolean = false;
  showFollowing: boolean = false;
  showFavorites: boolean = false;

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    let sessionProfile: any = sessionStorage.getItem('profile');

    sessionProfile = JSON.parse(sessionProfile);
    this.sessionId = sessionProfile.pid;

    this.profileService.getFollowers(this.id).subscribe((e) => {
      this.followersOfThisUser = e;
    });

    this.profile = this.profileService
      .getProfileByPid(this.id)
      .subscribe((e: any) => {
        this.followersProfiles = e.following;

        this.id = e.pid;
        this.firstName = e.firstName;
        this.lastName = e.lastName;
        this.email = e.email;
        this.url = e.imgurl ? e.imgurl : `../../../../assets/favicon.png`;
        this.username = e.username;
        //automatically creates these lists so that they are there when you tab over
        //to the corresponding page
        this.getFollowerPosts(1);
        this.getBookmarkPosts(1);
        sessionProfile.following.forEach((p: Profile) => {
          if (p.pid == this.id) {
            this.followed = true;
          }
        });
      });
  }

  getFollowerPosts(scrollcount: number): any {
    this.postService.getAllPosts().subscribe((data: any) => {
      if (data) {
        this.posts = data;

        this.profilePosts = this.posts.filter((p: Post) => {
          return p.creator.pid == this.id;
        });
        this.profilePosts.sort((a, b) => {
          let dateA = new Date(a.datePosted ?? 0);
          let dateB = new Date(b.datePosted ?? 1);
          return dateB.getTime() - dateA.getTime();
        });
      }
    });
  }

  //stores the grabbed bookmarks from the database into the bookmarkPosts array
  //to be displayed on the profile view
  getBookmarkPosts(scrollcount: number): any {
    this.bookmarkService.getBookmarkByPid(this.sessionId).subscribe((data: any) => {
console.log(data);
      if (data) {
        this.bookmarkPosts = data;
        console.log(this.bookmarkPosts);
        //this part just orders the list of bookmark posts by most to least recent
        this.bookmarkPosts.sort((c, d) => {
          let dateC = new Date(c.datePosted ?? 0);
          let dateD = new Date(d.datePosted ?? 1);
          return dateD.getTime() - dateC.getTime();
        });
      }
    });
  }

  
  toggleViewTabs(index: number) {
    this.showPosts = false;
    this.showFollowers = false;
    this.showGroups = false;
    this.showFavorites = false;
    switch (index) {
      case 0:
        this.showPosts = true;
        break;
      case 1:
        this.showFollowers = true;
        break;
      case 2:
        this.showGroups = true;
        break;
      case 3:
        this.showFavorites = true;
        break;
    }
  }
}
