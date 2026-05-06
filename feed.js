
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
    const db = firebase.database();
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

    // Função pra renderizar cada post
    function renderPost(post) {
      const safeMessage = (post.message || "").replace(/\n/g, '<br>');
      const imgHtml = post.imgUrl? `<img src="${post.imgUrl}" class="image" alt="imagem do post">` : '';

      return `
        <div class="card" data-key="${post.key}">
          <h3>${post.AP || ''}</h3>
          <div class="post-header">
            <img src="${post.imgUrl || 'https://via.placeholder.com/48'}" class="avatar">
            <div>
              <div class="username" style="color:${post.color || '#1877f2'}">${post.username || 'Anônimo'}</div>
              <div class="time">${new Date(post.timestamp || Date.now()).toLocaleString('pt-BR')}</div>
            </div>
          </div>
          ${imgHtml}
          <h4>${post.nomeAP || ''}</h4>
          <details>
            <p><b>Descrição:</b> ${safeMessage}</p>
            <br><b>Liga: <label>${post.numero || ''}</label></b>
            <br><hr>
            <b>Data que foi publicado: <label>${new Date(post.timestamp).toLocaleDateString('pt-BR')}</label></b>
            <br><button onclick="deletePost('${post.key}')">Eliminar Post</button>
          </details>
        </div>
      `;
    }

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

// Função pra eliminar 1 post só
async function deletePost(key) {
  const confirma = confirm("Eliminar este post?");
  if (!confirma) return;
  try {
    await db.ref('posts/' + key).remove();
  } catch (err) {
    console.error(err);
    alert("Erro ao eliminar");
  }
}
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
      const btn = document.getElementById('btnPost');
      const username = document.getElementById('username').value.trim() || "Anônimo";
       const numero = document.getElementById('numero').value.trim();
       const AP = document.getElementById('AP').value.trim();
       const nomeAP = document.getElementById('nomeAP').value.trim();
       
 
      const message = document.getElementById('message').value.trim();
      const color = document.getElementById('color').value;

      if (!message) {
        alert("Escreva uma mensagem antes de publicar!");
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
        imgUrl: imgUrl,
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
