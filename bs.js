const bs = () => {
const paintings = require('./paintings.json');
const bio = require('./bio.json');
const sharp = require('sharp');
sharp('091kevinlarmee.jpg').resize(400,200, {fit: 'fill'}).toFile('./small/091kevinlarmee.jpg')
const { writeFileSync } = require("fs");
const sizeOf = require('image-size')
const pad3 = (number) => number.toString().padStart(3, '0');
const pad0 = (number) => number.toString();
const artist = 'Kevin Larmee';
const artistSlug = artist.replace(/ /, '').toLowerCase();
function build(url, header, main, script = '', className = url) {
 writeFileSync(url + ".html", `
 <!DOCTYPE html><html><head><title>` + url + `</title>
 <!--?xml version='1.0' standalone='no'?-->
 <!--?xml-stylesheet type='text/css' href='style.css'?-->
 <link href='style.css' rel='stylesheet'>
 <meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'>
 <meta name='viewport' content='width=device-width, initial-scale=1'></head>
 <body class='` + className + `'><header>` + header + `</header><main id='` + ratioId + `' class='` + className + `'>` + main + `</main>` + script + `</body></html>`
 );
}
function headerA(url, text = url, id = '', anchor = '') {
 return `
 <span id='` + id + `'>
 <a href='` + url + `.html'` + anchor + `>` + text + `</a>
 </span>`;
}
function prevNext(count, limit) {
 if (count !== 1) {
  prev = pad3(count - 1);
  prevString = `window.open('` + prev + `.html', '_self');`;
  prevA = headerA(prev, prev, 'prev');
 } else prev = prevString = prevA = '';
 if (count != limit) {
  next = pad3(count + 1);
  nextString = `window.open('` + next + `.html', '_self');`;
  nextA = headerA(next, next, 'next');
 } else next = nextString = nextA = '';
}
let infoMain = '';
let indexLimit = paintings.length;
let paintingCountInt = 0;
for (let i = 0; i < indexLimit; i++) {
 let paintingLimit = paintings[i].paintings.length;
 let indexCount = i + 1;
 infoMain += `<ol class='info' id='a` + indexCount + `'>`;
 let indexMain = '';
 for (let p = 0; p < paintingLimit; p++) {
  paintingCountInt += 1;
  paintingCountString = pad3(paintingCountInt);
  infoMain += `<li class='info' id='a` + paintingCountString + `'><span>` + paintingCountString + ` ` + paintings[i].paintings[p].title + `, </span><span>` + paintings[i].paintings[p].medium + `, </span><span>` + paintings[i].paintings[p].dimensions + `</span></li>`;
  prevNext(paintingCountInt, paintingLimit);
  paintingImg = paintingCountString + artistSlug + '.jpg'
  const dimensions = sizeOf(paintingImg)
  let ratio = dimensions.width / dimensions.height;
  if (ratio < 3/4) ratioId = 'skinny';
  else ratioId = '';
  let paintingHeader = headerA('index', artist) + prevA + headerA('info', 'info', '', '#a' + paintingCountString) + nextA;
  let paintingMain = `<a class='painting' href='` + paintingImg + `'><img style='aspect-ratio: ` + ratio + `;' class='painting' src='` + paintingImg + `'></a>`;
  build(paintingCountString, paintingHeader, paintingMain, paintingScript(), 'painting');
  indexMain += `<a class='index' href='` + paintingCountString + `.html'>` + paintingCountString + `<img style='aspect-ratio: ` + ratio + `;' class='index' src='small/` + paintingImg + `'></a>`;
 }
 infoMain += '</ol>';
 indexUrl = indexCount == 1 ? 'index' : 'index' + pad0(indexCount);
 let indexHeader = `<span id='index'>` + artist + `</span>` + (indexCount == 1 ? '' : headerA((i == 1 ? `index` : `index` + (indexCount - 1)), pad3(paintingCountInt + 1 - paintings[i].paintings.length - paintings[i-1].paintings.length), 'prev')) + headerA('info', 'info', '', '#a' + indexCount + `.html`) + (indexCount == indexLimit ? '' : headerA(`index` + (indexCount + 1), pad3(paintingCountInt + 1), 'next'));
 build(indexUrl, indexHeader, indexMain, IndexScript(), 'index');
}
let bioMain = '';
for (let section of bio) {
 const h2 = section.h2;
 const lis = section.lis;
 let bioId = h2.split(' ')[0].toLowerCase();
 let bioClass = lis[0].year == undefined ? '' : `class='year'`;
 bioMain += `
       <h2>` + h2 + `</h2>
       <ol ` + bioClass + `id='` + bioId + `'><li></li>`;
 for (let li of lis) {
  const entry = li.entry;
  const year = li.year ? li.year : '';
  bioMain += `<li ` + bioClass + `>` + year + entry + `</li>`;
 }
 bioMain += `</ol>`;
}
let infoHeader = headerA('index', artist) + headerA('contact') + headerA('bio') + `<span>info</span>`;
let bioHeader = headerA('index', artist) + headerA('contact') + `<span>bio</span>` + headerA('info');
let contactHeader = headerA('index', artist) + `<span>contact</span>` + headerA('bio') + headerA('info');
build('info', infoHeader, infoMain);
build('bio', bioHeader, bioMain);
build('contact', contactHeader, `<h2><a href='mailto:kevinlarmee@hotmail.com'>kevinlarmee@hotmail.com</a></h2>`);





function paintingScript() {
 let loadImages = next ? `let imgNext = document.createElement('img'); 
 imgNext.src = '` + next + artistSlug + `.jpg';` : '';
 loadImages = prev ? `let imgPrev = document.createElement('img'); 
 imgPrev.src = '` + prev + artistSlug + `.jpg';` : '';
 return `
 <script>
 
 window.onload = function () { 
 const map = {};
 onkeydown = onkeyup = function(event) {
  map[event.key] = event.type == 'keydown';
 };
 document.body.onkeydown = function(event){
  if (event.key == 'ArrowLeft' && !map['Alt'] && !map['Meta']) {
   ` + prevString + `
  } else if (event.key == 'ArrowRight' && !map['Alt'] && !map['Meta']) {
   ` + nextString + `
  }
 };
 ` + loadImages + `
};
</script>`
}
function IndexScript() {
 return `<script>
 </script>`
}
}
exports.bs = bs();