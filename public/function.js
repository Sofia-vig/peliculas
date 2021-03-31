const peliculas = [];

function getAllMovies(db) {
  var divTodasLasPeliculas = "";
  db.collection("pelis")
    .orderBy("rating", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const pelicula = doc.data();
        pelicula.id = doc.id;
        peliculas.push(pelicula);
        divTodasLasPeliculas += divGeneralPeliculas(pelicula);
        document.getElementById("movies").innerHTML = divTodasLasPeliculas;
      });
    });
}

function searchMovie(db, search) {
  let searchMinuscula = search.toLowerCase();
  var divSearch = "";

  let peliculasFiltro = [];
  for (let pelicula of peliculas) {
    let titulo = pelicula.titulo.toLowerCase();
    if (titulo.indexOf(searchMinuscula) !== -1) {
      peliculasFiltro.push(pelicula);
    }
  }
  peliculasFiltro.forEach((pelicula) => {
    divSearch += divGeneralPeliculas(pelicula);
    document.getElementById("movies").innerHTML = divSearch;
  });
}

function videoMovie(db, id) {
  return db
    .collection("pelis")
    .doc(id)
    .get()
    .then((query) => {
      const pelicula = query.data();
      return pelicula;
    });
}

function video(db) {
  var divVideo = "";
  let params = new URLSearchParams(location.search);
  var idMovie = params.get("id");
  var data = videoMovie(db, idMovie);
  data.then((p) => {
    var video = document.getElementById("video");
    video.src = p.video;
    video.load();
    video.play();
    document.getElementById("image").src = p.imagen;
    document.getElementById("title").innerHTML = p.titulo;
    document.getElementById("rating").innerHTML = "Rating: " + p.rating;
    document.getElementById("actors").innerHTML = "Actores: " + p.actores;
    document.getElementById("genero").innerHTML = "Generos: " + p.genero;
    document.getElementById("sinopsis").innerHTML = "Sinopsis: " + p.sinopsis;
  });
}

function searchByFilmGenre(db, genero) {
  console.log("entro");
  var divSearch = "";
  let peliculasFiltroporGenero = [];
  for (let pelicula of peliculas) {
    if (
      pelicula.genero.find((g) => {
        return g == genero;
      })
    ) {
      peliculasFiltroporGenero.push(pelicula);
    }
  }
  peliculasFiltroporGenero.forEach((pelicula) => {
    divSearch += divGeneralPeliculas(pelicula);
    document.getElementById("movies").innerHTML = divSearch;
  });
}

function searchMovieByLetter(db, letra) {
  var divSearch = "";
  let peliculasFiltro = [];
  for (let pelicula of peliculas) {
    if (pelicula.titulo[0].indexOf(letra) !== -1) {
      peliculasFiltro.push(pelicula);
    }
  }
  peliculasFiltro.forEach((pelicula) => {
    divSearch += divGeneralPeliculas(pelicula);
    document.getElementById("movies").innerHTML = divSearch;
  });
}

function divGeneralPeliculas(pelicula) {
  const div = `
  <div class="movie">
  <a class="image"href="video.html?id=${pelicula.id}" target="_blank"><img
    src="${pelicula.imagen}" title="${pelicula.titulo}"
  /></a>
  <a class="title"href="video.html?id=${pelicula.id}" target="_blank">${pelicula.titulo}</a>
</div>
  `;
  return div;
}

function arrayLetras() {
  var divLetras = "";
  const letras = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  letras.forEach((letra) => {
    divLetras += `<button onclick="searchMovieByLetter(db,'${letra}')">${letra}</button>`;
  });
  document.getElementById("a-z").innerHTML = divLetras;
}

function arrayGeneros() {
  var divGeneros = "";
  const generos = [
    "Terror",
    "Accion",
    "Comedia",
    "Crimen",
    "Thriller",
    "Misterio",
    "Ciencia Ficcion",
    "Aventura",
  ];
  generos.forEach((genero) => {
    divGeneros += `<input type="radio" id="${genero}" name="genero" onclick="searchByFilmGenre(db,'${genero}')"/>
    <label for="${genero}"> ${genero}</label><br />`;
    //divGeneros += `<button onclick="searchByFilmGenre(db,'${genero}')">${genero}</button>`;
  });
  document.getElementById("genero").innerHTML = divGeneros;
}
