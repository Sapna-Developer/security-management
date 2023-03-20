import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { elementAt } from 'rxjs';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';
const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-securitydeploy',
  templateUrl: './securitydeploy.component.html',
  styleUrls: ['./securitydeploy.component.css'],
})
export class SecuritydeployComponent implements OnInit {
  @ViewChild('deletemodal') public deletemodal!: ModalDirective;
  @ViewChild('deploymentmodal') public deploymentmodal!: ModalDirective;
  @ViewChild('Redeploymentmodal') public Redeploymentmodal!: ModalDirective;
  @ViewChild('butn') public butn!: ElementRef;
  userdetails: any;
  sitedata: any = [];
  organizationlist: any = [];
  siteName: any;
  locationName: any;
  activeTab = 'securitydeploy';
  soData: any = [];
  btn: any = 'Submit';
  employeeassignedId: any;
  orgNmae: any;
  deleteData: any;
  SOData: any = [];
  soName: any;
  requiredSoList: any = [];
  deployment: any = {};
  agencydata: any = [];
  supervisorscount: any = 0;
  guardscount: any = 0;
  deploymentdata: any;
  DATA: any;
  locationsData: any = [];
  reDeployData: any;
  locationNAME: any;
  selectedValue: any;
  selectedSO: any;
  soEditData: any;
  validationMsg: boolean = false;
  p = 1;
  securityfrDelete: any;
  siteID: any;
  constructor(
    public commonService: CommonService,
    private alertcall: AlertCallService
  ) {}
  security: any = {};
  locationdata: any = [];
  supguarddata: any = [];
  supervisorArray: any = [];
  guardArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  deployedMemList: any = [];
  supervisorsList: any = [];
  guardsList: any = [];
  LocationList: any = [];
  dropdownList: any = [];
  Redeploy: any = {};
  deployedMembersListSup: any = [];
  deployedMembersListGuards: any;
  SOList: any = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  OFFSET: any = 1;
  offsetSO = 1;
  totalSOitems = 0;
  pageSizeSO = 10;
  offsetrequiredSO = 1;
  totalrequiredSOitems = 0;
  pageSizerequiredSO = 10;
  search: any = {};
  searchSO: any = {};
  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      itemsShowLimit: 2,
    };
    this.security.so = null;
    this.security.shift = null;
    this.security.guards = null;
    this.security.location = null;
    this.security.supervisors = null;
    this.security.organization = null;
    this.security.site = null;
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
    }
    this.getsites();
    this.getLocations();
    this.getorganizations();
    this.getsodata();
    // this.getSolist()
    this.getrequiredsolist();
  }
  searchbyname() {
    if (this.search.name.length > 1) {
      this.offsetSO = 1;
      this.getsodata();
    }
    if (!this.search.name) {
      this.getsodata();
    }
  }
  searchbysite() {
    if (this.searchSO.name.length > 1) {
      this.offsetrequiredSO = 1;
      this.getrequiredsolist();
    }
    if (!this.searchSO.name) {
      this.getrequiredsolist();
    }
  }
  pageChangedSO(ev: any) {
    this.offsetSO = ev;
    this.getsodata();
  }
  pageChangedrequiredSO(ev: any) {
    this.offsetrequiredSO = ev;
    this.getrequiredsolist();
  }
  getAgencydata(data: any) {
    let params = new HttpParams();
    // params = params.append("limit",1000)
    // params = params.append("page",1)
    params = params.append('siteId', data);
    this.commonService.getAgencies(params).subscribe((res: any) => {
      this.agencydata = res.data;
    });
  }
  getsupdata() {
    // this.supervisorArray=[]
    // this.guardArray=[]
    let params = new HttpParams();
    params = params.append('siteId', this.siteID ? this.siteID : '');
    params = params.append(
      'agencyId',
      this.deployment.agency ? this.deployment.agency : ''
    );
    params = params.append('memberType', 'supervisor');
    this.commonService.getAgencyMember(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.supervisorArray = res.data;
        this.supervisorscount = res.count;
        this.supervisorArray.forEach((ele: any) => {
          ele['checked'] = false;
          // ele['item_id']=ele.agencyMemberId
          // ele['item_text'] = ele.memberName
        });
      }
    });
  }
  getguarddata() {
    let params = new HttpParams();
    params = params.append('siteId', this.siteID ? this.siteID : '');
    params = params.append(
      'agencyId',
      this.deployment.agency ? this.deployment.agency : ''
    );
    params = params.append('memberType', 'guard');
    this.commonService.getAgencyMember(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.guardArray = res.data;
        this.guardscount = res.count;
        this.guardArray.forEach((ele: any) => {
          ele['checked'] = false;
        });
      }
    });
  }
  getrequiredsolist() {
    let params = new HttpParams();
    params = params.append(
      'securityOfficerId',
      this.userdetails.data.employee_id
    );
    params = params.append('limit', this.pageSizerequiredSO);
    params = params.append('page', this.offsetrequiredSO);
    params = params.append(
      'siteName',
      this.searchSO.name ? this.searchSO.name : ''
    );
    this.commonService.getRequiredSoList(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.requiredSoList = res.data;
        this.totalrequiredSOitems = res.count;
      }
    });
  }
  openDeployemntmodal(data: any) {
    // for multiple locations
    // this.locationsData= data.location
    this.siteID = data.siteId;
    this.deploymentdata = data.locations.locationName;
    this.DATA = data;
    //  this.guardArray=[]
    //  this.supervisorArray=[]
    //  this.guardscount=""
    //  this.supervisorscount=""
    this.deployment.agency = '';
    this.deployment.location = '';
    this.deploymentmodal.show();
    this.getguarddata();
    this.getsupdata();
    this.getAgencydata(data.siteId);
  }
  closedeploymentmodal() {
    this.deploymentmodal.hide();
  }
  openReDeployemntmodal(data: any) {
    this.reDeployData = data;
    this.locationNAME = data.locations.locationName;
    this.getDeploymentList();
    this.Redeploymentmodal.show();
    //  this.getLocationFrSite(data)
    this.Redeploy.Location = null;
    this.Redeploy.guardLocation = null;
  }
  getDeploymentList() {
    this.supervisorsList = [];
    this.guardsList = [];
    let params = new HttpParams();
    params = params.append(
      'locationId',
      this.reDeployData.locations.locationId
    );
    params = params.append(
      'employeeAssignedId',
      this.reDeployData.employeeAssignedId
    );
    params = params.append('siteId', this.reDeployData.siteId);
    this.commonService.getDeployedMembers(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.deployedMemList = res.data;
        if (res.data.length !== 0) {
          if (res.data[0].supervisors.length !== 0) {
            this.supervisorsList = res.data[0].supervisors;
          }
          if (res.data[0].guards.length !== 0) {
            this.guardsList = res.data[0].guards;
          }
        }
        //  this.deployedMemList.forEach((element:any) => {
        //   if(element.supervisors.length!==0){
        //     element.supervisors.forEach((ele:any) => {
        //       this.supervisorsList.push(ele)
        //     });
        //   } if(element.guards.length!==0){
        //     element.guards.forEach((ele:any) => {
        //       this.guardsList.push(ele)
        //     });
        //   }
        //  });
      }
    });
  }
  closeRedeploymentmodal() {
    this.getrequiredsolist();
    this.Redeploymentmodal.hide();
  }
  Redeployform() {}
  getcheckedvalue(ev: any) {
    this.supervisorArray.forEach((ele: any) => {
      if (ele.agencyMemberId === ev.agencyMemberId) {
        ele.checked = !ele.checked;
      }
    });
  }
  getcheckedvalueguard(data: any) {
    this.guardArray.forEach((ele: any) => {
      if (ele.agencyMemberId === data.agencyMemberId) {
        ele.checked = !ele.checked;
      }
    });
  }
  deployform() {
    if (
      this.DATA.locations.deployedSupervisorsCount === 0 &&
      this.DATA.locations.deployedGaurdsCount === 0
    ) {
      let guards: any = [];
      let supervisors: any = [];
      this.guardArray.forEach((element: any) => {
        if (element.checked === true) {
          guards.push({
            agencyId: this.deployment.agency,
            agencyMemberId: element.agencyMemberId,
            memberName: element.memberName,
          });
        }
      });
      this.supervisorArray.forEach((element: any) => {
        if (element.checked === true) {
          supervisors.push({
            agencyId: this.deployment.agency,
            agencyMemberId: element.agencyMemberId,
            memberName: element.memberName,
          });
        }
      });
      if (
        this.DATA.locations.requiredSupervisorsCount <
        this.DATA.locations.deployedSupervisorsCount + supervisors.length
      ) {
        this.alertcall.showWarning(
          'Alert',
          'Deployed SupervisorCount Is Exceded'
        );
        return;
      }
      if (
        this.DATA.locations.requiredGaurdsCount <
        this.DATA.locations.deployedGaurdsCount + guards.length
      ) {
        this.alertcall.showWarning('Alert', 'Deployed GuardCount Is Exceded');
        return;
      }
      let obj = {
        // "agencyId": this.deployment.agency ,
        siteId: this.DATA.siteId,
        // "locationId":this.deployment.location,
        locationId: this.DATA.locations.locationId,
        supervisors: supervisors,
        guards: guards,
        employeeAssignedId: this.DATA.employeeAssignedId,
        createdBy: this.userdetails.data.username,
      };
      this.commonService.deploySuporGuards(obj).subscribe((res: any) => {
        if (res && res['status'] == 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          this.deployment = {};
          this.guardArray = [];
          this.supervisorArray = [];
          this.guardscount = '';
          this.supervisorscount = '';
          this.deploymentmodal.hide();
          this.getrequiredsolist();
        } else {
          this.alertcall.showWarning('Success', res['message']);
        }
      });
    } else {
      this.getDeployedSupGuards();
    }
  }
  getDeployedSupGuards() {
    let params = new HttpParams();
    params = params.append('locationId', this.DATA.locations.locationId);
    params = params.append('employeeAssignedId', this.DATA.employeeAssignedId);
    params = params.append('siteId', this.DATA.siteId);
    this.commonService.getDeployedMembers(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.deployedMembersListSup = res.data;
        let sarray: any = [];
        let garray: any = [];
        if (res.data[0].supervisors.length !== 0) {
          sarray = res.data[0].supervisors;
        }
        if (res.data[0].guards.length !== 0) {
          garray = res.data[0].guards;
        }
        let guards: any = [];
        let supervisors: any = [];
        if (this.guardArray.length !== 0) {
          this.guardArray.forEach((element: any) => {
            if (element.checked === true) {
              guards.push({
                agencyMemberId: element.agencyMemberId,
                memberName: element.memberName,
              });
            }
          });
        }
        if (this.supervisorArray.length !== 0) {
          this.supervisorArray.forEach((element: any) => {
            if (element.checked === true) {
              supervisors.push({
                agencyMemberId: element.agencyMemberId,
                memberName: element.memberName,
              });
            }
          });
        }
        if (
          this.DATA.locations.requiredSupervisorsCount <
          sarray.length + supervisors.length
        ) {
          this.alertcall.showWarning(
            'Alert',
            'Deployed SupervisorCount Is Exceded'
          );
          return;
        }
        if (
          this.DATA.locations.requiredGaurdsCount <
          garray.length + guards.length
        ) {
          this.alertcall.showWarning('Alert', 'Deployed GuardCount Is Exceded');
          return;
        }
        sarray.forEach((element: any) => {
          supervisors.push({
            agencyMemberId: element.agencyMemberId,
            memberName: element.memberName,
          });
        });
        garray.forEach((element: any) => {
          guards.push({
            agencyMemberId: element.agencyMemberId,
            memberName: element.memberName,
          });
        });
        let obj = {
          agencyId: this.deployment.agency,
          siteId: this.DATA.siteId,
          locationId: this.DATA.locations.locationId,
          supervisors: supervisors,
          guards: guards,
          employeeAssignedId: this.DATA.employeeAssignedId,
          updatedBy: this.userdetails.data.username,
          dmsId: res.data[0].dmsId,
        };
        this.commonService.updateDeployedMembers(obj).subscribe((res: any) => {
          if (res && res['status'] == 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            this.deployment = {};
            this.guardArray = [];
            this.supervisorArray = [];
            this.guardscount = '';
            this.supervisorscount = '';
            this.deploymentmodal.hide();
            this.getrequiredsolist();
          } else {
            this.alertcall.showWarning('Success', res['message']);
          }
        });
      }
    });
  }
  relievemember(data: any) {
    let relieveObj = {
      employeeAssignedId: this.deployedMemList[0].employeeAssignedId,
      agencyId: data.agencyId,
      siteId: this.deployedMemList[0].siteId,
      locationId: this.deployedMemList[0].locationId,
      dmsId: this.deployedMemList[0].dmsId,
      supervisiorsId: [data.agencyMemberId],
      gaurdsId: [data.agencyMemberId],
    };
    this.commonService
      .relieveMembersForOtherSO(relieveObj)
      .subscribe((res: any) => {
        if (res && res['status'] == 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          this.getDeploymentList();
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
      });
  }
  getSolist(data: any) {
    let params = new HttpParams();
    params = params.append('username_given', data);
    this.commonService.getSOlist(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.SOList = res.data;
        this.SOList = this.SOList.filter((ele: any) => {
          if (ele.username === '' || ele.username === null) {
            return false;
          }
          return true;
        });
      }
    });
  }
  onSeachDropdownValue($event: any) {
    this.selectedValue = $event.target.value;
    const value = $event.target.value;
    if (value.length > 1) {
      this.getSolist(value);
      // this.SOList = this.SOList.filter((option:any) => option.username.toLowerCase().includes(value.toLowerCase()));
    }
    if (value.length === 0) {
      // console.log("hello");
    }

    if (!value) {
      this.SOList = [];
    }
  }

  onSelectDropdownValue(option: any) {
    this.selectedSO = option;
    this.security.so = option.username;
    if (option) {
      this.selectedValue = '';
    }
  }
  getsites() {
    let params = new HttpParams();
    params = params.append(
      'orgId',
      this.security.organization ? this.security.organization : ''
    );
    this.commonService.getSitesfrorg(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.sitedata = res.data;
        this.sitedata.forEach((ele: any) => {
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
  getLocations() {
    this.commonService.getLocation().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationdata = res.data;
      }
    });
  }
  getLocationFrSite() {
    this.security.location = null;
    let params = new HttpParams();
    params = params.append('siteId', this.security.site);
    this.commonService.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.LocationList = res.data;
        this.dropdownList = res.data;
        this.dropdownList.forEach((ele: any) => {
          ele['item_id'] = ele.locationId;
          ele['item_text'] = ele.locationName;
        });
      }
    });
  }
  getorganizations() {
    this.commonService.getOrganizationslist().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.organizationlist = res.data;
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
      if (this.btn === 'Submit') {
        let siteName: any;
        let locationName: any;
        let soName: any;
        this.sitedata.forEach((element: any) => {
          if (element.siteId === this.security.site) {
            siteName = element.siteName;
          }
        });
        this.locationdata.forEach((ele: any) => {
          if (ele.locationId === this.security.location) {
            locationName = ele.locationName;
          }
        });
        this.SOData.forEach((element: any) => {
          if (element.id === this.security.so) {
            soName = element.name;
          }
        });
        let obj = {
          orgId: this.security.organization,
          siteId: this.security.site,
          siteName: siteName,
          securityOfficerId: this.selectedSO.employee_id,
          securityOfficerName: this.selectedSO.username,
          shift: this.security.shift,
          locations: {
            locationId: this.security.location,
            locationName: locationName,
            requiredSupervisorsCount: this.security.supervisors,
            requiredGaurdsCount: this.security.guards,
          },
          createdBy: this.userdetails.data.username,
        };
        this.commonService
          .addSiteSecurityOfficers(obj)
          .subscribe((res: any) => {
            if (res && res['status'] === 'success') {
              this.alertcall.showSuccess('Success', res['message']);
              this.getsodata();
              fr.reset();
              this.activeTab = 'deployedlist';
            } else {
              this.alertcall.showWarning('Alert', res['message']);
            }
          });
      } else {
        let siteName: any;
        let locationName: any;
        this.sitedata.forEach((element: any) => {
          if (element.siteName === this.security.site) {
            siteName = element.siteId;
          }
        });
        this.locationdata.forEach((ele: any) => {
          if (ele.locationName === this.security.location) {
            locationName = ele.locationId;
          }
        });
        let obj = {
          employeeAssignedId: this.employeeassignedId,
          orgId: this.soEditData.orgId,
          siteId: siteName,
          // siteName: this.security.site,
          securityOfficerId: this.soEditData.securityOfficerId,
          // securityOfficerName: this.soEditData.securityOfficerName,
          // shift: this.security.shift,
          locations: {
            locationId: locationName,
            locationName: this.security.location,
            requiredSupervisorsCount: this.security.supervisors,
            requiredGaurdsCount: this.security.guards,
          },
          updatedBy: this.userdetails.data.username,
        };
        this.commonService.updateSecurityOfficers(obj).subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            this.getsodata();
            fr.reset();
            this.activeTab = 'deployedlist';
            this.btn = 'Submit';
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
      }
    }
  }
  securityDeploy(data: any) {
    this.activeTab = data;
  }
  deployedList(data: any) {
    this.activeTab = data;
  }
  deploysupervisors(data: any) {
    this.activeTab = data;
  }
  getsodata() {
    let params = new HttpParams();
    params = params.append('limit', this.pageSizeSO);
    params = params.append('page', this.offsetSO);
    params = params.append(
      'siteName',
      this.search.name ? this.search.name : ''
    );
    this.commonService.getSecurityOfficers(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.soData = res.data;
        this.totalSOitems = res.count;
        // this.collectionSize = res.count;
        // console.log(this.collectionSize);
      }
    });
  }
  editdata(data: any) {
    this.soEditData = data;
    this.organizationlist.forEach((ele: any) => {
      if (ele.orgId === data.orgId) {
        this.orgNmae = ele.orgName;
      }
    });
    this.employeeassignedId = data.employeeAssignedId;
    this.security.organization = this.orgNmae;
    this.security.so = data.securityOfficerName;
    this.security.site = data.siteName;
    this.security.location = data.locations.locationName;
    this.security.shift = data.shift;
    this.security.supervisors = data.locations.requiredSupervisorsCount;
    this.security.guards = data.locations.requiredGaurdsCount;
    this.activeTab = 'securitydeploy';
    this.btn = 'Update';
  }
  deletedata(data: any) {
    this.deletemodal.show();
    this.deleteData = data;
    this.securityfrDelete = data.securityOfficerName;
  }
  hideChildModal() {
    this.deletemodal.hide();
  }
  deleteperminently() {
    let obj = {
      employeeAssignedId: this.deleteData.employeeAssignedId,
    };
    // let params = new HttpParams()
    // params = params.append('employeeAssignedId',this.deleteData.employeeAssignedId)
    this.commonService.deleteSecurityDeployment(obj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.alertcall.showSuccess('Success', res['message']);
        this.deletemodal.hide();
        this.getsodata();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
  getPremiumData(ev: any) {
    this.OFFSET = ev;
    this.getsodata();
    // this.paginateData = this.tablelistviewdata.slice(
    //   (this.page - 1) * this.pageSizeapp,
    //   (this.page - 1) * this.pageSizeapp + this.pageSizeapp
    // );
  }
  getSelectedorg() {
    this.getsites();
  }
  validateNumber(e: any) {
    const reg = /^\d*(\d{0,5})?$/g;
    let input = e.target.value + String.fromCharCode(e.charCode);

    if (!reg.test(input)) {
      e.preventDefault();
    }
  }
  getSelectedLocation() {
    console.log();
  }
}
