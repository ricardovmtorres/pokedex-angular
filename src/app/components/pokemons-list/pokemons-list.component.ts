import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AtaqueService } from 'src/app/services/ataque.service';
import { GeracaoService } from 'src/app/services/geracao.service';
import { GetService } from 'src/app/services/get.service';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemons-list',
  templateUrl: './pokemons-list.component.html',
  styleUrls: ['./pokemons-list.component.css']
})
export class PokemonsListComponent {
  // Paginação
  private nextPage: string = "";
  private previousPage: string = "";


  public idPokemon: number = 0;
  public pokemons: any[] = [];

  public idGeracao: number = 0;
  public geracoes: any[] = [];

  public idAtaque: number = 0;
  public ataques: any[] = [];

  constructor(private pokemonService: PokemonService,
    private getService: GetService,
    private geracaoService: GeracaoService,
    private ataqueService: AtaqueService) {
    
  }

  ngOnInit(): void {
    this.listarPaginaPokemons();
    this.listarGeracoes();
    this.listarAtaques();
  }

  listarPaginaPokemons() {
    this.pokemonService.getPokemon("").subscribe({
      next: (data) => {
        // console.log(data);
        this.listarDetalhesPokemons(data.results);
        // Preenche o valor dos botões de proxima pagina e pagina anterior
        this.nextPage = data.next;
        this.previousPage = data.previous;
      },
      error: (error) => {
        console.error("Erro na busca de pokemons:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta dos indices de todos Pokemons da api v2 concluída');
      },
    });
  }

  listarGeracoes() {
    this.geracaoService.getGeracao("").subscribe({
      next: (data) => {
        // console.log(data);
        this.geracoes = data.results;
      },
      error: (error) => {
        console.error("Erro na busca de geracoes:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta de Geracoes concluída:');
        console.log(this.geracoes);
      },
    });
  }

  listarAtaques() {
    this.ataqueService.getAtaque("").subscribe({
      next: (data) => {
        // console.log(data);
        this.ataques = data.results;
        this.getService.get("https://pokeapi.co/api/v2/move/?limit=" + data.count).subscribe({
          next: (data: any) => {
            // console.log(data);
            // debugger;
            return data.results;
          }
        });
      },
      error: (error) => {
        console.error("Erro na busca de ataques:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta de Ataques concluída:');
        console.log(this.ataques);
      },
    });
  }

  listarDetalhesPokemons(pokemons: any[]) {
    const observables = pokemons.map((pokemon) =>
      this.pokemonService.getPokemon(pokemon.name)
    );

    forkJoin(observables).subscribe({
      next: (data) => {
        // console.log(data);
        this.pokemons = data.map((pokemon: any) => ({
          name: pokemon.name,
          image: pokemon.sprites['front_default'],
          type: pokemon.types.map((type: any) => type.type.name).join(', '),
          id: pokemon.id,
        }));
      },
      error: (error) => {
        console.error("Erro na busca dos detalhes dos pokemons:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta dos detalhes dos Pokemons da pagina concluída:');
        console.log(this.pokemons);
      },
    });
  }

  proximaPagina() {
    this.getService.get(this.nextPage).subscribe({
      next: (data) => {
        this.listarDetalhesPokemons(data.results);
      },
      error: (error) => {
        console.error("Erro na proxima pagina de pokemons:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta concluída');
      },
    });
  }

  paginaAnterior() {
    this.getService.get(this.previousPage).subscribe({
      next: (data) => {
        this.listarDetalhesPokemons(data.results);
      },
      error: (error) => {
        console.error("Erro na pagina anterior de pokemons:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta concluída');
      },
    });
  }

  onChangeIdGeracao(idGeracao: any) {
    if (idGeracao.value != null){
      this.idGeracao = idGeracao.value;
      
    }

  }

}
