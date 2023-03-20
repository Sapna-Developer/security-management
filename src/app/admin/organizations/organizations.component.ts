import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit {
  @ViewChild('organizationmodal')
  public organizationmodal!: ModalDirective;
  @ViewChild('organizationeditmodal')
  public organizationeditmodal!: ModalDirective;
  @ViewChild('deletemodal')public deletemodal!: ModalDirective;
  organizationdata:any=[]
  organization:any={}
  editorganization:any={}
  userdetails: any;
  organizationlist: any=[]
  deleteData: any;
  orgId: any;
  validationMsg:boolean = false
  validationMsgEdit:boolean = false
  offset=1;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };
  organizationName: any;
  organizationNamefrDelete: any;
  search:any={}
  constructor(private commonservice:CommonService,private alertcall:AlertCallService) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
      
    }
    this.getdata()
  }
  searchbyname(){
if(this.search.name.length>1){
  this.offset=1
  this.getdata()
}if(!this.search.name){
  this.getdata()
}
    
  }
  pageChanged(ev: any) {
    this.offset = ev;
    this.getdata();
  }
getdata(){
  let params = new HttpParams()
  params = params.append("limit",10)
  params = params.append("page",this.offset)
  params = params.append("orgName",this.search.name?this.search.name:"")
this.commonservice.getOrganizationslistwthpagination(params).subscribe((res:any)=>{
  if (res && res['status'] == 'success') {
    this.organizationlist = res.data;
    this.config.totalItems = res.count;
    this.config.currentPage = this.offset;
  }
  
})  
}
addorganization(){
this.organizationmodal.show()
}
closemodal(){
this.organizationmodal.hide()
}
actionOnClose(){

}
createOrganization(fr:any){
  let array=Object.keys(fr.value).filter((k:any)=> {
    if (fr.value[k] === "" ||  fr.value[k]===null || fr.value[k]===undefined) {
      return k;
    }
  });
if(array.length!==0){
this.validationMsg= true
}else{
  this.validationMsg= false
let obj={
  "createdBy": this.userdetails.data.username,
	"orgName": this.organization.name,
	"address": this.organization.address
}
this.commonservice.addOrganizaton(obj).subscribe((res:any)=>{
  if (res && res['status'] == 'success') {
    this.alertcall.showSuccess('Success', res['message']);
    this.organizationmodal.hide();
    fr.reset()
    this.getdata();
  } else {
    this.alertcall.showWarning('Alert', res['message']);
  }
  
})
}
}
editdata(data:any){
  this.organizationName=data.orgName
  this.organizationeditmodal.show()
  this.editorganization.name = data.orgName
  this.editorganization.address = data.address
  this.orgId= data.orgId
}
updateOrganization(fr:any){
  let array=Object.keys(fr.value).filter((k:any)=> {
    if (fr.value[k] === "" ||  fr.value[k]===null || fr.value[k]===undefined) {
      return k;
    }
  });
if(array.length!==0){
this.validationMsgEdit= true
}else{
  this.validationMsgEdit= false
  let obj={
    "id": this.orgId,
	"updatedBy":this.userdetails.data.username,
	"orgName": this.editorganization.name,
	"address": this.editorganization.address,
  }
  this.commonservice.updateOrganization(obj).subscribe((res:any)=>{
    if (res && res['status'] == 'success') {
      this.alertcall.showSuccess('Success', res['message']);
      this.organizationeditmodal.hide();
      fr.reset()
      this.getdata();
    } else {
      this.alertcall.showWarning('Alert', res['message']);
    }
    
  })
}
}
deletedata(data:any){
  this.organizationNamefrDelete=data.orgName
  this.deletemodal.show()
  this.deleteData= data
}
deleteperminently(){
  let obj={
    "id": this.deleteData.orgId
  }
  this.commonservice.deleteOrganization(obj).subscribe((res:any)=>{
    if (res && res['status'] == 'success') {
      this.alertcall.showSuccess('Success', res['message']);
      this.deletemodal.hide();
      this.getdata();
    } else {
      this.alertcall.showWarning('Alert', res['message']);
    }
  })
}
closeeditmodal(){
  this.organizationeditmodal.hide()
}
hideChildModal(){
  this.deletemodal.hide()
}
}
