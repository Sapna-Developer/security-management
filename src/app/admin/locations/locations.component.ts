import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  @ViewChild('locationmodal')
  public locationmodal!: ModalDirective;
  userdetails: any;
  @ViewChild('locationeditmodal')
  public locationeditmodal!: ModalDirective;
  locationId: any;
  @ViewChild('deletemodal') public deletemodal!: ModalDirective;
  deleteData: any;
  locationName: any;
  locationNameDelete: any;
  editDATA: any;
  constructor(public commonService:CommonService, public alertcall:AlertCallService) { }
  organizationlist:any=[]
  sitedata:any=[]
  locations:any={}
  editlocations:any={}
  locationdata:any=[]
  validationMsg:boolean = false
  validationeditMsg:boolean = false
  offset:any=1;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };
  search:any={}
  ngOnInit(): void {
    this.locations.organization=null;
    this.locations.site=null;
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
      
    }
    this.getorganizations()
    this.getSites()
    this.getdata()
  }
  searchbylocation(){
    if(this.search.name.length>1){
      this.offset=1
      this.getdata()
    }if(!this.search.name){
      this.getdata()
    }
  }
  getorganizations() {
    this.commonService.getOrganizationslist().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.organizationlist = res.data;
      }
    });
  }
  getSites(){
    let params = new HttpParams()
    params = params.append("orgId",this.locations.organization?this.locations.organization:"")
    this.commonService.getSitesfrorg(params).subscribe((res:any)=>{
      if (res && res['status'] == 'success') {
        this.sitedata = res.data;
          this.sitedata.forEach((ele:any)=>{
          var optionText = ele.siteName;
          if(ele.siteName.length>50){
            var newOption = optionText.substring(0, 50);
            ele['siteName']=newOption + '...'
          }
        })
      }
    })
  }
  getSitesfredit(){
    let params = new HttpParams()
    params = params.append("orgId",this.editDATA.orgId)
    this.commonService.getSitesfrorg(params).subscribe((res:any)=>{
      if (res && res['status'] == 'success') {
        this.sitedata = res.data;
          this.sitedata.forEach((ele:any)=>{
          var optionText = ele.siteName;
          if(ele.siteName.length>50){
            var newOption = optionText.substring(0, 50);
            ele['siteName']=newOption + '...'
          }
        })
      }
    })
  }
  pageChanged(ev: any) {
    this.offset = ev;
    this.getdata();
  }
  getdata(){
    let params = new HttpParams()
    params = params.append("limit",10)
    params = params.append("page",this.offset)
    params = params.append("siteName",this.search.name?this.search.name:"")
    this.commonService.getLocationwthpagination(params).subscribe((res:any)=>{
      if (res && res['status'] == 'success') {
        this.locationdata = res.data;
        this.config.totalItems = res.count;
        this.config.currentPage = this.offset;
      }
    })
  }
  addlocation(){
    this.locationmodal.show()
  }
  closemodal(){
  this.locationmodal.hide()
  }
  createLocation(fr:any){
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

      "orgId": this.locations.organization,
      "siteId": this.locations.site,
      "locationName": this.locations.name,
      "createdBy": this.userdetails.data.username
    }
    this.commonService.addLocation(obj).subscribe((res:any)=>{
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.locationmodal.hide();
        this.getdata();
        fr.reset()
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
      
    })  
  }
  }
  editdata(data:any){
    this.locations.organization=""
    this.editDATA= data
    this.organizationlist.find((ele:any)=>{
      if(ele.orgId===data.orgId){
        this.editlocations.organization=ele.orgName 
      }
    })
    // this.editlocations.organization= data.orgId
    this.editlocations.site= data.siteId
    this.editlocations.name= data.locationName
    this.locationId= data.locationId
    this.locationName= data.locationName
    this.locationeditmodal.show()
    this.getSitesfredit()
  }
  closeeditmodal(){
this.locationeditmodal.hide()
  }
  updatelocation(fr:any){
    let array=Object.keys(fr.value).filter((k:any)=> {
      if (fr.value[k] === "" ||  fr.value[k]===null || fr.value[k]===undefined) {
        return k;
      }
    });
if(array.length!==0){
  this.validationeditMsg= true
}else{
  this.validationeditMsg= false
    let obj={
      "orgId": this.editDATA.orgId,
      "siteId": this.editlocations.site,
      "locationId": this.locationId,
      "locationName": this.editlocations.name,
      "updatedBy": this.userdetails.data.username
    }
    this.commonService.updateLocation(obj).subscribe((res:any)=>{
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.locationeditmodal.hide();
        this.getdata();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
      
    })  
  }
  }
  hideChildModal(){
    this.deletemodal.hide()
  }
  deletedata(data:any){
    this.deletemodal.show()
    this.deleteData= data
    this.locationNameDelete = data.locationName
  }
  deleteperminently(){
    let obj={
      "locationId": this.deleteData.locationId
    }
    this.commonService.deleteLocation(obj).subscribe((res:any)=>{
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.deletemodal.hide();
        this.getdata();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    })
  }
  getSelectedOrg(){
    this.getSites()
    this.locations.site="null"
   this.editlocations.site="null"
  }
}
