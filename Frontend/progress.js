/* =========================================
   FITAI - PROGRESS JAVASCRIPT
   ========================================= */


/* =========================================
   API
   ========================================= */

const API_BASE_URL =
    "http://127.0.0.1:5000";

const TOKEN_KEY =
    "fitai-token";

const CURRENT_USER_KEY =
    "fitai-current-user";

const THEME_KEY =
    "fitai-theme";

const ACHIEVEMENT_KEY =
    "fitai-unlocked-achievements";


/* =========================================
   ACHIEVEMENTS
   ========================================= */

const achievements = [

    {
        id: "first-workout",
        icon: "🏋️",
        title: "First Step",
        description: "Complete your first workout.",
        requirement: 1,
        type: "workout"
    },

    {
        id: "five-workouts",
        icon: "🔥",
        title: "Getting Started",
        description: "Complete 5 workouts.",
        requirement: 5,
        type: "workout"
    },

    {
        id: "ten-workouts",
        icon: "💪",
        title: "Building Momentum",
        description: "Complete 10 workouts.",
        requirement: 10,
        type: "workout"
    },

    {
        id: "twenty-workouts",
        icon: "🏆",
        title: "Committed",
        description: "Complete 20 workouts.",
        requirement: 20,
        type: "workout"
    },

    {
        id: "fifty-workouts",
        icon: "👑",
        title: "Fitness Warrior",
        description: "Complete 50 workouts.",
        requirement: 50,
        type: "workout"
    },

    {
        id: "first-meal",
        icon: "🍎",
        title: "Nutrition Started",
        description: "Log your first meal.",
        requirement: 1,
        type: "meal"
    },

    {
        id: "ten-meals",
        icon: "🥗",
        title: "Eating Smart",
        description: "Log 10 meals.",
        requirement: 10,
        type: "meal"
    },

    {
        id: "twenty-five-meals",
        icon: "🍽️",
        title: "Nutrition Tracker",
        description: "Log 25 meals.",
        requirement: 25,
        type: "meal"
    },

    {
        id: "first-water",
        icon: "💧",
        title: "Stay Hydrated",
        description: "Log your first hydration day.",
        requirement: 1,
        type: "water"
    },

    {
        id: "seven-water-days",
        icon: "🌊",
        title: "Hydration Habit",
        description: "Complete 7 hydration days.",
        requirement: 7,
        type: "water"
    },

    {
        id: "thirty-water-days",
        icon: "💦",
        title: "Hydration Master",
        description: "Complete 30 hydration days.",
        requirement: 30,
        type: "water"
    },

    {
        id: "hundred-xp",
        icon: "⭐",
        title: "Rising Star",
        description: "Earn 100 XP.",
        requirement: 100,
        type: "xp"
    },

    {
        id: "five-hundred-xp",
        icon: "🌟",
        title: "Fitness Explorer",
        description: "Earn 500 XP.",
        requirement: 500,
        type: "xp"
    },

    {
        id: "thousand-xp",
        icon: "🚀",
        title: "Fitness Pro",
        description: "Earn 1,000 XP.",
        requirement: 1000,
        type: "xp"
    },

    {
        id: "two-thousand-xp",
        icon: "💎",
        title: "Elite Progress",
        description: "Earn 2,000 XP.",
        requirement: 2000,
        type: "xp"
    },

    {
        id: "five-thousand-xp",
        icon: "👑",
        title: "FitAI Legend",
        description: "Earn 5,000 XP.",
        requirement: 5000,
        type: "xp"
    }

];


/* =========================================
   LEVELS
   ========================================= */

const levels = [

    {
        level: 1,
        name: "Beginner",
        badge: "🌱",
        xp: 0
    },

    {
        level: 2,
        name: "Starter",
        badge: "🌿",
        xp: 100
    },

    {
        level: 3,
        name: "Active",
        badge: "🏃",
        xp: 250
    },

    {
        level: 4,
        name: "Dedicated",
        badge: "🔥",
        xp: 500
    },

    {
        level: 5,
        name: "Strong",
        badge: "💪",
        xp: 800
    },

    {
        level: 6,
        name: "Athlete",
        badge: "🏋️",
        xp: 1200
    },

    {
        level: 7,
        name: "Champion",
        badge: "🏆",
        xp: 1800
    },

    {
        level: 8,
        name: "Elite",
        badge: "💎",
        xp: 2500
    },

    {
        level: 9,
        name: "Master",
        badge: "👑",
        xp: 3500
    },

    {
        level: 10,
        name: "FitAI Legend",
        badge: "🚀",
        xp: 5000
    }

];


