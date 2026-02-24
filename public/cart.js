// cart.js — render cart, handle checkout with auth
const CART_KEY = 'giffies_cart_v1';

function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[] }catch(e){return []} }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){ const count = getCart().reduce((s,i)=>s+(i.qty||1),0); document.querySelectorAll('#cart-count').forEach(el=>el.textContent = count); }

function renderCart(){
  const list = document.getElementById('cart-items'); if(!list) return;
  const cart = getCart(); list.innerHTML=''; if(cart.length===0){ list.innerHTML='<p>Your cart is empty.</p>'; document.getElementById('cart-total').textContent='0.00'; return; }
  cart.forEach(item=>{
    const row = document.createElement('div'); row.className='cart-row';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="meta"><div><strong>${item.name}</strong></div><div>$${item.price.toFixed(2)} x ${item.qty}</div></div>
      <div style="display:flex;flex-direction:column;gap:8px;"><button class="btn remove" data-id="${item.id}">Remove</button></div>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('.remove').forEach(btn=>btn.addEventListener('click', ()=>{ const id=btn.dataset.id; let cart = getCart(); cart = cart.filter(i=>String(i.id)!==String(id)); saveCart(cart); renderCart(); }));
  const total = cart.reduce((s,i)=>s + (i.price*(i.qty||1)),0); document.getElementById('cart-total').textContent = total.toFixed(2);
}

async function handleCheckout(e){
  e.preventDefault();
  const token = window.GIFFIES_AUTH && window.GIFFIES_AUTH.getToken && window.GIFFIES_AUTH.getToken();
  if(!token){ window.location.href = '/login.html'; return; }
  const form = e.target; const data = Object.fromEntries(new FormData(form).entries());
  const items = getCart(); if(items.length===0){ alert('Cart is empty'); return; }
  const totalAmount = items.reduce((s,i)=>s + (i.price*(i.qty||1)),0);
  const payload = { ...data, items, totalAmount };
  try{
    const res = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify(payload) });
    const json = await res.json();
    if(!res.ok){ alert(json.error || 'Failed to place order'); return; }
    localStorage.removeItem(CART_KEY); updateCartCount(); alert('Order placed — thank you!'); window.location.href = '/';
  }catch(err){ console.error(err); alert('Network error'); }
}

document.addEventListener('DOMContentLoaded', ()=>{ updateCartCount(); renderCart(); const form = document.getElementById('checkout-form'); if(form) form.addEventListener('submit', handleCheckout); });
