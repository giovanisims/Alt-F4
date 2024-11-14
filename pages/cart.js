document.addEventListener('DOMContentLoaded', function () {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCart() {
        const cartContainer = document.getElementById("products");
        const summary = document.getElementById("summary");
        const content = document.getElementById("content");

        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="cartEmpty">Seu carrinho está vazio. Adicione produtos para continuar.</p>';
            return;
        }

        summary.innerHTML = '';
        let subtotal = 0;

        cart.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.URL}" alt="foto do produto">
                <div class="productInfo">
                    <div class="productName">
                        <h4>${product.Name}</h4>
                        <p>ID: ${product.id}</p>
                    </div>
                    <div class="productPrice">
                        <h4>R$${(product.Price).toFixed(2)}</h4>
                        <p>Até x12 sem juros</p>
                    </div>
                    <div class="productSize">
                        <h4>Tamanho</h4>
                        <p>Único</p>
                        <label>Quantidade</label><br>
                        <input type="number" min="1" value="${product.quantity}" data-id="${product.id}">
                    </div>
                </div>
                <i class="fa-solid fa-xmark selfAlign" data-id="${product.id}"></i>
            `;
            cartContainer.appendChild(productElement);

            // Calcular o subtotal
            subtotal += product.Price * product.quantity;
        });

        // Calcular o frete (exemplo simples)
        const frete = 10.00; // Simulação de frete fixo
        const total = subtotal + frete;

        // Atualizar a seção de resumo
        summary.innerHTML = `
            <h3>Resumo</h3>
            <div class="summaryInfo">
                <h5>Subtotal</h5>
                <p>R$${subtotal.toFixed(2)}</p>
            </div>
            <div class="summaryInfo">
                <h5>Frete</h5>
                <p>R$${frete.toFixed(2)}</p>
            </div>
            <div class="summaryInfo">
                <h4>Total</h4>
                <p>R$${total.toFixed(2)}</p>
            </div>
            <button id='endBuy'>Finalizar compra</button>
        `;

        document.querySelectorAll(".fa-xmark").forEach(button => {
            button.addEventListener('click', function (event) {
                const productId = event.target.dataset.id;
                const updatedCart = cart.filter(item => item.id !== productId);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                updateCart();
                location.reload();
            });
        });

        document.querySelectorAll(".productSize input").forEach(input => {
            input.addEventListener('change', function (event) {
                const productId = event.target.dataset.id;
                const newQuantity = parseInt(event.target.value);

                const productIndex = cart.findIndex(item => item.id === productId);
                if (productIndex !== -1) {
                    cart[productIndex].quantity = newQuantity;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCart();
                }
            });
        });

        document.getElementById('endBuy').addEventListener("click", function () {
            const lastLoginUserId = localStorage.getItem("lastLoginUserId");
            if (lastLoginUserId) {
                document.getElementById("popUp").style.display = "flex";
            } else {
                alert("Você precisa estar logado para fazer essa ação!")
                location.href = 'login_registration.html';
            }
        })
    }

    document.getElementById('confirm').addEventListener("click", function () {
        document.getElementById("cancel").style.display = "none";
        document.getElementById("confirm").style.display = "none";

        document.getElementById("text").textContent = "Compra realizada com sucesso!";


        setTimeout(function () {
            document.getElementById("popUp").style.display = "none";
            document.getElementById("cancel").style.display = "block";
            document.getElementById("confirm").style.display = "block";
            document.getElementById("text").textContent = "";
            cart.forEach(product => {
                fetch(`/buy/${product.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: product.quantity })
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(text => {
                                throw new Error(text);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data.message); // 'Compra realizada com sucesso!'
                        console.log(`Novo estoque: ${data.newStock}`);
                    })
                    .catch(error => {
                        console.error('Erro ao realizar a compra:', error);
                        alert(error.message);
                    });

            })
            cart = [];
            localStorage.removeItem("cart");
            updateCart();
        }, 3000);
    });

    document.getElementById('cancel').addEventListener("click", function () {
        document.getElementById("cancel").style.display = "none";
        document.getElementById("confirm").style.display = "none";

        document.getElementById("text").textContent = "Compra cancelada com sucesso!"

        setTimeout(function () {
            document.getElementById("popUp").style.display = "none";
            document.getElementById("cancel").style.display = "block";
            document.getElementById("confirm").style.display = "block";
            document.getElementById("text").textContent = "";
        }, 3000);
    })


    updateCart();
});
