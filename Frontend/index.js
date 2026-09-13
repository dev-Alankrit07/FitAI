/* =========================
   FITAI DASHBOARD
========================= */


/* =========================
   API
========================= */

const API_BASE_URL =
    "http://127.0.0.1:5000";

const TOKEN_KEY =
    "fitai-token";

const CURRENT_USER_KEY =
    "fitai-current-user";


/* =========================
   ELEMENTS
========================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const menuButton =
    document.getElementById("menuButton");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const themeText =
    document.getElementById("themeText");

const authArea =
    document.getElementById("authArea");

const welcomeTitle =
    document.getElementById("welcomeTitle");

const welcomeText =
    document.getElementById("welcomeText");

const workoutCount =
    document.getElementById("workoutCount");

const mealCount =
    document.getElementById("mealCount");

const waterCount =
    document.getElementById("waterCount");

const progressPercent =
    document.getElementById("progressPercent");

const bmiGender =
    document.getElementById("bmiGender");

const bmiHeight =
    document.getElementById("bmiHeight");

const bmiWeight =
    document.getElementById("bmiWeight");

const calculateBMIButton =
    document.getElementById("calculateBMI");

const bmiValue =
    document.getElementById("bmiValue");

const bmiCategory =
    document.getElementById("bmiCategory");

const bmiNeedle =
    document.getElementById("bmiNeedle");


/* =========================
   DASHBOARD DATA CACHE
========================= */

let dashboardWorkouts = [];
let dashboardMeals = [];
let dashboardWater = [];
let dashboardMotivation = null;


/* =========================
   API REQUEST
========================= */

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


/* =========================
   SIDEBAR
========================= */

function openSidebar() {

    if (!sidebar) return;

    sidebar.classList.add(
        "open"
    );

    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "active"
        );
    }
}


function closeSidebar() {

    if (!sidebar) return;

    sidebar.classList.remove(
        "open"
    );

    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "active"
        );
    }
}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        function () {

            if (
                sidebar.classList.contains(
                    "open"
                )
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
        function () {

            closeSidebar();

        }
    );
}


/* =========================
   SIDEBAR NAVIGATION
========================= */

document
    .querySelectorAll(".nav-item")
    .forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <= 800
                    ) {

                        closeSidebar();
                    }

                }
            );

        }
    );


/* =========================
   THEME
========================= */

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        if (themeIcon) {

            themeIcon.textContent =
                "☀️";
        }

        if (themeText) {

            themeText.textContent =
                "Light Mode";
        }

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        if (themeIcon) {

            themeIcon.textContent =
                "🌙";
        }

        if (themeText) {

            themeText.textContent =
                "Dark Mode";
        }
    }
}


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "fitai-theme"
        ) || "light";

    applyTheme(
        savedTheme
    );
}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            const newTheme =
                isDark
                    ? "light"
                    : "dark";


            localStorage.setItem(
                "fitai-theme",
                newTheme
            );


            applyTheme(
                newTheme
            );

        }
    );
}


/* =========================
   AUTH STATE
========================= */

