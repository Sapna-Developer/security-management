import { ActivatedRoute } from '@angular/router';
import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/services/common.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpParams } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import * as moment from 'moment';
import { NG_VALIDATORS } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { AlertCallService } from 'src/app/services/alert-call.service';

@Component({
  selector: 'app-visitormovement',
  templateUrl: './visitormovement.component.html',
  styleUrls: ['./visitormovement.component.css'],
  animations: [
    trigger('panelState', [
      state('open', style({ height: '85px', overflow: 'hidden' })),
      state('closed', style({ height: '*' })),
      transition('open <=> closed', animate('300ms ease-in-out')),
    ]),
  ],
})
export class VisitormovementComponent implements OnInit {
  filenamearray1: any[] = [];
  fileUploadUrlspr: any[] = [];
  selectedfiles: any[] = [];
  @ViewChild('sites')
  public addsign!: ModalDirective;
  @ViewChild('vot')
  public popup!: ModalDirective;
  @ViewChild('signaturemodal') public signaturemodal!: ModalDirective;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild('deletemodal') public deletemodal!: ModalDirective;
  sig!: SignaturePad;
  activeTab = 'onArrival';
  visitormovement: any = {};
  visitormovementout: any = {};
  signatureImg: any;
  vot: any;
  visitorOutTimeEntry: any = {};
  status: any;
  signature: any;
  purposeData: any = [];
  listData: any = [];
  visitorInTime: any;
  visitorOutTime: any;
  visitingCardDeposited: any;
  vmId: any;
  index: any;
  openindex!: Number;
  finaldata: any = [];
  visitorcarddep: any;
  visitorTime: any;
  rmrks: any;
  min: any;
  max: any;
  datetime: any;
  nowTime: any;
  currentTime: any;
  selectedfile: any;
  imageUrl!: string;
  DATA: any;
  sitedata: any;
  userdetails: any;
  VisitorName: any;
  validationMsg: boolean = false;
  validationMessage: boolean = false;
  validationMessageTime: boolean = false;
  offset = 1;
  config = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
  };
  search: any = {};
  mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  visitorintime: any;
  visitorOutData: any = [];
  cardDepositeOut: any;
  meetTimeOut: any;
  remarksOut: any;
  visitorTimeOut: any;
  maximumDate: any;
  deleteData: any;
  deleteName: any;

  constructor(
    private service: CommonService,
    public route: ActivatedRoute,
    private alertcall: AlertCallService
  ) {}
  opensignaturepad() {
    this.signaturemodal.show();
  }
  closesignaturemodal() {
    this.signaturemodal.hide();
  }
  clear() {
    this.sig.clear();
  }
  saveSign() {
    this.imageUrl = this.sig.toDataURL();
    const imageBlob = this.dataURItoBlob(this.imageUrl);
    var file = new File([imageBlob], 'fileName.jpeg', {
      type: "'image/jpeg'",
    });
    this.visitormovement.signature = file;
    this.closesignaturemodal();
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
  searchbyvisitor() {
    if (this.search.name.length > 1) {
      this.offset = 1;
      this.getVisitorDataList();
    }
    if (!this.search.name) {
      this.getVisitorDataList();
    }
  }
  ngOnInit(): void {
    this.visitormovement.datetime = moment(new Date()).format(
      'YYYY-MM-DDTHH:mm'
    );
    this.currentTime = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    // this.visitormovementout.visitortime = moment(new Date()).format(
    //   'YYYY-MM-DDTHH:mm'
    // );
    // this.maximumDate = moment(new Date().getTime()).format('YYYY-MM-DDTHH:mm');
    // console.log(this.visitormovement.datetime);

    this.visitormovement.purposeofvisit = null;
    this.visitormovement.meeting_time = null;
    this.visitormovement.site_id = null;
    this.visitormovementout.meetingtime = null;
    this.getsitedata();
    this.getPurpose();
    this.getVisitorDataList();
    this.route.queryParams.subscribe((res: any) => {
      if (res.data === 'onArrival') {
        this.activeTab = 'onArrival';
      } else if (res.data === 'list') {
        this.activeTab = 'visitorlist';
      }
    });
    this.sig = new SignaturePad(this.canvas.nativeElement);
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
    }
  }
  arrival(data: any) {
    this.activeTab = data;
  }
  list(data: any) {
    this.activeTab = data;
  }
  signPad() {
    this.addsign.show();
  }
  closemodal() {
    // this.addsign.hide();
    this.popup.hide();
  }
  onFileInput(ev: any) {
    if (ev && ev.target && ev.target.files && ev.target.files.length > 0) {
      this.selectedfile = ev.target.files[0].name;
      this.visitormovement.photo = ev.target.files[0];
    }
    // folded = 'open';
  }
  getsitedata() {
    this.service.getSite().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.sitedata = res.data;
        this.sitedata.forEach((ele: any) => {
          var optionText = ele.siteName;
          if (ele.siteName.length > 40) {
            var newOption = optionText.substring(0, 40);
            ele['siteName'] = newOption + '...';
          }
        });
        // this.visitormovement.siteId = res.data[0].siteId;
      }
    });
  }
  toggleFold(user: any) {
    this.listData.forEach((element: any) => {
      if (user.vmId === element.vmId) {
        if (element.toggled === true) {
          element.toggled = false;
        } else {
          element.toggled = true;
        }
      } else {
        element.toggled = false;
      }
    });
  }
  visitorData(visitor: any) {
    this.VisitorName = visitor.visitorName;
    this.visitorintime = visitor.visitorInTime;
    this.visitorOutTimeEntry = visitor;
    this.popup.show();
    this.visitormovement.meetingtime = null;
    this.visitormovementout.visitortime = moment(new Date()).format(
      'YYYY-MM-DDTHH:mm'
    );
  }
  gettime() {
    // console.log(this.visitormovementout.visitortime);
    // this.currentTime = moment(this.nowTime).format('YYYY-MM-DDTHH:MM:SS');
    // console.log(this.currentTime);
    // if(this.visitormovementout.visitortime>this.currentTime){
    //   this.validationMessageTime = true
    // }else{
    //   this.validationMessageTime = false
    // }
  }
  submitDetails(data: any) {
    let array = Object.keys(data.value).filter((k: any) => {
      if (
        data.value[k] === '' ||
        data.value[k] === null ||
        data.value[k] === undefined
      ) {
        return k;
      }
    });

    // carddeposite: undefined;
    // meetingtime: null;
    // remarks: undefined;
    // visitortime: '2023-02-02T17:48';

    // console.log(this.cardDepositeOut);

    if (array.length !== 0) {
      this.validationMessage = true;
    } else {
      this.validationMessage = false;
      this.currentTime = moment(new Date()).format('YYYY-MM-DDTHH:mm');
      console.log(this.currentTime);
      console.log(this.visitorintime);
      console.log(this.visitormovementout.visitortime);
      if (
        this.visitormovementout.visitortime > this.currentTime ||
        this.visitormovementout.visitortime < this.visitorintime
      ) {
        this.validationMessageTime = true;
      } else {
        this.validationMessageTime = false;
        this.visitorOutData.push(data.value);
        this.visitorOutData.forEach((ele: any) => {
          this.cardDepositeOut = ele.carddeposite;
          this.meetTimeOut = ele.meetingtime;
          this.remarksOut = ele.remarks;
          this.visitorTimeOut = ele.visitortime;
        });
        // console.log(this.cardDepositeOut);
        // console.log(this.meetTimeOut);
        // console.log(this.remarksOut);
        // console.log(this.visitorTimeOut);

        let hour = this.meetTimeOut;
        const minute = hour.split(':');
        this.DATA = minute[0] * 60;
        let obj = {
          vmId: this.visitorOutTimeEntry.vmId,
          visitorOutTime: this.visitorTimeOut,
          remarks: this.remarksOut,
          visitingCardDeposited: this.cardDepositeOut,
          meetingtime: this.DATA,
          updatedBy: this.userdetails.data.username,
        };

        this.service.updateVisitorList(obj).subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.getVisitorDataList();
            this.visitormovementout = {};
            this.popup.hide();
          }
        });
      }
    }
  }
  submitAll(data: any) {
    let array = Object.keys(data.value).filter((k: any) => {
      if (
        data.value[k] === '' ||
        data.value[k] === null ||
        data.value[k] === undefined
      ) {
        return k;
      }
    });

    if (
      array.length !== 0 ||
      !this.selectedfile ||
      !this.visitormovement.signature
    ) {
      this.validationMsg = true;
    } else {
      this.validationMsg = false;
      this.currentTime = moment(new Date()).format('YYYY-MM-DDTHH:mm');
      console.log(this.currentTime);
      // console.log(this.visitorintime);
      console.log(this.visitormovement.datetime);
      if (this.visitormovement.datetime > this.currentTime) {
        this.validationMessageTime = true;
      } else {
        this.validationMessageTime = false;
        let hour = this.visitormovement.meeting_time;
        const minute = hour.split(':');
        this.DATA = minute[0] * 60;

        const formdata = new FormData();
        formdata.append('visitorName', this.visitormovement.visitorname);
        formdata.append('contactNumber', this.visitormovement.contactnumber);
        formdata.append('visitPurpose', this.visitormovement.purposeofvisit);
        formdata.append('address', this.visitormovement.address);
        formdata.append('whomToMeet', this.visitormovement.whomtomeet);
        formdata.append('personalIdType', this.visitormovement.idtype);
        formdata.append('personalIdNumber', this.visitormovement.number);
        formdata.append('vehicleNumber', this.visitormovement.vehiclenumber);
        formdata.append('escorterName', this.visitormovement.escotername);
        formdata.append('escorterId', this.visitormovement.escorterid);
        formdata.append('photo', this.visitormovement.photo);
        formdata.append('visitorInTime', this.visitormovement.datetime);
        formdata.append('signature', this.visitormovement.signature);
        formdata.append('siteId', this.visitormovement.site_id);
        formdata.append('meetingtime', this.DATA);
        formdata.append('createdBy', this.userdetails.data.username);
        this.service.addVisitor(formdata).subscribe((res: any) => {
          if (res && res['status'] === 'success') {
            this.alertcall.showSuccess('Success', res['message']);
            this.visitormovement = {};
            this.clear();
            this.selectedfile = '';
            this.visitormovement.site_id = null;
            this.visitormovement.purposeofvisit = null;
            this.visitormovement.meeting_time = null;
            this.getVisitorDataList();
            this.activeTab = 'visitorlist';
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
      }
    }
  }
  getPurpose() {
    const formdata = new FormData();
    formdata.append('purpose', 'Personal');
    formdata.append('purposeFor', 'Personal');
    formdata.append('createdBy', 'test');
    this.service.getVisitorPurposeDropdown(formdata).subscribe((res: any) => {
      this.purposeData = res.data;
      this.getVisitorDataList();
    });
  }
  getVisitorDataList() {
    let params = new HttpParams();
    (params = params.append('limit', 5)),
      (params = params.append('page', this.offset));
    params = params.append(
      'visitorName',
      this.search.name ? this.search.name : ''
    );
    this.service.getVisitorList(params).subscribe((res: any) => {
      res.data.forEach((ele: any) => {
        if (ele.TimeSpend !== null) {
          // ele['TimeSpend'] = this.transformMinute(ele.TimeSpend);
          const date1 = ele.visitorInTime;
          const date2 = ele.visitorOutTime;
          const diffInMs = Date.parse(date2) - Date.parse(date1);
          const diffInHours = diffInMs / 1000 / 60 / 60;
          ele['timespend'] = this.msToTime(diffInMs);
        }
        ele['toggled'] = false;
        this.vmId = ele['vmId'];
      });
      this.listData = res.data;
      this.listData.forEach((ele: any) => {
        if (ele.visitorOutTime === '') {
          ele.visitorOutTime = null;
        }
      });
      this.config.totalItems = res.count;
      this.config.currentPage = this.offset;
    });
  }
  msToTime(ms: any) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    // return h + ':' + m + ':' + s;
    return h + 'hrs' + ' ' + m + 'Mins';
  }
  transformMinute(value: number) {
    let hours = Math.floor(value / 60);
    let minutes = Math.floor(value % 60);
    return hours + ' hrs ' + minutes + ' mins';
  }
  pageChanged(ev: any) {
    // console.log(ev);
    this.offset = ev;
    this.getVisitorDataList();
  }
  deletedata(data: any) {
    this.deleteData = data;
    this.deleteName = data.visitorName;
    this.deletemodal.show();
  }

  hideChildModal() {
    this.deletemodal.hide();
  }
  deleteperminently() {
    let obj = {
      vmId: this.deleteData.vmId,
    };

    this.service.deleteVisitor(obj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.deletemodal.hide();
        this.alertcall.showSuccess('Success', res['message']);
        this.getVisitorDataList();
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
}
