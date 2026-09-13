/* ==========================================
   FITAI PROFILE JAVASCRIPT
========================================== */

const API_BASE_URL = "http://127.0.0.1:5000";


/* ==========================================
   ELEMENTS
========================================== */

const profileForm = document.getElementById("profileForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const genderInput = document.getElementById("gender");
const ageInput = document.getElementById("age");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const activityInput = document.getElementById("activityLevel");
const workoutDurationInput =
    document.getElementById("workoutDuration");

const formMessage = document.getElementById("formMessage");

const resetProfileButton =
    document.getElementById("resetProfile");

const authButtons =
    document.getElementById("authButtons");

const profileWrapper =
    document.getElementById("profileWrapper");

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");

const logoutButton =
    document.getElementById("logoutButton");

const headerUserName =
    document.getElementById("headerUserName");

const headerAvatar =
    document.getElementById("headerAvatar");

const profileAvatar =
    document.getElementById("profileAvatar");

const profileDisplayName =
    document.getElementById("profileDisplayName");

const profileDisplayEmail =
    document.getElementById("profileDisplayEmail");

const loginWarning =
    document.getElementById("loginWarning");

const accountStatus =
    document.getElementById("accountStatus");

const accountStatusBadge =
    document.getElementById("accountStatusBadge");

const accountEmail =
    document.getElementById("accountEmail");

const bmiValue =
    document.getElementById("bmiValue");

const bmiStatus =
    document.getElementById("bmiStatus");

const waterGoalValue =
    document.getElementById("waterGoalValue");

const activityValue =
    document.getElementById("activityValue");

const durationValue =
    document.getElementById("durationValue");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const themeText =
    document.getElementById("themeText");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


/* ==========================================
   STORAGE KEYS
========================================== */

const CURRENT_USER_KEY = "fitai-current-user";
const PROFILE_KEY = "fitai-profile";
const WATER_GOAL_KEY = "fitai-water-goal";
const THEME_KEY = "fitai-theme";


/* ==========================================
   GET TOKEN
========================================== */

function getToken() {

    return localStorage.getItem("fitai-token");

}


/* ==========================================
   GET CURRENT USER
========================================== */

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(CURRENT_USER_KEY)
        ) || null;

    } catch (error) {

        return null;

    }

}


/* ==========================================
   GET SAVED PROFILE
========================================== */

function getSavedProfile() {

    try {

        return JSON.parse(
            localStorage.getItem(PROFILE_KEY)
        ) || {};

    } catch (error) {

        return {};

    }

}


/* ==========================================
   AVATAR
========================================== */

