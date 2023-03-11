import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemons-list',
  templateUrl: './pokemons-list.component.html',
  styleUrls: ['./pokemons-list.component.css']
})
export class PokemonsListComponent {
  public pokemons: any[] = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.listarPaginaPokemons();
  }

  // listarPaginaPokemons() {
  //   var numPokemons: number = 0 ;
  //   var listaPokes = [];

  //   //lista pokemons por paginação de 20 em 20
  //   this.pokemonService.getPokemon("").subscribe(
  //     {
  //       next: (data) => {
  //         console.log(data);
  //         listaPokes = data.results;
  //         numPokemons = this.pokemons.length;
  //         //todo: preencher o valor dos botões de proxima pagina e pagina anterior
  //         //
  //         console.log(this.pokemons);
  //       },
  //       error: (error) => {
  //         console.error("erro na busca de pokemons:");
  //         console.error(error);
  //       },
  //       complete: () => {
  //         console.log('Consulta concluída');
  //         this.listarDetalhesPokemons(numPokemons);
  //       }
  //     }
  //   );
  // }

  // listarDetalhesPokemons(tamanho: number) {
  //   //busca pelos detalhes de cada pokemon da lista
  //   for (let i = 0; i < tamanho; i++) {
  //     this.pokemonService.getPokemon(i).subscribe(
  //       {
  //         next: (data) => {
  //           console.log(data);
  //           this.pokemons.push({
  //             name: data.name,
  //             image: data.sprites['front_default'],
  //             type: data.types.map((type: any) => type.type.name).join(', '),
  //             id: data.id
  //           });
  //           console.log(this.pokemons);
  //         },
  //         error: (error) => {
  //           console.error("erro na busca do pokemon "+ i.toString()+":");
  //           console.error(error);
  //         },
  //         complete: () => {
  //           console.log('Consulta concluída');
  //         }
  //       }
  //     );
  //   }

  // }

  listarPaginaPokemons() {
    this.pokemonService.getPokemon("").subscribe({
      next: (data) => {
        console.log(data);
        this.listarDetalhesPokemons(data.results);
        // todo: preencher o valor dos botões de proxima pagina e pagina anterior
        console.log("listarPaginaPokemons");
        console.log(this.pokemons);
      },
      error: (error) => {
        console.error("erro na busca de pokemons:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta concluída');
      },
    });
  }
  
  listarDetalhesPokemons(pokemons: any[]) {
    const observables = pokemons.map((pokemon) =>
      this.pokemonService.getPokemon(pokemon.name)
    );
  
    forkJoin(observables).subscribe({
      next: (data) => {
        console.log(data);
        this.pokemons = data.map((pokemon: any) => ({
          name: pokemon.name,
          image: pokemon.sprites['front_default'],
          type: pokemon.types.map((type: any) => type.type.name).join(', '),
          id: pokemon.id,
        }));
        console.log(this.pokemons);
      },
      error: (error) => {
        console.error("erro na busca dos detalhes dos pokemons:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta concluída');
      },
    });
  }

}
