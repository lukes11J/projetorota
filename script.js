// Inicializa o mapa centrado em Tornada
const map = L.map('map').setView([39.447222, -9.127253], 16);

// Camada base do mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Lista de pontos de interesse
const pontos = [
  {
    nome: 'Centro Ecológico Educativo do Paul de Tornada - PATO',
    descricao: 'Centro Ecológico.',
    coords: [39.44777426223151, -9.132547104927434]
  },
  {
    nome: 'Igreja de Tornada',
    descricao: 'Ponto histórico da vila.',
    coords: [39.44806298737973, -9.129795218722242]
  },
  {
    nome: 'Arte',
    descricao: 'Arte feita por um aluno da bordalo.',
    coords: [39.4473229050901, -9.127300096512656]
  },
   {
    nome: 'Fonte de tornada',
    descricao: 'Fonte com arte classica.',
    coords: [39.44752146528951, -9.127934898654326]
  }
];

let rotaAtual = null;

// Adiciona marcadores ao mapa
pontos.forEach(ponto => {
  const marker = L.marker(ponto.coords).addTo(map);
  marker.bindPopup(`
    <b>${ponto.nome}</b><br>${ponto.descricao}<br>
    <button onclick='rastrearRota([${ponto.coords}])'>Ver rota</button>
  `);
});

// Função para calcular rota
function rastrearRota(destino) {
  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada pelo navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const origem = [pos.coords.latitude, pos.coords.longitude];

    // Remove rota anterior
    if (rotaAtual) {
      map.removeControl(rotaAtual);
    }

    // Cria nova rota
    rotaAtual = L.Routing.control({
      waypoints: [
        L.latLng(origem),
        L.latLng(destino)
      ],
      lineOptions: {
        styles: [{ color: 'blue', weight: 5 }]
      },
      router: L.Routing.osrmv1({
        language: 'pt',
        profile: 'foot' // ou 'car', 'bike'
      }),
      createMarker: function (i, wp) {
        return L.marker(wp.latLng).bindPopup(i === 0 ? "Você está aqui" : "Destino").openPopup();
      },
      routeWhileDragging: false,
      show: false
    }).addTo(map);
  }, error => {
    alert("Erro ao obter sua localização: " + error.message);
  });
}
