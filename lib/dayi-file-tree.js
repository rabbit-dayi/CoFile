const dirTree = require('dir-tree-creator')
const dayi_config = require('./dayi-config')
 

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

async function dayi_show_file_tree() {
  return await listFiles(dayi_config.upload_root_path, '📁', '📄');
}




exports.dayi_show_file_tree=dayi_show_file_tree