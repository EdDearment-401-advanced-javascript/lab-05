'use strict';

const fs = require('fs');

const fileType = 0;
const fileSize= 2;
const pixelProperty = 10;
const width = 18;
const height = 22;
const bytesPerPixel = 28;
const color = 54;
//Fun with colors and things!
let randomValue = Math.floor(Math.random() * 256);

/**
 * Bitmap -- receives a file name, used in the transformer to note the new buffer
 * @param filePath
 * @constructor
 */
function Bitmap(filePath) {
  this.file = filePath;
}

/**
 * Parser -- accepts a buffer and will parse through it, according to the specification, creating object properties for each segment of the file
 * @param buffer
 */
Bitmap.prototype.parse = function(buffer) {
  this.buffer = buffer;
  this.type = buffer.toString('utf-8', fileType, 2);
  this.size = buffer.readInt32LE(fileSize);
  this.pixel = buffer.readInt32LE(pixelProperty);
  this.width = buffer.readInt32LE(width);
  this.height = buffer.readInt32LE(height);
  this.bitesPpixal = buffer.readInt32LE(bytesPerPixel);
  this.color = buffer.readInt32LE(color);
};

/**
 * Transform a bitmap using some set of rules. The operation points to some function, which will operate on a bitmap instance
 * @param operation
 */
Bitmap.prototype.transform = function(operation) {
  // This is really assumptive and unsafe
  transforms[operation](this);
  this.newFile = this.file.replace(/\.bmp/, `.${operation}.bmp`);
};

/**
 * Sample Transformer (greyscale)
 * Would be called by Bitmap.transform('greyscale')
 * Pro Tip: Use "pass by reference" to alter the bitmap's buffer in place so you don't have to pass it around ...
 * @param bmp
 */
const transformGreyscale = (bmp) => {

  console.log('Transforming bitmap into greyscale', bmp);

  //TODO: Figure out a way to validate that the bmp instance is actually valid before trying to transform it
  console.log('This is the file' , bmp);
  //TODO: alter bmp to make the image greyscale ...
  for (let i =0 ; i < bmp.color.length; i +=4){
    let grey = (bmp.color[i] + bmp.color[i+1] + bmp.color[i+2]);
    bmp.color[i] = grey;
    bmp.color[i+1] = grey;
    bmp.color[i+2] = grey;
  }
};

const doTheInversion = (bmp) => {
  bmp = {};
  for (let i = 0; i < bmp.color.length; i+=4 ){
    bmp.color[i] = bmp.color[i+1];
    bmp.color[i+1] = bmp.color[i+2];
    bmp.color[i+2] = bmp.color[i];
  }
};

/**
 * A dictionary of transformations
 * Each property represents a transformation that someone could enter on the command line and then a function that would be called on the bitmap to do this job
 */
const transforms = {
  greyscale: transformGreyscale,
  invert: doTheInversion,
};

// ------------------ GET TO WORK ------------------- //

function transformWithCallbacks() {

  fs.readFile(file, (err, buffer) => {

    if (err) {
      throw err;
    }

    bitmap.parse(buffer);

    bitmap.transform(operation);

    // Note that this has to be nested!
    // Also, it uses the bitmap's instance properties for the name and thew new buffer
    fs.writeFile(bitmap.newFile, bitmap.buffer, (err, out) => {
      if (err) {
        throw err;
      }
      console.log(`Bitmap Transformed: ${bitmap.newFile}`);
    });

  });
}

// TODO: Explain how this works (in your README)
const [file, operation] = process.argv.slice(2);

let bitmap = new Bitmap(file);

transformWithCallbacks();
