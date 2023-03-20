import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { AlertCallService } from 'src/app/services/alert-call.service';

@Component({
  selector: 'app-treecut',
  templateUrl: './treecut.component.html',
  styleUrls: ['./treecut.component.css'],
})
export class TreecutComponent implements OnInit {
  @ViewChild('treecuteditmodal')
  public treecuteditmodal!: ModalDirective;
  @ViewChild('deletemodal') public deletemodal!: ModalDirective;
  @ViewChild('updatephotomodal') public updatephotomodal!: ModalDirective;
  treecutdata: any = {
    site_id: '',
    tree_number: '',
    scientific_name: '',
    common_name: '',
    in_date_time: '',
    reason: '',
    area_clearance: '',
    plot_number: '',
    classification_of_land: '',
    state: '',
    district: '',
    mandal: '',
    gram_panchayat: '',
    village: '',
    log_numbers: '',
    volume_of_timber: '',
    weight_of_timber: '',
    weight_of_extra_branches: '',
    total_number_of_logs: '',
    clearing_of_extra_branches: '',
    disposal_type: '',
    area_sensor: '',
    final_disposal: '',
    latitude: '',
    longitude: '',
    treePhoto: '',
    logsPhoto: '',
    postAreaPhoto: '',
  };
  selectedtreefile: any;
  selectedlogsfile: any;
  selectedareafile: any;
  treeCutData: any = [];
  activeTab = 'Tree Cutting Details';
  tcData: any = [];

  btn: any = 'Save';
  deleteData: any;
  url: string | ArrayBuffer | null | undefined;
  gettreefile: any;

