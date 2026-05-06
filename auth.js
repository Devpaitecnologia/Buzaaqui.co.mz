


 const firebaseConfig = {
    apiKey: "AIzaSyDhURTGDUqOuuvbClVqMRiEcYYvfDt_FPU",
    authDomain: "code-fb13e.firebaseapp.com",
    projectId: "code-fb13e",
    storageBucket: "code-fb13e.appspot.com",
    messagingSenderId: "749917957333",
    appId: "1:749917957333:web:6fc820b2bebb8e8234465c"
  };

  firebase.initializeApp(firebaseConfig);
  
// variaveis
const formLogin = document.getElementById("auth");
const nomeInput = document.getElementById("nome");
//const proficaoInput = document.getElementById("proficao");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");

const btnLogin = document.getElementById("btnLogin");
const btnCadastro = document.getElementById("btnCadastro");

//funçao de logim
btnLogin.addEventListener('click', (e) =>{
  e.preventDefault();
  const email = emailInput.value;
  const senha = senhaInput.value;
  firebase.auth().signInWithEmailAndPassword(email, senha)
  .then((user) => {
    alert('dldldldldldl');
    console.log('login feito com sucesso');
    document.querySelector('.login').style.display = "none";
    document.querySelector('.home').style.display = "block";
  }).catch((error) => {
    console.error('erro com sucesso', error);
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
    console.error('erro com sucesso:', error);
  });
});

// Verificar se existe uma contA
firebase.auth().onAuthStateChanged((user) =>{
  if (user) {
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
  //       const emailUser = dadosUsuario.email;
        // const localizacao = dadosUsuario.locali;
//document.getElementById('imagemP').innerHTML = `<img src='${imagem}.jpg'/>`;
 
       //  document.getElementById('imagemPerfil').innerHTML = `<img src='${imagem}.jpg'/>`;
     //document.getElementById('imagemUser').innerHTML = `<img src='${imagem}.jpg'/>`;
     //document.getElementById('endereco').innerText = `${emailUser}!`;
  //  console.log('nome', nomeUsuario);
        document.getElementById('username').value = `${nomeUsuario}`;
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
  document.querySelector('.login').style.display = "block";
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

