import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Base64 } from 'js-base64';
import { AuthService } from '../services/auth.service';
import { AlertCallService } from '../services/alert-call.service';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: any;
  password: any;
  user: any = {};
  constructor(
    private commonservice: CommonService,
    private router: Router,
    private authService: AuthService,
    private alertCall: AlertCallService
  ) {}

  ngOnInit(): void {}
  Login(form: any) {
    let token = this.username + ':' + this.password;
console.log(Base64.btoa(token));

    let obj = {
      token: Base64.btoa(token),
    };
    let headers = new HttpHeaders()
    headers = headers.append("Authorization","Token "+Base64.btoa(token))
    this.commonservice.login(headers).subscribe((res: any) => {
      if (res.status === 'success') {
        localStorage.setItem('user_details', JSON.stringify(res));

        localStorage.setItem(
          'authentication',
          Base64.btoa(JSON.stringify(res))
        );
        let user: any = localStorage.getItem('user_details');
        if (user !== null || typeof user !== 'undefined') {
          this.user = JSON.parse(user);
        }

        let auth = this.authService.getLocalItem('authentication', true);
        if (auth != null || auth != undefined) {
       this.router.navigate(['admin'])
        } else {
          this.alertCall.showWarning('Error', res.message);
        }
      }else{
        this.alertCall.showWarning('Alert', res.message);
      }
    });
  }
}
