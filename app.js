const button = document.querySelector("button");
const canvas = document.getElementById('canvas');
const audioElement = document.querySelector('audio');
const sizeX = canvas.width;
const sizeY = canvas.height;
var analyser;
var bufferLength;
var dataArray;

button.addEventListener("click", function(){
  //Criando meu contexto de audio
  const audioContext = new AudioContext();
  var audio = new Audio('./song/faded.mp3');
  var audioSrc = audioContext.createMediaElementSource(audio);

  //Criando meu analisador
  analyser = audioContext.createAnalyser();

  //Conectando o meu audio no analisador e o meu analyser na saída de som
  audioSrc.connect(analyser);
  analyser.connect(audioContext.destination);

  //Tamanho do analisador. Usando potência de 2 pra não desperdiçar espaço na memória
  //analyser.fftSize = 2048;
  analyser.fftSize = 32;

  //Buffer da memória que é igual a metade do meu analyser (1024)
  bufferLength = analyser.frequencyBinCount;

  //U = inteiro positivo unassigned
  //8 tamanho da memória pra cada int (8bits)
  //Vai de 0 a 255 ao invés de -128 a 127
  dataArray = new Uint8Array(bufferLength);

  //Dando play na musica
  audio.play();

  //canvas
  var lineRgb = "rgb(255, 255, 255)";
  var black = "rgb(0, 0, 0)";
  var white = "rgb(255, 255, 255)";
  var colors = ["rgb(66, 0, 0)", "rgb(99, 0, 0)", "rgb(0,66,0)", "rgb(0, 99, 0)", "rgb(0, 0, 66)", "rgb(0, 0, 99)", "rgb(33, 0, 66)", "rgb(4c, 0, 99)", "rgb(66, 0, 33)", "rgb(99, 0, 4c)", "rgb(66, 33, 0)", "rgb(99, 4c, 0)", "rgb(66, 66, 0)", "rgb(99, 99, 0)", "rgb(0, 66, 66)", "rgb(0, 99, 99)"];

  var draw = function () {
    //Copiando meu analyser para dentro de um array
    //analyser.getByteTimeDomainData(dataArray);
    analyser.getByteFrequencyData(dataArray);

    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');

      //Ressetando o frame
      ctx.fillStyle = black;
      ctx.fillRect(0, 0, sizeX, sizeY);

      //Linha
      ctx.strokeStyle = lineRgb;
      ctx.lineWidth = 2;

      //Cada passada do for será uma barrinha diferente
      for(var i = 0; i < bufferLength; i++) {
        ctx.fillRect(0, (i*15), dataArray[i], 10);
        ctx.fillStyle = colors[i];
      }

      //Chamando o próximo frame
      window.requestAnimationFrame(draw);
    }
  }
  window.requestAnimationFrame(draw);
});