/* =========================================
   BACKEND DATA
   ========================================= */

let workoutsData = [];

let mealsData = [];

let waterData = [];


/* =========================================
   DOM ELEMENTS
   ========================================= */

const totalXPElement =
    document.getElementById("totalXP");

const currentLevelElement =
    document.getElementById("currentLevel");

const levelNameElement =
    document.getElementById("levelName");

const totalWorkoutsElement =
    document.getElementById("totalWorkouts");

const currentStreakElement =
    document.getElementById("currentStreak");

const levelNumberElement =
    document.getElementById("levelNumber");

const levelBadgeElement =
    document.getElementById("levelBadge");

const levelBadgeTextElement =
    document.getElementById("levelBadgeText");

const xpCurrentTextElement =
    document.getElementById("xpCurrentText");

const xpNextTextElement =
    document.getElementById("xpNextText");

const xpProgressFillElement =
    document.getElementById("xpProgressFill");

const xpProgressMessageElement =
    document.getElementById("xpProgressMessage");

const weeklyChartElement =
    document.getElementById("weeklyChart");

const statWorkoutsElement =
    document.getElementById("statWorkouts");

const statMealsElement =
    document.getElementById("statMeals");

const statWaterDaysElement =
    document.getElementById("statWaterDays");

const statAchievementsElement =
    document.getElementById("statAchievements");

const achievementCountElement =
    document.getElementById("achievementCount");

const achievementsGridElement =
    document.getElementById("achievementsGrid");

const weekWorkoutsElement =
    document.getElementById("weekWorkouts");

const weekMealsElement =
    document.getElementById("weekMeals");

const weekWaterElement =
    document.getElementById("weekWater");

const weekXPElement =
    document.getElementById("weekXP");

const progressMessageElement =
    document.getElementById("progressMessage");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const themeText =
    document.getElementById("themeText");

const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.getElementById("sidebar");

const authButtons =
    document.getElementById("authButtons");

const loggedUser =
    document.getElementById("loggedUser");

const userName =
    document.getElementById("userName");

const userAvatar =
    document.getElementById("userAvatar");

const logoutBtn =
    document.getElementById("logoutBtn");

const mobileUserArea =
    document.getElementById("mobileUserArea");


/* =========================================
   API REQUEST
   ========================================= */

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


/* =========================================
   LOAD ALL PROGRESS DATA
   ========================================= */

async function loadProgressData() {

    try {

        const [
            workoutResponse,
            dietResponse,
            waterResponse
        ] = await Promise.all([

            apiRequest(
                "/api/workouts"
            ),

            apiRequest(
                "/api/diet"
            ),

            apiRequest(
                "/api/water"
            )

        ]);


        workoutsData =
            Array.isArray(
                workoutResponse.workouts
            )
                ? workoutResponse.workouts
                : [];


        mealsData =
            Array.isArray(
                dietResponse.meals
            )
                ? dietResponse.meals
                : [];


        waterData =
            Array.isArray(
                waterResponse.water
            )
                ? waterResponse.water
                : [];


    } catch (error) {

        console.error(
            "Unable to load progress data:",
            error
        );

        workoutsData = [];

        mealsData = [];

        waterData = [];

    }
}


/* =========================================
   DATE HELPERS
   ========================================= */

