// script.js — handles product rendering, cart (localStorage), and checkout

// Utilities for cart storage
const CART_KEY = 'giffies_cart_v1';

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }

function updateCartCount(){
  const count = getCart().reduce((s,i)=>s + (i.qty||1), 0);
  document.querySelectorAll('#cart-count').forEach(el=>el.textContent = count);
}

// Fetch products and render on index page
async function loadProducts(){
  const container = document.getElementById('products');
  if(!container) return;
  try{
    const res = await fetch('/api/products');
    const products = await res.json();
    container.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>${p.description}</p>
        <div class="price">$${p.price.toFixed(2)}</div>
        <button class="btn" data-id="${p.id}">Add to Cart</button>
      `;
      container.appendChild(card);
    });

    // Add event listeners
    container.querySelectorAll('button[data-id]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = Number(btn.dataset.id);
        const prod = products.find(x=>x.id===id);
        if(!prod) return;
        const cart = getCart();
        const existing = cart.find(i=>i.id===id);
        if(existing) existing.qty = (existing.qty||1)+1; else cart.push({...prod, qty:1});
        saveCart(cart);
        alert('Added to cart');
      });
    });

  }catch(e){ console.error('Failed loading products', e); }
}

// Cart page rendering
function renderCartPage(){
  const list = document.getElementById('cart-items');
  if(!list) return;
  const cart = getCart();
  list.innerHTML = '';
  if(cart.length===0){ list.innerHTML = '<p>Your cart is empty.</p>'; document.getElementById('cart-total').textContent='0.00'; return; }
  cart.forEach(item=>{
    const row = document.createElement('div'); row.className='cart-row';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="meta">
        <div><strong>${item.name}</strong></div>
        <div>$${item.price.toFixed(2)} x ${item.qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <button class="btn remove" data-id="${item.id}">Remove</button>
      </div>
    `;
    list.appendChild(row);
  });

  // Remove handlers
  list.querySelectorAll('.remove').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id);
      let cart = getCart();
      cart = cart.filter(i=>i.id!==id);
      saveCart(cart);
      renderCartPage();
    });
  });

  const total = cart.reduce((s,i)=>s + (i.price*(i.qty||1)),0);
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Checkout submission
async function handleCheckout(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const items = getCart();
  if(items.length===0){ alert('Cart is empty'); return; }
  const totalAmount = items.reduce((s,i)=>s + (i.price*(i.qty||1)),0);
  const payload = { ...data, items, totalAmount };
  try{
    const res = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if(res.ok){
      localStorage.removeItem(CART_KEY);
      updateCartCount();
      alert('Order placed — thank you!');
      window.location.href = '/';
    }else{
      alert('Failed to place order');
    }
  }catch(err){ console.error(err); alert('Network error'); }
}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  loadProducts();
  renderCartPage();
  const form = document.getElementById('checkout-form');
  if(form) form.addEventListener('submit', handleCheckout);
});
