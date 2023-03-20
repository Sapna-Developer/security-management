import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
})
export class ParametersComponent implements OnInit {
  @ViewChild('deletemodal') public deletemodal!: ModalDirective;
  parameters: any = {};
  LocationList: any = [];
  sitedata: any = [];
  sitesList: any = [];
  validationMsg: boolean = false;
  siteName: any;
  locationName: any;
  userdetails: any;
  paramerData: any = [];
  activeTab: any = 'addparameter';
  searchparameter: any = {};
  pageSize = 10;
  totalItems = 0;
  offset = 1;
  btn = 'Save';
  editDATA: any;
  parameterName: any;
  deleteData: any;
  constructor(
    private commonService: CommonService,
    private alertcall: AlertCallService
  ) {
    this.parameters.site = '';
    this.parameters.location = '';
  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
    }
    this.getsites();
    this.getLocationFrSite();
    this.getdata();
  }
  getdata() {
    let params = new HttpParams();
    params = params.append('limit', this.pageSize);
    params = params.append('page', this.offset);
    params = params.append('locationId', '');
    this.commonService.getParameter(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.paramerData = res.data;
        this.totalItems = res.count;
      }
    });
  }
  getsites() {
    let params = new HttpParams();
    params = params.append('orgId', '');
    this.commonService.getSitesfrorg(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        // this.sitesList=res.data;
        this.sitedata = res.data;
        this.sitedata.forEach((ele: any) => {
          ele['Name'] = ele.siteName;
          var optionText = ele.siteName;
          if (ele.siteName.length > 85) {
            var newOption = optionText.substring(0, 85);
            ele['siteName'] = newOption + '...';
          }

          // $(this).text(newOption + '...');
        });
      }
    });
  }
  getLocationFrSite() {
    this.parameters.location = '';
    this.sitedata.find((element: any) => {
      if (element.siteId === this.parameters.site) {
        this.siteName = element.Name;
      }
    });
    let params = new HttpParams();
    params = params.append(
      'siteId',
      this.parameters.site ? this.parameters.site : ''
    );
    this.commonService.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.LocationList = res.data;
      }
    });
  }
  getLocationsdata() {
    this.LocationList.find((ele: any) => {
      if (ele.locationId === this.parameters.location) {
        this.locationName = ele.locationName;
      }
    });
  }
  saveData(fr: any) {
    let array = Object.keys(fr.value).filter((k: any) => {
      if (
        fr.value[k] === '' ||
        fr.value[k] === null ||
        fr.value[k] === undefined
      ) {
        return k;
      }
    });
    if (array.length !== 0) {
      this.validationMsg = true;
    } else {
      this.validationMsg = false;
      if (this.btn === 'Save') {
        let obj = {
          siteId: this.parameters.site,
          siteName: this.siteName,
          locationId: this.parameters.location,
          locationName: this.locationName,
          parameter: this.parameters.name,
          description: this.parameters.description,
          createdBy: this.userdetails.data.username,
        };
        this.commonService.addParameter(obj).subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            fr.reset();
            this.parameters.site = '';
            this.parameters.location = '';
            this.getdata();
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
      } else {
        let obj = {
          // "siteId":this.parameters.site,
          // "siteName": this.siteName,
          // "locationId":this.parameters.location,
          // "locationName": this.locationName,
          parameter: this.parameters.name,
          description: this.parameters.description,
          paramId: this.editDATA.sysParamId,
          updatedBy: this.userdetails.data.username,
        };
        this.commonService.updateParameter(obj).subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            fr.reset();
            this.activeTab = 'List';
            this.btn = 'Save';
            this.parameters.site = '';
            this.parameters.location = '';
            this.getdata();
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
      }
    }
  }
  AddParameter(data: any) {
    this.activeTab = data;
  }
  search() {
    if (this.searchparameter.name.length > 1) {
      this.offset = 1;
      this.getdata();
    }
    if (!this.searchparameter.name) {
      this.getdata();
    }
  }
  pageChanged(ev: any) {
    this.offset = ev;
    this.getdata();
  }
  editdata(data: any) {
    this.editDATA = data;
    this.parameters.site = data.siteName;
    this.parameters.location = data.locationName;
    this.parameters.name = data.code;
    this.parameters.description = data.description;
    this.btn = 'Update';
    this.activeTab = 'addparameter';
  }
  deletedata(data: any) {
    this.deleteData = data;
    this.parameterName = data.parameter;
    this.deletemodal.show();
  }
  deleteperminently() {
    let obj = {
      id: this.deleteData.sysParamId,
    };
    this.commonService.deleteParameter(obj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.deletemodal.hide();
        this.getdata();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
  hideChildModal() {
    this.deletemodal.hide();
  }
}
