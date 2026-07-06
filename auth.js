const firebaseConfig = {
  apiKey: "AIzaSyDNNrCilNbCPArMSNz0Jgv-yXH8Oyt_ii0",
  authDomain: "coder-85d8f.firebaseapp.com",
  databaseURL: "https://coder-85d8f-default-rtdb.firebaseio.com",
  projectId: "coder-85d8f",
  storageBucket: "coder-85d8f.firebasestorage.app",
  messagingSenderId: "1085157812900",
  appId: "1:1085157812900:web:751bee1bae37f05f6ed431",
  measurementId: "G-1DQ7XFJ6ZP"
};
/*

 const firebaseConfig = {
    apiKey: "AIzaSyDhURTGDUqOuuvbClVqMRiEcYYvfDt_FPU",
    authDomain: "code-fb13e.firebaseapp.com",
    projectId: "code-fb13e",
    storageBucket: "code-fb13e.appspot.com",
    messagingSenderId: "749917957333",
    appId: "1:749917957333:web:6fc820b2bebb8e8234465c"
  };*/

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
const auth = firebase.auth(); // <- FALTAVA ISSO

// variaveis
const formLogin = document.getElementById("auth");
const nomeInput = document.getElementById("nome");
//const proficaoInput = document.getElementById("proficao");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const infoLogin = document.getElementById("infoLogin");

const btnLogin = document.getElementById("btnLogin");
const btnCadastro = document.getElementById("btnCadastro");

//funçao de logim
btnLogin.addEventListener('click', (e) =>{
  e.preventDefault();
  const email = emailInput.value;
  const senha = senhaInput.value;
  firebase.auth().signInWithEmailAndPassword(email, senha)
  .then((user) => {
    infoLogin.innerText = "Login feito com sucesso!";
    console.log('login feito com sucesso');
    document.querySelector('.login').style.display = "none";
    document.querySelector('.home').style.display = "block";
  }).catch((error) => {
     infoLogin.innerText = "Erro ao entrar na conta!";

    console.error('Erro com sucesso', error);
  });
});

btnCadastro.addEventListener('click', (e) =>{
  e.preventDefault();
  const email = emailInput.value;
  const senha = senhaInput.value;
  const nome = nomeInput.value;
  // const prof = proficaoInput.value;
     firebase.auth().createUserWithEmailAndPassword(email, senha)
  .then((user) => {
    console.log('login feito com sucesso');
   alert('Bem vindo!');
    document.querySelector('.login').style.display = "none";
    document.querySelector('.home').style.display = "block";
    // salva o nome do usuario
    firebase.database().ref('usuarios/' + user.user.uid).set({
      nome: nome,
      // prof: prof,
      email: email
    });
  })
  .catch((error) =>{
     infoLogin.innerText = "Erro ao cadastrar!";

    console.error('erro com sucesso:', error);
  });
});

// Verificar se existe uma contA
firebase.auth().onAuthStateChanged((user) =>{
  if (user) {
     monitorarUsuarios();
    // ... teu código que pega o nome ...

    // MOSTRAR DESDE QUANDO É CADASTRADO
    const dataCriacao = new Date(user.metadata.creationTime);
    
    // Formatar data pra PT: 09/05/2026
    const dataFormatada = dataCriacao.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
    
    document.getElementById('dataCadastro').textContent = dataFormatada;

    // Versão com "há X dias" 
    const diasCadastrado = Math.floor((new Date() - dataCriacao) / (1000 * 60 * 60 * 24));
    document.getElementById('dataCadastro').textContent = `${dataFormatada} - há ${diasCadastrado} dias`;
    
  
       // usuario logado
    //console.log('Usuário logado:', user);
   //  location.href = "./index.html";
   document.querySelector('.login').style.display = "none";
    document.querySelector('.home').style.display = "block";
     document.getElementById('addBtn').style.display = "block";
    // Pega o nome do usuário
     
    firebase.database().ref('usuarios/' + user.uid).once('value')
      .then((snapshot) => {
        const dadosUsuario = snapshot.val()
         const nomeUsuario = dadosUsuario.nome;
        // const proficao = dadosUsuario.prof;
      //   const numero = dadosUsuario.numero;
        //
      //const imagem = dadosUsuario.imagem;
    const emailUser = dadosUsuario.email;
        // const localizacao = dadosUsuario.locali;
//document.getElementById('imagemP').innerHTML = `<img src='${imagem}.jpg'/>`;
 
       //  document.getElementById('imagemPerfil').innerHTML = `<img src='${imagem}.jpg'/>`;
     //document.getElementById('imagemUser').innerHTML = `<img src='${imagem}.jpg'/>`;
     document.getElementById('endereco').innerText = `${emailUser}!`;
  //  console.log('nome', nomeUsuario);
        document.getElementById('username').value = `${nomeUsuario}`;
         document.getElementById('Usernome').innerText = `${nomeUsuario}`;

       /*  // proficao
        document.getElementById('details').innerHTML = `
           <b>Localização: ${dadosUsuario.locali}</b>
          <b>Número: ${dadosUsuario.numero}</b>
          <b>Eu sou: ${dadosUsuario.prof}</b>
          <b>idade: 20 anos</b>
         `;
         //document.getElementById('numeroUser').innerText = `${numero}`;
         //document.getElementById('localUser').innerText = `${localizacao}`;
         
     //   const dados = snapshot.val();
        //document.getElementById('nome-usuario').innerText = dados.nome + '!';
     
          // ← nova função
    // ... outras funções*/
     
      })
      .catch((error) => {
        console.error('Erro ao pegar nome do usuário:', error);
      });
      // ──────────────── NOVO ────────────────
    // Mostrar lista de usuários
   // carregarListaUsuarios(user.uid);
 
  } else{
    // usuario nao logado
    console.log('usuario nao logado');
  document.querySelector('.login').style.display = "flex";
     document.getElementById('addBtn').style.display = "none";

     document.querySelector('.home').style.display = "none";
  }

});

// sair da conta
function sairConta(){
  firebase.auth().signOut().then(() =>{
    //direcionar para login
   document.querySelector('.login').style.display = "block";
    document.querySelector('.home').style.display = "none";
  }).catch((error) =>{
    Alert('erro ao sair da conta');
  });
}

// Atualiza contador em tempo real
function monitorarUsuarios() {
  const qtdElemento = document.getElementById('qtdUsuarios');
  
  firebase.database().ref('usuarios').on('value', (snapshot) => {
    const total = snapshot.numChildren();
    qtdElemento.textContent = total;
  });
}

