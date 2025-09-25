/* ---------- hover 이미지 + 사운드 제어 ---------- */
const img = document.getElementById('hoverImg');
const audio = document.getElementById('hoverSound');
const hoverSound = document.getElementById("hoverSound");
const leaveSound = document.getElementById("leaveSound");

/* hoverImg가 있는 경우에만 실행 */
if (img) {
  /* 재생 시도 (loop = true) */
  async function startLoopingSound() {
    try {
      audio.loop = true;        // hover 동안 계속 반복
      audio.currentTime = 0;    // 항상 처음부터
      await audio.play();
      img.classList.add('hovering'); // CSS 확대 클래스 추가
    } catch (err) {
      // 자동 재생 차단 등 에러 처리
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

  /* 모바일/터치 보완 */
  img.addEventListener('touchstart', () => {
    startLoopingSound();
  }, { passive: true });

  img.addEventListener('touchend', stopLoopingSound, { passive: true });

  /* ---------- 자동 재생 차단(권한 문제) 대비 ---------- */
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

  /* hover/leave 전용 효과 */
  img.addEventListener("mouseenter", () => {
    if (hoverSound) {
      hoverSound.currentTime = 0;
      hoverSound.play();
    }
    img.classList.add("hovering");
  });

  img.addEventListener("mouseleave", () => {
    if (leaveSound) {
      leaveSound.currentTime = 0;
      leaveSound.play();
    }
    img.classList.remove("hovering");
  });
}

/* ---------- 공통으로 실행될 코드 (예: BGM 자동 재생) ---------- */
const bgm = document.getElementById('bgm');
if (bgm) {
  // 첫 사용자 클릭 시 배경음악 실행 허용
  document.addEventListener("click", async () => {
    try {
      await bgm.play();
      console.log("배경음악 시작됨");
    } catch (err) {
      console.warn("BGM 재생 실패:", err);
    }
  }, { once: true });
}
