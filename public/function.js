const peliculas = [];

function getAllMovies(db) {
  var divMovies = "";
  db.collection("pelis")
    .orderBy("rating", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const pelicula = doc.data();
        pelicula.id = doc.id;
        peliculas.push(pelicula);
        divMovies += divPeliculas(pelicula);
        document.getElementById("movies").innerHTML = divMovies;
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
    divSearch += divPeliculas(pelicula);
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

function searchByFilmGenre(db) {
  let params = new URLSearchParams(location.search);
  var generoMovie = params.get("genero");
  var divSearch = "";
  db.collection("pelis")
    .orderBy("rating", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const mv = doc.data();
        mv.id = doc.id;
        var generoEncontrado = mv.genero.find((g) => {
          return generoMovie == g;
        });
        if (generoEncontrado != undefined) {
          divSearch += `  <div class="movie">
          <a class="image"href="video.html?id=${mv.id}" target="_blank"><img
            src="${mv.imagen}" title="${mv.titulo}"
          /></a>
          <a class="title"href="video.html?id=${mv.id}" target="_blank">${mv.titulo}</a>
      </div>`;
          document.getElementById("movies").innerHTML = divSearch;
        }
      });
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
    divSearch += divPeliculas(pelicula);
    document.getElementById("movies").innerHTML = divSearch;
  });
}

function divPeliculas(pelicula) {
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
