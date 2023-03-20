import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertCallService {
  constructor(private toastr: ToastrService) {}

  showSuccess(title: any, message: any) {
    this.toastr.success(message, title);
  }

  showWarning(title: any, message: any) {
    this.toastr.warning(message, title);
  }
}
