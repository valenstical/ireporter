import Random from 'random-int';

class File {
  constructor(file) {
    this.file = file;
    this.type = file.mimetype;
    this.name = file.name;
    this.path = null;
    this.size = null;
    this.tmpName = Random(100000000, 999999999);
  }

  getExtension() {
    const extension = this.name.split('.');
    return extension[extension.length - 1].toLowerCase();
  }

  getName() {
    return `${this.tmpName}.${this.getExtension()}`;
  }

  isImage() {
    const formats = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    return formats.indexOf(this.type.toLowerCase()) >= 0;
  }

  isVideo() {
    return this.type.toLowerCase() === 'video/mp4';
  }

  getPath(directory) {
    const subDirectory = this.isVideo() ? 'videos' : 'images';
    this.path = `${subDirectory}/${directory}/${this.getName()}`;
    return this.path;
  }

  moveUploadedFile(directory, error, success) {
    const fileName = this.getPath(directory);
    this.file.mv(`./app/uploads/${fileName}`, (err) => {
      if (err) {
        error(err);
      } else {
        success(fileName);
      }
    });
  }
}

export default File;
