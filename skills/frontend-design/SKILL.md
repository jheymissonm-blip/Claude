---
name: frontend-design
description: "Orientação para um design visual distinto e intencional ao criar uma interface nova ou remodelar uma existente. Ajuda com direção estética, tipografia e escolhas que não pareçam padrões genéricos de template."
license: Complete terms in LICENSE.txt
---

# Frontend Design

Encare isto como o líder de design de um estúdio conhecido por dar a cada cliente uma identidade visual distinta, que não se confunde com a de ninguém. Este cliente já rejeitou propostas que pareciam clichê ou de template, e está pagando por um ponto de vista próprio: faça escolhas deliberadas e opinativas de paleta, tipografia e layout específicas para este briefing, e assuma risco estético quando for justificado.

## Fundamente seus designs no assunto

Se o briefing não identifica qual é o produto ou o assunto, identifique você mesmo antes de projetar e confirme com o cliente. Você pode propor um assunto concreto, o público do design e a função principal dele. Se houver na sua memória alguma informação sobre as preferências do cliente ou contexto sobre o que ele está construindo, use como pista. O setor, o tema, os materiais e o vocabulário do assunto são de onde vêm as escolhas visuais distintas: o design de um brinquedo para meninas de 8 a 11 anos será esteticamente muito diferente do de um painel para analistas financeiros. Construa com o conteúdo e o assunto reais do briefing do começo ao fim.

## Princípios de design

Em designs para web, o hero é a primeira coisa que os visitantes veem. Abra com o que há de mais característico do mundo do assunto, na forma mais apropriada: um título, uma imagem, uma animação, uma demonstração ao vivo, um momento interativo ou outros tratamentos. Faça uma escolha deliberada: um número grande com um rótulo pequeno, estatísticas de apoio e um destaque em degradê é o tratamento padrão, então só use se for de fato a melhor opção.

A tipografia carrega a personalidade da página. Você não precisa de uma fonte diferente para títulos e para o corpo do texto: use uma família ou duas e, se forem duas, deixe-as claramente distintas.

Escolha as fontes de forma deliberada, não as famílias padrão a que você recorreria em qualquer outro projeto, e defina uma escala tipográfica clara seguindo a orientação básica de The Elements of Typographic Style, com pesos, larguras e espaçamentos intencionais. Quando o texto é usado como título ou elemento visual, use o tratamento tipográfico como parte ativa do design, não como um veículo neutro do conteúdo.

Por padrão, use linhas com menos de 80 caracteres. Fontes com serifa aceitam linhas um pouco mais longas; dê ao corpo de texto com serifa um pouco mais de entrelinha do que ao sem serifa.

Evite estes tratamentos tipográficos padrão; são os sinais mais comuns de uma página gerada:
- Destacar só uma palavra ou expressão em um título, como pôr uma palavra em itálico/negrito ou em outra cor.
- Usar caixa alta em rótulos.
- Adicionar rótulos tipográficos desnecessários acima do conteúdo.

A estrutura visual é informação. Recursos estruturais como contornos, bordas, numeração, sobretítulos, divisores, rótulos etc. codificam informação útil sobre o conteúdo em vez de decorar. Muitos designs genéricos usam marcadores numerados (01 / 02 / 03), mas isso só é apropriado se o conteúdo for de fato uma sequência, como um processo em etapas ou uma linha do tempo. Antes de adicionar marcadores numerados, confira se o conteúdo realmente é uma sequência.

Use movimento não acionado pelo usuário com parcimônia e de forma deliberada, só para chamar atenção. Um único momento orquestrado, uma sequência de carregamento da página ou uma revelação, funciona melhor do que efeitos espalhados; entradas com fade e deslize para cima em cada seção e transições de hover em todo card são o padrão genérico e parecem geradas por IA. Movimento que responde a uma ação da pessoa (abrir, expandir, confirmar) é bem-vindo quando mostra o que mudou.

Pense com cuidado no conteúdo escrito. Muitas vezes o briefing não traz conteúdo real, e cabe a você criar o texto e o conteúdo provisório. O texto pode fazer um design parecer tão de template quanto o próprio design. Veja a seção sobre escrita abaixo para mais orientação.

## Processo: planejar, revisar contra o briefing, construir, criticar