function formatDateKey(date) {

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


function getTodayKey() {

    return formatDateKey(
        new Date()
    );
}


/* =========================================
   GET DATE FROM ITEM
   ========================================= */

function getItemDate(item) {

    if (!item) {

        return null;
    }


    const possibleDates = [

        item.date,

        item.createdAt,

        item.created_at,

        item.timestamp,

        item.savedAt,

        item.day

    ];


    for (
        const value of possibleDates
    ) {

        if (!value) {

            continue;
        }


        const date =
            new Date(value);


        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {

            return date;
        }
    }


    return null;
}


/* =========================================
   WORKOUT DATA
   ========================================= */

function getWorkouts() {

    return workoutsData;
}


/* =========================================
   DIET DATA
   ========================================= */

function getMeals() {

    return mealsData;
}


/* =========================================
   WATER DATA
   ========================================= */

function getWaterEntries() {

    return waterData;
}


/* =========================================
   WATER HISTORY MAP
   ========================================= */

function getWaterHistoryMap() {

    const map = {};


    waterData.forEach(
        item => {

            if (!item) {

                return;
            }


            const date =
                getItemDate(item);


            if (!date) {

                return;
            }


            const dateKey =
                formatDateKey(date);


            const amount =
                Number(
                    item.amount
                ) || 0;


            if (
                !Object.prototype.hasOwnProperty.call(
                    map,
                    dateKey
                )
            ) {

                map[dateKey] =
                    0;
            }


            map[dateKey] +=
                amount;

        }
    );


    return map;
}


/* =========================================
   COUNT WATER DAYS
   ========================================= */

function getWaterDays() {

    const map =
        getWaterHistoryMap();


    return Object.keys(map)
        .filter(
            date =>
                Number(
                    map[date]
                ) > 0
        )
        .length;
}


/* =========================================
   GET WEEK START
   ========================================= */

function getWeekStart() {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const day =
        today.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    const monday =
        new Date(today);


    monday.setDate(
        today.getDate() -
        difference
    );


    return monday;
}


/* =========================================
   GET LAST 7 DAYS
   ========================================= */

function getLastSevenDays() {

    const days = [];


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date(today);


        date.setDate(
            today.getDate() - i
        );


        days.push(
            date
        );
    }


    return days;
}


/* =========================================
   IS SAME DAY
   ========================================= */

function isSameDay(
    dateA,
    dateB
) {

    if (
        !dateA ||
        !dateB
    ) {

        return false;
    }


    return (
        dateA.getFullYear() ===
            dateB.getFullYear() &&

        dateA.getMonth() ===
            dateB.getMonth() &&

        dateA.getDate() ===
            dateB.getDate()
    );
}


/* =========================================
   COUNT ITEMS ON DATE
   ========================================= */

function countItemsOnDate(
    items,
    date
) {

    return items.filter(
        item => {

            const itemDate =
                getItemDate(item);


            return (
                itemDate &&
                isSameDay(
                    itemDate,
                    date
                )
            );

        }
    ).length;
}


/* =========================================
   CALCULATE STREAK
   ========================================= */

function calculateStreak() {

    const workouts =
        getWorkouts();


    const meals =
        getMeals();


    const waterMap =
        getWaterHistoryMap();


    const activeDates =
        new Set();


    workouts.forEach(
        workout => {

            const date =
                getItemDate(workout);


            if (date) {

                activeDates.add(
                    formatDateKey(date)
                );
            }

        }
    );


    meals.forEach(
        meal => {

            const date =
                getItemDate(meal);


            if (date) {

                activeDates.add(
                    formatDateKey(date)
                );
            }

        }
    );


    Object.keys(
        waterMap
    ).forEach(
        date => {

            if (
                Number(
                    waterMap[date]
                ) > 0
            ) {

                activeDates.add(
                    date
                );
            }

        }
    );


    let streak = 0;


    const current =
        new Date();


    current.setHours(
        0,
        0,
        0,
        0
    );


    const todayKey =
        formatDateKey(
            current
        );


    if (
        !activeDates.has(
            todayKey
        )
    ) {

        current.setDate(
            current.getDate() - 1
        );
    }


    while (
        activeDates.has(
            formatDateKey(
                current
            )
        )
    ) {

        streak++;


        current.setDate(
            current.getDate() - 1
        );
    }


    return streak;
}


/* =========================================
   CALCULATE XP
   ========================================= */

