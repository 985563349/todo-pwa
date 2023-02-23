class Stats {
  constructor() {
    this.domElement = document.createElement('span');
    this.update();
  }

  update() {
    const online = navigator.onLine;
    this.domElement.style.color = online ? 'green' : 'red';
    this.domElement.innerHTML = online ? 'on-line' : 'off-line';
  }
}
