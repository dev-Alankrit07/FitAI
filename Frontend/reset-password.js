/* =========================================
   FITAI RESET PASSWORD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const resetForm =
        document.getElementById("resetPasswordForm");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const newPasswordToggle =
        document.getElementById("newPasswordToggle");

    const confirmPasswordToggle =
        document.getElementById("confirmPasswordToggle");

    const errorMessage =
        document.getElementById("errorMessage");

    const successMessage =
        document.getElementById("successMessage");

    const resetButton =
        document.getElementById("resetButton");

    const lengthRequirement =
        document.getElementById("lengthRequirement");

    const letterRequirement =
        document.getElementById("letterRequirement");

    const numberRequirement =
        document.getElementById("numberRequirement");

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
       PASSWORD TOGGLE
    ========================================= */

    function setupPasswordToggle(
        input,
        button
    ) {

        if (!input || !button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                const isPassword =
                    input.type === "password";


                if (isPassword) {

                    input.type = "text";

                    button.textContent = "🙈";

                } else {

                    input.type = "password";

                    button.textContent = "👁️";

                }

            }
        );

    }


    setupPasswordToggle(
        newPassword,
        newPasswordToggle
    );


    setupPasswordToggle(
        confirmPassword,
        confirmPasswordToggle
    );


    /* =========================================
       PASSWORD REQUIREMENTS
    ========================================= */

    function updatePasswordRequirements() {

        const password =
            newPassword.value;


        const hasLength =
            password.length >= 8;


        const hasLetter =
            /[A-Za-z]/.test(password);


        const hasNumber =
            /[0-9]/.test(password);


        updateRequirement(
            lengthRequirement,
            hasLength
        );


        updateRequirement(
            letterRequirement,
            hasLetter
        );


        updateRequirement(
            numberRequirement,
            hasNumber
        );


        return (
            hasLength &&
            hasLetter &&
            hasNumber
        );
    }


    function updateRequirement(
        element,
        valid
    ) {

        if (!element) {
            return;
        }


        const icon =
            element.querySelector("span");


        if (valid) {

            element.classList.add("valid");

            icon.textContent = "✓";

        } else {

            element.classList.remove("valid");

            icon.textContent = "○";

        }

    }


    if (newPassword) {

        newPassword.addEventListener(
            "input",
            updatePasswordRequirements
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
       GET RESET EMAIL
    ========================================= */

    const resetEmail =
        localStorage.getItem(
            "fitai-reset-email"
        );


    /*
     * If the user directly opens this page
     * without going through Forgot Password,
     * send them back to the recovery page.
     */

    if (!resetEmail) {

        showError(
            "Password reset session not found. Please start again."
        );


        if (resetButton) {
            resetButton.disabled = true;
        }

    }


    /* =========================================
       GET USERS
    ========================================= */

    function getUsers() {

        try {

            const storedUsers =
                localStorage.getItem(
                    "fitai-users"
                );


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
       SAVE USERS
    ========================================= */

    function saveUsers(users) {

        localStorage.setItem(
            "fitai-users",
            JSON.stringify(users)
        );

    }


    /* =========================================
       RESET PASSWORD
    ========================================= */

    if (resetForm) {

        resetForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                clearMessages();


                const password =
                    newPassword.value;


                const confirm =
                    confirmPassword.value;


                /* Password requirements */

                const validPassword =
                    updatePasswordRequirements();


                if (!validPassword) {

                    showError(
                        "Password must contain at least 8 characters, one letter and one number."
                    );

                    return;
                }


                /* Match */

                if (password !== confirm) {

                    showError(
                        "Passwords do not match."
                    );

                    return;
                }


                /* Reset email */

                if (!resetEmail) {

                    showError(
                        "Password reset session has expired. Please start again."
                    );

                    return;
                }


                resetButton.disabled = true;

                resetButton.querySelector("span")
                    .textContent =
                    "Updating...";


                const users =
                    getUsers();


                const userIndex =
                    users.findIndex(
                        user =>
                            user.email &&
                            user.email.toLowerCase() ===
                            resetEmail.toLowerCase()
                    );


                setTimeout(() => {

                    if (userIndex === -1) {

                        showError(
                            "Account could not be found. Please start the password recovery process again."
                        );


                        resetButton.disabled = false;

                        resetButton.querySelector("span")
                            .textContent =
                            "Reset Password";

                        return;
                    }


                    /*
                     * Temporary frontend implementation.
                     *
                     * Backend version will replace this
                     * with a secure hashed password update
                     * through Flask + MongoDB.
                     */

                    users[userIndex].password =
                        password;


                    saveUsers(users);


                    /*
                     * Remove reset session so the
                     * reset page cannot be reused.
                     */

                    localStorage.removeItem(
                        "fitai-reset-email"
                    );


                    showSuccess(
                        "Your password has been reset successfully."
                    );


                    resetButton.querySelector("span")
                        .textContent =
                        "Password Updated ✓";


                    setTimeout(() => {

                        window.location.href =
                            "login.html";

                    }, 1200);


                }, 500);

            }
        );

    }


    /* =========================================
       CONFIRM PASSWORD VALIDATION
    ========================================= */

    if (confirmPassword) {

        confirmPassword.addEventListener(
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