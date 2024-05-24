const API = "http://localhost:8001/films";
const photoFilmInp = document.querySelector("#photoFilm");
const filmNameInp = document.querySelector("#filmName");
const filmDirectorInp = document.querySelector("#filmDirector");
const filmGenreInp = document.querySelector("#filmGenre");
const filmYearInp = document.querySelector("#filmYear");
const sectionFilms = document.querySelector(".sectionFilms");
let btn = document.querySelector(".btn");
let searchValue = "";
let countPage = 1;
let currenttPage = 1;
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");

document.getElementById("burger-btn").addEventListener("click", function () {
  var menu = document.getElementById("burger-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
});
document
  .getElementById("createFilmButton")
  .addEventListener("click", function () {
    const filmForm = document.getElementById("filmForm");
    if (filmForm.style.display === "none" || filmForm.style.display === "") {
      filmForm.style.display = "block";
    } else {
      filmForm.style.display = "none";
    }
  });

const toBase = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// ! ================ CREATE =============
btn.addEventListener("click", async () => {
  if (
    !photoFilmInp.files.length ||
    !filmNameInp.value.trim() ||
    !filmDirectorInp.value.trim() ||
    !filmGenreInp.value.trim() ||
    !filmYearInp.value.trim()
  ) {
    alert("заполните все поля");
    return;
  }
  let photoUrl = await toBase(photoFilmInp.files[0]);

  let newFilm = {
    photoFilm: photoUrl,
    filmName: filmNameInp.value,
    filmDirector: filmDirectorInp.value,
    filmGenre: filmGenreInp.value,
    filmYear: filmYearInp.value,
  };

  createFilm(newFilm);
  readFilms();
  photoFilmInp.value = "";
  filmNameInp.value = "";
  filmDirectorInp.value = "";
  filmGenreInp.value = "";
  filmYearInp.value = "";
});
function createFilm(film) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(film),
  }).then(() => readFilms());
}

// ! ========== READ =======
async function readFilms() {
  const res = await fetch(
    `${API}?q=${searchValue}&_page=${currenttPage}&_limit=1`
  );
  const data = await res.json();
  sectionFilms.innerHTML = "";
  data.forEach((elem) => {
    sectionFilms.innerHTML += `<div class="card" style="width: 15rem">
    <img style="height: 300px" src="${elem.photoFilm}" alt="${elem.filmName}" />
    <div class="card-body">
      <h5 class="card-title">${elem.filmName}</h5>
      <p class="card-text">${elem.filmDirector}</p>
      <span>${elem.filmGenre}</span>
      <button type="button" class="btn btn-danger btnDelete" id="${elem.id}">Удалить</button>
      <button data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="btn btn-info btnEdit" id="${elem.id}">Редактировать</button>
      <button data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="btn btn-success btnDetReview" id="${elem.id}">Детальный обзор</button>
    </div>
    </div>`;
  });
}
readFilms();

// ! =========== DELETE ==========
document.addEventListener("click", (e) => {
  const del_class = [...e.target.classList];
  let id = e.target.id;
  if (del_class.includes("btnDelete")) {
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }
});
// !============= SEARCH ==============
inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value;
  readFilms();
});

// ! ============== PAGINATION ==============
async function pageFunc() {
  const res = await fetch(API);
  const data = await res.json();
  countPage = Math.ceil(data.length / 3);
  console.log(countPage);
}
prevBtn.addEventListener("click", () => {
  if (currenttPage <= 1) return;
  currenttPage--;
  readFilms();
});
nextBtn.addEventListener("click", () => {
  if (currenttPage >= countPage) return;
  currenttPage++;
  readFilms();
});

// ! ==================== EDIT2 =================
// const editModal = document.querySelector(".editModal");
// const editphotoFilmInp = document.querySelector("#editphotoFilm");
// const editfilmNameInp = document.querySelector("#editfilmName");
// const editfilmDirectorInp = document.querySelector("#editfilmDirector");
// const editfilmGenreInp = document.querySelector("#editfilmGenre");
// const editfilmYearInp = document.querySelector("#editfilmYear");
// const btnEditSave = document.querySelector("#btnEditSave");

