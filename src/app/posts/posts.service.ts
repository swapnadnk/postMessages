import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient){}

  getPosts() {
    this.httpClient.get<{message:string, posts: any }>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
      return postData.posts.map(post=>{
        return {
          id: post._id,
          title: post.title,
          content: post.content
        }
      });
    }))
    .subscribe((res)=>{
      this.posts = res;
      this.postsUpdated.next([...this.posts]);
    });
    // return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.httpClient.post<{message:string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((res)=>{
      console.log(res.message);
      post.id = res.postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: string){
    this.httpClient.delete<{message:string}>('http://localhost:3000/api/posts/' + postId)
    .subscribe((res)=>{
      const updatedPosts = this.posts.filter(post=> post.id!==postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      console.log(res.message);
    })
  }
}
