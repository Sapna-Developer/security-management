import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AlertCallService } from 'src/app/services/alert-call.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-treecutdashboard',
  templateUrl: './treecutdashboard.component.html',
  styleUrls: ['./treecutdashboard.component.css'],
})
export class TreecutdashboardComponent implements OnInit {
  bsRangeValue!: Date[];
  fromDate: any;
  toDate: any;
  dashboard: any = {};
  sitedata: any = [];
  sitedata1:any=[]
  locationdata: any = [];
  LocationList: any = [];
  dashboardSite: any;
  dashboardLocation: any;
  treecutdata: any = [];
  multi!: { name: any; series: { name: any; value: any }[] }[];
  view: any = [600, 400];
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  totalnumberOfLogs: any;
  totaltimberWeight: any;
  count: any;
  RegionList: any = [];
  StateList: any = [];
  ClusterList: any = [];
  yesterday: any;
  today: any;
  totaltrees: any;
  totalweight: any;
  totallogs: any;
  // isRegionDisabled = true;
  // isStateDisabled = true;
  // isClusterDisabled = true;
  // isSiteDisabled = true;
  tableshow: boolean = true;
  resName: any;
  legendTitle=""
  constructor(private commonService: CommonService , private alertcall:AlertCallService) {}

  ngOnInit(): void {
    this.dashboard.filterfor=""
    this.dashboard.region=""
    this.dashboard.state=""
    this.dashboard.cluster=""
    this.dashboard.site=""
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    // this.bsRangeValue = [yesterday, today];
    this.dashboard.site = null;
    // this.dashboard.location = null;
    this.getRegions();
    // this.getClusters();
    // this.getStates();
    // this.getsitedata();
    // this.getlocationdata();
    // this.getData();
    this.totaltrees = 0;
    this.totalweight = 0;
    this.totallogs = 0;
  }
  updateMyDate(ev: any) {
    this.yesterday = moment(ev[0]).format('YYYY-MM-DD');
    this.today = moment(ev[1]).format('YYYY-MM-DD');
    this.getData();
  }
  getlocationdata() {
    this.commonService.getLocation().subscribe((res: any) => {
      if (res && res['status'] == 'success') {
        this.locationdata = res.data;
        // this.dashboard.location = res.data[0].locationId
      }
    });
  }
  getRegionData() {
    this.getStates();
  }
  getStateData() {
this.getClusters()
  }
  getClusterData() {
    this.getsitedata();
  }
  getSiteData() {
    this.getData();
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
            if(ele.name.length>22){
              var newOption = optionText.substring(0, 22);
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
      this.getData();
    // });
  }
  getData() {
    this.totaltrees = 0;
    this.totalweight = 0;
    this.totallogs = 0;

    let params = new HttpParams();
    params = params.append('fromDate', this.yesterday ? this.yesterday : '');
    params = params.append('toDate', this.today ? this.today : '');
    params = params.append('siteName', this.dashboard.site?this.dashboard.site:"");
    // params = params.append('locationId', this.dashboardLocation);
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
      if(res&&res['status']==='success'){
      if (this.dashboard.filterfor === 'region') {
        this.treecutdata = [];
        this.multi = [];
        this.treecutdata = res.data.region;
        this.resName = this.dashboard.filterfor
      }
      if (this.dashboard.filterfor === 'state') {
        this.treecutdata = [];
        this.multi = [];
        this.treecutdata = res.data.state;
        this.resName = this.dashboard.filterfor
      }
      if (this.dashboard.filterfor === 'cluster') {
        this.treecutdata = [];
        this.multi = [];
        this.treecutdata = res.data.cluster;
        this.resName = this.dashboard.filterfor
      }
      if (this.dashboard.filterfor === 'site') {
        this.treecutdata = [];
        this.multi = [];
        this.treecutdata = res.data.site;
        this.resName = this.dashboard.filterfor
      }
      if (this.dashboard.filterfor === "") {
        this.treecutdata = [];
        this.multi = [];
        this.treecutdata = res.data.cluster;
        this.resName = "cluster"
      }
      this.treecutdata.forEach((ele: any) => {
        this.totaltrees += ele.totalTrees;
        this.totalweight += ele.totalWeight;
        this.totallogs += ele.totalLogs;
      });

      this.multi = [
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
    }else{
      this.alertcall.showWarning("Alert",res['message'])
    }
    });

    // if (this.dashboard.filterfor === undefined) {
    //   this.tableshow = false
    // }
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
  resizeChart(width: any): void {
    this.view = [width, 400]
  }
}
