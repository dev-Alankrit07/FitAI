/* =====================================================
   FITAI WATER TRACKER
===================================================== */


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
   STORAGE KEYS
========================= */

const WATER_GOAL_KEY =
    "fitai-water-goal";

const PROFILE_KEY =
    "fitai-profile";

const THEME_KEY =
    "fitai-theme";


/* =========================
   DEFAULTS
========================= */

const DEFAULT_GOAL = 2500;

const MALE_GOAL = 3500;

const FEMALE_GOAL = 2700;


/* =========================
   WATER CACHE
========================= */

let waterEntries = [];


/* =========================
   ELEMENTS
========================= */

const waterCircle =
    document.getElementById("waterCircle");

const waterAmount =
    document.getElementById("waterAmount");

const waterPercentage =
    document.getElementById("waterPercentage");

const goalDisplay =
    document.getElementById("goalDisplay");

const remainingWater =
    document.getElementById("remainingWater");

const hydrationStreak =
    document.getElementById("hydrationStreak");

const dailyGoal =
    document.getElementById("dailyGoal");

const customWater =
    document.getElementById("customWater");

const addCustomWater =
    document.getElementById("addCustomWater");

const resetWater =
    document.getElementById("resetWater");

const saveGoal =
    document.getElementById("saveGoal");

const waterMessage =
    document.getElementById("waterMessage");

const historyChart =
    document.getElementById("historyChart");

const todayDate =
    document.getElementById("todayDate");

const themeToggle =
    document.getElementById("themeToggle");

const authButtons =
    document.getElementById("authButtons");

const profileArea =
    document.getElementById("profileArea");

const profileBtn =
    document.getElementById("profileBtn");

const profileDropdown =
    document.getElementById("profileDropdown");

const logoutBtn =
    document.getElementById("logoutBtn");

const profileName =
    document.getElementById("profileName");

const profileAvatar =
    document.getElementById("profileAvatar");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const personalizedTitle =
    document.getElementById("personalizedTitle");

const personalizedText =
    document.getElementById("personalizedText");

const goalDescription =
    document.getElementById("goalDescription");


/* =====================================================
   API REQUEST
===================================================== */

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


/* =====================================================
   PROFILE
===================================================== */

function getProfile() {

    try {

        const profile =
            JSON.parse(
                localStorage.getItem(
                    PROFILE_KEY
                )
            );


        if (
            profile &&
            typeof profile === "object"
        ) {

            return profile;
        }

    } catch (error) {

        console.error(
            "Unable to load profile:",
            error
        );
    }


    return null;
}


/* =====================================================
   GET GENDER
===================================================== */

function getGender() {

    const profile =
        getProfile();


    if (!profile) {

        return null;
    }


    if (
        profile.gender === "male" ||
        profile.gender === "Male"
    ) {

        return "male";
    }


    if (
        profile.gender === "female" ||
        profile.gender === "Female"
    ) {

        return "female";
    }


    return null;
}


/* =====================================================
   CALCULATE PERSONALIZED DEFAULT GOAL
===================================================== */

function calculatePersonalizedGoal() {

    const gender =
        getGender();


    if (gender === "male") {

        return MALE_GOAL;
    }


    if (gender === "female") {

        return FEMALE_GOAL;
    }


    return DEFAULT_GOAL;
}


/* =====================================================
   SET PERSONALIZED UI
===================================================== */

function updatePersonalizedInformation() {

    const gender =
        getGender();


    if (gender === "male") {

        personalizedTitle.textContent =
            "Male Hydration Goal";

        personalizedText.textContent =
            "Your recommended starting hydration goal is 3500 ml per day.";

        goalDescription.textContent =
            "Your starting goal is based on the Male profile setting.";

        return;
    }


    if (gender === "female") {

        personalizedTitle.textContent =
            "Female Hydration Goal";

        personalizedText.textContent =
            "Your recommended starting hydration goal is 2700 ml per day.";

        goalDescription.textContent =
            "Your starting goal is based on the Female profile setting.";

        return;
    }


    personalizedTitle.textContent =
        "Personalized Hydration";

    personalizedText.textContent =
        "Add Male or Female in your profile to get a personalized starting goal.";

    goalDescription.textContent =
        "A default goal of 2500 ml is being used until your profile is completed.";
}


