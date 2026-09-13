/* ==========================================
   FITAI WORKOUT JAVASCRIPT
========================================== */


/* ==========================================
   API
========================================== */

const API_BASE_URL = "http://127.0.0.1:5000";


/* ==========================================
   WORKOUT DATA
========================================== */

const workoutOptions = {

    "Chest": [
        "Bench Press",
        "Incline Bench Press",
        "Decline Bench Press",
        "Push Ups",
        "Dumbbell Fly",
        "Cable Crossover",
        "Chest Press"
    ],

    "Back": [
        "Pull Ups",
        "Lat Pulldown",
        "Barbell Row",
        "Dumbbell Row",
        "Seated Cable Row",
        "Deadlift",
        "T-Bar Row"
    ],

    "Shoulders": [
        "Shoulder Press",
        "Dumbbell Shoulder Press",
        "Lateral Raises",
        "Front Raises",
        "Rear Delt Fly",
        "Arnold Press",
        "Face Pulls"
    ],

    "Arms": [
        "Bicep Curls",
        "Hammer Curls",
        "Preacher Curls",
        "Tricep Pushdown",
        "Tricep Dips",
        "Skull Crushers",
        "Close Grip Bench Press"
    ],

    "Legs": [
        "Squats",
        "Leg Press",
        "Lunges",
        "Leg Extension",
        "Leg Curl",
        "Calf Raises",
        "Romanian Deadlift"
    ],

    "Core": [
        "Crunches",
        "Sit Ups",
        "Plank",
        "Leg Raises",
        "Russian Twists",
        "Mountain Climbers",
        "Bicycle Crunches"
    ],

    "Cardio": [
        "Running",
        "Walking",
        "Cycling",
        "Treadmill",
        "Jump Rope",
        "Stair Climber",
        "Rowing"
    ],

    "Full Body": [
        "Burpees",
        "Jump Squats",
        "Kettlebell Swing",
        "Clean and Press",
        "Mountain Climbers",
        "Full Body Circuit",
        "HIIT"
    ]

};


/* ==========================================
   STORAGE KEYS
========================================== */

const THEME_STORAGE_KEY = "fitai-theme";
const CURRENT_USER_KEY = "fitai-current-user";
const TOKEN_STORAGE_KEY = "fitai-token";


/* ==========================================
   DOM ELEMENTS
========================================== */

const categorySelect =
    document.getElementById("category");

const workoutSelect =
    document.getElementById("workout");

const workoutForm =
    document.getElementById("workoutForm");

const setsInput =
    document.getElementById("sets");

const repsInput =
    document.getElementById("reps");

const weightInput =
    document.getElementById("weight");

const durationInput =
    document.getElementById("duration");

const notesInput =
    document.getElementById("notes");

const workoutList =
    document.getElementById("workoutList");

const todayWorkoutsElement =
    document.getElementById("todayWorkouts");

const totalWorkoutsElement =
    document.getElementById("totalWorkouts");

const todayDurationElement =
    document.getElementById("todayDuration");

const workoutCountElement =
    document.getElementById("workoutCount");

const toast =
    document.getElementById("toast");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const themeText =
    document.getElementById("themeText");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const clearFormBtn =
    document.getElementById("clearFormBtn");


/* ==========================================
   AUTH TOKEN
========================================== */

function getToken() {

    return localStorage.getItem(
        TOKEN_STORAGE_KEY
    );
}


/* ==========================================
   API REQUEST HELPER
========================================== */

async function apiRequest(
    url,
    options = {}
) {

    const token = getToken();

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
            TOKEN_STORAGE_KEY
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
   GET WORKOUTS FROM BACKEND
========================================== */

async function getWorkouts() {

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

            return data.workouts;
        }

        return [];

    } catch (error) {

        console.error(
            "Unable to load workouts:",
            error
        );

        showToast(
            error.message ||
            "Unable to load workouts."
        );

        return [];
    }
}


/* ==========================================
   TODAY'S DATE
========================================== */

function getTodayDate() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* ==========================================
   FORMAT DATE
========================================== */

