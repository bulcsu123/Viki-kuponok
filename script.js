// Firebase Konfiguráció
const firebaseConfig = {
    apiKey: "AIzaSyB6yLe7Y_s8PAiOi6rw3tzKFPXchnjAkNU",
    authDomain: "viki-kuponok.firebaseapp.com",
    databaseURL: "https://viki-kuponok-default-rtdb.firebaseio.com",
    projectId: "viki-kuponok",
    storageBucket: "viki-kuponok.firebasestorage.app",
    messagingSenderId: "991563070359",
    appId: "1:991563070359:web:0c3c10805b2f6fc26ba2d2"
};

// Firebase inicializálása
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const TITKOS_JELSZO = "20250805";

// BELÉPÉS LOGIKA
const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password-input");
const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const errorMsg = document.getElementById("error-msg");

loginBtn.addEventListener("click", function () {
    const beirtJelszo = passwordInput.value;

    if (beirtJelszo === TITKOS_JELSZO) {
        loginScreen.classList.add("hidden");
        mainScreen.classList.remove("hidden");
    } else { 
        errorMsg.textContent = "Helytelen jelszó, Próbáld újra ❤️";
    }
});

passwordInput.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
        loginBtn.click();
    }
});

// ADATBÁZIS BETÖLTÉSE ÉS BEVÁLTÁS
document.addEventListener("DOMContentLoaded", function () {
    const redeemButtons = document.querySelectorAll(".redeem-btn");

    // 1. Meglévő állapotok betöltése Firebase-ből
    database.ref("kuponok").on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(couponId => {
                if (data[couponId].redeemed) {
                    const card = document.getElementById(couponId);
                    if (card) {
                        card.classList.add("redeemed");
                        const btn = card.querySelector(".redeem-btn");
                        if (btn) {
                            btn.textContent = "Beváltva ✔️";
                            btn.disabled = true;
                        }
                    }
                }
            });
        }
    });

    // 2. Beváltás gomb kattintás -> Mentés Firebase-be
    redeemButtons.forEach(button => {
        button.addEventListener("click", function () {
            const card = this.parentElement;
            const couponId = card.id;
            const couponTitle = card.querySelector("h3").textContent;

            const biztos = confirm(`Biztosan be szeretnéd váltani ezt a kupont: "${couponTitle}"? ❤️`);

            if (biztos) {
                // Adatbázis frissítése
                database.ref("kuponok/" + couponId).set({
                    title: couponTitle,
                    redeemed: true,
                    redeemedAt: new Date().toLocaleString("hu-HU")
                });
            }
        });
    });
});

const formspreeUrl = "https://formspree.io/f/mgavzqpr";