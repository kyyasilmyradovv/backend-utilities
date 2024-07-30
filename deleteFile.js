// This function will check if the provided file exists and deletes if exists
const fs = require('fs').promises;

exports.deleteFile = async (filename) => {
  if (filename?.length) {
    try {
      // Check if file exists
      await fs.access(filename, fs.constants.F_OK);

      // Delete if file exists
      fs.unlink(filename);
    } catch (err) {
      // Do whatever you want when error occured.
      console.log(err);
    }
  }
};
