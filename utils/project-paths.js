const path = require('path');

module.exports = {
  rootDir: path.dirname(process.mainModule.filename),
  public: path.join(path.dirname(process.mainModule.filename), 'public'),
  storage: path.join(path.dirname(process.mainModule.filename), 'storage'),
};