Para calibrar, o design gerado por IA hoje se agrupa em torno de alguns traços:
1. um fundo creme quente (perto de #F4F1EA) com uma serifa de display de alto contraste e um destaque terracota ou argila quente (muitas vezes perto de #D97757, o destaque de interação do próprio Claude da Anthropic, então em um briefing de usuário isso denuncia);
2. um fundo quase preto com um único destaque verde-ácido ou vermelhão brilhante;
3. um layout estilo jornal, com filetes finos, zero de border-radius e colunas densas;
4. o kit de cards de SaaS: conteúdo cortado em cards arredondados idênticos, um único border-radius em tudo independentemente da hierarquia, a mesma sombra cinza suave (rgba(0,0,0,.1)) sob cada um e degradês como decoração;
5. acabamento de template que aparece qualquer que seja o assunto: um rótulo sobretítulo em CAIXA ALTA espaçada acima de cada título; textos meta unidos por pontos medianos ('A · B · C'); rótulos no formato 'PALAVRA — fragmento' com travessão espaçado; um quase preto tingido (#0B0B0B, #111) no lugar do preto; uma fonte monoespaçada para pequenos rótulos de dados; uma '→' no fim do texto de links e botões.

Todos esses traços são legítimos para algum briefing, mas são padrões, não escolhas, e aparecem independentemente do assunto. Onde o briefing define uma direção visual, siga-a exatamente: as palavras do próprio briefing sempre vencem, inclusive quando pedem um desses visuais. Onde ele deixa um eixo livre, não gaste essa liberdade em um desses padrões. Como com um designer humano contratado, muitas vezes há um equilíbrio delicado entre fazer o que você faz bem e tratar cada projeto como oportunidade de experimentar e aprender.

Trabalhe em duas passagens. Primeiro, faça um brainstorm de um plano de design curto com base no briefing do cliente: crie um sistema compacto de tokens com cor, tipografia, layout e princípios.
- Cor: descreva a paleta-base principal com 4 a 6 valores hex nomeados.
- Tipografia: as fontes e seus papéis.
- Layout: um conceito de layout, usando descrições em prosa de uma frase e wireframes em ASCII para idear e comparar. Inclua orientação de alinhamento; o conteúdo deve ficar alinhado à esquerda, centralizado, justificado?
- Princípios: a orientação de alto nível sobre o que torna esta página única.

Depois, revise esse plano contra o briefing antes de construir: se alguma parte parecer o padrão genérico que você produziria para qualquer página parecida (trabalhe um pedido semelhante para ver se chega a algo parecido) em vez de uma escolha feita para este briefing específico, revise essa parte e diga o que mudou e por quê. Só depois de confirmar a relativa singularidade do seu plano de design é que você deve começar a escrever o código, seguindo o plano revisado.

Ao escrever o código, cuide da especificidade dos seletores CSS. É fácil gerar classes CSS que se anulam (especialmente com um seletor baseado em tipo, como .section, e um baseado em elemento, como .cta). Isso acontece muito com padding/margin entre seções.

## Contenção e autocrítica

Gaste sua ousadia em um só lugar. Deixe um elemento ser a coisa memorável, mantenha tudo ao redor quieto e disciplinado e corte toda decoração que não sirva ao briefing. Construa até um piso de qualidade sem alardeá-lo: responsivo até o mobile, foco de teclado visível, movimento reduzido respeitado, visualmente acessível, paletas de cor harmoniosas. Critique seu próprio trabalho enquanto constrói, tirando capturas de tela para revisar se o ambiente permitir: uma imagem vale 1000 tokens. Considere o conselho da Chanel: antes de sair de casa, olhe-se no espelho e tire um acessório. Criativos humanos têm memória e sempre tentam fazer algo novo, então, se você tiver um espaço para anotar rapidamente o que já tentou, isso pode ajudar nas próximas passagens.

## Mais sobre escrita em design

As palavras aparecem em um design por um único motivo: facilitar o entendimento e o uso. São conteúdo de design, não decoração. Traga ao texto a mesma intenção e o mesmo minimalismo que você traz ao espaçamento e à cor. Antes de escrever qualquer coisa, pergunte o que o design precisa dizer e qual a melhor forma de dizer para ajudar a pessoa a navegar pela experiência.

Escreva da perspectiva do usuário final. Dê nomes às coisas pelo que os usuários entendem, em linguagem simples, não pela forma como o sistema foi construído. Um usuário gerencia notificações, não a configuração de webhook. Descreva o que algo é ou faz em termos simples em vez de vendê-lo. Ser específico e legível para novos usuários é sempre melhor do que ser engenhoso.

Use voz ativa por padrão. Um CTA diz exatamente o que acontece quando é usado: "Salvar alterações", não "Enviar". Uma ação mantém o mesmo nome em todo o fluxo, então o botão que diz "Publicar" gera um aviso que diz "Publicado". O vocabulário de uma interface é a sinalização para quem navega pelo produto. Coesão e consistência são como as pessoas aprendem o caminho.

Trate falha e vazio como momentos de orientação, não de humor. Explique o que deu errado e como corrigir, na voz da interface e não na de uma pessoa. Erros não pedem desculpas e nunca são vagos sobre o que aconteceu. Uma tela vazia é um convite para agir.

Mantenha o tom conversacional: verbos simples, caixa de frase, sem enchimento, com o tom ajustado à marca e ao público. Deixe cada elemento escrito fazer exatamente uma função.