async function loadUser() {

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    /* =========================
       NOT LOGGED IN
    ========================= */

    if (!token) {

        if (authArea) {

            authArea.innerHTML = `
                <a href="login.html" class="login-button">
                    Login
                </a>

                <a href="register.html" class="register-button">
                    Register
                </a>
            `;
        }


        if (welcomeTitle) {

            welcomeTitle.textContent =
                "Welcome to FitAI 💪";
        }


        if (welcomeText) {

            welcomeText.textContent =
                "Track your workouts, nutrition and progress all in one place.";
        }


        return null;
    }


    /* =========================
       VERIFY TOKEN
    ========================= */

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/auth/me`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Authentication failed."
            );
        }


        const responseData =
            await response.json();


        const backendUser =
            responseData.user;


        const currentUser =
            localStorage.getItem(
                CURRENT_USER_KEY
            );


        let user =
            backendUser;


        if (currentUser) {

            try {

                user =
                    {
                        ...backendUser,
                        ...JSON.parse(
                            currentUser
                        )
                    };

            } catch (error) {

                user =
                    backendUser;
            }
        }


        const name =
            user.name ||
            "there";


        /* =========================
           LOGGED-IN PROFILE
        ========================= */

        if (authArea) {

            const firstLetter =
                name
                    .charAt(0)
                    .toUpperCase();


            authArea.innerHTML = `
                <a href="profile.html" class="user-profile-link">

                    <div class="user-avatar">
                        ${escapeHTML(firstLetter)}
                    </div>

                    <span class="user-name">
                        ${escapeHTML(name)}
                    </span>

                </a>
            `;
        }


        /* =========================
           LOGGED-IN GREETING
        ========================= */

        if (welcomeTitle) {

            welcomeTitle.textContent =
                `Let's get stronger, ${name}! 💪`;
        }


        if (welcomeText) {

            welcomeText.textContent =
                "Keep showing up and make progress one day at a time.";
        }


        return user;


    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        localStorage.removeItem(
            TOKEN_KEY
        );

        localStorage.removeItem(
            CURRENT_USER_KEY
        );


        window.location.href =
            "login.html";


        return null;
    }
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value)
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


/* =========================
   GET TODAY
========================= */

function getToday() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


/* =========================
   GET DATE KEY
========================= */

function getDateKey(dateValue) {

    if (!dateValue) {

        return null;
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;
    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


/* =========================
   LOAD WORKOUT DATA
========================= */

async function loadWorkoutData() {

    try {

        const data =
            await apiRequest(
                "/api/workouts",
                {
                    method: "GET"
                }
            );


        if (
            data.success &&
            Array.isArray(data.workouts)
        ) {

            dashboardWorkouts =
                data.workouts;

        } else {

            dashboardWorkouts =
                [];
        }

    } catch (error) {

        console.error(
            "Unable to load workouts:",
            error
        );

        dashboardWorkouts =
            [];
    }
}


/* =========================
   LOAD DIET DATA
========================= */

async function loadDietData() {

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

            dashboardMeals =
                data.meals;

        } else {

            dashboardMeals =
                [];
        }

    } catch (error) {

        console.error(
            "Unable to load meals:",
            error
        );

        dashboardMeals =
            [];
    }
}


/* =========================
   LOAD WATER DATA
========================= */

async function loadWaterData() {

    try {

        const data =
            await apiRequest(
                "/api/water",
                {
                    method: "GET"
                }
            );


        if (
            data.success &&
            Array.isArray(data.water)
        ) {

            dashboardWater =
                data.water;

        } else {

            dashboardWater =
                [];
        }

    } catch (error) {

        console.error(
            "Unable to load water:",
            error
        );

        dashboardWater =
            [];
    }
}


/* =========================
   LOAD MOTIVATION DATA
========================= */

async function loadMotivationData() {

    try {

        const data =
            await apiRequest(
                "/api/motivation/today",
                {
                    method: "GET"
                }
            );


        if (
            data.success &&
            data.exists &&
            data.motivation
        ) {

            dashboardMotivation =
                data.motivation;

        } else {

            dashboardMotivation =
                null;
        }

    } catch (error) {

        console.error(
            "Unable to load motivation:",
            error
        );

        dashboardMotivation =
            null;
    }
}


/* =========================
   WORKOUT STATS
========================= */

function updateWorkoutStats() {

    if (!workoutCount) return;


    workoutCount.textContent =
        dashboardWorkouts.length;
}


/* =========================
   DIET STATS
========================= */

function updateDietStats() {

    if (!mealCount) return;


    const today =
        getToday();


    const todaysMeals =
        dashboardMeals.filter(
            function (meal) {

                const date =
                    meal.created_at ||
                    meal.createdAt ||
                    meal.date;


                return (
                    getDateKey(date) ===
                    today
                );
            }
        );


    mealCount.textContent =
        todaysMeals.length;
}


