Title: Comparação entre buscas sobre eleições norte-americanas vs eleições municipais
Date: 2020-11-09 13:30
Category: Blog
Tags: eleicoes, data science, google trends
Author: Artur Magalhães

Na semana passada, ouvi algumas notícias sobre a comparação entre a atenção dada as eleições nos EUA vs eleições municipais, que acontecem no próximo fim de semana, e como a eleição americana tem se destacado como foco.

Resolvi comparar, utilizando o Google Trends, os termos de pesquisa relativos a esses dois acontecimentos. A cor azul representa pesquisas para o termo "eleições americanas" e as demais eleições municipais (em verde, termo "eleições vereadores", em amarelo, "eleições prefeitura", em vermelho, "eleições municipais").

|![Termos]({filename}/images/termos_trends.png)|
|:--:| 
|Termos de pesquisa utilizados no Google Trends|


## Série dos últimos 30 dias

Podemos analisar a série histórica dos últimos 30 dias, e comparar o interesse ao longo do tempo entre esses termos de pesquisa. Abaixo, o gráfico nos mostra uma disparada das pesquisas sobre as eleições norte-americanas, principalmente a partir do dia 31 de outubro.

<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/2402_RC03/embed_loader.js"></script>
<script type="text/javascript">
trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"eleições eua","geo":"BR","time":"today 1-m"},{"keyword":"eleições municipais","geo":"BR","time":"today 1-m"},{"keyword":"eleições prefeitura","geo":"BR","time":"today 1-m"},{"keyword":"eleições vereadores","geo":"BR","time":"today 1-m"}],"category":0,"property":""}, {"exploreQuery":"date=today%201-m&geo=BR&q=elei%C3%A7%C3%B5es%20eua,elei%C3%A7%C3%B5es%20municipais,elei%C3%A7%C3%B5es%20prefeitura,elei%C3%A7%C3%B5es%20vereadores","guestPath":"https://trends.google.com.br:443/trends/embed/"});
</script>

Observamos que as pesquisas norte-americanas se destacam em comparação aos 3 termos de pesquisa relativos as eleições municipais. Entretanto, vale ressaltar que como os termos muitas vezes não contém toda a informação para que de fato a comparação seja válida, já que uma pesquisa com termos diferentes, nesse caso, não aparece, temos que nos atentar as conclusões tiradas desta comparação. De qualquer forma, ela dá um indicativo de que as eleições norte-americanas chamaram mais a atenção do que os demais termos por uma proporção alta.


## Mapa por estado

Um outro gráfico de interesse seria o da quantidade de pesquisas segmentado por estado:

|![Gráfico 2]({filename}/images/grafico_trends_2.png)|
|:--:| 
|Comparativo por estado dos termos de pesquisa. À direita, os 5 estados com maiores proporções de busca por pelo termo "eleições municipais".|

O único estado onde a busca por algum termo relativo a eleições municipais se equiparou ao das eleições norte-americanas foi o estado do Acre, empatado em 40%, para o termo "eleições prefeitura". Para o mapa interativo, [acesse aqui](https://trends.google.com.br/trends/explore/GEO_MAP?date=today%201-m&geo=BR&q=elei%C3%A7%C3%B5es%20eua,elei%C3%A7%C3%B5es%20municipais,elei%C3%A7%C3%B5es%20prefeitura,elei%C3%A7%C3%B5es%20vereadores&hl=pt-BR&sni=4). Para o estado do Amapá, as buscas por eleições norte-americanas dominam no cenário de comparação aos 3 termos relativos a eleições municipais.

---

O Google Trends é uma ferramenta interessante para analisarmos, mesmo que não tão profundamente, o comportamento das buscas, possibilitando a comparação por termos. Os gráficos e mapas nos permitem avaliar, que dentre os 4 termos apresentados, o termo relativo a eleições norte-americanas supera com uma grande margem os termos relativos a eleições municipais.

Até o próximo post!