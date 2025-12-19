// timer.js

export function startTimer() {
  const textEl = document.querySelector('#timerText');

    //一度だけ初期化
   if (window.shot_time === undefined) {
    window.shot_time = 63; // 基本時間
    window.time = 60;
    window.shoting = false;
  }


  textEl.setAttribute("text", `value: ${time}`);

  const interval = setInterval(() => {
    time -= 1;
    textEl.setAttribute("text", `value: ${time}`);

    if (time <= 0 && shoting === false) {
      //clearInterval(interval);
      disableWASD();
      time = window.shot_time;
      shoting = true;
    } else if(time <= 0 && shoting === true){
      disableAll();
      clearInterval(interval);
    }
  }, 1000);
}

function disableWASD(){
  rig.setAttribute('position', { x: 100, y: 50, z: 100 });
  rig.emit('arrival');
  document.querySelector('#rig').removeAttribute('movement-control');
}

function disableAll(){
  document.querySelector('#camera').removeAttribute('look-controls');
  window.canShoot = false;
}