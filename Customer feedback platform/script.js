/* =========================================================
   REVIEWIQ — MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const loginPage = document.getElementById("loginPage");
    const appPage = document.getElementById("appPage");
    const customerFeedbackPage = document.getElementById("customerFeedbackPage");

    const loginForm = document.getElementById("loginForm");
    const logoutButton = document.getElementById("logoutButton");

    const passwordToggle = document.getElementById("passwordToggle");
    const loginPassword = document.getElementById("loginPassword");

    const navItems = document.querySelectorAll(".nav-item");
    const contentPages = document.querySelectorAll(".content-page");

    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.querySelector(".sidebar");

    const filterButton = document.getElementById("filterButton");
    const filterBar = document.getElementById("filterBar");

    const sourceFilter = document.getElementById("sourceFilter");
    const sentimentFilter = document.getElementById("sentimentFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    const feedbackTableBody = document.getElementById("feedbackTableBody");

    const globalSearch = document.getElementById("globalSearch");

    const feedbackForm = document.getElementById("feedbackForm");
    const thankYouModal = document.getElementById("thankYouModal");
    const submitAnother = document.getElementById("submitAnother");

    const feedbackComment = document.getElementById("feedbackComment");
    const characterCount = document.getElementById("characterCount");

    const starRating = document.getElementById("starRating");
    const selectedRating = document.getElementById("selectedRating");

    const refreshInsights = document.getElementById("refreshInsights");


    /* =========================================================
       LOGIN
    ========================================================= */

    function showLogin() {
        if (loginPage) loginPage.classList.remove("hidden");
        if (appPage) appPage.classList.add("hidden");
        if (customerFeedbackPage) {
            customerFeedbackPage.classList.add("hidden");
        }
    }

    function showApp() {
        if (loginPage) loginPage.classList.add("hidden");
        if (appPage) appPage.classList.remove("hidden");
        if (customerFeedbackPage) {
            customerFeedbackPage.classList.add("hidden");
        }

        showPage("dashboard");
    }


    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (!email || !password) {
                alert("Please enter your email and password.");
                return;
            }

            /*
               Demo login.
               Any valid email/password combination works.
            */

            localStorage.setItem("reviewIQLoggedIn", "true");

            showApp();

        });

    }


    /* =========================================================
       PASSWORD SHOW / HIDE
    ========================================================= */

    if (passwordToggle && loginPassword) {

        passwordToggle.addEventListener("click", () => {

            if (loginPassword.type === "password") {

                loginPassword.type = "text";
                passwordToggle.textContent = "◉";

            } else {

                loginPassword.type = "password";
                passwordToggle.textContent = "◉";

            }

        });

    }


    /* =========================================================
       LOGOUT
    ========================================================= */

    if (logoutButton) {

        logoutButton.addEventListener("click", () => {

            localStorage.removeItem("reviewIQLoggedIn");

            showLogin();

        });

    }


    /* =========================================================
       SIDEBAR NAVIGATION
    ========================================================= */

    function showPage(pageName) {

        contentPages.forEach(page => {
            page.classList.remove("active-page");
        });

        navItems.forEach(item => {
            item.classList.remove("active");
        });


        const targetPage = document.getElementById(pageName + "Page");

        if (targetPage) {
            targetPage.classList.add("active-page");
        }


        const activeNav = document.querySelector(
            `.nav-item[data-page="${pageName}"]`
        );

        if (activeNav) {
            activeNav.classList.add("active");
        }


        /* Close mobile sidebar */

        if (sidebar) {
            sidebar.classList.remove("mobile-open");
        }


        /* Scroll content to top */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        /* Load charts when necessary */

        setTimeout(() => {

            if (pageName === "dashboard") {
                createDashboardCharts();
            }

            if (pageName === "reports") {
                createReportCharts();
            }

        }, 100);

    }


    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const page = item.dataset.page;

            if (page) {
                showPage(page);
            }

        });

    });


    /* =========================================================
       VIEW ALL BUTTON
    ========================================================= */

    document.querySelectorAll("[data-page]").forEach(button => {

        button.addEventListener("click", function () {

            const page = this.dataset.page;

            if (
                page &&
                !this.classList.contains("nav-item")
            ) {
                showPage(page);
            }

        });

    });


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    if (mobileMenu && sidebar) {

        mobileMenu.addEventListener("click", () => {

            sidebar.classList.toggle("mobile-open");

        });

    }


    /* =========================================================
       FEEDBACK FILTER
    ========================================================= */

    if (filterButton && filterBar) {

        filterButton.addEventListener("click", () => {

            filterBar.classList.toggle("hidden");

        });

    }


    function filterFeedback() {

        if (!feedbackTableBody) return;

        const rows = feedbackTableBody.querySelectorAll("tr");

        const selectedSource =
            sourceFilter ? sourceFilter.value : "all";

        const selectedSentiment =
            sentimentFilter ? sentimentFilter.value : "all";

        const selectedCategory =
            categoryFilter ? categoryFilter.value : "all";


        rows.forEach(row => {

            const source = row.dataset.source;
            const sentiment = row.dataset.sentiment;
            const category = row.dataset.category;

            const sourceMatch =
                selectedSource === "all" ||
                source === selectedSource;

            const sentimentMatch =
                selectedSentiment === "all" ||
                sentiment === selectedSentiment;

            const categoryMatch =
                selectedCategory === "all" ||
                category === selectedCategory;


            if (
                sourceMatch &&
                sentimentMatch &&
                categoryMatch
            ) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    }


    if (sourceFilter) {
        sourceFilter.addEventListener("change", filterFeedback);
    }

    if (sentimentFilter) {
        sentimentFilter.addEventListener("change", filterFeedback);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterFeedback);
    }

    /* =========================================================
       GLOBAL SEARCH
    ========================================================= */

    if (globalSearch) {

        globalSearch.addEventListener("input", function () {

            const searchTerm =
                this.value.toLowerCase().trim();

            const rows =
                document.querySelectorAll(".feedback-table tbody tr");


            rows.forEach(row => {

                const text =
                    row.textContent.toLowerCase();

                if (text.includes(searchTerm)) {

                    row.style.display = "";

                } else {

                    row.style.display = "none";

                }

            });

        });

    }


    /* =========================================================
       STAR RATING
    ========================================================= */

    if (starRating) {

        const stars =
            starRating.querySelectorAll("button");


        stars.forEach(star => {

            star.addEventListener("click", () => {

                const rating =
                    Number(star.dataset.rating);

                selectedRating.value = rating;


                stars.forEach(item => {

                    const itemRating =
                        Number(item.dataset.rating);

                    if (itemRating <= rating) {

                        item.textContent = "★";

                    } else {

                        item.textContent = "☆";

                    }

                });

            });

        });

    }


    /* =========================================================
       CHARACTER COUNTER
    ========================================================= */

    if (feedbackComment && characterCount) {

        feedbackComment.addEventListener("input", () => {

            characterCount.textContent =
                feedbackComment.value.length;

        });

    }


    /* =========================================================
       CUSTOMER FEEDBACK FORM
    ========================================================= */

    if (feedbackForm) {

        feedbackForm.addEventListener("submit", event => {

            event.preventDefault();


            const rating =
                Number(selectedRating.value);


            if (rating === 0) {

                alert("Please select a rating before submitting.");

                return;

            }


            const name =
                document.getElementById("customerName").value.trim();

            const email =
                document.getElementById("customerEmail").value.trim();

            const product =
                document.getElementById("productService").value;

            const category =
                document.getElementById("feedbackCategory").value;

            const comment =
                feedbackComment.value.trim();


            if (!product || !category || !comment) {

                alert("Please complete all required fields.");

                return;

            }


            /*
               Save feedback locally.
               This makes the prototype interactive.
            */

            const feedback = {

                name:
                    name || "Anonymous Customer",

                email,

                product,

                rating,

                category,

                comment,

                date:
                    new Date().toLocaleDateString()

            };


            const existingFeedback =
                JSON.parse(
                    localStorage.getItem("reviewIQFeedback") || "[]"
                );


            existingFeedback.push(feedback);


            localStorage.setItem(
                "reviewIQFeedback",
                JSON.stringify(existingFeedback)
            );


            /* Show success modal */

            if (thankYouModal) {

                thankYouModal.classList.remove("hidden");

            }

        });

    }


    /* =========================================================
       SUBMIT ANOTHER FEEDBACK
    ========================================================= */

    if (submitAnother) {

        submitAnother.addEventListener("click", () => {

            if (thankYouModal) {
                thankYouModal.classList.add("hidden");
            }

            if (feedbackForm) {
                feedbackForm.reset();
            }

            if (selectedRating) {
                selectedRating.value = 0;
            }

            if (characterCount) {
                characterCount.textContent = "0";
            }


            if (starRating) {

                starRating
                    .querySelectorAll("button")
                    .forEach(star => {

                        star.textContent = "☆";

                    });

            }

        });

    }


    /* =========================================================
       AI INSIGHTS REFRESH
    ========================================================= */

    if (refreshInsights) {

        refreshInsights.addEventListener("click", () => {

            const originalText =
                refreshInsights.innerHTML;

            refreshInsights.innerHTML =
                "↻ Analyzing...";

            refreshInsights.disabled = true;


            setTimeout(() => {

                refreshInsights.innerHTML =
                    "✓ Insights Updated";

                refreshInsights.disabled = false;


                setTimeout(() => {

                    refreshInsights.innerHTML =
                        originalText;

                }, 1800);

            }, 1200);

        });

    }


    /* =========================================================
       SETTINGS TABS
    ========================================================= */

    const settingsTabs =
        document.querySelectorAll(".settings-tab");


    settingsTabs.forEach(tab => {

        tab.addEventListener("click", () => {

            settingsTabs.forEach(item => {
                item.classList.remove("active");
            });

            tab.classList.add("active");


            const tabText =
                tab.textContent.trim();


            const sections =
                document.querySelectorAll(".settings-section");


            /*
               Basic interactive behaviour.
               The existing settings content remains visible
               while the selected tab is highlighted.
            */

            sections.forEach(section => {

                section.style.display = "";

            });


            console.log(
                "Selected settings section:",
                tabText
            );

        });

    });


    /* =========================================================
       SAVE SETTINGS
    ========================================================= */

    const saveButton =
        document.querySelector(".save-button");


    if (saveButton) {

        saveButton.addEventListener("click", () => {

            saveButton.textContent =
                "✓ Changes Saved";

            saveButton.disabled = true;


            setTimeout(() => {

                saveButton.textContent =
                    "Save Changes";

                saveButton.disabled = false;

            }, 1800);

        });

    }


    /* =========================================================
       REPORT PERIOD TABS
    ========================================================= */

    const periodButtons =
        document.querySelectorAll(".period-tabs button");


    periodButtons.forEach(button => {

        button.addEventListener("click", () => {

            periodButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

        });

    });


    /* =========================================================
       DASHBOARD CHARTS
    ========================================================= */

    let feedbackTrendChart = null;
    let sourceChart = null;
    let reportTrendChart = null;
    let reportSentimentChart = null;


    function createDashboardCharts() {

        const trendCanvas =
            document.getElementById("feedbackTrendChart");

        const sourceCanvas =
            document.getElementById("sourceChart");


        if (trendCanvas && typeof Chart !== "undefined") {

            if (feedbackTrendChart) {
                feedbackTrendChart.destroy();
            }


            feedbackTrendChart =
                new Chart(trendCanvas, {

                    type: "line",

                    data: {

                        labels: [
                            "Jul 15",
                            "Jul 18",
                            "Jul 21",
                            "Jul 24",
                            "Jul 27",
                            "Jul 30",
                            "Aug 2",
                            "Aug 5",
                            "Aug 8",
                            "Aug 12"
                        ],

                        datasets: [

                            {
                                label: "Positive",

                                data: [
                                    62,
                                    65,
                                    68,
                                    66,
                                    72,
                                    74,
                                    76,
                                    79,
                                    81,
                                    84
                                ],

                                borderWidth: 3,

                                tension: 0.4,

                                fill: false
                            },


                            {
                                label: "Neutral",

                                data: [
                                    24,
                                    23,
                                    21,
                                    23,
                                    20,
                                    18,
                                    17,
                                    15,
                                    13,
                                    9
                                ],

                                borderWidth: 2,

                                tension: 0.4,

                                fill: false
                            },


                            {
                                label: "Negative",

                                data: [
                                    14,
                                    12,
                                    11,
                                    11,
                                    8,
                                    8,
                                    7,
                                    6,
                                    6,
                                    7
                                ],

                                borderWidth: 2,

                                tension: 0.4,

                                fill: false
                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                position: "top"
                            }

                        },

                        scales: {

                            y: {

                                beginAtZero: true,

                                max: 100,

                                ticks: {
                                    callback: value => value + "%"
                                }

                            }

                        }

                    }

                });

        }


        if (sourceCanvas && typeof Chart !== "undefined") {

            if (sourceChart) {
                sourceChart.destroy();
            }


            sourceChart =
                new Chart(sourceCanvas, {

                    type: "doughnut",

                    data: {

                        labels: [
                            "Google",
                            "Facebook",
                            "Website",
                            "Other"
                        ],

                        datasets: [

                            {

                                data: [
                                    58,
                                    24,
                                    12,
                                    6
                                ],

                                borderWidth: 0

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        cutout: "70%",

                        plugins: {

                            legend: {
                                display: false
                            }

                        }

                    }

                });

        }

    }


    /* =========================================================
       REPORT CHARTS
    ========================================================= */

    function createReportCharts() {

        const trendCanvas =
            document.getElementById("reportTrendChart");

        const sentimentCanvas =
            document.getElementById("reportSentimentChart");


        if (
            trendCanvas &&
            typeof Chart !== "undefined"
        ) {

            if (reportTrendChart) {
                reportTrendChart.destroy();
            }


            reportTrendChart =
                new Chart(trendCanvas, {

                    type: "line",

                    data: {

                        labels: [
                            "Week 1",
                            "Week 2",
                            "Week 3",
                            "Week 4"
                        ],

                        datasets: [

                            {

                                label: "Customer Sentiment",

                                data: [
                                    71,
                                    76,
                                    80,
                                    84
                                ],

                                borderWidth: 3,

                                tension: 0.4,

                                fill: false

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true,

                                max: 100

                            }

                        }

                    }

                });

        }


        if (
            sentimentCanvas &&
            typeof Chart !== "undefined"
        ) {

            if (reportSentimentChart) {
                reportSentimentChart.destroy();
            }


            reportSentimentChart =
                new Chart(sentimentCanvas, {

                    type: "doughnut",

                    data: {

                        labels: [
                            "Positive",
                            "Neutral",
                            "Negative"
                        ],

                        datasets: [

                            {

                                data: [
                                    84,
                                    9,
                                    7
                                ],

                                borderWidth: 0

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        cutout: "68%",

                        plugins: {

                            legend: {
                                position: "bottom"
                            }

                        }

                    }

                });

        }

    }


    /* =========================================================
       EXPORT BUTTONS
    ========================================================= */

    const exportButtons =
        document.querySelectorAll(".export-button");


    exportButtons.forEach(button => {

        button.addEventListener("click", () => {

            const original =
                button.innerHTML;

            button.innerHTML =
                "✓ Preparing...";

            button.disabled = true;


            setTimeout(() => {

                button.innerHTML =
                    "✓ Export Ready";

                button.disabled = false;


                setTimeout(() => {

                    button.innerHTML =
                        original;

                }, 1500);

            }, 900);

        });

    });


    /* =========================================================
       UPGRADE PLAN
    ========================================================= */

    const upgradeButton =
        document.querySelector(".upgrade-button");


    if (upgradeButton) {

        upgradeButton.addEventListener("click", () => {

            alert(
                "Premium Plan\n\n" +
                "You are currently using the Premium Analytics workspace."
            );

        });

    }


    /* =========================================================
       CONNECT SOURCE
    ========================================================= */

    const connectSourceButton =
        document.querySelector(
            "#sourcesPage .export-button"
        );


    if (connectSourceButton) {

        connectSourceButton.addEventListener("click", () => {

            alert(
                "Connect Source\n\n" +
                "Google Reviews, Facebook, Instagram and Website feedback can be connected here."
            );

        });

    }


    /* =========================================================
       DATE / REPORT CONTROLS
    ========================================================= */

    const dateButton =
        document.querySelector(".date-button");


    if (dateButton) {

        dateButton.addEventListener("click", () => {

            alert(
                "Date range selector\n\n" +
                "Current range: Last 30 Days"
            );

        });

    }


    /* =========================================================
       INITIALIZE
    ========================================================= */

    const isLoggedIn =
        localStorage.getItem("reviewIQLoggedIn");


    if (isLoggedIn === "true") {

        showApp();

    } else {

        showLogin();

    }


    /* Create dashboard charts after page loads */

    setTimeout(() => {

        createDashboardCharts();

    }, 300);


});/* =========================================================
   REVIEWIQ — DASHBOARD INTERACTIONS
   ========================================================= */

/* Dashboard period selector */
const dashboardPeriod = document.querySelector(".period-select");

if (dashboardPeriod) {

    dashboardPeriod.addEventListener("change", function () {

        const selectedPeriod = this.value;

        console.log("Dashboard period:", selectedPeriod);

        /*
         * Update the dashboard trend based on the
         * selected reporting period.
         */

        if (typeof createDashboardCharts === "function") {
            createDashboardCharts(selectedPeriod);
        }

    });

}


/* =========================================================
   FEEDBACK TREND PERIOD
   ========================================================= */

const trendPanel = document.querySelector(".trend-panel");

if (trendPanel) {

    const trendSelect = trendPanel.querySelector("select");

    if (trendSelect) {

        trendSelect.addEventListener("change", function () {

            const selectedTrend = this.value;

            console.log(
                "Feedback trend:",
                selectedTrend
            );

            if (typeof createDashboardCharts === "function") {
                createDashboardCharts(selectedTrend);
            }

        });

    }

}


/* =========================================================
   KPI CARD INTERACTION
   ========================================================= */

const kpiCards =
    document.querySelectorAll(".kpi-card");

kpiCards.forEach(card => {

    card.addEventListener("click", () => {

        kpiCards.forEach(item => {
            item.classList.remove("kpi-selected");
        });

        card.classList.add("kpi-selected");

    });

});


/* =========================================================
   RECENT FEEDBACK → VIEW ALL
   ========================================================= */

const viewAllFeedback =
    document.querySelector(
        ".recent-panel .text-button"
    );

if (viewAllFeedback) {

    viewAllFeedback.addEventListener("click", () => {

        const feedbackNav =
            document.querySelector(
                '.nav-item[data-page="feedback"]'
            );

        if (feedbackNav) {
            feedbackNav.click();
        }

    });

}


/* =========================================================
   EXPORT DASHBOARD
   ========================================================= */

const dashboardExport =
    document.querySelector(
        "#dashboardPage .export-button"
    );

if (dashboardExport) {

    dashboardExport.addEventListener("click", () => {

        const originalText =
            dashboardExport.innerHTML;

        dashboardExport.innerHTML =
            "✓ Preparing...";

        dashboardExport.disabled = true;


        setTimeout(() => {

            dashboardExport.innerHTML =
                "✓ Export Ready";

            dashboardExport.disabled = false;


            setTimeout(() => {

                dashboardExport.innerHTML =
                    originalText;

            }, 1500);

        }, 1000);

    });

}


/* =========================================================
   NOTIFICATION BUTTON
   ========================================================= */

const notificationButton =
    document.querySelector(".notification-button");

if (notificationButton) {

    notificationButton.addEventListener("click", () => {

        alert(
            "Notifications\n\n" +
            "3 new customer feedback alerts\n" +
            "1 sentiment change detected\n" +
            "2 feedback responses pending"
        );

    });

}


/* =========================================================
   SEARCH → FEEDBACK
   ========================================================= */

if (globalSearch) {

    globalSearch.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            const searchValue =
                this.value.trim();

            if (!searchValue) return;


            const feedbackNav =
                document.querySelector(
                    '.nav-item[data-page="feedback"]'
                );

            if (feedbackNav) {
                feedbackNav.click();
            }

        }

    });

}
/* =========================================================
   REVIEWIQ — FEEDBACK MANAGEMENT
   ========================================================= */