  updateData: any = [];
  file: any;
  editData: any;
  DATA: any;
  sitedata: any = [];
  treenumber: any;
  validationMsg: boolean = false;
  offset = 1;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };
  search: any = {};
  userdetails: any;
  logsPhoto: any;
  deleteTreeNumber: any;
  // state: any;
  // region: any;
  // cluster: any;

  constructor(
    private service: CommonService,
    public route: ActivatedRoute,
    private alertcall: AlertCallService
  ) {}

  ngOnInit(): void {
    let user: any = localStorage.getItem('user_details');
    if (user !== null || typeof user !== 'undefined') {
      this.userdetails = JSON.parse(user);
    }
    this.treecutdata.in_date_time = moment(new Date()).format(
      'YYYY-MM-DDTHH:mm'
    );
    this.route.queryParams.subscribe((res: any) => {
      if (res.data === 'treecutdetails') {
        this.activeTab = 'Tree Cutting Details';
      }
      //       else if(res.data==='si'){
      // this.activeTab = 'Stores Inward'
      //       }
      //       else if(res.data==='so'){
      //         this.activeTab = 'Stores Outward'
      //               }
      else if (res.data === 'tclists') {
        this.activeTab = 'Tree Cutting Lists';
      }
    });
    this.getsitedata();
    this.getTcList();
    // this.getStateData();
    // this.getRegionData();
    // this.getClusterData();
  }
  seartreeName() {
    if (this.search.name.length > 1) {
      this.offset = 1;
      this.getTcList();
    }
    if (!this.search.name) {
      this.getTcList();
    }
  }
  saveTreeCutForm(fr: any) {
    if (this.btn === 'Save') {
      let array = Object.keys(fr.value).filter((k: any) => {
        if (
          fr.value[k] === '' ||
          fr.value[k] === null ||
          fr.value[k] === undefined
        ) {
          return k;
        }
      });
      if (
        array.length !== 0 ||
        !this.treecutdata.treePhoto ||
        !this.treecutdata.logsPhoto ||
        !this.treecutdata.postAreaPhoto
      ) {
        this.validationMsg = true;
      } else {
        this.validationMsg = false;

        // console.log('submitted formdata', formData);
        // this.alert = '';
        // if (!form.valid) {
        //   this.alert = '*All the fields are mandatory. Please fill the details';
        // }
        let siteName: any;
        this.sitedata.forEach((element: any) => {
          if (element.siteId === this.treecutdata.site_id) {
            siteName = element.siteName;
          }
        });
        const formdata = new FormData();
        formdata.append('siteId', this.treecutdata.site_id);
        formdata.append('treeNumber', this.treecutdata.tree_number);
        formdata.append('scientificName', this.treecutdata.scientific_name);
        formdata.append('commonName', this.treecutdata.common_name);

        formdata.append('cuttingDateTime', this.treecutdata.in_date_time);
        formdata.append('cuttingReason', this.treecutdata.reason);
        formdata.append('areaClearance', this.treecutdata.area_clearance);
        formdata.append('surveyNoPlotNo', this.treecutdata.plot_number);
        formdata.append(
          'landClassification',
          this.treecutdata.classification_of_land
        );
        // formdata.append('state', this.treecutdata.state);
        formdata.append('district', this.treecutdata.district);
        formdata.append('mandal', this.treecutdata.mandal);
        formdata.append('gramPanchayat', this.treecutdata.gram_panchayat);
        formdata.append('village', this.treecutdata.village);
        formdata.append('latitude', this.treecutdata.latitude);
        formdata.append('longitude', this.treecutdata.longitude);
        formdata.append('logNumbers', this.treecutdata.log_numbers);
        formdata.append('timberVolume', this.treecutdata.volume_of_timber);
        formdata.append('timberWeight', this.treecutdata.weight_of_timber);
        formdata.append(
          'extraBranchesWeight',
          this.treecutdata.weight_of_extra_branches
        );
        formdata.append('numberOfLogs', this.treecutdata.total_number_of_logs);
        formdata.append(
          'extraBranchesClearing',
          this.treecutdata.clearing_of_extra_branches
        );
        formdata.append('disposalType', this.treecutdata.disposal_type);
        formdata.append('areaSensor', this.treecutdata.area_sensor);
        formdata.append('finalDisposal', this.treecutdata.final_disposal);
        formdata.append('createdBy', this.userdetails.data.username);
        formdata.append('treePhoto', this.treecutdata.treePhoto);
        formdata.append('logsPhoto', this.treecutdata.logsPhoto);
        formdata.append('postAreaPhoto', this.treecutdata.postAreaPhoto);
        // formdata.append('clusterName', this.treecutdata.cluster);
        // formdata.append('regionName', this.treecutdata.region);
        // formdata.append('stateName', this.treecutdata.state);
        this.service.addTreeCutData(formdata).subscribe((res: any) => {
          if (res && res['status'] == 'success') {
            this.treeCutData = res.data;
            this.treecutdata = {};
            this.selectedtreefile = '';
            this.selectedlogsfile = '';
            this.selectedareafile = '';
            this.getTcList();
            fr.reset();
            this.treecutdata.site_id = '';
            this.treecutdata.reason = '';
            this.treecutdata.district = '';
            this.alertcall.showSuccess('Success', res['message']);
          } else {
            this.alertcall.showWarning('Alert', res['message']);
          }
        });
      }
    } else {
      let obj = {
        tcdId: this.treecutdata.tcd_id,
        treeNumber: this.treecutdata.tree_number,
        scientificName: this.treecutdata.scientific_name,
        commonName: this.treecutdata.common_name,
        cuttingDateTime: this.treecutdata.in_date_time,
        cuttingReason: this.treecutdata.reason,
        areaClearance: this.treecutdata.area_clearance,
        surveyNoPlotNo: this.treecutdata.plot_number,
        landClassification: this.treecutdata.classification_of_land,
        // state: this.treecutdata.state,
        district: this.treecutdata.district,
        mandal: this.treecutdata.mandal,
        gramPanchayat: this.treecutdata.gram_panchayat,
        village: this.treecutdata.village,
        latitude: this.treecutdata.latitude,
        longitude: this.treecutdata.longitude,
        logNumbers: this.treecutdata.log_numbers,
        timberVolume: this.treecutdata.volume_of_timber,
        timberWeight: this.treecutdata.weight_of_timber,
        extraBranchesWeight: this.treecutdata.weight_of_extra_branches,
        numberOfLogs: this.treecutdata.total_number_of_logs,
        extraBranchesClearing: this.treecutdata.clearing_of_extra_branches,
        disposalType: this.treecutdata.disposal_type,
        areaSensor: this.treecutdata.area_sensor,
        finalDisposal: this.treecutdata.final_disposal,
        // clusterName: this.treecutdata.cluster,
        // regionName: this.treecutdata.region,
        // stateName: this.treecutdata.state,
        updatedBy: this.userdetails.data.username,
        //  treePhoto: this.treecutdata.treePhoto,
        //  logsPhoto: this.treecutdata.logsPhoto,
        //  postAreaPhoto: this.treecutdata.postAreaPhoto,
      };

      this.service.updateTreeCutDetails(obj).subscribe((res: any) => {
        if (res && res['status'] === 'success') {
          this.getTcList();

          this.activeTab = 'Tree Cutting Lists';
          this.alertcall.showSuccess('Success', res['message']);
          fr.reset();
          this.btn = 'Save';
          this.treecutdata.site_id = '';
          this.treecutdata.reason = '';
          this.treecutdata.district = '';
        } else {
          this.alertcall.showWarning('Alert', res['message']);
        }
      });
    }
  }
  onTreeFileInput(ev: any) {
    if (ev.target.files && ev.target.files.length > 0) {
      this.treecutdata.treePhoto = ev.target.files[0];
      this.selectedtreefile = ev.target.files[0].name;
    }
  }
  onLogsFileInput(ev: any) {
    if (ev.target.files && ev.target.files.length > 0) {
      this.treecutdata.logsPhoto = ev.target.files[0];
      this.selectedlogsfile = ev.target.files[0].name;
    }
  }
  onAreaFileInput(ev: any) {
    if (ev.target.files && ev.target.files.length > 0) {
      this.treecutdata.postAreaPhoto = ev.target.files[0];
      this.selectedareafile = ev.target.files[0].name;
    }
  }
  TCD(data: any) {
    this.activeTab = data;
  }
  TCLIST(data: any) {
    this.activeTab = data;
  }
  getTcList() {
    let params = new HttpParams();
    params = params.append('limit', 10);
    params = params.append('page', this.offset);
    params = params.append(
      'treeNumber',
      this.search.name ? this.search.name : ''
    );
    this.service.getTreeCutData(params).subscribe((res: any) => {
      this.tcData = res.data;
      console.log(this.tcData);

      // this.tcData.forEach((element:any) => {
      //   this.sitedata.forEach((site:any) => {
      //     if(element.siteId===site.siteId){
      //       element['siteName']=site.siteName
      //     }
      //   });

      // });
      this.config.totalItems = res.count;
      this.config.currentPage = this.offset;
    });
  }
  deletedata(data: any) {
    this.deletemodal.show();
    this.deleteData = data;
    this.deleteTreeNumber = data.treeNumber;
  }
  editdata(data: any) {
    console.log(data);

    this.treecutdata.area_clearance = data.areaClearance;
    this.treecutdata.area_sensor = data.areaSensor;
    this.treecutdata.common_name = data.commonName;
    this.treecutdata.in_date_time = moment(data.cuttingDateTime).format(
      'YYYY-MM-DD HH:mm'
    );
    this.treecutdata.reason = data.cuttingReason;
    this.treecutdata.disposal_type = data.disposalType;
    this.treecutdata.district = data.district;
    this.treecutdata.clearing_of_extra_branches = data.extraBranchesClearing;
    this.treecutdata.weight_of_extra_branches = data.extraBranchesWeight;
    this.treecutdata.final_disposal = data.finalDisposal;
    this.treecutdata.gram_panchayat = data.gramPanchayat;
    this.treecutdata.classification_of_land = data.landClassification;
    this.treecutdata.latitude = data.latitude;
    this.treecutdata.log_numbers = data.logNumbers;
    this.treecutdata.longitude = data.longitude;
    this.treecutdata.mandal = data.mandal;
    this.treecutdata.total_number_of_logs = data.numberOfLogs;
    this.treecutdata.scientific_name = data.scientificName;
    this.treecutdata.site_id = data.siteName;
    // this.treecutdata.state = data.stateName;
    // this.treecutdata.cluster = data.clusterName;
    // this.treecutdata.region = data.regionName;
    this.treecutdata.plot_number = data.surveyNoPlotNo;
    this.treecutdata.tcd_id = data.tcdId;
    this.treecutdata.volume_of_timber = data.timberVolume;
    this.treecutdata.weight_of_timber = data.timberWeight;
    this.treecutdata.tree_number = data.treeNumber;
    this.treecutdata.village = data.village;
    this.activeTab = 'Tree Cutting Details';
    this.btn = 'Update';
  }
  closeeditmodal() {
    this.treecuteditmodal.hide();
  }
  hideChildModal() {
    this.deletemodal.hide();
  }
  deleteperminently() {
    let obj = {
      tcdId: this.deleteData.tcdId,
    };

    this.service.deleteTcDetails(obj).subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.deletemodal.hide();
        this.getTcList();
      } else {
      }
    });
  }
  updPhoto(data: any, type: any) {
    this.editData = data;
    this.updatephotomodal.show();
    if (type === 'treephoto') {
      this.DATA = 'treePhoto';
      this.logsPhoto = 'Tree Photo';
      this.updateData = data.treePhoto;
    }
    if (type === 'logsphoto') {
      this.DATA = 'logsPhoto';
      this.logsPhoto = 'Logs Photo';
      this.updateData = data.logsPhoto;
    }
    if (type === 'postareaphoto') {
      this.DATA = 'postAreaPhoto';
      this.logsPhoto = 'Post Area Photo';
      this.updateData = data.postAreaPhoto;
    }
  }

  hideModal() {
    this.updatephotomodal.hide();
    // this.selectedlogsfile = '';
    // this.selectedareafile = '';
  }
  updateFileInput(ev: any) {
    let reader = new FileReader();
    if (ev.target.files && ev.target.files.length > 0) {
      this.file = ev.target.files[0];
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.url = reader.result;
        this.updateData = this.url;
        const formdata = new FormData();
        formdata.append('tcdId', this.editData.tcdId);
        formdata.append('fileFor', this.DATA);
        formdata.append('module', 'treecutting');
        formdata.append('file', this.file);
        this.service.FileUpload(formdata).subscribe((res: any) => {
          this.updatephotomodal.hide();
          this.getTcList();
        });
      };
    }
  }
  getsitedata() {
    this.service.getSite().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.sitedata = res.data;
        this.sitedata.forEach((ele: any) => {
          var optionText = ele.siteName;
          if (ele.siteName.length > 30) {
            var newOption = optionText.substring(0, 30);
            ele['siteName'] = newOption + '...';
          }
        });
        // this.treecutdata.site_id = res.data[0].siteId;
        // console.log(this.treecutdata.site_id);
      }
    });
  }
  // getStateData() {
  //   this.service.getState().subscribe((res: any) => {
  //     if (res && res['status'] == 'success') {
  //       this.state = res.data;
  //       console.log(this.state);
  //     }
  //   });
  // }
  // getRegionData() {
  //   this.service.getRegion().subscribe((res: any) => {
  //     if (res && res['status'] == 'success') {
  //       this.region = res.data;
  //       console.log(this.region);
  //     }
  //   });
  // }
  // getClusterData() {
  //   this.service.getCluster().subscribe((res: any) => {
  //     if (res && res['status'] == 'success') {
  //       this.cluster = res.data;
  //       console.log(this.cluster);
  //     }
  //   });
  // }
  pageChanged(ev: any) {
    this.offset = ev;
    this.getTcList();
  }
  validateNumber(e: any) {
    const pattern = /^\d*(\d{0,5})?$/g;
    const input = e.target.value + String.fromCharCode(e.charCode);
    if (!pattern.test(input)) {
      e.preventDefault();
    }
  }
}
