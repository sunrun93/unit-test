import { Http } from '@angular/http';
import { Observable } from 'rxjs';

export class HeroService {

  constructor(private http: Http) {
  }

  getHeroes() {
    return this.http.get('...');
  }

  addHero(hero) {
    return this.http.post('...', hero);
  }

  deleteHero(id) {
    return this.http.get('...' + id);
  }
}
