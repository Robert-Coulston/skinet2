import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Skinet';

  constructor(private http: HttpClient) {}

  products: any = {};
  ngOnInit(): void {
    this.http.get<any>('https://localhost:5001/api/products/eager').subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => console.log(error),
      complete: () => console.log('request completed'),
    });
  }
}
