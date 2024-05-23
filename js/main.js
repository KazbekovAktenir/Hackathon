document.getElementById("burger-btn").addEventListener("click", function () {
  var menu = document.getElementById("burger-menu");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
});