function calculateXP() {

    const workouts =
        getWorkouts();


    const meals =
        getMeals();


    const waterDays =
        getWaterDays();


    const workoutXP =
        workouts.length * 50;


    const mealXP =
        meals.length * 10;


    const waterXP =
        waterDays * 20;


    return (
        workoutXP +
        mealXP +
        waterXP
    );
}


/* =========================================
   GET LEVEL
   ========================================= */

function getLevelData(xp) {

    let current =
        levels[0];


    for (
        const level of levels
    ) {

        if (
            xp >= level.xp
        ) {

            current =
                level;

        } else {

            break;
        }
    }


    const currentIndex =
        levels.indexOf(
            current
        );


    const next =
        levels[
            currentIndex + 1
        ] || null;


    return {
        current,
        next
    };
}


/* =========================================
   UPDATE OVERVIEW
   ========================================= */

function updateOverview() {

    const workouts =
        getWorkouts();


    const xp =
        calculateXP();


    const streak =
        calculateStreak();


    const levelData =
        getLevelData(xp);


    if (totalXPElement) {

        totalXPElement.textContent =
            xp.toLocaleString();
    }


    if (currentLevelElement) {

        currentLevelElement.textContent =
            levelData.current.level;
    }


    if (levelNameElement) {

        levelNameElement.textContent =
            levelData.current.name;
    }


    if (totalWorkoutsElement) {

        totalWorkoutsElement.textContent =
            workouts.length;
    }


    if (currentStreakElement) {

        currentStreakElement.textContent =
            streak;
    }
}


/* =========================================
   UPDATE LEVEL CARD
   ========================================= */

function updateLevelCard() {

    const xp =
        calculateXP();


    const levelData =
        getLevelData(xp);


    const current =
        levelData.current;


    const next =
        levelData.next;


    if (levelNumberElement) {

        levelNumberElement.textContent =
            current.level;
    }


    if (levelBadgeElement) {

        levelBadgeElement.textContent =
            current.badge;
    }


    if (levelBadgeTextElement) {

        levelBadgeTextElement.textContent =
            current.name;
    }


    if (next) {

        const progressRange =
            next.xp -
            current.xp;


        const currentProgress =
            xp -
            current.xp;


        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    (
                        currentProgress /
                        progressRange
                    ) * 100
                )
            );


        if (
            xpProgressFillElement
        ) {

            xpProgressFillElement.style.width =
                `${percentage}%`;
        }


        if (
            xpCurrentTextElement
        ) {

            xpCurrentTextElement.textContent =
                `${xp.toLocaleString()} XP`;
        }


        if (
            xpNextTextElement
        ) {

            xpNextTextElement.textContent =
                `${next.xp.toLocaleString()} XP`;
        }


        if (
            xpProgressMessageElement
        ) {

            const remaining =
                Math.max(
                    0,
                    next.xp - xp
                );


            xpProgressMessageElement.textContent =
                `${remaining.toLocaleString()} XP until Level ${next.level} — ${next.name}.`;
        }

    } else {

        if (
            xpProgressFillElement
        ) {

            xpProgressFillElement.style.width =
                "100%";
        }


        if (
            xpCurrentTextElement
        ) {

            xpCurrentTextElement.textContent =
                `${xp.toLocaleString()} XP`;
        }


        if (
            xpNextTextElement
        ) {

            xpNextTextElement.textContent =
                "MAX LEVEL";
        }


        if (
            xpProgressMessageElement
        ) {

            xpProgressMessageElement.textContent =
                "You've reached the highest FitAI level. Amazing work!";
        }
    }
}


/* =========================================
   UPDATE STATISTICS
   ========================================= */

function updateStatistics() {

    const workouts =
        getWorkouts();


    const meals =
        getMeals();


    const waterDays =
        getWaterDays();


    const unlocked =
        getUnlockedAchievements();


    if (statWorkoutsElement) {

        statWorkoutsElement.textContent =
            workouts.length;
    }


    if (statMealsElement) {

        statMealsElement.textContent =
            meals.length;
    }


    if (statWaterDaysElement) {

        statWaterDaysElement.textContent =
            waterDays;
    }


    if (statAchievementsElement) {

        statAchievementsElement.textContent =
            unlocked.length;
    }
}


/* =========================================
   WEEKLY DATA
   ========================================= */

