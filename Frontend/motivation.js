/* =========================================
   FITAI - MOTIVATION JAVASCRIPT
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


/* =========================================
   MOTIVATIONAL QUOTES
   ========================================= */

const motivationalQuotes = [

    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },

    {
        text: "Success is the sum of small efforts repeated day after day.",
        author: "Robert Collier"
    },

    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },

    {
        text: "Your body can stand almost anything. It is your mind that you have to convince.",
        author: "Unknown"
    },

    {
        text: "Don't limit your challenges. Challenge your limits.",
        author: "Unknown"
    },

    {
        text: "The only bad workout is the one that didn't happen.",
        author: "Unknown"
    },

    {
        text: "Discipline will take you places motivation cannot.",
        author: "Unknown"
    },

    {
        text: "One workout won't change your body, but one workout can change your mindset.",
        author: "FitAI"
    },

    {
        text: "You don't have to be perfect. You just have to keep going.",
        author: "FitAI"
    },

    {
        text: "Small progress is still progress.",
        author: "FitAI"
    },

    {
        text: "Make yourself proud.",
        author: "FitAI"
    },

    {
        text: "Your future self will thank you for what you do today.",
        author: "FitAI"
    },

    {
        text: "Every day is another opportunity to become stronger.",
        author: "FitAI"
    },

    {
        text: "Consistency creates results.",
        author: "FitAI"
    },

    {
        text: "Don't wait for motivation. Create momentum.",
        author: "FitAI"
    }

];


/* =========================================
   DAILY CHALLENGES
   ========================================= */

const dailyChallenges = [

    {
        title: "Complete a 20-minute workout",
        description:
            "Move your body today and take one step closer to your fitness goal."
    },

    {
        title: "Drink your water goal",
        description:
            "Stay hydrated throughout the day and reach your FitAI water target."
    },

    {
        title: "Take a 15-minute walk",
        description:
            "Get moving and give your body some extra activity today."
    },

    {
        title: "Complete your planned workout",
        description:
            "Stay consistent with your training and complete today's workout."
    },

    {
        title: "Eat one nutritious meal",
        description:
            "Give your body quality fuel with a balanced and nutritious meal."
    },

    {
        title: "Stretch for 10 minutes",
        description:
            "Take some time to loosen up and help your body recover."
    },

    {
        title: "Get enough sleep tonight",
        description:
            "Recovery matters. Give your body the rest it needs."
    },

    {
        title: "Avoid unnecessary junk food",
        description:
            "Make one healthy choice today that supports your long-term goal."
    },

    {
        title: "Do 30 squats",
        description:
            "Complete 30 bodyweight squats at a comfortable pace."
    },

    {
        title: "Do 20 push-ups",
        description:
            "Complete your push-ups in manageable sets and focus on good form."
    },

    {
        title: "Take the stairs",
        description:
            "Choose the stairs instead of the elevator whenever practical today."
    },

    {
        title: "Plan tomorrow",
        description:
            "Spend five minutes planning your workout, meals or schedule for tomorrow."
    }

];


/* =========================================
   DOM ELEMENTS
   ========================================= */

const quoteText =
    document.getElementById("quoteText");

const quoteAuthor =
    document.getElementById("quoteAuthor");

const newMotivationBtn =
    document.getElementById("newMotivationBtn");

const challengeTitle =
    document.getElementById("challengeTitle");

const challengeDescription =
    document.getElementById("challengeDescription");

