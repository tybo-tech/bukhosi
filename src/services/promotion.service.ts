import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Promotion } from 'src/models/promotion.model';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {



  url: string;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
  }


  update(promotion: Promotion) {
    return this.http.post<Promotion>(
      `${this.url}/api/promotion/update-promotion.php`, promotion
    );
  }

  add(promotion: Promotion) {
    return this.http.post<Promotion>(
      `${this.url}/api/promotion/add-promotion.php`, promotion
    );
  }
  getByCompanyId(companyId: string, statusId: number) {
    return this.http.get<Promotion[]>(
      `${this.url}/api/promotion/get-promotions.php?CompanyId=${companyId}&StatusId=${statusId}`
    );
  }
  getAllActivePromotions() {
    return this.http.get<Promotion[]>(
      `${this.url}/api/promotion/get-all-active-promotions.php`
    );
  }
  get(promotionId: string) {
    return this.http.get<Promotion>(
      `${this.url}/api/promotion/get-by-id.php?PromotionId=${promotionId}`
    );
  }
  getByCode(promoCode: string) {
    return this.http.get<Promotion>(
      `${this.url}/api/promotion/get-by-code.php?PromoCode=${promoCode}`
    );
  }



}
