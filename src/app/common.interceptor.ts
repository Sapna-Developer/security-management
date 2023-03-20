import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Base64 } from 'js-base64';
import { AuthService } from './services/auth.service';
import { environment } from 'src/environments/environment';
import { AlertCallService } from './services/alert-call.service';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {
path:any=environment.API_URL
  constructor(public authservice:AuthService, public alertcall:AlertCallService) {}
  gettoken() {
    let user = localStorage.getItem('authentication');
    if (typeof user === 'string') {
      let data = Base64.atob(user);
      let dataobj = JSON.parse(data);
      var token = dataobj.data.token;
      if (!user) {
        return null;
      }

      return token;
    }
  }
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const innerToken = this.gettoken();

    const Authorization = 'token ' + innerToken || '';
    let authReq = request;
    if (request.url != this.path+'/login') {
    if (innerToken !== null) {
      authReq = request.clone({ setHeaders: { Authorization } });
    }
  }
    return next.handle(authReq).pipe(
      tap((event:HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
   
      }
    },(error:HttpErrorResponse)=>{
      if (error instanceof HttpErrorResponse) {
        if(error.status === 400 && error.error.status === "session expired") {
          this.authservice.logOut()
          // if () {
          //   // this.authservice.logOut()
          //   // this.alertcall.showWarning("Aleert","Session Expired Please Login")
          // }
                } 
      }   
    })
    );
  }
}
