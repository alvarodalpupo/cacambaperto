/* ============ CONFIGURAÇÃO ============
   Depois de mudar qualquer coisa aqui, rode "node build.js" para gerar o site de novo na pasta docs/.
   1. No Stripe, crie um Payment Link com preço recorrente de R$ 50,00/mês (BRL).
   2. Cole o link abaixo (ex.: "https://buy.stripe.com/abc123").
   3. Quando uma empresa pagar, coloque o id dela na lista DESTAQUES (o id é a última parte do endereço da página da empresa, ex.: cacambaperto.com.br/cascavel/entumix/ → "entumix"). */
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_14A8wQ07U6Sb2YQ27cdIA02";
const PRECO_DESTAQUE = "R$ 50";
const DESTAQUES = [ /* ex.: "entumix", "joinville-cacambas" */ ];
/* WhatsApp que recebe os pedidos de cadastro de empresas novas, só números com DDD (ex.: "45999990000"). */
const CONTATO_WHATSAPP = "45999524094";

const CIDADES = {
  "cascavel":          { nome:"Cascavel",          uf:"PR", regiao:"Oeste do Paraná" },
  "toledo":            { nome:"Toledo",            uf:"PR", regiao:"Oeste do Paraná" },
  "foz-do-iguacu":     { nome:"Foz do Iguaçu",     uf:"PR", regiao:"Oeste do Paraná" },
  "francisco-beltrao": { nome:"Francisco Beltrão", uf:"PR", regiao:"Sudoeste do Paraná" },
  "pato-branco":       { nome:"Pato Branco",       uf:"PR", regiao:"Sudoeste do Paraná" },
  "guarapuava":        { nome:"Guarapuava",        uf:"PR", regiao:"Centro-Sul do Paraná" },
  "ponta-grossa":      { nome:"Ponta Grossa",      uf:"PR", regiao:"Campos Gerais" },
  "maringa":           { nome:"Maringá",           uf:"PR", regiao:"Norte do Paraná" },
  "londrina":          { nome:"Londrina",          uf:"PR", regiao:"Norte do Paraná" },
  "chapeco":           { nome:"Chapecó",           uf:"SC", regiao:"Oeste catarinense" },
  "joinville":         { nome:"Joinville",         uf:"SC", regiao:"Norte catarinense" }
};

/* Centro aproximado de cada cidade, usado pelo botão "Usar minha localização" */
const COORDS = {
  "cascavel":[-24.9555,-53.4552], "toledo":[-24.7246,-53.7412], "foz-do-iguacu":[-25.5163,-54.5854],
  "francisco-beltrao":[-26.0817,-53.0535], "pato-branco":[-26.2295,-52.6716], "guarapuava":[-25.3902,-51.4623],
  "ponta-grossa":[-25.0916,-50.1668], "maringa":[-23.4205,-51.9333], "londrina":[-23.3045,-51.1696],
  "chapeco":[-27.1004,-52.6152], "joinville":[-26.3045,-48.8487]
};

const CATEGORIAS = {
  cacamba:      { nome: "Caçamba estacionária", curto: "Caçambas", desc: "Caçambas de entulho entregues na obra e retiradas cheias. A escolha mais comum para reformas e construções." },
  mini:         { nome: "Mini entulho e tambores", curto: "Mini entulho", desc: "Tambores e pequenos volumes para reformas rápidas, quando uma caçamba inteira é grande demais." },
  terraplanagem:{ nome: "Terraplanagem", curto: "Terraplanagem", desc: "Movimentação de terra, limpeza de terreno e preparo do solo antes da obra." },
  reciclagem:   { nome: "Reciclagem e gestão de resíduos", curto: "Reciclagem", desc: "Usinas e empresas que recebem, reciclam e dão destino correto aos resíduos de construção (RCC)." }
};

