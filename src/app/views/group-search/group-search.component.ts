import { GroupService } from 'app/services/group.service';
import { Component } from '@angular/core';
import { Group } from 'app/models/group';
import { Profile } from './../../models/profile';

@Component({
  selector: 'app-group-search',
  templateUrl: './group-search.component.html',
  styleUrls: ['./group-search.component.css']
})
// This is just a copy-paste of the search component refactored for group lookup
export class GroupSearchComponent {

  groupName = '';
  public pro = new Profile(0,'', '', '', '', '',false,[]);
  public pros: Profile[] = [];
  public group = new Group(0,"",this.pro,this.pros);
  id = 0;
  public groups: any

  constructor(private groupService: GroupService) { }

  public setid(id: number): void{
    this.id = id
  }

  public searchGroup(){
    console.log(`${this.groupName}`)
    // this.groupService.SearchGroupbyName(this.groupName)
    //   .subscribe(data => this.groups = data)
  }

}