function getInitial(name) {

    if (!name || !name.trim()) {
        return "A";
    }

    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


/* ==========================================
   UPDATE HEADER
========================================== */

function updateHeader() {

    const user = getCurrentUser();

    if (!user) {

        authButtons.style.display = "flex";
        profileWrapper.style.display = "none";

        return;

    }

    authButtons.style.display = "none";
    profileWrapper.style.display = "block";

    const name =
        user.name ||
        "User";

    const initial =
        getInitial(name);

    headerUserName.textContent = name;
    headerAvatar.textContent = initial;

}


/* ==========================================
   LOAD PROFILE FROM BACKEND
========================================== */

async function loadProfile() {

    const token = getToken();

    if (!token) {

        loginWarning.style.display = "flex";

        profileDisplayName.textContent =
            "Your Profile";

        profileDisplayEmail.textContent =
            "Login to manage your profile";

        accountStatus.textContent =
            "Not logged in";

        accountStatusBadge.textContent =
            "Offline";

        accountStatusBadge.classList.remove(
            "online"
        );

        accountEmail.textContent = "--";

        nameInput.value = "";
        emailInput.value = "";

        genderInput.value = "";
        ageInput.value = "";
        heightInput.value = "";
        weightInput.value = "";
        activityInput.value = "";
        workoutDurationInput.value = "";

        profileAvatar.textContent = "A";

        calculateAndDisplayBMI();

        waterGoalValue.textContent = "-- ml";
        activityValue.textContent = "--";
        durationValue.textContent = "-- min";

        return;

    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/profile`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Unable to load profile."
            );

        }

        const user = data.user;

        /* Save latest user information locally */

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify({
                name: user.name,
                email: user.email
            })
        );


        /* --------------------------------------
           LOGGED IN
        -------------------------------------- */

        loginWarning.style.display = "none";

        const name =
            user.name ||
            "User";

        const email =
            user.email ||
            "";


        profileDisplayName.textContent =
            name;

        profileDisplayEmail.textContent =
            email;

        profileAvatar.textContent =
            getInitial(name);


        /* Account */

        accountStatus.textContent =
            "Logged in";

        accountStatusBadge.textContent =
            "Online";

        accountStatusBadge.classList.add(
            "online"
        );

        accountEmail.textContent =
            email;


        /* Form */

        nameInput.value =
            user.name || "";

        emailInput.value =
            email;

        genderInput.value =
            user.gender || "";

        ageInput.value =
            user.age ?? "";

        heightInput.value =
            user.height ?? "";

        weightInput.value =
            user.weight ?? "";


        /* Activity and workout duration
           remain frontend values for now */

        const localProfile =
            getSavedProfile();

        activityInput.value =
            localProfile.activityLevel || "";

        workoutDurationInput.value =
            localProfile.workoutDuration || "";


        /* Summary */

        activityValue.textContent =
            localProfile.activityLevel || "--";


        if (
            localProfile.workoutDuration !== undefined &&
            localProfile.workoutDuration !== ""
        ) {

            durationValue.textContent =
                `${localProfile.workoutDuration} min`;

        } else {

            durationValue.textContent =
                "-- min";

        }


        /* Water goal */

        const savedWaterGoal =
            localStorage.getItem(
                WATER_GOAL_KEY
            );

        if (savedWaterGoal) {

            waterGoalValue.textContent =
                `${Number(savedWaterGoal).toLocaleString()} ml`;

        } else {

            waterGoalValue.textContent =
                "-- ml";

        }


        calculateAndDisplayBMI();


        /* Save local profile copy */

        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify({
                name: user.name || "",
                gender: user.gender || "",
                age: user.age ?? "",
                height: user.height ?? "",
                weight: user.weight ?? "",
                activityLevel:
                    localProfile.activityLevel || "",
                workoutDuration:
                    localProfile.workoutDuration || ""
            })
        );


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        localStorage.removeItem(
            CURRENT_USER_KEY
        );

        localStorage.removeItem(
            "fitai-token"
        );

        window.location.href = "login.html";

    }

}


/* ==========================================
   CALCULATE BMI
========================================== */

function calculateBMI(height, weight) {

    const heightNumber =
        Number(height);

    const weightNumber =
        Number(weight);


    if (
        !heightNumber ||
        !weightNumber ||
        heightNumber <= 0 ||
        weightNumber <= 0
    ) {

        return null;

    }


    const heightMeters =
        heightNumber / 100;


    return (
        weightNumber /
        (heightMeters * heightMeters)
    );

}


/* ==========================================
   BMI STATUS
========================================== */

function getBMIStatus(bmi) {

    if (bmi < 18.5) {

        return "Underweight";

    }

    if (bmi < 25) {

        return "Healthy range";

    }

    if (bmi < 30) {

        return "Overweight";

    }

    return "Obesity range";

}


/* ==========================================
   DISPLAY BMI
========================================== */

function calculateAndDisplayBMI() {

    const bmi =
        calculateBMI(
            heightInput.value,
            weightInput.value
        );


    if (bmi === null) {

        bmiValue.textContent = "--";

        bmiStatus.textContent =
            "Add height & weight";

        return;

    }


    bmiValue.textContent =
        bmi.toFixed(1);

    bmiStatus.textContent =
        getBMIStatus(bmi);

}


/* ==========================================
   WATER GOAL CALCULATION
========================================== */

function calculateWaterGoal(
    gender,
    weight,
    activityLevel,
    workoutDuration
) {

    const weightNumber =
        Number(weight);

    const durationNumber =
        Number(workoutDuration) || 0;


    if (
        !weightNumber ||
        weightNumber <= 0
    ) {

        return null;

    }


    let basePerKg = 34;


    if (gender === "Male") {

        basePerKg = 35;

    } else if (gender === "Female") {

        basePerKg = 33;

    }


    let goal =
        weightNumber * basePerKg;


    const activityBonus = {

        Sedentary: 0,
        Light: 200,
        Moderate: 400,
        Active: 600,
        "Very Active": 800

    };


    goal +=
        activityBonus[activityLevel] || 0;


    goal +=
        durationNumber * 12;


    goal =
        Math.max(
            goal,
            1500
        );


    goal =
        Math.min(
            goal,
            6000
        );


    goal =
        Math.round(
            goal / 50
        ) * 50;


    return goal;

}


/* ==========================================
   UPDATE WATER GOAL
========================================== */

function updateWaterGoal() {

    const goal =
        calculateWaterGoal(
            genderInput.value,
            weightInput.value,
            activityInput.value,
            workoutDurationInput.value
        );


    if (goal === null) {

        waterGoalValue.textContent =
            "-- ml";

        return;

    }


    localStorage.setItem(
        WATER_GOAL_KEY,
        goal
    );


    waterGoalValue.textContent =
        `${goal.toLocaleString()} ml`;

}


/* ==========================================
   SAVE PROFILE TO BACKEND
========================================== */

profileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const token =
            getToken();


        if (!token) {

            showMessage(
                "Please login before saving your profile.",
                "error"
            );

            return;

        }


        const name =
            nameInput.value.trim();

        const gender =
            genderInput.value;

        const age =
            ageInput.value;

        const height =
            heightInput.value;

        const weight =
            weightInput.value;

        const activityLevel =
            activityInput.value;

        const workoutDuration =
            workoutDurationInput.value;


        /* Validate name */

        if (!name) {

            showMessage(
                "Please enter your name.",
                "error"
            );

            nameInput.focus();

            return;

        }


        /* Validate age */

        if (
            age &&
            (
                Number(age) < 10 ||
                Number(age) > 100
            )
        ) {

            showMessage(
                "Please enter a valid age.",
                "error"
            );

            ageInput.focus();

            return;

        }


        /* Validate height */

        if (
            height &&
            (
                Number(height) < 50 ||
                Number(height) > 250
            )
        ) {

            showMessage(
                "Please enter a valid height.",
                "error"
            );

            heightInput.focus();

            return;

        }


        /* Validate weight */

        if (
            weight &&
            (
                Number(weight) < 20 ||
                Number(weight) > 300
            )
        ) {

            showMessage(
                "Please enter a valid weight.",
                "error"
            );

            weightInput.focus();

            return;

        }


        /* Calculate BMI */

        const calculatedBMI =
            calculateBMI(
                height,
                weight
            );


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        "Authorization":
                            `Bearer ${token}`
                    },
                    body: JSON.stringify({

                        name: name,

                        gender: gender,

                        age: age
                            ? Number(age)
                            : null,

                        height: height
                            ? Number(height)
                            : null,

                        weight: weight
                            ? Number(weight)
                            : null,

                        bmi: calculatedBMI
                            ? Number(
                                calculatedBMI.toFixed(1)
                            )
                            : null

                    })
                }
            );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Profile update failed."
                );

            }


            /* Save activity information locally
               until its backend field is added */

            const profile = {

                name: name,

                gender: gender,

                age: age,

                height: height,

                weight: weight,

                activityLevel:
                    activityLevel,

                workoutDuration:
                    workoutDuration

            };


            localStorage.setItem(
                PROFILE_KEY,
                JSON.stringify(profile)
            );


            /* Update current user */

            const updatedUser = {

                name: name,

                email:
                    emailInput.value

            };


            localStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify(updatedUser)
            );


            /* Update water */

            updateWaterGoal();


            /* Update UI */

            updateHeader();

            await loadProfile();


            showMessage(
                "Profile saved successfully!",
                "success"
            );


        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            showMessage(
                error.message ||
                "Unable to save profile.",
                "error"
            );

        }

    }
);


/* ==========================================
   FORM LIVE BMI
========================================== */

heightInput.addEventListener(
    "input",
    calculateAndDisplayBMI
);

weightInput.addEventListener(
    "input",
    function () {

        calculateAndDisplayBMI();

        updateWaterGoal();

    }
);

genderInput.addEventListener(
    "change",
    updateWaterGoal
);

activityInput.addEventListener(
    "change",
    updateWaterGoal
);

workoutDurationInput.addEventListener(
    "input",
    updateWaterGoal
);


/* ==========================================
   SHOW MESSAGE
========================================== */

function showMessage(
    text,
    type
) {

    formMessage.textContent =
        text;


    if (type === "success") {

        formMessage.style.color =
            "#16a34a";

    } else {

        formMessage.style.color =
            "#dc2626";

    }


    clearTimeout(
        window.profileMessageTimer
    );


    window.profileMessageTimer =
        setTimeout(
            function () {

                formMessage.textContent =
                    "";

            },
            3000
        );

}


/* ==========================================
   RESET PROFILE
========================================== */

resetProfileButton.addEventListener(
    "click",
    async function () {

        const token =
            getToken();


        if (!token) {

            loadProfile();

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/profile`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to reset profile."
                );

            }


            const user =
                data.user;


            nameInput.value =
                user.name || "";

            genderInput.value =
                user.gender || "";

            ageInput.value =
                user.age ?? "";

            heightInput.value =
                user.height ?? "";

            weightInput.value =
                user.weight ?? "";


            const localProfile =
                getSavedProfile();


            activityInput.value =
                localProfile.activityLevel || "";

            workoutDurationInput.value =
                localProfile.workoutDuration || "";


            calculateAndDisplayBMI();

            updateWaterGoal();


            showMessage(
                "Changes were reset.",
                "success"
            );


        } catch (error) {

            console.error(
                "Reset profile error:",
                error
            );

            showMessage(
                "Unable to reset profile.",
                "error"
            );

        }

    }
);


