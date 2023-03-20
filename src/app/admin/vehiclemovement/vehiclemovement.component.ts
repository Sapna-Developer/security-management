import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import SignaturePad from 'signature_pad';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as moment from 'moment';
@Component({
  selector: 'app-vehiclemovement',
  templateUrl: './vehiclemovement.component.html',
  styleUrls: ['./vehiclemovement.component.css'],
})
export class VehiclemovementComponent implements OnInit {
  @ViewChild('signaturemodal') public signaturemodal!: ModalDirective;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild('vehicleLogModal') public vehicleLogModal!: ModalDirective;
  @ViewChild('imageModal') public imageModal!: ModalDirective;
  @ViewChild('deletemodal') public deletemodal!: ModalDirective;
  sig!: SignaturePad;
  bsRangeValue!: Date[];
  activeTab = 'Main Gate Entry';
  maingateentry: any = {};
  vehicletrack: any = { all_categories: '', all_vehicles: '' };
  vehiclelog: any = {};
  selectedfile: any;
  selectedfileout: any;
  imageUrl!: string;
  file1!: Blob;
  status: any = [
    {
      date: '12-23-2022',
      type: 'passenger',
      name: 'two wheeler',
      business: 'wind',
    },
  ];
  selectedFILE: any;
  selectedFILEOUT: any;
  signature: any;
  userdetails: any;
  vehicleLogData: any = [];
  VehicleImage: any;
  SignatureImage: any;
  vehicleOutImage: any;
  locationdata: any = [];
  dropdownList: any = [];
  locationDataTrack: any = [];
  locationData: any = [];
  locationDataSites: any = [];
  dropdownSettings: IDropdownSettings = {};
  locationUpdate: any = {};
  locUpdatemachinary: any = {};
  locUpdateemergency: any = {};
  locUpdateGC: any = {};
  viewTab: boolean = false;
  viewVehicleImage: any;
  sitedata: any = [];
  editLocationData: any;
  editMacLocationData: any;
  editEmeLocationData: any;
  editgoodsCarrirLocationData: any;
  siteId: any;
  siteIdMac: any;
  siteIdEmergency: any;
  siteIdGC: any;
  leavingDate: boolean = true;
  leavingtimemachinary: boolean = true;
  leavingtimeemergency: boolean = true;
  leavingtimeGC: boolean = true;
  ViewExit: boolean = false;
  ExitGate: any = {};
  vehicleNumber: any;
  validationMsg: boolean = false;
  validationMsgLocUpdate: boolean = false;
  validationMsgExit: boolean = false;
  valMsgMachinaryVehLocUpdate: boolean = false;
  valMsgGCVehLocUpdate: boolean = false;
  Logoffset = 1;
  offsetTrack = 1;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };
  configTrack = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };
  vehicleTrackData: any = [];
  filteredres: any = [];
  filteredrestrack: any = [];
  totalLogItems = 0;
  LogpageSize = 10;
  TrackpageSize = 5;
  totalTrackItems = 0;
  Trackoffset = 1;
  disableLocation: boolean = false;
  disableLocationMac: boolean = false;
  disableLocationEmergency: boolean = false;
  disableLocationGC: boolean = false;
  search: any = {};
  searchtrack: any = {};
  vehicleCategory: any;
  selectedfilevehicle: any;
  selectedFILEVEHICLE: any;
  selectedfiledoc: any;
  selectedFILEDOC: any;
  details: any = {};
  mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  selectedLocations: any = [];
  currentTime: any;
  validationMessageTime: boolean = false;
  inDetails: any;
  deleteData: any;
  deleteVehicleNumber: any;
  yesterday: any;
  today: any;

  constructor(
    public route: ActivatedRoute,
    private commonservice: CommonService,
    private alertcall: AlertCallService
  ) {}

  ngOnInit(): void {
    this.maingateentry.in_date_time = moment(new Date()).format(
      'YYYY-MM-DDTHH:mm'
    );
    this.ExitGate.exidatetime = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    this.maingateentry.incident_type = '';
    this.maingateentry.vehicle_category = '';
    this.maingateentry.vehicle_type = '';
    this.maingateentry.purpose = '';
    this.maingateentry.site = '';
    this.vehicletrack.all_vehicles = null;
    this.vehicletrack.all_categories = null;
    this.vehiclelog.all_vehicles = null;
    this.vehiclelog.all_categories = null;
    this.route.queryParams.subscribe((res: any) => {
      if (res.data === 'mge') {
        this.activeTab = 'Main Gate Entry';
      }
      //       else if(res.data==='si'){
      // this.activeTab = 'Stores Inward'
      //       }
      //       else if(res.data==='so'){
      //         this.activeTab = 'Stores Outward'
      //               }
      else if (res.data === 'vlog') {
        this.activeTab = 'Vehicle Log';
      } else if (res.data === 'vtrack') {
        this.activeTab = 'Vehicle Track';
      }
    });
    this.sig = new SignaturePad(this.canvas.nativeElement);
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
    }
    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Item1' },
    //   { item_id: 2, item_text: 'Item2' },
    //   { item_id: 3, item_text: 'Item3' },
    //   { item_id: 4, item_text: 'Item4' },
    //   { item_id: 5, item_text: 'Item5' }
    // ];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      itemsShowLimit: 1,
    };
    this.getlogdata();
    // this.getLocations();
    this.getLocationsvehicletrack();
    this.getsites();
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  }
  searchbyvehicle() {
    if (this.search.name.length > 1) {
      this.Logoffset = 1;
      this.getlogdata();
    }
    if (!this.search.name) {
      this.getlogdata();
    }
  }
  searchbyvehicleNumber() {
    if (this.searchtrack.name.length > 1) {
      this.Trackoffset = 1;
      this.getVehicleTrackData();
    }
    if (!this.searchtrack.name) {
      this.getVehicleTrackData();
    }
  }

  getsites() {
    this.commonservice.getSite().subscribe((res: any) => {
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
  getLocationsInSite() {
    this.maingateentry.to_location = [];
    this.getLocationBySite();
  }
  getLocationBySite() {
    let params = new HttpParams();
    params = params.append('siteId', this.maingateentry.site);
    // let obj={
    //   siteId:this.maingateentry.site
    // }
    this.commonservice.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationDataSites = res.data;
        this.dropdownList = res.data;
        this.dropdownList.forEach((ele: any) => {
          ele['item_id'] = ele.locationId;
          ele['item_text'] = ele.locationName;
        });
      }
    });
  }
  getLocationsInSite1() {
    let params = new HttpParams();
    params = params.append('siteId', this.locationUpdate.site);
    // let obj={
    //   siteId:this.maingateentry.site
    // }
    this.commonservice.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationDataSites = res.data;
      }
    });
  }
  onItemSelect(item: any) {}
  onSelectAll(items: any) {}
  pageChanged(ev: any) {
    this.Logoffset = ev;
    this.getlogdata();
  }
  pageChangedTrack(ev: any) {
    this.Trackoffset = ev;
    this.getLocationsvehicletrack();
  }
  getVehicleTrackData() {
    let params = new HttpParams();
    params = params.append('limit', this.TrackpageSize);
    params = params.append('page', this.Trackoffset);
    params = params.append(
      'vehicleNumber',
      this.searchtrack.name ? this.searchtrack.name : ''
    );
    this.commonservice.getvehiclelogdata(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.vehicleTrackData = res.data;
        this.totalTrackItems = res.count;
        // this.configTrack.currentPage = this.offset;
        this.filteredres = [];
        this.filteredrestrack = [];
        this.vehicleTrackData.forEach((element: any) => {
          if (element.tracking.length === 0) {
            element.toLocation.forEach((toloc: any) => {
              element.tracking.push({ location: toloc });
            });
          } else {
            let array: any = [];
            element.toLocation.forEach((toloc: any) => {
              array.push({ location: toloc });
            });
            element.tracking.forEach((track: any) => {
              array.forEach((toloc: any, index: any) => {
                if (toloc.location === track.location) {
                  array.splice(index, 1, track);
                } else {
                }
              });
            });
            element.tracking = array;
          }
        });
        this.vehicleTrackData.forEach((element: any) => {
          element.tracking.forEach((locname: any) => {
            this.locationDataTrack.forEach((loc: any) => {
              if (loc.locationId === locname.location) {
                locname['LocationName'] = loc.locationName;
              }
            });
          });
        });
      }
    });
  }
  getlogdata() {
    let params = new HttpParams();
    params = params.append('fromDate', this.yesterday ? this.yesterday : '');
    params = params.append('toDate', this.today ? this.today : '');
    params = params.append(
      'vehicleCategory',
      this.maingateentry.vehicle_category
    );
    params = params.append('limit', this.LogpageSize);
    params = params.append('page', this.Logoffset);
    params = params.append(
      'vehicleNumber',
      this.search.name ? this.search.name : ''
    );
    this.commonservice.getvehiclelogdata(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.vehicleLogData = res.data;
        this.totalLogItems = res.count;
        // this.config.currentPage = this.offset;
        this.vehicleLogData.forEach((element: any, index: any) => {
          if (element.tracking.length !== 0) {
            if (element.tracking.length === element.toLocation.length) {
              element.tracking.every((ele: any, i: any) => {
                if (ele.reachedDateTime && ele.leavingDateTime) {
                  element['btn'] = 'Exit';
                  return true;
                } else {
                  element['btn'] = 'Update';
                  return false;
                }
              });
            } else {
              element['btn'] = 'Update';
            }
            if (element.vehicleExitData !== null) {
              element['btn'] = 'Exited';
            }
          } else {
            element['btn'] = 'Update';
          }
        });
      }
    });
  }
  getLocations() {
    this.commonservice.getLocation().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationDataSites = res.data;
        this.dropdownList = res.data;
        this.dropdownList.forEach((ele: any) => {
          ele['item_id'] = ele.locationId;
          ele['item_text'] = ele.locationName;
        });
      }
    });
  }
  getLocationsvehicletrack() {
    let params = new HttpParams();
    params = params.append('module', 'vehicleMovement');
    this.commonservice.getLocationfrTrack(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationDataTrack = res.data;
        // this.dropdownList = res.data;
        // this.dropdownList.forEach((ele: any) => {
        //   ele['item_id'] = ele.locationId;
        //   ele['item_text'] = ele.locationName;
        // });
        this.getVehicleTrackData();
      }
    });
  }
  clear() {
    this.sig.clear();
    this.signature = '';
  }
  saveSign() {
    this.imageUrl = this.sig.toDataURL();
    const imageBlob = this.dataURItoBlob(this.imageUrl);
    var file = new File([imageBlob], 'fileName.jpeg', {
      type: "'image/jpeg'",
    });
    this.signature = file;
    if (this.signature) {
      this.signaturemodal.hide();
    }
  }
  dataURItoBlob(dataURI: any) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
  MGE(data: any) {
    this.activeTab = data;
  }
  LocationUpdate(data: any) {
    this.activeTab = data;
  }
  VLOG(data: any) {
    this.activeTab = data;
  }
  VTRACK(data: any) {
    this.activeTab = data;
  }
  Exit(data: any) {
    this.activeTab = data;
  }
  onFileInput(ev: any) {
    if (ev && ev.target && ev.target.files && ev.target.files.length > 0) {
      this.selectedfile = ev.target.files[0].name;
      this.selectedFILE = ev.target.files[0];
    }
  }
  onFileInputout(ev: any) {
    if (ev && ev.target && ev.target.files && ev.target.files.length > 0) {
      this.selectedfileout = ev.target.files[0].name;
      this.selectedFILEOUT = ev.target.files[0];
    }
  }
  onFileInputVehicle(ev: any) {
    if (ev && ev.target && ev.target.files && ev.target.files.length > 0) {
      this.selectedfilevehicle = ev.target.files[0].name;
      this.selectedFILEVEHICLE = ev.target.files[0];
    }
  }
  onFileInputdoc(ev: any) {
    if (ev && ev.target && ev.target.files && ev.target.files.length > 0) {
      this.selectedfiledoc = ev.target.files[0].name;
      this.selectedFILEDOC = ev.target.files[0];
    }
  }
  opensignaturepad() {
    this.signaturemodal.show();
  }
  closesignaturemodal() {
    this.signaturemodal.hide();
  }
  viewdetails() {}
  viewLogDetails(data: any) {
    this.details.in_date_and_time = moment
      .utc(data.inDateandTime)
      .format('YYYY-MM-DD HH:mm');
    this.details.vehicle_category = data.vehicleCategory;
    this.details.vehicle_type = data.vehicleType;
    this.details.vehicle_number = data.vehicleNumber;
    this.details.driver_name = data.driverName;
    this.details.driver_license = data.driverLisenceNumber;
    this.details.driver_contact = data.driverContactDetails;
    this.details.number_of_passengers = data.numberOfPassengers;
    this.details.carrying_materials = data.carryingMaterials;
    this.details.entry_purpose = data.entryPurpose;
    this.details.whom_to_meet = data.whomToMeet;
    this.VehicleImage = data.photo;
    this.SignatureImage = data.signature;
    if (data.vehicleExitData) {
      this.vehicleOutImage = data.vehicleExitData.photo;
    }
    this.vehicleLogModal.show();
  }
  closevehicleLogModal() {
    this.vehicleLogModal.hide();
  }
  saveMainGateData(fr: any) {
    if (fr.invalid) {
      return;
    } else {
      if (this.maingateentry.vehicle_category !== 'emergency') {
        let array = Object.keys(fr.value).filter((k: any) => {
          if (
            fr.value[k] === '' ||
            fr.value[k] === null ||
            fr.value[k] === undefined
          ) {
            return k;
          }
        });
        if (array.length !== 0 || !this.signature || !this.selectedFILE) {
          this.validationMsg = true;
        } else {
          this.validationMsg = false;
          this.currentTime = moment(new Date()).format('YYYY-MM-DDTHH:mm');
          // console.log(this.currentTime);
          // console.log(this.maingateentry.in_date_time);
          if (this.maingateentry.in_date_time > this.currentTime) {
            this.validationMessageTime = true;
          } else {
            this.validationMessageTime = false;
            let array: any = [];
            this.maingateentry.to_location.forEach((element: any) => {
              array.push(element.item_id);
            });
            const formData = new FormData();
            formData.append('photo', this.selectedFILE);
            formData.append('signature', this.signature);
            formData.append(
              'vehicleCategory',
              this.maingateentry.vehicle_category
            );
            formData.append('vehicleType', this.maingateentry.vehicle_type);
            formData.append('vehicleNumber', this.maingateentry.vehicle_number);
            formData.append('driverName', this.maingateentry.driver_name);
            formData.append(
              'driverContactDetails',
              this.maingateentry.driver_contact_details
            );
            formData.append(
              'driverLisenceNumber',
              this.maingateentry.driver_license_number
            );
            formData.append(
              'numberOfPassengers',
              this.maingateentry.no_passengers
            );
            formData.append('entryPurpose', this.maingateentry.purpose);
            formData.append(
              'carryingMaterials',
              this.maingateentry.carrying_material
            );
            formData.append('toLocation', array);
            formData.append('whomToMeet', this.maingateentry.whom_to_meet);
            formData.append('inDateandTime', this.maingateentry.in_date_time);
            formData.append('entryRemarks', this.maingateentry.remarks);
            formData.append('siteId', this.maingateentry.site);
            formData.append('createdBy', this.userdetails.data.username);
            this.commonservice
              .addMainGateData(formData)
              .subscribe((res: any) => {
                if (res && res['status'] === 'success') {
                  this.alertcall.showSuccess('Success', res['message']);
                  fr.reset();
                  this.selectedFILE = '';
                  this.signature = '';
                  this.selectedfile = '';
                  this.sig.clear();
                  this.getlogdata();
                  this.getLocations();
                  this.activeTab = 'Vehicle Log';
                  // this.maingateentry.vehicle_category = ""
                  // this.maingateentry.vehicle_type = '';
                  // this.maingateentry.purpose = ""
                  // this.maingateentry.site = ""
                } else {
                  this.alertcall.showWarning('Alert', res['message']);
                }
              });
          }
        }
      } else {
        this.validationMsg = false;
        let array: any = [];
        if (this.maingateentry.to_location) {
          this.maingateentry.to_location.forEach((element: any) => {
            array.push(element.item_id);
          });
        }
        const formData = new FormData();
        formData.append('photo', this.selectedFILE ? this.selectedFILE : '');
        formData.append('signature', this.signature ? this.signature : '');
        formData.append(
          'vehicleCategory',
          this.maingateentry.vehicle_category
            ? this.maingateentry.vehicle_category
            : ''
        );
        formData.append(
          'vehicleType',
          this.maingateentry.vehicle_type ? this.maingateentry.vehicle_type : ''
        );
        formData.append(
          'vehicleNumber',
          this.maingateentry.vehicle_number
            ? this.maingateentry.vehicle_number
            : ''
        );
        formData.append(
          'driverName',
          this.maingateentry.driver_name ? this.maingateentry.driver_name : ''
        );
        formData.append(
          'driverContactDetails',
          this.maingateentry.driver_contact_details
            ? this.maingateentry.driver_contact_details
            : ''
        );
        formData.append(
          'driverLisenceNumber',
          this.maingateentry.driver_license_number
            ? this.maingateentry.driver_license_number
            : ''
        );
        formData.append(
          'numberOfPassengers',
          this.maingateentry.no_passengers
            ? this.maingateentry.no_passengers
            : ''
        );
        formData.append(
          'entryPurpose',
          this.maingateentry.purpose ? this.maingateentry.purpose : ''
        );
        formData.append(
          'carryingMaterials',
          this.maingateentry.carrying_material
            ? this.maingateentry.carrying_material
            : ''
        );
        formData.append('toLocation', array);
        formData.append(
          'whomToMeet',
          this.maingateentry.whom_to_meet ? this.maingateentry.whom_to_meet : ''
        );
        formData.append(
          'inDateandTime',
          this.maingateentry.in_date_time ? this.maingateentry.in_date_time : 0
        );
        formData.append(
          'entryRemarks',
          this.maingateentry.remarks ? this.maingateentry.remarks : ''
        );
        formData.append(
          'siteId',
          this.maingateentry.site ? this.maingateentry.site : ''
        );
        formData.append(
          'incidentType',
          this.maingateentry.incident_type
            ? this.maingateentry.incident_type
            : ''
        );
        formData.append('createdBy', this.userdetails.data.username);
        this.commonservice.addMainGateData(formData).subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            fr.reset();
            this.selectedFILE = '';
            this.signature = '';
            this.selectedfile = '';
            this.sig.clear();
            this.getlogdata();
            this.getLocations();
            this.activeTab = 'Vehicle Log';
            // this.maingateentry.vehicle_category = ""
            // this.maingateentry.vehicle_type = ""
            // this.maingateentry.purpose = ""
            // this.maingateentry.site = ""
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
      }
    }
  }
  UpdateLocation(data: any, tabName: any) {
    this.inDetails = moment.utc(data.inDateandTime).format('YYYY-MM-DDTHH:mm');
    this.vehicleCategory = data.vehicleCategory;
    this.disableLocation = false;
    this.disableLocationMac = false;
    if (data.btn === 'Exit') {
      this.ViewExit = true;
      this.viewTab = false;
      this.activeTab = 'Exit Gate';
      this.ExitGate.vehicle_number = data.vehicleNumber;
      this.ExitGate.vehicle_category = data.vehicleCategory;
    } else {
      if (data.vehicleCategory === 'passenger') {
        this.locationUpdate.reachingdate_time = moment(new Date()).format(
          'YYYY-MM-DDTHH:mm'
        );
        this.editLocationData = data;
        this.selectedLocations = data.toLocation;
        if (data.tracking.length !== 0) {
          data.tracking.forEach((element: any) => {
            data.toLocation.forEach((ele: any) => {
              if (ele === element.location) {
                if (element.reachedDateTime && !element.leavingDateTime) {
                  this.locationUpdate.location = element.location;
                  this.disableLocation = true;
                  this.locationUpdate.reachingdate_time = moment(
                    element.reachedDateTime
                  ).format('YYYY-MM-DDTHH:mm');
                  this.locationUpdate.delay_reason = element.reasonForDelay;
                  this.locationUpdate.purposeStatus = element.purposeStatus;
                  this.locationUpdate.site = data.siteName;
                  this.locationUpdate.remarks = element.remarks;
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.leavingDate = true;
                  this.locationUpdate.vehicle_category = data.vehicleCategory;
                  this.locationUpdate.vehicle_no = data.vehicleNumber;
                  this.locationUpdate.indate_time = this.inDetails;
                  this.locationUpdate.driver_name = data.driverName;
                  this.locationUpdate.driver_contact_details =
                    data.driverContactDetails;
                  this.locationUpdate.driver_license_number =
                    data.driverLisenceNumber;
                  this.locationUpdate.no_passengers = data.numberOfPassengers;
                  this.locationUpdate.purpose = data.entryPurpose;
                  this.locationUpdate.whom_to_meet = data.whomToMeet;
                  this.locationUpdate.location = element.location;
                  this.locationUpdate.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteId = data.siteId;
                  this.getLocationsList();
                } else if (
                  !element.reachedDateTime &&
                  !element.leavingDateTime
                ) {
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.locationUpdate.vehicle_category = data.vehicleCategory;
                  this.locationUpdate.vehicle_no = data.vehicleNumber;
                  this.locationUpdate.indate_time = this.inDetails;
                  this.locationUpdate.driver_name = data.driverName;
                  this.locationUpdate.driver_contact_details =
                    data.driverContactDetails;
                  this.locationUpdate.driver_license_number =
                    data.driverLisenceNumber;
                  this.locationUpdate.no_passengers = data.numberOfPassengers;
                  this.locationUpdate.purpose = data.entryPurpose;
                  this.locationUpdate.whom_to_meet = data.whomToMeet;
                  this.locationUpdate.location = null;
                  this.locationUpdate.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteId = data.siteId;
                  this.getLocationsList();
                } else if (
                  element.reachedDateTime &&
                  element.leavingDateTime &&
                  data.toLocation.length !== data.tracking.length
                ) {
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.leavingDate = false;
                  this.locationUpdate.vehicle_category = data.vehicleCategory;
                  this.locationUpdate.vehicle_no = data.vehicleNumber;
                  this.locationUpdate.indate_time = this.inDetails;
                  this.locationUpdate.driver_name = data.driverName;
                  this.locationUpdate.driver_contact_details =
                    data.driverContactDetails;
                  this.locationUpdate.driver_license_number =
                    data.driverLisenceNumber;
                  this.locationUpdate.no_passengers = data.numberOfPassengers;
                  this.locationUpdate.purpose = data.entryPurpose;
                  this.locationUpdate.whom_to_meet = data.whomToMeet;
                  this.locationUpdate.location = null;
                  this.locationUpdate.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteId = data.siteId;
                  this.getLocationsList();
                }
              }
              //       if(ele!==element.location){
              //         console.log("hello");

              //         this.viewTab = true;
              //         this.ViewExit = false;
              //        this.activeTab = tabName
              //        this.leavingDate=false;
              // this.locationUpdate.vehicle_category = data.vehicleCategory
              // this.locationUpdate.vehicle_no = data.vehicleNumber
              // this.locationUpdate.indate_time = moment(data.inDateandTime).format("DD-MM-YYYY HH:mm")
              // this.locationUpdate.driver_name = data.driverName
              // this.locationUpdate.driver_contact_details = data.driverContactDetails
              // this.locationUpdate.driver_license_number = data.driverLisenceNumber
              // this.locationUpdate.no_passengers = data.numberOfPassengers
              // this.locationUpdate.purpose = data.entryPurpose
              // this.locationUpdate.whom_to_meet = data.whomToMeet
              // this.locationUpdate.location = null
              // this.locationUpdate.site = data.siteName
              // this.viewVehicleImage= data.photo
              // this.siteId= data.siteId
              //     this.locationUpdate.reachingdate_time= ""
              //     this.locationUpdate.delay_reason= ""
              //     this.locationUpdate.purposeStatus= ""

              //       }
            });
          });
        } else if (data.tracking.length === 0) {
          this.leavingDate = false;
          this.viewTab = true;
          this.ViewExit = false;
          this.activeTab = tabName;
          this.locationUpdate.vehicle_category = data.vehicleCategory;
          this.locationUpdate.vehicle_no = data.vehicleNumber;
          this.locationUpdate.indate_time = this.inDetails;
          //   moment(data.inDateandTime).format(
          //   'DD-MM-YYYY HH:mm'
          // );
          this.locationUpdate.driver_name = data.driverName;
          this.locationUpdate.driver_contact_details =
            data.driverContactDetails;
          this.locationUpdate.driver_license_number = data.driverLisenceNumber;
          this.locationUpdate.no_passengers = data.numberOfPassengers;
          this.locationUpdate.purpose = data.entryPurpose;
          this.locationUpdate.whom_to_meet = data.whomToMeet;
          this.locationUpdate.location = null;
          this.locationUpdate.site = data.siteName;
          this.viewVehicleImage = data.photo;
          this.siteId = data.siteId;
          this.locationUpdate.remarks = data.entryRemarks;
          this.getLocationsList();
        }
      }
      if (data.vehicleCategory === 'machinery') {
        this.locUpdatemachinary.reachingdate_time = moment(new Date()).format(
          'YYYY-MM-DDTHH:mm'
        );
        this.selectedLocations = data.toLocation;
        this.editMacLocationData = data;
        if (data.tracking.length !== 0) {
          data.tracking.forEach((element: any) => {
            data.toLocation.forEach((ele: any) => {
              if (ele === element.location) {
                if (element.reachedDateTime && !element.leavingDateTime) {
                  this.locationUpdate.location = element.location;
                  this.disableLocationMac = true;
                  this.locUpdatemachinary.reachingdate_time = moment(
                    element.reachedDateTime
                  ).format('YYYY-MM-DDTHH:mm');
                  this.locUpdatemachinary.delay_reason = element.reasonForDelay;
                  this.locUpdatemachinary.purposeStatus = element.purposeStatus;
                  this.locUpdatemachinary.site = data.siteName;
                  this.locUpdatemachinary.remarks = element.remarks;
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.leavingtimemachinary = true;
                  this.locUpdatemachinary.vehicle_category =
                    data.vehicleCategory;
                  this.locUpdatemachinary.vehicle_no = data.vehicleNumber;
                  this.locUpdatemachinary.indate_time = data.inDateandTime;
                  this.locUpdatemachinary.driver_name = data.driverName;
                  this.locUpdatemachinary.driver_contact_details =
                    data.driverContactDetails;
                  this.locUpdatemachinary.driver_license_number =
                    data.driverLisenceNumber;
                  this.locUpdatemachinary.purpose = data.entryPurpose;
                  this.locUpdatemachinary.location = element.location;
                  this.locUpdatemachinary.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteIdMac = data.siteId;
                  this.getLocationsListfrMach();
                } else if (
                  !element.reachedDateTime &&
                  !element.leavingDateTime
                ) {
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.locUpdatemachinary.vehicle_category =
                    data.vehicleCategory;
                  this.locUpdatemachinary.vehicle_no = data.vehicleNumber;
                  this.locUpdatemachinary.indate_time = moment(
                    data.inDateandTime
                  ).format('DD-MM-YYYY HH:mm');
                  this.locUpdatemachinary.driver_name = data.driverName;
                  this.locUpdatemachinary.driver_contact_details =
                    data.driverContactDetails;
                  this.locUpdatemachinary.driver_license_number =
                    data.driverLisenceNumber;
                  this.locUpdatemachinary.purpose = data.entryPurpose;
                  this.locUpdatemachinary.location = null;
                  this.locUpdatemachinary.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteIdMac = data.siteId;
                  this.getLocationsListfrMach();
                } else if (
                  element.reachedDateTime &&
                  element.leavingDateTime &&
                  data.toLocation.length !== data.tracking.length
                ) {
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.leavingtimemachinary = false;
                  this.locUpdatemachinary.vehicle_category =
                    data.vehicleCategory;
                  this.locUpdatemachinary.vehicle_no = data.vehicleNumber;
                  this.locUpdatemachinary.indate_time = moment(
                    data.inDateandTime
                  ).format('DD-MM-YYYY HH:mm');
                  this.locUpdatemachinary.driver_name = data.driverName;
                  this.locUpdatemachinary.driver_contact_details =
                    data.driverContactDetails;
                  this.locUpdatemachinary.driver_license_number =
                    data.driverLisenceNumber;
                  this.locUpdatemachinary.purpose = data.entryPurpose;
                  this.locUpdatemachinary.location = null;
                  this.locUpdatemachinary.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteIdMac = data.siteId;
                  this.getLocationsListfrMach();
                }
              }
            });
          });
        } else if (data.tracking.length === 0) {
          this.leavingtimemachinary = false;
          this.viewTab = true;
          this.ViewExit = false;
          this.activeTab = tabName;
          this.locUpdatemachinary.vehicle_category = data.vehicleCategory;
          this.locUpdatemachinary.vehicle_no = data.vehicleNumber;
          this.locUpdatemachinary.indate_time = moment(
            data.inDateandTime
          ).format('DD-MM-YYYY HH:mm');
          this.locUpdatemachinary.driver_name = data.driverName;
          this.locUpdatemachinary.driver_contact_details =
            data.driverContactDetails;
          this.locUpdatemachinary.driver_license_number =
            data.driverLisenceNumber;
          this.locUpdatemachinary.purpose = data.entryPurpose;
          this.locUpdatemachinary.location = null;
          this.locUpdatemachinary.site = data.siteName;
          this.viewVehicleImage = data.photo;
          this.siteIdMac = data.siteId;
          this.locUpdatemachinary.remarks = data.entryRemarks;
          this.getLocationsListfrMach();
        }
      }
      if (data.vehicleCategory === 'emergency') {
        this.selectedLocations = data.toLocation;
        this.locUpdateemergency.reachingdate_time = moment(new Date()).format(
          'YYYY-MM-DDTHH:mm'
        );
        this.editEmeLocationData = data;
        if (data.tracking.length !== 0) {
          data.tracking.forEach((element: any) => {
            data.toLocation.forEach((ele: any) => {
              if (ele === element.location) {
                if (element.reachedDateTime && !element.leavingDateTime) {
                  this.locUpdateemergency.location = element.location;
                  this.disableLocationEmergency = true;
                  this.locUpdateemergency.reachingdate_time = moment(
                    element.reachedDateTime
                  ).format('YYYY-MM-DDTHH:mm');
                  this.locUpdateemergency.delay_reason = element.reasonForDelay;
                  this.locUpdateemergency.purposeStatus = element.purposeStatus;
                  this.locUpdateemergency.site = data.siteName;
                  this.locUpdateemergency.remarks = element.remarks;
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.leavingtimeemergency = true;
                  this.locUpdateemergency.vehicle_category =
                    data.vehicleCategory;
                  this.locUpdateemergency.vehicle_no = data.vehicleNumber;
                  this.locUpdateemergency.indate_time = data.inDateandTime;
                  this.locUpdateemergency.driver_name = data.driverName;
                  this.locUpdateemergency.driver_contact_details =
                    data.driverContactDetails;
                  this.locUpdateemergency.driver_license_number =
                    data.driverLisenceNumber;
                  this.locUpdateemergency.purpose = data.entryPurpose;
                  this.locUpdateemergency.location = element.location;
                  this.locUpdateemergency.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteIdEmergency = data.siteId;
                  this.getLocationsListfrEmergency();
                } else if (
                  !element.reachedDateTime &&
                  !element.leavingDateTime
                ) {
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.locUpdateemergency.vehicle_category =
                    data.vehicleCategory;
                  this.locUpdateemergency.vehicle_no = data.vehicleNumber;
                  this.locUpdateemergency.indate_time = moment(
                    data.inDateandTime
                  ).format('DD-MM-YYYY HH:mm');
                  this.locUpdateemergency.driver_name = data.driverName;
                  this.locUpdateemergency.driver_contact_details =
                    data.driverContactDetails;
                  this.locUpdateemergency.driver_license_number =
                    data.driverLisenceNumber;
                  this.locUpdateemergency.purpose = data.entryPurpose;
                  this.locUpdateemergency.location = null;
                  this.locUpdateemergency.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteIdEmergency = data.siteId;
                  this.getLocationsListfrEmergency();
                } else if (
                  element.reachedDateTime &&
                  element.leavingDateTime &&
                  data.toLocation.length !== data.tracking.length
                ) {
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.leavingtimeemergency = false;
                  this.locUpdateemergency.vehicle_category =
                    data.vehicleCategory;
                  this.locUpdateemergency.vehicle_no = data.vehicleNumber;
                  this.locUpdateemergency.indate_time = moment(
                    data.inDateandTime
                  ).format('DD-MM-YYYY HH:mm');
                  this.locUpdateemergency.driver_name = data.driverName;
                  this.locUpdateemergency.driver_contact_details =
                    data.driverContactDetails;
                  this.locUpdateemergency.driver_license_number =
                    data.driverLisenceNumber;
                  this.locUpdateemergency.purpose = data.entryPurpose;
                  this.locUpdateemergency.location = null;
                  this.locUpdateemergency.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteIdEmergency = data.siteId;
                  this.getLocationsListfrEmergency();
                }
              }
            });
          });
        } else if (data.tracking.length === 0) {
          this.leavingtimeemergency = false;
          this.viewTab = true;
          this.ViewExit = false;
          this.activeTab = tabName;
          this.locUpdateemergency.vehicle_category = data.vehicleCategory;
          this.locUpdateemergency.vehicle_no = data.vehicleNumber;
          this.locUpdateemergency.indate_time = moment(
            data.inDateandTime
          ).format('DD-MM-YYYY HH:mm');
          this.locUpdateemergency.driver_name = data.driverName;
          this.locUpdateemergency.driver_contact_details =
            data.driverContactDetails;
          this.locUpdateemergency.driver_license_number =
            data.driverLisenceNumber;
          this.locUpdateemergency.purpose = data.entryPurpose;
          this.locUpdateemergency.location = null;
          this.locUpdateemergency.site = data.siteName;
          this.viewVehicleImage = data.photo;
          this.siteIdEmergency = data.siteId;
          this.locUpdateemergency.remarks = data.entryRemarks;
          this.getLocationsListfrEmergency();
        }
      }
      if (data.vehicleCategory === 'goodscarrier') {
        this.selectedLocations = data.toLocation;
        this.locUpdateGC.reachingdate_time = moment(new Date()).format(
          'YYYY-MM-DDTHH:mm'
        );
        this.editgoodsCarrirLocationData = data;
        if (data.tracking.length !== 0) {
          data.tracking.forEach((element: any) => {
            data.toLocation.forEach((ele: any) => {
              if (ele === element.location) {
                console.log('entered');
                if (element.reachedDateTime && !element.leavingDateTime) {
                  console.log('entered');

                  this.locUpdateGC.location = element.location;
                  this.disableLocationGC = true;
                  this.locUpdateGC.reachingdate_time = moment(
                    element.reachedDateTime
                  ).format('YYYY-MM-DDTHH:mm');
                  this.locUpdateGC.delay_reason = element.reasonForDelay;
                  this.locUpdateGC.purposeStatus = element.purposeStatus;
                  this.locUpdateGC.site = data.siteName;
                  this.locUpdateGC.remarks = element.remarks;
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.leavingtimeGC = true;
                  this.locUpdateGC.vehicle_category = data.vehicleCategory;
                  this.locUpdateGC.vehicle_no = data.vehicleNumber;
                  this.locUpdateGC.indate_time = data.inDateandTime;
                  this.locUpdateGC.driver_name = data.driverName;
                  this.locUpdateGC.driver_contact_details =
                    data.driverContactDetails;
                  this.locUpdateGC.driver_license_number =
                    data.driverLisenceNumber;
                  this.locUpdateGC.purpose = data.entryPurpose;
                  this.locUpdateGC.location = element.location;
                  this.locUpdateGC.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteIdGC = data.siteId;
                  this.locUpdateGC.goods_type = element.goodsType;
                  this.locUpdateGC.doc_type = element.documentType;
                  this.locUpdateGC.doc_number = element.documentNumber;
                  this.locUpdateGC.packingdetails = element.packagingDetails;
                  this.locUpdateGC.itemlist = element.itemsList;
                  this.locUpdateGC.tareweight = element.tareWeight;
                  this.locUpdateGC.netweight = element.netWeight;
                  this.locUpdateGC.reccontractorname =
                    element.receiverContractorName;
                  this.locUpdateGC.toaddress = element.toAddressLocation;
                  this.locUpdateGC.handoverfrom = element.handOverFrom;
                  this.locUpdateGC.storeslocation = element.storesLocation;
                  this.getLocationsListfrGC();
                } else if (
                  !element.reachedDateTime &&
                  !element.leavingDateTime
                ) {
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.locUpdateGC.vehicle_category = data.vehicleCategory;
                  this.locUpdateGC.vehicle_no = data.vehicleNumber;
                  this.locUpdateGC.indate_time = moment(
                    data.inDateandTime
                  ).format('DD-MM-YYYY HH:mm');
                  this.locUpdateGC.driver_name = data.driverName;
                  this.locUpdateGC.driver_contact_details =
                    data.driverContactDetails;
                  this.locUpdateGC.driver_license_number =
                    data.driverLisenceNumber;
                  this.locUpdateGC.purpose = data.entryPurpose;
                  this.locUpdateGC.location = null;
                  this.locUpdateGC.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteIdGC = data.siteId;
                  this.getLocationsListfrGC();
                } else if (
                  element.reachedDateTime &&
                  element.leavingDateTime &&
                  data.toLocation.length !== data.tracking.length
                ) {
                  this.viewTab = true;
                  this.ViewExit = false;
                  this.activeTab = tabName;
                  this.leavingtimeGC = false;
                  this.locUpdateGC.vehicle_category = data.vehicleCategory;
                  this.locUpdateGC.vehicle_no = data.vehicleNumber;
                  this.locUpdateGC.indate_time = moment(
                    data.inDateandTime
                  ).format('DD-MM-YYYY HH:mm');
                  this.locUpdateGC.driver_name = data.driverName;
                  this.locUpdateGC.driver_contact_details =
                    data.driverContactDetails;
                  this.locUpdateGC.driver_license_number =
                    data.driverLisenceNumber;
                  this.locUpdateGC.purpose = data.entryPurpose;
                  this.locUpdateGC.location = null;
                  this.locUpdateGC.site = data.siteName;
                  this.viewVehicleImage = data.photo;
                  this.siteIdGC = data.siteId;
                  this.getLocationsListfrGC();
                }
              }
            });
          });
        } else if (data.tracking.length === 0) {
          this.leavingtimeGC = false;
          this.viewTab = true;
          this.ViewExit = false;
          this.activeTab = tabName;
          this.locUpdateGC.vehicle_category = data.vehicleCategory;
          this.locUpdateGC.vehicle_no = data.vehicleNumber;
          this.locUpdateGC.indate_time = moment(data.inDateandTime).format(
            'DD-MM-YYYY HH:mm'
          );
          this.locUpdateGC.driver_name = data.driverName;
          this.locUpdateGC.driver_contact_details = data.driverContactDetails;
          this.locUpdateGC.driver_license_number = data.driverLisenceNumber;
          this.locUpdateGC.purpose = data.entryPurpose;
          this.locUpdateGC.location = null;
          this.locUpdateGC.site = data.siteName;
          this.viewVehicleImage = data.photo;
          this.siteIdGC = data.siteId;
          this.locUpdateGC.remarks = data.entryRemarks;
          this.getLocationsListfrGC();
        }
      }
    }
  }
  getLocationsList() {
    let params = new HttpParams();
    params = params.append('siteId', this.siteId);
    // let obj={
    //   siteId:this.maingateentry.site
    // }
    this.commonservice.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationDataSites = res.data;
        let newLoc: any = [];
        this.locationDataSites.forEach((loc: any) => {
          this.selectedLocations.forEach((LOC: any) => {
            if (loc.locationId === LOC) {
              newLoc.push({
                locationName: loc.locationName,
                locationId: loc.locationId,
              });
            }
          });
        });
        this.locationDataSites = newLoc;
        // this.dropdownList = res.data;
        // this.dropdownList.forEach((ele:any)=>{
        //   ele['item_id']=ele.locationId
        //   ele['item_text'] = ele.locationName
        // })
      }
    });
  }
  getLocationsListfrMach() {
    let params = new HttpParams();
    params = params.append('siteId', this.siteIdMac);
    this.commonservice.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationDataSites = res.data;
        let newLoc: any = [];
        this.locationDataSites.forEach((loc: any) => {
          this.selectedLocations.forEach((LOC: any) => {
            if (loc.locationId === LOC) {
              newLoc.push({
                locationName: loc.locationName,
                locationId: loc.locationId,
              });
            }
          });
        });
        this.locationDataSites = newLoc;
      }
    });
  }
  getLocationsListfrEmergency() {
    let params = new HttpParams();
    params = params.append('siteId', this.siteIdEmergency);
    this.commonservice.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationDataSites = res.data;
        let newLoc: any = [];
        this.locationDataSites.forEach((loc: any) => {
          this.selectedLocations.forEach((LOC: any) => {
            if (loc.locationId === LOC) {
              newLoc.push({
                locationName: loc.locationName,
                locationId: loc.locationId,
              });
            }
          });
        });
        this.locationDataSites = newLoc;
      }
    });
  }
  getLocationsListfrGC() {
    let params = new HttpParams();
    params = params.append('siteId', this.siteIdGC);
    this.commonservice.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationDataSites = res.data;
        let newLoc: any = [];
        this.locationDataSites.forEach((loc: any) => {
          this.selectedLocations.forEach((LOC: any) => {
            if (loc.locationId === LOC) {
              newLoc.push({
                locationName: loc.locationName,
                locationId: loc.locationId,
              });
            }
          });
        });
        this.locationDataSites = newLoc;
      }
    });
  }
  viewImage() {
    this.imageModal.show();
  }
  closeimageModal() {
    this.imageModal.hide();
  }
  UpdateLocationData(fr: any) {
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
      this.validationMsgLocUpdate = true;
    } else {
      this.validationMsgLocUpdate = false;
      if (!this.locationUpdate.leavingdate_time) {
        let obj = {
          vehicleNumber: this.locationUpdate.vehicle_no,
          reachedDateTime: moment(this.locationUpdate.reachingdate_time).format(
            'YYYY-MM-DD HH:mm'
          ),
          reasonForDelay: this.locationUpdate.delay_reason,
          passengerCount: this.locationUpdate.no_passengers,
          // "leavingDateTime": moment(this.locationUpdate.leavingdate_time).format("YYYY-MM-DD HH:mm"),
          purposeStatus: this.locationUpdate.purposeStatus,
          location: this.locationUpdate.location,
          remarks: this.locationUpdate.remarks,
          vehicleCategory: this.locationUpdate.vehicle_category,
          // "siteId": this.locationUpdate.site
        };
        this.commonservice.updatePassvehicledata(obj).subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            fr.reset();
            this.getlogdata();
            this.getLocations();
            this.activeTab = 'Vehicle Log';
            this.viewTab = false;
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
      } else {
        let exitobj = {
          vehicleNumber: this.locationUpdate.vehicle_no,
          location: this.locationUpdate.location,
          siteId: this.siteId,
          vmId: this.editLocationData.vmId,
          vehicleCategory: this.locationUpdate.vehicle_category,
          leavingDateTime: moment(this.locationUpdate.leavingdate_time).format(
            'YYYY-MM-DD HH:mm'
          ),
        };
        this.commonservice
          .updatePassvehilceexitlocationData(exitobj)
          .subscribe((res: any) => {
            if (res && res['status'] === 'success') {
              this.alertcall.showSuccess('Success', res['message']);
              fr.reset();
              this.getlogdata();
              this.getLocations();
              this.activeTab = 'Vehicle Log';
              this.viewTab = false;
            } else {
              this.alertcall.showWarning('Alert', res['message']);
            }
          });
      }
    }
  }
  UpdateMachinaryVehLocationData(fr: any) {
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
      this.valMsgMachinaryVehLocUpdate = true;
    } else {
      this.valMsgMachinaryVehLocUpdate = false;
      if (!this.locUpdatemachinary.leavingdate_time) {
        let obj = {
          vehicleNumber: this.locUpdatemachinary.vehicle_no,
          reachedDateTime: moment(
            this.locUpdatemachinary.reachingdate_time
          ).format('YYYY-MM-DD HH:mm'),
          reasonForDelay: this.locUpdatemachinary.delay_reason,
          // "leavingDateTime": moment(this.locationUpdate.leavingdate_time).format("YYYY-MM-DD HH:mm"),
          purposeStatus: this.locUpdatemachinary.purposeStatus,
          location: this.locUpdatemachinary.location,
          remarks: this.locUpdatemachinary.remarks,
          vehicleCategory: this.locUpdatemachinary.vehicle_category,
          // "siteId": this.locationUpdate.site
        };
        this.commonservice
          .updateMachinaryVehEntry(obj)
          .subscribe((res: any) => {
            if (res && res['status'] === 'success') {
              this.alertcall.showSuccess('Success', res['message']);
              fr.reset();
              this.getlogdata();
              this.getLocations();
              this.activeTab = 'Vehicle Log';
              this.viewTab = false;
            } else {
              this.alertcall.showWarning('Alert', res['message']);
            }
          });
      } else {
        let exitobj = {
          vehicleNumber: this.locUpdatemachinary.vehicle_no,
          location: this.locUpdatemachinary.location,
          siteId: this.siteIdMac,
          vmId: this.editMacLocationData.vmId,
          vehicleCategory: this.locUpdatemachinary.vehicle_category,
          leavingDateTime: moment(
            this.locUpdatemachinary.leavingdate_time
          ).format('YYYY-MM-DD HH:mm'),
        };
        this.commonservice
          .updatePassvehilceexitlocationData(exitobj)
          .subscribe((res: any) => {
            if (res && res['status'] === 'success') {
              this.alertcall.showSuccess('Success', res['message']);
              fr.reset();
              this.getlogdata();
              this.getLocations();
              this.activeTab = 'Vehicle Log';
              this.viewTab = false;
            } else {
              this.alertcall.showWarning('Alert', res['message']);
            }
          });
      }
    }
  }
  UpdateEmergencyVehLocationData(fr: any) {
    if (!this.locUpdateemergency.leavingdate_time) {
      let obj = {
        vehicleNumber: this.locUpdateemergency.vehicle_no
          ? this.locUpdateemergency.vehicle_no
          : '',
        reachedDateTime: this.locUpdateemergency.reachingdate_time
          ? moment(this.locUpdateemergency.reachingdate_time).format(
              'YYYY-MM-DD HH:mm'
            )
          : 0,
        reasonForDelay: this.locUpdateemergency.delay_reason
          ? this.locUpdateemergency.delay_reason
          : '',
        // "leavingDateTime": moment(this.locationUpdate.leavingdate_time).format("YYYY-MM-DD HH:mm"),
        purposeStatus: this.locUpdateemergency.purposeStatus
          ? this.locUpdateemergency.purposeStatus
          : '',
        location: this.locUpdateemergency.location
          ? this.locUpdateemergency.location
          : '',
        remarks: this.locUpdateemergency.remarks
          ? this.locUpdateemergency.remarks
          : '',
        vehicleCategory: this.locUpdateemergency.vehicle_category
          ? this.locUpdateemergency.vehicle_category
          : '',
        // "siteId": this.locationUpdate.site
      };
      this.commonservice.updateMachinaryVehEntry(obj).subscribe((res: any) => {
        if (res && res['status'] === 'success') {
          this.alertcall.showSuccess('Success', res['message']);
          fr.reset();
          this.getlogdata();
          this.getLocations();
          this.activeTab = 'Vehicle Log';
          this.viewTab = false;
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
      });
    } else {
      let exitobj = {
        vehicleNumber: this.locUpdateemergency.vehicle_no
          ? this.locUpdateemergency.vehicle_no
          : '',
        location: this.locUpdateemergency.location
          ? this.locUpdateemergency.location
          : '',
        siteId: this.siteIdEmergency ? this.siteIdEmergency : '',
        vmId: this.editEmeLocationData.vmId
          ? this.editEmeLocationData.vmId
          : '',
        vehicleCategory: this.locUpdateemergency.vehicle_category
          ? this.locUpdateemergency.vehicle_category
          : '',
        leavingDateTime: this.locUpdateemergency.leavingdate_time
          ? moment(this.locUpdateemergency.leavingdate_time).format(
              'YYYY-MM-DD HH:mm'
            )
          : 0,
      };
      this.commonservice
        .updatePassvehilceexitlocationData(exitobj)
        .subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            fr.reset();
            this.getlogdata();
            this.getLocations();
            this.activeTab = 'Vehicle Log';
            this.viewTab = false;
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
    }
  }
  UpdateGCVehLocationData(fr: any) {
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
      this.valMsgGCVehLocUpdate = true;
    } else {
      this.valMsgGCVehLocUpdate = false;
      if (!this.locUpdateGC.leavingdate_time) {
        let formData = new FormData();
        formData.append('goodsType', this.locUpdateGC.goods_type);
        formData.append(
          'reachedDateTime',
          moment(this.locUpdateGC.reachingdate_time).format('YYYY-MM-DD HH:mm')
        );
        formData.append('documentType', this.locUpdateGC.doc_type);
        formData.append('documentNumber', this.locUpdateGC.doc_number);
        // formData.append("packagingDetails",this.locUpdateGC.packingdetails)
        formData.append('packagingDetails', this.locUpdateGC.packingdetails);
        formData.append('itemsList', this.locUpdateGC.itemlist);
        formData.append('tareWeight', this.locUpdateGC.tareweight);
        formData.append('grossWeight', this.locUpdateGC.grossweight);
        formData.append('netWeight', this.locUpdateGC.netweight);
        formData.append(
          'receiverContractorName',
          this.locUpdateGC.reccontractorname
        );
        formData.append('toAddressLocation', this.locUpdateGC.toaddress);
        formData.append('handOverFrom', this.locUpdateGC.handoverfrom);
        formData.append('storesLocation', this.locUpdateGC.storeslocation);
        formData.append('photo', this.selectedFILEVEHICLE);
        formData.append('documentUpload', this.selectedFILEDOC);
        // formData.append("purposeStatus",this.locUpdateGC.purposeStatus)
        formData.append('location', this.locUpdateGC.location);
        formData.append('remarks', this.locUpdateGC.remarks);
        formData.append('vehicleCategory', this.locUpdateGC.vehicle_category);
        formData.append('vehicleNumber', this.locUpdateGC.vehicle_no);

        // let obj={
        //   "vehicleNumber": this.locUpdateGC.vehicle_no,
        //   "reachedDateTime": moment(this.locUpdateGC.reachingdate_time).format("YYYY-MM-DD HH:mm"),
        //   "reasonForDelay": this.locUpdateGC.delay_reason,
        //   // "leavingDateTime": moment(this.locationUpdate.leavingdate_time).format("YYYY-MM-DD HH:mm"),
        //   "purposeStatus": this.locUpdateGC.purposeStatus,
        //   "location": this.locUpdateGC.location,
        //   "remarks": this.locUpdateGC.remarks,
        //   "vehicleCategory": this.locUpdateGC.vehicle_category,
        //   // "siteId": this.locationUpdate.site
        // }
        this.commonservice
          .updategoodscarrierVehEntry(formData)
          .subscribe((res: any) => {
            if (res && res['status'] === 'success') {
              this.alertcall.showSuccess('Success', res['message']);
              fr.reset();
              this.getlogdata();
              this.getLocations();
              this.activeTab = 'Vehicle Log';
              this.viewTab = false;
            } else {
              this.alertcall.showWarning('Alert', res['message']);
            }
          });
      } else {
        let exitobj = {
          vehicleNumber: this.locUpdateGC.vehicle_no,
          location: this.locUpdateGC.location,
          siteId: this.siteIdGC,
          vmId: this.editgoodsCarrirLocationData.vmId,
          vehicleCategory: this.locUpdateGC.vehicle_category,
          leavingDateTime: moment(this.locUpdateGC.leavingdate_time).format(
            'YYYY-MM-DD HH:mm'
          ),
        };
        this.commonservice
          .updatePassvehilceexitlocationData(exitobj)
          .subscribe((res: any) => {
            if (res && res['status'] === 'success') {
              this.alertcall.showSuccess('Success', res['message']);
              fr.reset();
              this.getlogdata();
              this.getLocations();
              this.activeTab = 'Vehicle Log';
              this.viewTab = false;
            } else {
              this.alertcall.showWarning('Alert', res['message']);
            }
          });
      }
    }
  }
  saveExitGateData(fr: any) {
    if (this.ExitGate.vehicle_category !== 'emergency') {
      console.log('entered');
      this.currentTime = moment(new Date()).format('YYYY-MM-DDTHH:mm');
      console.log(this.currentTime);
      let array = Object.keys(fr.value).filter((k: any) => {
        if (
          fr.value[k] === '' ||
          fr.value[k] === null ||
          fr.value[k] === undefined
        ) {
          return k;
        }
      });
      if (array.length !== 0 || !this.selectedFILEOUT) {
        this.validationMsgExit = true;
      } else {
        this.validationMsgExit = false;
        if (
          this.ExitGate.exidatetime > this.currentTime ||
          this.ExitGate.exidatetime < this.inDetails
        ) {
          this.validationMessageTime = true;
        } else {
          this.validationMessageTime = false;
          const formData = new FormData();
          formData.append('photo', this.selectedFILEOUT);
          formData.append('vehicleNumber', this.ExitGate.vehicle_number);
          formData.append(
            'exitGateDateTime',
            moment(this.ExitGate.exidatetime).format('YYYY-MM-DD HH:mm')
          );
          formData.append('reasonForDelay', this.ExitGate.delayreason);
          formData.append('passengerCount', this.ExitGate.passengercount);
          formData.append('vehicleCategory', this.ExitGate.vehicle_category);
          // formData.append("leavingDateTime",moment(this.ExitGate.leavingDate).format("YYYY-MM-DD HH:mm"))
          formData.append('purposeStatus', this.ExitGate.purposestatus);
          formData.append('remarks', this.ExitGate.remarks);
          formData.append('updatedBy', this.userdetails.data.username);

          this.commonservice
            .updatePassengervehExit(formData)
            .subscribe((res: any) => {
              if (res && res['status'] === 'success') {
                this.alertcall.showSuccess('Success', res['message']);
                fr.reset();
                this.getlogdata();
                this.getLocations();
                this.activeTab = 'Vehicle Log';
                this.ViewExit = false;
                this.vehicleNumber = this.ExitGate.vehicle_number;
                this.selectedFILEOUT = '';
                this.selectedfileout = '';
              } else {
                this.alertcall.showWarning('Alert', res['message']);
              }
            });
        }
      }
    } else {
      const formData = new FormData();
      formData.append('photo', this.selectedFILEOUT);
      formData.append(
        'vehicleNumber',
        this.ExitGate.vehicle_number ? this.ExitGate.vehicle_number : ''
      );
      formData.append(
        'exitGateDateTime',
        this.ExitGate.exidatetime ? this.ExitGate.exidatetime : 0
      );
      formData.append(
        'reasonForDelay',
        this.ExitGate.delayreason ? this.ExitGate.delayreason : ''
      );
      formData.append(
        'vehicleCategory',
        this.ExitGate.vehicle_category ? this.ExitGate.vehicle_category : ''
      );
      formData.append(
        'passengerCount',
        this.ExitGate.passengercount ? this.ExitGate.passengercount : ''
      );
      // formData.append("leavingDateTime",moment(this.ExitGate.leavingDate).format("YYYY-MM-DD HH:mm"))
      formData.append(
        'purposeStatus',
        this.ExitGate.purposestatus ? this.ExitGate.purposestatus : ''
      );
      formData.append(
        'remarks',
        this.ExitGate.remarks ? this.ExitGate.remarks : ''
      );
      formData.append('updatedBy', this.userdetails.data.username);

      this.commonservice
        .updatePassengervehExit(formData)
        .subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            fr.reset();
            this.getlogdata();
            this.getLocations();
            this.activeTab = 'Vehicle Log';
            this.ViewExit = false;
            this.vehicleNumber = this.ExitGate.vehicle_number;
            this.selectedFILEOUT = '';
            this.selectedfileout = '';
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
    }
  }
  validateNumber(e: any) {
    const reg = /^\d*(\d{0,5})?$/g;
    let input = e.target.value + String.fromCharCode(e.charCode);

    if (!reg.test(input)) {
      e.preventDefault();
    }
  }
  deletedata(data: any) {
    this.deleteData = data;
    this.deleteVehicleNumber = data.vehicleNumber;
    this.deletemodal.show();
  }
  hideChildModal() {
    this.deletemodal.hide();
  }
  deleteperminently() {
    let obj = {
      vmId: this.deleteData.vmId,
    };
    this.commonservice.deleteVehicleLog(obj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.deletemodal.hide();
        this.alertcall.showSuccess('Success', res['message']);
        this.getlogdata();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
  updateMyDate(ev: any) {
    this.yesterday = moment(ev[0]).format('YYYY-MM-DD');
    this.today = moment(ev[1]).format('YYYY-MM-DD');
    this.getlogdata();
  }
  getDAte() {
    this.getlogdata();
  }
}
