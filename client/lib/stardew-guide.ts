export type Season = "Primavera" | "Verão" | "Outono" | "Inverno" | "Qualquer estação";

export type QuestKind =
  | "História"
  | "Entrega"
  | "Pedido Especial"
  | "Desbloqueio";

export interface QuestTask {
  id: string;
  title: string;
  kind: QuestKind;
  season: Season;
  day?: number;
  year?: number;
  npc?: string;
  item?: string;
  objective: string;
  reward?: string;
  note?: string;
}

export interface MarriageCandidate {
  id: string;
  name: string;
  birthday: {
    season: Exclude<Season, "Qualquer estação">;
    day: number;
  };
  lovedGifts: string[];
  giftTip?: string;
}

export const SEASONS: Exclude<Season, "Qualquer estação">[] = [
  "Primavera",
  "Verão",
  "Outono",
  "Inverno",
];

export const QUESTS: QuestTask[] = [
  {
    id: "quest-spring-beach",
    title: "À praia",
    kind: "História",
    season: "Primavera",
    day: 2,
    year: 1,
    npc: "Willy",
    objective: "Visite a praia ao sul da cidade antes das 17h.",
    reward: "Vara de Bambu",
  },
  {
    id: "quest-spring-robin-axe",
    title: "Machado perdido da Robin",
    kind: "História",
    season: "Primavera",
    day: 11,
    year: 1,
    npc: "Robin",
    item: "Machado perdido",
    objective:
      "Encontre o machado perdido ao sul do Rancho da Marnie, perto do cano de esgoto, e devolva para Robin.",
    reward: "250 ouros + 1 coração de amizade com Robin",
  },
  {
    id: "quest-spring-jodi-cauliflower",
    title: "Pedido da Jodi",
    kind: "Entrega",
    season: "Primavera",
    day: 19,
    year: 1,
    npc: "Jodi",
    item: "Couve-flor",
    objective: "Leve uma Couve-flor para Jodi.",
    reward: "350 ouros + 1 coração de amizade com Jodi",
    note: "Vale plantar uma Couve-flor com antecedência para não depender do Carrinho de Viagem.",
  },
  {
    id: "quest-spring-grandma-gift",
    title: "Presente da vovó",
    kind: "Entrega",
    season: "Primavera",
    day: 15,
    year: 2,
    npc: "Evelyn",
    item: "Alho-poró",
    objective: "Leve um Alho-poró para Evelyn.",
    reward: "500 ouros",
  },
  {
    id: "quest-spring-fresh-fruit",
    title: "Frutas frescas",
    kind: "Entrega",
    season: "Primavera",
    year: 2,
    npc: "Emily",
    item: "Damasco",
    objective: "Leve um Damasco fresco para Emily.",
    note: "O pedido chega durante a Primavera do Ano 2.",
  },
  {
    id: "special-spring-george-gifts",
    title: "Presentes para o George",
    kind: "Pedido Especial",
    season: "Primavera",
    npc: "Evelyn",
    item: "12 Alhos-porós",
    objective:
      "Enquanto o pedido estiver ativo, colete/colha 12 Alhos-porós e coloque-os no fogão da Evelyn.",
    reward: "Máquina de Café",
    note: "Pedido sazonal do quadro de Pedidos Especiais.",
  },
  {
    id: "special-spring-strong-stuff",
    title: "O Negócio Forte",
    kind: "Pedido Especial",
    season: "Primavera",
    npc: "Pam",
    item: "12 Sucos de Batata",
    objective:
      "Produza e colete 12 Sucos de Batata em barris enquanto a missão estiver ativa.",
    note: "Prazo máximo de 14 dias; deixe batatas e barris preparados.",
  },
  {
    id: "quest-summer-mayor-shorts",
    title: '"Shorts" do Prefeito',
    kind: "História",
    season: "Verão",
    day: 3,
    year: 1,
    npc: "Lewis",
    item: "Shorts roxos da sorte",
    objective:
      "Recupere os shorts no quarto de Marnie e devolva discretamente para Lewis.",
    reward: "750 ouros",
    note: "É necessário ter acesso ao quarto da Marnie.",
  },
  {
    id: "quest-summer-pam-thirsty",
    title: "Pam está com sede",
    kind: "Entrega",
    season: "Verão",
    day: 14,
    year: 1,
    npc: "Pam",
    item: "Pale Ale",
    objective: "Produza Pale Ale com Lúpulo em um Barril e entregue para Pam.",
    reward: "350 ouros + 1 coração de amizade com Pam",
  },
  {
    id: "quest-summer-crop-research",
    title: "Pesquisa de Plantações",
    kind: "Entrega",
    season: "Verão",
    day: 20,
    year: 1,
    npc: "Demetrius",
    item: "Melão",
    objective: "Leve um Melão fresco para Demetrius.",
    reward: "550 ouros + 1 coração de amizade com Demetrius",
  },
  {
    id: "quest-summer-knee-therapy",
    title: "Remédio de Joelho",
    kind: "Entrega",
    season: "Verão",
    npc: "George",
    item: "Pimenta Picante",
    objective: "Leve uma Pimenta Picante para George.",
    reward: "200 ouros + 1 coração de amizade com George",
  },
  {
    id: "quest-summer-aquatic-research",
    title: "Pesquisa Aquática",
    kind: "Entrega",
    season: "Verão",
    day: 6,
    year: 2,
    npc: "Demetrius",
    item: "Baiacu",
    objective: "Pesque ou obtenha um Baiacu e entregue para Demetrius.",
    reward: "Ouro + 1 coração de amizade com Demetrius",
  },
  {
    id: "quest-fall-linus-basket",
    title: "Cesta de Amoras",
    kind: "História",
    season: "Outono",
    day: 8,
    year: 1,
    npc: "Linus",
    item: "Cesta de Linus",
    objective:
      "Pegue a cesta perto da entrada do túnel, à esquerda do Ponto de Ônibus, e devolva para Linus.",
    reward: "1 coração de amizade com Linus",
  },
  {
    id: "quest-fall-caroline-pumpkin",
    title: "Esculpindo Abóboras",
    kind: "Entrega",
    season: "Outono",
    npc: "Caroline",
    item: "Abóbora",
    objective: "Leve uma Abóbora para Caroline.",
    reward: "500 ouros",
  },
  {
    id: "quest-fall-fish-casserole",
    title: "Caçarola de Peixe",
    kind: "Entrega",
    season: "Outono",
    day: 15,
    year: 1,
    npc: "Jodi",
    item: "Achigã",
    objective:
      "Após o convite de 4 corações, entre na casa da Jodi às 19h levando um Achigã.",
    reward: "Evento de coração",
    note: "Também pode ocorrer no dia 1 do Inverno do Ano 1.",
  },
  {
    id: "unlock-fall-special-orders",
    title: "Desbloquear o Quadro de Pedidos Especiais",
    kind: "Desbloqueio",
    season: "Outono",
    year: 1,
    objective:
      "Assista à cena que instala o quadro em frente à casa do Prefeito Lewis.",
    note: "Depois disso, verifique o quadro toda segunda-feira.",
  },
  {
    id: "quest-winter-mystery",
    title: "Um Mistério do Inverno",
    kind: "História",
    season: "Inverno",
    year: 1,
    objective:
      "Entre no Ponto de Ônibus vindo da fazenda entre 6h e 16h e siga a figura suspeita; interaja com o arbusto perto do parque infantil.",
    reward: "Lupa para encontrar Recados Secretos",
  },
  {
    id: "quest-winter-squid",
    title: "Caça à Lula",
    kind: "Entrega",
    season: "Inverno",
    day: 2,
    year: 1,
    npc: "Willy",
    item: "Lula",
    objective: "Pesque uma Lula no oceano à noite e entregue para Willy.",
    reward: "800 ouros + 1 coração de amizade com Willy",
  },
  {
    id: "quest-winter-robin-hardwood",
    title: "Pedido da Robin",
    kind: "Entrega",
    season: "Inverno",
    day: 21,
    npc: "Robin",
    item: "10 Madeiras de Lei",
    objective: "Leve 10 Madeiras de Lei para Robin.",
    reward: "500 ouros + 1 coração de amizade com Robin",
  },
  {
    id: "quest-winter-fish-stew",
    title: "Guisado de peixe",
    kind: "Entrega",
    season: "Inverno",
    day: 26,
    npc: "Gus",
    item: "Albacora",
    objective: "Leve uma Albacora para Gus.",
    reward: "400 ouros + 1 coração de amizade com Gus",
  },
  {
    id: "quest-winter-lingcod",
    title: "Pegue um Ófis",
    kind: "Entrega",
    season: "Inverno",
    day: 13,
    year: 2,
    npc: "Willy",
    item: "Ófis",
    objective: "Pesque ou obtenha um Ófis e entregue para Willy.",
    reward: "550 ouros + 1 coração de amizade com Willy",
  },
  {
    id: "quest-winter-staff-power",
    title: "Cajado do Poder",
    kind: "Entrega",
    season: "Inverno",
    day: 5,
    year: 2,
    npc: "Feiticeiro",
    item: "Barra de Irídio",
    objective: "Leve uma Barra de Irídio para o Feiticeiro.",
    reward: "5.000 ouros",
  },
  {
    id: "quest-any-marnie-request",
    title: "Pedido de Marnie",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Marnie",
    item: "Cenoura Subterrânea",
    objective:
      "Depois de atingir 3 corações com Marnie, leve uma Cenoura Subterrânea para a loja dela.",
    reward: "100 pontos de amizade",
  },
  {
    id: "quest-any-cow-delight",
    title: "Agrado de Vaca",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Marnie",
    item: "Amaranto",
    objective: "Leve um feixe de Amaranto para Marnie.",
    reward: "500 ouros",
    note: "O item é uma plantação de Outono, então vale guardar uma unidade.",
  },
  {
    id: "quest-any-soldiers-star",
    title: "A Estrela do Soldado",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Kent",
    item: "Carambola",
    objective: "Leve uma Carambola para Kent.",
    reward: "500 ouros",
  },
  {
    id: "quest-any-mayors-need",
    title: "Vontade do prefeito",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Lewis",
    item: "Óleo de Trufas",
    objective: "Leve uma garrafa de Óleo de Trufas para Lewis.",
    reward: "500 ouros",
  },
  {
    id: "quest-any-lobster",
    title: "Precisa-se: Lagosta",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Gus",
    item: "Lagosta",
    objective: "Leve uma Lagosta para Gus.",
    reward: "500 ouros",
  },
  {
    id: "quest-any-pam-battery",
    title: "Pam precisa de energia",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Pam",
    item: "Conjunto de Pilhas",
    objective: "Leve um Conjunto de Pilhas para Pam.",
    reward: "400 ouros",
  },
  {
    id: "quest-any-clint-attempt",
    title: "Tentativa do Clint",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Emily",
    item: "Ametista",
    objective: "Dê uma Ametista para Emily em nome de Clint.",
    reward: "1 coração de amizade com Emily",
  },
  {
    id: "quest-any-clint-favor",
    title: "Um favor ao Clint",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Clint",
    item: "Barra de Ferro",
    objective: "Leve uma Barra de Ferro para Clint.",
    reward: "500 ouros",
  },
  {
    id: "quest-any-pierre-note",
    title: "Bilhete do Pierre",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Pierre",
    item: "Sashimi",
    objective: "Leve um Sashimi para Pierre.",
    reward: "1.000 ouros",
  },
  {
    id: "quest-any-exotic-spirits",
    title: "Espíritos exóticos",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Gus",
    item: "Coco",
    objective: "Leve um Coco para Gus.",
    reward: "600 ouros",
  },
  {
    id: "quest-any-dark-path",
    title: "Caminho bloqueado",
    kind: "Entrega",
    season: "Qualquer estação",
    npc: "Ajudante",
    item: "Maionese Nula",
    objective:
      "Dê Maionese Nula ao Ajudante na entrada da Cabana da Bruxa e depois leve a Tinta Mágica ao Feiticeiro.",
    reward: "Construções mágicas da fazenda e acesso aos altares",
  },
  {
    id: "quest-any-pirates-wife",
    title: "A Esposa do Pirata",
    kind: "História",
    season: "Qualquer estação",
    npc: "Passarinha",
    objective:
      "Complete a cadeia de trocas: Kent → Gus → Sandy → George → Feiticeiro → Willy → Passarinha.",
    reward: "Receita de Pó de Fada + 5 Nozes Douradas",
    note: "Missão da Ilha Gengibre.",
  },
  {
    id: "special-any-help-wanted-10",
    title: "Completar 10 missões 'Precisa-se de Ajuda'",
    kind: "Pedido Especial",
    season: "Qualquer estação",
    objective:
      "Confira diariamente o quadro do lado de fora do Armazém do Pierre e complete 10 pedidos.",
    reward: "Conquista Autônomo + recompensa por correio",
  },
  {
    id: "special-any-help-wanted-40",
    title: "Completar 40 missões 'Precisa-se de Ajuda'",
    kind: "Pedido Especial",
    season: "Qualquer estação",
    objective:
      "Continue fazendo entregas, pesca, coleta e caça a monstros do quadro até completar 40 pedidos.",
    reward: "Conquista Uma Grande Ajuda + recompensa por correio",
  },
  {
    id: "special-any-community-cleanup",
    title: "Limpeza da Comunidade",
    kind: "Pedido Especial",
    season: "Qualquer estação",
    npc: "Linus",
    item: "20 itens de Lixo",
    objective:
      "Colete 20 itens de lixo enquanto a missão estiver ativa e coloque-os no recipiente da plataforma do trem.",
    reward: "500 ouros + amizade + receita de Sementes de Fibra",
  },
  {
    id: "special-any-biome-balance",
    title: "Equilíbrio do Bioma",
    kind: "Pedido Especial",
    season: "Qualquer estação",
    npc: "Demetrius",
    objective:
      "Pesque 20 peixes do habitat solicitado (rio, lago ou oceano) dentro do prazo.",
    reward: "1.500 ouros + receita do Computador da Fazenda",
  },
];


