/* =========================================
   FITAI LOGIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const errorMessage =
        document.getElementById("errorMessage");

    const successMessage =
        document.getElementById("successMessage");

    const loginButton =
        document.getElementById("loginButton");

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");

    const themeText =
        document.getElementById("themeText");


    /* =========================================
       BACKEND
    ========================================= */

    const API_BASE_URL = "http://127.0.0.1:5000";


    /* =========================================
       THEME
    ========================================= */

    function loadTheme() {

        const savedTheme =
            localStorage.getItem("fitai-theme");

        if (savedTheme === "dark") {

            document.body.classList.add("dark-mode");

            themeIcon.textContent = "☀️";
            themeText.textContent = "Light";

        } else {

            document.body.classList.remove("dark-mode");

            themeIcon.textContent = "🌙";
            themeText.textContent = "Dark";
        }
    }


    loadTheme();


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");


            localStorage.setItem(
                "fitai-theme",
                isDark ? "dark" : "light"
            );


            if (isDark) {

                themeIcon.textContent = "☀️";
                themeText.textContent = "Light";

            } else {

                themeIcon.textContent = "🌙";
                themeText.textContent = "Dark";

            }

        });

    }


    /* =========================================
       PASSWORD SHOW / HIDE
    ========================================= */

    if (passwordToggle) {

        passwordToggle.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type === "password";


                if (isPassword) {

                    passwordInput.type = "text";

                    passwordToggle.textContent = "🙈";

                    passwordToggle.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    passwordInput.type = "password";

                    passwordToggle.textContent = "👁️";

                    passwordToggle.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }


    /* =========================================
       MESSAGE HELPERS
    ========================================= */

    function showError(message) {

        errorMessage.textContent = message;

        errorMessage.style.display = "block";

        successMessage.style.display = "none";
    }


    function showSuccess(message) {

        successMessage.textContent = message;

        successMessage.style.display = "block";

        errorMessage.style.display = "none";
    }


    function clearMessages() {

        errorMessage.textContent = "";

        successMessage.textContent = "";

        errorMessage.style.display = "none";

        successMessage.style.display = "none";
    }


    /* =========================================
       LOGIN
    ========================================= */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                clearMessages();


                const email =
                    emailInput.value.trim().toLowerCase();


                const password =
                    passwordInput.value;


                if (!email || !password) {

                    showError(
                        "Please enter your email and password."
                    );

                    return;
                }


                loginButton.disabled = true;

                loginButton.querySelector("span").textContent =
                    "Logging in...";


                try {

                    /* =========================================
                       BACKEND LOGIN
                    ========================================= */

                    const response =
                        await fetch(
                            `${API_BASE_URL}/api/auth/login`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify({
                                    email: email,
                                    password: password
                                })
                            }
                        );


                    const data =
                        await response.json();


                    /* =========================================
                       LOGIN FAILED
                    ========================================= */

                    if (!response.ok || !data.success) {

                        showError(
                            data.message ||
                            "Invalid email or password. Please try again."
                        );


                        loginButton.disabled = false;

                        loginButton.querySelector("span").textContent =
                            "Login";

                        return;
                    }


                    /* =========================================
                       LOGIN SUCCESS
                    ========================================= */

                    const currentUser = {

                        id:
                            data.user.id,

                        name:
                            data.user.name || "User",

                        email:
                            data.user.email

                    };


                    /* =========================================
                       SAVE JWT TOKEN
                    ========================================= */

                    localStorage.setItem(
                        "fitai-token",
                        data.token
                    );


                    /* =========================================
                       SAVE CURRENT USER
                    ========================================= */

                    localStorage.setItem(
                        "fitai-current-user",
                        JSON.stringify(currentUser)
                    );


                    showSuccess(
                        `Welcome back, ${currentUser.name}!`
                    );


                    loginButton.querySelector("span").textContent =
                        "Success ✓";


                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 700);


                } catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );


                    showError(
                        "Unable to connect to FitAI server. Please make sure the backend is running."
                    );


                    loginButton.disabled = false;

                    loginButton.querySelector("span").textContent =
                        "Login";
                }

            }
        );

    }


    /* =========================================
       CLEAR ERROR WHEN USER TYPES
    ========================================= */

    [emailInput, passwordInput].forEach(
        input => {

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

        }
    );

});