import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyCategory } from 'src/models/company.category.model';
import { Category } from 'src/models/category.model';
import { Company } from 'src/models/company.model';
import { Images } from 'src/models/images.model';
import { CustomDesign } from 'src/models/customdesign.model';


@Injectable({
  providedIn: 'root'
})
export class CustomDesignService {




  url: string;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
  }

  getByOtherId(otherId: string, customerId: string) {
    return this.http.get<CompanyCategory>(`${this.url}/api/customdesign/get-by-customer-id.php?StatusId=${otherId}&CustomerId=${customerId}`)
  }

  update(company: CustomDesign) {
    return this.http.post<CustomDesign>(
      `${this.url}/api/customdesign/update-customdesign.php`, company
    );
  }
  add(company: CustomDesign) {
    return this.http.post<CustomDesign>(
      `${this.url}/api/customdesign/add-customdesign.php`, company
    );
  }


  getByStatus(status: string) {
    return this.http.get<CustomDesign[]>(`${this.url}/api/customdesign/get-by-status.php?Status=${status}`)
  }

  getById(customDesignId: string) {
    return this.http.get<CustomDesign>(`${this.url}/api/customdesign/get-by-id.php?CustomDesignId=${customDesignId}`)
  }


}
