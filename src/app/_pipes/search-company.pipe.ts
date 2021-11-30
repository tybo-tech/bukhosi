import { Pipe, PipeTransform } from '@angular/core';
import { Company } from 'src/models/company.model';

@Pipe({
  name: 'searchcompany'
})
export class SearchCompanyPipe implements PipeTransform {

  transform(companys: Company[], val: any): any {

    if (!val) { return companys; }
    if (!companys) { return []; }
    return companys.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()) ||
      (x.Description || '').includes(val));
  }

}
