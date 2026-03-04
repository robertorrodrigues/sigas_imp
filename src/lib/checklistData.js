export const checklistItems = [
  {
    id: 1,
    category: '1.1 .. 1.7',
    items: [
      {
        "id": "1.1",
        "criterio_aceitacao": "Afastamentos de sistemas elétricos de potência em baixa tensão isolados em eletrodutos não metálicos e a ocorrência de interferências com as mesmas.",
        "ocorrencia": "Quando em redes em paralelo menor que 30mm e quando em cruzamentos menor que 10 mm (com material isolante\naplicado).",
        "required": true, "prazo": "90 dias",
		    "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "1.2",
        "criterio_aceitacao": "Afastamentos de sistemas elétricos de potência em baixa tensão isolados em eletrodutos metálicos ou sem eletrodutos e a ocorrência de interferências com as mesmas.", 
		    "ocorrencia": "Afastamento menor que 50mm para cada lado.",
        "required": true, "prazo": "90 dias", "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "1.3",
        "criterio_aceitacao": "Afastamentos e a ocorrência de interferências com tubulações de água quente ou fria.", "ocorrencia": "Afastamentos quando em redes em paralelo menor que 30 mm e quando em cruzamentos menor que 10 mm.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "1.4",
        "criterio_aceitacao": "Afastamentos e a ocorrência de interferências com tubulação de vapor.", 
		"ocorrencia": "Afastamentos quando em redes em paralelo menor que 50 mm e quando em cruzamentos menor que 10 mm.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "1.5",
        "criterio_aceitacao": "Afastamentos e a ocorrência de interferências com chaminés.", 
		"ocorrencia": "Afastamentos quando em redes em paralelo menor que 50 mm e quando em cruzamentos menor que 50 mm.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "1.6",
        "criterio_aceitacao": "Afastamentos e a ocorrência de interferências com tubulação de gás.", 
		"ocorrencia": "Afastamentos quando em redes em paralelo menor que 10 mm e quando em cruzamentos menor que 10 mm.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "1.7",
        "criterio_aceitacao": "Afastamentos e a ocorrência de interferências com as demais instalações(águas pluviais,esgoto).", 
		"ocorrencia": "Afastamentos quando em redes em paralelo menor que 50 mm e quando em cruzamentos menor que 10 mm.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      }
      
    ]
  },
  {
    id: 2,
    category: '2.1 .. 2.5',
    items: [
     {
        "id": "2.1",
        "criterio_aceitacao": "Rede de gás passando somente por locais permitidos. Rede não passando através de chaminés, tubos de lixo, tubos de ar condicionado e outros.", 
		"ocorrencia": "Rede passando através de chaminés, tubos de lixo, tubos de ar condicionado e outros.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "2.2",
        "criterio_aceitacao": "Rede de gás passando somente por locais permitidos. Rede não passando em compartimento sem ventilação.", 
		"ocorrencia": "Rede passando em compartimento sem ventilação.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "2.3",
        "criterio_aceitacao": "Rede de gás passando somente por locais permitidos. Rede não passando em poços de elevador.",
		"ocorrencia": "Rede passando em poços de elevador.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "2.4",
        "criterio_aceitacao": "Rede de gás passando somente por locais permitidos. Rede não passando em paredes, tampas, interior de depósito de águas e de incineradores.", 
		"ocorrencia": "Rede passando em paredes, tampas, interior de depósito de águas e de incineradores",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "2.5",
        "criterio_aceitacao": "Rede de gás passando somente por locais permitidos. Rede não passando em qualquer vazio, ou paredes contígua a qualquer vazio formado pela estrutura ou alvenaria, a menos que amplamente ventilado.", 
		"ocorrencia": "Rede passando em qualquer vazio, ou paredes contígua a qualquer vazio formado pela estrutura ou alvenaria, a menos que amplamente ventilado.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      }
    ]
  },
  {
    id: 3,
    category: '3.1 .. 9.2',
    items: [
      {
        "id": "3.1",
        "criterio_aceitacao": "Tipo de material utilizado na rede. Materiais e/ou conexões não devem ser de PVC.", "ocorrencia": " Existência de material em PVC.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "3.2",
        "criterio_aceitacao": "Condições dos elementos de suportação. Suportes devem ser íntegros, bem fixados e resistentes à corrosão.", 
		"ocorrencia": " Suportes não íntegros, mal fixados e apresentando corrosão.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "4.1",
        "criterio_aceitacao": "Estanqueidade. Vazamento menor que 1 L/h na rede de distribuição interna.", 
		"ocorrencia": " Vazamento maior que 1 L/h e menor ou igual a 5 L/h na rede de distribuição interna.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "4.2",
        "criterio_aceitacao": "Estanqueidade. Vazamento menor que 1 L/h na rede de distribuição interna.", 
		"ocorrencia": " Vazamento maior que 5 L/h na rede de distribuição interna.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },
      {
        "id": "5.1",
        "criterio_aceitacao": "Estanqueidade das conexões de ligação do regulador ou dos medidores.", 
		"ocorrencia": " Conexões de ligação do regulador ou dos medidores não estanques/com vazamento.",
        "required": true, "prazo": "COMUNICAR A CONCESSIONÁRIA IMEDIATAMENTE",
        "photoRequired": true
      },
      {
        "id": "6.1",
        "criterio_aceitacao": "Condições de acesso ao abrigo, desobstruído, permitindo a marcação, inspeção e manutenção dos medidores.", 
		"ocorrencia": " Obstruído, não permitindo a marcação, inspeção e manutenção dos medidores.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "6.2",
        "criterio_aceitacao": "Existência de abertura para ventilação permanente no abrigo dos reguladores/medidores.",
		"ocorrencia": "Área de ventilação permanente superior ou inferior menor ao equivalente a 1/10 da área da planta baixa do abrigo de medidores.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "6.3",
        "criterio_aceitacao": "Existência de abertura para ventilação permanente no abrigo dos reguladores/medidores.", "ocorrencia": " Não existência de abertura para ventilação permanente superior ou inferior do abrigo.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "7.1",
        "criterio_aceitacao": "Ausência de dispositivo e/ou instalações elétricas no interior do abrigo, que possam produzir chama ou centelhamento.", 
		    "ocorrencia": " Existência de dispositivo e/ou instalações elétricas no interior do abrigo, que possam produzir chama ou centelhamento.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "8.1",
        "criterio_aceitacao": "Ausência de entulhos, botijões de GLP ou outros materiais na interior abrigo.", 
	    "ocorrencia": " Existência de entulhos, botijões de GLP ou outros materiais na interior abrigo.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "9.1",
        "criterio_aceitacao": "Ambiente contendo aparelhos de circuito aberto instalado com volume maior ou igual a 6m³.",
        "ocorrencia" : "Aparelhos de circuito aberto instalados em ambiente com menos de 6m³.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },

      {
        "id": "9.2",
        "criterio_aceitacao": "Aparelhos de circuito aberto não devem ser instalados em dormitórios, box e acima de banheira com chuveiro.", 
	   "ocorrencia": " Aparelhos de circuito aberto instalados em dormitórios, box e acima de banheira com chuveiro.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      }
            ]
    },
    {
  id: 4,
  category: '10.1 .. 26.1',
  items: [
      {
        "id": "10.1",
        "criterio_aceitacao": "Ventilação permanente direta superior maior ou igual a 600cm², inferior maior ou igual a 200cm² e total maior ou igual a 800cm².", 
	      "ocorrencia": `Inexistência de abertura de
        ventilação permanente direta superior ou
        inferior ou ambas.`,
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },
      {
        "id": "10.2",
        "criterio_aceitacao": "Ventilação permanente direta superior maior ou igual a 600cm², inferior maior ou igual a 200cm² e total maior ou igual a 800cm².",
	      "ocorrencia": " Área da abertura de ventilação permanente direta superior ou inferior ou ambas insuficientes.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "10.3",
        "criterio_aceitacao": "Área da abertura de ventilação permanente superior ou inferior maior que a área do diâmetro da saída dos gases da combustão do aparelho de circuito aberto com chaminé e exaustão forçada.", 
	      "ocorrencia": " Área da abertura de ventilação permanente superior ou inferior menor que a área do diâmetro da saída dos gases da combustão do aparelho de circuito aberto com chaminé e exaustão forçada",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "11.1",
        "criterio_aceitacao": "Ventilação indireta. Cômodo contíguo a outro (teto rebaixado), ambos com abertura de ventilação permanente no rebaixo de 1600cm² e limitada a 4m de comprimento e outra inferior de 200 cm², até 0,8 m de altura.", 
	      "ocorrencia": " Inexistência de pelo menos uma das aberturas de ventilação indireta.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },
      {
        "id": "11.2",
        "criterio_aceitacao": "Ventilação indireta. Cômodo contíguo a outro (teto rebaixado), ambos com aparelhos de circuito aberto instalado e com abertura de ventilação permanente superior indireta no rebaixo de 1600cm² limitada a 4m de comprimento de rebaixo, sendo o ambiente de teto rebaixado com abertura superior permanente direta para o exterior de no mínimo 600cm², altura igual ou superior a 1,5m, e ambos os ambientes com abertura permanente inferior de no mínimo 200cm²,até 0,8 m de altura.", 
	      "ocorrencia": " Insuficiência nas aberturas de ventilação e comprimento do rebaixo superior a 4m.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "12.1",
        "criterio_aceitacao": "Ventilação por duto. Comprimento do duto até 3 m, uma vez a área mínima da abertura inferior/superior.", 
	      "ocorrencia": " Inadequação da ventilação por duto. Comprimento do duto até 3 m, tem menos que uma vez a área mínima da abertura inferior/superior.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "12.2",
        "criterio_aceitacao": "Ventilação por duto. Comprimento do duto de 3 até 10 metros, 1,5 vez a área mínima da abertura inferior/superior.", 
	      "ocorrencia": " Inadequação da ventilação por duto. Comprimento do duto de 3 até 10 metros, tem menos que 1,5 vez a área mínima da abertura inferior/superior",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "12.3",
        "criterio_aceitacao": "Ventilação por duto. Comprimento do duto acima de 10 metros, 2 vezes a área mínima da abertura inferior/superior.", 
	      "ocorrencia": " Inadequação da ventilação por duto. Comprimento do duto acima de 10 metros, tem em menos que 2 vezes a área mínima da abertura inferior/superior.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "13.1",
        "criterio_aceitacao": "Ambientes com aparelhos de circuito aberto instalado, com exaustão mecânica e com abertura de ventilação inferior mínima de 600cm².", 
	      "ocorrencia": " Inexistência de ventilação inferior e/ou exaustão mecânica inexistente ou inoperante.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },
      {
        "id": "14.1",
        "criterio_aceitacao": "Tubo flexível de acordo com as NBR-14177, NBR 14745, NBR 13419 e NBR 14955 e estanque.", 
	      "ocorrencia": " Tubo flexível não estanque/com vazamento.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },
      {
        "id": "14.2",
        "criterio_aceitacao": "Tubo flexível de acordo com as NBR-14177, NBR 14745, NBR 13419 e NBR 14955 e estanque.", 
	      "ocorrencia": " Tubo flexível em desacordo com a NBR-14177, NBR 14745, NBR 13419 e NBR 14955.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "15.1",
        "criterio_aceitacao": "Registro estanque/sem vazamento.", 
		    "ocorrencia": " Registro não estanque/com vazamento.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },
      {
        "id": "15.2",
        "criterio_aceitacao": "Registro em local de fácil acesso e com ventilação adequada.", 
	      "ocorrencia": " Registro em local de difícil acesso e/ou sem ventilação.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "16.1",
        "criterio_aceitacao": "Chaminé com encaixes firmes na conexão com o aparelho e com o terminal.", 
		    "ocorrencia": " Conexões e encaixes não firmes.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "17.1",
        "criterio_aceitacao": "Presença de coifa ou exaustor em instalações com aparelhos de cocção com capacidade superior a 360 kcal/min.", 
	      "ocorrencia": " Ausência da coifa ou do exaustor.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "18.1",
        "criterio_aceitacao": "Diâmetro do duto igual ao diâmetro da saída da chaminé do aparelho", 
	      "ocorrencia": " Diâmetro diferente do diâmetro da saída da chaminé do aparelho.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "18.2",
        "criterio_aceitacao": "Inexistência de estrangulamentos do duto em relação ao defletor do aparelho", 
	      "ocorrencia": " Existência de estrangulamentos do duto em relação ao defletor do aparelho.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "19.1",
        "criterio_aceitacao": "Existência de chaminé e terminal instalados para aquecedores de circuito aberto e fechado com saída para área externa ou prisma de ventilação", 
	      "ocorrencia": " Inexistência da chaminé instalada.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },
      {
        "id": "19.2",
        "criterio_aceitacao": "Chaminé e terminal não devem ser instalados em ambientes fechados.", 
	      "ocorrencia": " Chaminé e terminal instalados em ambiente fechado.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },
      {
        "id": "19.3",
        "criterio_aceitacao": "Existência de terminal instalado na extremidade da chaminé.", 
	      "ocorrencia": " Inexistência de terminal instalado na extremidade chaminé.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "20.1",
        "criterio_aceitacao": "Integridade do material do duto de exaustão. Devem ser fabricadas em materiais incombustíveis, termoestáveis e resistentes a corrosão.", 
	      "ocorrencia": " Materiais combustíveis termoinstáveis e não resistentes a corrosão.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "20.2",
        "criterio_aceitacao": "Integridade do material do duto de exaustão. Não dever ter rachadura, rasgos ou emendas indevidas no duto de exaustão.", 
	      "ocorrencia": " Existência de rachadura, rasgos ou emendas indevidas no duto de exaustão.",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "21.1",
        "criterio_aceitacao": "Altura do trecho vertical inicial deve ser maior ou igual a 35cm (com referência ao centro do duto).", 
	      "ocorrencia": " Altura Menor que 35 cm. (com referência ao centro do duto).",
        "required": true, "prazo": "60 dias",
        "photoRequired": true
      },
      {
        "id": "22.1",
        "criterio_aceitacao": "Distância do trecho horizontal e inexistência de excessos de curvas e desvios no duto de exaustão, conforme IT Nº2 Decreto Estadual 23.317/97 (RIP), ou conforme manual do fabricante.", 
	      "ocorrencia": " Trecho horizontal maior ao critério do Decreto Estadual 23.317/97 (RIP). Deve ser no máximo de 2m, sendo permissíveis 2 curvas até 90°.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "22.2",
        "criterio_aceitacao": "Distância do trecho horizontal e inexistência de excessos de curvas e desvios no duto de exaustão, conforme IT Nº2 Decreto Estadual 23.317/97 (RIP), ou conforme manual do fabricante.", 
	      "ocorrencia": " Existência de excesso de curvas e desvios no trecho horizontal do duto de exaustão",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "22.3",
        "criterio_aceitacao": "Distância do trecho horizontal e  inexistência de excessos de curvas e desvios no duto de exaustão, conforme IT Nº2 Decreto Estadual 23.317/97  (RIP), ou conforme manual do fabricante.", 
	      "ocorrencia": " Trecho horizontal do duto do sistema de exaustão descendente.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "23.1",
        "criterio_aceitacao": "Inexistência de passagem de dutos por espaço oco sem ventilação.", 
	      "ocorrencia": " Existência de passagem de dutos por espaço oco sem ventilação.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "24.1",
        "criterio_aceitacao": "Existência de chaminé individual  para cada aparelho.", 
	      "ocorrencia": " Existência de interligação entre chaminés.",
        "required": true, "prazo": "90 dias",
        "photoRequired": true
      },
      {
        "id": "25.1",
        "criterio_aceitacao": "Medição de Monóxido de carbono  neutro nos aquecedores de circuito aberto menor que 500 ppm para gases de 2ª família e menor que 1000 ppm para gases de 3ª família", 
	      "ocorrencia": " Monóxido de carbono neutro nos aquecedores de circuito aberto maior igual a 500 ppm para gases de 2ª família e maior ou igual a 1000 ppm para gases de 3ª família.",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      },
      {
        "id": "26.1",
        "criterio_aceitacao": "Medição de Monóxido de carbono ambiente nos locais com aquecedor de circuito aberto instalado e/ou com aparelhos de cocção com potência individual acima de 360 kCal/min menor que 15 ppm", 
	      "ocorrencia": " Monóxido de carbono ambiente nos locais com aquecedor de circuito aberto instalado e/ou com aparelhos de cocção com potência individual acima de 360 kCal/min maior ou igual a 15 ppm",
        "required": true, "prazo": "Lacre",
        "photoRequired": true
      }

    ]
  }
];
