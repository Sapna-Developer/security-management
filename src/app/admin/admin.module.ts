import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { HeaderComponent } from './header/header.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonInterceptor } from '../common.interceptor';
import { CompnieslistComponent } from './companieslist/compnieslist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ACLComponent } from './acl/acl.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SecuritydeployComponent } from './securitydeploy/securitydeploy.component';
import { SitesComponent } from './sites/sites.component';
import { LocationsComponent } from './locations/locations.component';
import { AgenciesComponent } from './agencies/agencies.component';
import { VisitormovementComponent } from './visitormovement/visitormovement.component';
import { VehiclemovementComponent } from './vehiclemovement/vehiclemovement.component';
import { DeploymentdashboardComponent } from './deploymentdashboard/deploymentdashboard.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TreecutComponent } from './treecut/treecut.component';
import { VisitordashboardComponent } from './visitordashboard/visitordashboard.component';
import { TreecutdashboardComponent } from './treecutdashboard/treecutdashboard.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { VehicledashboardComponent } from './vehicledashboard/vehicledashboard.component';
import { SoreportingComponent } from './soreporting/soreporting.component';
import { ParametersComponent } from './parameters/parameters.component';
import { AgmCoreModule } from '@agm/core';
@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    HeaderComponent,
    OrganizationsComponent,
    CompnieslistComponent,
    ACLComponent,
    SecuritydeployComponent,
    SitesComponent,
    LocationsComponent,
    AgenciesComponent,
    VisitormovementComponent,
    VehiclemovementComponent,
    DeploymentdashboardComponent,
    TreecutComponent,
    VisitordashboardComponent,
    TreecutdashboardComponent,
    VehicledashboardComponent,
    SoreportingComponent,
    ParametersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    NgxChartsModule,
    NgbPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDsivkqbokA-Mtyl8Uq7bhFgxIaQcUUXtI',
      libraries: ['places'],
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonInterceptor,
      multi: true,
    },
  ],
})
export class AdminModule {}
