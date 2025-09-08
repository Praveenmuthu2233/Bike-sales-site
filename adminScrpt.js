document.getElementById("loginForm")?.addEventListener("submit", submitAdminInput);

function submitAdminInput(event) {
    event.preventDefault();

    let adminName = document.getElementById("userName").value;
    let adminPass = document.getElementById("Password").value;

    let trueName = "Praveen";
    let truePass = "praveen@22";

    let existingError = document.getElementById("error-msg");
    if (existingError) {
        existingError.remove();
    }

    if (adminName === trueName && adminPass === truePass) {
        localStorage.setItem("isAdminLoggedIn", "true");
        window.location.href = "adminInfor.html";
    } else {
        let errorPara = document.createElement("p");
        errorPara.textContent = "Invalid input!";
        errorPara.id = "error-msg";
        errorPara.style.color = "red";
        let errorContainer = document.querySelector(".errPara");
        errorContainer.appendChild(errorPara);
    }
}

window.addEventListener('load', submitData);