function formatDate(dateValue) {

    if (!dateValue) {

        return "";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ==========================================
   CATEGORY → WORKOUT
========================================== */

categorySelect.addEventListener(
    "change",
    function () {

        const category =
            this.value;

        workoutSelect.innerHTML =
            '<option value="">Select Workout</option>';

        if (
            !category ||
            !workoutOptions[category]
        ) {

            workoutSelect.disabled =
                true;

            return;
        }

        workoutOptions[category].forEach(
            function (workout) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    workout;

                option.textContent =
                    workout;

                workoutSelect.appendChild(
                    option
                );
            }
        );

        workoutSelect.disabled =
            false;
    }
);


/* ==========================================
   ADD WORKOUT
========================================== */

workoutForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const category =
            categorySelect.value.trim();

        const workout =
            workoutSelect.value.trim();

        const sets =
            Number(setsInput.value);

        const reps =
            Number(repsInput.value);

        const weight =
            Number(weightInput.value) || 0;

        const duration =
            Number(durationInput.value) || 0;

        const notes =
            notesInput.value.trim();


        /* Validation */

        if (!category) {

            showToast(
                "Please select a category."
            );

            categorySelect.focus();

            return;
        }


        if (!workout) {

            showToast(
                "Please select a workout."
            );

            workoutSelect.focus();

            return;
        }


        if (!sets || sets < 1) {

            showToast(
                "Please enter valid sets."
            );

            setsInput.focus();

            return;
        }


        if (!reps || reps < 1) {

            showToast(
                "Please enter valid reps."
            );

            repsInput.focus();

            return;
        }


        if (weight < 0) {

            showToast(
                "Weight cannot be negative."
            );

            weightInput.focus();

            return;
        }


        if (duration < 0) {

            showToast(
                "Duration cannot be negative."
            );

            durationInput.focus();

            return;
        }


        /* Check authentication */

        if (!getToken()) {

            showToast(
                "Please login first."
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


        /* Save to backend */

        try {

            const data =
                await apiRequest(
                    "/api/workouts",
                    {
                        method: "POST",

                        body: JSON.stringify({

                            category:
                                category,

                            workout:
                                workout,

                            sets:
                                sets,

                            reps:
                                reps,

                            weight:
                                weight,

                            duration:
                                duration,

                            notes:
                                notes
                        })
                    }
                );


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to save workout."
                );
            }


            /* Reset */

            workoutForm.reset();

            workoutSelect.innerHTML =
                '<option value="">Select Workout</option>';

            workoutSelect.disabled =
                true;


            /* Refresh */

            await renderWorkouts();

            await updateStats();


            showToast(
                "Workout saved successfully! 💪"
            );

        } catch (error) {

            console.error(
                "Save workout error:",
                error
            );

            showToast(
                error.message ||
                "Unable to save workout."
            );
        }

    }
);


/* ==========================================
   RENDER WORKOUTS
========================================== */

async function renderWorkouts() {

    const workouts =
        await getWorkouts();

    workoutCountElement.textContent =
        workouts.length;


    if (workouts.length === 0) {

        workoutList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🏋️
                </div>

                <h3>
                    No workouts yet
                </h3>

                <p>
                    Add your first workout above to start
                    tracking your fitness journey.
                </p>

            </div>
        `;

        return;
    }


    workoutList.innerHTML =
        workouts.map(
            function (item) {

                return `

                    <div class="workout-item">

                        <div class="workout-main">

                            <div class="workout-item-icon">
                                ${getCategoryIcon(
                                    item.category
                                )}
                            </div>

                            <div class="workout-info">

                                <h3>
                                    ${escapeHTML(
                                        item.workout
                                    )}
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        item.category
                                    )}

                                    •

                                    ${formatDate(
                                        item.created_at ||
                                        item.createdAt
                                    )}

                                    ${
                                        item.notes
                                            ? ` • ${escapeHTML(
                                                item.notes
                                            )}`
                                            : ""
                                    }
                                </p>

                            </div>

                        </div>


                        <div class="workout-meta">

                            <span>
                                <strong>
                                    ${item.sets}
                                </strong>
                                sets
                            </span>

                            <span>
                                <strong>
                                    ${item.reps}
                                </strong>
                                reps
                            </span>

                            ${
                                Number(item.weight) > 0
                                    ? `
                                        <span>
                                            <strong>
                                                ${item.weight}
                                            </strong>
                                            kg
                                        </span>
                                    `
                                    : ""
                            }

                            ${
                                Number(item.duration) > 0
                                    ? `
                                        <span>
                                            <strong>
                                                ${item.duration}
                                            </strong>
                                            min
                                        </span>
                                    `
                                    : ""
                            }

                            <button
                                class="delete-workout"
                                onclick="deleteWorkout('${item._id}')"
                                title="Delete workout"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>
                `;
            }
        ).join("");
}


/* ==========================================
   CATEGORY ICON
========================================== */

function getCategoryIcon(category) {

    const icons = {

        "Chest": "🏋️",

        "Back": "💪",

        "Shoulders": "🏋️",

        "Arms": "💪",

        "Legs": "🦵",

        "Core": "🔥",

        "Cardio": "🏃",

        "Full Body": "⚡"
    };

    return icons[category] || "🏋️";
}


/* ==========================================
   DELETE WORKOUT
========================================== */

async function deleteWorkout(id) {

    if (!id) {

        showToast(
            "Invalid workout."
        );

        return;
    }


    try {

        const data =
            await apiRequest(
                `/api/workouts/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to delete workout."
            );
        }


        await renderWorkouts();

        await updateStats();


        showToast(
            "Workout deleted."
        );

    } catch (error) {

        console.error(
            "Delete workout error:",
            error
        );

        showToast(
            error.message ||
            "Unable to delete workout."
        );
    }
}


/* ==========================================
   UPDATE STATS
========================================== */

