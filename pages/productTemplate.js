const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');

const loadProduct = () => {
    fetch(`/product?id=${myParam}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const productContainer = document.getElementById('product');
            productContainer.innerHTML = '';
            var rating = '';
            for (let i = 0; i < data.Rating; i++) {
                rating += '⭐';
            }
            const item = document.createElement('div');
            item.className = 'img';
            item.innerHTML = `<img src="${data.URL ? data.URL : 'https://via.placeholder.com/300'}" alt="imagem do ${data.Name}">`;
            const item2 = document.createElement('div');
            item2.className = 'text';
            item2.innerHTML = `${data.Name}</div>
                            <div class="rating">${rating}</div>
                            <div class="price">R$${data.Price}</div>
                            <button type="button" class="buyButton">Adicionar ao Carrinho</button>
                            <div class="description">${data.Description}</div>
                           `
            productContainer.appendChild(item);
            productContainer.appendChild(item2);
            document.querySelector('.buyButton').addEventListener('click', function () {
                const product = {
                    id: myParam, // ID do produto
                    Name: data.Name,
                    Type: data.Type,
                    Price: data.Price,
                    URL: data.URL
                };
                addToCart(product);
                // Exibe o pop-up de confirmação
                const cart = document.getElementById('cart');
                cart.style.display = "block";
            });

            const cartPopUp = document.getElementById("cart");
            cartPopUp.innerHTML = `
            <div class="infoCart">
            <div class="title">
            <i class="fa-regular fa-circle-check"></i>
            <p>Adicionado ao carrinho</p>
            <i class="fa-solid fa-xmark" id="close"></i>
            </div>
            <div class="middle">
                    <img src="${data.URL}">
                    <div class="infoProduct">
                    <p>${data.Name}</p>
                    <p>${data.Type}</p>
                    <p>${data.Price}</p>
                    </div>
                    </div>
                    <button onclick="location.href='cart.html'">Ver carrinho</button>
                    </div>`;
            document.getElementById('close').addEventListener('click', function () {
                const cart = document.getElementById('cart');
                cart.style.display = 'none';
            });
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}
document.addEventListener('DOMContentLoaded', loadProduct);


// Função para adicionar um produto ao carrinho
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        // Se o produto já existe, aumenta a quantidade
        cart[existingProductIndex].quantity += 1;
    } else {
        // Caso contrário, adiciona o novo produto com quantidade inicial de 1
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}