function getWeeklyData() {

    const workouts =
        getWorkouts();


    const meals =
        getMeals();


    const waterMap =
        getWaterHistoryMap();


    return getLastSevenDays()
        .map(
            date => {

                const dateKey =
                    formatDateKey(
                        date
                    );


                return {

                    date,

                    key:
                        dateKey,

                    workouts:
                        countItemsOnDate(
                            workouts,
                            date
                        ),

                    meals:
                        countItemsOnDate(
                            meals,
                            date
                        ),

                    water:
                        Number(
                            waterMap[
                                dateKey
                            ] || 0
                        )

                };
            }
        );
}


/* =========================================
   CREATE WEEKLY CHART
   ========================================= */

function createWeeklyChart() {

    if (
        !weeklyChartElement
    ) {

        return;
    }


    const data =
        getWeeklyData();


    const maxWater =
        Math.max(
            ...data.map(
                item =>
                    item.water
            ),
            1
        );


    weeklyChartElement.innerHTML =
        "";


    data.forEach(
        item => {

            const dayContainer =
                document.createElement(
                    "div"
                );


            dayContainer.className =
                "chart-day";


            const bars =
                document.createElement(
                    "div"
                );


            bars.className =
                "chart-bars";


            const workoutHeight =
                Math.min(
                    100,
                    item.workouts * 35
                );


            const workoutBar =
                document.createElement(
                    "div"
                );


            workoutBar.className =
                "chart-bar workout-bar";


            workoutBar.style.height =
                `${Math.max(
                    3,
                    workoutHeight
                )}%`;


            workoutBar.title =
                `${item.workouts} workout(s)`;


            const waterHeight =
                Math.min(
                    100,
                    (
                        item.water /
                        Math.max(
                            maxWater,
                            2500
                        )
                    ) * 100
                );


            const waterBar =
                document.createElement(
                    "div"
                );


            waterBar.className =
                "chart-bar water-bar";


            waterBar.style.height =
                `${Math.max(
                    3,
                    waterHeight
                )}%`;


            waterBar.title =
                `${item.water.toLocaleString()} ml water`;


            const dietHeight =
                Math.min(
                    100,
                    item.meals * 25
                );


            const dietBar =
                document.createElement(
                    "div"
                );


            dietBar.className =
                "chart-bar diet-bar";


            dietBar.style.height =
                `${Math.max(
                    3,
                    dietHeight
                )}%`;


            dietBar.title =
                `${item.meals} meal(s)`;


            bars.appendChild(
                workoutBar
            );


            bars.appendChild(
                waterBar
            );


            bars.appendChild(
                dietBar
            );


            const dayName =
                document.createElement(
                    "span"
                );


            dayName.className =
                "chart-day-label";


            dayName.textContent =
                item.date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );


            const dateNumber =
                document.createElement(
                    "span"
                );


            dateNumber.className =
                "chart-day-number";


            dateNumber.textContent =
                item.date.getDate();


            dayContainer.appendChild(
                bars
            );


            dayContainer.appendChild(
                dayName
            );


            dayContainer.appendChild(
                dateNumber
            );


            weeklyChartElement.appendChild(
                dayContainer
            );

        }
    );
}


/* =========================================
   UPDATE WEEKLY SUMMARY
   ========================================= */

function updateWeeklySummary() {

    const weeklyData =
        getWeeklyData();


    const weekWorkouts =
        weeklyData.reduce(
            (
                total,
                item
            ) =>
                total +
                item.workouts,
            0
        );


    const weekMeals =
        weeklyData.reduce(
            (
                total,
                item
            ) =>
                total +
                item.meals,
            0
        );


    const weekWater =
        weeklyData.filter(
            item =>
                item.water > 0
        ).length;


    const weekXP =
        (
            weekWorkouts * 50
        ) +
        (
            weekMeals * 10
        ) +
        (
            weekWater * 20
        );


    if (weekWorkoutsElement) {

        weekWorkoutsElement.textContent =
            weekWorkouts;
    }


    if (weekMealsElement) {

        weekMealsElement.textContent =
            weekMeals;
    }


    if (weekWaterElement) {

        weekWaterElement.textContent =
            weekWater;
    }


    if (weekXPElement) {

        weekXPElement.textContent =
            weekXP;
    }
}


