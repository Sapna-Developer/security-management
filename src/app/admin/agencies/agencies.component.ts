import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.css'],
})
export class AgenciesComponent implements OnInit {
  @ViewChild('agencymodal') public agencymodal!: ModalDirective;
  @ViewChild('AgencyMemberModal') public AgencyMemberModal!: ModalDirective;
  @ViewChild('AgencyMembereditModal')
  public AgencyMembereditModal!: ModalDirective;
  @ViewChild('deleteAgencyMembermodal')
  public deleteAgencyMembermodal!: ModalDirective;
  @ViewChild('agencyeditmodal') public agencyeditmodal!: ModalDirective;
  @ViewChild('deletemodal') public deletemodal!: ModalDirective;
  Agency: any = {};
  Agencyedit: any = {};
  organizationlist: any = [];
  sitedata: any = [];
  locationdata: any = [];
  LocationList: any = [];
  agencydata: any = [];
  userdetails: any;
  agencyID: any;
  deleteData: any;
  activeTab: any = 'agencies';
  Agencymember: any = {};
  AgencymemberEdit: any = {};
  AgencyMembersList: any = [];
  AgencyDailyAtdList: any = [];
  agencyMemberId: any;
  Amemberdeletedata: any;
  agencyName: any;
  agencyNameDelete: any;
  agencyMemberName: any;
  agencyMemberNameDelete: any;
  validationMsg: boolean = false;
  validationeditMsg: boolean = false;
  validationmemberMsg: boolean = false;
  validationmembereditMsg: boolean = false;
  offsetAgency = 1;
  offsetMember = 1;
  Dailyoffset = 1;
  DailypageSize = 10;
  totalDailyItems = 0;
  // isSelected: boolean = true;
  agencyid: any[] = [];
  agencyname: any[] = [];
  agencymemberid: any[] = [];
  memberName: any[] = [];
  memberType: any[] = [];
  attendance: any[] = [];
  createdby: any[] = [];
  // offset = 1;
  // config = {
  //   itemsPerPage: 10,
  //   currentPage: 1,
  //   totalItems: 0,
  // };
  // config1 = {
  //   itemsPerPage: 10,
  //   currentPage: 1,
  //   totalItems: 0,
  // };
  search: any = {};
  totalAgencys = 0;
  pageSizeAgency = 10;
  totalMembers = 0;
  pageSizeMember = 10;
  updatedData: any;
  selectedRow: any = [];
  // groups: any = [];
  constructor(
    public commonService: CommonService,
    public alertcall: AlertCallService
  ) {}

