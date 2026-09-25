// Datos de apoyo para el "Mapa de Calor" que se abre al tocar una tarjeta
// del Radar de Frescura. Cada entrada está indexada por el mismo id
// que usa `alertasFrescura` en RadarFrescura.jsx.

export const radarMapaCalor = {
  // 1. Mandioca
  1: {
    producto: 'Mandioca',
    puntos: [
      { coords: [-26.1775, -58.1781], name: 'Chacra La Formoseña', loc: 'Formosa Capital', intensidad: 0.9, score: 4.9 },
      { coords: [-25.7314, -59.1155], name: 'Huerta San Isidro', loc: 'Pirané', intensidad: 0.55, score: 4.5 },
      { coords: [-25.2131, -59.8583], name: 'Huertas del Centro', loc: 'Ibarreta', intensidad: 0.75, score: 4.7 },
      { coords: [-25.5667, -59.2333], name: 'Finca Palo Santo', loc: 'Palo Santo', intensidad: 0.4, score: 4.2 }
    ],
    destacado: {
      name: 'Chacra La Formoseña',
      loc: 'Formosa Capital — Dpto. Formosa',
      score: 4.9,
      img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=300&q=80',
      desc: 'Mandioca de raíz gruesa, cosechada en el día. Ideal para consumo directo, fritura o puré.'
    }
  },

  // 2. Cebolla de Verdeo
  2: {
    producto: 'Cebolla de Verdeo',
    puntos: [
      { coords: [-25.2847, -57.7241], name: 'Quinta Clorinda Verde', loc: 'Clorinda', intensidad: 0.85, score: 4.8 },
      { coords: [-25.1667, -59.6833], name: 'Huerta Fontana', loc: 'Comandante Fontana', intensidad: 0.5, score: 4.4 },
      { coords: [-26.3056, -59.3725], name: 'Consorcio Hortícola Sur', loc: 'El Colorado', intensidad: 0.7, score: 4.6 },
      { coords: [-25.9667, -58.2833], name: 'Chacra Tacaaglé', loc: 'Misión Tacaaglé', intensidad: 0.35, score: 4.1 }
    ],
    destacado: {
      name: 'Quinta Clorinda Verde',
      loc: 'Clorinda — Dpto. Pilcomayo, Formosa',
      score: 4.8,
      img: 'https://images.unsplash.com/photo-1592878849122-facb97520f9e?auto=format&fit=crop&w=300&q=80',
      desc: 'Cebolla de verdeo con riego controlado, cortada en manojos frescos todas las mañanas.'
    }
  },

  // 3. Huevos de Campo
  3: {
    producto: 'Huevos de Campo',
    puntos: [
      { coords: [-25.0333, -59.9667], name: 'Granja Villa Dos Trece', loc: 'Villa Dos Trece', intensidad: 0.9, score: 4.9 },
      { coords: [-24.7064, -60.5936], name: 'Coop. Monte Adentro', loc: 'Las Lomitas', intensidad: 0.5, score: 4.3 },
      { coords: [-25.65, -59.65], name: 'Granja Subteniente Perín', loc: 'Subteniente Perín', intensidad: 0.65, score: 4.6 },
      { coords: [-26.1775, -58.1781], name: 'Avícola Formosa Norte', loc: 'Formosa Capital', intensidad: 0.45, score: 4.2 }
    ],
    destacado: {
      name: 'Granja Villa Dos Trece',
      loc: 'Villa Dos Trece — Dpto. Bermejo, Formosa',
      score: 4.9,
      img: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?auto=format&fit=crop&w=300&q=80',
      desc: 'Huevos de gallinas camperas, recolección diaria y cadena de frío desde el galpón.'
    }
  },

  // 4. Tomates Cherry
  4: {
    producto: 'Tomates Cherry',
    puntos: [
      { coords: [-25.1256, -58.2464], name: 'Chacra Santa Rosa', loc: 'Laguna Blanca', intensidad: 0.8, score: 4.7 },
      { coords: [-25.7314, -59.1155], name: 'Invernadero Pirané', loc: 'Pirané', intensidad: 0.9, score: 4.9 },
      { coords: [-25.2131, -59.8583], name: 'Huertas del Centro', loc: 'Ibarreta', intensidad: 0.5, score: 4.3 },
      { coords: [-26.3056, -59.3725], name: 'Consorcio Hortícola Sur', loc: 'El Colorado', intensidad: 0.4, score: 4.0 }
    ],
    destacado: {
      name: 'Invernadero Pirané',
      loc: 'Pirané — Dpto. Pirané, Formosa',
      score: 4.9,
      img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      desc: 'Tomates cherry bajo invernadero con riego por goteo, cosechados a mano en el punto óptimo de dulzor.'
    }
  }
};