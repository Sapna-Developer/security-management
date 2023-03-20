import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Params } from '@angular/router';
import { catchError, retry, throwError } from 'rxjs';
import { AppInjector } from '../app.module';
import { AlertCallService } from './alert-call.service';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public toggleSidebar: EventEmitter<any> = new EventEmitter();
  constructor(private httpclient: HttpClient) {}
  handleError(error: any) {
    const myService = AppInjector.get(AlertCallService);
    // const loader = AppInjector.get(NgxSpinnerService)
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    myService.showWarning('Alert', error.error.message);
    return throwError(() => {
      return errorMessage;
    });
  }
  login(headers: any) {
    return this.httpclient
      .post(environment.API_URL + '/login', '', {
        headers: headers,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  logout(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'logout', '', {
        headers: data,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  // organizations screen
  addOrganizaton(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addOrganizaton', data)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateOrganization(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateOrganization', data)
      .pipe(retry(1), catchError(this.handleError));
  }

  getOrganizationslist() {
    return this.httpclient
      .get(environment.API_URL + 'organizations')
      .pipe(retry(1), catchError(this.handleError));
  }
  getOrganizationslistwthpagination(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'organizations', { params: params })
      .pipe(retry(1), catchError(this.handleError));
  }
  getOrganization(id: any) {
    return this.httpclient
      .get(`${environment.API_URL}organizations/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteOrganization(data: any) {
    return this.httpclient
      .delete(`${environment.API_URL}deleteOrganization/${data.id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  // company screen
  addCompany(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addCompany', data)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateCompany(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateCompany', data)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCompanyList(params: any) {
    return this.httpclient
      .get(`${environment.API_URL}company`, {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  getCompany(data: any) {
    return this.httpclient
      .get(`${environment.API_URL}company/${data.id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteCompany(data: any) {
    return this.httpclient
      .delete(`${environment.API_URL}deleteCompany/${data.id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Acl screen
  addAcl(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addacl', data)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateAcl(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateacl', data)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAclList() {
    return this.httpclient
      .get(environment.API_URL + 'getacl')
      .pipe(retry(1), catchError(this.handleError));
  }

  getAcl(id: any) {
    return this.httpclient
      .get(`${environment.API_URL}getacl/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteAcl(id: any) {
    return this.httpclient
      .delete(`${environment.API_URL}deleteacl/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  // Sites Screen
  addSite(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addsite', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getSite() {
    return this.httpclient
      .get(environment.API_URL + 'getsite')
      .pipe(retry(1), catchError(this.handleError));
  }
  getSiteswthpagination(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getsite', { params: params })
      .pipe(retry(1), catchError(this.handleError));
  }
  getSitesfrorg(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getsite', { params: params })
      .pipe(retry(1), catchError(this.handleError));
  }
  deleteSite(data: any) {
    return this.httpclient
      .delete(`${environment.API_URL}deletesite/${data.siteId}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  updateSite(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updatesite', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getRegions() {
    return this.httpclient
      .get(environment.API_URL + 'getRegion')
      .pipe(retry(1), catchError(this.handleError));
  }
  getStates(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getState', { params: params })
      .pipe(retry(1), catchError(this.handleError));
  }
  getClusters() {
    return this.httpclient
      .get(environment.API_URL + 'getCluster')
      .pipe(retry(1), catchError(this.handleError));
  }
  // Locations screen
  addLocation(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addlocation', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getLocation() {
    return this.httpclient
      .get(environment.API_URL + 'getlocation')
      .pipe(retry(1), catchError(this.handleError));
  }
  getLocationwthpagination(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getlocation', { params: params })
      .pipe(retry(1), catchError(this.handleError));
  }
  getLocationBySite(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getlocation', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  getLocationfrTrack(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getlocation', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  deleteLocation(data: any) {
    return this.httpclient
      .delete(`${environment.API_URL}deletelocation/${data.locationId}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  updateLocation(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updatelocation', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  // Agencies screen
  addAgency(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addAgency', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getAgencies(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getAgency', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  deleteAgency(data: any) {
    return this.httpclient
      .delete(`${environment.API_URL}deleteAgency/${data.agencyId}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  updateAgency(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateAgency', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  manageAttendance(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'manageAttendance', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getDailyAttendance(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getDailyAttendance', {params:params})
      .pipe(retry(1), catchError(this.handleError));
  }
  addVisitor(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addvisitorMoment', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getVisitorPurposeDropdown(data: any) {
    return this.httpclient
      .get(environment.API_URL + 'getvisitormovementpurpose', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getVisitorList(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getvisitorMoment', { params })
      .pipe(retry(1), catchError(this.handleError));
  }
  updateVisitorList(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updatevisitorMoment', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  deleteVisitor(data:any){
    return this.httpclient.delete(`${environment.API_URL}deletevisitorMoment/${data.vmId}`)
  }
  getVmReportData(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'visitorMovementsReportsGraph', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  getregionbyFilter(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'vehicleMovementReports', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  // tree cut details
  addTreeCutData(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addTreeCuttingDetails', data)
      .pipe(retry(1), catchError(this.handleError));
  }

  getTreeCutData(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getTreeCuttingDetails', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  updateTreeCutDetails(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateTreeCuttingDetails', data)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteTcDetails(data: any) {
    return this.httpclient
      .delete(`${environment.API_URL}deleteTreeCuttingDetails/${data.tcdId}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  getTcReportData(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'treeCuttingReports', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  FileUpload(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'singleFileUpload', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  // security deployment
  addSiteSecurityOfficers(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addSiteSecurityOfficers', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getSecurityOfficers(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getSiteSecurityOfficers', { params: params })
      .pipe(retry(1), catchError(this.handleError));
  }
  updateSecurityOfficers(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updatesiteSecurityOfficers', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  deleteSecurityDeployment(data: any) {
    return this.httpclient
      .delete(
        `${environment.API_URL}deletesiteSecurityOfficers/${data.employeeAssignedId}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  // deployment dashboard
  getSecuritydashboarddata(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'securityDeploymetReports', { params: params })
      .pipe(retry(1), catchError(this.handleError));
  }
  // vehicle movement
  addMainGateData(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addVehicleMovement', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getvehiclelogdata(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getVehicleMovement', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  updatePassvehicledata(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updatePassengersVehicleLocationData', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  updatePassvehilceexitlocationData(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updatevehicleLocationExitData', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  updatePassengervehExit(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateVehicleExit', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  deleteVehicleLog(data:any){
    return this.httpclient.delete(`${environment.API_URL}deleteVehicleMovement/${data.vmId}`)
  }
  // machinary category
  updateMachinaryVehEntry(params: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateMachineryVehicleLocationData', params)
      .pipe(retry(1), catchError(this.handleError));
  }
  // goods carrier category
  updategoodscarrierVehEntry(params: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateVehicleLocationData', params)
      .pipe(retry(1), catchError(this.handleError));
  }
  async getRegionsForDashboard(params: any) {
    return await this.httpclient
      .get(environment.API_URL + 'dashboardregions', { params: params }).toPromise()
      // .pipe(retry(1), catchError(this.handleError));
  }
  async getStatesForDashboard(params: any) {
    return await this.httpclient
      .get(environment.API_URL + 'dashboardstates', { params: params }).toPromise()
      // .pipe(retry(1), catchError(this.handleError));
  }
  async getClustersForDashboard(params: any) {
    return await this.httpclient
      .get(environment.API_URL + 'dashboardclusters', { params: params }).toPromise()
      // .pipe(retry(1), catchError(this.handleError));
  }
  async getsiteForDashboard(params: any) {
    return await this.httpclient
      .get(environment.API_URL + 'dashboardsites', { params: params }).toPromise()
      // .pipe(retry(1), catchError(this.handleError))
  }
  getSiteBasedCSR(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'stateBaseClusterAndRegion', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  // getsecurityofficerslist
  getSOlist(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getSecurityOfficers', { params: params })
      .pipe(retry(1), catchError(this.handleError));
  }

  // getrequiredsodata(so login)
  getRequiredSoList(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getSiteSecurityOfficers', { params: params })
      .pipe(retry(1), catchError(this.handleError));
  }
  getAgencyMember(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getAgencyMember', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  deploySuporGuards(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'addDeployedMemeberInLocation', data)
      .pipe(retry(1), catchError(this.handleError))
      .pipe(retry(1), catchError(this.handleError));
  }
  addAgencyMember(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'createAgencyMember', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  getAgencyMembersList(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'getAgencyMember', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  updateAgencyMember(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateAgencyMember', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  deleteAgencyMember(data: any) {
    return this.httpclient
      .delete(`${environment.API_URL}deleteAgencyMember/${data.agencyMemberId}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  getDeployedMembers(params: Params) {
    return this.httpclient
      .get(environment.API_URL + 'getDeployedMemeberInLocation', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  updateDeployedMembers(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'updateDeployedMemeberInLocation', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  relieveMembersForOtherSO(data: any) {
    return this.httpclient
      .post(environment.API_URL + 'relievingMembersForAnotherSo', data)
      .pipe(retry(1), catchError(this.handleError));
  }
  // vehicle movement dashboard
  getVehiclemovementReport(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'vehicleMovementReports', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  getRegionbyFilter(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'vehicleMovementReports', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  getClusterbyFilter(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'vehicleMovementReports', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  getStatebyFilter(params: any) {
    return this.httpclient
      .get(environment.API_URL + 'vehicleMovementReports', {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }
  // SO Reporting
  addParameter(data:any){
    return this.httpclient
    .post(environment.API_URL + 'addParameter', data)
    .pipe(retry(1), catchError(this.handleError));
  }
  getParameter(params:any){
    return this.httpclient.get(environment.API_URL+"getParameter",{params:params}).pipe(retry(1),catchError(this.handleError))
  }
  updateParameter(data:any){
    return this.httpclient
    .post(environment.API_URL + 'updateParameter', data)
    .pipe(retry(1), catchError(this.handleError));
  }
  deleteParameter(data:any){
    return this.httpclient.delete(`${environment.API_URL}deleteParameter/${data.id}`).pipe(retry(1),catchError(this.handleError))
  }
  addSoReport(data:any){
    return this.httpclient
    .post(environment.API_URL + 'addReport', data)
    .pipe(retry(1), catchError(this.handleError));
  }
  getSOReport(params:any){
    return this.httpclient
    .get(environment.API_URL + 'getReports', {
      params: params,
    })
    .pipe(retry(1), catchError(this.handleError));
  }
  updateReport(data:any){
    return this.httpclient
    .post(environment.API_URL + 'updateReport', data)
    .pipe(retry(1), catchError(this.handleError));
  }
  deleteSOReport(data:any){
    return this.httpclient.delete(`${environment.API_URL}deleteReport/${data.id}`).pipe(retry(1),catchError(this.handleError))
  }
}
