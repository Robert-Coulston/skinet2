import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ShopParams } from '../models/shopParams';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
  }

  @Input() totalCount = 0;
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() pageChanged = new EventEmitter<number>();


  onPageChanged(event: any) {
    console.log('page changed :', event);
    this.pageChanged.emit(event.page);
  }
}
