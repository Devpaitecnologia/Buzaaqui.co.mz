
 /*const firebaseConfig = {
    apiKey: "AIzaSyDhURTGDUqOuuvbClVqMRiEcYYvfDt_FPU",
    authDomain: "code-fb13e.firebaseapp.com",
    projectId: "code-fb13e",
    storageBucket: "code-fb13e.appspot.com",
    messagingSenderId: "749917957333",
    appId: "1:749917957333:web:6fc820b2bebb8e8234465c"
  };
*/
    //firebase.initializeApp(firebaseConfig);
    let postsDeletados = new Set();
    const postsRef = db.ref('posts');

    const IMGBB_API_KEY = "a1bbbb9126e10a524a7fba2192562444";

    let selectedFile = null;

    // Cor automática pela letra inicial
    function getColorByFirstLetter(name) {
      if (!name) return "#1877f2";
      const firstLetter = name.trim().toUpperCase().charAt(0);
      const code = firstLetter.charCodeAt(0);
      const hue = ((code - 65) * 18) % 360;
      return `hsl(${hue}, 85%, 55%)`;
    }
// text
function loadPosts() {
  const feed = document.getElementById('feed');

  postsRef.orderByChild('timestamp').on('value', (snapshot) => {
    feed.innerHTML = "";

    if (!snapshot.exists()) {
      feed.innerHTML = `<div class="empty">Nenhum post ainda. Seja o primeiro!</div>`;
      return;
    }
// Dentro da função loadPosts(), após o postsRef.on('value'...
postsRef.on('child_removed', (snapshot) => {
  const key = snapshot.key;
  postsDeletados.add(key); // guarda que essa key foi deletada
  const card = document.querySelector(`.card[data-key="${key}"]`);
  if (card) card.remove();
});
    const agora = new Date();
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
    const ontem = hoje - 86400000; // 24h em ms
    const semana = hoje - 86400000 * 7;
    const mes = new Date(agora.getFullYear(), agora.getMonth(), 1).getTime();

    const grupos = {
      hoje: [],
      ontem: [],
      semana: [],
      mes: [],
      antigo: []
    };

    // Separa os posts por data
    snapshot.forEach(child => {
      const post = child.val();
      const key = child.key;
      
      
  
  if(postsDeletados.has(key)) return; // PULA se foi deletado
  
  
      const ts = post.timestamp || 0;

      const postData = {...post, key };

      if (ts >= hoje) grupos.hoje.push(postData);
      else if (ts >= ontem) grupos.ontem.push(postData);
      else if (ts >= semana) grupos.semana.push(postData);
      else if (ts >= mes) grupos.mes.push(postData);
      else grupos.antigo.push(postData);
    });

    // Ordena do mais novo pro mais velho
    for (let grupo in grupos) {
      grupos[grupo].sort((a, b) => b.timestamp - a.timestamp);
    }
    /*
grupos[grupo].forEach(post => {
  feed.innerHTML += renderPost(post);

  // Escuta mudanças só nesse post
  db.ref('posts/' + post.key + '/totalVistos').on('value', snap => {
    const card = document.querySelector(`.card[data-key="${post.key}"] span`);
    if(card) card.childNodes[0].nodeValue = snap.val() || 0;
  });
});
   */
    // Função pra renderizar cada post
    function renderPost(post) {
      const safeMessage = (post.message || "").replace(/\n/g, '<br>');
      const imgHtml = post.imgUrl? `<img src="${post.imgUrl}" class="image" alt="imagem do post">` : '';
      
      const user = auth.currentUser;
  const podeDeletar = user && post.uid === user.uid;   // ← Só quem postou vê o botão
  const btnachado = user && post.uid === user.uid;   // ← Só quem postou vê o botão

    
    

      return `
        <div class="card" data-key="${post.key}">
          <h3>${post.AP || ''}</h3>
          <div class="post-header">
            <img src="${post.imgUrl || 'https://via.placeholder.com/48'}" class="avatar">
            <div>
              <div class="username" style="color:${post.color || '#1877f2'}">${post.username || 'Anônimo'}</div>
              <div class="time">${new Date(post.timestamp || Date.now()).toLocaleString('pt-BR')}</div>
            </div>
        <!-- BOTÃO "ACHEI" FUNCIONANDO -->
      ${btnachado ? `
        <button class="btn-achei" data-key="${post.key}" onclick="marcarComoEncontrado(this)">
          Achei
        </button>
      ` : ''}
      <svg fill="#757575" opacity="1.0" width="24" height="24" viewBox="0 0 24 24"><path d="M12.984 9V6.984h-1.969V9h1.969zm0 8.016v-6h-1.969v6h1.969zm-.984-15c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016z"/></svg>
      
                     </div>
      
          
            <h4>${post.nomeAP || ''}</h4>
       
          ${imgHtml}
   <details  onclick="ver('${post.key}')">
            <p><b>Descrição:</b> ${safeMessage}</p>
            <br><b>Liga: <label>${post.numero || ''}</label></b>
            <br><hr>
            <b>Data que foi publicado: <label>${new Date(post.timestamp).toLocaleDateString('pt-BR')}</label></b>
           <div class="ops">
      
          ${podeDeletar ? `  
            <button onclick="deletePost('${post.key}')">Eliminar Post</button>
         ` : ''}
          
           <span  id="visto-${post.key}">${post.totalVistos || 0}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </span>
            </div>
          </details>
        </div>
      `;
    }
    // Função do botão "Achei"
window.marcarComoEncontrado = function(btn) {
  db.ref('posts/' + btn.dataset.key).update({ encontrado: true });
  btn.innerText = "✅ Encontrado";
  btn.style.backgroundColor = "#4CAF50";
  btn.style.color = "white";
  btn.disabled = true;           // impede clicar várias vezes
};
    
    // Contador de Achados (6 linhas)
let totalAchados = 0;

postsRef.on('value', snap => {
  totalAchados = 0;
  snap.forEach(child => {
    if (child.val().encontrado) totalAchados++;
  });
  document.getElementById('contador-achados').innerText = `${totalAchados}`;
});
   // db.ref('posts/' + btn.dataset.key).update({ encontrado: true });
  // Exemplo para remover o none
/*document.querySelectorAll('button').forEach(btn => btn.style.display = 'block');// visto
    // Script JS mínimo com display none
postsRef.on('child', snap => {
  const key = snap.key, p = snap.val();
  document.getElementById('btndelet').innerHTML += `<button style="display:none" onclick="alert('Post ${key} - ${p.author||'Anônimo'}')"> ${p.author||'Ver Post'}</button>`;
});
*/
// 3. TIRA window.ver DE DENTRO E COLA AQUI FORA TAMBÉM
window.ver = function(key) {
  const user = auth.currentUser;
  if(!user) {
    alert('Faz login primeiro');
    return;
  }

  const vistoRef = db.ref('posts/' + key + '/vistoPor/' + user.uid);

  // Se já viu, não faz nada. Se não viu, salva e soma 1
  vistoRef.once('value').then(snap => {
    if(!snap.exists()) {
      // Marca que esse UID viu
      vistoRef.set({
        uid: user.uid,
        nome: user.displayName || 'Anônimo',
        hora: firebase.database.ServerValue.TIMESTAMP
      });

      // Soma 1 no contador
      db.ref('posts/' + key + '/totalVistos').transaction(count => (count || 0) + 1);
    }
  });
}

// 4. Listener pra atualizar o número na tela sem recarregar
postsRef.on('child_changed', (snap) => {
  const key = snap.key;
  const data = snap.val();
  const total = data.totalVistos || 0;
  const el = document.getElementById('visto-' + key);
  if(el) el.childNodes[0].nodeValue = total;
});

    
    // Renderiza cada grupo com título
    if (grupos.hoje.length) {
      feed.innerHTML += `<h2 class="data-separador">Hoje</h2>`;
      grupos.hoje.forEach(post => feed.innerHTML += renderPost(post));
    }
    if (grupos.ontem.length) {
      feed.innerHTML += `<h2 class="data-separador">Ontem</h2>`;
      grupos.ontem.forEach(post => feed.innerHTML += renderPost(post));
    }
    if (grupos.semana.length) {
      feed.innerHTML += `<h2 class="data-separador">Esta Semana</h2>`;
      grupos.semana.forEach(post => feed.innerHTML += renderPost(post));
    }
    if (grupos.mes.length) {
      feed.innerHTML += `<h2 class="data-separador">Este Mês</h2>`;
      grupos.mes.forEach(post => feed.innerHTML += renderPost(post));
    }
    if (grupos.antigo.length) {
      feed.innerHTML += `<h2 class="data-separador">Mais Antigos</h2>`;
      grupos.antigo.forEach(post => feed.innerHTML += renderPost(post));
    }
  });
}
// Função para eliminar post DEFINITIVAMENTE
// Eliminar Post + Remover da tela imediatamente
window.deletePost = async function(key) {
  const user = auth.currentUser;
  if (!user) return alert("Você precisa estar logado!");

  if (!key) return alert("ID inválido");

  const confirma = confirm("Eliminar este post permanentemente?");
  if (!confirma) return;

/*  const confirma2 = prompt("Digite 'ELIMINAR' para confirmar:");
  if (confirma2 !== "ELIMINAR") return alert("Cancelado.");
*/
  try {
    await db.ref('posts/' + key).remove();
    
    // === REMOVE A DIV DA TELA IMEDIATAMENTE ===
    const card = document.querySelector(`.card[data-key="${key}"]`);
    if (card) {
      card.remove(); 
     // card.style.display = "none";
      
      // Remove o elemento do DOM
      console.log(`Card ${key} removido da tela`);
    }

    alert("✅ Post eliminado com sucesso!");
    
  } catch (err) {
    console.error(err);
    alert("Erro ao eliminar: " + err.message);
  }
};

