let palavras = [
  { dica: 'Documento obrigatório para viagens internacionais', palavra: 'passaporte' },
  { dica: 'Grupo de pessoas definidas pela frase: "faça o que eu digo, mas não faça o que eu faço"', palavra: 'hipocritas' },
  { dica: 'Antônimo de "tristeza"', palavra: 'felicidade' },
  { dica: 'Etapa obrigatória para pacientes com suspeita de COVID-19', palavra: 'quarentena' },
  { dica: 'Feito em laboratório, não natural', palavra: 'artificial' },
  { dica: 'Oposto político de "Ditadura"', palavra: 'democracia'},
  { dica: 'Pessoa com grande poder de convencer os outros', palavra: 'persuasivo'},
  { dica: 'Organização fundada sobre ordem de prioridade, estabelece relação entre superior e subordinado', palavra: 'hierarquia'},
  { dica: 'Ato de antecipar eventos sem quaisquer evidências do mesmo', palavra: 'profetizar'},
  { dica: 'Odiada por todos, muito papel', palavra: 'burocracia'},
]

const max_tentativas = 7
let palavraSelecionada = -1
let jogos = 0
let letrasTestadas = []
let tentativas = max_tentativas
let letrasAcertadas = 0
let palpitesErrados = 0
let boneco = document.getElementById('homem-forca')
let tentativasRestantesTexto = document.getElementById('tentativas-restantes-texto')
let respostaUsuarioInput = document.getElementById('input-resposta')
let letrasTestadasContainer = document.getElementsByClassName('letras-testadas')[0]
respostaUsuarioInput.onkeydown = function(event) {
  if(event.keyCode == 13) { // Ao apertar enter
    verificarResposta()
  }
}

// todas as telas do jogo para serem manipuladas
let gameScreen = document.getElementById('gamescreen')
let gameoverScreen = document.getElementById('gameover')
let agradecimentosScreen = document.getElementById('agradecimentos')
let gameoverDescricao = document.getElementById('gameover-descricao')

// escuta o evento de click do botão verificar
let verificarBotao = document.getElementById('btn-verificar')
verificarBotao.onclick = function() {
  verificarResposta()
}


// gameover
let gameoverContinuarBotao = document.getElementById('continue-sim')
gameoverContinuarBotao.onclick = function() {
  startGame();
}

let gameoverDesistirBotao = document.getElementById('continue-nao')
gameoverDesistirBotao.onclick = function() {
  gameoverScreen.style.display = 'none'
  agradecimentosScreen.style.display = 'flex'
}

/**
 * verifica a respota do usuário
 */
function verificarResposta() {
  let respostaUsuario = respostaUsuarioInput.value.toUpperCase()
  let palavra = palavras[palavraSelecionada].palavra.toUpperCase()

  respostaUsuarioInput.value = ''
  respostaUsuarioInput.focus()

  // usuário digitou a palavra completa
  if(respostaUsuario == palavra) {
    ganhouJogo()
    return
  } else if(respostaUsuario.length > 1) { // caso o usuário digite uma palavra mas esta esteja errada
    tentativas = 0
    palpitesErrados++
    boneco.src = `./images/hangman7.png`
    fimDeJogo()
    return
  }

  // a letra digitada pelo o usuário ainda não foi testada
  if(letrasTestadas.indexOf(respostaUsuario) == -1) {

    // vai adicionando as letras já testadas na tela
    let letrasSpan = document.createElement('span')
    letrasSpan.innerHTML = `${respostaUsuario}&nbsp;`
    letrasTestadasContainer.appendChild(letrasSpan)

    // Se a letra digitada pelo o usuário não existir na palavra, tirar uma tentativa dele
    if(palavra.indexOf(respostaUsuario) == -1) {
      tentativas--
      palpitesErrados++

      tentativasRestantesTexto.innerHTML = tentativas

      // Gameover - acabaram as tentativas
      if(tentativas == 0) {
        fimDeJogo()
      } else if(tentativas == 1) { // Com uma tentiva restante, mostra a dica para o usuário
        document.getElementById('dica').innerHTML = `<b>Dica:</b>&nbsp;${palavras[palavraSelecionada].dica}`
      }

      boneco.src = `./images/hangman${max_tentativas - tentativas}.png`
    } else { // Letra existe na palavra
      for(let i = 0; i < palavra.length; i++) {
        if(palavra[i] == respostaUsuario) {
          let letraContainer = document.querySelector(`#letra-${i} span`)
          letraContainer.innerHTML = palavra[i]

          letrasAcertadas++
        }
      }

      // usuário ganhou
      if(letrasAcertadas == palavra.length) {
        ganhouJogo()
      }
    }

    letrasTestadas.push(respostaUsuario)
  } else {
    alert('A letra digitada já foi informada')
  }
}

