/* =========================================
   FITAI FORGOT PASSWORD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const forgotForm =
        document.getElementById("forgotPasswordForm");

    const emailInput =
        document.getElementById("email");

    const errorMessage =
        document.getElementById("errorMessage");

    const successMessage =
        document.getElementById("successMessage");

    const resetButton =
        document.getElementById("resetButton");

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");

    const themeText =
        document.getElementById("themeText");


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
                    isDark ? "dark" : "light"
                );


                if (isDark) {

                    themeIcon.textContent = "☀️";
                    themeText.textContent = "Light";

                } else {

                    themeIcon.textContent = "🌙";
                    themeText.textContent = "Dark";

                }

            }
        );

    }


    /* =========================================
       MESSAGE FUNCTIONS
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
       GET USERS
    ========================================= */

    function getUsers() {

        try {

            const storedUsers =
                localStorage.getItem("fitai-users");


            if (!storedUsers) {
                return [];
            }


            const users =
                JSON.parse(storedUsers);


            return Array.isArray(users)
                ? users
                : [];

        } catch (error) {

            console.error(
                "Unable to read FitAI users:",
                error
            );

            return [];
        }
    }


    /* =========================================
       FORGOT PASSWORD
    ========================================= */

    if (forgotForm) {

        forgotForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                clearMessages();


                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                if (!email) {

                    showError(
                        "Please enter your email address."
                    );

                    return;
                }


                /* Basic email validation */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    showError(
                        "Please enter a valid email address."
                    );

                    return;
                }


                resetButton.disabled = true;

                resetButton.querySelector("span")
                    .textContent = "Checking...";


                const users =
                    getUsers();


                const user =
                    users.find(
                        item =>
                            item.email &&
                            item.email.toLowerCase() === email
                    );


                setTimeout(() => {

                    if (!user) {

                        showError(
                            "No FitAI account was found with this email address."
                        );


                        resetButton.disabled = false;

                        resetButton.querySelector("span")
                            .textContent =
                            "Send Reset Link";

                        return;
                    }


                    /*
                     * Temporary frontend reset flow.
                     *
                     * Later this will become:
                     *
                     * Forgot Password
                     *       ↓
                     * Flask API
                     *       ↓
                     * Generate secure token
                     *       ↓
                     * Send email
                     *       ↓
                     * Reset Password page
                     */

                    localStorage.setItem(
                        "fitai-reset-email",
                        email
                    );


                    showSuccess(
                        "Account found. Redirecting you to reset your password..."
                    );


                    resetButton.querySelector("span")
                        .textContent =
                        "Account Found ✓";


                    setTimeout(() => {

                        window.location.href =
                            "reset-password.html";

                    }, 1000);


                }, 500);

            }
        );

    }


    /* =========================================
       CLEAR ERROR WHILE TYPING
    ========================================= */

    if (emailInput) {

        emailInput.addEventListener(
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

});