import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-vehicledashboard',
  templateUrl: './vehicledashboard.component.html',
  styleUrls: ['./vehicledashboard.component.css'],
})
export class VehicledashboardComponent implements OnInit {
  bsRangeValue!: Date[];
  dashboard: any = {};
  LocationList: any = [];
  RegionList: any = [];
  ClusterList: any = [];
  StateList: any = [];
  sitedata: any = [];
  sitedata1: any = [];
  dashboardSite: any;
  dashboardLocation: any;
  vehiclemovementdata: any = [];
  stateWiseData: any = [];
  multi!: { name: any; series: { name: any; value: any }[] }[];
  view: any = [];
  colorScheme = {
    domain: ['#9370DB', '#FA8072'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  legendTitle = '';
  yAxisLabel = '';
  clusterNames: any = [];
  array: any = [];
  yesterday: any;
  today: any;
  dashboardRegion: any;
  dashboardState: any;
  dashboardCluster: any;
  totalemergencyIn: any;
  totalemergencyOut: any;
  totalgoodscarrierIn: any;
  totalgoodscarrierOut: any;
  totalmachineryIn: any;
  totalmachineryOut: any;
  totalpassengerIn: any;
  totalpassengerOut: any;
  stateBasedList: any = [];
  resName: any;
  // isRegionDisabled = true;
  // isStateDisabled = true;
  // isClusterDisabled = true;
  // isSiteDisabled = true;

  constructor(
    private commonService: CommonService,
    private alertcall: AlertCallService,
    private router: Router
  ) {}

  ngOnInit(): void {
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    this.dashboard.filterfor = '';
    this.dashboard.region = '';
    this.dashboard.state = '';
    this.dashboard.cluster = '';
    this.dashboard.site = '';
    // this.bsRangeValue = [yesterday, today];
    // this.getData();
    // this.getsitedata();
    // this.getLocFrSite();
    // this.getRegionForFilter();
    this.getRegions();
    // this.getClusters();
    // this.getStates();
    this.totalemergencyIn = 0;
    this.totalemergencyOut = 0;
    this.totalgoodscarrierIn = 0;
    this.totalgoodscarrierOut = 0;
    this.totalmachineryIn = 0;
    this.totalmachineryOut = 0;
    this.totalpassengerIn = 0;
    this.totalpassengerOut = 0;
  }

  onCardClick(data: any) {
    this.router.navigate(['admin/vehicle_movement'], {
      queryParams: { data: 'vlog', id: data },
    });
    // console.log(ev);
  }
  updateMyDate(ev: any) {
    this.yesterday = moment(ev[0]).format('YYYY-MM-DD');
    this.today = moment(ev[1]).format('YYYY-MM-DD');
    this.getData();
  }

  getLocFrSite() {
    let params = new HttpParams();
    params = params.append('siteId', this.dashboard.site);
    this.commonService.getLocationBySite(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        this.LocationList = res.data;
      }
    });
  }
  getRegionData() {
    // if (this.dashboard.filterfor && this.isRegionDisabled) {
    //   this.isRegionDisabled = !this.isRegionDisabled;
    // }

    // this.getRegions();
    // this.getClusters();
    this.getStates();
    // this.getsitedata();
    // this.getData();
  }
  getStateData() {
    // if (this.dashboard.region && this.isStateDisabled) {
    //   this.isStateDisabled = !this.isStateDisabled;
    // }
    // this.getStates();

    // this.getRegions();
    this.getClusters();
    // this.getStates();
    // this.getSiteBasedRegStateCluster();
    // this.getsitedata();
    // this.getData();
  }
  getClusterData() {
    // if (this.dashboard.state && this.isClusterDisabled) {
    //   this.isClusterDisabled = !this.isClusterDisabled;
    // }
    // this.getRegions();
    // this.getStates();
    // this.getSiteBasedRegStateCluster();
    this.getsitedata();
    // this.getData();
  }
  getSiteData() {
    // if (this.dashboard.cluster && this.isSiteDisabled) {
    //   this.isSiteDisabled = !this.isSiteDisabled;
    // }

    // this.getsitedata();
    this.getData();
    // this.getSiteBasedRegStateCluster();

    // this.getStates();
    // this.getRegions();
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
        this.RegionList = '';
      } else {
        this.RegionList = res.data;
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
        this.StateList = '';
      } else {
        this.StateList = res.data;
        if (this.StateList.includes(this.dashboard.state)) {
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
        this.ClusterList = '';
      } else {
        this.ClusterList = res.data;
        if (this.ClusterList.includes(this.dashboard.cluster)) {
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
    this.getData();
    // });
  }
  getSiteBasedRegStateCluster() {
    let params = new HttpParams();
    console.log(this.dashboard.site);

    params = params.append(
      'site',
      this.dashboard.site ? this.dashboard.site : ''
    );
    params = params.append(
      'state',
      this.dashboard.state ? this.dashboard.state : ''
    );
    params = params.append(
      'cluster',
      this.dashboard.cluster ? this.dashboard.cluster : ''
    );
    this.commonService.getSiteBasedCSR(params).subscribe((res: any) => {
      console.log(res);
      this.stateBasedList = res.data;
      if (this.stateBasedList) {
        this.dashboard.state = this.stateBasedList.state;
        this.dashboard.region = this.stateBasedList.region;
        this.dashboard.cluster = this.stateBasedList.cluster;
      }
    });
  }
  getData() {
    this.totalemergencyIn = 0;
    this.totalemergencyOut = 0;
    this.totalgoodscarrierIn = 0;
    this.totalgoodscarrierOut = 0;
    this.totalmachineryIn = 0;
    this.totalmachineryOut = 0;
    this.totalpassengerIn = 0;
    this.totalpassengerOut = 0;
    // if (this.dashboard.site === null) {
    //   this.dashboardSite = '';
    // } else {
    //   this.dashboardSite = this.dashboard.site;
    // }
    // if (this.dashboard.location === null) {
    //   this.dashboardLocation = '';
    // } else {
    //   this.dashboardLocation = this.dashboard.location;
    // }

    let params = new HttpParams();
    params = params.append('fromDate', this.yesterday ? this.yesterday : '');
    params = params.append('toDate', this.today ? this.today : '');
    params = params.append(
      'siteName',
      this.dashboard.site ? this.dashboard.site : ''
    );
    // params = params.append(
    //   'locationId',
    //   this.dashboardLocation ? this.dashboardLocation : ''
    // );
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

    this.array = [];
    this.commonService
      .getVehiclemovementReport(params)
      .subscribe((res: any) => {
        if (this.dashboard.filterfor === 'region') {
          this.array = [];
          this.multi = [];
          this.array = res.data.region;
          this.resName = this.dashboard.filterfor;
        }
        if (this.dashboard.filterfor === 'state') {
          this.array = [];
          this.multi = [];
          this.array = res.data.state;
          this.resName = this.dashboard.filterfor;
        }
        if (this.dashboard.filterfor === 'cluster') {
          this.array = [];
          this.multi = [];
          this.array = res.data.cluster;
          this.resName = this.dashboard.filterfor;
        }
        if (this.dashboard.filterfor === 'site') {
          this.array = [];
          this.multi = [];
          this.array = res.data.site;
          this.resName = this.dashboard.filterfor;
        }
        if (this.dashboard.filterfor === '') {
          this.array = [];
          this.multi = [];
          this.array = res.data.cluster;
          this.resName = 'cluster';
        }
        this.array.forEach((ele: any) => {
          this.totalemergencyIn += ele.emergencyIn;
          this.totalemergencyOut += ele.emergencyOut;
          this.totalgoodscarrierIn += ele.goodscarrierIn;
          this.totalgoodscarrierOut += ele.goodscarrierOut;
          this.totalmachineryIn += ele.machineryIn;
          this.totalmachineryOut += ele.machineryOut;
          this.totalpassengerIn += ele.passengerIn;
          this.totalpassengerOut += ele.passengerOut;
        });

        this.multi = [
          {
            name: 'Passenger',
            series: [
              {
                name: 'Vehicle In',
                value: Number(this.totalpassengerIn),
              },
              {
                name: 'Vehicle Out',
                value: Number(this.totalpassengerOut),
              },
            ],
          },
          {
            name: 'Goods Carrier ',
            series: [
              {
                name: 'Vehicle In',
                value: Number(this.totalgoodscarrierIn),
              },
              {
                name: 'Vehicle Out',
                value: Number(this.totalgoodscarrierOut),
              },
            ],
          },
          {
            name: 'Machinery',
            series: [
              {
                name: 'Vehicle In',
                value: Number(this.totalmachineryIn),
              },
              {
                name: 'Vehicle Out',
                value: Number(this.totalmachineryOut),
              },
            ],
          },
          {
            name: 'Emergency',
            series: [
              {
                name: 'Vehicle In',
                value: Number(this.totalemergencyIn),
              },
              {
                name: 'Vehicle Out',
                value: Number(this.totalemergencyOut),
              },
            ],
          },
        ];
      });
  }
  resizeChart(width: any): void {
    this.view = [width, 400];
  }
}
