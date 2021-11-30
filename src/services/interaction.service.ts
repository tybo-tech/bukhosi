import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CompanyCategory } from 'src/models/company.category.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';


@Injectable({
  providedIn: 'root'
})
export class InteractionService {



  url: string;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
  }

  getByOtherId(otherId: string) {
    return this.http.get<CompanyCategory>(`${this.url}/api/interaction/get-by-otherid.php?OtherId=${otherId}`)
  }

  update(image: Interaction) {
    return this.http.post<Interaction>(
      `${this.url}/api/interaction/update-interaction.php`, image
    );
  }

  add(company: Interaction) {
    return this.http.post<Interaction>(
      `${this.url}/api/interaction/add-interaction.php`, company
    );
  }

  delete(InteractionId: string) {
    return this.http.post<any>(
      `${this.url}/api/interaction/delete-interaction.php`, { InteractionId: InteractionId }
    );
  }
  getInteractions(interactionSearchModel: InteractionSearchModel) {
    return this.http.post<Interaction[]>(
      `${this.url}/api/interaction/get-interactions.php`, interactionSearchModel
    );
  }
  getInteractionsBySource(interactionSearchModel: InteractionSearchModel) {
    return this.http.post<Interaction[]>(
      `${this.url}/api/interaction/get-interactions-by-source.php`, interactionSearchModel
    );
  }



}
