import imgDestaque from '../assets/images/noticia360_destaque.svg';
import imgMercado from '../assets/images/mercado_financeiro_1790596446455.jpg';
import imgPorto from '../assets/images/porto_maputo_1790596487365.jpg';
import imgAntena from '../assets/images/antena_telecom_1790596555051.jpg';
import imgEnergia from '../assets/images/energia_solar_1790596506741.jpg';
import imgFutebol from '../assets/images/futebol_estagio_1790596459983.jpg';
import imgAgricultura from '../assets/images/agricultura_rural_1790596520843.jpg';
import imgRotas from '../assets/images/rotas_maritimas_1790596534786.jpg';
import imgPagamento from '../assets/images/pagamento_movel_1790596472967.jpg';
import imgAtletismo from '../assets/images/atletismo_ouro_1790596571746.jpg';

export interface Noticia {
  id: string;
  titulo: string;
  categoria: 'Moçambique' | 'Mundo' | 'Desporto' | 'Tecnologia' | 'Economia';
  data: string;
  hora: string;
  tempoLeitura: string;
  autor: string;
  resumo: string;
  conteudo: string[];
  imagem: string;
  imagemAlt: string;
  destaque?: boolean;
  tags: string[];
}

export const CATEGORIAS = [
  'Todas',
  'Moçambique',
  'Mundo',
  'Desporto',
  'Tecnologia',
  'Economia',
] as const;

export type CategoriaType = (typeof CATEGORIAS)[number];

