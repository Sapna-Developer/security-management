import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonInterceptor } from './common.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
export let AppInjector: Injector;
@NgModule({
  declarations: [AppComponent, LoginComponent,],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      preventDuplicates: true,
      progressBar: true,
      positionClass: 'toast-top-right',
    }),
    BrowserAnimationsModule,
    NgbModule,
        AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDsivkqbokA-Mtyl8Uq7bhFgxIaQcUUXtI',
      libraries: ['places'],
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CommonInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector){
    AppInjector = this.injector;
  }
}
