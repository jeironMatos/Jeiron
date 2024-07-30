// script.js

document.addEventListener("DOMContentLoaded", async function() {
    const typeColors = {
        normal: "#A8A878",
        fighting: "#C03028",
        flying: "#A890F0",
        poison: "#A040A0",
        ground: "#E0C068",
        rock: "#B8A038",
        bug: "#A8B820",
        ghost: "#705898",
        steel: "#B8B8D0",
        fire: "#F08030",
        water: "#6890F0",
        grass: "#78C850",
        electric: "#F8D030",
        psychic: "#F85888",
        ice: "#98D8D8",
        dragon: "#7038F8",
        dark: "#705848",
        fairy: "#EE99AC",
        unknown: "#68A090",
        shadow: "#6F3F9E"
    };

    const limit = 12;
    let offset = 0;
    let allPokemon = []; // Array para almacenar todos los Pokémon

    async function fetchData() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokedex/national');
            if (!response.ok) {
                throw new Error('La solicitud no fue exitosa');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Hubo un problema con la solicitud Fetch:', error);
            throw error;
        }
    }

    async function displayPokemonList() {
        const pokemonListElement = document.getElementById("pokemon-list");
        pokemonListElement.innerHTML = ""; // Limpiar la lista antes de agregar nuevos Pokémon
        const data = await fetchData();
        const pokemonEntries = data.pokemon_entries.slice(offset, offset + limit);

        for (const pokemon of pokemonEntries) {
            const number = '0000';
            const entryNumber = pokemon.entry_number;
            let formattedNumber = number.slice(0, -entryNumber.toString().length) + entryNumber;
            let PokemonSpecies = capitalizeFirstLetter(pokemon.pokemon_species.name);

            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${entryNumber}`);
                if (!response.ok) {
                    throw new Error('Error al obtener datos del Pokémon');
                }
                const pokemonData = await response.json();
                const types = pokemonData.types.map(type => type.type.name);

                const image = document.createElement("li");
                image.innerHTML = `
                    <div class="Content-img">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png" alt="${PokemonSpecies}">
                    </div>
                    <div class="Description-pokemon">
                        <span class="Number-pokemon">N.º ${formattedNumber}</span>
                        <h2>${PokemonSpecies}</h2>
                        <div class="Type-colors">
                            ${types.map(type => `
                                <div class="Type-color" style="background-color: ${typeColors[type]};">${capitalizeFirstLetter(type)}</div>
                            `).join('')}
                        </div>
                    </div>
                `;
                image.addEventListener("click", function() {
                    // Redirige a la página de detalles del Pokémon cuando se hace clic en la imagen
                    window.location.href = `pokemon-details.html?name=${encodeURIComponent(PokemonSpecies)}`;
                });
                pokemonListElement.appendChild(image);

                // Guarda el Pokémon en el array de todos los Pokémon
                allPokemon.push({
                    number: formattedNumber,
                    name: PokemonSpecies
                });
            } catch (error) {
                console.error('Hubo un problema al mostrar el Pokémon:', error);
            }
        }
    }

    function capitalizeFirstLetter(word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    }

    function BuscarPokemon() {
        const searchInput = document.getElementById("search-input");
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredPokemon = allPokemon.filter(pokemon => {
                return pokemon.name.toLowerCase().includes(searchTerm) || pokemon.number.toLowerCase().includes(searchTerm);
            });
            // Muestra solo los Pokémon que coinciden con la búsqueda
            const pokemonItems = document.querySelectorAll("#pokemon-list li");
            pokemonItems.forEach(pokemonItem => {
                const pokemonNumber = pokemonItem.querySelector(".Number-pokemon").textContent.toLowerCase();
                const pokemonName = pokemonItem.querySelector("h2").textContent.toLowerCase();
                if (filteredPokemon.some(pokemon => pokemon.number.toLowerCase().includes(pokemonNumber) || pokemon.name.toLowerCase().includes(pokemonName))) {
                    pokemonItem.style.display = "block";
                } else {
                    pokemonItem.style.display = "none";
                }
            });
        });
    }

    document.getElementById("load-more-btn").addEventListener("click", function() {
        offset += limit;
        displayPokemonList();
    });

    document.getElementById("load-previous-btn").addEventListener("click", function() {
        offset -= limit;
        if (offset < 0) {
            offset = 0;
        }
        displayPokemonList();
    });

    BuscarPokemon();
    displayPokemonList(); // Mostrar los primeros Pokémon al cargar la página
});

