import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Base64 } from 'js-base64';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-compnieslist',
  templateUrl: './compnieslist.component.html',
  styleUrls: ['./compnieslist.component.css'],
})
export class CompnieslistComponent implements OnInit {
  @ViewChild('addModel')
  public addModel!: ModalDirective;
  @ViewChild('editModel')
  public editModel!: ModalDirective;
  @ViewChild('deletemodal')
  public deletemodal!: ModalDirective;
  companyList: any = [];
  company: any = {};
  editcompany: any = {};
  userdetails: any = {};
  companyID: any;
  deleteDATA: any;
  organizationlist: any = [];
  search: any = {};
  searchrow: boolean = false;
  searchrowname: boolean = false;
  searchrowmail: boolean = false;
  searchrowcontact: boolean = false;
  organizationname: any = null;
  offset = 1;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };
  sortDir = 1; //1= 'ASE' -1= DSC
  validationMsg:boolean = false;
  validationMsgedit:boolean = false;
  companyName: any;
  companyNamefrDelete: any;
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";  
  emianPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"; 
  constructor(
    private commonService: CommonService,
    private alertcall: AlertCallService
  ) {}

  ngOnInit(): void {
    this.company.organization = null;
    this.editcompany.organization = null;
    this.getorganizations();
    this.getCompanies();
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
    }
  }
  getorganizations() {
    this.commonService.getOrganizationslist().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.organizationlist = res.data;
      }
    });
  }
  getCompanies() {
    let params = new HttpParams();
    params = params.append(
      'orgId',
      this.organizationname ? this.organizationname : ''
    );
    params = params.append(
      'companyName',
      this.search.name ? this.search.name : ''
    );
    // params = params.append(
    //   'companyEmail',
    //   this.search.mail ? this.search.mail : ''
    // );
    // params = params.append(
    //   'companyMobile',
    //   this.search.contact ? this.search.contact : ''
    // );
    params = params.append('limit', 10);
    params = params.append('page', this.offset);
    this.commonService.getCompanyList(params).subscribe((res: any) => {
      if (res.status === 'success') {
        this.companyList = res.data;
        this.config.totalItems = res.count;
        this.config.currentPage = this.offset;
      }
    });
  }

  addCompany() {
    this.addModel.show();
  }
  closeAddModel() {
    this.addModel.hide();
  }
  getselected() {
    console.log(this.company.organization);
  }
  createCompany(fr:any) {
    if(fr.invalid){
      return
    }else{
    let array=Object.keys(fr.value).filter((k:any)=> {
      if (fr.value[k] === "" ||  fr.value[k]===null || fr.value[k]===undefined) {
        return k;
      }
    });
  if(array.length!==0){
  this.validationMsg= true
  }else{
    this.validationMsg= false
    let obj = {
      orgId: this.company.organization,
      createdBy: this.userdetails.data.username,
      companyName: this.company.name,
      // companyId: this.company.companyid,
      companyEmail: this.company.email,
      companyMobile: this.company.mobile,
      companyAddress: this.company.address,
      companyFacilitades: this.company.facilitates,
    };
    this.commonService.addCompany(obj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.addModel.hide();
        fr.reset()
        this.getCompanies();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
}
  }
  editdata(data: any) {
    this.companyName= data.companyName
    this.editModel.show();
    this.editcompany.name = data.companyName;
    this.editcompany.emailId = data.companyEmail;
    this.editcompany.mobileNumber = data.companyMobile;
    this.editcompany.companyid = data.companyId;
    this.editcompany.address = data.companyAddress;
    this.editcompany.facilitates = data.companyFacilitades;
    this.editcompany.organization = data.orgId;
    this.companyID = data._id;
  }
  closeeditModel() {
    this.editModel.hide();
  }
  updateCompany(fr:any) {
    if(fr.invalid){
      return
    }else{
    let array=Object.keys(fr.value).filter((k:any)=> {
      if (fr.value[k] === "" ||  fr.value[k]===null || fr.value[k]===undefined) {
        return k;
      }
    });
  if(array.length!==0){
  this.validationMsgedit= true
  }else{
    this.validationMsgedit= false
    let editobj = {
      // id: this.companyID,
      orgId: this.editcompany.organization,
      updatedBy: this.userdetails.data.username,
      companyName: this.editcompany.name,
      companyId: this.editcompany.companyid,
      companyEmail: this.editcompany.emailId,
      companyMobile: String(this.editcompany.mobileNumber),
      companyAddress: this.editcompany.address,
      companyFacilitades: this.editcompany.facilitates,
    };
    this.commonService.updateCompany(editobj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.editModel.hide();
        fr.reset()
        this.getCompanies();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
}
  }
  deletedata(data: any) {
    this.companyNamefrDelete= data.companyName
    this.deletemodal.show();
    this.deleteDATA = data;
  }
  deleteperminently() {
    let deleteobj = {
      id: this.deleteDATA.companyId,
      // orgId: this.deleteDATA.orgId,
    };
    this.commonService.deleteCompany(deleteobj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.deletemodal.hide();
        this.getCompanies();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
  hideChildModal() {
    this.deletemodal.hide();
  }
  searchbyname() {
    if (this.search.name.length > 1) {
      this.offset=1
      this.getCompanies();
    } else if (this.search.name == 0) {
      console.log('heello');
      this.getCompanies();
    }
  }
  // searchbymail() {
  //   if (this.search.mail.length > 1) {
  //     this.getCompanies();
  //   } else if (!this.search.mail) {
  //     this.getCompanies();
  //   }
  // }
  searchbycontact() {
    if (this.search.contact.length > 1) {
      this.getCompanies();
    } else if (!this.search.contact) {
      this.getCompanies();
    }
  }
  getselectedorgdata() {
    this.getCompanies();
  }
  pageChanged(ev: any) {
    this.offset = ev;
    this.getCompanies();
  }
  onSortClick(event: any, data: any) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    if (data === 'companyname') {
      this.sortArr('companyName');
    } else if (data === 'companyid') {
      this.sortArr('companyId');
    } else if (data === 'email') {
      this.sortArr('companyEmail');
    } else if (data === 'address') {
      this.sortArr('companyAddress');
    }
  }

  sortArr(colName: any) {
    this.companyList.sort((a: any, b: any) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
}
