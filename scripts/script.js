const historial = [];

const mensajesDeError = {
  campoVacio: 'Complete los campos con valores válidos',
  valorInvalido: 'Ingrese un valor válido',
};

const calcularIMC = (altura, peso) => parseFloat((peso / (altura * altura)).toFixed(2));

const clasificarIMC = (imc) =>
  imc < 18.5 ? 'Bajo de peso' :
  imc < 25 ? 'Peso normal' :
  imc < 30 ? 'Sobrepeso' :
  imc < 35 ? 'Obesidad grado I' :
  imc < 40 ? 'Obesidad grado II' :
  'Obesidad grado III';

const agregarCalculoAlHistorial = (altura, peso, imc, clasificacion) => {
  const fecha = new Date().toLocaleString();
  const calculo = { fecha, altura, peso, imc, clasificacion };
  historial.push({ ...calculo });
};

const calcularEstadisticas = () => {
  const imcPromedio = historial.reduce((total, calculo) => total + calculo.imc, 0) / historial.length;
  const personasConSobrepeso = historial.filter(calculo => calculo.clasificacion === 'Sobrepeso').length;
  return {
    promedioIMC: imcPromedio.toFixed(2),
    sobrepeso: personasConSobrepeso,
  };
};

const mostrarMensaje = (mensaje) => {
  resultado.innerHTML = mensaje;
};

const mostrarResultado = (imc, clasificacion) => {
  resultado.innerHTML = `IMC: ${imc} (${clasificacion})`;
};

const cargarDatosDesdeJSON = () => {
  fetch('datos.json')
    .then((response) => response.json())
    .then((data) => {
      const datosGrafico = data.datosGrafico;
      mostrarGrafico(datosGrafico);

      const informacionAdicional = document.getElementById('informacion-adicional');
      informacionAdicional.innerHTML = `
        <p><strong>Interpretación del IMC:</strong> ${data.interpretacion}</p>
        <p><strong>Consejos de salud:</strong> ${data.consejos}</p>
      `;
    })
    .catch((error) => {
      console.error('Error al cargar datos desde el archivo JSON:', error);
    });
};

const mostrarGrafico = (datosGrafico) => {
  const ctx = document.getElementById('grafico').getContext('2d');

  const config = {
    type: 'bar',
    data: datosGrafico,
  };

  new Chart(ctx, config);
};

const calcularIMCYMostrarResultado = () => {
  const alturaValor = parseFloat(document.querySelector('#altura').value.replace(',', '.'));
  const pesoValor = parseFloat(document.querySelector('#peso').value.replace(',', '.'));

  if (!isNaN(alturaValor) && !isNaN(pesoValor) && alturaValor > 0 && pesoValor > 0) {
    const imc = calcularIMC(alturaValor, pesoValor);
    const clasificacion = clasificarIMC(imc);
    agregarCalculoAlHistorial(alturaValor, pesoValor, imc, clasificacion);
    mostrarResultado(imc, clasificacion);
  } else {
    mostrarMensaje(mensajesDeError.valorInvalido);
  }
};

document.querySelector('#mostrarGrafico').addEventListener('click', cargarDatosDesdeJSON);
