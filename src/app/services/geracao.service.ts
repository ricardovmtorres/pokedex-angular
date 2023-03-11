import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class GeracaoService {
  private url;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + '/generation';
  }

  getGeracao(idName: number | string): Observable<any> {
    var result = this.http.get(`${this.url}/${idName}`);
    //debugger;
    return result;
  }
}