/* ---------------------------------------------------------
   FEEDBACK FILTER PANEL
--------------------------------------------------------- */

const feedbackFilterButton =
    document.getElementById("filterButton");

const feedbackFilterBar =
    document.getElementById("filterBar");


if (feedbackFilterButton && feedbackFilterBar) {

    feedbackFilterButton.addEventListener("click", () => {

        feedbackFilterBar.classList.toggle("hidden");

        if (
            !feedbackFilterBar.classList.contains("hidden")
        ) {

            feedbackFilterButton.innerHTML =
                "✕ Close Filter";

        } else {

            feedbackFilterButton.innerHTML =
                "☰ Filter";

        }

    });

}


/* ---------------------------------------------------------
   FILTER FEEDBACK TABLE
--------------------------------------------------------- */

const feedbackSourceFilter =
    document.getElementById("sourceFilter");

const feedbackSentimentFilter =
    document.getElementById("sentimentFilter");

const feedbackCategoryFilter =
    document.getElementById("categoryFilter");

const feedbackRows =
    document.querySelectorAll(
        "#feedbackTableBody tr"
    );


function applyFeedbackFilters() {

    const source =
        feedbackSourceFilter
            ? feedbackSourceFilter.value
            : "all";

    const sentiment =
        feedbackSentimentFilter
            ? feedbackSentimentFilter.value
            : "all";

    const category =
        feedbackCategoryFilter
            ? feedbackCategoryFilter.value
            : "all";


    let visibleRows = 0;


    feedbackRows.forEach(row => {

        const rowSource =
            row.dataset.source;

        const rowSentiment =
            row.dataset.sentiment;

        const rowCategory =
            row.dataset.category;


        const sourceMatch =
            source === "all" ||
            rowSource === source;

        const sentimentMatch =
            sentiment === "all" ||
            rowSentiment === sentiment;

        const categoryMatch =
            category === "all" ||
            rowCategory === category;


        if (
            sourceMatch &&
            sentimentMatch &&
            categoryMatch
        ) {

            row.style.display = "";

            visibleRows++;

        } else {

            row.style.display = "none";

        }

    });


    updateFeedbackCount(visibleRows);

}


