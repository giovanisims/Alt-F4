

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
                                <img class="product-image" src="https://via.placeholder.com/250x150" alt="Imagem do produto">
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
                                <img class="product-image" src="https://via.placeholder.com/250x150" alt="Imagem do produto">
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
                                <img class="product-image" src="https://via.placeholder.com/250x150" alt="Imagem do produto">
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



const getUsers = () => {
    fetch('/users')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const usersTable = document.getElementById('table-body');
            usersTable.innerHTML = '';

            if (Array.isArray(data)) {
                data.forEach(user => {
                    const item = document.createElement('tr');
                    item.innerHTML = `                         
                <td>${user.ClientID}</td>
                <td>${user.Name}</td>
                <td>${user.Login}</td>
                <td>${user.Email}</td>
                <td>${user.CPF}</td>
                <td>${user.Birthdate}</td>
                <td>${user.CEP}</td>
                <td>
                    <button class="edit-button" onclick="location.href='login_registration.html'">Editar</button>
                    <button class="delete-button" onclick="alert('Deseja fazer isso mesmo?')">Excluir</button>
                </td>
            
                        `;
                    usersTable.appendChild(item);
                });
            } else {
                console.error('Os dados retornados não são um array:', data);
            }
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}


