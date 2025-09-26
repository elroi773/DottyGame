let currentCard = Math.floor(Math.random() * 7) + 1; // 처음부터 랜덤
const totalCards = 7;
let isAnimating = false;

// 파티클 생성
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 3 + "s";
    particle.style.animationDuration = 2 + Math.random() * 2 + "s";
    particlesContainer.appendChild(particle);
  }
}

// 랜덤 카드 선택 (현재 카드와 다른 카드)
function getRandomCard() {
  let newCard;
  do {
    newCard = Math.floor(Math.random() * totalCards) + 1;
  } while (newCard === currentCard);
  return newCard;
}

// 카드 색상 변경
function getCardColor(cardNumber) {
  const colors = [
    "linear-gradient(45deg, #ff9a9e, #fecfef)",
    "linear-gradient(45deg, #a8edea, #fed6e3)",
    "linear-gradient(45deg, #ffecd2, #fcb69f)",
    "linear-gradient(45deg, #a8c8ec, #fbc2eb)",
    "linear-gradient(45deg, #96fbc4, #f9f586)",
    "linear-gradient(45deg, #ffeaa7, #fab1a0)",
    "linear-gradient(45deg, #74b9ff, #0984e3)",
  ];
  return colors[cardNumber - 1];
}

// 다음 카드로 변경
function nextCard() {
  if (isAnimating) return;

  isAnimating = true;
  const photocard = document.getElementById("photocard");
  const cardImage = document.getElementById("cardImage");
  const cardTitle = document.getElementById("cardTitle");
  const cardImg = document.getElementById("cardImg");

  // 현재 카드 페이드아웃
  photocard.classList.add("exit");

  setTimeout(() => {
    // 새로운 랜덤 카드 선택
    currentCard = getRandomCard();

    // 카드 내용 업데이트
    cardImg.src = `./photocards/${currentCard}.png`;
    cardImg.alt = `포토카드 ${currentCard}`;
    cardImage.style.background = getCardColor(currentCard);
    cardTitle.textContent = `포토카드 #${currentCard}`;

    // 카드 다시 표시
    photocard.classList.remove("exit");
    photocard.classList.add("active");

    isAnimating = false;
  }, 400);
}

// 자동 카드 변경 (5초마다)
function autoChangeCard() {
  if (!isAnimating) {
    nextCard();
  }
}

// 초기 카드 설정
function initializeCard() {
  const cardImage = document.getElementById("cardImage");
  const cardTitle = document.getElementById("cardTitle");
  const cardImg = document.getElementById("cardImg");

  cardImg.src = `./photocard/${currentCard}.png`;
  cardImg.alt = `포토카드 ${currentCard}`;
  cardImage.style.background = getCardColor(currentCard);
  cardTitle.textContent = `출생신고서`;
}

// 초기화
createParticles();
initializeCard(); // 초기 카드 설정

// 키보드 이벤트 (스페이스바로 다음 카드)
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    nextCard();
  }
});

// 초기화
createParticles();
initializeCard(); // 초기 카드 설정

// 오디오 설정
const bgAudio = new Audio("./audio/why.mp3");
bgAudio.loop = true;

// 버튼 클릭 시 음악 재생
document.getElementById("playButton").addEventListener("click", () => {
  bgAudio.play();
});
