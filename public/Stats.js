class Stats {
  constructor() {
    this.domElement = document.createElement('span');
    this.domElement.classList.add('network-status');
    this.online = false;
    this.update();
  }

  update() {
    const online = this.online = navigator.onLine;
    this.domElement.classList.toggle('online', online);
    this.domElement.classList.toggle('offline', !online);
    this.domElement.innerHTML = online ? 'on-line' : 'off-line';
  }
}
