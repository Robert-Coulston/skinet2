import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from './models/Product';
import { Pagination } from './models/Pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Skinet';

  constructor(private http: HttpClient) {}

  productPage: Pagination<Product> = {
    pageIndex: 0,
    pageSize: 0,
    count: 0
  };
  
  ngOnInit(): void {
    this.http.get<Pagination<Product>>('https://localhost:5001/api/products/eager').subscribe({
      next: (productPage) => {
        this.productPage = productPage;
      },
      error: (error) => console.log(error),
      complete: () => console.log('request completed'),
    });
  }
}
