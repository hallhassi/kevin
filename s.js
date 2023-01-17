function hide(x) {
 x.hidden = true;
 x.classList.add('hide');
}
function show(x) {
 x.hidden = false;
 x.classList.remove('hide');
}
//
// nav 
//
let nav = document.createElement('nav');
let h1 = document.createElement('h1');
h1.append('Kevin Larmee');
let buttonTypes = ['cv', 'info', 'prev', 'next', 'back']
function newButton(x) {
 let text = document.createTextNode(x);
 let button = document.createElement('button');
 button.appendChild(text);
 button.id = x;
 hide(button)
 nav.append(button);
}
//
// buttons
//
for(let buttonType of buttonTypes) {
 newButton(buttonType);
}
document.body.append(h1);
document.body.append(nav);
let prev = document.getElementById('prev');
let next = document.getElementById('next');
let cvB = document.getElementById('cv');
let info = document.getElementById('info');
show(cvB);
show(info);
if (indexLimit > 0) show(next);
//
// cv
//
let cv = document.createElement('div');
for (let section of importCv) {
 let h2 = document.createElement('h2');
 let ol = document.createElement('ol');
 h2.append(section.h2);
 ol.id = section.h2.split(' ')[0].toLowerCase();
 if (section.lis[0].year !== undefined) {
  ol.classList.add('year');
 }
 section.lis.forEach(sectionLi => {
  const entry = sectionLi.entry;
  const year = sectionLi.year ? sectionLi.year : '';
  let li = document.createElement('li');
  li.append(year + entry);
  if (section.lis[0].year !== undefined) {
   li.classList.add('year');
  }
  ol.append(li);
 })
 cv.append(h2, ol);
};
let contact = document.createElement('button');
contact.append('contact')
cv.append(contact);
hide(cv);
document.body.append(cv);
//
// mains
//
let pCount = 0;
let iCount = 0;
for (let i = 0; i < importArray.length; i++) {
 let main = document.createElement('main');
 for (let j = 0; j < importArray[i].paintings.length; j++) {
  let button = document.createElement('button');
  let ol = document.createElement("ol");
  let count = 0;
  for (let key in importArray[i].paintings[j]) {
   if (key == 'ratio') {
    break;
   }
   let li = document.createElement("li");
   if (count < 3) li.append(importArray[i].paintings[j][key]);
   ol.append(li);
   count += 1;
  }
  let ratio = importArray[i].paintings[j]['ratio'].toPrecision(5);
  ol.style.paddingBottom = ratio * 100 + '%';
  hide(ol);
  const img = document.createElement("img");
  img.src = `small/${(pCount + 1).toString().padStart(3, '0')}kevinlarmee.jpg`;
  button.append(j, img, ol);  
  button.id = `a${j}`;
  main.append(button);
  pCount += 1;
 }
 if (i !== 0) hide(main);
 document.body.appendChild(main);
}
//
// events
//
let infoValue = 0;
const cvDiv = document.querySelectorAll('body>div')[0];
const img = document.querySelectorAll('img');
let mains = document.querySelectorAll('main');
let mainButtons = document.querySelectorAll('main>button');
let cur = 0;
document.body.addEventListener('click', e => {
 const ol = document.querySelectorAll('button>ol');
 if (e.target == info) {
  if (infoValue === 0) {
   img.forEach(a => hide(a))
   ol.forEach(a => show(a))
   infoValue = 1;
  } else {
   img.forEach(a => show(a))
   ol.forEach(a => hide(a))
   infoValue = 0;
  } 
 } else if (e.target == next) {
  hide(mains[cur]);
  show(mains[cur + 1]);
  show(prev);
  cur += 1;
  if (cur == indexLimit - 1) {
   hide(next);
  }
 } else if (e.target == prev) {
  hide(mains[cur]);
  show(mains[cur - 1]);
  show(next);
  cur -= 1;
  if (cur == 0) {
   hide(prev);
  }
 } else if (e.target == cvB) {
  hide(mains[cur]);
  hide(cvB);
  hide(info);
  hide(prev);
  hide(next); 
  show(cvDiv);
  show(back)
 } else if (e.target == back) {
 show(mains[cur]);
 show(cvB);
 show(info);
 if (cur !== indexLimit - 1) {
  show(next);
 }
 if (cur !== 0) {
  show(prev);
 }
 hide(cvDiv);
 hide(back)
} else if (e.target == contact) {
 hide(contact);
 let contactA = document.createElement('a');
 contactA.append('kevinlarmee@hotmail.com');
 contactA.href = "mailto: kevinlarmee@hotmail.com";
 cvDiv.append(contactA);
}
});
mainButtons.forEach((el, i) => el.addEventListener('click', e => {
 mainButtons.forEach(j => {
  j.style.gridColumn = '';
 });
 var url = location.href;               //Save down the URL without hash.
 location.href = "#a" + i;                 //Go to the target element.
 history.replaceState(null,null,url);  
 //Don't like hashes. Changing it back. 
 if (e.currentTarget.querySelector('img').dataset.loaded !== 'true') {
  e.currentTarget.querySelector('img').src = e.currentTarget.querySelector('img').src.match(/(.*)(\/small\/)([\d]+kevinlarmee\.jpg)/)[3];
  e.currentTarget.querySelector('img').dataset.loaded = 'true';
 }
 if (el.dataset.toggle == 'on') {
  el.style.gridColumn = "auto";
  mainButtons[0].style.gridColumn = "1 / auto";
  mainButtons.querySelector(`[data-toggle='on']`).dataset.toggle = 'off'
  el.dataset.toggle = 'off'
  console.log('on')
 } else {
  el.style.gridColumn = "1 / span 3";
  let b;
  if ((i+1) % 3 == 0) b = 2; 
  else if ((i+1) % 3 == 1) b = 1;
  else if ((i+1) % 3 == 2) b = 3;
  if (el == mainButtons[0]) el.style.gridColumn = "1 / span 3";
  else  mainButtons[0].style.gridColumn = b;
  el.dataset.toggle = 'on';
  console.log('off')
  }
 }));
 // e.currentTarget.querySelector('img').src = e.currentTarget.querySelector('img').src.match(/(.*)(\/small\/)([\d]+kevinlarmee\.jpg)/)[3]
