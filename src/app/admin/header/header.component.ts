import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName:any;
  userdetails: any;
  showsidebar: any=true;
  constructor(private commonservice:CommonService, private authservice:AuthService, private router:Router) { }

  ngOnInit(): void {
    let user:any = localStorage.getItem("user_details")
    if (user !== null || typeof user !== 'undefined') {
    this.userdetails = JSON.parse(user)
  }
  this.commonservice.toggleSidebar.subscribe((res:any) => {
    this.showsidebar = !this.showsidebar
    
    //open your sidebar by setting classes, whatever
  });
  }
  openSidebar() {
    this.commonservice.toggleSidebar.emit();
  }
  logout(){
    this.authservice.logOut()
  }
  redirect(){
    this.router.navigate(['admin/home'])
  }
}
