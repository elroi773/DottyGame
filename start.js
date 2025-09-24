document.addEventListener("DOMContentLoaded", () => {
    const text = `21세기 저출산 시대... 많은 현대인들이 도티를 낳기를 열망하고 있다.
    그러나 아무나 도티를 가질 수는 없다.
    오직 펠리컨이 인정한 진정한 부모 자격자만이 도티를 낳을 기회를 얻게 된다.
    그 자격은 간단하다.
    진짜 도티와 가짜 도티를 구별할 수 있는 눈, 그리고 흔들리지 않는 믿음.
    당신은 과연 선택받아 도티를 품을 수 있을 것인가?`;
  
    const p = document.querySelector(".overlay p");
    const bgm = document.getElementById("bgm");
  
    p.innerHTML = ""; // 초기화
    let i = 0;
    let isBgmPlaying = false;
  
    function typing() {
      if (!isBgmPlaying) {
        bgm.play().catch(() => {
          // 자동재생이 막힐 경우 사용자가 클릭하면 시작되게 처리
          document.body.addEventListener("click", () => bgm.play(), { once: true });
        });
        isBgmPlaying = true;
      }
  
      if (i < text.length) {
        if (text[i] === "\n") {
          p.innerHTML += "<br>";
        } else {
          p.innerHTML += text[i];
        }
        i++;
        setTimeout(typing, 50); // 타이핑 속도
      }
    }
  
    typing();
  });