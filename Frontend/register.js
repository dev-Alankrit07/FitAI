/* =========================================
   FITAI REGISTER JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const registerForm =
        document.getElementById("registerForm");

    const nameInput =
        document.getElementById("name");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const confirmPasswordToggle =
        document.getElementById(
            "confirmPasswordToggle"
        );

    const errorMessage =
        document.getElementById("errorMessage");

    const successMessage =
        document.getElementById("successMessage");

    const registerButton =
        document.getElementById("registerButton");

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");

    const themeText =
        document.getElementById("themeText");


    /* =========================================
       BACKEND
    ========================================== */

    const API_BASE_URL =
        "http://127.0.0.1:5000";

    const TOKEN_KEY =
        "fitai-token";

    const CURRENT_USER_KEY =
        "fitai-current-user";


    /* =========================================
       THEME
    ========================================== */

    function loadTheme() {

        const savedTheme =
            localStorage.getItem("fitai-theme");

        if (savedTheme === "dark") {

            document.body.classList.add(
                "dark-mode"
            );

            themeIcon.textContent = "☀️";
            themeText.textContent = "Light";

        } else {

            document.body.classList.remove(
                "dark-mode"
            );

            themeIcon.textContent = "🌙";
            themeText.textContent = "Dark";
        }
    }


    loadTheme();


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

                if (isDark) {

                    themeIcon.textContent =
                        "☀️";

                    themeText.textContent =
                        "Light";

                } else {

                    themeIcon.textContent =
                        "🌙";

                    themeText.textContent =
                        "Dark";
                }

            }
        );

    }


    /* =========================================
       PASSWORD SHOW / HIDE
    ========================================== */

    function setupPasswordToggle(
        toggle,
        input
    ) {

        if (!toggle || !input) {
            return;
        }

        toggle.addEventListener(
            "click",
            () => {

                const isPassword =
                    input.type === "password";

                if (isPassword) {

                    input.type = "text";

                    toggle.textContent =
                        "🙈";

                    toggle.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    input.type =
                        "password";

                    toggle.textContent =
                        "👁️";

                    toggle.setAttribute(
                        "aria-label",
                        "Show password"
                    );
                }

            }
        );
    }


    setupPasswordToggle(
        passwordToggle,
        passwordInput
    );

    setupPasswordToggle(
        confirmPasswordToggle,
        confirmPasswordInput
    );


    /* =========================================
       MESSAGE HELPERS
    ========================================== */

    function showError(message) {

        errorMessage.textContent =
            message;

        errorMessage.style.display =
            "block";

        successMessage.textContent =
            "";

        successMessage.style.display =
            "none";
    }


    function showSuccess(message) {

        successMessage.textContent =
            message;

        successMessage.style.display =
            "block";

        errorMessage.textContent =
            "";

        errorMessage.style.display =
            "none";
    }


    function clearMessages() {

        errorMessage.textContent =
            "";

        successMessage.textContent =
            "";

        errorMessage.style.display =
            "none";

        successMessage.style.display =
            "none";
    }


    /* =========================================
       REGISTER
    ========================================== */

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                clearMessages();


                /* =================================
                   GET FORM DATA
                ================================= */

                const name =
                    nameInput.value.trim();

                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();

                const password =
                    passwordInput.value;

                const confirmPassword =
                    confirmPasswordInput.value;


                /* =================================
                   VALIDATION
                ================================= */

                if (
                    !name ||
                    !email ||
                    !password ||
                    !confirmPassword
                ) {

                    showError(
                        "Please fill in all fields."
                    );

                    return;
                }


                if (
                    password !==
                    confirmPassword
                ) {

                    showError(
                        "Passwords do not match."
                    );

                    return;
                }


                if (
                    password.length < 6
                ) {

                    showError(
                        "Password must be at least 6 characters."
                    );

                    return;
                }


                /* =================================
                   BUTTON LOADING
                ================================= */

                registerButton.disabled =
                    true;

                registerButton
                    .querySelector("span")
                    .textContent =
                    "Creating Account...";


                try {

                    /* =============================
                       BACKEND REGISTER
                    ============================== */

                    const response =
                        await fetch(
                            `${API_BASE_URL}/api/auth/register`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        name:
                                            name,

                                        email:
                                            email,

                                        password:
                                            password
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    /* =============================
                       REGISTRATION FAILED
                    ============================== */

                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        showError(
                            data.message ||
                            "Registration failed. Please try again."
                        );

                        registerButton.disabled =
                            false;

                        registerButton
                            .querySelector(
                                "span"
                            )
                            .textContent =
                            "Create Account";

                        return;
                    }


                    /* =============================
                       REGISTRATION SUCCESS
                    ============================== */

                    const currentUser = {

                        id:
                            data.user?.id,

                        name:
                            data.user?.name ||
                            name,

                        email:
                            data.user?.email ||
                            email
                    };


                    /* =============================
                       SAVE TOKEN
                    ============================== */

                    if (data.token) {

                        localStorage.setItem(
                            TOKEN_KEY,
                            data.token
                        );
                    }


                    /* =============================
                       SAVE USER
                    ============================== */

                    localStorage.setItem(
                        CURRENT_USER_KEY,
                        JSON.stringify(
                            currentUser
                        )
                    );


                    /* =============================
                       SUCCESS MESSAGE
                    ============================== */

                    showSuccess(
                        `Welcome to FitAI, ${currentUser.name}!`
                    );


                    registerButton
                        .querySelector(
                            "span"
                        )
                        .textContent =
                        "Success ✓";


                    /* =============================
                       REDIRECT
                    ============================== */

                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 700);


                } catch (error) {

                    console.error(
                        "Registration error:",
                        error
                    );


                    showError(
                        "Unable to connect to FitAI server. Please make sure the backend is running."
                    );


                    registerButton.disabled =
                        false;

                    registerButton
                        .querySelector(
                            "span"
                        )
                        .textContent =
                        "Create Account";
                }

            }
        );

    }


    /* =========================================
       CLEAR ERROR WHEN USER TYPES
    ========================================== */

    [
        nameInput,
        emailInput,
        passwordInput,
        confirmPasswordInput

    ].forEach(input => {

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            () => {

                if (
                    errorMessage.style.display ===
                    "block"
                ) {

                    clearMessages();
                }

            }
        );

    });

});