if (feedbackSourceFilter) {

    feedbackSourceFilter.addEventListener(
        "change",
        applyFeedbackFilters
    );

}


if (feedbackSentimentFilter) {

    feedbackSentimentFilter.addEventListener(
        "change",
        applyFeedbackFilters
    );

}


if (feedbackCategoryFilter) {

    feedbackCategoryFilter.addEventListener(
        "change",
        applyFeedbackFilters
    );

}


/* ---------------------------------------------------------
   FEEDBACK COUNT
--------------------------------------------------------- */

function updateFeedbackCount(count) {

    const paginationText =
        document.querySelector(
            "#feedbackPage .pagination > span"
        );


    if (!paginationText) return;


    if (count === 0) {

        paginationText.textContent =
            "No feedback matches your filters";

    } else {

        paginationText.textContent =
            `Showing 1–${count} entries`;

    }

}


/* ---------------------------------------------------------
   PAGINATION BUTTONS
--------------------------------------------------------- */

const paginationButtons =
    document.querySelectorAll(
        "#feedbackPage .pagination button"
    );


paginationButtons.forEach(button => {

    button.addEventListener("click", () => {

        const text =
            button.textContent.trim();


        if (
            text === "‹" ||
            text === "›" ||
            text === "…" ||
            text === "1"
        ) {

            paginationButtons.forEach(item => {

                item.classList.remove("active");

            });


            if (
                text !== "‹" &&
                text !== "›" &&
                text !== "…"
            ) {

                button.classList.add("active");

            }

        }

    });

});


/* ---------------------------------------------------------
   FEEDBACK ROW CLICK
--------------------------------------------------------- */

feedbackRows.forEach(row => {

    row.style.cursor = "pointer";


    row.addEventListener("click", () => {

        const reviewer =
            row.querySelector(
                ".customer strong"
            );

        const review =
            row.children[1];

        const sentiment =
            row.querySelector(".status");


        const reviewerName =
            reviewer
                ? reviewer.textContent
                : "Customer";


        const reviewText =
            review
                ? review.textContent.trim()
                : "No review content";


        const sentimentText =
            sentiment
                ? sentiment.textContent
                : "Unknown";


        alert(
            "Feedback Details\n\n" +
            "Customer: " +
            reviewerName +
            "\n\n" +
            "Review:\n" +
            reviewText +
            "\n\n" +
            "Sentiment: " +
            sentimentText
        );

    });

});


/* ---------------------------------------------------------
   FEEDBACK TABLE HOVER
--------------------------------------------------------- */

feedbackRows.forEach(row => {

    row.addEventListener("mouseenter", () => {

        row.style.transform =
            "translateY(-1px)";

    });


    row.addEventListener("mouseleave", () => {

        row.style.transform =
            "translateY(0)";

    });

});