/* =========================================
   UNLOCKED ACHIEVEMENTS
   ========================================= */

function getUnlockedAchievements() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    ACHIEVEMENT_KEY
                )
            );


        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        return [];
    }
}


/* =========================================
   SAVE UNLOCKED ACHIEVEMENTS
   ========================================= */

function saveUnlockedAchievements(
    unlocked
) {

    localStorage.setItem(
        ACHIEVEMENT_KEY,
        JSON.stringify(
            unlocked
        )
    );
}


/* =========================================
   CHECK ACHIEVEMENTS
   ========================================= */

function calculateUnlockedAchievements() {

    const workouts =
        getWorkouts();


    const meals =
        getMeals();


    const waterDays =
        getWaterDays();


    const xp =
        calculateXP();


    const unlocked =
        getUnlockedAchievements();


    const unlockedSet =
        new Set(
            unlocked
        );


    achievements.forEach(
        achievement => {

            let value = 0;


            if (
                achievement.type ===
                "workout"
            ) {

                value =
                    workouts.length;

            } else if (
                achievement.type ===
                "meal"
            ) {

                value =
                    meals.length;

            } else if (
                achievement.type ===
                "water"
            ) {

                value =
                    waterDays;

            } else if (
                achievement.type ===
                "xp"
            ) {

                value =
                    xp;
            }


            if (
                value >=
                achievement.requirement
            ) {

                unlockedSet.add(
                    achievement.id
                );
            }

        }
    );


    const finalUnlocked =
        Array.from(
            unlockedSet
        );


    saveUnlockedAchievements(
        finalUnlocked
    );


    return finalUnlocked;
}


/* =========================================
   RENDER ACHIEVEMENTS
   ========================================= */

