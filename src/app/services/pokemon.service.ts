import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private url;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + '/pokemon';
  }

  getPokemon(idName: number | string): Observable<any> {
    var result = this.http.get(`${this.url}/${idName}`);
    //debugger;
    return result;
  }
}
