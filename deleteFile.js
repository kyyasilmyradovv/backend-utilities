const fs = require('fs').promises;

exports.deleteFile = async (filename) => {
  if (filename?.length) {
    try {
      await fs.access(filename, fs.constants.F_OK);
      fs.unlink(filename);
    } catch (err) {}
  }
};
