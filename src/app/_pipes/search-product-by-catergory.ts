import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchproductbycatergory'
})
export class SearchProductByCatergoryPipe implements PipeTransform {

  transform(products: any, val: any): any {

    if (!val) { return products; }
    if (!products) { return []; }
    return products.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()) ||
      (x.Description || '').includes(val) ||
      (x.Catergory && x.Catergory.Name || '').includes(val) ||
      (x.Brand && x.Brand.Name || '').includes(val) ||
      x.Code.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
  }

}
