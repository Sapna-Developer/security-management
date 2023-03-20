import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-deploymentdashboard',
  templateUrl: './deploymentdashboard.component.html',
  styleUrls: ['./deploymentdashboard.component.css'],
})
export class DeploymentdashboardComponent implements OnInit {
  dashboard: any = {};
  sitedata: any = [];
  sitedata1:any=[]
  locationdata: any = [];
  yesterday: any;
  today: any;
  dashboarddataday: any = {};
  dashboarddataNIGHT: any = {};
  dashboarddatadaygeneral: any = {};
  bsRangeValue!: Date[];
  totaldatasup: any = {};
  totaldataguard: any = {};
  dashboardSite: any;
  dashboardLocation: any;
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  timeline = true;
  doughnut = true;
  siteWiseCount: any = [];
  LocationList: any = [];
  chartDataSup: any = {};
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB'],
  };

  chartDataGuards: any = {};
  multi!: { name: any; series: { name: any; value: any }[] }[];
  RegionList: any = [];
  StateList: any = [];
  ClusterList: any = [];
  deploymentData: any = [];
  stateBasedList: any = [];
  resName: any;
  legendTitle: string = '';
  view: any = [500, 400];
  // isRegionDisabled = true;
  // isStateDisabled = true;
  // isClusterDisabled = true;
  // isSiteDisabled = true;

  constructor(private commonService: CommonService,private alertcall:AlertCallService) {}

  ngOnInit() {
    this.dashboard.region=""
    this.dashboard.state=""
    this.dashboard.site=""
    this.dashboard.cluster=""
    this.dashboard.filterfor=""
    // var today = new Date();
    // var yesterday = new Date(today);
    // yesterday.setDate(today.getDate() - 1);
    // this.bsRangeValue = [yesterday, today];
    // this.dashboard.location = null;
    // this.dashboard.date[1]= moment(today).format("YYYY-MM-DD")
    this.getRegions();
    // this.getClusters();
    // this.getStates();
    // this.getsitedata();
    // this.getlocationdata();
    // this.getdata();
  }
  async getRegions() {
    let params = new HttpParams();
    params = params.append(
      'state',
      this.dashboard.state!==undefined ? this.dashboard.state : ''
    );
    let res:any=await this.commonService.getRegionsForDashboard(params)
    // .subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        // this.RegionList = res.data;
        if (this.dashboard.region === 'undefined') {
          this.RegionList = '';
        } else {
          this.RegionList = res.data;
        }
      }else{
        this.alertcall.showWarning("Alert",res['message'])
      }
      this.getStates()
    // });
  }
  async getStates() {
    let params = new HttpParams();
    params = params.append(
      'region',
      this.dashboard.region!==undefined ? this.dashboard.region : ''
    );
    // params = params.append(
    //   'cluster',
    //   this.dashboard.cluster!==undefined ? this.dashboard.cluster : ''
    // );
    let res:any=await this.commonService.getStatesForDashboard(params)
    // .subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        // this.StateList = res.data;
        if (this.dashboard.state === 'undefined') {
          this.StateList = '';
        } else {
          this.StateList = res.data;
          if(this.StateList.includes(this.dashboard.state)){

          }else{
            this.dashboard.state=""
          }
        }
      }else{
        this.alertcall.showWarning("Alert",res['message'])
      }
       this.getClusters()
    // });
  }
 async getClusters() {
    let params = new HttpParams();
    params = params.append(
      'region',
      this.dashboard.region===undefined  ? '' : this.dashboard.region
    );
    params = params.append(
      'state',
      this.dashboard.state!==undefined ? this.dashboard.state : ''
    );
    let res:any=await this.commonService.getClustersForDashboard(params)
    // .subscribe((res: any) => {
      if (res && res['status'] === 'success') {
        // this.ClusterList = res.data;
        if (this.dashboard.cluster === 'undefined') {
          this.ClusterList = '';
        } else {
          this.ClusterList = res.data;
          if(this.ClusterList.includes(this.dashboard.cluster)){

          }else{
            this.dashboard.cluster=""
          }
        }
      }else{
        this.alertcall.showWarning("Alert",res['message'])
      }
      this.getsitedata();
    // });
  }
  getRegionData() {
    // if (this.dashboard.filterfor && this.isRegionDisabled) {
    //   this.isRegionDisabled = !this.isRegionDisabled;
    // }
    // this.getRegions();
    //  this.getClusters();
    this.getStates();
    // this.getsitedata();
    // // setTimeout(() => {
    //   this.getdata();  
    // }, 500);
  }
  getStateData() {
    this.getClusters();
    // this.getStates();  
    // this.getStateBasedRegSiteCluster();
    // this.getsitedata();
    // this.getdata();
  }
  getClusterData() {
    // if (this.dashboard.state && this.isClusterDisabled) {
    //   this.isClusterDisabled = !this.isClusterDisabled;
    // }
    // this.getRegions();
    // this.getStates();
    // this.getSiteBasedRegStateCluster();
    this.getsitedata();
    // this.getdata();
  }
  getSiteData() {
    // if (this.dashboard.cluster && this.isSiteDisabled) {
    //   this.isSiteDisabled = !this.isSiteDisabled;
    // }
    // this.getSiteBasedRegStateCluster();
    this.getdata();
  }
  getSiteBasedRegStateCluster() {
    let params = new HttpParams();
    params = params.append(
      'site',
      this.dashboard.site!==undefined ? this.dashboard.site : ''
    );
    // params = params.append(
    //   'state',
    //   this.dashboard.state!==undefined ? this.dashboard.state : ''
    // );
    // params = params.append(
    //   'cluster',
    //   this.dashboard.cluster!==undefined ? this.dashboard.cluster : ''
    // );
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
  getStateBasedRegSiteCluster() {
    let params = new HttpParams();
    console.log(this.dashboard.site);

    params = params.append(
      'state',
      this.dashboard.state!==undefined ? this.dashboard.state : ''
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
  async getsitedata() {
    let params = new HttpParams();
    params = params.append(
      'region',
      this.dashboard.region!==undefined ? this.dashboard.region : ''
    );
    params = params.append(
      'cluster',
      this.dashboard.cluster!==undefined ? this.dashboard.cluster : ''
    );
    params = params.append(
      'state',
      this.dashboard.state!==undefined ? this.dashboard.state : ''
    );
    let res:any= await this.commonService.getsiteForDashboard(params)
    // .subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        if (this.dashboard.site === 'undefined') {
          this.sitedata = '';
        } else {
          this.sitedata = res.data;
          this.sitedata1 = res.data;
          let array:any=[]
          this.sitedata.forEach((ele:any)=>{
            array.push({siteName:ele,name:ele})
          })
          array.forEach((ele:any)=>{
            var optionText = ele.name;
            if(ele.name.length>21){
              var newOption = optionText.substring(0, 21);
              ele.name=newOption + '...'
            }
          })
         this.sitedata=array
          if(this.sitedata1.includes(this.dashboard.site)){

          }else{
            this.dashboard.site=""
          }
          // this.sitedata.includes((ele:any)=>{
          //   if(ele!==this.dashboard.site){ 
          //     this.dashboard.site=""
          //   }
          // })
        }
        // this.dashboard.site = res.data[0].siteId
      }else{
        this.alertcall.showWarning("Alert",res['message'])
      }
      this.getdata();
    // });
  }
  getlocationdata() {
    this.commonService.getLocation().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationdata = res.data;
        // this.dashboard.location = res.data[0].locationId
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
  getdata() {
    // if(this.dashboard.site===null){
    //   this.dashboardSite=""
    // }else{
    //   this.dashboardSite=this.dashboard.site
    // }
    // if(this.dashboard.location===null){
    //   this.dashboardLocation=""
    // }else{
    //   this.dashboardLocation=this.dashboard.location
    // }
    let params = new HttpParams();
    params = params.append('fromDate', this.yesterday ? this.yesterday : '');
    params = params.append('toDate', this.today ? this.today : '');
    params = params.append(
      'filterFor',
      this.dashboard.filterfor!==undefined ? this.dashboard.filterfor : ''
    );
    params = params.append(
      'region',
      this.dashboard.region!==undefined ? this.dashboard.region : ''
    );
    params = params.append(
      'state',
      this.dashboard.state!==undefined ? this.dashboard.state : ''
    );
    params = params.append(
      'cluster',
      this.dashboard.cluster!==undefined ? this.dashboard.cluster : ''
    );
    params = params.append(
      'siteName',
      this.dashboard.site!==undefined ? this.dashboard.site : ''
    );
    this.commonService
      .getSecuritydashboarddata(params)
      .subscribe((res: any) => {
        if (res && res['status'] === 'success') {
          if (this.dashboard.filterfor === 'region') {
            this.deploymentData = [];
            this.multi = [];
            this.deploymentData = res.data.region;
            this.resName = this.dashboard.filterfor
          }
          if (this.dashboard.filterfor === 'state') {
            this.deploymentData = [];
            this.multi = [];
            this.deploymentData = res.data.state;
            this.resName = this.dashboard.filterfor
          }
          if (this.dashboard.filterfor === 'cluster') {
            this.deploymentData = [];
            this.multi = [];
            this.deploymentData = res.data.cluster;
            this.resName = this.dashboard.filterfor
          }
          if (this.dashboard.filterfor === 'site') {
            this.deploymentData = [];
            this.multi = [];
            this.deploymentData = res.data.site;
            this.resName = this.dashboard.filterfor
          }

          if (this.dashboard.filterfor === "") {
            this.deploymentData = [];
            this.multi = [];
            this.deploymentData = res.data.cluster;
            this.resName = "cluster"
          }
          // this.siteWiseCount = res.siteWiseCounts;
          // this.chartDataSup = res.totalSupCount;
          // this.chartDataGuards = res.totalGudCount;
          // if (Object.keys(res.shiftWiseCount).length !== 0) {
          this.dashboarddataday = res.data.shiftWiseCount.day;
          this.dashboarddataNIGHT = res.data.shiftWiseCount.night;
          //   .hasOwnProperty(
          //   'night'
          // )
          //   ? res.data.shiftWiseCount.night
          //   : { depSupCount: 0, depGudCount: 0 };
          this.dashboarddatadaygeneral = res.data.shiftWiseCount.general;
          //   .hasOwnProperty(
          //   'general'
          // )
          //   ? res.shiftWiseCount.general
          //   : { depSupCount: 0, depGudCount: 0 };
          this.totaldatasup = res.data.totalSupCount;
          this.totaldataguard = res.data.totalGudCount;
          // } else {
          //   this.dashboarddataday = { depSupCount: 0, depGudCount: 0 };
          //   this.dashboarddataNIGHT = { depSupCount: 0, depGudCount: 0 };
          //   this.dashboarddatadaygeneral = { depSupCount: 0, depGudCount: 0 };
          //   this.totaldatasup =
          //     this.dashboarddataday.depSupCount +
          //     this.dashboarddataNIGHT.depSupCount +
          //     this.dashboarddatadaygeneral.depSupCount;
          //   this.totaldataguard =
          //     this.dashboarddataday.depGudCount +
          //     this.dashboarddataNIGHT.depGudCount +
          //     this.dashboarddatadaygeneral.depGudCount;
          // }
          let reqsupcount: any;
          let depsupcount: any;
          let reqguacount: any;
          let depguacount: any;
          reqsupcount = res.data.totalSupCount.reqSupCount;
          depsupcount = res.data.totalSupCount.depSupCount;
          reqguacount = res.data.totalGudCount.reqGudCount;
          depguacount = res.data.totalGudCount.depGudCount;
          this.multi = [
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
        }else{
          this.alertcall.showWarning("Alert",res['message'])
        }
      });
  }

  updateMyDate(newDate: any) {
    this.yesterday = moment(newDate[0]).format('YYYY-MM-DD');
    this.today = moment(newDate[1]).format('YYYY-MM-DD');
    this.getdata();
  }
  resizeChart(width: any): void {
    this.view = [width, 400]
  }
}
