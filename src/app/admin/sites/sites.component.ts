import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {
  @ViewChild('sites')
  public sites!: ModalDirective;
  @ViewChild('siteeditmodal')
  public siteeditmodal!: ModalDirective;
  @ViewChild('deletemodal')public deletemodal!: ModalDirective;
  deleteData: any;
  siteId: any;
  siteName: any;
  siteNameDelete: any;
  editData: any;
  constructor(private commonService:CommonService, private alertcall:AlertCallService) { }
  userdetails: any;
  site:any={}
  editsite:any={}
  organizationlist:any=[]
  sitedata:any=[]
  validationMsg:boolean = false;
  validationMsgedit:boolean = false
  offset:any=1;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };
  Regions:any=[]
  States:any=[]
  Clusters:any=[]
  search:any={}
  ngOnInit(): void {
    this.site.organization = null;
    this.site.region=null;
    this.site.cluster=null
    this.site.state=null
    this.editsite.organization = null;
    this.editsite.region=null;
    this.editsite.cluster=null
    this.editsite.state=null
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
      
    }
    this.getorganizations()
    this.getdata()
    this.getRegions()
    this.getClusters()
  }
  searchbysite(){
    if(this.search.name.length>1){
      this.offset=1
     this.getdata() 
    }if(!this.search.name){
      this.getdata()
    }
  }
  getRegions(){
    this.commonService.getRegions().subscribe((res:any)=>{
      if(res&&res['status']==="success"){
        this.Regions= res.data
      }
    })
  }
  getselectedRegion(){
    if(this.site.region){
   this.getStates()
    }
  }
  getStates(){
    let params = new HttpParams()
    params = params.append("region",this.site.region?this.site.region:this.editData.region)
    this.commonService.getStates(params).subscribe((res:any)=>{
      if(res&&res['status']==="success"){
        this.States= res.data
        if(this.editData.region){
          this.States.forEach((element:any) => {
          if(element===this.editData.state){
            this.editsite.state = element
          }  
          });
        }
      }
    })
  }
  getClusters(){
    this.commonService.getClusters().subscribe((res:any)=>{
      if(res&&res['status']==="success"){
        this.Clusters= res.data
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
    this.commonService.getSiteswthpagination(params).subscribe((res:any)=>{
      if (res && res['status'] == 'success') {
        this.sitedata = res.data;
        this.config.totalItems = res.count;
        this.config.currentPage = this.offset;
      }
    })
  }
  getorganizations() {
    this.commonService.getOrganizationslist().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.organizationlist = res.data;
      }
    });
  }
  addsites(){
    this.sites.show()
    // this.validationMsg = false;
    }
    closemodal(){
    this.sites.hide()
    }
    createSite(fr:any){
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
        "orgId": this.site.organization,
        "createdBy": this.userdetails.data.username,
        "siteName": this.site.name,
        "siteAddress": this.site.address,
        "region": this.site.region,
        "state" : this.site.state,
        "cluster": this.site.cluster,
        "latitude": this.site.latitude,
        "longitude": this.site.longitude
      }
      this.commonService.addSite(obj).subscribe((res:any)=>{
        if (res && res['status'] == 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          this.sites.hide();
          this.getdata();
          fr.reset()
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
        
      })
    }
    }
    editdata(data:any){
      this.organizationlist.find((ele:any)=>{
        if(ele.orgId===data.orgId){
          this.editsite.organization=ele.orgName
        }
      })
      this.editData= data
      // this.editsite.organization= data.orgId
      this.editsite.name= data.siteName
      this.editsite.address= data.siteAddress
      this.editsite.region= data.region
      this.editsite.latitude = data.latitude
      this.editsite.longitude = data.longitude
      this.getStates()
      // this.editsite.state= data.state
      this.editsite.cluster= data.cluster
      this.siteId= data.siteId
      this.siteName = data.siteName
      this.siteeditmodal.show()
      // this.validationMsgedit = false;
    }
    closeeditmodal(){
this.siteeditmodal.hide()
    }
    deletedata(data:any){
      this.deletemodal.show()
      this.deleteData= data
      this.siteNameDelete = data.siteName
    }
    deleteperminently(){
      let obj={
        "siteId": this.deleteData.siteId
      }
      this.commonService.deleteSite(obj).subscribe((res:any)=>{
        if (res && res['status'] == 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          this.deletemodal.hide();
          this.getdata();
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
      })
    }
    hideChildModal(){
      this.deletemodal.hide()
    }
    updatesite(fr:any){
      let array=Object.keys(fr.value).filter((k:any)=> {
        if (fr.value[k] === "" ||  fr.value[k]===null || fr.value[k]===undefined) {
          return k;
        }
      });
  if(array.length!==0){
    this.validationMsgedit= true
  }else{
    this.validationMsgedit= false
      let obj={
        "orgId": this.editData.orgId,
        "updatedBy": this.userdetails.data.username,
        "siteName": this.editsite.name,
        "siteId": this.siteId,
        "siteAddress": this.editsite.address,
        "region": this.editsite.region,
        "state" : this.editsite.state,
        "cluster": this.editsite.cluster,
        "latitude": this.editsite.latitude,
        "longitude": this.editsite.longitude
      }
      this.commonService.updateSite(obj).subscribe((res:any)=>{
        if (res && res['status'] == 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          this.siteeditmodal.hide();
          this.getdata();
          fr.reset()
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
        
      })
    }
    }
}