const completeChallengeBtn =
    document.getElementById("completeChallengeBtn");

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


    if (response.status === 401) {

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
   GET TODAY KEY
   ========================================= */

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


/* =========================================
   GET DAILY INDEX
   ========================================= */

function getDailyIndex(arrayLength) {

    if (!arrayLength) {

        return 0;
    }


    const startDate =
        new Date(
            "2026-01-01T00:00:00"
        );


    const today =
        new Date();


    startDate.setHours(
        0,
        0,
        0,
        0
    );


    today.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        Math.floor(
            (
                today -
                startDate
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const safeDifference =
        Math.max(
            0,
            difference
        );


    return (
        safeDifference %
        arrayLength
    );
}


/* =========================================
   GET TODAY'S DEFAULT MOTIVATION
   ========================================= */

function getTodayMotivationData() {

    const quoteIndex =
        getDailyIndex(
            motivationalQuotes.length
        );


    const challengeIndex =
        getDailyIndex(
            dailyChallenges.length
        );


    return {

        quote:
            motivationalQuotes[
                quoteIndex
            ],

        challenge:
            dailyChallenges[
                challengeIndex
            ]

    };
}


/* =========================================
   SHOW DAILY QUOTE
   ========================================= */

function showDailyQuote() {

    if (
        !quoteText ||
        !quoteAuthor
    ) {

        return;
    }


    const data =
        getTodayMotivationData();


    quoteText.textContent =
        data.quote.text;


    quoteAuthor.textContent =
        `— ${data.quote.author}`;
}


/* =========================================
   SHOW RANDOM MOTIVATION
   ========================================= */

function showRandomMotivation() {

    if (
        !quoteText ||
        !quoteAuthor
    ) {

        return;
    }


    let randomIndex;


    do {

        randomIndex =
            Math.floor(
                Math.random() *
                motivationalQuotes.length
            );

    } while (
        motivationalQuotes.length > 1 &&
        quoteText.textContent ===
        motivationalQuotes[randomIndex].text
    );


    const quote =
        motivationalQuotes[
            randomIndex
        ];


    quoteText.style.opacity =
        "0";


    setTimeout(
        () => {

            quoteText.textContent =
                quote.text;

            quoteAuthor.textContent =
                `— ${quote.author}`;

            quoteText.style.opacity =
                "1";

        },
        180
    );
}


/* =========================================
   LOAD DAILY CHALLENGE
   ========================================= */

async function loadDailyChallenge() {

    if (
        !challengeTitle ||
        !challengeDescription
    ) {

        return;
    }


    const defaultData =
        getTodayMotivationData();


    challengeTitle.textContent =
        defaultData.challenge.title;


    challengeDescription.textContent =
        defaultData.challenge.description;


    await loadTodayMotivation();
}


/* =========================================
   LOAD TODAY'S MOTIVATION FROM BACKEND
   ========================================= */

async function loadTodayMotivation() {

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

            const motivation =
                data.motivation;


            if (
                motivation.quote
            ) {

                quoteText.textContent =
                    motivation.quote;
            }


            if (
                motivation.quote_author
            ) {

                quoteAuthor.textContent =
                    `— ${motivation.quote_author}`;
            }


            if (
                motivation.challenge_title
            ) {

                challengeTitle.textContent =
                    motivation.challenge_title;
            }


            if (
                motivation.challenge_description
            ) {

                challengeDescription.textContent =
                    motivation.challenge_description;
            }


            updateChallengeButton(
                motivation.challenge_completed
            );


            return;
        }


        await createTodayMotivation();

    } catch (error) {

        console.error(
            "Unable to load today's motivation:",
            error
        );

        /*
            Keep the existing frontend
            motivation visible if the
            backend cannot be reached.
        */

        checkChallengeStatus();
    }
}


/* =========================================
   CREATE TODAY'S MOTIVATION
   ========================================= */

async function createTodayMotivation() {

    const data =
        getTodayMotivationData();


    try {

        const response =
            await apiRequest(
                "/api/motivation",
                {
                    method: "POST",

                    body: JSON.stringify({

                        quote:
                            data.quote.text,

                        quote_author:
                            data.quote.author,

                        challenge_title:
                            data.challenge.title,

                        challenge_description:
                            data.challenge.description

                    })
                }
            );


        if (
            response.success &&
            response.motivation
        ) {

            const motivation =
                response.motivation;


            quoteText.textContent =
                motivation.quote;


            quoteAuthor.textContent =
                `— ${motivation.quote_author}`;


            challengeTitle.textContent =
                motivation.challenge_title;


            challengeDescription.textContent =
                motivation.challenge_description;


            updateChallengeButton(
                motivation.challenge_completed
            );

        } else {

            checkChallengeStatus();
        }

    } catch (error) {

        console.error(
            "Unable to create today's motivation:",
            error
        );

        checkChallengeStatus();
    }
}


/* =========================================
   UPDATE CHALLENGE BUTTON
   ========================================= */

function updateChallengeButton(
    completed
) {

    if (!completeChallengeBtn) {

        return;
    }


    if (completed === true) {

        completeChallengeBtn.textContent =
            "✓ Completed";

        completeChallengeBtn.classList.add(
            "completed"
        );

        completeChallengeBtn.disabled =
            true;

    } else {

        completeChallengeBtn.textContent =
            "Mark Complete";

        completeChallengeBtn.classList.remove(
            "completed"
        );

        completeChallengeBtn.disabled =
            false;
    }
}


/* =========================================
   CHECK CHALLENGE STATUS
   ========================================= */

function checkChallengeStatus() {

    /*
        Backend is the main source of truth.

        The localStorage check below is kept
        only as a temporary fallback so the
        existing page still behaves correctly
        if the backend is unavailable.
    */

    if (!completeChallengeBtn) {

        return;
    }


    const key =
        `fitai-challenge-${getTodayKey()}`;


    const completed =
        localStorage.getItem(key) ===
        "true";


    updateChallengeButton(
        completed
    );
}


/* =========================================
   COMPLETE CHALLENGE
   ========================================= */

async function completeChallenge() {

    if (!completeChallengeBtn) {

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

        completeChallengeBtn.disabled =
            true;


        const data =
            await apiRequest(
                "/api/motivation/today/complete",
                {
                    method: "PUT"
                }
            );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to complete challenge."
            );
        }


        /*
            Keep local fallback in sync.
        */

        const key =
            `fitai-challenge-${getTodayKey()}`;


        localStorage.setItem(
            key,
            "true"
        );


        updateChallengeButton(
            true
        );

    } catch (error) {

        console.error(
            "Complete challenge error:",
            error
        );


        completeChallengeBtn.disabled =
            false;


        alert(
            error.message ||
            "Unable to complete today's challenge."
        );
    }
}


