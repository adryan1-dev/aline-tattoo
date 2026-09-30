// Fonte única dos textos. Fatos vindos do site publicado pela artista (conferidos em 29/09/2026).
// Sem preços, sem prazos de retorno e sem prova social: nada disso foi confirmado.

export const site = {
  name: 'Arte Que Olha',
  artist: 'Aline Lopes',
  city: 'Belo Horizonte',
  region: 'MG',
  instagramUser: 'artequeolha',
  instagramUrl: 'https://www.instagram.com/artequeolha/',
  whatsapp: '5531994664504',
  ctaLabel: 'Iniciar meu projeto',
  lema: ['Orgânico', 'Onírico', 'Onipresente'],
  title: 'Arte Que Olha · Tatuagem autoral em Belo Horizonte | Aline Lopes',
  description:
    'Tatuagem autoral em Belo Horizonte por Aline Lopes. Projetos criados a partir da sua ideia, com simbolismo e traço preciso. Conte sua ideia e comece seu projeto.',
};

export const nav = [
  { href: '#trabalhos', label: 'Trabalhos' },
  { href: '#processo', label: 'Processo' },
  { href: '#perguntas', label: 'Perguntas' },
];

export const hero = {
  h1: 'Tatuagens para quem vê além.',
  sub: 'Tatuagem autoral em Belo Horizonte. Cada desenho nasce da sua ideia.',
  seeWork: 'Ver trabalhos',
  imgAlt: 'Retrato em preto e branco de Aline Lopes, com a mão sobre o rosto e uma tatuagem floral no peito.',
};

export const work = {
  title: 'Trabalhos',
  lead: 'Uma seleção de projetos autorais. Mais registros no Instagram.',
  more: 'Ver mais no Instagram',
};

export const artist = {
  title: 'A artista',
  paragraphs: [
    'Aline desenha desde sempre: paredes, cadernos, o que estivesse ao alcance. Formada em Design de Interiores pela UEMG, encontrou na tatuagem um jeito de unir desenho, composição e significado numa linguagem íntima e permanente.',
    'Seu trabalho parte de símbolos, arquétipos e imagens do universo onírico. Cada projeto é desenhado para uma pessoa e para a sua história.',
  ],
  quote: 'Para um bom observador, uma arte basta.',
};

export const process = {
  title: 'Do mundo das ideias ao mundo real',
  imgAlt: 'Aline Lopes tatuando o braço de uma cliente em seu estúdio, com luminária articulada e bancada preparada.',
  steps: [
    { title: 'Conversa', text: 'Virtual ou presencial. Você me conta a ideia, as referências e onde imagina a tatuagem.' },
    { title: 'Criação', text: 'Desenvolvo a composição a partir da nossa conversa. Referência é ponto de partida, não cópia.' },
    { title: 'Aprovação', text: 'Você recebe a arte final antes da sessão. Os ajustes pontuais acontecem aqui.' },
    {
      title: 'Sessão',
      text: 'Sem pressa e com pausas quando precisar. Preparo pessoalmente o decalque, a bancada e o ambiente, seguindo os protocolos de biossegurança.',
    },
    {
      title: 'Depois',
      text: 'Você recebe as orientações de cuidado, explicadas e impressas, e um ensaio fotográfico da tatuagem sem custo adicional. Retoque gratuito em até 60 dias, se necessário.',
    },
  ],
};

export const project = {
  title: 'Seu projeto começa aqui',
  lead: 'Conte a ideia do jeito que ela estiver: uma palavra, uma sensação ou algumas referências já bastam.',
  submit: 'Continuar no WhatsApp',
  refsNote: 'Referências e uma foto da região a tatuar podem ser enviadas direto na conversa do WhatsApp.',
  moreSummary: 'Quer contar mais? (opcional)',
  sizes: ['Até 10 cm', 'De 10 a 20 cm', 'Mais de 20 cm', 'Ainda não sei'],
  timings: ['Próximo mês', 'Data específica', 'Ainda sem previsão'],
  status: {
    opened: 'Sua mensagem foi aberta no WhatsApp. Ela só chega à Aline quando você tocar em enviar por lá.',
    reopen: 'Abrir de novo',
    copy: 'Copiar mensagem',
    copied: 'Mensagem copiada.',
    copyFail: 'Não foi possível copiar. Selecione o texto abaixo e copie manualmente.',
    instagram: 'Chamar no Instagram',
    blocked: 'Se o WhatsApp não abriu, use uma das opções abaixo.',
  },
  errors: {
    summary: 'Revise os campos abaixo:',
    idea: 'Conte sua ideia em pelo menos algumas palavras.',
    body: 'Diga em qual região do corpo você imagina a tatuagem.',
    size: 'Escolha um tamanho aproximado.',
    name: 'Como você gostaria de ser chamado(a)?',
  },
};

