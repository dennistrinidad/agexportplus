import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImage'
})
export class HeroImagePipe implements PipeTransform {

  transform( hero: Hero ): string {

    if ( !hero.heroeCode && !hero.imageBase64 ) {
      return 'assets/no-image.png';
    }

    if ( hero.imageBase64 ) return hero.imageBase64; // https:///google.com/flash.png

    return `assets/heroes/${ hero.heroeCode }.jpg`;

  }

}
