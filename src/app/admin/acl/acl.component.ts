import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Componentlist } from '../componentlist';
import * as moment from 'moment';
import { AlertCallService } from 'src/app/services/alert-call.service';
@Component({
  selector: 'app-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.css'],
})
export class ACLComponent implements OnInit {
  componentList = new Componentlist();
  UserPermission: any = [];
  selected: any;
  selectedItems = [];
  dropdownSettings = {};
  dropdownList: any = [];
  organizationlist: any = [];
  modal: any = {};
  companyList: any = [];
  userdetails: any;
  constructor(private commonService: CommonService, private alertcall:AlertCallService) {}

  ngOnInit(): void {
    this.modal.organization = null;
    this.modal.company = null;
    this.modal.user = null;
    this.UserPermission = this.componentList.userpermissions;
    this.UserPermission.forEach((element: any) => {
      element['checked'] = false;
      element['read'] = false;
      element['write'] = false;
      element['delete'] = false;
    });
    console.log(this.UserPermission);
    this.getorganizations();
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
  getselectedorgdata() {
    if (this.modal.organization) {
      this.getCompanys();
    }
  }
  getselectedcompany() {}
  getCompanys() {
    let params = new HttpParams();
    params = params.append(
      'orgId',
      this.modal.organization ? this.modal.organization : ''
    );
    params = params.append('companyName', '');
    params = params.append('companyEmail', '');
    params = params.append('companyMobile', '');
    params = params.append('limit', '');
    params = params.append('page', '');
    this.commonService.getCompanyList(params).subscribe((res: any) => {
      if (res.status === 'success') {
        this.companyList = res.data.companies;
      }
    });
  }
  updateChecked(data: any, ev: any) {
    this.UserPermission.forEach((element: any) => {
      if (element.checked === false) {
        element.read = false;
        element.write = false;
        element.delete = false;
      }
    });
  }
  getselectedread() {}
  getselectedwrite() {}
  getselecteddelete() {}
  saveData() {
    let newraay: any = [];
    this.UserPermission.forEach((element: any) => {
      if (element.checked === true) {
        newraay.push({
          name: element.name,
          read: element.read,
          write: element.write,
          delete: element.delete,
        });
      }
    });
    let obj = {
      orgId: this.modal.organization,
      companyId: this.modal.company,
      userName: this.modal.user,
      createdBy: this.userdetails.data.username,
      createdOn: moment(new Date()).format('YYYY-MM-DD'),
      acl: newraay,
    };
    this.commonService.addAcl(obj).subscribe((res: any) => {
      if(res&&res['status']=="success"){
        this.alertcall.showSuccess("Success",res['message'])
      }else{
        this.alertcall.showWarning("Alert",res['message'])
      }
    });
  }
  getselecteduser() {
    console.log(this.modal.user);
  }
}
