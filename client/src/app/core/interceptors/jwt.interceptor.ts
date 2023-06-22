import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  token: string | null = null;

  constructor(private accountService: AccountService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.accountService.currentUser$.pipe(take(1)).subscribe({next: (user) => {
      if (user != null && user.token) {
          this.token = user.token;
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${this.token}`
            }
          })
      }
    }});

    // if (this.token) {
    //   req = req.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${this.token}`
    //     }
    //   })
    // }

    return next.handle(req);
  }

}
