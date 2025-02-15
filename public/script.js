document.addEventListener("DOMContentLoaded", function () {
    const floorSelect = document.getElementById("floor-select");
    const floorMap = document.getElementById("floor-map");

    // 초기 1층 표시
    floorMap.data = "static/svg/floor1.svg";

    // 층 변경 이벤트
    floorSelect.addEventListener("change", (event) => {
        const selectedFloor = event.target.value;
        floorMap.data = `static/svg/floor${selectedFloor}.svg`;  // 선택한 층의 SVG 삽입
    });
});
