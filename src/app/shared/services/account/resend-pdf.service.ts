import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { ResendPdfInfo } from '../../models/resend-pdf-info';

@Injectable({
  providedIn: 'root'
})
export class ResendPdfService {

  constructor(private http: HttpClient) {
  }

  resendPdf(resendPdfInfo: ResendPdfInfo ) {
    return this.http.post(
      `${environment['host']}/api/account/resendpdf`,
      resendPdfInfo,
      {withCredentials: true});
  }
}