/* =========================
   WATER STATS
========================= */

function updateWaterStats() {

    if (!waterCount) return;


    const today =
        getToday();


    const todayWater =
        dashboardWater.reduce(
            function (
                total,
                entry
            ) {

                const date =
                    entry.created_at ||
                    entry.createdAt ||
                    entry.date;


                if (
                    getDateKey(date) !==
                    today
                ) {

                    return total;
                }


                return (
                    total +
                    (
                        Number(
                            entry.amount
                        ) || 0
                    )
                );

            },
            0
        );


    waterCount.textContent =
        `${todayWater.toLocaleString()} ml`;
}


/* =========================
   TODAY WORKOUT
========================= */

function hasWorkoutToday() {

    const today =
        getToday();


    return dashboardWorkouts.some(
        function (workout) {

            const date =
                workout.created_at ||
                workout.createdAt ||
                workout.date;


            return (
                getDateKey(date) ===
                today
            );
        }
    );
}


/* =========================
   TODAY MEAL
========================= */

function hasMealToday() {

    const today =
        getToday();


    return dashboardMeals.some(
        function (meal) {

            const date =
                meal.created_at ||
                meal.createdAt ||
                meal.date;


            return (
                getDateKey(date) ===
                today
            );
        }
    );
}


/* =========================
   TODAY WATER
========================= */

function hasWaterToday() {

    const today =
        getToday();


    return dashboardWater.some(
        function (entry) {

            const date =
                entry.created_at ||
                entry.createdAt ||
                entry.date;


            return (
                getDateKey(date) ===
                today &&
                Number(
                    entry.amount
                ) > 0
            );
        }
    );
}


/* =========================
   TODAY MOTIVATION
========================= */

function hasMotivationChallengeToday() {

    return (
        dashboardMotivation &&
        dashboardMotivation.challenge_completed === true
    );
}


/* =========================
   DAILY PROGRESS
========================= */

function updateProgress() {

    if (!progressPercent) return;


    let completed =
        0;


    /* =========================
       WORKOUT
    ========================= */

    if (
        hasWorkoutToday()
    ) {

        completed++;
    }


    /* =========================
       DIET
    ========================= */

    if (
        hasMealToday()
    ) {

        completed++;
    }


    /* =========================
       WATER
    ========================= */

    if (
        hasWaterToday()
    ) {

        completed++;
    }


    /* =========================
       MOTIVATION CHALLENGE
    ========================= */

    if (
        hasMotivationChallengeToday()
    ) {

        completed++;
    }


    const percentage =
        Math.round(
            (
                completed /
                4
            ) *
            100
        );


    progressPercent.textContent =
        `${percentage}%`;
}


/* =========================
   BMI CATEGORY
========================= */

function getBMICategory(bmi) {

    if (bmi < 18.5) {

        return {
            text: "Underweight",
            className: "underweight"
        };

    }


    if (bmi < 25) {

        return {
            text: "Normal",
            className: "normal"
        };

    }


    if (bmi < 30) {

        return {
            text: "Overweight",
            className: "overweight"
        };

    }


    if (bmi < 35) {

        return {
            text: "Obesity Class I",
            className: "obesity"
        };

    }


    if (bmi < 40) {

        return {
            text: "Obesity Class II",
            className: "obesity"
        };

    }


    return {
        text: "Obesity Class III",
        className: "obesity"
    };
}


/* =========================
   BMI NEEDLE
========================= */

function updateBMIGauge(bmi) {

    if (!bmiNeedle) return;


    let limitedBMI =
        Math.max(
            15,
            Math.min(
                40,
                bmi
            )
        );


    const percentage =
        (
            limitedBMI -
            15
        ) /
        (
            40 -
            15
        );


    const angle =
        -90 +
        (
            percentage *
            180
        );


    bmiNeedle.style.transform =
        `rotate(${angle}deg)`;
}


