import { HeroService } from './hero.service';
import { OnInit } from '@angular/core';

export class HeroComponent implements OnInit {

  heroList: any;
  message: string;

  constructor(private heroService: HeroService ) {}

  ngOnInit() {
    this.heroService.getHeroes().subscribe((res) => {
      this.heroList = res;
    });
  }

  add() {
    let hero = { id: 1, name: 'hero' };
    this.heroService.addHero(hero).subscribe(
      res => { this.heroList.push(res) },
      err => {
        this.message = err;
      }
    );
  }

  delete(id) {
    if ( confirm('Are you sure to delete?')) {
      this.heroService.deleteHero(id);
    }

  }



}
