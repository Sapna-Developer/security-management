import { Component, ElementRef, Renderer2, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import {Location} from "@angular/common";
declare var $:any;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  userdetails: any;
  activeclass:boolean = false;
  selSubNav: any;
  selectedCat: string = '';
  isOpened:any = ''
  public href: string = "";
  toggled: any;
  collapseShowsecurity:boolean = true;
  collapseShowvisitor:boolean = true;
  collapseShowtreecut:boolean = true;
  collapseShowvehicle:boolean = true;
  collapseShowsoreport:boolean = true;
  constructor(private commonservice:CommonService, private authservice:AuthService, private router:Router, private renderer: Renderer2,
    private location: Location) { 
  }
  ngOnInit(): void {
    this.toggled=this.router.url
    this.router.events.subscribe((ev:any) => {
      // if(ev.url==='/admin/home'){    
      //   localStorage.removeItem('activemenu')
      //   let amenu = localStorage.getItem('activemenu')
      //  if(!amenu){
      //     this.isOpened = ""
      //   }
      // }
      this.toggled=ev.url
      
      // if(ev.url==="/admin/deployment_dashboard"||ev.url==="/admin/securitydeploy"||ev.url=="/admin/sites"||ev.url==="")
    });
    if(window.location.pathname==='/admin/home'){
    //   localStorage.removeItem('activemenu')
    //   let amenu = localStorage.getItem('activemenu')
    //  if(!amenu){
        this.toggled = ""
      // }
    }
    // let data = localStorage.getItem('activemenu')
    // if(data !== null && typeof data !==undefined){
    //   this.isOpened = data
    // }else{
    //   this.isOpened = ""
    // }
    let user:any = localStorage.getItem("user_details")
    if (user !== null || typeof user !== 'undefined') {
    this.userdetails = JSON.parse(user)
    // this.demo.nativeElement.querySelector('demo')
    // .addEventListener("mouseout", mouseOut);
  }
  var body = $('body');
  if(body.hasClass("")){
    body.toggleClass('sidebar-icon-only');
  }
}
getActivesecurity(){
  if(this.toggled==='/admin/deployment_dashboard'||this.toggled==='/admin/securitydeploy'||this.toggled==='/admin/sites'||this.toggled==='/admin/locations'||this.toggled==='/admin/agencies'){
    return true
  }else{
    return false
  }
}
getActiveorg(){
  if(this.toggled==='/admin/organizations'){
    return true
  }else{
    return false
  }
}
getActivecompany(){
  if(this.toggled==='/admin/companys'){
    return true
  }else{
    return false
  }
}
getActiveacl(){
  if(this.toggled==='/admin/acl'){
    return true
  }else{
    return false
  }
}
getActivevisitor(){
  if(this.toggled==='/admin/visitor_movement?data=onArrival'||this.toggled==='/admin/visitor_movement?data=list'||this.toggled==='/admin/visitor_dashboard'){
    return true
  }else{
    return false
  } 
}
getActivevehicle(){
  if(this.toggled==='/admin/vehicle_dashboard'||this.toggled==='/admin/vehicle_movement?data=mge'||this.toggled==='/admin/vehicle_movement?data=vtrack'||this.toggled==='/admin/vehicle_movement?data=vlog'){
    return true
  }else{
    return false
  } 
}
getActivetree(){
  if(this.toggled==='/admin/treecut_dashboard?data=dashboard'||this.toggled==='/admin/tree_cut?data=treecutdetails'||this.toggled==='/admin/tree_cut?data=tclists'){
    return true
  }else{
    return false
  } 
}
getActivesoreport(){
  if(this.toggled==='/admin/soreporting'||this.toggled==='/admin/parameters'){
    return true
  }else{
    return false
  } 
}
getToggledStatus(){
  if(this.router.url===this.toggled){
    this.collapseShowsecurity=!this.collapseShowsecurity;
    }else{
      this.collapseShowsecurity=true
    }
}
getToggledStatusvisitor(){
  if(this.router.url===this.toggled){
    this.collapseShowvisitor=!this.collapseShowvisitor;
    }else{
      this.collapseShowvisitor=true
    }
}
getToggledStatusvehicle(){
  if(this.router.url===this.toggled){
    this.collapseShowvehicle=!this.collapseShowvehicle;
    }else{
      this.collapseShowvehicle=true
    }
}
getToggledStatustreecut(){
  if(this.router.url===this.toggled){
    this.collapseShowtreecut=!this.collapseShowtreecut;
    }else{
      this.collapseShowtreecut=true
    }
}
getToggledStatussoreporting(){
  if(this.router.url===this.toggled){
    this.collapseShowsoreport=!this.collapseShowsoreport;
    }else{
      this.collapseShowsoreport=true
    }
}
  ngAfterViewInit() {
    
  }

toggleAccordian(ele:any){
  // if(this.isOpened === '' ){
  //   this.isOpened = ele;
  // }else if(this.isOpened !== ele){
  //   this.isOpened = ele;
  // }
  // else{
  //   this.isOpened = '';
  // }
  // this.selectedCat = ele;
  // localStorage.setItem("activemenu",ele)
  var body = $('body')
  var $menuItem = $('body .nav .nav-item')
  if (body.hasClass('sidebar-icon-only')){
body.removeClass('sidebar-icon-only')
$menuItem.removeClass('hover-open')

  }
  // let data = localStorage.getItem('activemenu')
  // if(data !== null && typeof data !==undefined){
  //   this.isOpened = data
    
  // }else{
  //   this.isOpened = ""
  // }
  
}
toggleAccordian1(ele:any){
  var body = $('body')
  var $menuItem = $('body .nav .nav-item')
  if (body.hasClass('sidebar-icon-only')){
body.removeClass('sidebar-icon-only')
$menuItem.removeClass('hover-open')

  }
  localStorage.setItem("activemenu",ele)
  // this.clickEvent()
  let data = localStorage.getItem('activemenu')
  if(data !== null && typeof data !==undefined){
    this.isOpened = data
    
  }else{
    this.isOpened = ""
  }
  // else{
  //   body.toggleClass('sidebar-icon-only');
  // }
}
  clickEvent(){
    var body = $('body');
    if ((body.hasClass('sidebar-toggle-display')) || (body.hasClass('sidebar-absolute'))) {
      body.toggleClass('sidebar-hidden');
      
    } else {
      body.toggleClass('sidebar-icon-only');
      let data = localStorage.getItem("activemenu")
      this.isOpened = data
    }
  }
  clickEventoffcanvas(){
    var body = $('body .sidebar-offcanvas');
    body.toggleClass('active');
  }
  deploy(){ 

  }
  logout(){
    this.authservice.logOut()
    var body = $('body');
if(body.hasClass("")){
  body.toggleClass('sidebar-icon-only');
}
  }
  redirect(){
    this.router.navigate(['admin/home'])
  }
}
