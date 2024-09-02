document.addEventListener("DOMContentLoaded", function () {
    const groups = document.querySelectorAll(".group");
    let currentGroup = 0;

    groups[currentGroup].style.display = "flex";

    const nextButtons = document.querySelectorAll(".fa-arrow-right, .btn-continue");
    const backButtons = document.querySelectorAll(".fa-arrow-left");

    function goToNextGroup() {
        if (currentGroup < groups.length - 1) {
            groups[currentGroup].style.display = "none";
            currentGroup++;
            groups[currentGroup].style.display = "flex";
        }
    }

    function goToPreviousGroup() {
        if (currentGroup > 0) {
            groups[currentGroup].style.display = "none";
            currentGroup--;
            groups[currentGroup].style.display = "flex";
        }
    }

    nextButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            registration(event); 
        });
    });
    

    backButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            goToPreviousGroup();
        });
    });

    function registration(event) {
        event.preventDefault();
        
        const cpf = document.getElementById("cpf")?.value || '';
        const email = document.getElementById("email")?.value || '';
        const name = document.getElementById("name")?.value || '';
        const phone = document.getElementById("phone")?.value || '';
        const birthdate = document.getElementById("birthdate")?.value || '';
        const cep = document.getElementById("cep")?.value || '';
        const address = document.getElementById("address")?.value || '';
        const houseNum = document.getElementById("houseNum")?.value || '';
        const complement = document.getElementById("complement")?.value || '';
        const username = document.getElementById("username")?.value || '';
        const password = document.getElementById("password")?.value || '';
        const confirmPassword = document.getElementById("confirmPassword")?.value || '';
    
        let valid = true;
    
        function showError(selector) {
            document.querySelector(selector).style.display = "block";
            valid = false;
        }
    
        function hideError(selector) {
            document.querySelector(selector).style.display = "none";
        }
    
        if (currentGroup === 0) { 
            if (!cpf || !email) {
                showError("#requiredFG");
            } else {
                hideError("#requiredFG");
            }
        }
    
        if (currentGroup === 1) { 
            if (!name || !phone || !birthdate) {
                showError("#requiredSG");
            } else {
                hideError("#requiredSG");
            }
        }
    
        if (currentGroup === 2) { 
            if (!cep || !address || !houseNum || !complement) {
                showError("#requiredTG");
            } else {
                hideError("#requiredTG");
            }
        }
    
        if (currentGroup === 3) {
            if (!username | !password || !confirmPassword) {
                showError("#requiredFOG");
            } else {
                hideError("#requiredFOG");
            }
    
            if (password.length < 8 || password.length > 16) {
                showError("#passwordLenght");
            } else {
                hideError("#passwordLenght");
            }
    
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
            if (!passwordRegex.test(password)) {
                showError("#passwordRegex");
            } else {
                hideError("#passwordRegex");
            }
    
            if (password !== confirmPassword) {
                showError("#passwordConfirmation");
            } else {
                hideError("#passwordConfirmation");
            }
        }
    
    
        if (valid) {
            if (currentGroup === groups.length - 1) {
                document.querySelector("form").submit();
                alert("Cadastro finalizado com sucesso!")
                window.location.href = "login.html"; 
            } else {
                goToNextGroup(); 
            }
        }
    }
    
    
    document.querySelector("form").addEventListener("submit", function (event) {
        registration(event);
    });
});
