const fs = require('fs');

async function listFiles(dir, prefix_dir, prefix_file) {
  let output = '';
  const files = await fs.promises.readdir(dir);
  for (const file of files) {
    const path = `${dir}/${file}`;
    const stats = await fs.promises.stat(path);
    if (stats.isDirectory()) {
      output += `${prefix_dir} ${file}\n`;
      output += await listFiles(path, `  ${prefix_dir}`, `  ${prefix_file}`);
    } else {
      output += `${prefix_file} ${file}\n`;
    }
  }
  return output;
}

async function dayiShowFileTree() {
  return await listFiles('../upload', '📁', '📄');
}



exports.dayiShowFileTree = dayiShowFileTree;