/* ---------------------------------------------------------
   FEEDBACK PAGE EXPORT
--------------------------------------------------------- */

const feedbackExportButton =
    document.querySelector(
        "#feedbackPage .export-button"
    );


if (feedbackExportButton) {

    feedbackExportButton.addEventListener(
        "click",
        () => {

            const originalText =
                feedbackExportButton.innerHTML;


            feedbackExportButton.innerHTML =
                "✓ Exporting...";

            feedbackExportButton.disabled = true;


            setTimeout(() => {

                feedbackExportButton.innerHTML =
                    "✓ Export Complete";

                feedbackExportButton.disabled =
                    false;


                setTimeout(() => {

                    feedbackExportButton.innerHTML =
                        originalText;

                }, 1500);

            }, 1000);

        }
    );

}


/* ---------------------------------------------------------
   CLEAR FILTERS
--------------------------------------------------------- */

function clearFeedbackFilters() {

    if (feedbackSourceFilter) {

        feedbackSourceFilter.value =
            "all";

    }


    if (feedbackSentimentFilter) {

        feedbackSentimentFilter.value =
            "all";

    }


    if (feedbackCategoryFilter) {

        feedbackCategoryFilter.value =
            "all";

    }


    applyFeedbackFilters();

}


/* ---------------------------------------------------------
   INITIAL FEEDBACK STATE
--------------------------------------------------------- */

applyFeedbackFilters();
/* =========================================================
   REVIEWIQ — AI INSIGHTS INTERACTIONS
   ========================================================= */


/* ---------------------------------------------------------
   REFRESH AI INSIGHTS
--------------------------------------------------------- */

const aiRefreshButton =
    document.getElementById("refreshInsights");

if (aiRefreshButton) {

    aiRefreshButton.addEventListener("click", () => {

        const originalText =
            aiRefreshButton.innerHTML;

        aiRefreshButton.innerHTML =
            "✦ Analyzing feedback...";

        aiRefreshButton.disabled = true;


        setTimeout(() => {

            aiRefreshButton.innerHTML =
                "✓ Insights Updated";

            aiRefreshButton.disabled = false;


            setTimeout(() => {

                aiRefreshButton.innerHTML =
                    originalText;

            }, 1800);

        }, 1400);

    });

}


/* ---------------------------------------------------------
   AI RECOMMENDATION CARDS
--------------------------------------------------------- */

const recommendationCards =
    document.querySelectorAll(
        ".recommendation"
    );


recommendationCards.forEach(card => {

    card.style.cursor = "pointer";


    card.addEventListener("click", () => {

        const title =
            card.querySelector("h3");

        const description =
            card.querySelector("p");


        const titleText =
            title
                ? title.textContent
                : "AI Recommendation";


        const descriptionText =
            description
                ? description.textContent
                : "No additional information available.";


        alert(
            "AI Recommendation\n\n" +
            titleText +
            "\n\n" +
            descriptionText +
            "\n\n" +
            "Recommended priority: High"
        );

    });

});


/* ---------------------------------------------------------
   TOP COMPLAINTS
--------------------------------------------------------- */

const complaintItems =
    document.querySelectorAll(
        ".insight-box .insight-item"
    );


complaintItems.forEach(item => {

    item.style.cursor = "pointer";


    item.addEventListener("click", () => {

        const title =
            item.querySelector("strong");

        const severity =
            item.querySelector("b");


        const titleText =
            title
                ? title.textContent
                : "Customer complaint";


        const severityText =
            severity
                ? severity.textContent
                : "Unknown";


        alert(
            "Customer Complaint\n\n" +
            titleText +
            "\n\n" +
            "Severity: " +
            severityText +
            "\n\n" +
            "This issue should be monitored and prioritised based on customer impact."
        );

    });

});


/* ---------------------------------------------------------
   MOST LOVED AREAS
--------------------------------------------------------- */

const progressItems =
    document.querySelectorAll(
        ".progress-item"
    );


progressItems.forEach(item => {

    item.style.cursor = "pointer";


    item.addEventListener("click", () => {

        const label =
            item.querySelector("span");

        const score =
            item.querySelector("strong");


        const labelText =
            label
                ? label.textContent
                : "Customer experience area";


        const scoreText =
            score
                ? score.textContent
                : "";


        alert(
            "Customer Experience\n\n" +
            labelText +
            "\n\n" +
            "Satisfaction score: " +
            scoreText
        );

    });

});


/* ---------------------------------------------------------
   EMOTION ANALYSIS
--------------------------------------------------------- */

const emotionItems =
    document.querySelectorAll(
        ".emotion"
    );


emotionItems.forEach(item => {

    item.style.cursor = "pointer";


    item.addEventListener("click", () => {

        const label =
            item.querySelector("span");

        const percentage =
            item.querySelector("strong");


        const labelText =
            label
                ? label.textContent
                : "Emotion";


        const percentageText =
            percentage
                ? percentage.textContent
                : "";


        alert(
            "Emotion Analysis\n\n" +
            labelText +
            "\n\n" +
            "Detected in customer feedback: " +
            percentageText
        );

    });

});


/* ---------------------------------------------------------
   OVERALL SENTIMENT
--------------------------------------------------------- */

const sentimentCircle =
    document.querySelector(
        ".sentiment-circle"
    );


if (sentimentCircle) {

    sentimentCircle.style.cursor =
        "pointer";


    sentimentCircle.addEventListener(
        "click",
        () => {

            alert(
                "Overall Customer Sentiment\n\n" +
                "Positive: 84%\n" +
                "Neutral: 9%\n" +
                "Negative: 7%\n\n" +
                "Overall sentiment is currently positive."
            );

        }
    );

}


/* ---------------------------------------------------------
   AI EXECUTIVE SUMMARY
--------------------------------------------------------- */

const executiveCard =
    document.querySelector(
        ".executive-card"
    );


if (executiveCard) {

    executiveCard.style.cursor =
        "pointer";


    executiveCard.addEventListener(
        "click",
        () => {

            alert(
                "AI Executive Summary\n\n" +
                "Customer satisfaction increased to 84%.\n\n" +
                "Product quality remains the highest-rated category, while delivery continues to receive the most complaints."
            );

        }
    );

}


/* ---------------------------------------------------------
   DOWNLOAD REPORT
--------------------------------------------------------- */

const downloadReportButton =
    document.querySelector(
        ".executive-card .text-button"
    );


if (downloadReportButton) {

    downloadReportButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const originalText =
                downloadReportButton.innerHTML;


            downloadReportButton.innerHTML =
                "Preparing report...";


            setTimeout(() => {

                downloadReportButton.innerHTML =
                    "✓ Report Ready";


                setTimeout(() => {

                    downloadReportButton.innerHTML =
                        originalText;

                }, 1800);

            }, 1000);

        }
    );

}


/* ---------------------------------------------------------
   AI MODEL STATUS
--------------------------------------------------------- */

const aiModel =
    document.querySelector(
        ".ai-model"
    );


if (aiModel) {

    aiModel.style.cursor =
        "pointer";


    aiModel.addEventListener(
        "click",
        () => {

            alert(
                "AI Analysis Engine\n\n" +
                "Model: Feedback Analysis\n" +
                "Status: Active\n" +
                "Last updated: Just now\n\n" +
                "The engine analyzes sentiment, themes, complaints and customer experience signals."
            );

        }
    );

}


/* ---------------------------------------------------------
   AI RECOMMENDATION ARROWS
--------------------------------------------------------- */

const recommendationArrows =
    document.querySelectorAll(
        ".recommendation > b"
    );


recommendationArrows.forEach(arrow => {

    arrow.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            arrow.style.transform =
                "translateX(6px)";

            setTimeout(() => {

                arrow.style.transform =
                    "translateX(0)";

            }, 300);

        }
    );

});
/* =========================================================
   REVIEWIQ — REPORTS
   ========================================================= */


/* ---------------------------------------------------------
   REPORT PERIOD TABS
--------------------------------------------------------- */

const reportPeriodTabs =
    document.querySelectorAll(
        ".period-tabs button"
    );

const reportTrendTitle =
    document.querySelector(
        "#reportsPage .report-charts .panel:first-child h3"
    );


reportPeriodTabs.forEach(button => {

    button.addEventListener("click", () => {

        reportPeriodTabs.forEach(tab => {
            tab.classList.remove("active");
        });

        button.classList.add("active");

        const selectedPeriod =
            button.textContent.trim();

        if (reportTrendTitle) {

            reportTrendTitle.textContent =
                `Feedback Trend — ${selectedPeriod}`;

        }

        showReportNotification(
            `${selectedPeriod} report selected`
        );

    });

});