export type Faq = { q: string; a: string[]; featured?: boolean };

export const faqTitle = 'Perguntas essenciais';

export const faq: Faq[] = [
  {
    featured: true,
    q: 'Quanto custa uma tatuagem?',
    a: [
      'Cada projeto é único e o valor considera tamanho, localização no corpo, nível de detalhe, complexidade da composição e tempo estimado de execução.',
      'Por isso não trabalho com tabela fixa. A partir das informações que você enviar, apresento uma proposta personalizada.',
    ],
  },
  {
    featured: true,
    q: 'Como funciona o orçamento?',
    a: [
      'O primeiro passo é contar a sua ideia, com o máximo de informações que puder. Analiso pessoalmente cada solicitação e entro em contato pelo WhatsApp para conversarmos e alinharmos os próximos passos.',
      'O orçamento é individual e não gera compromisso de agendamento.',
    ],
  },
  {
    featured: true,
    q: 'Quais são as formas de pagamento?',
    a: [
      'Pix, cartão de débito ou cartão de crédito, com parcelamento em até 10 vezes.',
      'Para reservar uma data, é necessário o pagamento de um sinal de 30% do valor total.',
    ],
  },
  {
    featured: true,
    q: 'Onde fica o estúdio?',
    a: [
      'No bairro Funcionários, região central de Belo Horizonte, em um ambiente privado, preparado para oferecer conforto, tranquilidade e segurança.',
      'Há estacionamentos por perto e sempre tem alguém para receber você. O endereço completo e as orientações de chegada são enviados após o agendamento.',
    ],
  },
  {
    featured: true,
    q: 'Posso tatuar mesmo sem ter a ideia totalmente definida?',
    a: [
      'Sim. Você pode chegar com uma palavra, um conceito, uma sensação, uma história ou algumas referências.',
      'Parte do meu trabalho é transformar ideias ainda abstratas em uma composição visual coerente e autoral.',
    ],
  },
  {
    featured: true,
    q: 'E se eu não aguentar tatuar em uma única sessão?',
    a: [
      'Não existe necessidade de ultrapassar o seu limite. Projetos maiores ou mais detalhados podem ser divididos em duas ou mais sessões, conforme o tamanho, a região do corpo e a sua tolerância.',
      'O mais importante é preservar a qualidade do trabalho e o seu conforto.',
    ],
  },
  {
    featured: true,
    q: 'Tenho medo de tatuagem ou da dor. Posso conversar sobre isso antes?',
    a: [
      'Claro. Cada pessoa vive a tatuagem de um jeito, e não existe expectativa de que você precise simplesmente “aguentar”.',
      'Se há insegurança sobre dor, processo, tamanho, local ou resultado, conte no formulário. Isso me ajuda a conduzir a sua experiência da melhor maneira.',
    ],
  },
  {
    q: 'Posso levar acompanhante?',
    a: [
      'Para preservar a concentração e manter o ambiente tranquilo, indico vir sozinho. Mas é permitido um acompanhante, que pode aguardar na recepção durante o procedimento.',
      'Para menores de idade, a presença do responsável durante toda a sessão é obrigatória.',
    ],
  },
  {
    q: 'Posso escolher exatamente como será a arte?',
    a: [
      'A tatuagem é desenvolvida a partir da sua ideia, das referências e das conversas que temos. Meu trabalho é transformar isso em uma composição autoral, respeitando a proposta do projeto e a minha linguagem artística. Não trabalho apenas reproduzindo uma imagem de referência.',
      'O resultado busca equilíbrio entre a sua intenção e a minha assinatura.',
    ],
  },
  {
    q: 'Posso enviar uma referência de outra tatuagem?',
    a: [
      'Claro. Referências são bem-vindas e ajudam a entender estilo, composição, textura, proporção ou movimento.',
      'Elas são um ponto de partida: crio uma composição original, desenvolvida para você.',
    ],
  },
  {
    q: 'Posso alterar a arte depois de pronta?',
    a: [
      'Antes da sessão você recebe a arte final para aprovação. Se algum ajuste pontual for necessário, conversamos e fazemos as alterações antes da tatuagem.',
      'Por isso é importante compartilhar expectativas e referências já no primeiro contato.',
    ],
  },
  {
    q: 'Quanto tempo demora para fazer uma tatuagem?',
    a: [
      'Depende do projeto. Tamanho, localização, nível de detalhe, complexidade e o comportamento da pele durante a sessão influenciam a duração.',
      'No orçamento consigo fazer uma estimativa mais precisa e orientar se o projeto será feito em uma ou mais sessões.',
    ],
  },
  {
    q: 'Preciso saber exatamente o tamanho antes de pedir o orçamento?',
    a: [
      'Não. Se você não souber a medida ideal, indique uma ideia aproximada. Durante o projeto avaliamos proporção, localização e composição para encontrar uma dimensão que funcione bem, esteticamente e na leitura da tatuagem ao longo do tempo.',
    ],
  },
  {
    q: 'Como devo me preparar para a sessão?',
    a: [
      'No dia anterior, descanse bem, alimente-se normalmente e mantenha uma boa hidratação. No dia, faça uma refeição antes de vir e use roupas confortáveis que deem acesso fácil à região que será tatuada.',
      'Evite álcool e não esteja com a pele bronzeada. Planeje o período de cicatrização com antecedência se pretende entrar em mar, rio, cachoeira ou se expor ao sol por muitas horas.',
    ],
  },
  {
    q: 'E depois da tatuagem?',
    a: [
      'Ao final da sessão, explico pessoalmente todos os cuidados para a cicatrização e você recebe as orientações impressas. Durante esse período, fico disponível para tirar dúvidas sobre os cuidados.',
    ],
  },
  {
    q: 'Vocês fazem retoque?',
    a: [
      'Se for necessário algum retoque após a cicatrização completa, avaliamos o trabalho individualmente. Em até 60 dias o retoque é gratuito.',
    ],
  },
  {
    q: 'Posso tatuar sobre uma cicatriz ou outra tatuagem?',
    a: [
      'Depende da condição da pele e do local. No orçamento, avalio a região pelas fotos enviadas e indico se é possível trabalhar sobre ela.',
      'Em alguns casos pode ser necessário aguardar um período maior antes de tatuar sobre uma cicatriz recente ou uma tatuagem ainda em cicatrização.',
    ],
  },
  {
    q: 'Posso fazer uma tatuagem em cima de outra?',
    a: [
      'Se a intenção for cobrir uma tatuagem existente, envie uma foto nítida da região. Avalio o desenho, a densidade da tinta, o tamanho e as possibilidades de cobertura dentro do meu estilo.',
      'Nem toda tatuagem pode ser coberta mantendo o resultado desejado, então cada caso é analisado individualmente.',
    ],
  },
  {
    q: 'Como faço para agendar minha sessão?',
    a: [
      'Depois da aprovação do orçamento, conversamos sobre disponibilidade e encontramos uma data adequada para o projeto. A reserva é confirmada mediante sinal, conforme as condições informadas no agendamento.',
    ],
  },
  {
    q: 'Você atende projetos personalizados?',
    a: [
      'Sim. Meu trabalho é voltado principalmente para projetos autorais e personalizados. Quanto mais aberta a conversa sobre sua ideia, referências e expectativas, mais espaço existe para uma tatuagem com identidade própria.',
    ],
  },
];

export const closing = {
  title: 'Tem uma ideia? Vamos dar forma a ela.',
  location: 'Belo Horizonte, MG',
};