/* ==========================================
   PROFILE DROPDOWN
========================================== */

profileButton.addEventListener(
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
    function (event) {

        if (
            !profileWrapper.contains(event.target)
        ) {

            profileDropdown.classList.remove(
                "show"
            );

        }

    }
);


/* ==========================================
   LOGOUT
========================================== */

logoutButton.addEventListener(
    "click",
    async function () {

        const token =
            getToken();


        if (token) {

            try {

                await fetch(
                    `${API_BASE_URL}/api/auth/logout`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }


        localStorage.removeItem(
            CURRENT_USER_KEY
        );

        localStorage.removeItem(
            "fitai-token"
        );


        profileDropdown.classList.remove(
            "show"
        );


        updateHeader();

        loadProfile();

    }
);


/* ==========================================
   THEME
========================================== */

function applyTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeIcon.textContent = "☀️";

        themeText.textContent =
            "Light Mode";

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        themeIcon.textContent = "🌙";

        themeText.textContent =
            "Dark Mode";

    }

}


themeToggle.addEventListener(
    "click",
    function () {

        const isDark =
            document.body.classList.toggle(
                "dark-mode"
            );


        if (isDark) {

            localStorage.setItem(
                THEME_KEY,
                "dark"
            );

            themeIcon.textContent =
                "☀️";

            themeText.textContent =
                "Light Mode";

        } else {

            localStorage.setItem(
                THEME_KEY,
                "light"
            );

            themeIcon.textContent =
                "🌙";

            themeText.textContent =
                "Dark Mode";

        }

    }
);


/* ==========================================
   MOBILE SIDEBAR
========================================== */

mobileMenu.addEventListener(
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


/* ==========================================
   CLOSE SIDEBAR WHEN LINK CLICKED
========================================== */

document
    .querySelectorAll(".sidebar-nav a")
    .forEach(
        function (link) {

            link.addEventListener(
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

        }
    );


/* ==========================================
   INITIALIZE
========================================== */

applyTheme();

updateHeader();

loadProfile();