import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private commonservice:CommonService , private router:Router) {}

  hasValidIdToken(): boolean {
    const data = this.getLocalItem('authentication', true);
    return data ? true : false;
  }

  public getLocalItem = function (key: string, decoded: boolean) {
    var value = localStorage.getItem(key);
 value = value ? JSON.parse(decoded ? Base64.atob(value) : value) : null;
    return value;
  };
  logOut(){
    let Token = localStorage.getItem("authentication");
    if(Token==null||typeof Token=="undefined"){
      Token = ""
    }
    let obj={
      token : Token
    }
    this.commonservice.logout(obj).subscribe((res:any)=>{
      if(res['status']=="success"){
        localStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }
}
