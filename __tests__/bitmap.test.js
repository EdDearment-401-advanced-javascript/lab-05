'use strict';

jest.mock('fs');

const reader = require('../../index.js');

describe('File Reader Module', () => {

  it('when given a bad file, returns an error', done => {
    let files = ['bad.txt'];
    reader(files, (err,data) => {
    expect(err).toBeDefined();
    done();
    });
  });
});