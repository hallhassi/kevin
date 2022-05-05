const fs = require('fs');
const sharp = require('sharp');
const Jimp = require('jimp');
fs.promises.readdir('./')
  .then(filenames => {
    for (let filename of filenames) {
      if (/\.js/.test(filename)) {}
      else {
        // Jimp.read(filename, (err, file) => {
        //   if (err) throw err;
        //   file
        //     .write(`${filename}.jpg`); // save
        // });
        sharp(filename)
        .rotate(270)
        .toFile(`${filename}-rotated.jpg`, function(err) {
        });
      }
    }
  });
  