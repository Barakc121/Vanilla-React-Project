

const story = document.getElementById("stories");

function createcard(author, title, par, img) {
  const section = document.createElement("section");
  section.author = author;
  section.title = title;
  section.par = par;
  section.img = img;
  return section;
}