/* =========================================
   THEME
   ========================================= */

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


/* =========================================
   LOAD SAVED THEME
   ========================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "fitai-theme"
        );


    if (savedTheme === "dark") {

        applyTheme("dark");

    } else {

        applyTheme("light");
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
        "fitai-theme",
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


            const mobileName =
                document.createElement(
                    "span"
                );


            mobileName.textContent =
                currentUser.name;


            mobileName.className =
                "mobile-user-name";


            mobileUserArea.appendChild(
                mobileName
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

async function logout() {

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
   CLOSE MOBILE SIDEBAR
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
   CLOSE SIDEBAR WHEN CLICKING OUTSIDE
   ========================================= */

document.addEventListener(
    "click",
    (event) => {

        if (
            !sidebar ||
            !menuToggle
        ) {

            return;
        }


        const isMobile =
            window.innerWidth <= 850;


        if (!isMobile) {

            return;
        }


        const clickedInsideSidebar =
            sidebar.contains(
                event.target
            );


        const clickedMenu =
            menuToggle.contains(
                event.target
            );


        if (
            sidebar.classList.contains("open") &&
            !clickedInsideSidebar &&
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

if (newMotivationBtn) {

    newMotivationBtn.addEventListener(
        "click",
        showRandomMotivation
    );
}


if (completeChallengeBtn) {

    completeChallengeBtn.addEventListener(
        "click",
        completeChallenge
    );
}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        toggleTheme
    );
}


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        (event) => {

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

        showDailyQuote();

        await loadDailyChallenge();

        closeSidebarOnNavigation();

    }
);