/* =====================================================
   DATE
===================================================== */

function getTodayKey() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


function getDateKey(dateValue) {

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


function displayTodayDate() {

    const today =
        new Date();


    const formattedDate =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    todayDate.textContent =
        formattedDate;
}


/* =====================================================
   WATER DATA
===================================================== */

async function loadWaterEntries() {

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

            waterEntries =
                data.water;

        } else {

            waterEntries = [];
        }


        return waterEntries;

    } catch (error) {

        console.error(
            "Unable to load water:",
            error
        );

        showMessage(
            error.message ||
            "Unable to load water data.",
            "error"
        );

        waterEntries = [];

        return [];
    }
}


/* =====================================================
   GET TODAY'S WATER
===================================================== */

function getTodayWater() {

    const today =
        getTodayKey();


    return waterEntries.reduce(
        function (total, entry) {

            const date =
                entry.created_at ||
                entry.createdAt;


            if (
                getDateKey(date) !== today
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
}


/* =====================================================
   GOAL STORAGE
===================================================== */

function getGoal() {

    const storedGoal =
        Number(
            localStorage.getItem(
                WATER_GOAL_KEY
            )
        );


    if (
        Number.isFinite(storedGoal) &&
        storedGoal >= 500
    ) {

        return storedGoal;
    }


    return calculatePersonalizedGoal();
}


function setGoal(goal) {

    localStorage.setItem(
        WATER_GOAL_KEY,
        String(goal)
    );
}


/* =====================================================
   INITIALIZE PERSONALIZED GOAL
===================================================== */

function initializeGoal() {

    const storedGoal =
        localStorage.getItem(
            WATER_GOAL_KEY
        );


    if (!storedGoal) {

        const personalizedGoal =
            calculatePersonalizedGoal();


        setGoal(
            personalizedGoal
        );
    }
}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    text,
    type = "success"
) {

    if (!waterMessage) {

        return;
    }


    waterMessage.textContent =
        text;


    if (type === "error") {

        waterMessage.style.color =
            "#ef4444";

    } else {

        waterMessage.style.color =
            "#16a34a";
    }


    clearTimeout(
        showMessage.timeout
    );


    showMessage.timeout =
        setTimeout(
            function () {

                waterMessage.textContent =
                    "";

            },
            2500
        );
}


/* =====================================================
   ADD WATER
===================================================== */

async function addWater(amount) {

    amount =
        Number(amount);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showMessage(
            "Please enter a valid amount.",
            "error"
        );

        return;
    }


    if (amount > 10000) {

        showMessage(
            "Please enter an amount below 10,000 ml.",
            "error"
        );

        return;
    }


    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    if (!token) {

        showMessage(
            "Please login first.",
            "error"
        );

        setTimeout(
            function () {

                window.location.href =
                    "login.html";

            },
            700
        );

        return;
    }


    try {

        const data =
            await apiRequest(
                "/api/water",
                {
                    method: "POST",

                    body: JSON.stringify({

                        amount:
                            Math.round(amount)

                    })
                }
            );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to add water."
            );
        }


        await loadWaterEntries();

        updateWaterUI();


        showMessage(
            `${Math.round(amount)} ml added successfully!`
        );

    } catch (error) {

        console.error(
            "Add water error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to add water.",
            "error"
        );
    }
}


/* =====================================================
   QUICK ADD
===================================================== */

document
    .querySelectorAll(".water-add-btn")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const amount =
                        Number(
                            this.dataset.amount
                        );


                    addWater(
                        amount
                    );
                }
            );
        }
    );


/* =====================================================
   CUSTOM WATER
===================================================== */

addCustomWater.addEventListener(
    "click",
    function () {

        const amount =
            Number(
                customWater.value
            );


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            showMessage(
                "Enter a valid water amount.",
                "error"
            );

            return;
        }


        addWater(
            amount
        );


        customWater.value =
            "";
    }
);


