AFRAME.registerComponent('shoot-countdown', {
  schema: {
    time: { type: 'number', default: 3 }   // 秒数
  },

  init: function () {
    // カウントダウン用のテキストを作成（カメラの子に追加）
    this.textEl = document.createElement('a-text');
    this.textEl.setAttribute('value', '');
    this.textEl.setAttribute('shader', 'msdf');      // msdfシェーダー指定
    this.textEl.setAttribute('color', '#ff00eaff');
    this.textEl.setAttribute('align', 'center');
    this.textEl.setAttribute('position', '0 0 -1'); // カメラ前方
    this.textEl.setAttribute('width', '2');
    this.el.appendChild(this.textEl);

    // arrival イベントを待つ
    const rig = document.querySelector('#rig');
    if (rig) {
      rig.addEventListener('arrival', () => {
        this.startCountdown();
      });
    }
  },

  startCountdown: function () {
    let timeLeft = this.data.time;
    this.textEl.setAttribute('value', timeLeft);

    const interval = setInterval(() => {
      timeLeft--;

      if (timeLeft <= 0) {
        this.textEl.setAttribute('value', 'START!');
        clearInterval(interval);

        // 少し後にテキストを消す
        setTimeout(() => {
          if (this.textEl.parentNode) {
            this.textEl.parentNode.removeChild(this.textEl);
          }
        }, 1000);

        // ターゲット生成
        const spawner = document.querySelector('#targetSpawner');
        if (spawner && spawner.components['target-spawner']) {
          spawner.components['target-spawner'].spawnTargets();
        }

      } else {
        this.textEl.setAttribute('value', timeLeft);
      }

    }, 1000);
  }
});
