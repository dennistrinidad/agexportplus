import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

// import { Publisher, Hero } from '../../interfaces/hero.interface';
import {  Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: []
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:        new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    // publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img:    new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {

    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params.pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),
      ).subscribe( hero => {

        if ( !hero ) {
          return this.router.navigateByUrl('/');
        }

        // this.heroForm.reset( hero );
        this.heroForm.reset( );
        return;
      });

  }



  onSubmit():void {

    if ( this.heroForm.invalid ) return;

    if ( this.currentHero.heroeCode ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.heroeAlterEgo } updated!`);
        });

      return;
    }

    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        // TODO: mostrar snackbar, y navegar a /heroes/edit/ hero.id
        this.router.navigate(['/heroes/edit', hero.heroeCode ]);
        this.showSnackbar(`${ hero.heroeAlterEgo } created!`);
      });
  }

  onDeleteHero() {
    if ( !this.currentHero.heroeCode ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result ),
        switchMap( () => this.heroesService.deleteHeroById( this.currentHero.heroeCode.toString() )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        this.router.navigate(['/heroes']);
      });

    // dialogRef.afterClosed().subscribe(result => {
    //   if ( !result ) return;

    //   this.heroesService.deleteHeroById( this.currentHero.id )
    //   .subscribe( wasDeleted => {
    //     if ( wasDeleted )
    //       this.router.navigate(['/heroes']);
    //   })
    // });

  }


  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }

}
