import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { AlertCallService } from 'src/app/services/alert-call.service';

@Component({
  selector: 'app-visitordashboard',
  templateUrl: './visitordashboard.component.html',
  styleUrls: ['./visitordashboard.component.css'],
})
export class VisitordashboardComponent implements OnInit {
  bsRangeValue!: Date[];
  dashboard: any = {};
  sitedata: any = [];
  sitedata1: any = [];
  locationdata: any = [];
  fromDate: any;
  toDate: any;
  array: any = [];
  reportBusinessData: any = [];
  reportPersonalData: any = [];
  reportTotData: any = [];
  saleData: any;
  view: any = [];
  colorScheme: any = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB'],
  };

  gradient: boolean = true;

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel = '';
  yAxisLabel = '';
  onSelect: any;
  multi: any;
  chartDataSup: any;
  chartDataGuards: any;
  LocationList: any = [];
  totalbusinessIn: any;
  totalbusinessOut: any;
  totalbusinessOverstayed: any;
  totalpersonalIn: any;
  totalpersonalOut: any;
  totalpersonalOverstayed: any;
  totalIn: any;
  totalOut: any;
  totalOverstayed: any;
  yesterday: any;
  today: any;
  Regions: any = [];
  States: any = [];
  Clusters: any = [];
  resName: any;
  legendTitle = '';
  // isRegionDisabled = true;
  // isStateDisabled = true;
  // isClusterDisabled = true;
  // isSiteDisabled = true;
  constructor(
    private commonService: CommonService,
    private alertcall: AlertCallService
  ) {}

  ngOnInit(): void {
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    // this.bsRangeValue = [yesterday, today];
    this.dashboard.cluster = '';
    this.dashboard.site = '';
    this.dashboard.state = '';
    this.dashboard.region = '';
    this.dashboard.filterfor = '';
    // this.dashboard.location = null;
    // this.getsitedata();
    // this.getlocationdata();
    // this.getVmDashboardReport();
    this.totalbusinessIn = 0;
    this.totalbusinessOut = 0;
    this.totalbusinessOverstayed = 0;
    this.totalpersonalIn = 0;
    this.totalpersonalOut = 0;
    this.totalpersonalOverstayed = 0;
    this.totalIn = 0;
    this.totalOut = 0;
    this.totalOverstayed = 0;
    this.getRegions();
    // this.getClusters();
    // this.getStates();
    // this.getselectedRegion();
  }
  updateMyDate(ev: any) {
    this.yesterday = moment(ev[0]).format('YYYY-MM-DD');
    this.today = moment(ev[1]).format('YYYY-MM-DD');
    this.getVmDashboardReport();
  }
  getRegionData() {
    // if (
    //   this.dashboard.filterfor === this.dashboard.filterfor &&
    //   this.isRegionDisabled
    // ) {
    //   this.isRegionDisabled = !this.isRegionDisabled;
    // }
    // this.getVmDashboardReport();
    this.getStates();
  }
  async getRegions() {
    let params = new HttpParams();
    params = params.append(
      'state',
      this.dashboard.state !== undefined ? this.dashboard.state : ''
    );
    let res: any = await this.commonService.getRegionsForDashboard(params);
    // .subscribe((res: any) => {
    if (res && res['status'] === 'success') {
      // this.RegionList = res.data;
      if (this.dashboard.region === 'undefined') {
        this.Regions = '';
      } else {
        this.Regions = res.data;
      }
    } else {
      this.alertcall.showWarning('Alert', res['message']);
    }
    this.getStates();
    // });
  }
  async getStates() {
    let params = new HttpParams();
    params = params.append(
      'region',
      this.dashboard.region !== undefined ? this.dashboard.region : ''
    );
    // params = params.append(
    //   'cluster',
    //   this.dashboard.cluster!==undefined ? this.dashboard.cluster : ''
    // );
    let res: any = await this.commonService.getStatesForDashboard(params);
    // .subscribe((res: any) => {
    if (res && res['status'] === 'success') {
      // this.StateList = res.data;
      if (this.dashboard.state === 'undefined') {
        this.States = '';
      } else {
        this.States = res.data;
        if (this.States.includes(this.dashboard.state)) {
        } else {
          this.dashboard.state = '';
        }
      }
    } else {
      this.alertcall.showWarning('Alert', res['message']);
    }
    this.getClusters();
    // });
  }
  async getClusters() {
    let params = new HttpParams();
    params = params.append(
      'region',
      this.dashboard.region === undefined ? '' : this.dashboard.region
    );
    params = params.append(
      'state',
      this.dashboard.state !== undefined ? this.dashboard.state : ''
    );
    let res: any = await this.commonService.getClustersForDashboard(params);
    // .subscribe((res: any) => {
    if (res && res['status'] === 'success') {
      // this.ClusterList = res.data;
      if (this.dashboard.cluster === 'undefined') {
        this.Clusters = '';
      } else {
        this.Clusters = res.data;
        if (this.Clusters.includes(this.dashboard.cluster)) {
        } else {
          this.dashboard.cluster = '';
        }
      }
    } else {
      this.alertcall.showWarning('Alert', res['message']);
    }
    this.getsitedata();
    // });
  }
  async getsitedata() {
    let params = new HttpParams();
    params = params.append(
      'region',
      this.dashboard.region !== undefined ? this.dashboard.region : ''
    );
    params = params.append(
      'cluster',
      this.dashboard.cluster !== undefined ? this.dashboard.cluster : ''
    );
    params = params.append(
      'state',
      this.dashboard.state !== undefined ? this.dashboard.state : ''
    );
    let res: any = await this.commonService.getsiteForDashboard(params);
    // .subscribe((res: any) => {
    if (res && res['status'] == 'success') {
      if (this.dashboard.site === 'undefined') {
        this.sitedata = '';
      } else {
        this.sitedata = res.data;
        this.sitedata1 = res.data;
        let array: any = [];
        this.sitedata.forEach((ele: any) => {
          array.push({ siteName: ele, name: ele });
        });
        array.forEach((ele: any) => {
          var optionText = ele.name;
          if (ele.name.length > 22) {
            var newOption = optionText.substring(0, 22);
            ele.name = newOption + '...';
          }
        });
        this.sitedata = array;
        if (this.sitedata1.includes(this.dashboard.site)) {
        } else {
          this.dashboard.site = '';
        }
        // this.sitedata.includes((ele:any)=>{
        //   if(ele!==this.dashboard.site){
        //     this.dashboard.site=""
        //   }
        // })
      }
      // this.dashboard.site = res.data[0].siteId
    } else {
      this.alertcall.showWarning('Alert', res['message']);
    }
    this.getVmDashboardReport();
    // });
  }
  // getRegions() {
  //   this.commonService.getRegions().subscribe((res: any) => {
  //     if (res && res['status'] === 'success') {
  //       this.Regions = res.data;
  //     }
  //   });
  // }
  getStateData() {
    // if (this.dashboard.region && this.isStateDisabled) {
    //   this.isStateDisabled = !this.isStateDisabled;
    // }
    this.getClusters();
    // this.getStates();
    // this.getVmDashboardReport();
  }
  getClusterData() {
    this.getsitedata();
    // if (this.dashboard.state && this.isClusterDisabled) {
    //   this.isClusterDisabled = !this.isClusterDisabled;
    // }
    // this.getClusters();
    // this.getVmDashboardReport();
  }
  getSiteData() {
    // if (this.dashboard.cluster && this.isSiteDisabled) {
    //   this.isSiteDisabled = !this.isSiteDisabled;
    // }
    this.getVmDashboardReport();
  }
  getlocationdata() {
    this.commonService.getLocation().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationdata = res.data;
        // this.dashboard.location = res.data[0].locationId
      }
    });
  }
  getVmDashboardReport() {
    this.totalbusinessIn = 0;
    this.totalbusinessOut = 0;
    this.totalbusinessOverstayed = 0;
    this.totalpersonalIn = 0;
    this.totalpersonalOut = 0;
    this.totalpersonalOverstayed = 0;
    this.totalIn = 0;
    this.totalOut = 0;
    this.totalOverstayed = 0;
    let params = new HttpParams();
    params = params.append('fromDate', this.yesterday ? this.yesterday : '');
    params = params.append('toDate', this.today ? this.today : '');
    params = params.append(
      'filterFor',
      this.dashboard.filterfor ? this.dashboard.filterfor : ''
    );
    params = params.append(
      'region',
      this.dashboard.region ? this.dashboard.region : ''
    );
    params = params.append(
      'state',
      this.dashboard.state ? this.dashboard.state : ''
    );
    params = params.append(
      'cluster',
      this.dashboard.cluster ? this.dashboard.cluster : ''
    );
    params = params.append(
      'siteName',
      this.dashboard.site ? this.dashboard.site : ''
    );
    this.commonService.getVmReportData(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        if (this.dashboard.filterfor === '') {
          this.resName = 'cluster';
        } else {
          this.resName = this.dashboard.filterfor;
        }
        this.array =
          res.data.region ||
          res.data.state ||
          res.data.cluster ||
          res.data.site;
        this.array.forEach((ele: any) => {
          this.totalbusinessIn += ele.businessIn;
          this.totalbusinessOut += ele.businessOut;
          this.totalbusinessOverstayed += ele.businessOverStayed;
          this.totalpersonalIn += ele.personalIn;
          this.totalpersonalOut += ele.personalOut;
          this.totalpersonalOverstayed += ele.personalOverStayed;
          this.totalIn += ele.totalIn;
          this.totalOut += ele.totalOut;
          this.totalOverstayed += ele.totalOverStayed;
        });
        this.multi = [
          {
            name: 'Business',
            series: [
              {
                name: 'In',
                value: Number(this.totalbusinessIn),
              },
              {
                name: 'Out',
                value: Number(this.totalbusinessOut),
              },
              {
                name: 'Overstayed',
                value: Number(this.totalbusinessOverstayed),
              },
            ],
          },
          {
            name: 'Personal',
            series: [
              {
                name: 'In',
                value: Number(this.totalpersonalIn),
              },
              {
                name: 'Out',
                value: Number(this.totalpersonalOut),
              },
              {
                name: 'Overstayed',
                value: Number(this.totalpersonalOverstayed),
              },
            ],
          },
          {
            name: 'Total',
            series: [
              {
                name: 'In',
                value: Number(this.totalIn),
              },
              {
                name: 'Out',
                value: Number(this.totalOut),
              },
              {
                name: 'Overstayed',
                value: Number(this.totalOverstayed),
              },
            ],
          },
        ];
      }
    });
  }

  getLocationFrSite() {
    let params = new HttpParams();
    params = params.append('siteId', this.dashboard.site);
    this.commonService.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.LocationList = res.data;
      }
    });
  }
  onResize(event: any) {
    this.view = [200 / 1.35, 400];
  }
  resizeChart(width: any): void {
    this.view = [width, 200];
  }
}