/* =========================
   SAVE BMI TO BACKEND
========================= */

async function saveBMIToBackend(
    gender,
    height,
    weight,
    bmi
) {

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    if (!token) {

        return;
    }


    try {

        await apiRequest(
            "/api/profile",
            {
                method: "PUT",

                body: JSON.stringify({

                    gender:
                        gender || null,

                    height:
                        height,

                    weight:
                        weight,

                    bmi:
                        bmi

                })
            }
        );

    } catch (error) {

        console.error(
            "Unable to save BMI to backend:",
            error
        );
    }
}


/* =========================
   BMI CALCULATOR
========================= */

function calculateBMI() {

    const height =
        Number(
            bmiHeight.value
        );


    const weight =
        Number(
            bmiWeight.value
        );


    if (
        !height ||
        !weight ||
        height <= 0 ||
        weight <= 0
    ) {

        alert(
            "Please enter a valid height and weight."
        );

        return;
    }


    if (
        height < 50 ||
        height > 250
    ) {

        alert(
            "Please enter a height between 50 cm and 250 cm."
        );

        return;
    }


    if (
        weight < 20 ||
        weight > 300
    ) {

        alert(
            "Please enter a weight between 20 kg and 300 kg."
        );

        return;
    }


    const heightInMeters =
        height / 100;


    const bmi =
        weight /
        (
            heightInMeters *
            heightInMeters
        );


    const roundedBMI =
        Number(
            bmi.toFixed(1)
        );


    const category =
        getBMICategory(
            bmi
        );


    /* =========================
       DISPLAY
    ========================= */

    bmiValue.textContent =
        roundedBMI.toFixed(1);


    bmiCategory.textContent =
        category.text;


    /* =========================
       CATEGORY COLOR
    ========================= */

    bmiCategory.style.background =
        "";

    bmiCategory.style.color =
        "";


    if (
        category.className ===
        "underweight"
    ) {

        bmiCategory.style.background =
            "#dbeafe";

        bmiCategory.style.color =
            "#2563eb";

    } else if (
        category.className ===
        "normal"
    ) {

        bmiCategory.style.background =
            "#dcfce7";

        bmiCategory.style.color =
            "#16a34a";

    } else if (
        category.className ===
        "overweight"
    ) {

        bmiCategory.style.background =
            "#fef3c7";

        bmiCategory.style.color =
            "#d97706";

    } else {

        bmiCategory.style.background =
            "#fee2e2";

        bmiCategory.style.color =
            "#dc2626";
    }


    updateBMIGauge(
        bmi
    );


    /* =========================
       SAVE BMI LOCALLY
       (UI FALLBACK)
    ========================= */

    const bmiData = {

        gender:
            bmiGender.value || "",

        height,

        weight,

        bmi:
            roundedBMI,

        category:
            category.text,

        date:
            getToday()

    };


    localStorage.setItem(
        "fitai-bmi",
        JSON.stringify(
            bmiData
        )
    );


    /* =========================
       SAVE BMI TO MONGODB
    ========================= */

    saveBMIToBackend(
        bmiGender.value || "",
        height,
        weight,
        roundedBMI
    );
}


if (calculateBMIButton) {

    calculateBMIButton.addEventListener(
        "click",
        calculateBMI
    );
}


/* =========================
   LOAD SAVED BMI
========================= */