/* ENTER */

customWater.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addCustomWater.click();
        }
    }
);


/* =====================================================
   RESET TODAY'S WATER
===================================================== */

resetWater.addEventListener(
    "click",
    async function () {

        const currentWater =
            getTodayWater();


        if (currentWater === 0) {

            showMessage(
                "Today's water is already 0 ml.",
                "error"
            );

            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to reset today's water?"
            );


        if (!confirmed) {

            return;
        }


        try {

            const data =
                await apiRequest(
                    "/api/water/today",
                    {
                        method: "DELETE"
                    }
                );


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to reset today's water."
                );
            }


            await loadWaterEntries();

            updateWaterUI();


            showMessage(
                "Today's water has been reset."
            );

        } catch (error) {

            console.error(
                "Reset water error:",
                error
            );

            showMessage(
                error.message ||
                "Unable to reset today's water.",
                "error"
            );
        }
    }
);


/* =====================================================
   SAVE GOAL
===================================================== */

saveGoal.addEventListener(
    "click",
    function () {

        const newGoal =
            Number(
                dailyGoal.value
            );


        if (
            !Number.isFinite(newGoal) ||
            newGoal < 500
        ) {

            showMessage(
                "Daily goal must be at least 500 ml.",
                "error"
            );

            return;
        }


        if (newGoal > 10000) {

            showMessage(
                "Daily goal cannot exceed 10,000 ml.",
                "error"
            );

            return;
        }


        setGoal(
            Math.round(newGoal)
        );


        updateWaterUI();


        showMessage(
            "Daily hydration goal updated."
        );
    }
);


/* =====================================================
   UPDATE WATER UI
===================================================== */

function updateWaterUI() {

    const water =
        getTodayWater();


    const goal =
        getGoal();


    const rawPercentage =
        (water / goal) * 100;


    const percentage =
        Math.min(
            Math.round(
                rawPercentage
            ),
            100
        );


    const remaining =
        Math.max(
            goal - water,
            0
        );


    waterAmount.textContent =
        `${water.toLocaleString("en-IN")} ml`;


    waterPercentage.textContent =
        `${percentage}%`;


    goalDisplay.textContent =
        `${goal.toLocaleString("en-IN")} ml`;


    remainingWater.textContent =
        `${remaining.toLocaleString("en-IN")} ml`;


    dailyGoal.value =
        goal;


    const degrees =
        Math.min(
            (water / goal) * 360,
            360
        );


    waterCircle.style.background =
        `
        conic-gradient(
            var(--blue) ${degrees}deg,
            var(--blue-soft) ${degrees}deg,
            var(--blue-soft) 360deg
        )
        `;


    hydrationStreak.textContent =
        `${calculateHydrationStreak()} days`;


    renderHistory();
}


/* =====================================================
   CREATE HISTORY OBJECT
===================================================== */

function getHistoryFromEntries() {

    const history = {};


    waterEntries.forEach(
        function (entry) {

            const date =
                entry.created_at ||
                entry.createdAt;


            const dateKey =
                getDateKey(date);


            if (!dateKey) {

                return;
            }


            const amount =
                Number(
                    entry.amount
                ) || 0;


            if (
                !Object.prototype.hasOwnProperty.call(
                    history,
                    dateKey
                )
            ) {

                history[dateKey] =
                    0;
            }


            history[dateKey] +=
                amount;
        }
    );


    return history;
}


/* =====================================================
   HYDRATION STREAK
===================================================== */

function calculateHydrationStreak() {

    const history =
        getHistoryFromEntries();


    const goal =
        getGoal();


    let streak =
        0;


    const date =
        new Date();


    while (true) {

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


        const dateKey =
            `${year}-${month}-${day}`;


        const amount =
            Number(
                history[dateKey] || 0
            );


        if (amount >= goal) {

            streak++;


            date.setDate(
                date.getDate() - 1
            );

        } else {

            break;
        }


        if (streak >= 3650) {

            break;
        }
    }


    return streak;
}