// document.addEventListener("click", (e) => {
//   let edit_class = [...e.target.classList];
//   let id = e.target.id;
//   if (edit_class.includes("btnEdit")) {
//     fetch(${API}/${id})
//       .then((res) => {
//         return res.json();
//       })
//       .then((data) => {
//         editphotoFilmInp.value = data.photoFilm;
//         editfilmNameInp.value = data.filmName;
//         editfilmDirectorInp.value = data.filmDirector;
//         editfilmGenreInp.value = data.filmGenre;
//         editfilmYearInp.value = data.filmYear;
//         btnEditSave.setAttribute("id", data.id);
//       });
//   }
// });
// // readFilms();

// btnEditSave.addEventListener("click", () => {
//   if (
//     !editphotoFilmInp.value.trim() ||
//     !editfilmNameInp.value.trim() ||
//     !editfilmDirectorInp.value.trim() ||
//     !editfilmGenreInp.value.trim() ||
//     !editfilmYearInp.value.trim()
//   ) {
//     alert("Введите данные!");
//     return;
//   }
//   let editedFilm = {
//     photoFilm: inpEditName.value,
//     filmName: inpEditAuthor.value,
//     filmDirector: inpEditImg.value,
//     filmGenre: inpEditPrice.value,
//     filmYear: inpEditPrice.value,
//   };
//   editedFilm(editedFilm, btnEditSave.id);
// });
// function editedFilm(film, id) {
//   fetch(${API}/${id}, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(film),
//   }).then(() => readFilms());
//   // чтобы автоматически читалось (появлялось) на странице ,then дает ответ на вызов функции
// }

// const API = "http://localhost:8001/films";
// const photoFilmInp = document.querySelector("#photoFilm");
// const filmNameInp = document.querySelector("#filmName");
// const filmDirectorInp = document.querySelector("#filmDirector");
// const filmGenreInp = document.querySelector("#filmGenre");
// const filmYearInp = document.querySelector("#filmYear");
// const sectionFilms = document.querySelector(".sectionFilms");
// let btn = document.querySelector(".btn");
// let searchValue = "";
// let countPage = 1;
// let currenttPage = 1;
// let prevBtn = document.querySelector("#prevBtn");
// let nextBtn = document.querySelector("#nextBtn");

// // document.getElementById("burger-btn").addEventListener("click", function () {
// //   var menu = document.getElementById("burger-menu");
// //   menu.style.display = menu.style.display === "block" ? "none" : "block";
// // });

// // document.getElementById("createFilmButton")
// //   .addEventListener("click", function () {
// //     const filmForm = document.getElementById("filmForm");
// //     if (filmForm.style.display === "none" || filmForm.style.display === "") {
// //       filmForm.style.display = "block";
// //     } else {
// //       filmForm.style.display = "none";
// //     }
// //   });

// // const toBase = (file) =>
// //   new Promise((resolve, reject) => {
// //     const reader = new FileReader();
// //     reader.readAsDataURL(file);
// //     reader.onload = () => resolve(reader.result);
// //     reader.onerror = (error) => reject(error);
// //   });

// // ! ================ CREATE =============
// btn.addEventListener("click", async () => {
//   if (
//     !photoFilmInp.files.length ||
//     !filmNameInp.value.trim() ||
//     !filmDirectorInp.value.trim() ||
//     !filmGenreInp.value.trim() ||
//     !filmYearInp.value.trim()
//   ) {
//     alert("Заполните все поля");
//     return;
//   }
//   let photoUrl = await toBase(photoFilmInp.files[0]);

//   let newFilm = {
//     photoFilm: photoUrl,
//     filmName: filmNameInp.value,
//     filmDirector: filmDirectorInp.value,
//     filmGenre: filmGenreInp.value,
//     filmYear: filmYearInp.value,
//   };

//   createFilm(newFilm);
//   readFilms();
//   photoFilmInp.value = "";
//   filmNameInp.value = "";
//   filmDirectorInp.value = "";
//   filmGenreInp.value = "";
//   filmYearInp.value = "";
// });

// function createFilm(film) {
//   fetch(API, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(film),
//   }).then(() => readFilms());
// }

