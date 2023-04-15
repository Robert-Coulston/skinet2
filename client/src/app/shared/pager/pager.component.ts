import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ShopParams } from '../models/shipParams';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('page on changes :', changes);
  }
  @Input()
  totalCount = 0;

  @Input()
  shopParams: ShopParams = new ShopParams();

  @Output()
  pageChanged : EventEmitter<ShopParams> = new EventEmitter();

  onPageChanged(event: any) {
    console.log('page changed :', event);
    if (this.shopParams.pageNumber !== event.page) {
      this.shopParams.pageNumber = event.page;
      this.shopParams.pageSize = event.itemsPerPage;
      this.pageChanged.emit({...this.shopParams});
    }
  }

}
