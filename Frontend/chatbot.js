/* =====================================================
   FITAI AI CHATBOT
===================================================== */


/* =========================
   ELEMENTS
========================= */

const chatMessages =
    document.getElementById("chatMessages");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");


/* HEADER */

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

const profileAvatar =
    document.getElementById("profileAvatar");

const headerProfileName =
    document.getElementById("headerProfileName");

const themeToggle =
    document.getElementById("themeToggle");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


/* =========================
   API
========================= */

const API_URL =
    "http://127.0.0.1:5000/api/chat";

const TOKEN_KEY =
    "fitai-token";

const CURRENT_USER_KEY =
    "fitai-current-user";


/* =========================
   CURRENT USER
========================= */

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CURRENT_USER_KEY
            )
        );

    } catch (error) {

        return null;

    }

}


/* =========================
   LOAD USER
========================= */

function loadUser() {

    const user =
        getCurrentUser();


    if (user && user.name) {

        authButtons.style.display =
            "none";

        profileArea.style.display =
            "block";

        headerProfileName.textContent =
            user.name;

        profileAvatar.textContent =
            user.name
                .charAt(0)
                .toUpperCase();

    } else {

        authButtons.style.display =
            "flex";

        profileArea.style.display =
            "none";

    }

}


/* =========================
   ADD MESSAGE
========================= */

function addMessage(
    text,
    sender
) {

    const message =
        document.createElement("div");


    message.className =
        `message ${sender}`;


    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        sender === "user"
            ? "👤"
            : "🤖";


    const content =
        document.createElement("div");

    content.className =
        "message-content";


    const paragraphs =
        String(text || "")
            .split(/\n+/)
            .filter(
                line =>
                    line.trim() !== ""
            );


    paragraphs.forEach(
        function (line) {

            const p =
                document.createElement("p");

            p.textContent =
                line;

            content.appendChild(p);

        }
    );


    message.appendChild(
        avatar
    );

    message.appendChild(
        content
    );


    chatMessages.appendChild(
        message
    );


    scrollToBottom();

}


/* =========================
   TYPING INDICATOR
========================= */

function showTyping() {

    const typing =
        document.createElement("div");

    typing.className =
        "message assistant";

    typing.id =
        "typingMessage";


    typing.innerHTML = `

        <div class="message-avatar">
            🤖
        </div>

        <div class="message-content">

            <div class="typing">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    `;


    chatMessages.appendChild(
        typing
    );


    scrollToBottom();

}


/* =========================
   REMOVE TYPING
========================= */

function removeTyping() {

    const typing =
        document.getElementById(
            "typingMessage"
        );


    if (typing) {

        typing.remove();

    }

}


/* =========================
   SCROLL
========================= */

function scrollToBottom() {

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =========================
   SEND MESSAGE
========================= */

async function sendMessage() {

    const message =
        messageInput.value.trim();


    if (!message) {

        return;

    }


    /* =========================
       CHECK LOGIN
    ========================= */

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    if (!token) {

        addMessage(
            "Please log in to use the FitAI AI Coach.",
            "assistant"
        );

        return;

    }


    /* =========================
       SHOW USER MESSAGE
    ========================= */

    addMessage(
        message,
        "user"
    );


    messageInput.value = "";

    sendBtn.disabled =
        true;


    showTyping();


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        message:
                            message

                    })

                }
            );


        const data =
            await response.json();


        removeTyping();


        /* =========================
           AUTHENTICATION ERROR
        ========================= */

        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                TOKEN_KEY
            );

            localStorage.removeItem(
                CURRENT_USER_KEY
            );

            addMessage(
                "Your session has expired. Please log in again.",
                "assistant"
            );

            return;

        }


        /* =========================
           OTHER API ERROR
        ========================= */

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Something went wrong."
            );

        }


        /* =========================
           AI RESPONSE
        ========================= */

        if (
            data.success &&
            data.response
        ) {

            addMessage(
                data.response,
                "assistant"
            );

        } else {

            throw new Error(
                data.message ||
                "The AI did not return a response."
            );

        }


    } catch (error) {

        removeTyping();


        console.error(
            "Chatbot error:",
            error
        );


        addMessage(
            "Sorry, I couldn't connect to the AI Coach right now. Please try again.",
            "assistant"
        );

    }


    sendBtn.disabled =
        false;

    messageInput.focus();

}


/* =========================
   SEND BUTTON
========================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* =========================
   ENTER TO SEND
========================= */

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================
   SUGGESTIONS
========================= */

document
    .querySelectorAll(
        ".suggestion-btn"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    messageInput.value =
                        this.dataset.message;

                    messageInput.focus();

                    sendMessage();

                }
            );

        }
    );


/* =========================
   PROFILE DROPDOWN
========================= */

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


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
    "click",
    async function () {

        const token =
            localStorage.getItem(
                TOKEN_KEY
            );


        if (token) {

            try {

                await fetch(
                    "http://127.0.0.1:5000/api/auth/logout",
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
            TOKEN_KEY
        );

        localStorage.removeItem(
            CURRENT_USER_KEY
        );


        window.location.href =
            "login.html";

    }
);


/* =========================
   THEME
========================= */

function loadTheme() {

    const theme =
        localStorage.getItem(
            "fitai-theme"
        );


    if (theme === "dark") {

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

        const isDark =
            document.body.classList.toggle(
                "dark-mode"
            );


        if (isDark) {

            localStorage.setItem(
                "fitai-theme",
                "dark"
            );

            themeToggle.textContent =
                "☀️";

        } else {

            localStorage.setItem(
                "fitai-theme",
                "light"
            );

            themeToggle.textContent =
                "🌙";

        }

    }
);


/* =========================
   MOBILE SIDEBAR
========================= */

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


/* =========================
   INITIALIZE
========================= */

loadUser();

loadTheme();

