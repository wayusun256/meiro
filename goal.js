AFRAME.registerComponent('arrival-check', {
  schema: {
    destination: {type: 'vec3'},
    onarrival:   {type: 'vec3'}
  },

  tick: function () {
    const rig = document.querySelector('#rig');
    if (!rig) return;

    const pos  = rig.object3D.position;
    const dest = this.data.destination;
    const threshold = 1.0;

    if (Math.abs(pos.x - dest.x) < threshold &&
        Math.abs(pos.y - dest.y) < threshold &&
        Math.abs(pos.z - dest.z) < threshold) {

      // ★ ワープ
      rig.object3D.position.set(
        this.data.onarrival.x,
        this.data.onarrival.y,
        this.data.onarrival.z
      );

      rig.emit('arrival');

      this.el.removeAttribute('arrival-check');
    }
  }
});
