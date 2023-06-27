import { Component, Input } from '@angular/core';
import { ShopParams } from '../models/shopParams';

@Component({
  selector: 'app-paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss'],
})
export class PagingHeaderComponent {
  @Input()
  totalCount = 0;

  @Input()
  shopParams: ShopParams = new ShopParams();

  pageDisplay = () => {
    if (this.totalCount === 0) {
      return 'There are no items matching your search';
    }
    const part1 =
      (this.shopParams.pageNumber - 1) * this.shopParams.pageSize + 1;
    const part2 =
      this.shopParams.pageNumber * this.shopParams.pageSize >
      this.totalCount
        ? this.totalCount
        : this.shopParams.pageNumber * this.shopParams.pageSize;
    return `Showing ${part1} - ${part2} of ${this.totalCount} results`;
  };
}
