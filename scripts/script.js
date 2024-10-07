let historial = JSON.parse(localStorage.getItem('historialIMC')) || [];

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
      localStorage.setItem('historialIMC', JSON.stringify(historial));
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
          // Modificar los datos con los almacenados en localStorage
          actualizarDatosConHistorial(datosGrafico);
          mostrarGrafico(datosGrafico);

          const informacionAdicional = document.getElementById('informacion-adicional');
          informacionAdicional.innerHTML = `
            <p><strong>Interpretación del IMC:</strong> ${data.interpretacion}</p>
            <p><strong>Consejos de salud:</strong> ${data.consejos}</p>`;
        })
        .catch((error) => {
          console.error('Error al cargar datos desde el archivo JSON:', error);
        });
    };

    const actualizarDatosConHistorial = (datosGrafico) => {
      const categorias = ["Bajo de peso", "Peso normal", "Sobrepeso", "Obesidad grado I", "Obesidad grado II", "Obesidad grado III"];
      const datosLocales = [0, 0, 0, 0, 0, 0];

      // Recorremos el historial del LocalStorage y sumamos las clasificaciones al array correspondiente
      historial.forEach(calculo => {
        const indice = categorias.indexOf(calculo.clasificacion);
        if (indice !== -1) {
          datosLocales[indice]++;
        }
      });

      // Sumar los datos del historial a los datos del JSON
      datosGrafico.datasets[0].data = datosGrafico.datasets[0].data.map((valor, index) => valor + datosLocales[index]);
    };

    const mostrarGrafico = (datosGrafico) => {
      const ctx = document.getElementById('grafico').getContext('2d');

      const config = {
        type: 'bar',
        data: datosGrafico,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
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

    document.querySelector('#calcularIMC').addEventListener('click', calcularIMCYMostrarResultado);
    document.querySelector('#mostrarGrafico').addEventListener('click', cargarDatosDesdeJSON);