document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('city').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchData();
        }
    });
    document.getElementById('fetch-button').addEventListener('click', fetchData);
});

const apiKey = '340048908febd3e7b47ffea69b5b09f7';

async function fetchData() {
    const city = document.getElementById('city').value;
    if (city) {
        try {
            await fetchWeatherData(city);
            await fetchUVIndexData(city);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            displayError('main', 'Erro ao buscar dados. Por favor, tente novamente mais tarde.');
        }
    } else {
        alert('Por favor, digite o nome de uma cidade.');
    }
}

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Resposta de rede não foi ok');
        }
        const data = await response.json();
        document.getElementById('weather').innerHTML = `
            <h2>Clima</h2>
            <p>Temperatura: ${data.main.temp} &#8451;</p>
            <p>Umidade: ${data.main.humidity} %</p>
            <p>Velocidade do Vento: ${data.wind.speed} m/s</p>
        `;
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        displayError('weather', 'Erro ao buscar dados do clima. Por favor, tente novamente mais tarde.');
    }
}

async function fetchUVIndexData(city) {
    try {
        const geocodeResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`);
        if (!geocodeResponse.ok) {
            throw new Error('Erro ao buscar coordenadas');
        }
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.length === 0) {
            throw new Error('Cidade não encontrada');
        }

        const { lat, lon } = geocodeData[0];
        const response = await fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('Resposta de rede não foi ok');
        }
        const data = await response.json();
        document.getElementById('uv-index').innerHTML = `
            <h2>Índice UV</h2>
            <p>Índice UV: ${data.value}</p>
        `;
    } catch (error) {
        console.error('Erro ao buscar dados de índice UV:', error);
        displayError('uv-index', 'Erro ao buscar dados de índice UV. Por favor, tente novamente mais tarde.');
    }
}

function displayError(sectionId, message) {
    document.getElementById(sectionId).innerHTML = `
        <h2>Erro</h2>
        <p>${message}</p>
    `;
}