// // ! ========== READ =======
// async function readFilms() {
//   const res = await fetch(
//     `${API}?q=${searchValue}&_page=${currenttPage}&_limit=4`
//   );
//   const data = await res.json();
//   sectionFilms.innerHTML = "";
//   data.forEach((elem) => {
//     sectionFilms.innerHTML += `<div class="card" style="width: 15rem">
//     <img style="height: 300px" src="${elem.photoFilm}" alt="${elem.filmName}" />
//     <div class="card-body">
//       <h5 class="card-title">${elem.filmName}</h5>
//       <p class="card-text">${elem.filmDirector}</p>
//       <span>${elem.filmGenre}</span>
//       <button type="button" class="btn btn-danger btnDelete" id="${elem.id}">Удалить</button>
//       <button data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="btn btn-info btnEdit" id="${elem.id}">Редактировать</button>
//       <button data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="btn btn-success btnDetReview" id="${elem.id}">Детальный обзор</button>
//     </div>
//     </div>`;
//   });
// }
// readFilms();

// // ! =========== DELETE ==========
// document.addEventListener("click", (e) => {
//   const del_class = [...e.target.classList];
//   let id = e.target.id;
//   if (del_class.includes("btnDelete")) {
//     fetch(`${API}/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json;charset=utf-8",
//       },
//     }).then(() => readFilms());
//   }
// });

// // !============= SEARCH ==============
// inpSearch.addEventListener("input", (e) => {
//   searchValue = e.target.value;
//   readFilms();
// });

// // ! ============== PAGINATION ==============
// // async function pageFunc() {
// //   const res = await fetch(API);
// //   const data = await res.json();
// //   countPage = Math.ceil(data.length / 3);
// //   console.log(countPage);
// // }
// // prevBtn.addEventListener("click", () => {
// //   if (currenttPage <= 1) return;
// //   currenttPage--;
// //   readFilms();
// // });
// // nextBtn.addEventListener("click", () => {
// //   if (currenttPage >= countPage) return;
// //   currenttPage++;
// //   readFilms();
// // });

// // ! ==================== EDIT =================
// const editModal = document.querySelector(".editModal");
// const editphotoFilmInp = document.querySelector("#editphotoFilm");
// const editfilmNameInp = document.querySelector("#editfilmName");
// const editfilmDirectorInp = document.querySelector("#editfilmDirector");
// const editfilmGenreInp = document.querySelector("#editfilmGenre");
// const editfilmYearInp = document.querySelector("#editfilmYear");
// const btnEditSave = document.querySelector("#btnEditSave");

// document.addEventListener("click", (e) => {
//   let edit_class = [...e.target.classList];
//   let id = e.target.id;
//   if (edit_class.includes("btnEdit")) {
//     fetch(`${API}/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         editphotoFilmInp.value = data.photoFilm;
//         editfilmNameInp.value = data.filmName;
//         editfilmDirectorInp.value = data.filmDirector;
//         editfilmGenreInp.value = data.filmGenre;
//         editfilmYearInp.value = data.filmYear;
//         btnEditSave.setAttribute("data-id", data.id);
//       });
//   }
// });

// btnEditSave.addEventListener("click", async () => {
//   if (
//     !editphotoFilmInp.value.trim() ||
//     !editfilmNameInp.value.trim() ||
//     !editfilmDirectorInp.value.trim() ||
//     !editfilmGenreInp.value.trim() ||
//     !editfilmYearInp.value.trim()
//   ) {
//     alert("Введите данные!");
//     return;
//   }

//   let id = btnEditSave.getAttribute("data-id");
//   let editedFilm = {
//     photoFilm: editphotoFilmInp.value,
//     filmName: editfilmNameInp.value,
//     filmDirector: editfilmDirectorInp.value,
//     filmGenre: editfilmGenreInp.value,
//     filmYear: editfilmYearInp.value,
//   };

//   await editedFilmFunction(editedFilm, id);
//   readFilms();
// });

// async function editedFilmFunction(film, id) {
//   await fetch(`${API}/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(film),
//   });
//   readFilms(); // чтобы автоматически читалось (появлялось) на странице ,then дает ответ на вызов функции
// }
