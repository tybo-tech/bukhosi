import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/models';

@Pipe({
  name: 'searchproductshome'
})
export class SearchProductHomePipe implements PipeTransform {

  transform(products: Product[], val: any): any {

    if (!val) { return products; }
    if (!products) { return []; }
    return products.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()) ||
      (x.Description || '').includes(val));
  }

}
