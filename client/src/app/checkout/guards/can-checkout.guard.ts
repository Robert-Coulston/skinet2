import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';

@Injectable({
  providedIn: 'root',
})
export class CanCheckoutGuard implements CanActivate {
  constructor(private basketService: BasketService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket) {
      return true;
    } else {
      this.router.navigateByUrl('/basket');
      return false;
    }
  }
}
