Title: Experiência trabalhando em uma startup de alto crescimento
Date: 2019-12-19 17:50
Category: Blog
Tags: startup, estágio, cobli, big data
Author: Artur Magalhães


Me chamo Artur, sou aluno de Ciência da Computação no IME (Instituto de Matemática e Estatística) da Universidade de São Paulo. Neste semestre, **tive a oportunidade de trabalhar em uma _startup_**, e quis compartilhar essa experiência com vocês!

Ao longo desses meses, estive em contato com uma dinâmica diferente do que já havia experimentado, e pude aprender muito sobre o funcionamento de uma *startup* de alto crescimento.


![Alt Text]({filename}/images/cobli_logo_horizontal.png)


A [Cobli](https://www.cobli.co/) é uma *startup* de IoT para logística e tem a grande missão de conectar carros de empresas na internet, dado a vasta frota existente no Brasil. Nela, oferecemos um arsenal de ferramentas para que o gestor de frota — desde o dono da mercearia à ambulâncias e grandes empresas — possa ter visibilidade e controle total sobre sua operação. Cada *feature* é pensada para realmente auxiliar o gestor, e fazer com que seu dia a dia seja otimizado, provendo um sistema de alta tecnologia e fácil de usar.

## **Crescimento acelerado**

Estive por um período de 6 meses, e nesse curto intervalo, participei de uma troca de escritório, [US$10 milhões na Series A](https://link.estadao.com.br/noticias/inovacao,startup-de-rastreamento-de-frotas-cobli-levanta-us-10-milhoes,70003052545), crescimento no número de funcionários, além de outros acontecimentos que demonstram a rapidez na qual as coisas acontecem. **O dia a dia de trabalhar em uma *startup* envolve você se deparar constantemente com mudanças e ver de fato o progresso acontecer.**

## **Cultura**

Algo que sempre ouvi falarem que era muito importante em uma empresa é a Cultura. **A Cultura é a alma de uma *startup*, é praticar, todos os dias, os pontos necessários para que tudo flua bem**. Ela define as interações entre os Coblers, principalmente no relacionamento pessoal. A Cultura na Cobli é um fator de excelência.

Desde o processo de onboarding, é ressaltado a importância da Cultura. **Ser transparente é primordial.** Para que seu colega tome decisões boas, é necessário que você seja claro, relatando problemas, complicações e incômodos, e assim melhorar continuamente os processos e decisões. Além disso, **pensar no cliente, com visão a longo prazo**, é profundamente enfatizado, afinal, o cliente é a prova final do produto. Os pontos que marcam a Cultura da Cobli são permeados em todos. A seriedade em efetivamente praticar atitudes que beneficiem a produtividade é visível nas interações intra e inter times.

## **Minha experiência como estagiário**

Na Cobli, **o estagiário tem o objetivo de aprender, complementando a formação**, aleḿ de ter apoio quanto a graduação, sendo possível ter horários flexíveis e pedir um tempo para estudos durante semana de provas. Esse ponto é um grande diferencial, já que em certos momentos a graduação pode pesar no cansaço.

Participei quase todo o estágio no time de Big Data (A.K.A. Prrruu). Como experiência profissional, essa foi minha primeira de maior duração. E mesmo com pouca experiência, desde o início já recebi atividades instigantes que demonstravam o quanto o time (e a Cobli) acreditavam no meu trabalho. **Trabalhar em produção, com dados reais, impactando milhares de usuários foi uma constante.** Você na prática implementa código e vê aquilo funcionar, tomando decisões que podem ser críticas, o que é um grande aprendizado. É gratificante receber responsabilidades mesmo quando se está iniciando.

E claro, sempre que necessário, pedi e recebi diversos conselhos e dicas que me auxiliaram muito, e com certeza me fizeram aprender certas coisas que dificilmente veria durante a graduação — por exemplo, conceitos relacionados a processamento de dados em tempo real de forma distribuída (*streaming*), ferramentas modernas de automação, serviços em cloud, etc. Estar próximo de pessoas brilhantes no que fazem ajuda demais, e o time de Big Data — assim como os demais — é excepcional.

Todas as frameworks que usei são interessantes, tanto do ponto de vista de serem novas, quanto de performance. **O cerne do meu trabalho junto ao time foi o [Apache Flink](https://ci.apache.org/projects/flink/flink-docs-release-1.9/), utilizando Scala.** Nosso objetivo do semestre foi migrar os jobs, passando de uma antiga arquitetura baseada em Akka para o Flink.

O principal motivo foi a performance e todas as vantagens que o Flink oferece. Uma framework para processamento de dados distribuídos, super robusta e própria para lidar com dispositivos enviando dados 24/7, o Flink é robusto para um alto volume de dados, além de lidar com *backpressure*, realizar *checkpoints* dos estados constantemente, operar com diversos níveis de paralelismo, etc. Em suma, abre caminho para escalar a quantidade de dispositivos nas frotas. Para quem se interessar sobre, o Flink é baseado em um modelo descrito neste [paper](https://www.vldb.org/pvldb/vol8/p1792-Akidau.pdf) ou [vídeo](https://www.youtube.com/watch?v=3UfZN59Nsk8).

Uma das principais linguagens de programação da Cobli é [Scala](https://www.scala-lang.org/). Scala é uma linguagem fantástica, e sua mescla entre programação funcional e programação orientada a objetos oferece uma flexibilidade que combina com o processamento do Flink, que possui também uma interface para Java.

Como nunca havia lidado com os problemas do contexto de *streaming*, foi desafiante. A forma como o processamento é realizado, se a ordem dos dados importa, o que fazer caso a aplicação caia no meio do caminho, como lidar com estados anteriores, e se o volume de dados aumentar subitamente, foram alguns questionamentos que tive ao longo desse caminho, e pela prática que tive na Cobli, atrelado ao encorajamento do time para que me aprofundasse na teoria de processamento de dados, hoje já tenho experiência para lidar com esses problemas — claro, não todos rs.

**Os aprendizados que conquistei com certeza foram muito devido aos meus ótimos colegas de trabalho, e fico feliz de poder ter aprendido tanto com eles.**

## **Últimas semanas**

Nas minhas duas últimas semanas na Cobli, tive a oportunidade de conhecer um pouco mais sobre [SRE (Site Reliability Engineering)](https://pt.wikipedia.org/wiki/Site_Reliability_Engineering). O time de SRE (A.K.A. #nohammer) é responsável pela sustentação dos sistemas, produtividade dos desenvolvedores — desenvolvendo ferramentas -, assim como garante a confiabilidade (*reliability*), o bom funcionamento e saúde da plataforma.

Tive a oportunidade de me aprofundar no uso da AWS — que já havia adquirido quando estava no Prrruu — , em especial [AWS Cloudformation](https://aws.amazon.com/pt/cloudformation/), criando *stack*s para criação de infraestrutura em nuvem — [*infra as code*](https://pt.wikipedia.org/wiki/Infraestrutura_como_C%C3%B3digo). Em poucas palavras, para não ser tão técnico, o que o Cloudformation te permite é que sua *stack*, sua infra, esteja descrita em código, e possa ser criada, atualizada e destruída com um comando no terminal, fazendo com que o desenvolvimento e melhoramento seja mais simples, veloz e organizado.

Novamente, o time sempre disposto a auxiliar e incentivar com certeza engrandeceu toda minha experiência na Cobli.

## **Fim de uma etapa**

Nesse semestre estagiando na Cobli, pude aprender muito, desde ferramentas, linguagens, técnicas, formas de implementação, boas práticas e muitas outras coisas. **Mas acredito que um dos grandes aprendizados que vou levar é que uma empresa se faz de pessoas, se faz de como essas pessoas interagem e desenvolvem seu dia a dia.** Ter pessoas boas que de fato tem uma visão à longo prazo, engajadas e preocupadas em colaborar e apoiar, é o que faz da Cobli um lugar especial.

***

Meus agradecimentos a todos que estiveram comigo nesse período, em especial ao [Gustavo Momenté (DG)](https://br.linkedin.com/in/gustavovm), [Vinícius Duarte](https://br.linkedin.com/in/vinícius-pessoa-duarte-1a740794) e [Nicolau Tahan](https://br.linkedin.com/in/nicolau-tahan-751338112) por toda a paciência, dicas fundamentais, e pela amizade e parceiria. 

Também ao Evandro Sanches e [Ivan Stoiev](https://br.linkedin.com/in/ivan-stoiev), que puderam me trasmitir tanto conhecimento em pouquíssimo tempo.

Também ao [Lucas Brunialti](https://br.linkedin.com/in/lucasbrunialti), pelas dicas e sugestões na construção do texto.

