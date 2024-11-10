document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Função para atualizar o carrinho
    function updateCart() {
        const cartContainer = document.getElementById("products");
        const summary = document.getElementById("summary");
        const summarySubtotal = document.querySelector(".summaryInfo .subtotal");
        const summaryFrete = document.querySelector(".summaryInfo .frete");
        const summaryTotal = document.querySelector(".summaryInfo .total");

        cartContainer.innerHTML = ''; // Limpar o conteúdo atual do carrinho
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="cartEmpty">Seu carrinho está vazio. Adicione produtos para continuar.</p>';
            return; // Interrompe a execução do código abaixo
        }
        
        summary.innerHTML = '';
        let subtotal = 0;

        // Exibir os produtos no carrinho
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
            <button>Finalizar compra</button>
        `;

        // Adicionar o evento de clique nos ícones de exclusão
        document.querySelectorAll(".fa-xmark").forEach(button => {
            button.addEventListener('click', function(event) {
                const productId = event.target.dataset.id;
                const updatedCart = cart.filter(item => item.id !== productId);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                updateCart(); // Recalcular o carrinho
                location.reload();
            });
        });

        // Atualizar quantidade do produto
        document.querySelectorAll(".productSize input").forEach(input => {
            input.addEventListener('change', function(event) {
                const productId = event.target.dataset.id;
                const newQuantity = parseInt(event.target.value);

                const productIndex = cart.findIndex(item => item.id === productId);
                if (productIndex !== -1) {
                    cart[productIndex].quantity = newQuantity;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCart(); // Recalcular o carrinho
                }
            });
        });
    }

    // Atualizar o carrinho na página
    updateCart();
});
