async function fetchMeal(type) {
    try {
        const response = await fetch(`/api/meal?type=${type}`);
        const data = await response.json();
        displayMeal(data);
    } catch (error) {
        console.error("급식 정보를 가져오는 중 오류 발생:", error);
        document.getElementById("meal-container").innerHTML = "<p>급식 정보를 불러오는 데 실패했습니다.</p>";
    }
}

function displayMeal(data) {
    const container = document.getElementById("meal-container");
    container.innerHTML = ""; // 기존 내용 초기화

    if (!data.mealServiceDietInfo || data.mealServiceDietInfo.length < 2) {
        container.innerHTML = "<p>급식 정보가 없습니다.</p>";
        return;
    }

    const meals = data.mealServiceDietInfo[1].row;
    const mealItems = meals.map(meal => {
        const mealDiv = document.createElement("div");
        mealDiv.classList.add("meal-item");
        mealDiv.innerHTML = `
            <h3>${meal.MLSV_YMD}</h3>
            <p>${meal.DDISH_NM.replace(/\([^\)]*\)/g, '')}</p>
        `;
        return mealDiv;
    });

    mealItems.forEach(item => container.appendChild(item));
}

// 오늘 급식 불러오기 (페이지 로드 시 자동 실행)
fetchMeal('today');