async function loadSavedBMI() {

    let savedBMI =
        localStorage.getItem(
            "fitai-bmi"
        );


    /*
        First try backend profile.
    */

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    if (token) {

        try {

            const data =
                await apiRequest(
                    "/api/profile",
                    {
                        method: "GET"
                    }
                );


            if (
                data.success &&
                data.user
            ) {

                const profile =
                    data.user;


                if (
                    profile.gender &&
                    bmiGender
                ) {

                    bmiGender.value =
                        profile.gender;
                }


                if (
                    profile.height &&
                    bmiHeight
                ) {

                    bmiHeight.value =
                        profile.height;
                }


                if (
                    profile.weight &&
                    bmiWeight
                ) {

                    bmiWeight.value =
                        profile.weight;
                }


                if (
                    profile.bmi &&
                    bmiValue
                ) {

                    bmiValue.textContent =
                        Number(
                            profile.bmi
                        ).toFixed(1);


                    const category =
                        getBMICategory(
                            Number(
                                profile.bmi
                            )
                        );


                    bmiCategory.textContent =
                        category.text;


                    applySavedBMICategory(
                        category.text
                    );


                    updateBMIGauge(
                        Number(
                            profile.bmi
                        )
                    );


                    /*
                        Backend profile loaded,
                        so no need to use the
                        old local BMI value.
                    */

                    return;
                }
            }

        } catch (error) {

            console.error(
                "Unable to load BMI from backend:",
                error
            );
        }
    }


    /*
        Fallback to existing localStorage
        if backend data is not available.
    */

    if (!savedBMI) {

        return;
    }


    try {

        const data =
            JSON.parse(
                savedBMI
            );


        if (
            data.gender &&
            bmiGender
        ) {

            bmiGender.value =
                data.gender;
        }


        if (
            data.height &&
            bmiHeight
        ) {

            bmiHeight.value =
                data.height;
        }


        if (
            data.weight &&
            bmiWeight
        ) {

            bmiWeight.value =
                data.weight;
        }


        if (
            data.bmi &&
            bmiValue
        ) {

            bmiValue.textContent =
                Number(
                    data.bmi
                ).toFixed(1);
        }


        if (
            data.category &&
            bmiCategory
        ) {

            bmiCategory.textContent =
                data.category;


            applySavedBMICategory(
                data.category
            );
        }


        if (data.bmi) {

            updateBMIGauge(
                Number(
                    data.bmi
                )
            );
        }


    } catch (error) {

        console.error(
            "Unable to load saved BMI:",
            error
        );
    }
}


/* =========================
   SAVED BMI CATEGORY STYLE
========================= */

function applySavedBMICategory(
    category
) {

    if (!bmiCategory) return;


    bmiCategory.style.background =
        "";

    bmiCategory.style.color =
        "";


    if (
        category ===
        "Underweight"
    ) {

        bmiCategory.style.background =
            "#dbeafe";

        bmiCategory.style.color =
            "#2563eb";

    } else if (
        category ===
        "Normal"
    ) {

        bmiCategory.style.background =
            "#dcfce7";

        bmiCategory.style.color =
            "#16a34a";

    } else if (
        category ===
        "Overweight"
    ) {

        bmiCategory.style.background =
            "#fef3c7";

        bmiCategory.style.color =
            "#d97706";

    } else {

        bmiCategory.style.background =
            "#fee2e2";

        bmiCategory.style.color =
            "#dc2626";
    }
}


/* =========================
   LOAD ALL DASHBOARD DATA
========================= */

async function loadDashboardData() {

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    if (!token) {

        dashboardWorkouts =
            [];

        dashboardMeals =
            [];

        dashboardWater =
            [];

        dashboardMotivation =
            null;

        return;
    }


    await Promise.all([
        loadWorkoutData(),
        loadDietData(),
        loadWaterData(),
        loadMotivationData()
    ]);
}


/* =========================
   REFRESH DASHBOARD
========================= */

async function refreshDashboard() {

    await loadDashboardData();


    updateWorkoutStats();

    updateDietStats();

    updateWaterStats();

    updateProgress();
}


/* =========================
   WINDOW FOCUS
========================= */

window.addEventListener(
    "focus",
    async function () {

        await loadUser();

        await refreshDashboard();

    }
);


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        loadTheme();

        await loadUser();

        await refreshDashboard();

        await loadSavedBMI();

    }
);

