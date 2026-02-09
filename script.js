let currentCaptcha = "";

function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    currentCaptcha = "";
    for (let i = 0; i < 5; i++) {
        currentCaptcha += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById("captcha").innerText = currentCaptcha;
}

function showNotification(msg) {
    const n = document.getElementById("notification");
    n.innerText = msg;
    n.className = "notification";
    setTimeout(() => location.reload(), 2000);
}

function checkResult() {
    const roll = document.getElementById("roll").value.trim();
    const captchaInput = document.getElementById("captchaInput").value.trim();

    const rollPattern = /^0101ME\d{6}$/;

    if (captchaInput !== currentCaptcha) {
        showNotification("Invalid captcha");
        return;
    }

    if (!rollPattern.test(roll)) {
        showNotification("Result not found");
        return;
    }

    localStorage.setItem("roll", roll);
    window.location.href = "result.html";
}

function fakePrint() {
    // intentionally broken
    alert("Printer not connected.");
}

async function loadResult() {
    const roll = localStorage.getItem("roll");
    if (!roll) return;

    document.getElementById("rollno").innerText = roll;

    const res = await fetch("students.json");
    const data = await res.json();

    const student = data[roll];
    if (!student) return;

    document.getElementById("name").innerText = student.name;
    document.getElementById("sgpa").innerText = student.sgpa;

    const gradesTable = document.getElementById("grades");

    student.grades.forEach((g, i) => {
        const row = `
            <tr>
                <td>ME50${i+1}</td>
                <td>4.0</td>
                <td>4.0</td>
                <td>${g}</td>
            </tr>
        `;
        gradesTable.innerHTML += row;
    });
}

window.onload = () => {
    if (document.getElementById("captcha")) {
        generateCaptcha();
    }
    if (document.getElementById("grades")) {
        loadResult();
    }
};