/* ---------------------------------------------------------
   DATE RANGE BUTTON
--------------------------------------------------------- */

const dateButton =
    document.querySelector(
        "#reportsPage .date-button"
    );


if (dateButton) {

    dateButton.addEventListener(
        "click",
        () => {

            const ranges = [
                "Last 7 Days",
                "Last 30 Days",
                "Last 90 Days",
                "This Year"
            ];

            const currentText =
                dateButton.textContent
                    .replace("▣", "")
                    .trim();

            const currentIndex =
                ranges.indexOf(currentText);

            const nextIndex =
                currentIndex === -1
                    ? 0
                    : (currentIndex + 1) % ranges.length;


            dateButton.innerHTML =
                `▣ ${ranges[nextIndex]}`;


            showReportNotification(
                `Date range changed to ${ranges[nextIndex]}`
            );

        }
    );

}


/* ---------------------------------------------------------
   REPORT EXPORT BUTTONS
--------------------------------------------------------- */

const reportExportButtons =
    document.querySelectorAll(
        "#reportsPage .export-button"
    );


reportExportButtons.forEach(button => {

    button.addEventListener("click", () => {

        const originalText =
            button.innerHTML;

        const format =
            originalText
                .replace("PDF", "")
                .replace("Excel", "")
                .trim();


        button.disabled = true;

        button.innerHTML =
            "Preparing...";


        setTimeout(() => {

            button.innerHTML =
                "✓ Export Ready";

            button.disabled = false;


            setTimeout(() => {

                button.innerHTML =
                    originalText;

            }, 1800);

        }, 1000);


        showReportNotification(
            `${format || "Report"} export prepared`
        );

    });

});


/* ---------------------------------------------------------
   AI ACTION PLAN
--------------------------------------------------------- */

const actionPlanButton =
    document.querySelector(
        ".ai-action-card button"
    );


if (actionPlanButton) {

    actionPlanButton.addEventListener(
        "click",
        () => {

            alert(
                "AI ACTION PLAN\n\n" +
                "Priority: High\n\n" +
                "1. Review delivery processes.\n" +
                "2. Identify major delivery delays.\n" +
                "3. Improve customer communication.\n" +
                "4. Monitor delivery-related feedback weekly.\n\n" +
                "Expected impact: Improved customer satisfaction and reduced negative feedback."
            );

        }
    );

}


/* ---------------------------------------------------------
   REPORT KPI CARDS
--------------------------------------------------------- */

const reportKpis =
    document.querySelectorAll(
        ".report-kpis > div"
    );


reportKpis.forEach(kpi => {

    kpi.style.cursor = "pointer";


    kpi.addEventListener("click", () => {

        const label =
            kpi.querySelector("span");

        const value =
            kpi.querySelector("strong");

        const detail =
            kpi.querySelector("small");


        const labelText =
            label
                ? label.textContent
                : "Report metric";

        const valueText =
            value
                ? value.textContent
                : "";

        const detailText =
            detail
                ? detail.textContent
                : "";


        alert(
            labelText +
            "\n\n" +
            "Current value: " +
            valueText +
            "\n" +
            detailText
        );

    });

});


/* ---------------------------------------------------------
   REPORT CATEGORY AREAS
--------------------------------------------------------- */

const reportCategories =
    document.querySelectorAll(
        ".category-progress"
    );


reportCategories.forEach(category => {

    category.style.cursor = "pointer";


    category.addEventListener(
        "click",
        () => {

            const title =
                category.querySelector("span");

            const status =
                category.querySelector("strong");


            alert(
                "Category Performance\n\n" +
                (title
                    ? title.textContent
                    : "Category") +
                "\n\nStatus: " +
                (status
                    ? status.textContent
                    : "Available")
            );

        }
    );

});


/* ---------------------------------------------------------
   POSITIVE / COMPLAINT AREAS
--------------------------------------------------------- */

const reportLists =
    document.querySelectorAll(
        ".simple-list li"
    );


reportLists.forEach(item => {

    item.style.cursor = "pointer";


    item.addEventListener(
        "click",
        () => {

            alert(
                "Feedback Area\n\n" +
                item.textContent.trim() +
                "\n\nThis area is included in the current business performance analysis."
            );

        }
    );

});


/* ---------------------------------------------------------
   REPORT NOTIFICATION
--------------------------------------------------------- */

function showReportNotification(message) {

    let notification =
        document.getElementById(
            "reportNotification"
        );


    if (!notification) {

        notification =
            document.createElement("div");

        notification.id =
            "reportNotification";


        notification.style.position =
            "fixed";

        notification.style.bottom =
            "25px";

        notification.style.right =
            "25px";

        notification.style.padding =
            "14px 20px";

        notification.style.background =
            "#111827";

        notification.style.color =
            "#ffffff";

        notification.style.borderRadius =
            "10px";

        notification.style.fontSize =
            "14px";

        notification.style.fontWeight =
            "600";

        notification.style.zIndex =
            "99999";

        notification.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.18)";


        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;

    notification.style.opacity =
        "1";


    clearTimeout(
        window.reportNotificationTimer
    );


    window.reportNotificationTimer =
        setTimeout(() => {

            notification.style.opacity =
                "0";

        }, 2200);

}


/* ---------------------------------------------------------
   REPORT CHART INTERACTION
--------------------------------------------------------- */

const reportCharts =
    document.querySelectorAll(
        "#reportsPage canvas"
    );


reportCharts.forEach(chart => {

    chart.style.cursor =
        "pointer";


    chart.addEventListener(
        "click",
        () => {

            showReportNotification(
                "Chart data selected"
            );

        }
    );

});
/* =========================================================
   REVIEWIQ — SOURCES
   ========================================================= */


/* ---------------------------------------------------------
   SOURCE CARDS
--------------------------------------------------------- */

const sourceCards =
    document.querySelectorAll(
        "#sourcesPage .source-card"
    );


sourceCards.forEach(card => {

    card.style.cursor = "pointer";


    card.addEventListener("click", () => {

        const sourceName =
            card.querySelector("h3");

        const description =
            card.querySelector("p");

        const status =
            card.querySelector("strong");


        const name =
            sourceName
                ? sourceName.textContent.trim()
                : "Feedback Source";

        const details =
            description
                ? description.textContent.trim()
                : "";

        const currentStatus =
            status
                ? status.textContent.trim()
                : "Connected";


        alert(
            name +
            "\n\n" +
            details +
            "\n\n" +
            "Status: " +
            currentStatus +
            "\n\n" +
            "ReviewIQ is currently monitoring this source."
        );

    });

});


/* ---------------------------------------------------------
   CONNECT SOURCE BUTTON
--------------------------------------------------------- */

const connectSourceButton =
    document.querySelector(
        "#sourcesPage .page-heading .export-button"
    );


if (connectSourceButton) {

    connectSourceButton.addEventListener(
        "click",
        () => {

            openSourceModal();

        }
    );

}


/* ---------------------------------------------------------
   SOURCE CONNECTION MODAL
--------------------------------------------------------- */

