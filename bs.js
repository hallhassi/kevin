const bs = () => {
    const paintings = require('./paintings.json');
    const bio = require('./bio.json');
    const { writeFileSync } = require("fs");
    const pad3 = (number) => number.toString().padStart(3, '0');
    const pad0 = (number) => number.toString();
    const artist = 'Kevin Larmee';
    const artistSlug = artist.replace(/ /,'').toLowerCase();
    function prevNext(count, limit, pad) {
        if (count !== 1) {
            prev = pad(count-1);    
            prevString = `window.open('` + prev + `.html', '_self');`;
            prevA = headerA(prev, prev, 'prev');
        } else prev = prevString = prevA = '';
        if (count != limit) {
            next = pad(count+1);
            nextString = `window.open('` + next + `.html', '_self');`;
            nextA = headerA(next, next, 'next');
        } else next = nextString = nextA = '';
    }
    function prevNextIndex(count, limit, pad) {
        if (count == 2) {
            prevString = `window.open('` + 'index' + `.html', '_self');`;
            prevA = headerA('index', '1', 'prev');            
        } else if (count !== 1) {
            prev = pad(count-1);    
            prevString = `window.open('` + prev + `.html', '_self');`;
            prevA = headerA(prevUrl, prevText, 'prev');
        } else prev = prevString = prevA = '';
        if (count != limit) {
            next = pad(count+1);
            nextString = `window.open('` + next + `.html', '_self');`;
            nextA = headerA(next, next, 'next');
        } else next = nextString = nextA = '';
    }

    function headerA (url, text = url, id='', anchor='') {
        return `
        <span id='` + id + `'>
        <a href='` + url + `.html'` + anchor +`>` + text + `</a>
        </span>`;
    }
    function build(url, header, main, script='', id=url) {
        writeFileSync(url + ".html", `
        <!DOCTYPE html><html><head><title>` + url + `</title>
        <!--?xml version='1.0' standalone='no'?-->
        <!--?xml-stylesheet type='text/css' href='style.css'?-->
        <link href='style.css' rel='stylesheet'>
        <meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'>
        <meta name='viewport' content='width=device-width, initial-scale=1'></head>
        <body><header>` + header + `</header><main id='` + id + `'>` +main + `</main>` +script + `</body></html>`
        );
    }
    let infoMain ='';
    let indexLimit = paintings.length;
    let paintingCount = 0;
    for (let i = 0; i < indexLimit; i++) {
        let paintingLimit = paintings[i].paintings.length;
        let indexCount = i +1;
        infoMain += `<ol class='info' id='a` + indexCount + `'>`;
        let indexMain = '';
        for (let p = 0; p < paintingLimit; p++) {
            paintingCount += 1;
            infoMain += `<li class='info' id='a` + pad3(paintingCount) + `'><span>` +
            pad3(paintingCount) + ` ` + paintings[i].paintings[p].title + `, </span><span>` +
            paintings[i].paintings[p].medium + `, </span><span>` + 
            paintings[i].paintings[p].dimensions + `</span></li>`;
            prevNext(paintingCount, paintingLimit, pad3);
            let paintingUrl = pad3(paintingCount);
            let paintingHeader = headerA('index', artist) + headerA('bio') + prevA + headerA('info', 'info', '', '#a' + paintingCount) + nextA;
            let paintingMain = `<a class='painting' href='` + pad3(paintingCount) + artistSlug + `.jpg'><img class='painting' src='` + pad3(paintingCount) + artistSlug + `.jpg'></a>`;
            let paintingScript = script();
            build(paintingUrl, paintingHeader, paintingMain, paintingScript, 'painting');            
            indexMain += `<a class='index' href='` + pad3(paintingCount) + `.html'>` + pad3(paintingCount) + `<img class='index' src='small/` + pad3(paintingCount) + artistSlug + `.jpg'></a>`;
        }
        infoMain += '</ol>';
        prevNextIndex(indexCount, indexLimit, pad0);
        indexUrl = indexCount == 1 ? 'index' : pad0(indexCount);
        let indexHeader = `<span id='index'>` + artist + `</span>` + headerA('bio') + prevA + headerA('info', 'info', '', '#a' + indexCount) + nextA;
        let indexScript = script();
        build(indexUrl, indexHeader, indexMain, indexScript, 'index');            
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
    let contactHeader = headerA('index',  artist) + `<span>contact</span>` + headerA('bio') + headerA('info');
    build('info', infoHeader, infoMain);            
    build('bio', bioHeader, bioMain);            
    build('contact', contactHeader, `<h2><a href='mailto:kevinlarmee@hotmail.com'>kevinlarmee@hotmail.com</a></h2>`);            
    function script() {
    let loadImages = next ? `let img = document.createElement('img'); 
    img.src = '` + next + artistSlug + `.jpg';` : '';
    loadImages = prev ? `let img2 = document.createElement('img'); 
    img2.src = '` + prev + artistSlug + `.jpg';` : '';
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
}
exports.bs = bs();