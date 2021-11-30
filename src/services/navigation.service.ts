import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private http: HttpClient
  ) { }
  getHomeNavigation(): Observable<any[]> {
    return this.http.get<any[]>('assets/locale/home-navigation.json');
  }
  getToolbarNavigation(): Observable<any[]> {
    return this.http.get<any[]>('assets/locale/toolbar-navigation.json');
  }
}