export const noticias: Noticia[] = [
  {
    id: 'n1',
    destaque: true,
    titulo: 'Moçambique prepara novas iniciativas para impulsionar a transformação digital',
    categoria: 'Moçambique',
    data: '28 Setembro 2026',
    hora: '09:15',
    tempoLeitura: '3 min de leitura',
    autor: 'Redacção Notícia360 • Maputo',
    resumo: 'O Governo e parceiros estratégicos anunciaram hoje um pacote estruturante para expandir a conectividade de banda larga, acelerar a digitalização de serviços públicos e capacitar milhares de jovens no sector tecnológico em todo o país.',
    conteudo: [
      'O Governo de Moçambique, em coordenação com entidades do sector privado e parceiros multilaterais de cooperação, oficializou nesta segunda-feira uma ambiciosa estratégia nacional voltada para a modernização do ecossistema tecnológico do país.',
      'O plano contempla a instalação acelerada de anéis de fibra óptica conectando capitais provinciais a distritos prioritários, além de pontos de acesso Wi-Fi comunitário gratuito em escolas e centros comunitários de saúde.',
      'Segundo porta-vozes do Ministério dos Transportes e Comunicações, a meta é quadruplicar a penetração de internet de alta velocidade até o final da década, reduzindo barreiras de acesso e dinamizando o surgimento de startups inovadoras locais nas áreas de agrotech, fintech e educação digital.',
      'Adicionalmente, será lançado o programa "Futuro Digital", que oferecerá bolsas de formação técnica intensiva em programação, ciência de dados e cibersegurança para jovens em todas as províncias moçambicanas.'
    ],
    imagem: imgDestaque,
    imagemAlt: 'Logótipo Notícia360 — Informação rápida. O mundo em foco.',
    tags: ['Inovação', 'Governo', 'Conectividade', 'Juventude']
  },
  {
    id: 'n2',
    titulo: 'Novo movimento no mercado financeiro chama atenção dos investidores',
    categoria: 'Economia',
    data: '28 Setembro 2026',
    hora: '12:30',
    tempoLeitura: '2 min de leitura',
    autor: 'Economia & Negócios',
    resumo: 'O mercado de capitais e obrigações do tesouro regista forte apetite de fundos institucionais após a divulgação de balanços positivos e estabilização da taxa de câmbio.',
    conteudo: [
      'Os principais indicadores do mercado financeiro regional abriram a semana com variações positivas, impulsionados pela entrada de novos fluxos de capitais focados em obrigações corporativas sustentáveis.',
      'Analistas destacam que a disciplina fiscal e o controlo consistente das metas inflacionárias têm transmitido elevada confiança aos gestores de carteiras institucionais e pequenos investidores.',
      'O sector bancário e as instituições de crédito mantêm índices de liquidez robustos, sinalizando espaço para expansão de linhas de crédito a taxas atrativas para o fomento de pequenas e médias empresas.'
    ],
    imagem: imgMercado,
    imagemAlt: 'Painel financeiro de negociação e análise de mercado',
    tags: ['Mercado', 'Investimentos', 'Bolsa']
  },
  {
    id: 'n3',
    titulo: 'Porto de Maputo atinge novo recorde de eficiência logística no trânsito de cargas',
    categoria: 'Moçambique',
    data: '28 Setembro 2026',
    hora: '11:45',
    tempoLeitura: '2 min de leitura',
    autor: 'Transportes & Logística',
    resumo: 'A modernização dos cais e a integração de sistemas aduaneiros sem papel reduziram o tempo de permanência de navios porta-contentores em mais de 35%.',
    conteudo: [
      'A Sociedade de Desenvolvimento do Porto de Maputo (MPDC) divulgou o balanço operacional do terceiro trimestre, apontando volumes históricos de movimentação de mercadorias para o corredor da África Austral.',
      'Com novos guindastes móveis de alta precisão e plataformas digitais para agendamento de camiões, o porto consolidou a sua posição como hub logístico de excelência na costa do Oceano Índico.',
      'O tempo médio de desalfandegamento e expedição foi encurtado consideravelmente, beneficiando exportadores nacionais de minérios, açúcar e citrinos.'
    ],
    imagem: imgPorto,
    imagemAlt: 'Guindastes e navios de carga no Porto de Maputo',
    tags: ['Porto', 'Exportação', 'Comércio']
  },
  {
    id: 'n4',
    titulo: 'Redes 5G de baixo consumo expandem cobertura para distritos agrícolas e industriais',
    categoria: 'Tecnologia',
    data: '28 Setembro 2026',
    hora: '10:50',
    tempoLeitura: '3 min de leitura',
    autor: 'Tecnologia & Ciência',
    resumo: 'Novas antenas solares de sinal aberto facilitam monitorização meteorológica e automação de irrigação para pequenos e médios agricultores.',
    conteudo: [
      'Operadoras de telecomunicações em conjunto com institutos de investigação agronómica iniciaram testes de campo com estações rádio-base de baixo consumo energético e alimentadas a energia solar.',
      'A tecnologia permite transmitir dados de sensores de humidade do solo e previsões microclimáticas instantâneas para os telemóveis dos produtores locais através de SMS e dados móveis simplificados.',
      'A facilidade de implementação sem necessidade de redes elétricas convencionais promete democratizar a agricultura de precisão em grande escala.'
    ],
    imagem: imgAntena,
    imagemAlt: 'Torre de telecomunicações com painéis solares em área rural',
    tags: ['5G', 'Agritech', 'Sustentabilidade']
  },
  {
    id: 'n5',
    titulo: 'Cimeira climática global estabelece metas inovadoras para transição energética justa',
    categoria: 'Mundo',
    data: '28 Setembro 2026',
    hora: '10:10',
    tempoLeitura: '3 min de leitura',
    autor: 'Internacional',
    resumo: 'Mais de 120 delegações internacionais acordaram mecanismos de financiamento direto para projectos de energia solar e hídrica em economias emergentes.',
    conteudo: [
      'Reunidos em sessão plenária, representantes de governos de todo o globo aprovaram uma resolução histórica que cria um fundo especial para descarbonização industrial acessível.',
      'O documento destaca a premência de transferências de tecnologia limpa sem sobrecarga de royalties para nações do Sul Global.',
      'As medidas devem viabilizar novos parques solares flutuantes e mini-centrais hídricas descentralizadas em comunidades rurais nos próximos quatro anos.'
    ],
    imagem: imgEnergia,
    imagemAlt: 'Parque de painéis solares fotovoltaicos e transição energética',
    tags: ['Clima', 'Energia Solar', 'Sustentabilidade']
  },
  {
    id: 'n6',
    titulo: 'Selecção Nacional prepara estágio intensivo com foco na qualificação africana',
    categoria: 'Desporto',
    data: '28 Setembro 2026',
    hora: '09:40',
    tempoLeitura: '2 min de leitura',
    autor: 'Desporto 360',
    resumo: 'Com o plantel completo e reforçado por jovens revelações do campeonato nacional, a equipa técnica traça plano tático para os próximos confrontos decisivos.',
    conteudo: [
      'A equipa técnica nacional orientou a primeira sessão de treino táctico com vista aos jogos de apuramento da próxima jornada continental.',
      'A equipa destacou-se pela solidez defensiva e velocidade nas transições ofensivas, contando com a integração de jovens talentos dos escalões de formação.',
      'Os adeptos esgotaram as primeiras quotas de ingressos para o jogo de abertura, prometendo encher o estádio de apoio incondicional.'
    ],
    imagem: imgFutebol,
    imagemAlt: 'Treino da Selecção Nacional de Futebol em relvado profissional',
    tags: ['Futebol', 'Selecção', 'Taça Africana']
  },
  {
    id: 'n7',
    titulo: 'Produção agrícola familiar regista aumento recorde com apoio de microcrédito',
    categoria: 'Economia',
    data: '28 Setembro 2026',
    hora: '08:55',
    tempoLeitura: '2 min de leitura',
    autor: 'Economia & Sociedade',
    resumo: 'Associações de camponeses no centro e norte celebram resultados da colheita após acesso facilitado a sementes certificadas e motobombas solares.',
    conteudo: [
      'Um levantamento recente das cooperativas agrícolas indicou um incremento médio de 28% no rendimento por hectare em culturas de milho, feijão e hortícolas.',
      'O mecanismo de crédito solidário digital, operado diretamente via telemóvel simples (USSD), eliminou intermediários e permitiu a aquisição tempestiva de insumos antes do período das chuvas.',
      'Os excedentes de produção estão a abastecer mercados municipais com preços mais justos para os consumidores finais.'
    ],
    imagem: imgAgricultura,
    imagemAlt: 'Agricultores colhendo alimentos frescos com sistema de irrigação solar',
    tags: ['Agricultura', 'Microcrédito', 'Comunidades']
  },
  {
    id: 'n8',
    titulo: 'Novas rotas comerciais no Oceano Índico reduzem custos de frete marítimo',
    categoria: 'Mundo',
    data: '28 Setembro 2026',
    hora: '08:20',
    tempoLeitura: '2 min de leitura',
    autor: 'Internacional',
    resumo: 'Acordo multinacional entre operadoras navais abre linhas directas entre portos africanos e centros industriais asiáticos sem transbordo obrigatório.',
    conteudo: [
      'A inauguração da nova linha de transporte marítimo reduz o tempo de viagem em até 8 dias úteis, gerando poupanças directas nos custos operacionais de importação e exportação.',
      'O pacto inclui facilidades alfandegárias unificadas e processos digitais de manifesto de carga, acelerando a circulação de equipamentos médicos e bens essenciais.',
      'Representantes das câmaras de comércio elogiaram o acordo como um marco no estreitamento de laços económicos intercontinentais.'
    ],
    imagem: imgRotas,
    imagemAlt: 'Navio cargueiro de grande porte navegando em rota oceânica internacional',
    tags: ['Comércio', 'Marítimo', 'Global']
  },
  {
    id: 'n9',
    titulo: 'Plataformas móveis de pagamento atingem marca histórica de adesão digital',
    categoria: 'Tecnologia',
    data: '28 Setembro 2026',
    hora: '07:45',
    tempoLeitura: '2 min de leitura',
    autor: 'Inovação & Finanças',
    resumo: 'A proliferação de carteiras electrónicas interoperáveis acelera a inclusão bancária de comerciantes informais e comunidades suburbanas.',
    conteudo: [
      'Os números consolidados do sistema financeiro revelam que mais de 70% das transacções de retalho diárias já são liquidadas electronicamente através de telemóveis.',
      'A ausência de taxas de manutenção para contas básicas de micro-poupança atraiu milhões de cidadãos que anteriormente não possuíam acesso a serviços financeiros formais.',
      'O sector prepara agora a integração com pagamentos instantâneos por QR Code padronizado nacional.'
    ],
    imagem: imgPagamento,
    imagemAlt: 'Transação de pagamento por telemóvel em comércio local',
    tags: ['Fintech', 'Pagamentos', 'Inclusão']
  },
  {
    id: 'n10',
    titulo: 'Atletas moçambicanos conquistam medalhas de ouro no Campeonato Regional de Atletismo',
    categoria: 'Desporto',
    data: '28 Setembro 2026',
    hora: '07:15',
    tempoLeitura: '2 min de leitura',
    autor: 'Desporto 360',
    resumo: 'Com atuações brilhantes nos 800m e 1500m, os velocistas nacionais estabeleceram novos recordes da competição e garantiram índice para o circuito mundial.',
    conteudo: [
      'A delegação moçambicana encerrou a sua participação no Campeonato Regional com um total de sete medalhas, incluindo três ouros e duas pratas.',
      'O destaque foi para a corrida feminina dos 800 metros, dominada do início ao fim pela velocista nacional, que superou a sua melhor marca pessoal por quase dois segundos.',
      'A Federação de Atletismo confirmou que a preparação continuará no centro de alto rendimento com vista aos próximos campeonatos mundiais.'
    ],
    imagem: imgAtletismo,
    imagemAlt: 'Atletas competindo em pista de atletismo em alta velocidade',
    tags: ['Atletismo', 'Ouro', 'Recorde']
  }
];