async function updateStats() {

    const workouts =
        await getWorkouts();

    const today =
        getTodayDate();


    const todayWorkouts =
        workouts.filter(
            function (workout) {

                const workoutDate =
                    workout.created_at ||
                    workout.createdAt;

                if (!workoutDate) {

                    return false;
                }

                const date =
                    new Date(workoutDate);

                if (
                    Number.isNaN(
                        date.getTime()
                    )
                ) {

                    return false;
                }

                const year =
                    date.getFullYear();

                const month =
                    String(
                        date.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        date.getDate()
                    ).padStart(2, "0");

                const formattedDate =
                    `${year}-${month}-${day}`;

                return formattedDate === today;
            }
        );


    const todayDuration =
        todayWorkouts.reduce(
            function (total, workout) {

                return (
                    total +
                    (
                        Number(
                            workout.duration
                        ) || 0
                    )
                );

            },
            0
        );


    todayWorkoutsElement.textContent =
        todayWorkouts.length;

    totalWorkoutsElement.textContent =
        workouts.length;

    todayDurationElement.textContent =
        `${todayDuration} min`;
}


/* ==========================================
   THEME
========================================== */

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeIcon.textContent =
            "☀️";

        themeText.textContent =
            "Light Mode";

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        themeIcon.textContent =
            "🌙";

        themeText.textContent =
            "Dark Mode";
    }
}


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_STORAGE_KEY
        );

    applyTheme(
        savedTheme === "dark"
            ? "dark"
            : "light"
    );
}


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
            THEME_STORAGE_KEY,
            newTheme
        );

        applyTheme(
            newTheme
        );
    }
);


/* ==========================================
   USER / AUTH
========================================== */

function renderUserSection() {

    const userSection =
        document.getElementById(
            "userSection"
        );

    if (!userSection) {

        return;
    }


    let currentUser =
        null;


    try {

        const storedUser =
            localStorage.getItem(
                CURRENT_USER_KEY
            );

        if (storedUser) {

            currentUser =
                JSON.parse(
                    storedUser
                );
        }

    } catch (error) {

        currentUser =
            null;
    }


    /* Logged out */

    if (!currentUser) {

        userSection.innerHTML = `

            <div class="auth-buttons">

                <a
                    href="login.html"
                    class="auth-btn login-btn"
                >
                    Login
                </a>

                <a
                    href="register.html"
                    class="auth-btn register-btn"
                >
                    Register
                </a>

            </div>
        `;

        return;
    }


    /* Logged in */

    const name =
        currentUser.name ||
        "User";

    const initial =
        name
            .charAt(0)
            .toUpperCase();


    userSection.innerHTML = `

        <div class="user-menu">

            <button
                class="user-button"
                id="userButton"
            >

                <span class="user-avatar">
                    ${escapeHTML(initial)}
                </span>

                <span class="user-name">
                    ${escapeHTML(name)}
                </span>

                <span>
                    ⌄
                </span>

            </button>


            <div
                class="user-dropdown"
                id="userDropdown"
            >

                <a href="profile.html">
                    👤 Profile
                </a>

                <button
                    class="logout"
                    id="logoutButton"
                >
                    🚪 Logout
                </button>

            </div>

        </div>
    `;


    const userButton =
        document.getElementById(
            "userButton"
        );

    const userDropdown =
        document.getElementById(
            "userDropdown"
        );


    userButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            userDropdown.classList.toggle(
                "show"
            );
        }
    );


    document.addEventListener(
        "click",
        function () {

            userDropdown.classList.remove(
                "show"
            );
        }
    );


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    logoutButton.addEventListener(
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
                TOKEN_STORAGE_KEY
            );


            showToast(
                "Logged out successfully."
            );


            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                600
            );
        }
    );
}


/* ==========================================
   MOBILE SIDEBAR
========================================== */

function openSidebar() {

    sidebar.classList.add(
        "open"
    );

    sidebarOverlay.classList.add(
        "show"
    );
}


function closeSidebar() {

    sidebar.classList.remove(
        "open"
    );

    sidebarOverlay.classList.remove(
        "show"
    );
}


mobileMenuBtn.addEventListener(
    "click",
    openSidebar
);


sidebarOverlay.addEventListener(
    "click",
    closeSidebar
);


/* Close after navigation */

document.querySelectorAll(
    ".sidebar-nav a"
).forEach(
    function (link) {

        link.addEventListener(
            "click",
            closeSidebar
        );
    }
);


/* ==========================================
   TOAST
========================================== */

let toastTimeout;


function showToast(message) {

    clearTimeout(
        toastTimeout
    );

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );


    toastTimeout =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
}


/* ==========================================
   CLEAR FORM
========================================== */

clearFormBtn.addEventListener(
    "click",
    function () {

        setTimeout(
            function () {

                workoutSelect.innerHTML =
                    '<option value="">Select Workout</option>';

                workoutSelect.disabled =
                    true;

            },
            0
        );
    }
);


/* ==========================================
   INITIALIZE
========================================== */

loadTheme();

renderUserSection();

renderWorkouts();

updateStats();