function renderAchievements() {

    if (
        !achievementsGridElement
    ) {

        return;
    }


    const unlocked =
        calculateUnlockedAchievements();


    const unlockedSet =
        new Set(
            unlocked
        );


    achievementsGridElement.innerHTML =
        "";


    achievements.forEach(
        achievement => {

            const isUnlocked =
                unlockedSet.has(
                    achievement.id
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                `achievement-card ${
                    isUnlocked
                        ? "unlocked"
                        : "locked"
                }`;


            const icon =
                document.createElement(
                    "div"
                );


            icon.className =
                "achievement-icon";


            icon.textContent =
                isUnlocked
                    ? achievement.icon
                    : "🔒";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                achievement.title;


            const description =
                document.createElement(
                    "p"
                );


            description.textContent =
                achievement.description;


            const status =
                document.createElement(
                    "span"
                );


            status.className =
                "achievement-status";


            status.textContent =
                isUnlocked
                    ? "✓ Unlocked"
                    : "Locked";


            card.appendChild(
                icon
            );


            card.appendChild(
                title
            );


            card.appendChild(
                description
            );


            card.appendChild(
                status
            );


            achievementsGridElement.appendChild(
                card
            );

        }
    );


    if (
        achievementCountElement
    ) {

        achievementCountElement.textContent =
            `${unlocked.length} / ${achievements.length}`;
    }


    if (
        statAchievementsElement
    ) {

        statAchievementsElement.textContent =
            unlocked.length;
    }
}


/* =========================================
   PROGRESS MESSAGE
   ========================================= */

function updateProgressMessage() {

    if (
        !progressMessageElement
    ) {

        return;
    }


    const workouts =
        getWorkouts();


    const meals =
        getMeals();


    const waterDays =
        getWaterDays();


    const streak =
        calculateStreak();


    if (
        workouts.length === 0 &&
        meals.length === 0 &&
        waterDays === 0
    ) {

        progressMessageElement.textContent =
            "Start your first workout, log a meal or track your water to begin building your progress.";

        return;
    }


    if (streak >= 7) {

        progressMessageElement.textContent =
            `Amazing! You've maintained a ${streak}-day activity streak. Keep the momentum going!`;

        return;
    }


    if (
        workouts.length >= 20
    ) {

        progressMessageElement.textContent =
            "You've built a strong workout habit. Keep challenging yourself while giving your body enough recovery.";

        return;
    }


    if (
        workouts.length >= 10
    ) {

        progressMessageElement.textContent =
            "Great consistency! You've completed more than 10 workouts. Keep building the habit.";

        return;
    }


    if (
        workouts.length >= 5
    ) {

        progressMessageElement.textContent =
            "You're building momentum. Keep showing up and your progress will compound.";

        return;
    }


    progressMessageElement.textContent =
        "Every small action you take today contributes to a stronger tomorrow.";
}


/* =========================================
   THEME
   ========================================= */

function applyTheme(theme) {

    if (
        theme === "dark"
    ) {

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


/* =========================================
   LOAD THEME
   ========================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (
        savedTheme === "dark"
    ) {

        applyTheme(
            "dark"
        );

    } else {

        applyTheme(
            "light"
        );
    }
}


/* =========================================
   TOGGLE THEME
   ========================================= */

function toggleTheme() {

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    const newTheme =
        isDark
            ? "light"
            : "dark";


    localStorage.setItem(
        THEME_KEY,
        newTheme
    );


    applyTheme(
        newTheme
    );
}


/* =========================================
   AUTHENTICATION
   ========================================= */

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

        if (authButtons) {

            authButtons.style.display =
                "none";
        }


        if (loggedUser) {

            loggedUser.style.display =
                "flex";
        }


        if (userName) {

            userName.textContent =
                currentUser.name;
        }


        if (userAvatar) {

            const firstLetter =
                currentUser.name
                    .trim()
                    .charAt(0)
                    .toUpperCase();


            userAvatar.textContent =
                firstLetter ||
                "U";
        }


        if (mobileUserArea) {

            mobileUserArea.innerHTML =
                "";


            const nameElement =
                document.createElement(
                    "span"
                );


            nameElement.className =
                "mobile-user-name";


            nameElement.textContent =
                currentUser.name;


            mobileUserArea.appendChild(
                nameElement
            );
        }

    } else {

        if (authButtons) {

            authButtons.style.display =
                "flex";
        }


        if (loggedUser) {

            loggedUser.style.display =
                "none";
        }


        if (mobileUserArea) {

            mobileUserArea.innerHTML =
                '<a href="login.html">Login</a>';
        }
    }
}


/* =========================================
   LOGOUT
   ========================================= */

function logout() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );


    localStorage.removeItem(
        TOKEN_KEY
    );


    window.location.href =
        "login.html";
}


/* =========================================
   MOBILE SIDEBAR
   ========================================= */

function toggleSidebar() {

    if (!sidebar) {

        return;
    }


    sidebar.classList.toggle(
        "open"
    );
}


/* =========================================
   CLOSE SIDEBAR ON NAVIGATION
   ========================================= */

function closeSidebarOnNavigation() {

    if (!sidebar) {

        return;
    }


    const navLinks =
        sidebar.querySelectorAll(
            ".nav-item"
        );


    navLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    sidebar.classList.remove(
                        "open"
                    );

                }
            );

        }
    );
}


/* =========================================
   CLOSE SIDEBAR OUTSIDE
   ========================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !sidebar ||
            !menuToggle
        ) {

            return;
        }


        if (
            window.innerWidth >
            850
        ) {

            return;
        }


        const clickedSidebar =
            sidebar.contains(
                event.target
            );


        const clickedMenu =
            menuToggle.contains(
                event.target
            );


        if (
            sidebar.classList.contains(
                "open"
            ) &&
            !clickedSidebar &&
            !clickedMenu
        ) {

            sidebar.classList.remove(
                "open"
            );
        }

    }
);


/* =========================================
   EVENT LISTENERS
   ========================================= */

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        toggleTheme
    );
}


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleSidebar();

        }
    );
}


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );
}


/* =========================================
   INITIALIZE
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        loadTheme();

        loadUser();

        await loadProgressData();

        updateOverview();

        updateLevelCard();

        createWeeklyChart();

        updateStatistics();

        updateWeeklySummary();

        renderAchievements();

        updateProgressMessage();

        closeSidebarOnNavigation();

    }
);