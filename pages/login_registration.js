
document.getElementById('signUp').addEventListener('click', function () {
    document.querySelector('.image').style.left = '0';

    document.getElementById('signIn').classList.remove('no-pointer-events');
    document.getElementById('signUp').classList.add('no-pointer-events');
});

document.getElementById('signIn').addEventListener('click', function () {
    document.querySelector('.image').style.left = '50%';

    document.getElementById('signUp').classList.remove('no-pointer-events');
    document.getElementById('signIn').classList.add('no-pointer-events');
});


function searchAddress() {
    let cep = document.getElementById("cep").value;
    cep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cep.length === 8) {
        let url = `https://viacep.com.br/ws/${cep}/json/`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!("erro" in data)) {
                    document.getElementById("address").value = data.logradouro;
                    //document.getElementById("bairro").value = data.bairro;
                    document.getElementById("city").value = data.localidade;
                    document.getElementById("state").value = data.uf;
                } else {
                    alert("CEP não encontrado.");
                }
            })
            .catch(error => {
                console.error('Erro ao buscar o CEP:', error);
                alert("Erro ao buscar o CEP.");
            });
    } else {
        alert("CEP inválido.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const groups = document.querySelectorAll(".group");
    let currentGroup = 0;

    groups[currentGroup].style.display = "flex";

    const nextButtons = document.querySelectorAll(".next, .btn-continue");
    const backButtons = document.querySelectorAll(".previous");
    const submit = document.getElementById("submit");

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

    submit.addEventListener("click", function (event) {
        event.preventDefault();
        registration(event);
    });

    async function registration(event) {
        event.preventDefault();

        const cpf = document.getElementById("cpf")?.value || '';
        const emailR = document.getElementById("emailR")?.value || '';
        const name = document.getElementById("name")?.value || '';
        const phone = document.getElementById("phone")?.value || '';
        const birthdate = document.getElementById("birthdate")?.value || '';
        const cep = document.getElementById("cep")?.value || '';
        const city = document.getElementById("city")?.value || '';
        const state = document.getElementById("state")?.value || '';
        const address = document.getElementById("address")?.value || '';
        const houseNum = document.getElementById("houseNum")?.value || '';
        const complement = document.getElementById("complement")?.value || '';
        const username = document.getElementById("username")?.value || '';
        const passwordR = document.getElementById("passwordR")?.value || '';
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
            if (!cpf || !emailR) {
                showError("#requiredFG");
            } else {
                hideError("#requiredFG");
            }
            if (!emailR.includes("@")) {
                showError("#requiredEmail");
            }
            else {
                hideError("#requiredEmail");
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
            if (!cep || !city || !state || !address || !houseNum || !complement) {
                showError("#requiredTG");
            } else {
                hideError("#requiredTG");
            }
        }

        if (currentGroup === 3) {
            if (!username | !passwordR || !confirmPassword) {
                showError("#requiredFOG");
            } else {
                hideError("#requiredFOG");
            }

            if (passwordR.length < 8 || passwordR.length > 16) {
                showError("#passwordLenght");
            } else {
                hideError("#passwordLenght");

            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
            if (!passwordRegex.test(passwordR)) {
                showError("#passwordRegex");
            } else {
                hideError("#passwordRegex");

            }

            if (passwordR !== confirmPassword) {
                showError("#passwordConfirmation");
            } else {
                hideError("#passwordConfirmation");
            }
        }




        if (valid) {
            if (currentGroup === groups.length - 1) {
                try {
                    console.log("oii")
                    const response = await fetch('/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ cpf, emailR, name, phone, birthdate, cep, city, state, address, houseNum, complement, username, passwordR })
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert('Cadastro realizado com sucesso!');
                        window.location.href = "login_registration.html";
                    } else {
                        alert('Erro no cadastro: ' + result.message);
                    }
                } catch (error) {
                    console.error('Erro na requisição:', error);
                }
            } else {
                goToNextGroup();
            }
        }
    }


    document.querySelector("form").addEventListener("submit", function (event) {
        registration(event);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", async (event) => {
        const email = document.getElementById("email")?.value || '';
        const password = document.getElementById("password")?.value || '';
        console.log(password, email)

        if (!email || !password) {
            document.getElementById("required").style.display = "block";
            event.preventDefault();
        }
        else {
            document.getElementById("required").style.display = "none"
         
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                console.log(response)

                const result = await response.json();
                if (result.success) {
                    alert('Login bem-sucedido!');
                    window.location.href = "profile.html";
                } else {
                    alert('Falha no login: ' + result.message);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }
    })
})