function openSourceModal() {

    let modal =
        document.getElementById(
            "sourceConnectionModal"
        );


    if (!modal) {

        modal =
            document.createElement("div");

        modal.id =
            "sourceConnectionModal";


        modal.innerHTML = `
            <div class="source-modal-overlay"></div>

            <div class="source-modal-card">

                <button
                    class="source-modal-close"
                    id="closeSourceModal"
                >
                    ×
                </button>

                <div class="source-modal-icon">
                    🔗
                </div>

                <h2>Connect a Feedback Source</h2>

                <p>
                    Choose a platform to connect to ReviewIQ
                    and centralize your customer feedback.
                </p>

                <div class="source-options">

                    <button
                        class="source-option"
                        data-source="Google Reviews"
                    >
                        <span>G</span>
                        <div>
                            <strong>Google Reviews</strong>
                            <small>Import customer reviews</small>
                        </div>
                    </button>

                    <button
                        class="source-option"
                        data-source="Facebook"
                    >
                        <span>f</span>
                        <div>
                            <strong>Facebook</strong>
                            <small>Monitor comments and mentions</small>
                        </div>
                    </button>

                    <button
                        class="source-option"
                        data-source="Instagram"
                    >
                        <span>◎</span>
                        <div>
                            <strong>Instagram</strong>
                            <small>Monitor social feedback</small>
                        </div>
                    </button>

                    <button
                        class="source-option"
                        data-source="Website"
                    >
                        <span>⌂</span>
                        <div>
                            <strong>Website</strong>
                            <small>Collect direct feedback</small>
                        </div>
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(modal);


        /* Modal styles */

        const style =
            document.createElement("style");

        style.id =
            "sourceModalStyles";


        style.textContent = `

            #sourceConnectionModal {
                position: fixed;
                inset: 0;
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .source-modal-overlay {
                position: absolute;
                inset: 0;
                background: rgba(15, 23, 42, 0.55);
                backdrop-filter: blur(5px);
            }

            .source-modal-card {
                position: relative;
                width: min(520px, calc(100% - 32px));
                background: #ffffff;
                border-radius: 20px;
                padding: 32px;
                box-shadow: 0 25px 70px rgba(0,0,0,0.25);
                z-index: 2;
                animation: sourceModalIn 0.25s ease;
            }

            @keyframes sourceModalIn {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(0.98);
                }

                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .source-modal-close {
                position: absolute;
                top: 16px;
                right: 18px;
                width: 34px;
                height: 34px;
                border: none;
                background: #f1f5f9;
                border-radius: 50%;
                font-size: 22px;
                cursor: pointer;
            }

            .source-modal-icon {
                width: 52px;
                height: 52px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #eef2ff;
                border-radius: 14px;
                font-size: 24px;
                margin-bottom: 18px;
            }

            .source-modal-card h2 {
                margin: 0 0 8px;
            }

            .source-modal-card > p {
                color: #64748b;
                line-height: 1.6;
                margin-bottom: 24px;
            }

            .source-options {
                display: grid;
                gap: 10px;
            }

            .source-option {
                display: flex;
                align-items: center;
                gap: 14px;
                width: 100%;
                padding: 14px;
                border: 1px solid #e2e8f0;
                background: #ffffff;
                border-radius: 12px;
                text-align: left;
                cursor: pointer;
                transition: 0.2s ease;
            }

            .source-option:hover {
                border-color: #6366f1;
                background: #f8fafc;
                transform: translateY(-1px);
            }

            .source-option > span {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                background: #f1f5f9;
                font-weight: 800;
                font-size: 18px;
            }

            .source-option div {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }

            .source-option small {
                color: #64748b;
            }

        `;


        document.head.appendChild(style);

    }


    modal.style.display =
        "flex";


    /* Close button */

    const closeButton =
        document.getElementById(
            "closeSourceModal"
        );


    if (closeButton) {

        closeButton.onclick =
            closeSourceModal;

    }


    /* Overlay */

    const overlay =
        modal.querySelector(
            ".source-modal-overlay"
        );


    if (overlay) {

        overlay.onclick =
            closeSourceModal;

    }


    /* Source options */

    const options =
        modal.querySelectorAll(
            ".source-option"
        );


    options.forEach(option => {

        option.onclick = () => {

            const source =
                option.dataset.source;


            option.innerHTML =
                `
                <span>✓</span>
                <div>
                    <strong>Connecting...</strong>
                    <small>Please wait</small>
                </div>
                `;


            setTimeout(() => {

                option.innerHTML =
                    `
                    <span>✓</span>
                    <div>
                        <strong>${source} Connected</strong>
                        <small>Feedback synchronization is active</small>
                    </div>
                    `;


                setTimeout(() => {

                    closeSourceModal();

                    showSourceNotification(
                        `${source} connected successfully`
                    );

                }, 900);

            }, 1000);

        };

    });

}


/* ---------------------------------------------------------
   CLOSE SOURCE MODAL
--------------------------------------------------------- */

function closeSourceModal() {

    const modal =
        document.getElementById(
            "sourceConnectionModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


/* ---------------------------------------------------------
   SOURCE NOTIFICATION
--------------------------------------------------------- */

function showSourceNotification(message) {

    let notification =
        document.getElementById(
            "sourceNotification"
        );


    if (!notification) {

        notification =
            document.createElement("div");

        notification.id =
            "sourceNotification";


        notification.style.position =
            "fixed";

        notification.style.bottom =
            "25px";

        notification.style.right =
            "25px";

        notification.style.padding =
            "14px 20px";

        notification.style.background =
            "#111827";

        notification.style.color =
            "#ffffff";

        notification.style.borderRadius =
            "10px";

        notification.style.fontSize =
            "14px";

        notification.style.fontWeight =
            "600";

        notification.style.zIndex =
            "100001";

        notification.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.2)";

        notification.style.transition =
            "opacity 0.3s ease";


        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        "✓ " + message;

    notification.style.opacity =
        "1";


    clearTimeout(
        window.sourceNotificationTimer
    );


    window.sourceNotificationTimer =
        setTimeout(() => {

            notification.style.opacity =
                "0";

        }, 2500);

}


/* ---------------------------------------------------------
   SOURCE STATUS ANIMATION
--------------------------------------------------------- */

sourceCards.forEach(card => {

    const status =
        card.querySelector("strong");


    if (!status) return;


    const currentStatus =
        status.textContent.trim();


    if (
        currentStatus === "Connected" ||
        currentStatus === "Active"
    ) {

        status.style.cursor =
            "pointer";


        status.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                showSourceNotification(
                    `${card.querySelector("h3").textContent} is active`
                );

            }
        );

    }

});
/* =========================================================
   REVIEWIQ — SETTINGS
   ========================================================= */


/* ---------------------------------------------------------
   SETTINGS TABS
--------------------------------------------------------- */

const settingsTabs =
    document.querySelectorAll(
        "#settingsPage .settings-tab"
    );

const settingsSections =
    document.querySelectorAll(
        "#settingsPage .settings-section"
    );


settingsTabs.forEach((tab, index) => {

    tab.addEventListener("click", () => {

        settingsTabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");


        /*
         * The existing HTML contains several settings
         * sections. We keep them visible because they
         * represent the complete settings overview.
         * Clicking a tab highlights the selected area.
         */

        if (settingsSections[index]) {

            settingsSections[index].scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        showSettingsNotification(
            `${tab.textContent.trim()} selected`
        );

    });

});


/* ---------------------------------------------------------
   BUSINESS PROFILE — SAVE CHANGES
--------------------------------------------------------- */

const saveSettingsButton =
    document.querySelector(
        "#settingsPage .save-button"
    );


if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
        "click",
        () => {

            const originalText =
                saveSettingsButton.innerHTML;


            saveSettingsButton.innerHTML =
                "Saving...";

            saveSettingsButton.disabled =
                true;


            setTimeout(() => {

                saveSettingsButton.innerHTML =
                    "✓ Changes Saved";

                saveSettingsButton.disabled =
                    false;


                showSettingsNotification(
                    "Business profile updated successfully"
                );


                setTimeout(() => {

                    saveSettingsButton.innerHTML =
                        originalText;

                }, 1800);

            }, 1000);

        }
    );

}


/* ---------------------------------------------------------
   AI SETTINGS TOGGLE
--------------------------------------------------------- */

const aiToggle =
    document.querySelector(
        "#settingsPage .switch input"
    );


if (aiToggle) {

    aiToggle.addEventListener(
        "change",
        () => {

            if (aiToggle.checked) {

                showSettingsNotification(
                    "Auto-reply suggestions enabled"
                );

            } else {

                showSettingsNotification(
                    "Auto-reply suggestions disabled"
                );

            }

        }
    );

}


/* ---------------------------------------------------------
   TEAM MEMBERS
--------------------------------------------------------- */

const teamMembers =
    document.querySelectorAll(
        "#settingsPage .team-member"
    );


teamMembers.forEach(member => {

    member.style.cursor =
        "pointer";


    member.addEventListener(
        "click",
        () => {

            const name =
                member.querySelector(
                    "strong"
                );

            const email =
                member.querySelector(
                    "small"
                );

            const role =
                member.querySelector(
                    ".role"
                );


            alert(
                "Team Member\n\n" +
                "Name: " +
                (
                    name
                        ? name.textContent
                        : "Team member"
                ) +
                "\n\nEmail: " +
                (
                    email
                        ? email.textContent
                        : "Not available"
                ) +
                "\n\nRole: " +
                (
                    role
                        ? role.textContent
                        : "Member"
                )
            );

        }
    );

});


/* ---------------------------------------------------------
   SECURITY
--------------------------------------------------------- */

const securityTab =
    Array.from(settingsTabs).find(tab =>
        tab.textContent
            .toLowerCase()
            .includes("security")
    );


if (securityTab) {

    securityTab.addEventListener(
        "click",
        () => {

            alert(
                "Security Settings\n\n" +
                "Your ReviewIQ workspace is protected with secure account controls.\n\n" +
                "Available security features include password protection, account access management and workspace security."
            );

        }
    );

}


/* ---------------------------------------------------------
   NOTIFICATIONS
--------------------------------------------------------- */

const notificationsTab =
    Array.from(settingsTabs).find(tab =>
        tab.textContent
            .toLowerCase()
            .includes("notifications")
    );


if (notificationsTab) {

    notificationsTab.addEventListener(
        "click",
        () => {

            alert(
                "Notification Settings\n\n" +
                "Manage alerts for new feedback, sentiment changes, AI insights and important account activity."
            );

        }
    );

}


/* ---------------------------------------------------------
   API KEYS
--------------------------------------------------------- */

const apiKeysTab =
    Array.from(settingsTabs).find(tab =>
        tab.textContent
            .toLowerCase()
            .includes("api keys")
    );


if (apiKeysTab) {

    apiKeysTab.addEventListener(
        "click",
        () => {

            alert(
                "API Keys\n\n" +
                "API keys allow external applications and integrations to communicate securely with ReviewIQ.\n\n" +
                "API key management would be available here."
            );

        }
    );

}


/* ---------------------------------------------------------
   SUBSCRIPTION
--------------------------------------------------------- */

const subscriptionTab =
    Array.from(settingsTabs).find(tab =>
        tab.textContent
            .toLowerCase()
            .includes("subscription")
    );


if (subscriptionTab) {

    subscriptionTab.addEventListener(
        "click",
        () => {

            alert(
                "Subscription\n\n" +
                "Current Plan: Premium\n\n" +
                "Your plan includes advanced analytics, AI insights and reporting features."
            );

        }
    );

}


/* ---------------------------------------------------------
   BILLING
--------------------------------------------------------- */

const billingTab =
    Array.from(settingsTabs).find(tab =>
        tab.textContent
            .toLowerCase()
            .includes("billing")
    );


if (billingTab) {

    billingTab.addEventListener(
        "click",
        () => {

            alert(
                "Billing\n\n" +
                "Manage invoices, payment methods and subscription billing from this section."
            );

        }
    );

}


/* ---------------------------------------------------------
   AI SETTINGS
--------------------------------------------------------- */

const aiSettingsTab =
    Array.from(settingsTabs).find(tab =>
        tab.textContent
            .toLowerCase()
            .includes("ai settings")
    );


if (aiSettingsTab) {

    aiSettingsTab.addEventListener(
        "click",
        () => {

            alert(
                "AI Settings\n\n" +
                "ReviewIQ AI is configured for customer feedback analysis, sentiment detection and response suggestions.\n\n" +
                "Current detection mode: High Precision"
            );

        }
    );

}


/* ---------------------------------------------------------
   MANAGE BILLING BUTTON
--------------------------------------------------------- */

const manageBillingButton =
    document.querySelector(
        ".subscription-card .secondary-button"
    );


if (manageBillingButton) {

    manageBillingButton.addEventListener(
        "click",
        () => {

            showSettingsNotification(
                "Billing management opened"
            );

        }
    );

}


/* ---------------------------------------------------------
   SETTINGS INPUT FEEDBACK
--------------------------------------------------------- */

const settingsInputs =
    document.querySelectorAll(
        "#settingsPage input, #settingsPage select"
    );


settingsInputs.forEach(input => {

    input.addEventListener(
        "focus",
        () => {

            input.style.outline =
                "2px solid rgba(99, 102, 241, 0.18)";

        }
    );


    input.addEventListener(
        "blur",
        () => {

            input.style.outline =
                "";

        }
    );

});


/* ---------------------------------------------------------
   SETTINGS NOTIFICATION
--------------------------------------------------------- */

function showSettingsNotification(message) {

    let notification =
        document.getElementById(
            "settingsNotification"
        );


    if (!notification) {

        notification =
            document.createElement("div");

        notification.id =
            "settingsNotification";


        notification.style.position =
            "fixed";

        notification.style.bottom =
            "25px";

        notification.style.right =
            "25px";

        notification.style.padding =
            "14px 20px";

        notification.style.background =
            "#111827";

        notification.style.color =
            "#ffffff";

        notification.style.borderRadius =
            "10px";

        notification.style.fontSize =
            "14px";

        notification.style.fontWeight =
            "600";

        notification.style.zIndex =
            "100001";

        notification.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.2)";

        notification.style.transition =
            "opacity 0.3s ease";


        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        "✓ " + message;

    notification.style.opacity =
        "1";


    clearTimeout(
        window.settingsNotificationTimer
    );


    window.settingsNotificationTimer =
        setTimeout(() => {

            notification.style.opacity =
                "0";

        }, 2500);

}
/* =========================================================
   CUSTOMER FEEDBACK PAGE
========================================================= */

const customerFeedbackPage =
    document.getElementById("customerFeedbackPage");

const appPage =
    document.getElementById("appPage");

const feedbackForm =
    document.getElementById("feedbackForm");

const submitAnother =
    document.getElementById("submitAnother");

const thankYouModal =
    document.getElementById("thankYouModal");


/* ---------------------------------------------------------
   OPEN CUSTOMER FEEDBACK PAGE
--------------------------------------------------------- */

function openCustomerFeedback() {

    if (appPage) {
        appPage.classList.add("hidden");
    }

    if (customerFeedbackPage) {
        customerFeedbackPage.classList.remove("hidden");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ---------------------------------------------------------
   RETURN TO DASHBOARD
--------------------------------------------------------- */

function closeCustomerFeedback() {

    if (customerFeedbackPage) {
        customerFeedbackPage.classList.add("hidden");
    }

    if (thankYouModal) {
        thankYouModal.classList.add("hidden");
    }

    if (appPage) {
        appPage.classList.remove("hidden");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ---------------------------------------------------------
   CREATE A CUSTOMER FEEDBACK BUTTON
   This gives us an easy way to demonstrate the page.
--------------------------------------------------------- */

const feedbackEntryButton =
    document.createElement("button");

feedbackEntryButton.type = "button";
feedbackEntryButton.className =
    "customer-feedback-entry";

feedbackEntryButton.innerHTML =
    "✦ Give Feedback";


feedbackEntryButton.addEventListener(
    "click",
    openCustomerFeedback
);


/* Add button to topbar */

const topbarRight =
    document.querySelector(".topbar-right");

if (topbarRight) {

    topbarRight.insertBefore(
        feedbackEntryButton,
        topbarRight.firstChild
    );

}


/* ---------------------------------------------------------
   STAR RATING
--------------------------------------------------------- */

const stars =
    document.querySelectorAll(
        "#starRating button"
    );

const selectedRating =
    document.getElementById(
        "selectedRating"
    );


stars.forEach((star, index) => {

    star.addEventListener("click", () => {

        const rating =
            index + 1;

        if (selectedRating) {
            selectedRating.value =
                rating;
        }

        stars.forEach((item, starIndex) => {

            item.textContent =
                starIndex < rating
                    ? "★"
                    : "☆";

        });

    });

});


/* ---------------------------------------------------------
   CHARACTER COUNTER
--------------------------------------------------------- */

const feedbackComment =
    document.getElementById(
        "feedbackComment"
    );

const characterCount =
    document.getElementById(
        "characterCount"
    );


if (feedbackComment) {

    feedbackComment.addEventListener(
        "input",
        () => {

            if (characterCount) {

                characterCount.textContent =
                    feedbackComment.value.length;

            }

        }
    );

}



/* ---------------------------------------------------------
   SUBMIT ANOTHER FEEDBACK
--------------------------------------------------------- */

if (submitAnother) {

    submitAnother.addEventListener(
        "click",
        () => {

            if (thankYouModal) {
                thankYouModal.classList.add(
                    "hidden"
                );
            }

            if (feedbackForm) {
                feedbackForm.reset();
            }

            if (selectedRating) {
                selectedRating.value = "0";
            }

            stars.forEach(star => {
                star.textContent = "☆";
            });

            if (characterCount) {
                characterCount.textContent = "0";
            }

        }
    );

}
/* =========================================================
   REVIEWIQ — CUSTOMER FEEDBACK CONNECTION
   Saves customer feedback and displays it on:
   1. Dashboard
   2. Feedback Management
========================================================= */

(function () {

    const STORAGE_KEY = "reviewIQ_customer_feedback";

    const feedbackForm = document.getElementById("feedbackForm");
    const thankYouModal = document.getElementById("thankYouModal");
    const submitAnother = document.getElementById("submitAnother");

    const nameInput = document.getElementById("customerName");
    const emailInput = document.getElementById("customerEmail");
    const productInput = document.getElementById("productService");
    const ratingInput = document.getElementById("selectedRating");
    const categoryInput = document.getElementById("feedbackCategory");
    const commentInput = document.getElementById("feedbackComment");

    const stars = document.querySelectorAll("#starRating button");
    const characterCount = document.getElementById("characterCount");


    /* =========================================================
       GET SAVED FEEDBACK
    ========================================================= */

    function getFeedback() {

        try {

            return JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || [];

        } catch (error) {

            return [];

        }

    }


    /* =========================================================
       SAVE FEEDBACK
    ========================================================= */

    function saveFeedback(feedback) {

        const feedbackList = getFeedback();

        feedbackList.unshift(feedback);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(feedbackList)
        );

    }


    /* =========================================================
       RATING → STARS
    ========================================================= */

    function getStars(rating) {

        const number = Number(rating) || 0;

        return (
            "★".repeat(number) +
            "☆".repeat(5 - number)
        );

    }


    /* =========================================================
       RATING → SENTIMENT
    ========================================================= */

    function getSentiment(rating) {

        rating = Number(rating);

        if (rating >= 4) {
            return "Positive";
        }

        if (rating === 3) {
            return "Neutral";
        }

        return "Negative";

    }


    /* =========================================================
       GET SENTIMENT CSS CLASS
    ========================================================= */

    function getSentimentClass(sentiment) {

        if (sentiment === "Positive") {
            return "positive-status";
        }

        if (sentiment === "Neutral") {
            return "neutral-status";
        }

        return "negative-status";

    }


    /* =========================================================
       GET CUSTOMER INITIALS
    ========================================================= */

    function getInitials(name) {

        if (!name) {
            return "AC";
        }

        const words = name.trim().split(/\s+/);

        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();

    }


    /* =========================================================
       SAFELY DISPLAY TEXT
    ========================================================= */

    function escapeHTML(text) {

        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================================
       SHORTEN LONG REVIEW
    ========================================================= */

    function shorten(text, length) {

        if (!text) {
            return "";
        }

        if (text.length <= length) {
            return text;
        }

        return text.substring(0, length) + "...";

    }


    /* =========================================================
       ADD FEEDBACK TO FEEDBACK MANAGEMENT
    ========================================================= */

    function displayFeedbackTable() {

        const tableBody =
            document.getElementById("feedbackTableBody");

        if (!tableBody) {
            return;
        }

        const feedbackList = getFeedback();

        feedbackList.forEach(item => {

            if (
                tableBody.querySelector(
                    `[data-feedback-id="${item.id}"]`
                )
            ) {
                return;
            }

            const sentiment =
                getSentiment(item.rating);

            const sentimentClass =
                getSentimentClass(sentiment);

            const row =
                document.createElement("tr");

            row.setAttribute(
                "data-feedback-id",
                item.id
            );

            row.setAttribute(
                "data-source",
                "Website"
            );

            row.setAttribute(
                "data-sentiment",
                sentiment
            );

            row.setAttribute(
                "data-category",
                item.category
            );

            row.innerHTML = `

                <td>

                    <div class="customer">

                        <div class="small-avatar">
                            ${getInitials(item.name)}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(item.name)}
                            </strong>

                            <small>
                                Website
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${escapeHTML(item.comment)}
                </td>


                <td>
                    ${getStars(item.rating)}
                </td>


                <td>

                    <span class="status ${sentimentClass}">
                        ${sentiment}
                    </span>

                </td>


                <td>
                    ${escapeHTML(item.category)}
                </td>


                <td>

                    <span class="status pending-status">
                        New
                    </span>

                </td>


                <td>
                    ${escapeHTML(item.date)}
                </td>

            `;

            tableBody.insertBefore(
                row,
                tableBody.firstChild
            );

        });

    }


    /* =========================================================
       ADD FEEDBACK TO DASHBOARD
    ========================================================= */

    function displayDashboardFeedback() {

        const tableBody =
            document.getElementById("recentFeedbackTable");

        if (!tableBody) {
            return;
        }

        const feedbackList = getFeedback();

        feedbackList.forEach(item => {

            if (
                tableBody.querySelector(
                    `[data-feedback-id="${item.id}"]`
                )
            ) {
                return;
            }

            const sentiment =
                getSentiment(item.rating);

            const sentimentClass =
                getSentimentClass(sentiment);

            const row =
                document.createElement("tr");

            row.setAttribute(
                "data-feedback-id",
                item.id
            );

            row.innerHTML = `

                <td>

                    <div class="customer">

                        <div class="small-avatar">
                            ${getInitials(item.name)}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(item.name)}
                            </strong>

                            <small>
                                Website
                            </small>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="review-text">
                        ${escapeHTML(
                            shorten(item.comment, 45)
                        )}
                    </span>

                </td>


                <td>
                    ${getStars(item.rating)}
                </td>


                <td>
                    Website
                </td>


                <td>

                    <span class="status ${sentimentClass}">
                        ${sentiment}
                    </span>

                </td>


                <td>
                    ${escapeHTML(item.date)}
                </td>

            `;

            tableBody.insertBefore(
                row,
                tableBody.firstChild
            );

        });

    }


    /* =========================================================
       UPDATE TOTAL REVIEWS
    ========================================================= */

    function updateTotalReviews() {

        const totalReviews =
            document.getElementById("totalReviews");

        if (!totalReviews) {
            return;
        }

        const numberOfNewReviews =
            getFeedback().length;

        const total =
            1245 + numberOfNewReviews;

        totalReviews.textContent =
            total.toLocaleString();

    }


    /* =========================================================
       CUSTOMER SUBMITS FEEDBACK
    ========================================================= */

    if (feedbackForm) {

        feedbackForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const rating =
                    ratingInput
                        ? Number(ratingInput.value)
                        : 0;


                if (rating === 0) {

                    alert(
                        "Please select an overall rating before submitting."
                    );

                    return;

                }


                const comment =
                    commentInput
                        ? commentInput.value.trim()
                        : "";


                if (!comment) {

                    alert(
                        "Please enter your comments before submitting."
                    );

                    return;

                }


                const customerName =
                    nameInput &&
                    nameInput.value.trim()
                        ? nameInput.value.trim()
                        : "Anonymous Customer";


                const feedback = {

                    id: Date.now().toString(),

                    name: customerName,

                    email:
                        emailInput
                            ? emailInput.value.trim()
                            : "",

                    product:
                        productInput
                            ? productInput.value
                            : "",

                    rating: rating,

                    category:
                        categoryInput &&
                        categoryInput.value
                            ? categoryInput.value
                            : "Other",

                    comment: comment,

                    date:
                        new Date().toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            }
                        )

                };


                /* SAVE */

                saveFeedback(feedback);


                /* UPDATE DASHBOARD */

                displayDashboardFeedback();


                /* UPDATE FEEDBACK PAGE */

                displayFeedbackTable();


                /* UPDATE REVIEW COUNT */

                updateTotalReviews();


                /* SHOW THANK YOU */

                if (thankYouModal) {

                    thankYouModal.classList.remove(
                        "hidden"
                    );

                }

            }
        );

    }


    /* =========================================================
       SUBMIT ANOTHER FEEDBACK
    ========================================================= */

    if (submitAnother) {

        submitAnother.addEventListener(
            "click",
            function () {

                if (thankYouModal) {

                    thankYouModal.classList.add(
                        "hidden"
                    );

                }

                if (feedbackForm) {
                    feedbackForm.reset();
                }

                if (ratingInput) {
                    ratingInput.value = "0";
                }

                stars.forEach(star => {
                    star.textContent = "☆";
                });

                if (characterCount) {
                    characterCount.textContent = "0";
                }

            }
        );

    }


    /* =========================================================
       CHARACTER COUNTER
    ========================================================= */

    if (commentInput && characterCount) {

        commentInput.addEventListener(
            "input",
            function () {

                characterCount.textContent =
                    commentInput.value.length;

            }
        );

    }


    /* =========================================================
       LOAD SAVED FEEDBACK WHEN DASHBOARD OPENS
    ========================================================= */

    displayFeedbackTable();

    displayDashboardFeedback();

    updateTotalReviews();

})();