/* Cascavel: descrições completas */
const EMPRESAS = [
  { id:"entumix", nome:"Entumix Caçambas", cat:"cacamba", tel:"(45) 99155-3233", end:"R. Recife, 1340", bairro:"Centro",
    resumo:"Locação de caçambas de entulho com base no Centro de Cascavel.",
    desc:"A Entumix Caçambas aluga caçambas estacionárias para obras, reformas e limpezas de terreno. Fica na região central da cidade, o que facilita a entrega em bairros próximos ao Centro." },
  { id:"dcp", nome:"DCP Entulho Cascavel", cat:"cacamba", tel:"(45) 99900-6049", end:"R. Francisco Beltrão, 750", bairro:"Pacaembu",
    resumo:"Caçambas de entulho com entrega e retirada agendadas, no Pacaembu.",
    desc:"A DCP Entulho trabalha com locação de caçambas para entulho de obra e reforma, com entrega e retirada combinadas por telefone ou WhatsApp. A base fica no bairro Pacaembu." },
  { id:"cacambas-cascavel", nome:"Caçambas Cascavel", cat:"cacamba", tel:"(45) 99942-0021", end:"R. Venezuela, 496", bairro:"Pacaembu",
    resumo:"Locação de caçambas de entulho na R. Venezuela, Pacaembu.",
    desc:"A Caçambas Cascavel aluga caçambas estacionárias para obras residenciais e comerciais. Atende a partir do bairro Pacaembu, na zona leste da cidade." },
  { id:"lapa", nome:"Lapa Locações", cat:"cacamba", tel:"(45) 99976-0350", fixo:"(45) 3223-2531", end:"R. da Lapa, 654", bairro:"Maria Luíza",
    resumo:"Caçambas de entulho e serviços de terraplanagem, no Maria Luíza.",
    desc:"A Lapa Locações une locação de caçambas e terraplanagem, o que ajuda quem precisa limpar o terreno e tirar o entulho com a mesma empresa. Fica no bairro Maria Luíza." },
  { id:"jvv", nome:"JVV Caçambas", cat:"cacamba", tel:"(45) 99828-4363", end:"R. São Francisco de Assis", bairro:"Pioneiros Catarinenses",
    resumo:"Aluguel de caçambas de entulho na região oeste de Cascavel.",
    desc:"A JVV Caçambas aluga caçambas de entulho para obras e reformas. Fica no bairro Pioneiros Catarinenses e costuma atender a região oeste da cidade." },
  { id:"possebon", nome:"Possebon Locação de Caçambas", cat:"cacamba", tel:"(45) 99808-0301", end:"R. Coriolano Ferreira Santiago, 513", bairro:"Santa Felicidade",
    resumo:"Locação de caçambas de entulho no Santa Felicidade, zona sul.",
    desc:"A Possebon trabalha com locação de caçambas estacionárias para entulho. A base fica no bairro Santa Felicidade, na zona sul de Cascavel." },
  { id:"euro-entulho", nome:"Euro Entulho Caçambas", cat:"cacamba", tel:"(45) 99101-7781", end:"R. Krahos, 445", bairro:"Santa Cruz",
    resumo:"Caçambas de entulho para obras e reformas, no Santa Cruz.",
    desc:"A Euro Entulho aluga caçambas para retirada de entulho de construção e reforma. Fica no bairro Santa Cruz, na zona oeste." },
  { id:"barbosa", nome:"Barbosa Entulho", cat:"cacamba", tel:"(45) 3227-8037", end:"R. Domiciano Theobaldo Bresolin, 411", bairro:"São Cristóvão",
    resumo:"Locação de caçambas de entulho no São Cristóvão.",
    desc:"A Barbosa Entulho aluga caçambas estacionárias para obras e reformas. Fica no bairro São Cristóvão, na região norte da cidade." },
  { id:"pega-entulho", nome:"Pega Entulho", cat:"cacamba", tel:"(45) 3037-5060", end:"R. Carlos de Carvalho, 2345", bairro:"Parque São Paulo",
    resumo:"Locação de caçambas de entulho, endereço no Parque São Paulo.",
    desc:"A Pega Entulho oferece locação de caçambas para entulho de obra. O endereço cadastrado fica no bairro Parque São Paulo." },
  { id:"vai-fora", nome:"Caçambas Vai Fora", cat:"cacamba", tel:"(45) 3096-5313", end:"R. Acácia, 109", bairro:"Parque Verde",
    resumo:"Locação de caçambas de entulho no Parque Verde.",
    desc:"A Caçambas Vai Fora aluga caçambas estacionárias para entulho. Fica no bairro Parque Verde, na zona oeste de Cascavel." },
  { id:"lokavel", nome:"Mini Entulhos Lokavel", cat:"mini", tel:"(45) 99800-5000", end:"Av. Barão do Rio Branco", bairro:"São Cristóvão",
    resumo:"Tambores para pequenos volumes de entulho, no São Cristóvão.",
    desc:"A Lokavel aluga tambores para entulho, uma opção para reformas pequenas em que uma caçamba inteira ocuparia espaço demais na calçada. Atende a partir do São Cristóvão." },
  { id:"sos-mini", nome:"SOS Mini Entulhos", cat:"mini", tel:"(45) 99903-0695", end:"R. Márcia Regina, 236", bairro:"Alto Alegre",
    resumo:"Retirada de pequenos volumes de entulho, no Alto Alegre.",
    desc:"A SOS Mini Entulhos faz a retirada de pequenos volumes de entulho para reformas e serviços rápidos. Fica no bairro Alto Alegre." },
  { id:"box-terraplanagem", nome:"BOX Terraplanagem", cat:"terraplanagem", tel:"(45) 99956-3374", end:"R. Domiciano Theobaldo Bresolin", bairro:"São Cristóvão",
    resumo:"Terraplanagem em Cascavel e região, no São Cristóvão.",
    desc:"A BOX Terraplanagem faz movimentação de terra e preparo de terrenos em Cascavel e cidades da região. A base fica no bairro São Cristóvão." },
  { id:"construtiva", nome:"Construtiva Terraplanagem", cat:"terraplanagem", tel:"(45) 99925-3021", end:"R. Safira, 186", bairro:"Esmeralda",
    resumo:"Terraplanagem para obras pequenas e grandes, no Esmeralda.",
    desc:"A Construtiva Terraplanagem atende obras de diferentes portes com serviços de terraplanagem e preparo de terreno. Fica no bairro Esmeralda." },
  { id:"domingues", nome:"Terraplanagem Domingues", cat:"terraplanagem", tel:"(42) 99836-0522", end:"R. Ponta Grossa", bairro:"Cascavel",
    resumo:"Serviços de terraplanagem, com endereço na R. Ponta Grossa.",
    desc:"A Terraplanagem Domingues presta serviços de terraplanagem em Cascavel. O telefone cadastrado usa o DDD 42." },
  { id:"antonio-teixeira", nome:"Terraplanagem Antonio Teixeira", cat:"terraplanagem", tel:"(45) 99928-0932", end:"R. Cabo Fidélis Batista de Aguiar, 1056", bairro:"Santa Felicidade",
    resumo:"Máquinas e terraplanagem no Santa Felicidade.",
    desc:"A Terraplanagem Antonio Teixeira trabalha com máquinas para movimentação de terra e preparo de terreno. Fica no bairro Santa Felicidade." },
  { id:"carlinho", nome:"Carlinho Terraplanagem", cat:"terraplanagem", tel:"(45) 99924-9052", end:"R. Frei Maximiliano Kolbe, 151", bairro:"Pioneiros Catarinenses",
    resumo:"Pequeno prestador de terraplanagem no Pioneiros Catarinenses.",
    desc:"Carlinho Terraplanagem é um prestador local de serviços de terraplanagem, com base no bairro Pioneiros Catarinenses." },
  { id:"future-reciclagem", nome:"Future Reciclagem Inteligente", cat:"reciclagem", tel:"(45) 98803-0034", end:"Estrada Rural Colônia Barreiros", bairro:"São João d'Oeste",
    resumo:"Usina de reciclagem de resíduos da construção civil.",
    desc:"A Future Reciclagem é uma usina que recebe resíduos da construção civil e os transforma em agregado reciclado para novas obras. Fica na Colônia Barreiros, no distrito de São João d'Oeste." },
  { id:"parana-ambiental", nome:"Paraná Ambiental", cat:"reciclagem", tel:"(45) 3039-4060", end:"R. Mato Grosso, 613", bairro:"São Cristóvão",
    resumo:"Gestão de resíduos e aterro industrial para empresas.",
    desc:"A Paraná Ambiental faz gestão de resíduos para empresas, com escritório no São Cristóvão e aterro industrial na região de Cascavel." }
].map(e => ({ ...e, cidade:"cascavel" }));