// Função pra eliminar 1 post só
/*window.deletePost = async function(key) {
  const confirma = confirm("Eliminar este post?");
  if (!confirma) return;
  try {
    await db.ref('posts/' + key).remove();
    alert("Post eliminado");
  } catch (err) {
    console.error(err);
    alert("Erro ao eliminar: " + err.message);
  }
}// Resto do código continua igual...
/*async function deletePost(key) {
  const confirma = confirm("Eliminar este post?");
  if (!confirma) return;
  try {
    await db.ref('posts/' + key).remove();
  } catch (err) {
    console.error(err);
    alert("Erro ao eliminar");
  }
}*/

    function updateColor() {
      const username = document.getElementById('username').value;
      document.getElementById('color').value = getColorByFirstLetter(username);
    }

    // Preview
    document.getElementById('imageInput').addEventListener('change', (e) => {
      selectedFile = e.target.files[0];
      const preview = document.getElementById('imagePreview');
      if (selectedFile) {
        preview.src = URL.createObjectURL(selectedFile);
        preview.style.display = 'block';
      }
    });

    // Upload ImgBB
    async function uploadToImgBB(file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        return data.data?.url || null;
      } catch (err) {
        console.error(err);
        return null;
      }
    }

    // Criar Post
    async function createPost() {
      
      const user = auth.currentUser;   // ← Pegar usuário logado

      const btn = document.getElementById('btnPost');
      const username = document.getElementById('username').value.trim() || "Anônimo";
       const numero = document.getElementById('numero').value.trim();
       const AP = document.getElementById('AP').value.trim();
       const nomeAP = document.getElementById('nomeAP').value.trim();
       
 if (!user) {
    alert("Você precisa estar logado para publicar!");
    return;
  }

      const message = document.getElementById('message').value.trim();
      const color = document.getElementById('color').value;

      if (!message || !numero || !nomeAP) {
        alert("Prencha os campos!");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Enviando...";

      let imgUrl = null;
      if (selectedFile) {
        imgUrl = await uploadToImgBB(selectedFile);
      }

      const post = {
        username: username,
        color: color,
         numero: numero,
         AP: AP,
         nomeAP: nomeAP,
        message: message,
           uid: user.uid,                    // ← ADICIONE ESTA LINH
        imgUrl: imgUrl,
         totalVistos: 0, // <- novo post já nasce com 0
    vistoPor: {}, // <- objeto vazio pra guardar quem viu
       timestamp: Date.now()
      };

      try {
        await postsRef.push(post);
        document.getElementById('message').value = '';
        document.getElementById('imageInput').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        selectedFile = null;
      } catch (err) {
        console.error(err);
        alert("Erro ao publicar o post");
      } finally {
        btn.disabled = false;
        btn.textContent = "Publicar";
      }
    }

    // ==================== CARREGAR POSTS (CORRIGIDO) ====================
    /*function loadPosts() {
      const feed = document.getElementById('feed');

      postsRef.orderByChild('timestamp').limitToLast(50).on('value', (snapshot) => {
        feed.innerHTML = "";

        let hasPosts = false;
        const postsArray = [];

        snapshot.forEach(child => {
          postsArray.push(child.val());
          hasPosts = true;
        });

        if (!hasPosts) {
          feed.innerHTML = `<div class="empty">Nenhum post ainda. Seja o primeiro!</div>`;
          return;
        }

        postsArray.reverse();

        postsArray.forEach(post => {
          const safeMessage = (post.message || "").replace(/\n/g, '<br>');
          const imgHtml = post.imgUrl ? `<img src="${post.imgUrl}" class="post-image" alt="imagem do post">` : '';

          const html = `
  
            <div class="card">
          <h3>${post.AP}</h3>
    
     <div class="post-header">
                <img src="${post.imgUrl || 'https://via.placeholder.com/48'}" class="avatar">
                <div>
                  <div class="username" style="color:${post.color || '#1877f2'}"> ${post.username || 'Anônimo'}</div>
                  <div class="time">${new Date(post.timestamp || Date.now()).toLocaleString('pt-BR')}</div>
                </div>
              </div>
              
               <!-- ${imgHtml}---->
            <img src="${post.imgUrl || 'https://via.placeholder.com/48'}" class="image">
              <h4>${post.nomeAP}</h4>
               <details>
           <p><b>Descrição:</b>${safeMessage}</p>   
           <br>  <b>Liga: <label>${post.numero}</label></b>
          <br>
          <hr>
          <b>Meu nome: <label>Fernando sul</label></b>
          <br><hr>
          <b>Data que foi publicado: <label>12/02/2026 </label></b>
        </details>
      </div>
 
      
          `;
          feed.innerHTML += html;
        });
      });
    }*/
// apagar tudo

async function deleteAllPosts() {
  const confirma = confirm("Tem certeza? Isso vai APAGAR TODOS OS POSTS pra sempre.");
  if (!confirma) return;

  try {
    await postsRef.remove(); // apaga tudo no nó 'posts'
    alert("Todos os posts foram eliminados.");
  } catch (err) {
    console.error(err);
    alert("Erro ao eliminar posts");
  }
}

// Iniciar
    window.onload = () => {
      updateColor();
      loadPosts();
    };
