export const checklistItems = [
  {
    id: 1,
    category: 'Instalação',
    items: [
      {
        "id": "1.1",
        "text": "Critério de Aceitação: Afastamentos de sistemas elétricos de potência em baixa tensão isolados em eletrodutos não metálicos e a ocorrência de interferências com as mesmas. \n\nOcorrência: Quando em redes em paralelo menor que 30mm e quando em cruzamentos menor que 10 mm (com material isolante\naplicado).",
        "required": true,
        "photoRequired": true
      },
      {
        "id": "1.2",
        "text": "Critério de Aceitação: Afastamentos de sistemas elétricos de potência em baixa tensão isolados em eletrodutos metálicos ou sem eletrodutos e a ocorrência de interferências com as mesmas.\n\nOcorrência: Afastamento menor que 50mm para cada lado.",
        "required": true,
        "photoRequired": true
      },
      {
        "id": "1.3",
        "text": "Critério de Aceitação: Afastamentos e a ocorrência de interferências com tubulações de água quente ou fria.\n\nOcorrência: Afastamentos quando em redes em paralelo menor que 30 mm e quando em cruzamentos menor que 10 mm.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "1.4",
        "text": "Critério de Aceitação: Afastamentos e a ocorrência de interferências com tubulação de vapor.\n\nOcorrência: Afastamentos quando em redes em paralelo menor que 50 mm e quando em cruzamentos menor que 10 mm.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "1.5",
        "text": "Critério de Aceitação: Afastamentos e a ocorrência de interferências com chaminés.\n\nOcorrência: Afastamentos quando em redes em paralelo menor que 50 mm e quando em cruzamentos menor que 50 mm.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "1.6",
        "text": "Critério de Aceitação: Afastamentos e a ocorrência de interferências com tubulação de gás.\n\nOcorrência: Afastamentos quando em redes em paralelo menor que 10 mm e quando em cruzamentos menor que 10 mm.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "1.7",
        "text": "Critério de Aceitação: Afastamentos e a ocorrência de interferências com as demais instalações(águas pluviais,esgoto).\n\nOcorrência: Afastamentos quando em redes em paralelo menor que 50 mm e quando em cruzamentos menor que 10 mm.",
        "required": true,
        "photoRequired": false
      }
      
    ]
  },
  {
    id: 2,
    category: 'Vazamentos',
    items: [
     {
        "id": "2.1",
        "text": "Critério de Aceitação: Rede de gás passando somente por locais permitidos. Rede não passando através de chaminés, tubos de lixo, tubos de ar condicionado e outros.\n\nOcorrência: Rede passando através de chaminés, tubos de lixo, tubos de ar condicionado e outros.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "2.2",
        "text": "Critério de Aceitação: Rede de gás passando somente por locais permitidos. Rede não passando em compartimento sem ventilação.\n\nOcorrência: Rede passando em compartimento sem ventilação.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "2.3",
        "text": "Critério de Aceitação: Rede de gás passando somente por locais permitidos. Rede não passando em poços de elevador.\n\n Ocorrência: Rede passando em poços de elevador.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "2.4",
        "text": "Critério de Aceitação: Rede de gás passando somente por locais permitidos. Rede não passando em paredes, tampas, interior de depósito de águas e de incineradores.\n\nOcorrência: Rede passando em paredes, tampas, interior de depósito de águas e de incineradores",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "2.5",
        "text": "Critério de Aceitação: Rede de gás passando somente por locais permitidos. Rede não passando em qualquer vazio, ou paredes contígua a qualquer vazio formado pela estrutura ou alvenaria, a menos que amplamente ventilado.\n\nOcorrência: Rede passando em qualquer vazio, ou paredes contígua a qualquer vazio formado pela estrutura ou alvenaria, a menos que amplamente ventilado.",
        "required": true,
        "photoRequired": false
      }
    ]
  },
  {
    id: 3,
    category: 'Segurança',
    items: [
      {
        "id": "3.1",
        "text": "Critério de Aceitação: Tipo de material utilizado na rede. Materiais e/ou conexões não devem ser de PVC. Ocorrência: Existência de material em PVC.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "3.2",
        "text": "Critério de Aceitação: Condições dos elementos de suportação. Suportes devem ser íntegros, bem fixados e resistentes à corrosão. Ocorrência: Suportes não íntegros, mal fixados e apresentando corrosão.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "4.1",
        "text": "Critério de Aceitação: Estanqueidade. Vazamento menor que 1 L/h na rede de distribuição interna. Ocorrência: Vazamento maior que 1 L/h e menor ou igual a 5 L/h na rede de distribuição interna.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "4.2",
        "text": "Critério de Aceitação: Estanqueidade. Vazamento menor que 1 L/h na rede de distribuição interna. Ocorrência: Vazamento maior que 5 L/h na rede de distribuição interna.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "5.1",
        "text": "Critério de Aceitação: Estanqueidade das conexões de ligação do regulador ou dos medidores. Ocorrência: Conexões de ligação do regulador ou dos medidores não estanques/com vazamento.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "6.1",
        "text": "Critério de Aceitação: Condições de acesso ao abrigo, desobstruído, permitindo a marcação, inspeção e manutenção dos medidores. Ocorrência: Obstruído, não permitindo a marcação, inspeção e manutenção dos medidores.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "6.2",
        "text": "Critério de Aceitação: Existência de abertura para ventilação permanente no abrigo dos reguladores/medidores.Ocorrência: Área de ventilação permanente superior ou inferior menor ao equivalente a 1/10 da área da planta baixa do abrigo de medidores.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "6.3",
        "text": "Critério de Aceitação: Existência de abertura para ventilação permanente no abrigo dos reguladores/medidores. Ocorrência: Não existência de abertura para ventilação permanente superior ou inferior do abrigo.",
        "required": true,
        "photoRequired": false
      },
      {
        "id": "7.1",
        "text": `Critério de Aceitação: Ausência de dispositivo e/ou instalações elétricas no interior do abrigo, que possam
        produzir chama ou centelhamento.
        Ocorrência: Existência de dispositivo e/ou
        instalações elétricas no interior do abrigo, que
        possam produzir chama ou centelhamento.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "8.1",
        "text": `Critério de Aceitação: Ausência de entulhos, botijões de
        GLP ou outros materiais na interior abrigo.
        Ocorrência: Existência de entulhos, botijões de
        GLP ou outros materiais na interior abrigo.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "9.1",
        "text": `Critério de Aceitação: Ambiente contendo aparelhos de
        circuito aberto instalado com volume maior ou igual a
        6m³.
        Ocorrência : Aparelhos de circuito aberto
        instalados em ambiente com menos de 6m³.`,
        "required": true,
        "photoRequired": false
      },

      {
        "id": "9.2",
        "text": `Critério de Aceitação: Aparelhos de circuito aberto não
        devem ser instalados em dormitórios, box e acima de
        banheira com chuveiro.
        Ocorrência: Aparelhos de circuito aberto
        instalados em dormitórios, box e acima de
        banheira com chuveiro.`,
        "required": true,
        "photoRequired": false
      }
            ]
    },
    {
  id: 4,
  category: 'Finalização',
  items: [
      {
        "id": "10.1",
        "text": `Critério de Aceitação: Ventilação permanente direta
        superior maior ou igual a 600cm², inferior maior ou igual
        a 200cm² e total maior ou igual a 800cm².
        Ocorrência: Inexistência de abertura de
        ventilação permanente direta superior ou
        inferior ou ambas.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "10.2",
        "text": `Critério de Aceitação: Ventilação permanente direta
        superior maior ou igual a 600cm², inferior maior ou igual
        a 200cm² e total maior ou igual a 800cm².
        Ocorrência: Área da abertura de ventilação
        permanente direta superior ou inferior ou ambas
        insuficientes.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "10.3",
        "text": `Critério de Aceitação: Área da abertura de ventilação
        permanente superior ou inferior maior que a área do
        diâmetro da saída dos gases da combustão do aparelho
        de circuito aberto com chaminé e exaustão forçada.
        Ocorrência: Área da abertura de ventilação
        permanente superior ou inferior menor que a
        área do diâmetro da saída dos gases da
        combustão do aparelho de circuito aberto com
        chaminé e exaustão forçada`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "11.1",
        "text": `Critério de Aceitação: Ventilação indireta. Cômodo
        contíguo a outro (teto rebaixado), ambos com abertura
        de ventilação permanente no rebaixo de 1600cm² e
        limitada a 4m de comprimento e outra inferior de 200
        cm², até 0,8 m de altura.
        Ocorrência: Inexistência de pelo menos uma das
        aberturas de ventilação indireta.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "11.2",
        "text": `Critério de Aceitação: Ventilação indireta. Cômodo
        contíguo a outro (teto rebaixado), ambos com aparelhos
        de circuito aberto instalado e com abertura de ventilação
        permanente superior indireta no rebaixo de 1600cm²
        limitada a 4m de comprimento de rebaixo, sendo o
        ambiente de teto rebaixado com abertura superior
        permanente direta para o exterior de no mínimo 600cm²,
        altura igual ou superior a 1,5m, e ambos os ambientes
        com abertura permanente inferior de no mínimo 200cm²,
        até 0,8 m de altura.
        Ocorrência: Insuficiência nas aberturas de
        ventilação e comprimento do rebaixo superior a
        4m.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "12.1",
        "text": `Critério de Aceitação: Ventilação por duto. Comprimento
        do duto até 3 m, uma vez a área mínima da abertura
        inferior/superior.
        Ocorrência: Inadequação da ventilação por duto.
        Comprimento do duto até 3 m, tem menos que
        uma vez a área mínima da abertura
        inferior/superior.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "12.2",
        "text": `Critério de Aceitação: Ventilação por duto. Comprimento
        do duto de 3 até 10 metros, 1,5 vez a área mínima da
        abertura inferior/superior.
        Ocorrência: Inadequação da ventilação por duto.
        Comprimento do duto de 3 até 10 metros, tem
        menos que 1,5 vez a área mínima da abertura
        inferior/superior`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "12.3",
        "text": `Critério de Aceitação: Ventilação por duto. Comprimento
        do duto acima de 10 metros, 2 vezes a área mínima da
        abertura inferior/superior.
        Ocorrência: Inadequação da ventilação por duto.
        Comprimento do duto acima de 10 metros, tem
        em menos que 2 vezes a área mínima da
        abertura inferior/superior.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "13.1",
        "text": `Critério de Aceitação: Ambientes com aparelhos de
        circuito aberto instalado, com exaustão mecânica e com
        abertura de ventilação inferior mínima de 600cm².
        Ocorrência: Inexistência de ventilação inferior
        e/ou exaustão mecânica inexistente ou
        inoperante.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "14.1",
        "text": `Critério de Aceitação: Tubo flexível de acordo com as
        NBR-14177, NBR 14745, NBR 13419 e NBR 14955 e
        estanque.
        Ocorrência: Tubo flexível não estanque/com
        vazamento.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "14.2",
        "text": `Critério de Aceitação: Tubo flexível de acordo com as
        NBR-14177, NBR 14745, NBR 13419 e NBR 14955 e
        estanque.
        Ocorrência: Tubo flexível em desacordo com a
        NBR-14177, NBR 14745, NBR 13419 e NBR
        14955.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "15.1",
        "text": `Critério de Aceitação: Registro estanque/sem vazamento. Ocorrência: Registro não estanque/com
        vazamento.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "15.2",
        "text": `Critério de Aceitação: Registro em local de fácil acesso e
        com ventilação adequada.
        Ocorrência: Registro em local de difícil acesso
        e/ou sem ventilação.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "16.1",
        "text": `Critério de Aceitação: Chaminé com encaixes firmes na
        conexão com o aparelho e com o terminal. Ocorrência: Conexões e encaixes não firmes.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "17.1",
        "text": `Critério de Aceitação: Presença de coifa ou exaustor em
        instalações com aparelhos de cocção com capacidade
        superior a 360 kcal/min.
        Ocorrência: Ausência da coifa ou do exaustor.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "18.1",
        "text": `Critério de Aceitação: Diâmetro do duto igual ao
        diâmetro da saída da chaminé do aparelho
        Ocorrência: Diâmetro diferente do diâmetro da
        saída da chaminé do aparelho.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "18.2",
        "text": `Critério de Aceitação: Inexistência de estrangulamentos
        do duto em relação ao defletor do aparelho
        Ocorrência: Existência de estrangulamentos do
        duto em relação ao defletor do aparelho.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "19.1",
        "text": `Critério de Aceitação: Existência de chaminé e terminal
        instalados para aquecedores de circuito aberto e fechado
        com saída para área externa ou prisma de ventilação
        Ocorrência: Inexistência da chaminé instalada.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "19.2",
        "text": `Critério de Aceitação: Chaminé e terminal não devem ser
        instalados em ambientes fechados.
        Ocorrência: Chaminé e terminal instalados em
        ambiente fechado.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "19.3",
        "text": `Critério de Aceitação: Existência de terminal instalado na
        extremidade da chaminé.
        Ocorrência: Inexistência de terminal instalado
        na extremidade chaminé.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "20.1",
        "text": `Critério de Aceitação: Integridade do material do duto de
        exaustão. Devem ser fabricadas em materiais
        incombustíveis, termoestáveis e resistentes a corrosão.
        Ocorrência: Materiais combustíveis
        termoinstáveis e não resistentes a corrosão.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "20.2",
        "text": `Critério de Aceitação: Integridade do material do duto de
        exaustão. Não dever ter rachadura, rasgos ou emendas
        indevidas no duto de exaustão.
        Ocorrência: Existência de rachadura, rasgos ou
        emendas indevidas no duto de exaustão.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "21.1",
        "text": `Critério de Aceitação: Altura do trecho vertical inicial
        deve ser maior ou igual a 35cm (com referência ao
        centro do duto).
        Ocorrência: Altura Menor que 35 cm. (com
        referência ao centro do duto).`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "22.1",
        "text": `Critério de Aceitação: Distância do trecho horizontal e
        inexistência de excessos de curvas e desvios no duto de
        exaustão, conforme IT Nº2 Decreto Estadual 23.317/97
        (RIP), ou conforme manual do fabricante.
        Ocorrência: Trecho horizontal maior ao critério
        do Decreto Estadual 23.317/97 (RIP). Deve ser
        no máximo de 2m, sendo permissíveis 2 curvas
        até 90°.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "22.2",
        "text": `Critério de Aceitação: Distância do trecho horizontal e
        inexistência de excessos de curvas e desvios no duto de
        exaustão, conforme IT Nº2 Decreto Estadual 23.317/97
        (RIP), ou conforme manual do fabricante.
        Ocorrência: Existência de excesso de curvas e
        desvios no trecho horizontal do duto de
        exaustão`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "22.3",
        "text": `Critério de Aceitação: Distância do trecho horizontal e
        inexistência de excessos de curvas e desvios no duto de
        exaustão, conforme IT Nº2 Decreto Estadual 23.317/97
        (RIP), ou conforme manual do fabricante.
        Ocorrência: Trecho horizontal do duto do
        sistema de exaustão descendente.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "23.1",
        "text": `Critério de Aceitação: Inexistência de passagem de dutos
        por espaço oco sem ventilação.
        Ocorrência: Existência de passagem de dutos
        por espaço oco sem ventilação.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "24.1",
        "text": `Critério de Aceitação: Existência de chaminé individual
        para cada aparelho.
        Ocorrência: Existência de interligação entre
        chaminés.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "25.1",
        "text": `Critério de Aceitação: Medição de Monóxido de carbono
        neutro nos aquecedores de circuito aberto menor que
        500 ppm para gases de 2ª família e menor que 1000
        ppm para gases de 3ª família
        Ocorrência: Monóxido de carbono neutro nos
        aquecedores de circuito aberto maior igual a
        500 ppm para gases de 2ª família e maior ou
        igual a 1000 ppm para gases de 3ª família.`,
        "required": true,
        "photoRequired": false
      },
      {
        "id": "26.1",
        "text": `Critério de Aceitação: Medição de Monóxido de carbono
        ambiente nos locais com aquecedor de circuito aberto
        instalado e/ou com aparelhos de cocção com potência
        individual acima de 360 kCal/min menor que 15 ppm
        Ocorrência: Monóxido de carbono ambiente nos
        locais com aquecedor de circuito aberto
        instalado e/ou com aparelhos de cocção com
        potência individual acima de 360 kCal/min maior
        ou igual a 15 ppm`,
        "required": true,
        "photoRequired": false
      }

    ]
  }
];
