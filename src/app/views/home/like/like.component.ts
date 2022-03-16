import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'app/models/post';
import { PostService } from 'app/services/post.service';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit {

  public num!: number;
  public hasLiked!: boolean;

  faHeartSolid = faHeartSolid;
  faHeartOutline = faHeartOutline;

  @Input()
  postInfo!: Post;

  constructor(public postService: PostService) { }

  public getLikes(){
    this.postService.getNumLikes(this.postInfo).subscribe((data) => {
      this.num = data;
    });
  }

  public likePost() {
    console.log(JSON.stringify(this.postInfo))
    this.postService.postLike(this.postInfo).subscribe((data) => {
        this.getLikes();
        }, (err) => {
            this.postService.deleteLike(this.postInfo).subscribe((data) => {
            this.getLikes();
          })
        });
        this.hasLiked = !this.hasLiked;
  }


  ngOnInit(): void {
    // console.log("doing stuff with post: " + JSON.stringify(this.postInfo))
    this.getLikes();
    this.postService.getLiked(this.postInfo).subscribe((data) => {
      if(data === 0) {
        this.hasLiked = false;
      } else {
        this.hasLiked = true;
      }
    });
  }

}