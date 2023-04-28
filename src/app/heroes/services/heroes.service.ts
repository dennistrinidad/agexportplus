import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }  

  getHeroes(): Promise<any> {
    return this.http.get(`${this.baseUrl}getAll`, this.headers).toPromise();
  }

  // getHeroes():Observable<Hero[]> {
  //   return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  // }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError(error => of(undefined))
      );
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  }


  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.heroeCode) throw Error('Hero id is required');

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.heroeCode}`, hero);
  }

  deleteHeroById(id: string): Observable<boolean> {

    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        map(resp => true),
        catchError(err => of(false)),
      );
  }


}