/* Demais cidades: [cidade, nome, categoria, telefone, endereço, bairro] */
const NOVAS = [
  ["toledo","Dutra Entulhos Caçambas","cacamba","(45) 99993-9795","Av. Maripá, 2575","Pioneira"],
  ["toledo","Jomalai Soluções Ambientais","cacamba","(45) 99854-1444","Av. Min. Cirne Lima, 2116","Jardim Coopagro"],

  ["foz-do-iguacu","Eco Conte Caçambas","cacamba","(45) 99950-2391","R. Angelim Favassa, 1089","Jardim Universitário II"],
  ["foz-do-iguacu","Besonin Caçambas","cacamba","(45) 99838-8627","Av. Safira, 1035","Bourbon"],
  ["foz-do-iguacu","ART Caçambas","cacamba","(45) 99999-2526","R. Novo Hamburgo, 246","Alvorada"],
  ["foz-do-iguacu","Foz Caçambas","cacamba","(45) 99807-6474","Av. Araucária, 7185","Três Bandeiras"],
  ["foz-do-iguacu","MB Caçamba","cacamba","(45) 98823-6333","R. Guarujá","Lancaster V"],

  ["francisco-beltrao","Disk Entulho Francisco Beltrão","cacamba","(46) 3523-1730","Av. Getúlio Vargas, 75","Cristo Rei"],
  ["francisco-beltrao","Transentulho","cacamba","(46) 3523-1471","R. Santa Marta, 121","Cristo Rei"],

  ["pato-branco","Alfa Entulhos","cacamba","(46) 99135-6430","BR-158","Bela Vista"],
  ["pato-branco","Entulhos Patinho","cacamba","(46) 3225-3633","R. Tocantins, 178","Cristo Rei"],
  ["pato-branco","Bertol Bruck","cacamba","(46) 99101-5459","BR-158","Menino Deus"],

  ["guarapuava","Disk Entulho Guarapuava","cacamba","(42) 98827-8987","R. João Pessoa, 159","Morro Alto"],
  ["guarapuava","GuaraEntulhos","cacamba","(42) 98880-5059","R. João Gelinski, 132","Conradinho"],
  ["guarapuava","Biscaia Caçambas","cacamba","(42) 99936-2468","R. Inácio Karpinski, 1102","Bonsucesso"],
  ["guarapuava","Disk Entulho Rato","cacamba","(42) 99811-8816","R. Dep. Bernardo Guimarães Ribas Carli, 3471","Vila Carli"],
  ["guarapuava","SOS Mini Entulhos Guarapuava","mini","(42) 98415-6387","R. Monsenhor Célso Itiberê da Cunha, 942","Conradinho"],

  ["ponta-grossa","Giba Entulho","cacamba","(42) 98850-5337","Estr. José Kalinoski, 3370","Contorno"],
  ["ponta-grossa","Transponta Caçambas e Containers","cacamba","(42) 3223-7426","R. Júlio de Castilhos, 414","Centro"],
  ["ponta-grossa","Trans Entulho Caçambas e Containers","cacamba","(42) 99822-2222","R. Hercílio Arnaldino Rosa, 32","Olarias"],
  ["ponta-grossa","JTG Caçamba para Entulho","cacamba","(42) 99992-8047","","Boa Vista"],
  ["ponta-grossa","Disk Entulho DM","cacamba","(42) 3225-6000","","Uvaranas"],

  ["maringa","Disk Entulho Locaçamba Cometa","cacamba","(44) 3026-1544","Av. Carmen Miranda, 2135","Cidade Alta"],
  ["maringa","Líder Caçambas Maringá","cacamba","(44) 99111-9929","Av. São Judas Tadeu, 3416","Jardim Oriental"],
  ["maringa","Canção Disk Entulho","cacamba","(44) 3228-1300","Av. Dona Sophia Rasgulaeff, 1461","Jardim Alvorada"],
  ["maringa","Disk Entulho P. Silva","cacamba","(44) 99878-4963","R. Pioneiro Lourival Ramos Favoretto, 128","Jardim Dias II"],
  ["maringa","Disk Entulho Limpa Tudo","cacamba","(44) 99729-8565","R. Mendonza, 74","Vila Morangueira"],

  ["londrina","Locaçamba Locação de Caçambas","cacamba","(43) 3337-8000","R. Carmela Dutra, 354","Jardim Morumbi"],
  ["londrina","Líder Caçambas Londrina","cacamba","(43) 3337-1242","","Jardim Morumbi"],
  ["londrina","Caçamba Londrina","cacamba","(43) 98418-3368","Av. Santa Mônica, 1095","Ideal"],
  ["londrina","Caçambão","cacamba","(43) 3341-6161","Av. Chepli Tanus Daher, 749","Jardim Acapulco"],
  ["londrina","Caçambas do Renato","cacamba","(43) 99153-2332","R. Mauritânia, 135","Ouro Verde"],
  ["londrina","Servnorte Caçambas e Terraplenagem","cacamba","(43) 3329-8900","Rod. Carlos João Strass, 4301","Heimtal"],

  ["chapeco","Recicle Aluguel de Caçamba","cacamba","(49) 98416-4724","SC-283, km 8","Linha Marcon"],
  ["chapeco","Disk Entulho Oeste","cacamba","(49) 3329-6355","R. Dr. Rubens Carvalho Rauen, s/n","Monte Alegre"],
  ["chapeco","Disk Desentulho","cacamba","(49) 3328-8229","R. Atlanta, 170","Passo dos Fortes"],
  ["chapeco","Disk Mini Entulho Chapecó","mini","(49) 98889-8282","Av. Nereu Ramos, 1956","Seminário"],

  ["joinville","Joinville Caçambas","cacamba","(47) 98866-5961","R. Cerro Azul, 670","Nova Brasília"],
  ["joinville","Rei dos Entulhos","cacamba","(47) 99200-5171","R. Charles Eduardo Zacarias da Rosa, 441","Nova Brasília"],
  ["joinville","Eixo Sul Caçambas","cacamba","(47) 3466-2909","R. Guilherme Krueger, 273","Floresta"],
  ["joinville","G&S Caçambas","cacamba","(47) 99954-4542","R. Ubirajara Araújo, 127","Aventureiro"],
  ["joinville","Facilita Caçambas de Entulho","cacamba","(47) 3025-5009","R. Mato Grosso do Sul, 143","Parque Guarani"],
  ["joinville","Entulhos Coelho","cacamba","(47) 3028-7900","R. Guatemala, 64","Itaum"],
  ["joinville","Fênix Caçamba de Entulho","cacamba","(47) 3028-1360","R. Laurentino, 153","Atiradores"],
  ["joinville","Caçamba de Entulho do Sul","cacamba","(47) 99605-8507","R. Osmar Galdino Fagundes, 219","Paranaguamirim"]
];

