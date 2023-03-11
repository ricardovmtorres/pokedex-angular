import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class AtaqueService {
  private url;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + '/move';
  }

  getAtaque(idName: number | string): Observable<any> {
    var result = this.http.get(`${this.url}/${idName}`);
    return result;
  }
}
