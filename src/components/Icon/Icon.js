const RotateIcon = function (options) {
  this.options = options || {};
  this.rImg = options.img || new Image();
  this.rImg.src = this.rImg.src || this.options.url || '';
  this.options.width = this.options.width || this.rImg.width || 52;
  this.options.height = this.options.height || this.rImg.height || 60;
  const canvas = document.createElement('canvas');
  canvas.width = this.options.width;
  canvas.height = this.options.height;
  this.context = canvas.getContext('2d');
  this.canvas = canvas;
};
RotateIcon.makeIcon = function (url) {
  return new RotateIcon({ url });
};
RotateIcon.prototype.setRotation = function (options) {
  const canvas = this.context;
  const angle = options.deg ? (options.deg * Math.PI) / 180 : options.rad;
  const centerX = this.options.width / 2;
  const centerY = this.options.height / 2;

  canvas.clearRect(0, 0, this.options.width, this.options.height);
  canvas.save();
  canvas.translate(centerX, centerY);
  canvas.rotate(angle);
  canvas.translate(-centerX, -centerY);
  canvas.drawImage(this.rImg, 0, 0);
  canvas.restore();
  return this;
};
RotateIcon.prototype.getUrl = function () {
  return this.canvas.toDataURL('image/png');
};

export default RotateIcon;
