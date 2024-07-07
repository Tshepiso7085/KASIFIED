let iconCart = document.querySelector('.iconCart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHtml = document.querySelector('.listProduct');
let listCartHtml = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.cart-icon');
let cartTotalPrice = document.querySelector('.cartTotalPrice');


let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart')
} )
closeCart.addEventListener('click', () => {
  body.classList.toggle('showCart')
} )

const addDataToHTML = () => {
  listProductHtml.innerHTML ='';
  if ( listProducts.length > 0){
    listProducts.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('item');
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
      <img src="${product.image}" alt="black goku tee">
      <h2>${product.name}</h2>
      <div class="price">R ${product.price}</div>
      <button class="addCart">Add To Cart</button>
      <button class="addWish">Add To Wish</button>
      `;
      listProductHtml.appendChild(newProduct);
    })
  }
}
  listProductHtml.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }   
  })
  
  const addToCart = (product_id) =>{
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id) ;
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0 ){
      carts.push({
        product_id: product_id,
        quantity: 1
      })
    }else{ carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
  }
  const addCartToMemory = () =>{
    localStorage.setItem('cart', JSON.stringify(carts));
  }

  // cartTotalPrice = totalQuantity + carts;
  const addCartToHTML = ()=>{
    listCartHtml.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0; // New variable to store total price
    if(carts.length > 0){
      carts.forEach(cart => {
        totalQuantity = totalQuantity + cart.quantity
        let newCart = document.createElement('div');
        newCart.classList.add('item');
        newCart.dataset.id = cart.product_id;
        let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
        let info = listProducts[positionProduct];
        let itemPrice = info.price * cart.quantity; // Calculate the price for this item
        totalPrice += itemPrice; // Add this item's price to the total price
        newCart.innerHTML = `
        <div class="image">
        <img src="${info.image}" alt="black goku tee">
      </div>
      <div class="name">${info.name}</div>
      <div class="totalPrice">
        R${itemPrice}
      </div>
      <div class="quantity">
        <span class="minus">-</span>
        <span>${cart.quantity}</span>
        <span class="plus">+</span>
      </div>
        `;
        listCartHtml.appendChild(newCart);
      })
    }
    iconCartSpan.innerText = totalQuantity;

    // Calculate subtotal, VAT, and total
    const subtotal = totalPrice;
    const vat = subtotal * 0.15; // 15% VAT
    const total = subtotal + vat;

    cartTotalPrice.innerHTML = `
      <div  style=" float:right;">
        <div style="  font-size:0.8; padding-left:1.5em">Subtotal: R${subtotal}</div>
        <div style=" font-size: 0.8em; padding-left:2.8em;">VAT (15%): R${vat}</div>
        <div style="  font-size: 1.5em;padding-right:5px">Total: R${total}</div>
      </div>
    `;
  }
  listCartHtml.addEventListener('click', (event) =>{
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus') ){
      let product_id = positionClick.parentElement.parentElement.dataset.id;
      let type = ' minus';
      if(positionClick.classList.contains('plus')){
        type = 'plus';
      }
      changeQuantity(product_id, type);
    }
  })
  const changeQuantity = ( product_id, type) => {
    let positionItemCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemCart >= 0) {
        switch (type) {
          case 'plus':
              carts[positionItemCart].quantity = carts[positionItemCart].quantity + 1;
            break;
        
          default:
            let valueChange = carts[positionItemCart].quantity - 1;
            if(valueChange  > 0){
                carts[positionItemCart].quantity = valueChange;
            }else{
              carts.splice(positionItemCart, 1);
            }
            break;
        }
    }
    addCartToMemory();
    addCartToHTML();
  }

  
  const initApp = () => {
    // get data from json
    fetch('products.json')
    .then(Response => Response.json())
    .then(data => {
      listProducts = data;
      
      addDataToHTML();
      // get cart from memory
      if(localStorage.getItem('cart')){
        carts = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
      }
    })  
 }

initApp();
