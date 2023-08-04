const registerModal = document.getElementById("registerModal");
const registerBtn = document.querySelector(".register__btn");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const registrationForm = document.querySelector(".registration-form");
const loginForm = document.getElementById("loginForm");
const userField = document.getElementById("user");
const passwordField = document.getElementById("password");
const showPasswordIcon = document.getElementById("showPasswordIcon");
const passwordInput = document.getElementById("password");

// Obtenemos las credenciales de usuarios almacenadas en LocalStorage
let userCredentialsList = JSON.parse(localStorage.getItem("userCredentials"));

// Verificar si los datos obtenidos del LocalStorage son un array válido
if (!Array.isArray(userCredentialsList)) {
    userCredentialsList = [];
}

registerBtn.addEventListener("click", () => {
    registerModal.style.display = "block";
});

modalCloseBtn.addEventListener("click", () => {
    registerModal.style.display = "none";
});

registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const registerUserInput = document.getElementById("registerUser");
    const registerPasswordInput = document.getElementById("registerPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const username = registerUserInput.value;
    const password = registerPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const userExists = userCredentialsList.some((user) => user.username === username);

    if (userExists) {
        Swal.fire({
            icon: 'warning',
            title: 'El nombre de usuario no esta disponible',
            text: 'Por favor, intenta con otro.',
        });
        return;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
        return;
    }

    // Guardar los datos del nuevo usuario en el array y en LocalStorage
    const newUserCredentials = {
        username,
        password
    };
    userCredentialsList.push(newUserCredentials);
    localStorage.setItem("userCredentials", JSON.stringify(userCredentialsList));

    // Cerrar la ventana modal al registrarse
    registerModal.style.display = "none";

    // Completar los campos de inicio de sesión con la información registrada
    userField.value = username;
    passwordField.value = password;

    // Mostrar un mensaje de bienvenida con el nombre de usuario
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Bienvenido, ' + username,
        showConfirmButton: false,
        timer: 1500
    });

});

showPasswordIcon.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = userField.value;
    const password = passwordField.value;

    if (username.trim() === '' || password.trim() === '') {
        alert("Por favor, complete todos los campos.");
    } else {
        // Verificar si las credenciales son válidas
        const user = userCredentialsList.find((user) => user.username === username && user.password === password);

        if (user) {
            // Credenciales correctas, redirigir al usuario a la página de ventas
            localStorage.setItem("currentUsername", username); // Almacenar el nombre de usuario actual
            window.location.href = "./pages/menu.html";
        } else {
            // Credenciales incorrectas, mostrar un mensaje de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Credenciales incorrectas',
                text: 'Por favor, intenta de nuevo.',
            });
        }
    }
});