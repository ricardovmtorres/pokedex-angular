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

  // Dados
  public idPokemon: number = 0;
  public pokemons: any[] = [];
  public locations: any[] = [];
  public exibePokemons: boolean = true;

  // Filtro
  public nameGeracao: string = "Todas Geracoes";
  public geracoes: any[] = [];

  public nameAtaque: string = "Todos Ataques";
  public ataques: any[] = [];

  public namesTiposAtaque: any[] = ["Todos os Tipos"];
  public tiposAtaque: any[] = [];

  constructor(private pokemonService: PokemonService,
    private getService: GetService,
    private geracaoService: GeracaoService,
    private ataqueService: AtaqueService) {

  }

  ngOnInit(): void {
    this.listarPaginaPokemons();
    this.listarGeracoes();
    this.listarTiposAtaques();
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


  listarTiposAtaques() {
    this.pokemonService.getTipos("").subscribe({
      next: (data) => {
        console.log(data.results);
        this.tiposAtaque = data.results;
      },
      error: (error) => {
        console.error("Erro na busca de tipos de pokemons:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta dos tipos de todos Pokemons da api v2 concluída');
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

  onChangeIdGeracao() {
    if (this.nameGeracao != "todas") {
      this.geracaoService.getGeracao(this.nameGeracao).subscribe({
        next: (data) => {
          // console.log(data);
          this.listarDetalhesPokemons(data.pokemon_species);

          // Preenche o valor dos botões de proxima pagina e pagina anterior
          this.nextPage = data.next;
          this.previousPage = data.previous;
          console.log(data.pokemon_species);
          // debugger;
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
  }

  onChangeIdAtaque() {
    if (this.nameAtaque != "todos") {
      this.ataqueService.getAtaque(this.nameAtaque).subscribe({
        next: (data) => {
          // console.log(data);
          var pokemonsAtaque = data.learned_by_pokemon;
          this.buscarLocalidadesPorAtaque(pokemonsAtaque);
          this.listarDetalhesPokemons(data.learned_by_pokemon);
          // Preenche o valor dos botões de proxima pagina e pagina anterior
          this.nextPage = data.next;
          this.previousPage = data.previous;
          console.log(pokemonsAtaque);
          // debugger;
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
  }

  onChangeTipos() {
    let allPokemons: any[] = [];
    this.namesTiposAtaque = this.namesTiposAtaque.filter(tipo => tipo !== "Todos os Tipos");
    if (this.namesTiposAtaque.length != 0) {
      // Array dinâmico de observables que emitem vetores de nomes de pokémons
      const observables = this.namesTiposAtaque.map(tipo => this.pokemonService.getTipos(tipo));

      // Combina os resultados dos observables em um único observable
      forkJoin(observables).subscribe({
        next: (data) => {
          console.log(data);
          data.map(tipo => {
            tipo.pokemon.map((slot: { pokemon: any; }) => {
              allPokemons = [...allPokemons, slot.pokemon]
            })
          });
          // console.log(allPokemons);
          // debugger;
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.listarDetalhesPokemons(allPokemons);
        }
      }
      );

      this.ataqueService.getAtaque(this.nameAtaque).subscribe({
        next: (data) => {
          // console.log(data);
          var pokemonsAtaque = data.learned_by_pokemon;
          this.listarDetalhesPokemons(data.learned_by_pokemon);
          // Preenche o valor dos botões de proxima pagina e pagina anterior
          this.nextPage = data.next;
          this.previousPage = data.previous;
          console.log(pokemonsAtaque);
          // debugger;
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
  }

  buscarLocalidadesPorAtaque(pokemons: any[]) {
    let pokemonsAtaque: any[] = [];
    let locais: any[] = [];
    const pokemonObservables = pokemons.map((p) => this.getService.get(p.url));
    forkJoin(pokemonObservables).subscribe({
      next: (data) => {
        data.map(poke => {
          pokemonsAtaque.push(poke.location_area_encounters);
        });
        
        const observables = pokemonsAtaque.map(localizacao =>
          this.getService.get(localizacao)
        );
    
        forkJoin(observables).subscribe({
          next: (data) => {
            console.log(data);
            locais = [].concat(...data);
            
            this.listarDetalhesLocalizacoes(locais);
          },
          error: (error) => {
            console.error("Erro na busca dos detalhes das localizacoes:");
            console.error(error);
          },
          complete: () => {
            console.log('Consulta dos detalhes das localizacoes da pagina concluída:');
            console.log(this.pokemons);
          },
        });

      },
    });
    
  }

  mudaExibicao() {
    this.exibePokemons = !this.exibePokemons
  }

  listarDetalhesLocalizacoes(localizacoes: any[]) {
    const observables = localizacoes.map(localizacao =>
      this.getService.get(localizacao.location_area.url)
    );

    forkJoin(observables).subscribe({
      next: (data) => {
        console.log(data);
        // const locais = [].concat(...data);
        this.locations = data.map((local: any) => ({
          id: local.id,
          tag: local.name,
          name: local.names[0].name,
          // region: local.region[0].name,
        }));
      },
      error: (error) => {
        console.error("Erro na busca dos detalhes das localizacoes:");
        console.error(error);
      },
      complete: () => {
        console.log('Consulta dos detalhes das localizacoes da pagina concluída:');
        console.log(this.locations);
      },
    });
  }

}