/* =====================================================
   7 DAY HISTORY
===================================================== */

function renderHistory() {

    historyChart.innerHTML =
        "";


    const history =
        getHistoryFromEntries();


    const goal =
        getGoal();


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


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


        const dateKey =
            `${year}-${month}-${day}`;


        const amount =
            Number(
                history[dateKey] || 0
            );


        const barPercentage =
            Math.min(
                (amount / goal) * 100,
                100
            );


        const dayName =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            );


        const dayContainer =
            document.createElement(
                "div"
            );


        dayContainer.className =
            "history-day";


        const value =
            document.createElement(
                "div"
            );


        value.className =
            "history-value";


        value.textContent =
            `${amount} ml`;


        const barWrapper =
            document.createElement(
                "div"
            );


        barWrapper.className =
            "history-bar-wrapper";


        const bar =
            document.createElement(
                "div"
            );


        bar.className =
            "history-bar";


        bar.style.height =
            `${barPercentage}%`;


        const label =
            document.createElement(
                "div"
            );


        label.className =
            "history-label";


        label.textContent =
            dayName;


        barWrapper.appendChild(
            bar
        );


        dayContainer.appendChild(
            value
        );


        dayContainer.appendChild(
            barWrapper
        );


        dayContainer.appendChild(
            label
        );


        historyChart.appendChild(
            dayContainer
        );
    }
}


/* =====================================================
   AUTH
===================================================== */

function loadUser() {

    let currentUser =
        null;


    try {

        currentUser =
            JSON.parse(
                localStorage.getItem(
                    CURRENT_USER_KEY
                )
            );

    } catch (error) {

        currentUser =
            null;
    }


    if (
        currentUser &&
        currentUser.name
    ) {

        authButtons.style.display =
            "none";


        profileArea.style.display =
            "block";


        const name =
            currentUser.name.trim();


        profileName.textContent =
            name;


        profileAvatar.textContent =
            name
                .charAt(0)
                .toUpperCase();

    } else {

        authButtons.style.display =
            "flex";


        profileArea.style.display =
            "none";
    }
}


/* =====================================================
   PROFILE DROPDOWN
===================================================== */

profileBtn.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();


        profileDropdown.classList.toggle(
            "show"
        );
    }
);


document.addEventListener(
    "click",
    function () {

        profileDropdown.classList.remove(
            "show"
        );
    }
);


/* =====================================================
   LOGOUT
===================================================== */

logoutBtn.addEventListener(
    "click",
    async function () {

        try {

            await apiRequest(
                "/api/auth/logout",
                {
                    method: "POST"
                }
            );

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );
        }


        localStorage.removeItem(
            CURRENT_USER_KEY
        );


        localStorage.removeItem(
            TOKEN_KEY
        );


        window.location.href =
            "login.html";
    }
);


/* =====================================================
   THEME
===================================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );


        themeToggle.textContent =
            "☀️";

    } else {

        document.body.classList.remove(
            "dark-mode"
        );


        themeToggle.textContent =
            "🌙";
    }
}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        if (isDark) {

            localStorage.setItem(
                THEME_KEY,
                "dark"
            );


            themeToggle.textContent =
                "☀️";

        } else {

            localStorage.setItem(
                THEME_KEY,
                "light"
            );


            themeToggle.textContent =
                "🌙";
        }
    }
);


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

mobileMenuBtn.addEventListener(
    "click",
    function () {

        sidebar.classList.toggle(
            "open"
        );


        sidebarOverlay.classList.toggle(
            "show"
        );
    }
);


sidebarOverlay.addEventListener(
    "click",
    function () {

        sidebar.classList.remove(
            "open"
        );


        sidebarOverlay.classList.remove(
            "show"
        );
    }
);


/* =====================================================
   INITIALIZE
===================================================== */

async function initializeWaterPage() {

    displayTodayDate();

    loadUser();

    loadTheme();

    updatePersonalizedInformation();

    initializeGoal();

    await loadWaterEntries();

    updateWaterUI();
}


initializeWaterPage();