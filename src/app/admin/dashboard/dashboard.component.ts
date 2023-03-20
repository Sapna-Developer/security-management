import { HttpParams } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  title: string = 'Google Map Project';
  latitude: any;
  longitude: any;
  zoom: any;
  latlngs: any = [];
  solarIcon: any;
  ngAfterViewInit() {}
  deployedCount: any=0;
  vehicleCluster: any;
  treecutCluster: any;
  visitorCluster: any;
  requiredCount: any;
  visitorInCount: any;
  visitorOutCount: any;
  vehicleInCount: any;
  vehicleOutCount: any;
  bsRangeValue!: Date[];
  dashboard: any = {};
  RegionList: any = [];
  StateList: any = [];
  ClusterList: any = [];
  sitedata: any = [];
  stateBasedList: any = [];
  deploymentData: any = [];
  vehicleData: any = [];
  visitorData: any = [];
  securityGraph: any;
  yesterday: any;
  today: any;
  view: any = [400,350];
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
  vehicleGraph: any;
  totalemergencyIn: any;
  totalemergencyOut: any;
  totalgoodscarrierIn: any;
  totalgoodscarrierOut: any;
  totalmachineryIn: any;
  totalmachineryOut: any;
  totalpassengerIn: any=0;
  totalpassengerOut: any;
  vehicletotalIn: any;
  vehicletotalOut: any;
  visitorGraph: any;
  totalbusinessIn: any;
  totalbusinessOut: any;
  totalbusinessOverstayed: any;
  totalpersonalIn: any;
  totalpersonalOut: any;
  totalpersonalOverstayed: any;
  totalIn: any=0
  totalOut: any;
  totalOverstayed: any;
  treecutGraph!: { name: string; series: { name: string; value: number }[] }[];
  array: any = [];
  unique:any=[]
  treecutarray: any = [];
  totaltrees: any=0
  totalweight: any;
  totallogs: any;
  resName: any;

  constructor(
    private authservice: AuthService,
    private router: Router,
    private commonService: CommonService,
    private alertcall: AlertCallService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    if (this.authservice.hasValidIdToken()) {
      let auth = this.authservice.getLocalItem('authentication', true);
      if (auth !== null || typeof auth !== 'undefined') {
      } else {
      }
    } else {
      this.authservice.logOut();
    }

    this.dashboard.filterfor = '';
    this.dashboard.region = '';
    this.dashboard.state = '';
    this.dashboard.cluster = '';
    this.dashboard.site = '';
    this.setCurrentLocation();
    this.getRegions();

    this.commonService.getSite().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.sitedata = res.data;

        this.sitedata.forEach((site: any) => {
          if (
            site.latitude !== undefined &&
            site.longitude !== undefined &&
            site.latitude !== 0 &&
            site.longitude !== 0 &&
            site.latitude &&
            site.longitude &&
            site.cluster === 'hydro'
          ) {
            this.latlngs.push({
              latitude: site.latitude,
              longitude: site.longitude,
              cluster: site.cluster,
              siteName: site.siteName,
              state: site.state,
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              },
            });
          } else if (
            site.latitude !== undefined &&
            site.longitude !== undefined &&
            site.latitude !== 0 &&
            site.longitude !== 0 &&
            site.latitude &&
            site.longitude &&
            site.cluster === 'solar'
          ) {
            this.latlngs.push({
              latitude: site.latitude,
              longitude: site.longitude,
              cluster: site.cluster,
              siteName: site.siteName,
              state: site.state,
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
              },
            });
          } else if (
            site.latitude !== undefined &&
            site.longitude !== undefined &&
            site.latitude !== 0 &&
            site.longitude !== 0 &&
            site.latitude &&
            site.longitude &&
            site.cluster === 'wind'
          ) {
            this.latlngs.push({
              latitude: site.latitude,
              longitude: site.longitude,
              cluster: site.cluster,
              siteName: site.siteName,
              state: site.state,
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              },
            });
          } else if (
            site.latitude !== undefined &&
            site.longitude !== undefined &&
            site.latitude !== 0 &&
            site.longitude !== 0 &&
            site.latitude &&
            site.longitude &&
            site.cluster === 'iresp'
          ) {
            this.latlngs.push({
              latitude: site.latitude,
              longitude: site.longitude,
              cluster: site.cluster,
              siteName: site.siteName,
              state: site.state,
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
              },
            });
          }
        });
      }
    });
  }
  onMapReady(map: any) {
    if (map)
      map.setOptions({
        streetViewControl: false,
        fullscreenControl: true,
      });
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 5;
      });
    }
  }
  updateMyDate(ev: any) {
    this.yesterday = moment(ev[0]).format('YYYY-MM-DD');
    this.today = moment(ev[1]).format('YYYY-MM-DD');
    this.getAllDashboardDATA();
  }
  getAllDashboardDATA() {
    this.array=[]
    this.getTreedata();
    this.getSecuritydata();
    this.getVehicleData();
    this.getVisitorGraph();
  }
  getRegionData() {
    this.array=[]
    this.getStates();
  }
  getStateData() {
    this.array=[]
    this.getClusters();
  }
  getClusterData() {
    this.array=[]
    this.getSiteDATA();
  }
  getTreedata() {
    this.totaltrees = 0;
    this.totalweight = 0;
    this.totallogs = 0;
    let params = new HttpParams();
    params = params.append('fromDate', this.yesterday ? this.yesterday : '');
    params = params.append('toDate', this.today ? this.today : '');
    params = params.append(
      'siteName',
      this.dashboard.site ? this.dashboard.site : ''
    );
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
    this.commonService.getTcReportData(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        if (this.dashboard.filterfor === '') {
          this.resName = 'cluster';
        } else {
          this.resName = this.dashboard.filterfor;
        }
        this.treecutarray =
          res.data.region ||
          res.data.state ||
          res.data.cluster ||
          res.data.site;

        this.treecutarray.forEach((ele: any) => {
          this.totaltrees += ele.totalTrees;
          this.totalweight += ele.totalWeight;
          this.totallogs += ele.totalLogs;
          this.treecutCluster = ele.name;
          this.array.push({name:ele.name,totalTrees:ele.totalTrees})
        });
        let _ = require("lodash");
       
        let merged = _.uniqWith(this.array, (pre:any, cur:any) => {
          if (pre.name == cur.name) {
            Object.assign(cur, pre);
            return true;
          }
          return false;
        });
        this.array=merged
        this.treecutGraph = [
          {
            name: 'Tree Cut',
            series: [
              {
                name: 'trees',
                value: Number(this.totaltrees),
              },
              {
                name: 'weight',
                value: Number(this.totalweight),
              },
              {
                name: 'logs',
                value: Number(this.totallogs),
              },
            ],
          },
        ];
      } else {
        this.alertcall.showWarning('Alert', res['message']);
      }
    });
  }
  getSecuritydata() {
    let params = new HttpParams();
    params = params.append('fromDate', this.yesterday ? this.yesterday : '');
    params = params.append('toDate', this.today ? this.today : '');
    params = params.append(
      'siteName',
      this.dashboard.site ? this.dashboard.site : ''
    );
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
    this.commonService
      .getSecuritydashboarddata(params)
      .subscribe((res: any) => {
        if (res && res['status'] === 'success') {
          if (this.dashboard.filterfor === '') {
            this.resName = 'cluster';
          } else {
            this.resName = this.dashboard.filterfor;
          }
          this.deploymentData =
            res.data.region ||
            res.data.state ||
            res.data.cluster ||
            res.data.site;

          let reqsupcount: any;
          let depsupcount:any;
          let reqguacount:any;
          let depguacount:any;
          reqsupcount = res.data.totalSupCount.reqSupCount;
          depsupcount = res.data.totalSupCount.depSupCount;
          reqguacount = res.data.totalGudCount.reqGudCount;
          depguacount = res.data.totalGudCount.depGudCount;
          this.deployedCount = depsupcount + depguacount;
          this.requiredCount = reqsupcount + reqguacount;
this.deploymentData.forEach((element:any) => {
  this.array.push({name:element.name,reqCount:(element.reqSupCount+element.reqGudCount),depCount:(element.depSupCount+element.depGudCount)})
});
let _ = require("lodash");
       
        let merged = _.uniqWith(this.array, (pre:any, cur:any) => {
          if (pre.name == cur.name) {
            Object.assign(cur, pre);
            // cur.value = cur.value + "," + pre.value;
            return true;
          }
          return false;
        });
        this.array=merged
        console.log(this.array);
          this.securityGraph = [
            {
              name: 'Supervisors',
              series: [
                {
                  name: 'Required',
                  value: Number(reqsupcount),
                },
                {
                  name: 'Deployed',
                  value: Number(depsupcount),
                },
                {
                  name: 'Absent',
                  value: Number(reqsupcount) - Number(depsupcount),
                },
              ],
            },
            {
              name: 'Guards',
              series: [
                {
                  name: 'Required',
                  value: Number(reqguacount),
                },
                {
                  name: 'Deployed',
                  value: Number(depguacount),
                },
                {
                  name: 'Absent',
                  value: Number(reqguacount) - Number(depguacount),
                },
              ],
            },
          ];
        }
      });
  }

  getVehicleData() {
    this.totalemergencyIn = 0;
    this.totalemergencyOut = 0;
    this.totalgoodscarrierIn = 0;
    this.totalgoodscarrierOut = 0;
    this.totalmachineryIn = 0;
    this.totalmachineryOut = 0;
    this.totalpassengerIn = 0;
    this.totalpassengerOut = 0;
    this.vehicletotalIn = 0;
    this.totalpassengerOut = 0;
    let params = new HttpParams();
    params = params.append('fromDate', this.yesterday ? this.yesterday : '');
    params = params.append('toDate', this.today ? this.today : '');
    params = params.append(
      'siteName',
      this.dashboard.site ? this.dashboard.site : ''
    );
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

    this.commonService
      .getVehiclemovementReport(params)
      .subscribe((res: any) => {
        if (this.dashboard.filterfor === '') {
          this.resName = 'cluster';
        } else {
          this.resName = this.dashboard.filterfor;
        }
        this.vehicleData =
          res.data.region ||
          res.data.state ||
          res.data.cluster ||
          res.data.site;
        this.vehicleData.forEach((ele: any) => {
          this.totalemergencyIn += ele.emergencyIn;
          this.totalemergencyOut += ele.emergencyOut;
          this.totalgoodscarrierIn += ele.goodscarrierIn;
          this.totalgoodscarrierOut += ele.goodscarrierOut;
          this.totalmachineryIn += ele.machineryIn;
          this.totalmachineryOut += ele.machineryOut;
          this.totalpassengerIn += ele.passengerIn;
          this.totalpassengerOut += ele.passengerOut;
          this.vehicletotalIn += ele.totalIn;
          this.vehicletotalOut += ele.totalOut;
          this.vehicleCluster = ele.name;
            this.array.push({name:ele.name,vehicleIn:ele.totalIn,vehicleOut:ele.totalOut})
        });

        this.vehicleInCount =
          this.totalemergencyIn +
          this.totalgoodscarrierIn +
          this.totalmachineryIn +
          this.totalpassengerIn;

        this.vehicleOutCount =
          this.totalemergencyOut +
          this.totalgoodscarrierOut +
          this.totalmachineryOut +
          this.totalpassengerOut;
        let _ = require("lodash");
       
        let merged = _.uniqWith(this.array, (pre:any, cur:any) => {
          if (pre.name == cur.name) {
            Object.assign(cur, pre);
            // cur.value = cur.value + "," + pre.value;
            return true;
          }
          return false;
        });
        this.array=merged
        console.log(this.array);
        this.vehicleGraph = [
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
        ];
      });
  }

  getVisitorGraph() {
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
      'siteName',
      this.dashboard.site ? this.dashboard.site : ''
    );
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

    this.commonService.getVmReportData(params).subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        if (this.dashboard.filterfor === '') {
          this.resName = 'cluster';
        } else {
          this.resName = this.dashboard.filterfor;
        }
        this.visitorData =
          res.data.region ||
          res.data.state ||
          res.data.cluster ||
          res.data.site;

        this.visitorData.forEach((ele: any) => {
          this.totalbusinessIn += ele.businessIn;
          this.totalbusinessOut += ele.businessOut;
          this.totalbusinessOverstayed += ele.businessOverStayed;
          this.totalpersonalIn += ele.personalIn;
          this.totalpersonalOut += ele.personalOut;
          this.totalpersonalOverstayed += ele.personalOverStayed;
          this.totalIn += ele.totalIn;
          this.totalOut += ele.totalOut;
          this.totalOverstayed += ele.totalOverStayed;
          this.visitorCluster = ele.name;
          this.array.push({name:ele.name,visitorIn:ele.totalIn,visitorOut:ele.totalOut})
        });

        this.visitorInCount = this.totalbusinessIn + this.totalbusinessOut;
        this.visitorOutCount = this.totalbusinessIn + this.totalbusinessOut;
        let _ = require("lodash");
       
        let merged = _.uniqWith(this.array, (pre:any, cur:any) => {
          if (pre.name == cur.name) {
            Object.assign(cur, pre);
            // cur.value = cur.value + "," + pre.value;
            return true;
          }
          return false;
        });
        this.array=merged
        this.visitorGraph = [
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
                value: Number(this.totalpersonalOut),
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

  async getSiteDATA() {
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

    if (res && res['status'] == 'success') {
      if (this.dashboard.site === 'undefined') {
        this.sitedata = [];
      } else {
        this.sitedata = res.data;
        let array:any=[]
        this.sitedata.forEach((ele:any)=>{
          array.push({siteName:ele,name:ele})
        })
        array.forEach((ele:any)=>{
          var optionText = ele.name;
          if(ele.name.length>18){
            var newOption = optionText.substring(0, 18);
            ele.name=newOption + '...'
          }
        })
       this.sitedata=array
        if (this.sitedata.includes(this.dashboard.site)) {
        } else {
          this.dashboard.site = '';
        }
      }
    } else {
      this.alertcall.showWarning('Alert', res['message']);
    }

      this.getTreedata();
      this.getSecuritydata();
      this.getVehicleData();
      this.getVisitorGraph();
  
  }
  async getRegions() {
    let params = new HttpParams();
    params = params.append(
      'state',
      this.dashboard.state !== undefined ? this.dashboard.state : ''
    );
    let res: any = await this.commonService.getRegionsForDashboard(params);

    if (res && res['status'] === 'success') {
      if (this.dashboard.region === 'undefined') {
        this.RegionList = '';
      } else {
        this.RegionList = res.data;
      }
    } else {
      this.alertcall.showWarning('Alert', res['age']);
    }
    this.getStates();
  }
  async getStates() {
    let params = new HttpParams();
    params = params.append(
      'region',
      this.dashboard.region ? this.dashboard.region : ''
    );
    params = params.append(
      'cluster',
      this.dashboard.cluster !== undefined ? this.dashboard.cluster : ''
    );
    let res: any = await this.commonService.getStatesForDashboard(params);

    if (res && res['status'] === 'success') {
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
  }
  async getClusters() {
    let params = new HttpParams();
    params = params.append(
      'region',
      this.dashboard.region ? this.dashboard.region : ''
    );
    params = params.append(
      'state',
      this.dashboard.state ? this.dashboard.state : ''
    );
    let res: any = await this.commonService.getClustersForDashboard(params);
    if (res && res['status'] === 'success') {
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
    this.getSiteDATA();
  }
  getSiteBasedRegStateCluster() {
    let params = new HttpParams();
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
      this.stateBasedList = res.data;
      if (this.stateBasedList) {
        this.dashboard.state = this.stateBasedList.state;
        this.dashboard.region = this.stateBasedList.region;
        this.dashboard.cluster = this.stateBasedList.cluster;
      }
    });
  }
  onResize(event:any) {
    this.view = [200 / 1.35, 400];
}
resizeChart(width: any): void {
  this.view = [200, 400]
}
}