export const SEASON_HIGHLIGHTS: Record<
  Exclude<Season, "Qualquer estação">,
  { festivals: string[]; prepare: string[] }
> = {
  Primavera: {
    festivals: [
      "Dia 13 — Festival do Ovo",
      "Dias 15–17 — Festival do Deserto",
      "Dia 24 — Dança das Flores",
      "Dias 15–18 — temporada de Amora-silvestre",
    ],
    prepare: [
      "Guardar 1 Couve-flor para o pedido da Jodi (dia 19, ano 1)",
      "No ano 2, guardar Alho-poró para Evelyn e Damasco para Emily",
      "Guardar exemplares de cultivos, coleta e peixes da estação para entregas do quadro do Pierre",
    ],
  },
  Verão: {
    festivals: [
      "Dia 11 — Luau",
      "Dias 12–14 — chance de coletáveis extras na praia",
      "Dias 20–21 — Competição de Truta",
      "Dia 28 — Dança das Medusas-da-Lua",
    ],
    prepare: [
      "Plantar Lúpulo cedo para produzir Pale Ale para Pam",
      "Guardar 1 Melão para Demetrius e 1 Pimenta Picante para George",
      "No ano 2, reservar um Baiacu para a Pesquisa Aquática",
      "Milho atravessa Verão e Outono; pode ser útil plantar cedo",
    ],
  },
  Outono: {
    festivals: [
      "Dias 8–11 — temporada de Amora",
      "Dia 16 — Feira do Vale do Orvalho",
      "Dia 27 — Véspera dos Espíritos",
    ],
    prepare: [
      "Guardar 1 Abóbora para Caroline",
      "Guardar Amaranto para o pedido da Marnie",
      "A partir do Outono do ano 1, conferir o Quadro de Pedidos Especiais toda segunda-feira",
      "Separar bons itens para a exposição da Feira do Vale do Orvalho",
    ],
  },
  Inverno: {
    festivals: [
      "Dia 8 — Festival do Gelo",
      "Dias 12–13 — Festival da Lula",
      "Dias 15–17 — Mercado Noturno",
      "Dia 25 — Festival da Estrela Invernal",
    ],
    prepare: [
      "Pescar e guardar Lula, Albacora e Ófis para missões",
      "Separar 10 Madeiras de Lei para Robin",
      "Aproveitar a estação para Minas, melhorias da fazenda e relacionamentos",
      "Guardar itens de coleta do inverno para Sementes de Inverno e pacotes",
    ],
  },
};

