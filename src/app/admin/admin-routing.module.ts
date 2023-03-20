import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { AuthGaurdGuard } from '../services/auth-gaurd.guard';
import { CompnieslistComponent } from './companieslist/compnieslist.component';
import { ACLComponent } from './acl/acl.component';
import { SecuritydeployComponent } from './securitydeploy/securitydeploy.component';
import { SitesComponent } from './sites/sites.component';
import { LocationsComponent } from './locations/locations.component';
import { AgenciesComponent } from './agencies/agencies.component';
import { VisitormovementComponent } from './visitormovement/visitormovement.component';
import { VehiclemovementComponent } from './vehiclemovement/vehiclemovement.component';
import { TreecutComponent } from './treecut/treecut.component';
import { DeploymentdashboardComponent } from './deploymentdashboard/deploymentdashboard.component';
import { VisitordashboardComponent } from './visitordashboard/visitordashboard.component';
import { TreecutdashboardComponent } from './treecutdashboard/treecutdashboard.component';
import { VehicledashboardComponent } from './vehicledashboard/vehicledashboard.component';
import { SoreportingComponent } from './soreporting/soreporting.component';
import { ParametersComponent } from './parameters/parameters.component';
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: DashboardComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'organizations',
        component: OrganizationsComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'companys',
        component: CompnieslistComponent,
        canActivate: [AuthGaurdGuard],
      },

      { path: 'acl', component: ACLComponent, canActivate: [AuthGaurdGuard] },
      {
        path: 'securitydeploy',
        component: SecuritydeployComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'sites',
        component: SitesComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'locations',
        component: LocationsComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'agencies',
        component: AgenciesComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'visitor_movement',
        component: VisitormovementComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'vehicle_movement',
        component: VehiclemovementComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'tree_cut',
        component: TreecutComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'deployment_dashboard',
        component: DeploymentdashboardComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'tree_cut',
        component: TreecutComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'visitor_dashboard',
        component: VisitordashboardComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'treecut_dashboard',
        component: TreecutdashboardComponent,
        canActivate: [AuthGaurdGuard],
      },
      {
        path: 'vehicle_dashboard',
        component: VehicledashboardComponent,
        canActivate: [AuthGaurdGuard],
    },
    {
      path: 'soreporting',
      component: SoreportingComponent,
      canActivate: [AuthGaurdGuard],
  },
  {
    path: 'parameters',
    component: ParametersComponent,
    canActivate: [AuthGaurdGuard],
},
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
