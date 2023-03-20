import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-soreporting',
  templateUrl: './soreporting.component.html',
  styleUrls: ['./soreporting.component.css'],
})
export class SoreportingComponent implements OnInit {
  @ViewChild('deletemodal') public deletemodal!: ModalDirective;
  soreports: any = {};
  parameters: any = [];
  validationMsg: boolean = false;
  userdetails: any;
  requiredSoList: any = [];
  paramerData: any = [];
  locationdata: any = [];
  sitedata: any = {};
  activeTab: any = 'soreport';
  siteList: any = [];
  dropdown: any = { site: '', location: '' };
  reportData: any = [];
  LocationList: any = [];
  pageSize = 10;
  totalItems = 0;
  offset = 1;
  editDATA: any;
  btn = 'Save';
  deleteData: any;
  reportName: any;
  constructor(
    private commonService: CommonService,
    private alertcall: AlertCallService
  ) {}

  ngOnInit(): void {
    this.soreports.location = '';
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
    }
    this.getrequiredsolist();
    this.getLocations();
    this.getdata();
    this.getsites();
  }
  getParameters(data: any) {
    let params = new HttpParams();
    params = params.append('locationId', data ? data : '');
    this.commonService.getParameter(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.paramerData = res.data;
        this.paramerData.forEach((ele: any) => {
          // if(!ele.status&&!ele.criticality){
          ele['status'] = '';
          ele['criticality'] = 'normal';
          // }
        });
      }
    });
  }
  getselected(data: any) {
    console.log(data);
  }
  saveData(fr: any) {
    let validation: any = false;
    let array = Object.keys(fr.value).filter((k: any) => {
      if (
        fr.value[k] === '' ||
        fr.value[k] === null ||
        fr.value[k] === undefined
      ) {
        return k;
      }
    });
    this.paramerData.forEach((element: any) => {
      let array1 = Object.keys(element).filter((k: any) => {
        if (
          element[k] === '' ||
          element[k] === null ||
          element[k] === undefined
        ) {
          return k;
        }
      });
      if (array1.length !== 0) {
        validation = true;
      }
    });
    if (array.length !== 0 || validation === true) {
      this.validationMsg = true;
    } else {
      this.validationMsg = false;
      let params: any = [];
      this.paramerData.forEach((element: any) => {
        params.push({
          parameter: element.parameter,
          description: element.description,
          status: element.status,
          criticality: element.criticality,
        });
      });
      if (this.btn === 'Save') {
        let obj = {
          siteId: this.sitedata.siteId,
          siteName: this.sitedata.siteName,
          locationId: this.soreports.location,
          locationName: this.sitedata.locName,
          securityOfficerId: this.userdetails.data.employee_id,
          securityOfficerName: this.userdetails.data.username,
          report: params,
          createdBy: this.userdetails.data.username,
          // // "difficultyStatus":"test",
          // "createdBy":this.userdetails.data.username
          // "siteId":this.parameters.site,
          // "locationId":this.parameters.location,
          // "name":this.parameters.name,
          // "description":this.parameters.description
        };
        this.commonService.addSoReport(obj).subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            fr.reset();
            this.getdata();
            this.paramerData = [];
            this.soreports.location = '';
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
      } else {
        let obj = {
          reportId: this.editDATA.soRepId,
          //  "siteId":this.sitedata.siteId,
          // "siteName":this.sitedata.siteName,
          // "locationId":this.soreports.location,
          // "locationName":this.sitedata.locName,
          // "securityOfficerId":this.userdetails.data.employee_id,
          // "securityOfficerName":this.userdetails.data.username,
          report: params,
          updatedBy: this.userdetails.data.username,
        };
        this.commonService.updateReport(obj).subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            fr.reset();
            this.getdata();
            this.activeTab = 'List';
            this.paramerData = [];
            this.btn = 'Save';
            this.soreports.location = '';
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
      }
    }
  }
  getrequiredsolist() {
    this.requiredSoList = [];
    let params = new HttpParams();
    params = params.append(
      'securityOfficerId',
      this.userdetails.data.employee_id
    );
    // params = params.append("limit",this.pageSizerequiredSO)
    // params = params.append("page",this.offsetrequiredSO)
    // params = params.append("siteName",this.searchSO.name?this.searchSO.name:"")
    this.commonService.getRequiredSoList(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        res.data.forEach((element: any) => {
          this.requiredSoList.push(element.locations);
        });
        // this.totalrequiredSOitems = res.count;
      }
    });
  }
  getselectedloc() {
    this.locationdata.find((element: any) => {
      if (element.locationId === this.soreports.location) {
        this.sitedata = {
          siteId: element.siteId,
          siteName: element.siteName,
          locName: element.locationName,
        };
      }
    });
    console.log(this.sitedata);

    this.getParameters(this.soreports.location);
  }
  getLocations() {
    this.commonService.getLocation().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationdata = res.data;
      }
    });
  }
  SOReport(data: any) {
    this.activeTab = data;
  }
  getdata(){
    let params = new HttpParams()
    params = params.append("locationId",this.dropdown.location?this.dropdown.location:"")
    params = params.append("limit",10)
    params = params.append("page",this.offset)
    this.commonService.getSOReport(params).subscribe((res:any)=>{
      if(res&&res['status']=='success'){
        this.reportData=res.data
        this.totalItems = res.count
      }
    });
  }
  getsites() {
    let params = new HttpParams();
    params = params.append('orgId', '');
    this.commonService.getSitesfrorg(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        // this.sitesList=res.data;
        this.siteList = res.data;
        this.siteList.forEach((ele: any) => {
          ele['Name'] = ele.siteName;
          var optionText = ele.siteName;
          if (ele.siteName.length > 37) {
            var newOption = optionText.substring(0, 37);
            ele['siteName'] = newOption + '...';
          }

          // $(this).text(newOption + '...');
        });
      }
    });
  }
  getLocationFrSite() {
    this.dropdown.location = '';
    // this.sitedata.find((element:any) => {
    //   if(element.siteId===this.parameters.site){
    //  this.siteName= element.Name
    //   }
    // });
    let params = new HttpParams();
    params = params.append(
      'siteId',
      this.dropdown.site ? this.dropdown.site : ''
    );
    this.commonService.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.LocationList = res.data;
      }
    });
  }
  pageChanged(ev: any) {
    this.offset = ev;
    this.getdata();
  }
  editdata(data: any) {
    this.editDATA = data;
    this.soreports.location = data.locationName;
    this.paramerData = data.report;
    this.btn = 'Update';
    this.activeTab = 'soreport';
  }
  deletedata(data: any) {
    this.deleteData = data;
    this.reportName = data.locationName;
    this.deletemodal.show();
  }
  deleteperminently() {
    let obj = {
      id: this.deleteData.soRepId,
    };
    this.commonService.deleteSOReport(obj).subscribe((res: any) => {
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
