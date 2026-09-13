/* ==========================================
   FITAI DIET JAVASCRIPT
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       API
       ========================================== */

    const API_BASE_URL =
        "http://127.0.0.1:5000";

    const TOKEN_KEY =
        "fitai-token";

    const CURRENT_USER_KEY =
        "fitai-current-user";


    /* ==========================================
       ELEMENTS
       ========================================== */

    const sidebar =
        document.getElementById("sidebar");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");

    const themeText =
        document.getElementById("themeText");


    const mealType =
        document.getElementById("mealType");

    const food =
        document.getElementById("food");

    const otherFoodGroup =
        document.getElementById("otherFoodGroup");

    const otherFood =
        document.getElementById("otherFood");


    const dietForm =
        document.getElementById("dietForm");

    const mealList =
        document.getElementById("mealList");

    const mealCount =
        document.getElementById("mealCount");


    const breakfastCount =
        document.getElementById("breakfastCount");

    const lunchCount =
        document.getElementById("lunchCount");

    const snacksCount =
        document.getElementById("snacksCount");

    const dinnerCount =
        document.getElementById("dinnerCount");


    const userArea =
        document.getElementById("userArea");


    /* ==========================================
       API REQUEST
    ========================================== */

    async function apiRequest(
        url,
        options = {}
    ) {

        const token =
            localStorage.getItem(
                TOKEN_KEY
            );

        const headers = {
            ...(options.headers || {})
        };


        if (token) {

            headers["Authorization"] =
                `Bearer ${token}`;
        }


        if (
            options.body &&
            !headers["Content-Type"]
        ) {

            headers["Content-Type"] =
                "application/json";
        }


        const response =
            await fetch(
                `${API_BASE_URL}${url}`,
                {
                    ...options,
                    headers
                }
            );


        let data = {};

        try {

            data =
                await response.json();

        } catch (error) {

            data = {};
        }


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                TOKEN_KEY
            );

            localStorage.removeItem(
                CURRENT_USER_KEY
            );

            window.location.href =
                "login.html";

            throw new Error(
                "Authentication required."
            );
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Something went wrong."
            );
        }


        return data;
    }


    /* ==========================================
       SIDEBAR
       ========================================== */

    function openSidebar() {

        sidebar.classList.add("open");

        sidebarOverlay.classList.add("active");
    }


    function closeSidebar() {

        sidebar.classList.remove("open");

        sidebarOverlay.classList.remove("active");
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                if (
                    sidebar.classList.contains("open")
                ) {

                    closeSidebar();

                } else {

                    openSidebar();
                }

            }
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );
    }


    document
        .querySelectorAll(".menu-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 750
                    ) {

                        closeSidebar();
                    }

                }
            );

        });


    /* ==========================================
       THEME
       ========================================== */

    function updateThemeButton() {

        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        if (isDark) {

            themeIcon.textContent =
                "☀️";

            themeText.textContent =
                "Light Mode";

        } else {

            themeIcon.textContent =
                "🌙";

            themeText.textContent =
                "Dark Mode";
        }
    }


    function applySavedTheme() {

        const savedTheme =
            localStorage.getItem(
                "fitai-theme"
            );


        if (savedTheme === "dark") {

            document.body.classList.add(
                "dark-mode"
            );

        } else {

            document.body.classList.remove(
                "dark-mode"
            );
        }


        updateThemeButton();
    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );


                const isDark =
                    document.body.classList.contains(
                        "dark-mode"
                    );


                localStorage.setItem(
                    "fitai-theme",
                    isDark
                        ? "dark"
                        : "light"
                );


                updateThemeButton();

            }
        );
    }


    applySavedTheme();


    /* ==========================================
       LOGIN / USER
       ========================================== */

    function loadUser() {

        let currentUser = null;


        try {

            currentUser =
                JSON.parse(
                    localStorage.getItem(
                        CURRENT_USER_KEY
                    )
                );

        } catch (error) {

            currentUser = null;
        }


        if (!currentUser) {

            userArea.innerHTML = `

                <a
                    href="login.html"
                    class="auth-btn login-btn">
                    Login
                </a>

                <a
                    href="register.html"
                    class="auth-btn register-btn">
                    Register
                </a>

            `;

            return;
        }


        const firstLetter =
            currentUser.name
                ? currentUser.name
                    .charAt(0)
                    .toUpperCase()
                : "U";


        userArea.innerHTML = `

            <button
                class="user-profile-btn"
                id="userProfileBtn">

                <span class="user-avatar">
                    ${escapeHTML(firstLetter)}
                </span>

                <span class="user-name">
                    ${escapeHTML(
                        currentUser.name
                    )}
                </span>

            </button>

        `;


        const profileBtn =
            document.getElementById(
                "userProfileBtn"
            );


        if (profileBtn) {

            profileBtn.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "profile.html";

                }
            );
        }
    }


    loadUser();


    /* ==========================================
       OTHER FOOD FIELD
       ========================================== */

    food.addEventListener(
        "change",
        () => {

            if (food.value === "Other") {

                otherFoodGroup.style.display =
                    "block";

                otherFood.required = true;

            } else {

                otherFoodGroup.style.display =
                    "none";

                otherFood.required = false;

                otherFood.value = "";
            }

        }
    );


    /* ==========================================
       GET MEALS FROM BACKEND
    ========================================== */

    async function getMeals() {

        try {

            const data =
                await apiRequest(
                    "/api/diet",
                    {
                        method: "GET"
                    }
                );


            if (
                data.success &&
                Array.isArray(data.meals)
            ) {

                return data.meals;
            }


            return [];

        } catch (error) {

            console.error(
                "Unable to load meals:",
                error
            );

            return [];
        }
    }


    /* ==========================================
       CHECK SAME DAY
       ========================================== */

    function isToday(dateString) {

        const date =
            new Date(dateString);

        const today =
            new Date();


        return (
            date.getFullYear() ===
                today.getFullYear()
            &&
            date.getMonth() ===
                today.getMonth()
            &&
            date.getDate() ===
                today.getDate()
        );
    }


    /* ==========================================
       ADD MEAL
       ========================================== */

    dietForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const selectedMealType =
                mealType.value;


            const selectedFood =
                food.value;


            const finalFood =
                selectedFood === "Other"
                    ? otherFood.value.trim()
                    : selectedFood;


            const quantity =
                document
                    .getElementById("quantity")
                    .value.trim();


            const notes =
                document
                    .getElementById("notes")
                    .value.trim();


            if (
                !selectedMealType ||
                !finalFood ||
                !quantity
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            const token =
                localStorage.getItem(
                    TOKEN_KEY
                );


            if (!token) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;
            }


            try {

                const data =
                    await apiRequest(
                        "/api/diet",
                        {
                            method: "POST",

                            body: JSON.stringify({

                                meal_type:
                                    selectedMealType,

                                food:
                                    finalFood,

                                quantity:
                                    quantity,

                                notes:
                                    notes
                            })
                        }
                    );


                if (!data.success) {

                    throw new Error(
                        data.message ||
                        "Unable to add meal."
                    );
                }


                dietForm.reset();


                otherFoodGroup.style.display =
                    "none";

                otherFood.required =
                    false;


                await displayMeals();


                alert(
                    "Meal added successfully! 🍎"
                );

            } catch (error) {

                console.error(
                    "Add meal error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to add meal."
                );
            }

        }
    );


    /* ==========================================
       DISPLAY MEALS
       ========================================== */

    async function displayMeals() {

        const meals =
            await getMeals();


        const todaysMeals =
            meals.filter(
                meal => {

                    const date =
                        meal.created_at ||
                        meal.createdAt ||
                        meal.date;

                    return (
                        date &&
                        isToday(date)
                    );
                }
            );


        mealCount.textContent =
            todaysMeals.length;


        updateSummary(
            todaysMeals
        );


        if (
            todaysMeals.length === 0
        ) {

            mealList.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🍽️
                    </div>

                    <h3>
                        No meals recorded today
                    </h3>

                    <p>
                        Add your first meal to start tracking your diet.
                    </p>

                </div>

            `;

            return;
        }


        mealList.innerHTML = "";


        todaysMeals.forEach(meal => {

            const mealElement =
                document.createElement(
                    "div"
                );


            mealElement.className =
                "meal-item";


            const mealId =
                meal._id ||
                meal.id;


            const mealDate =
                meal.created_at ||
                meal.createdAt ||
                meal.date;


            const mealTypeValue =
                meal.meal_type ||
                meal.mealType;


            mealElement.innerHTML = `

                <div class="meal-item-top">

                    <div>

                        <h3 class="meal-name">
                            ${escapeHTML(
                                meal.food
                            )}
                        </h3>

                        <span class="meal-type">
                            ${getMealEmoji(
                                mealTypeValue
                            )}

                            ${escapeHTML(
                                mealTypeValue
                            )}
                        </span>

                    </div>


                    <div>

                        <div class="meal-date">
                            ${formatDate(
                                mealDate
                            )}
                        </div>

                        <button
                            class="delete-meal"
                            data-id="${escapeHTML(
                                mealId
                            )}"
                            title="Delete meal">

                            🗑️

                        </button>

                    </div>

                </div>


                <div class="meal-details">

                    <div class="meal-detail-box">

                        <strong>
                            Quantity:
                        </strong>

                        <span>
                            ${escapeHTML(
                                meal.quantity
                            )}
                        </span>

                    </div>

                </div>


                ${
                    meal.notes
                        ?
                    `
                        <div class="meal-notes">

                            <strong>
                                Notes:
                            </strong>

                            ${escapeHTML(
                                meal.notes
                            )}

                        </div>
                    `
                        :
                    ""
                }

            `;


            mealList.appendChild(
                mealElement
            );

        });


        /* DELETE BUTTONS */

        document
            .querySelectorAll(
                ".delete-meal"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.id;

                        deleteMeal(id);

                    }
                );

            });

    }


    /* ==========================================
       SUMMARY
       ========================================== */

    function updateSummary(meals) {

        const counts = {

            Breakfast: 0,

            Lunch: 0,

            Snacks: 0,

            Dinner: 0

        };


        meals.forEach(meal => {

            const type =
                meal.meal_type ||
                meal.mealType;


            if (
                Object.prototype.hasOwnProperty
                    .call(
                        counts,
                        type
                    )
            ) {

                counts[type]++;
            }

        });


        breakfastCount.textContent =
            counts.Breakfast;


        lunchCount.textContent =
            counts.Lunch;


        snacksCount.textContent =
            counts.Snacks;


        dinnerCount.textContent =
            counts.Dinner;
    }


    /* ==========================================
       DELETE MEAL
       ========================================== */

    async function deleteMeal(id) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this meal?"
            );


        if (!confirmed) {

            return;
        }


        try {

            const data =
                await apiRequest(
                    `/api/diet/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to delete meal."
                );
            }


            await displayMeals();

        } catch (error) {

            console.error(
                "Delete meal error:",
                error
            );

            alert(
                error.message ||
                "Unable to delete meal."
            );
        }
    }


    /* ==========================================
       MEAL EMOJI
       ========================================== */

    function getMealEmoji(type) {

        const emojis = {

            Breakfast: "🌅",

            Lunch: "☀️",

            Snacks: "🍎",

            Dinner: "🌙"

        };


        return emojis[type] ||
            "🍽️";
    }


    /* ==========================================
       DATE FORMAT
       ========================================== */

    function formatDate(dateString) {

        const date =
            new Date(dateString);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Unknown date";
        }


        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );
    }


    /* ==========================================
       HTML ESCAPE
       ========================================== */

    function escapeHTML(value) {

        return String(
            value ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
    }


    /* ==========================================
       INITIAL LOAD
       ========================================== */

    displayMeals();

});