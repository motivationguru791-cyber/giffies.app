// products.js — fetch and render products
const CART_KEY = 'giffies_cart_v1';

function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[] }catch(e){return []} }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){ const count = getCart().reduce((s,i)=>s+(i.qty||1),0); document.querySelectorAll('#cart-count').forEach(el=>el.textContent = count); }

async function loadProducts(){
  const container = document.getElementById('products'); if(!container) return;
  try{
    const res = await fetch('/api/products');
    const products = await res.json();
    container.innerHTML = '';
    products.forEach(p=>{
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
    container.querySelectorAll('button[data-id]').forEach(btn=>btn.addEventListener('click', ()=>{
      const id = btn.dataset.id; const prod = products.find(x=>String(x.id)===String(id)); if(!prod) return;
      const cart = getCart(); const existing = cart.find(i=>String(i.id)===String(id)); if(existing) existing.qty=(existing.qty||1)+1; else cart.push({...prod, qty:1}); saveCart(cart); alert('Added to cart');
    }));
  }catch(err){ console.error('Load products failed', err); }
}

document.addEventListener('DOMContentLoaded', ()=>{ updateCartCount(); loadProducts(); });

// export nothing; functions used internally
