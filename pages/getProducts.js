

const loadProductById = (ProductID) => {
    location.href=`productTemplate.html?id=${ProductID}`;

}


const loadProducts = () => {
    fetch('/products')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = '';

            if (Array.isArray(data)) {
                data.forEach(product => {
                    var rating = '';
                    for (let i = 0; i < product.Rating; i++) {
                        rating += '⭐';
                    }
                    const item = document.createElement('div');
                    item.className = 'productCard';
                    item.innerHTML = `
                            <div class="productImage">
                                <img class="product-image" src="https://via.placeholder.com/250x150" alt="Imagem do produto">
                            </div>
                            <div class="productInfo">
                                <h3>${product.Name}</h3>
                                <div class="productPrice">R$${product.Price}</div>
                                <p>${rating}</p>
                            </div>
                        `;
                    productsContainer.appendChild(item);
                });
            } else {
                console.error('Os dados retornados não são um array:', data);
            }
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}

const loadProductsPC = () => {
    fetch('/productsPC')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = '';

            if (Array.isArray(data)) {
                data.forEach(product => {
                    var rating = '';
                    for (let i = 0; i < product.Rating; i++) {
                        rating += '⭐';
                    }
                    const item = document.createElement('div');
                    item.className = 'productCard';
                    item.innerHTML = `
                            <div class="productImage">
                                <img class="product-image" src="${product.URL}" alt="Imagem do produto">
                            </div>
                            <div onclick='loadProductById(${product.ProductID})' class="productInfo">
                                <h3>${product.Name}</h3>
                                <div class="productPrice">R$${product.Price}</div>
                                <p>${rating}</p>
                            </div>
                        `;
                    productsContainer.appendChild(item);
                });
            } else {
                console.error('Os dados retornados não são um array:', data);
            }
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}


const loadProductsMobile = () => {
    fetch('/productsMobile')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = '';

            if (Array.isArray(data)) {
                data.forEach(product => {
                    var rating = '';
                    for (let i = 0; i < product.Rating; i++) {
                        rating += '⭐';
                    }
                    const item = document.createElement('div');
                    item.className = 'productCard';
                    item.innerHTML = `
                            <div class="productImage">
                                <img class="product-image" src="${product.URL}" alt="Imagem do produto">
                            </div>
                            <div onclick='loadProductById(${product.ProductID})'  class="productInfo">
                                <h3>${product.Name}</h3>
                                <div class="productPrice">R$${product.Price}</div>
                                <p>${rating}</p>
                            </div>
                        `;
                    productsContainer.appendChild(item);
                });
            } else {
                console.error('Os dados retornados não são um array:', data);
            }
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}


const loadProductsConsole = () => {
    fetch('/productsConsole')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = '';

            if (Array.isArray(data)) {
                data.forEach(product => {
                    var rating = '';
                    for (let i = 0; i < product.Rating; i++) {
                        rating += '⭐';
                    }
                    const item = document.createElement('div');
                    item.className = 'productCard';
                    item.innerHTML = `
                            <div class="productImage">
                                <img class="product-image" src="${product.URL}" alt="Imagem do produto">
                            </div>
                            <div onclick='loadProductById(${product.ProductID})' class="productInfo">
                                <h3>${product.Name}</h3>
                                <div class="productPrice">R$${product.Price}</div>
                                <p>${rating}</p>
                            </div>
                        `;
                    productsContainer.appendChild(item);
                });
            } else {
                console.error('Os dados retornados não são um array:', data);
            }
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}