/**
 * Função que vai iniciar uma nova rodada no jogo
 * ela é responsável por escolher uma palavra e criar os elementos
 * na tela para serem mostrados ao usuário
 */
function startGame() {
  // reseta as variáveis
  tentativas = max_tentativas
  letrasAcertadas = 0
  palpitesErrados = 0
  letrasAcertadas = []
  letrasTestadas = []


  // reseta os elementos na tela
  gameoverScreen.style.display = 'none'
  gameScreen.style.display = 'flex'
  document.getElementById('dica').innerHTML = ''
  gameoverDescricao.innerHTML = ''
  boneco.src = './images/hangman0.png'

  tentativasRestantesTexto.innerHTML = tentativas
  letrasTestadasContainer.innerHTML = '<b>Letras testadas: </b>'

  respostaUsuarioInput.disabled = false
  verificarBotao.disabled = false

  // randomiza uma palavra para o novo jogo
  palavraSelecionada = Math.floor(Math.random() * palavras.length)


  // Adiciona as caixas das letras das palavras na tela
  let containerLetras = document.getElementsByClassName('letras-palavra')[0]
  containerLetras.innerHTML = ''
  for(let i = 0; i < palavras[palavraSelecionada].palavra.length; i++) {
    let element = document.createElement('div')
    element.classList.add('caixa-letras-palavra')
    element.id = `letra-${i}`

    // Cria um elemento de texto que será a letra da palavra
    let text = document.createElement('span')
    text.classList.add('letra-palavra')
    element.appendChild(text)

    // Adiciona o elemento da letra na tela
    containerLetras.appendChild(element)
  }

  jogos++
}

/**
 * função que mostra ao usuário a tela de que ganhou o jogo
 * mostrando estatisticas e informações sobre o seu jogo
 */
function ganhouJogo() {
  gameScreen.style.display = 'none'
  gameoverScreen.style.display = 'flex'

  let boldText = document.createElement('b')
  boldText.innerHTML = 'Parabéns, você ganhou!!'
  gameoverDescricao.appendChild(boldText)

  let estatisticas = document.createElement('span')
  estatisticas.innerHTML = `<br><br>Palpites errados: ${palpitesErrados}<br>A palavra descoberta foi: ${palavras[palavraSelecionada].palavra}<br>${jogos > 1 ? `Você jogou ${jogos} vezes` : `Você jogou ${jogos} vez`}`
  gameoverDescricao.appendChild(estatisticas)
}

/**
 * função que mostra ao usuário a tela de que perdeu o jogo
 * mostrando estatisticas e informações sobre o seu jogo
 */
function fimDeJogo() {
  respostaUsuarioInput.disabled = true
  verificarBotao.disabled = true

  setTimeout(() => {
    gameScreen.style.display = 'none'
    gameoverScreen.style.display = 'flex'

    let boldText = document.createElement('b')
    boldText.innerHTML = 'Você perdeu :( tente novamente!'
    gameoverDescricao.appendChild(boldText)

    let estatisticas = document.createElement('span')
    estatisticas.innerHTML = `<br><br>Palpites errados: ${palpitesErrados}<br>A palavra a ser descoberta era: ${palavras[palavraSelecionada].palavra}<br>${jogos > 1 ? `Você jogou ${jogos} vezes` : `Você jogou ${jogos} vez`}`
    gameoverDescricao.appendChild(estatisticas)
  }, 2000)

}

startGame()