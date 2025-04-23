
// script.js
document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  
  if (!username || !email || !password) {
    document.getElementById("message").textContent = "Заполните все поля!";
    return;
  }
  
  // Можно добавить валидацию email и пароля
  
  // Здесь можно отправить данные на сервер или сохранить в localStorage
  const user = {
    username,
    email,
    password,
  };
  
  // Пример сохранения в localStorage
  localStorage.setItem("user", JSON.stringify(user));
  
  document.getElementById("message").textContent = "Регистрация успешна!";
  document.getElementById("registerForm").reset();
});

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA6UE15NYEYUw0hsL9LY2W7QGi2OY0vgWo",
    authDomain: "druxblox-8d353.firebaseapp.com",
    databaseURL: "https://druxblox-8d353-default-rtdb.firebaseio.com",
    projectId: "druxblox-8d353",
    storageBucket: "druxblox-8d353.firebasestorage.app",
    messagingSenderId: "236205265452",
    appId: "1:236205265452:web:4b2bd3eb4fb54ef8b0b789",
    measurementId: "G-ZVGGQL21LF"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
// script.js

// 1. Импортируйте нужные функции из SDK (v9 модульный синтаксис)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 2. Конфигурация вашего Firebase‑проекта
const firebaseConfig = {
  apiKey: "AIzaSyA6UE15NYEYUw0hsL9LY2W7QGi2OY0vgWo",
  authDomain: "druxblox-8d353.firebaseapp.com",
  projectId: "https://druxblox-8d353-default-rtdb.firebaseio.com",
  storageBucket: "druxblox.appspot.com",
  appId: "1:236205265452:web:4b2bd3eb4fb54ef8b0b789"
};

// 3. Инициализация
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // если будете сохранять профили

// 4. Обработчик отправки формы
const form = document.getElementById("registerForm");
const msg = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  
  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  
  if (!username || !email || !password) {
    msg.textContent = "Пожалуйста, заполните все поля.";
    return;
  }
  
  try {
    // 5. Создаём пользователя
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 6. Обновляем displayName (имя пользователя)
    await updateProfile(user, { displayName: username });
    
    // 7. (Опционально) Сохраняем профиль в Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      createdAt: new Date()
    });
    
    msg.style.color = "green";
    msg.textContent = "Регистрация прошла успешно!";
    
    form.reset();
  } catch (error) {
    // Обработка ошибок
    msg.style.color = "red";
    switch (error.code) {
      case "auth/email-already-in-use":
        msg.textContent = "Этот Email уже зарегистрирован.";
        break;
      case "auth/invalid-email":
        msg.textContent = "Неверный формат Email.";
        break;
      case "auth/weak-password":
        msg.textContent = "Пароль должен быть не менее 6 символов.";
        break;
      default:
        msg.textContent = error.message;
    }
  }
});