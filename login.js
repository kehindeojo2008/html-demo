// Import Firebase SDK modules
import { 
    getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
    const auth = getAuth(app);
    const app = initializeApp(firebaseConfig);


// Firebase configuration (same as signup page)
const firebaseConfig = {
    apiKey: "AIzaSyChZeZk1nL61mkukc5PvT7CCQn7HAdP5AQ",
    authDomain: "login-demo-4a733.firebaseapp.com",
    projectId: "login-demo-4a733",
    storageBucket: "login-demo-4a733.firebasestorage.app",
    messagingSenderId: "78719888700",
    appId: "1:78719888700:web:a5deb2ad505c25e8a04239"
};







// Function to show feedback messages
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}



// *** CORRECTION 4: Fix ID and logic in event listener ***
const signUp = document.getElementById('submit'); 

signUp.addEventListener('click', (event) => {
    // *** CORRECTION 5: Fix syntax error ***
    event.preventDefault();

    // Get input values (assuming your HTML uses these IDs)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstname').value.trim(); // Trim for safety
    const lastName = document.getElementById('lastname').value.trim(); // Assuming lName for consistency

    // Use the initialized auth object from the top of the script (not re-initialize)
    // const auth = getAuth(); // <-- REMOVED

    // *** CORRECTION 6: Correct function name: createUserWithEmailAndPassword ***
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Data to save to Firestore
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password
            };
            
            // *** CORRECTION 7: Use a sign-up message and the user's UID for the document ***
            showMessage("Sign Up Successful! Redirecting to login...", "SignUpMessage"); 
            
            const docRef = doc(db, "users", user.uid);
            
            setDoc(docRef, userData)
                .then(() => {
                    // Redirect after successful sign-up AND Firestore data save
                    setTimeout(() => {
                         window.location.href = 'login.html';
                    }, 2000);
                })
                .catch((error) => {
                    console.error("Error writing document:", error);
                    showMessage("Sign up succeeded, but could not save profile data.", "SignUpMessage");
                });
        }) 
        // *** CORRECTION 8: Close the .catch() block for createUserWithEmailAndPassword ***
        .catch((error) => {
            const errorCode = error.code;
            console.error("Sign Up Error:", error);

            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists!', "SignUpMessage");
            } else if (errorCode === 'auth/weak-password') {
                 showMessage('Password must be at least 6 characters long.', "SignUpMessage");
            } else {
                showMessage("Unable to create User. Please try again later.", "SignUpMessage");
            }
        });
});