export const AQUATIC_OVERPOPULATION_BY_SEASON: Record<
  Exclude<Season, "Qualquer estação">,
  string[]
> = {
  Primavera: ["Linguado", "Achigã", "Halibute", "Peixe-sol", "Sardinha"],
  Verão: ["Truta Arco-íris", "Atum", "Dourado", "Salmonete", "Tilápia"],
  Outono: ["Salmão Híbrido", "Albacora", "Salmão", "Carpa da Meia-noite"],
  Inverno: ["Lula", "Ófis", "Perca"],
};

export const MARRIAGE_CANDIDATES: MarriageCandidate[] = [
  {
    id: "abigail",
    name: "Abigail",
    birthday: { season: "Outono", day: 13 },
    lovedGifts: [
      "Abóbora",
      "Ametista",
      "Baiacu",
      "Bolo de Chocolate",
      "Compêndio de Monstros",
      "Enguia Picante",
      "Pudim de Banana",
      "Torta de Amoras",
    ],
    giftTip: "Ametista é uma das opções mais práticas quando as Minas já estão abertas.",
  },
  {
    id: "alex",
    name: "Alex",
    birthday: { season: "Verão", day: 13 },
    lovedGifts: ["Café da Manhã Completo", "Jantar de Salmão", "Jack seja ágil, Jack seja parrudo"],
  },
  {
    id: "elliott",
    name: "Elliott",
    birthday: { season: "Outono", day: 5 },
    lovedGifts: ["Bolinhos de Caranguejo", "Lagosta", "Pena de Pato", "Romã", "Sopa Tom Kha", "Tinta de Lula"],
  },
  {
    id: "emily",
    name: "Emily",
    birthday: { season: "Primavera", day: 27 },
    lovedGifts: ["Água-marinha", "Ametista", "Esmeralda", "Jade", "Rubi", "Topázio", "Lã", "Tecido", "Hambúrguer de Sobrevivência", "Ovo de Papagaio"],
    giftTip: "Gemas tornam Emily relativamente fácil de agradar desde o começo das Minas.",
  },
  {
    id: "haley",
    name: "Haley",
    birthday: { season: "Primavera", day: 14 },
    lovedGifts: ["Bolo Rosa", "Coco", "Girassol", "Salada de Frutas"],
    giftTip: "Girassol é uma opção cultivável; Coco fica muito fácil depois de desbloquear o Deserto.",
  },
  {
    id: "harvey",
    name: "Harvey",
    birthday: { season: "Inverno", day: 14 },
    lovedGifts: ["Café", "Óleo de Trufas", "Picles", "Superprato", "Vinho"],
    giftTip: "Café comprado no Saloon costuma ser a alternativa mais simples.",
  },
  {
    id: "leah",
    name: "Leah",
    birthday: { season: "Inverno", day: 23 },
    lovedGifts: ["Bolinho de Papoula", "Mexido de Legumes", "Queijo de Cabra", "Refogado", "Salada", "Trufa", "Vinho"],
    giftTip: "Salada comprada no Saloon é uma opção simples para manter a rotina de presentes.",
  },
  {
    id: "maru",
    name: "Maru",
    birthday: { season: "Verão", day: 10 },
    lovedGifts: [
      "Barra de Irídio",
      "Barra de Ouro",
      "Barra Radioativa",
      "Conjunto de Pilhas",
      "Couve-flor",
      "Couve-flor com Queijo",
      "Diamante",
      "Dispositivo de Anão",
      "Enroladinhos de Pimenta",
      "Morango",
      "Refeição de Mineiro",
      "Torta de Ruibarbo",
    ],
  },
  {
    id: "penny",
    name: "Penny",
    birthday: { season: "Outono", day: 2 },
    lovedGifts: ["Livros", "Areinha", "Bolinho de Papoula", "Diamante", "Esmeralda", "Melão", "Papoula", "Prato de Raízes", "Prato Vermelho", "Sopa Tom Kha"],
    giftTip: "Melão e Papoula são boas opções para preparar durante o Verão para o aniversário no Outono.",
  },
  {
    id: "sam",
    name: "Sam",
    birthday: { season: "Verão", day: 17 },
    lovedGifts: ["Fruto do Cacto", "Olho de Tigre", "Pão de Ácer", "Pizza"],
    giftTip: "Pizza pode ser comprada no Saloon e funciona bem para acelerar a amizade.",
  },
  {
    id: "sebastian",
    name: "Sebastian",
    birthday: { season: "Inverno", day: 10 },
    lovedGifts: ["Lágrima Congelada", "Obsidiana", "Ovo de Sapo", "Ovo Nulo", "Sashimi", "Sopa de Abóbora"],
    giftTip: "Sashimi é uma opção muito prática depois de aprender a receita.",
  },
  {
    id: "shane",
    name: "Shane",
    birthday: { season: "Primavera", day: 20 },
    lovedGifts: ["Cerveja", "Enroladinhos de Pimenta", "Pimenta Picante", "Pizza"],
    giftTip: "Pizza e Cerveja podem ser compradas no Saloon.",
  },
];

export const FRIENDSHIP_MILESTONES = [
  { key: "2-hearts", label: "Chegar a 2 corações" },
  { key: "4-hearts", label: "Chegar a 4 corações" },
  { key: "6-hearts", label: "Chegar a 6 corações" },
  { key: "8-hearts", label: "Chegar a 8 corações" },
  { key: "bouquet", label: "Entregar o Buquê" },
  { key: "10-hearts", label: "Chegar a 10 corações" },
  { key: "pendant", label: "Entregar o Pingente de Sereia" },
  { key: "married", label: "Realizar o casamento" },
  { key: "14-hearts", label: "Chegar a 14 corações após o casamento" },
] as const;

export const FRIENDSHIP_PROGRESS_IDS = MARRIAGE_CANDIDATES.flatMap((candidate) =>
  FRIENDSHIP_MILESTONES.map((milestone) =>
    `friendship-${candidate.id}-${milestone.key}`,
  ),
);

export const GUIDE_TASK_IDS = QUESTS.map((quest) => quest.id);