  ngOnInit(): void {
    this.selectedRow = [];
    // this.groups = [{ name: 'LEAVE' }, { name: 'ABSENT' }, { name: 'PRESENT' }];
    this.Agencymember.Agency = '';
    this.Agencymember.memberType = '';
    this.agencydropdowns();
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
    }
    this.getorganizations();
    this.getSites();
    this.getLocations();
    this.getdata();
    this.getAgencyMembers();
    this.getDailyAttendanceMembers();
  }
  searchbyagency() {
    if (this.search.name.length > 1) {
      this.offsetAgency = 1;
      this.getdata();
    }
    if (!this.search.name) {
      this.getdata();
    }
  }
  searchbyagencymember() {
    if (this.search.agencyname.length > 1) {
      this.offsetMember = 1;
      this.getAgencyMembers();
    }
    if (!this.search.agencyname) {
      this.getAgencyMembers();
    }
  }
  searchDailyAttMember() {
    if (this.search.membername.length > 1) {
      this.Dailyoffset = 1;
      this.getDailyAttendanceMembers();
    }
    if (!this.search.membername) {
      this.getDailyAttendanceMembers();
    }
  }
  Agencies(data: any) {
    this.activeTab = data;
  }
  agencydropdowns() {
    this.Agency.organization = '';
    this.Agency.site = '';
    // this.Agency.location = null;
  }
  pageChangedAgency(ev: any) {
    // console.log(ev);
    this.offsetAgency = ev;
    this.getdata();
  }
  getdata() {
    let params = new HttpParams();
    params = params.append('limit', 10);
    params = params.append('page', this.offsetAgency);
    params = params.append(
      'agencyName',
      this.search.name ? this.search.name : ''
    );
    this.commonService.getAgencies(params).subscribe((res: any) => {
      this.agencydata = res.data;
      console.log(this.agencydata);

      this.totalAgencys = res.count;
      // this.config.totalItems = res.count;
      // this.config.currentPage = this.o;
    });
  }
  getorganizations() {
    this.commonService.getOrganizationslist().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.organizationlist = res.data;
      }
    });
  }
  getSites() {
    this.Agency.site = '';
    let params = new HttpParams();
    params = params.append(
      'orgId',
      this.Agency.organization || this.Agencyedit.organization
        ? this.Agency.organization || this.Agencyedit.organization
        : ''
    );
    this.commonService.getSitesfrorg(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.sitedata = res.data;
        this.sitedata.forEach((ele: any) => {
          var optionText = ele.siteName;
          if (ele.siteName.length > 40) {
            var newOption = optionText.substring(0, 40);
            ele['siteName'] = newOption + '...';
          }
        });
      }
    });
  }
  getLocations() {
    this.commonService.getLocation().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationdata = res.data;
      }
    });
  }
  getLocationFrSite() {
    let params = new HttpParams();
    params = params.append('siteId', this.Agency.site);
    this.commonService.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.LocationList = res.data;
      }
    });
  }
  addagency() {
    this.agencymodal.show();
  }
  closemodal() {
    this.agencymodal.hide();
  }
  createAgency(form: any) {
    let array = Object.keys(form.value).filter((k: any) => {
      if (
        form.value[k] === '' ||
        form.value[k] === null ||
        form.value[k] === undefined
      ) {
        return k;
      }
    });
    console.log(this.Agency.site);

    console.log(array);

    if (array.length !== 0) {
      this.validationMsg = true;
    } else {
      this.validationMsg = false;
      let obj = {
        orgId: this.Agency.organization,
        siteId: this.Agency.site,
        agencyName: this.Agency.name,
        address: this.Agency.address,
        createdBy: this.userdetails.data.username,
        // "locationId": this.Agency.location
      };
      this.commonService.addAgency(obj).subscribe((res: any) => {
        if (res && res['status'] == 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          this.agencymodal.hide();
          form.reset();
          this.agencydropdowns();
          this.getdata();
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
      });
    }
  }
  editdata(data: any) {
    console.log(data);

    this.Agency.organization = '';
    this.Agencyedit.organization = data.orgId;
    console.log(this.Agencyedit.organization);
    this.Agencyedit.site = data.siteId;
    this.Agencyedit.location = data.locationId;
    this.Agencyedit.name = data.agencyName;
    this.Agencyedit.address = data.address;
    this.agencyID = data.agencyId;
    this.agencyName = data.agencyName;
    this.agencyeditmodal.show();
    this.getSites();
  }
  closeeditmodal() {
    this.agencyeditmodal.hide();
  }
  updateAgency(fr: any) {
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
      this.validationeditMsg = true;
    } else {
      this.validationeditMsg = false;
      let obj = {
        agencyId: this.agencyID,
        orgId: this.Agencyedit.organization,
        siteId: this.Agencyedit.site,
        // "locationId": this.Agencyedit.location,
        agencyName: this.Agencyedit.name,
        address: this.Agencyedit.address,
        updatedBy: this.userdetails.data.username,
      };
      this.commonService.updateAgency(obj).subscribe((res: any) => {
        if (res && res['status'] == 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          this.agencyeditmodal.hide();
          this.getdata();
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
      });
    }
  }
  hideChildModal() {
    this.deletemodal.hide();
  }
  deletedata(data: any) {
    this.deletemodal.show();
    this.deleteData = data;
    this.agencyNameDelete = data.agencyName;
  }
  deleteperminently() {
    let obj = {
      agencyId: this.deleteData.agencyId,
    };
    this.commonService.deleteAgency(obj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.deletemodal.hide();
        this.getdata();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
  agencyMembers() {
    this.AgencyMemberModal.show();
  }
  closeAgencyMembermodal() {
    this.AgencyMemberModal.hide();
  }
  addAgencyMembers(fr: any) {
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
      this.validationmemberMsg = true;
    } else {
      this.validationmemberMsg = false;
      let obj = {
        agencyId: this.Agencymember.Agency,
        memberType: this.Agencymember.memberType,
        memberName: this.Agencymember.memberName,
        // "memberDetails": {},
        createdBy: this.userdetails.data.username,
      };
      this.commonService.addAgencyMember(obj).subscribe((res: any) => {
        if (res && res['status'] == 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          this.closeAgencyMembermodal();
          fr.reset();
          this.getAgencyMembers();
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
      });
    }
  }
  pageChangedMember(ev: any) {
    this.offsetMember = ev;
    this.getAgencyMembers();
  }
  getAgencyMembers() {
    let params = new HttpParams();
    params = params.append('limit', 10);
    params = params.append('page', this.offsetMember);
    params = params.append(
      'memberName',
      this.search.agencyname ? this.search.agencyname : ''
    );
    params = params.append('module', 'agency');
    this.commonService.getAgencyMembersList(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.AgencyMembersList = res.data;
        this.totalMembers = res.count;
        // this.config1.totalItems = res.count;
        // this.config1.currentPage = this.offsetMember;
      }
    });
  }
  getDailyAttendanceMembers() {
    let params = new HttpParams();
    params = params.append('limit', this.DailypageSize);
    params = params.append('page', this.Dailyoffset);
    params = params.append(
      'memberName',
      this.search.membername ? this.search.membername : ''
    );
    params = params.append(
      'agencyId',
      this.Agencymember.Agency ? this.Agencymember.Agency : ''
    );
    this.commonService.getDailyAttendance(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.AgencyDailyAtdList = res.data;
        this.totalDailyItems = res.count;
        this.AgencyDailyAtdList.forEach((element: any) => {
          element['status'] = '';
        });
        // console.log(this.AgencyDailyAtdList);
      }
    });
  }
  pageChanged2(ev: any) {
    this.Dailyoffset = ev;
    this.getDailyAttendanceMembers();
  }
  onChange(data: any) {
    this.selectedRow.push(data);
    // this.selectedRow.forEach((ele: any) => {
    //   // console.log(ele);
    //   // ele.attendenceStatus = ele.status;
    // });
    this.submitAll();
  }
  submitAll() {
    this.selectedRow.forEach((ele: any) => {
      // console.log(ele);
      ele.attendanceStatus = ele.status;
    });
    // console.log(this.attendance);

    // console.log(this.selectedRow);
    let obj = {
      attendance: this.selectedRow,
      updatedBy: this.userdetails.data.username,
    };
    this.commonService.manageAttendance(obj).subscribe((res: any) => {
      if (res.status === 'success') {
        this.updatedData = res.data;
        this.getDailyAttendanceMembers();
        this.selectedRow = [];
      }

      // if (ele.isSelected === false) {
      //   ele['attendenceStatus'] = 'absent';
      // }
      // if (res && res['status'] == 'success') {
      //   this.updatedData = res.data;

      //   this.alertcall.showSuccess('Success', res['message']);
      //   this.getDailyAttendanceMembers();
      // } else {
      //   this.alertcall.showWarning('Alert', res['message']);
      //   this.getDailyAttendanceMembers();
      // }
    });
  }
  editMember(data: any) {
    this.agencyMemberId = data.agencyMemberId;
    this.AgencyMembereditModal.show();
    this.AgencymemberEdit.Agency = data.agencyId;
    this.AgencymemberEdit.memberType = data.memberType;
    this.AgencymemberEdit.memberName = data.memberName;
    this.agencyMemberName = data.memberName;
  }
  closeAgencyMembereditmodal() {
    this.AgencyMembereditModal.hide();
  }
  updateAgencyMembers(fr: any) {
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
      this.validationmembereditMsg = true;
    } else {
      this.validationmembereditMsg = false;
      let editObj = {
        agencyMemberId: this.agencyMemberId,
        agencyId: this.AgencymemberEdit.Agency,
        memberType: this.AgencymemberEdit.memberType,
        memberName: this.AgencymemberEdit.memberName,
        // "memberDetails": {},
        updatedBy: this.userdetails.data.username,
      };
      this.commonService.updateAgencyMember(editObj).subscribe((res: any) => {
        if (res && res['status'] == 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          this.closeAgencyMembereditmodal();
          fr.reset();
          this.getAgencyMembers();
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
      });
    }
  }
  deleteMember(data: any) {
    this.deleteAgencyMembermodal.show();
    this.Amemberdeletedata = data;
    this.agencyMemberNameDelete = data.memberName;
  }
  hideChildModal1() {
    this.deleteAgencyMembermodal.hide();
  }
  deletememberperminently() {
    let deleteObj = {
      agencyMemberId: this.Amemberdeletedata.agencyMemberId,
    };
    this.commonService.deleteAgencyMember(deleteObj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.hideChildModal1();
        this.getAgencyMembers();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
  getSelectedOrg() {
    this.Agencyedit.site = '';
    this.getSites();
  }
}
