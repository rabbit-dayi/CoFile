const fs = require('fs');

async function deleteEmptyDirectories(dir) {
  try {
    const directoryContents = await fs.promises.readdir(dir);
    for (const item of directoryContents) {
      const itemPath = `${dir}/${item}`;
      const itemStats = await fs.promises.stat(itemPath);
      if (itemStats.isDirectory()) {
        await deleteEmptyDirectories(itemPath);
        const itemContents = await fs.promises.readdir(itemPath);
        if (itemContents.length === 0) {
          await fs.promises.rmdir(itemPath);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}


exports.deleteEmptyDirectories = deleteEmptyDirectories

