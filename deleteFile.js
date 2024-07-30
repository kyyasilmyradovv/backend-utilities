// This function will delete a file with provided filename(destination)
const fs = require('fs').promises;

exports.deleteFile = async (filename) => {
  if (filename?.length) {
    try {
      // Check if file exists
      await fs.access(filename, fs.constants.F_OK);

      // Delete if file exists
      fs.unlink(filename);
    } catch (err) {}
  }
};