const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/&/g,"e").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const CORES = ["#E37B12","#2F6FB3","#C23B2E","#3D8B4F","#E3A008","#7A4FB0","#1F8A8A","#B5542A","#4A5C8C","#6B8E23"];

NOVAS.forEach(([cidade,nome,cat,tel,end,bairro]) => {
  const c = CIDADES[cidade];
  let id = slug(nome); if (EMPRESAS.some(e => e.id === id)) id += "-" + cidade;
  const servico = cat === "mini" ? "retirada de pequenos volumes de entulho e aluguel de tambores" : "locação de caçambas de entulho";
  EMPRESAS.push({ id, nome, cat, tel, end, bairro, cidade,
    resumo: (cat === "mini" ? "Mini entulho e tambores" : "Caçambas de entulho") + " no bairro " + bairro + ".",
    desc: `${nome} trabalha com ${servico} em ${c.nome}/${c.uf}. O endereço cadastrado fica no bairro ${bairro}${end ? ", em " + end : ""}.` });
});
EMPRESAS.forEach((e,i) => { e.cor = CORES[i % CORES.length]; e.destaque = DESTAQUES.includes(e.id); });


module.exports = { STRIPE_PAYMENT_LINK, PRECO_DESTAQUE, DESTAQUES, CONTATO_WHATSAPP, CIDADES, COORDS, CATEGORIAS, EMPRESAS };
