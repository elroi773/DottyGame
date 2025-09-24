const img = document.getElementById('hoverImg');
const audio = document.getElementById('hoverSound');

/* 재생 시도 (loop = true) */
async function startLoopingSound() {
  try {
    audio.loop = true;        // hover 동안 계속 반복
    audio.currentTime = 0;    // 항상 처음부터
    await audio.play();
    img.classList.add('hovering'); // CSS 확대 클래스 추가
  } catch (err) {
    // 자동 재생 차단 등 에러 처리: 콘솔에 표시. 아래 문서 클릭 unlock 핸들러가 있음.
    console.warn('Audio play blocked or failed:', err);
  }
}

/* 중지 (루프 끄고 멈추고 처음으로) */
function stopLoopingSound() {
  audio.loop = false;
  audio.pause();
  audio.currentTime = 0;
  img.classList.remove('hovering');
}

/* 포인터 이벤트(데스크탑/펜 포함) */
img.addEventListener('pointerenter', startLoopingSound);
img.addEventListener('pointerleave', stopLoopingSound);

/* 모바일/터치 보완: 터치 시작시 재생, 터치 끝나면 중지 */
img.addEventListener('touchstart', function (e) {
  // touchstart가 스크롤을 방해하지 않게 passive:false 옵션을 사용하려면 addEventListener 마지막 인자에 { passive:false } 필요.
  // 여기서는 이미지에 대한 간단한 제어만 하므로 preventDefault는 하지 않음(사용자 경험 고려).
  startLoopingSound();
}, { passive: true });

img.addEventListener('touchend', stopLoopingSound, { passive: true });

/* ---------- 자동 재생 차단(권한 문제) 대비: 
   많은 브라우저는 "사용자 인터랙션"이 있어야 오디오를 재생 허용. 
   그래서 문서의 첫 번째 클릭 시 오디오를 잠깐 재생/일시정지해서 재생 권한을 확보합니다. ---------- */
function unlockAudioOnFirstInteraction() {
  const handler = async () => {
    try {
      // 재생 권한 확보용: 재생 -> 바로 일시정지
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      console.log('오디오 재생 권한 확보됨.');
    } catch (e) {
      console.warn('첫 상호작용에서 오디오 권한 확보 실패:', e);
    }
    document.removeEventListener('click', handler);
  };
  document.addEventListener('click', handler, { once: true });
}
unlockAudioOnFirstInteraction();

const hoverSound = document.getElementById("hoverSound");
const leaveSound = document.getElementById("leaveSound");

img.addEventListener("mouseenter", () => {
  // hover.mp3 재생
  hoverSound.currentTime = 0;
  hoverSound.play();
  img.classList.add("hovering");
});

img.addEventListener("mouseleave", () => {
  // leave.mp3 재생
  leaveSound.currentTime = 0;
  leaveSound.play();
  img.classList.remove("hovering");
});