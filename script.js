let captchaText = "";

function goToResult() {
    window.location.href = "result.html";
}

function generateCaptcha() {
    const canvas = document.getElementById("captchaCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = 120;
    canvas.height = 40;

    captchaText = Math.random().toString(36).substring(2, 7).toUpperCase();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.fillText(captchaText, 15, 25);
}

function validateResult() {
    const roll = document.getElementById("roll").value.trim();
    const sem = document.getElementById("semester").value;
    const captchaInput = document.getElementById("captchaInput").value.trim();
    const errorBox = document.getElementById("errorBox");

    const rollPattern = /^0101ME\d{6}$/;

    if (captchaInput !== captchaText || !rollPattern.test(roll) || sem !== "5") {
        errorBox.innerText = "Result not found";
        setTimeout(() => location.reload(), 1500);
        return;
    }

    localStorage.setItem("roll", roll);
    window.location.href = "result_view.html";
}

async function loadResult() {
    const roll = localStorage.getItem("roll");
    if (!roll) {
        window.location.href = "index.html";
        return;
    }

    const res = await fetch("students.json");
    const data = await res.json();

    const student = data[roll];
    if (!student) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("name").innerText = student.name;
    document.getElementById("rollDisplay").innerText = roll;
    document.getElementById("sgpa").innerText = student.sgpa;

    const tbody = document.getElementById("marksBody");

    student.grades.forEach((grade, i) => {
        const row = `<tr>
            <td>ME50${i+1}</td>
            <td>4.0</td>
            <td>4.0</td>
            <td>${grade}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}
