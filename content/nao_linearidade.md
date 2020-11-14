Title: Não linearidade em redes neurais com Pytorch
Date: 2020-11-14 15:16
Category: Blog
Tags: machine learning, data science, neural networks, pytorch
Author: Artur Magalhães


Dentro do contexto de redes neurais, as funções de ativação são essenciais. Uma de suas principais funções é permitir o aprendizado de regiões e superfícies de decisão mais complexas. Nesse post, iremos criar redes neurais usando ```Pytorch``` e analisar as superfícies de decisão com e sem funções de ativação.

## Redes neurais

Uma rede neural é um aproximador universal de funções. O que isso quer dizer? Basicamente, uma rede neural consegue aproximar qualquer função contínua ([dadas algumas condições](http://neuralnetworksanddeeplearning.com/chap4.html)). Quando estamos tratando de aprendizado de máquina, de modo geral, a ideia é essencialmente aproximar uma função que descreve/aprende seus dados de treino. 

Dessa forma, redes neurais são ferramentas muito poderosas em problemas de classificação, em que procuramos uma superfície de decisão para conseguir dizer a qual classe um objeto pertence, e regressão, em que predizemos um valor numérico. Nesse post, iremos abordar o uso das redes em problemas de classificação.

Algumas peças importantes compõem a arquitetura de uma rede neural, e os componentes básicos são: os neurônios (unidades básicas), a entrada (*inputs*), as camadas internas (*hidden layers*), as funções de ativação (*activation functions*) e a camada de saída (*outputs*). Na imagem abaixo, temos uma ilustração de uma rede:

|![neuralnet]({filename}/images/simple_nn.png)|
|:--:|
|Rede neural com uma camada de entrada, uma camada interna
 e uma camada de saída. Fonte: [Wikipedia](https://commons.wikimedia.org/wiki/File:Neuralnetwork.png)|

Não entraremos em detalhes sobre outros pontos igualmente relevantes no estudo de redes neurais, como funções de perda (*loss functions*), otimizadores (*optimizers*), *backpropagation*, etc. Em especial, iremos analisar o impacto das funções de ativação quando temos um problema de classificação com uma superfície não linear.

### Exemplo em Pytorch

Um neurônio, unidade fundamental de uma rede neural, computa uma função linear do que recebe de entrada:
$$
y = w*x + b
$$

Como podemos perceber, essa equação define uma reta. Em ```Pytorch```, podemos descrever essa função como:

<script src="https://gist.github.com/tutss/eea6c62bd60a5d146613b982e51ab50d.js"></script>

<!-- ```python
import torch.nn as nn
model = nn.Linear(1,1)
y = model(x)
``` -->

Se os neurônios definem retas, como uma rede pode aproximar tão bem funções complexas? Afinal, combinações de funções lineares são lineares. É ai que entra a importância das funções de ativação.

## Funções de ativação

Como comentado anteriormente, um dos principais papéis das funções de ativação é adicionar não linearidade na saída de um neurônio, permitindo que a rede consiga aprender superfícies de decisão mais complexas. Existem diferentes tipos de funções de ativação, veja na figura abaixo:

|![activationfunc]({filename}/images/activ_func.png)|
|:--:|
|Exemplo de duas funções de ativação: ReLU e *Softplus*. Fonte: [Wikipedia](https://commons.wikimedia.org/wiki/File:Rectified_linear_and_Softplus_activation_functions.png)|

Um exemplo comum de função de ativação é a função sigmóide, descrita matematicamente como:
$$
f(x) = \frac{1}{1+e^{-x}}
$$
A função sigmóide é não linear e o seu resultado são valores no intervalo entre 0 e 1. Ela, como as demais funções de ativação, introduzem o fator não linearidade na rede quando um neurônio computa:
$$
f(y) = f(w*x + b) = \frac{1}{1+e^{-(wx+b)}}
$$

No nosso caso, o problema de classificação em questão é obtido pela função ```make_moons``` do pacote ```scikit-learn```. Nele, temos duas features que descrevem duas classes, como na figura abaixo.

|![makemoons]({filename}/images/makemoons.png)|
|:--:|
|Dataset *make\_moons*.|

Iremos inicialmente montar uma pequena rede, sem nenhuma função de ativação, e verificar a superfície de decisão que ela obtêm.

## Avaliando as redes no conjunto *make_moons*

O pacote [Pytorch](pytorch.org/) possui alguns módulos que auxiliam e simplificam a construção de uma rede neural. No nosso caso, iremos utilizar o módulo ```nn```, que contém métodos e classes necessárias para a construção da rede, e o módulo ```optim```, que contém os otimizadores para as redes.

Primeiro, é importante lembrar que o Pytorch trabalha com uma estrutura de dados chamada **tensor**. Um tensor seria uma generalização de um vetor em $N$ dimensões. Por exemplo, um vetor é um tensor com 1 dimensão e uma matriz é um tensor com 2 dimensões. O pacote ```scikit-learn```, que contém a função para construirmos o conjunto de dados, utiliza vetores do ```numpy```, e portanto, precisamos convertê-los para a estrutura ```torch.tensor```.

### Convertendo para tensor

Obtemos o conjunto de dados:

<script src="https://gist.github.com/tutss/45d7acb84bac1dde4b7fa7e5ed4321b4.js"></script>
<!-- ```python
n_samples = 1_000
X, y = make_moons(n_samples=n_samples, noise=0.1, random_state=42)
``` -->

Dividimos o conjunto em treino e teste:

<script src="https://gist.github.com/tutss/0c8299a296ac50a84b6d564921066e39.js"></script>
<!-- ```python
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.25, random_state=42)
``` -->

Convertendo para tensor:

<script src="https://gist.github.com/tutss/b4fbff0722d824d422bfdb9516883c2d.js"></script>
<!-- ```python
X_train_tensor = torch.from_numpy(X_train)
y_train_tensor = torch.from_numpy(y_train).unsqueeze(1)

<!-- X_val_tensor = torch.from_numpy(X_val)
y_val_tensor = torch.from_numpy(y_val).unsqueeze(1)
``` -->

### Módulos ```nn``` e ```optim```

O módulo ```nn``` contém componentes importantes na construção de uma rede, como o tipo das camadas, as funções de perda e ativação que iremos utilizar. Já o módulo ```optim``` contém os otimizadores para a rede.

<script src="https://gist.github.com/tutss/3be84f7f761d67ec251d8465c86a4b46.js"></script>
<!-- ```python
import torch.nn as nn
import torch.optim as optim
``` -->

*****

## Construindo as redes

Agora temos as peças necessárias para construir as redes que irão classificar o nosso conjunto. Assim como no pacote Keras, o Pytorch possui um módulo chamado [```nn.Sequential```](https://pytorch.org/docs/stable/generated/torch.nn.Sequential.html) que facilita bastante a construção da rede. Também, precisamos de um otimizador, no nosso caso, [```Adagrad```](https://pytorch.org/docs/stable/_modules/torch/optim/adagrad.html#Adagrad) e a função de perda [```nn.BCELoss```](https://pytorch.org/docs/stable/generated/torch.nn.BCELoss.html#torch.nn.BCELoss).

Aqui vale ressaltar que a escolha do otimizador e da função de perda não tiveram uma grande motivação, apenas que o ```Adagrad``` é um otimizador comum, e a função de perda é apropriada para classificação binária ([*binary cross entropy*](https://en.wikipedia.org/wiki/Cross_entropy)).

### 1° modelo

Para o primeiro modelo, com 100 unidades em uma única camada interna, temos:

<script src="https://gist.github.com/tutss/744c13a2092b093b7b7dd948abcb16b4.js"></script>
<!-- ```python
model = nn.Sequential(
    nn.Linear(input_shape, 100),
    nn.Linear(100, 1),
    nn.Sigmoid()
)
optimizer = optim.Adagrad(model.parameters())
loss = nn.BCELoss()
``` -->

Com a rede construída, precisamos treiná-la para que possa aprender as características dos dados e realizar as previsões. A função de treino:

<script src="https://gist.github.com/tutss/6e55bb5f4ea271db57dc36da338aa262.js"></script>
<!-- ```python
def train(model, loss, optimizer, train_values, train_target, val_values, val_target, epochs=50):
    for e in range(1, epochs+1):
        optimizer.zero_grad()   
        output = model(train_values.float())
        loss_train = loss(output, train_target.float())
        
<!-- val_output = model(val_values.float())
        loss_val = loss(val_output, val_target.float())
        
        loss_train.backward()
        optimizer.step()
        if e == 1 or e % 10 == 0:
            print(f'Epoch {e}: \ttrain loss {loss_train.item():.2f}\t validation loss {loss_val.item():.2f}')
``` -->

E o loop de treino:

<script src="https://gist.github.com/tutss/2d70a406f2b65c99044df099a92817c1.js"></script>
<!-- ```python
train(model, loss, optimizer, X_train_tensor, y_train_tensor, X_val_tensor, y_val_tensor, epochs=150)
``` -->

#### Resultados para o 1° modelo

Podemos notar que o 1° modelo não contém uma função de ativação, e portanto, tem problemas em conseguir caracterizar funções mais complexas (não lineares). Um exercício interessante para analisar esse caso, é verificar a superfície de decisão:

|![model1pred]({filename}/images/model1_pred.png)||![model1bound]({filename}/images/model1_bound.png)|
|:--:||:--:|
|Predições feitas pelo 1° modelo||Superfície de decisão do 1° modelo|

Podemos tentar expandir essa rede (ainda sem funções de ativação) para verificar o impacto do aumento de camadas:

<script src="https://gist.github.com/tutss/f50499daa9dbf400fba31b1fa8c23943.js"></script>
<!-- ```python
model = nn.Sequential(
    nn.Linear(input_shape, 128),
    nn.Linear(128, 64),
    nn.Linear(64, 32),
    nn.Linear(32, 1),
    nn.Sigmoid()
)
optimizer = optim.Adagrad(model.parameters())
loss = nn.BCELoss()
``` -->

Obtemos os seguintes resultados:

|![model11pred]({filename}/images/model11_pred.png)||![model11bound]({filename}/images/model11_bound.png)|
|:--:||:--:|
|Predições feitas pelo 1° modelo com um maior número de camadas.||Superfície de decisão do 1° modelo com um maior número de camadas.|

Analisando as imagens acima, fica evidente que o melhor que a rede consegue é uma reta que separa, mesmo que não perfeitamente, as duas classes (vermelha e azul), coincidindo com o que esperávamos. Pelo fato de estarmos utilizando combinações lineares, padrões não lineares são quase imperceptíveis. 

### 2° modelo

Agora, iremos introduzir uma função de ativação no modelo, e analisar o resultado obtido. A função de ativação que iremos selecionar é a função ReLU ([```nn.ReLU```](https://pytorch.org/docs/stable/generated/torch.nn.ReLU.html#torch.nn.ReLU)), que matematicamente é expressa como: 

$$
f(x) = max(x, 0)
$$

A função ReLU, por definição, é não linear (pela aplicação do máximo), e é comumente utilizada no contexto de redes neurais. Introduzindo a função de ativação, a rede terá maior capacidade de captar comportamentos não lineares nos dados.

Assim, o modelo fica:

<script src="https://gist.github.com/tutss/5f947c271a90144963f4d9aefdbcb476.js"></script>
<!-- ```python
non_linear_model = nn.Sequential(
    nn.Linear(input_shape, 128),
    nn.ReLU(),
    nn.Linear(128, 1),
    nn.Sigmoid()
)
optimizer = optim.Adagrad(non_linear_model.parameters())
loss = nn.BCELoss()
``` -->

Treinando o modelo como na etapa anterior, temos a seguinte superfície de decisão:

|![relu1pred]({filename}/images/relu1.png)||![relu1bound]({filename}/images/relu1_bound.png)|
|:--:||:--:|
|Predições feitas pelo 2° modelo.||Superfície de decisão do 2° modelo.|

Podemos perceber que agora, temos uma superfície mais curvilínea, devido a introdução de não linearidade pela camada ```nn.ReLU```. O resultado seria semelhante caso utilizássemos outra função de ativação (não necessariamente ser igual).

### Construindo mais modelos

Para avaliar como as funções de ativação, atreladas a um maior número de camadas, permitem aproximarmos funções não lineares, iremos construir mais alguns modelos:

<script src="https://gist.github.com/tutss/7caf231958a5ac53c07c2063e58cc0d8.js"></script>
<!-- ```python
non_linear_model = nn.Sequential(
    nn.Linear(input_shape, 128),
    nn.ReLU(),
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Linear(64, 1),
    nn.Sigmoid()
)
optimizer = optim.Adagrad(non_linear_model.parameters())
loss = nn.BCELoss()
``` -->

<script src="https://gist.github.com/tutss/a431a5e01f467632d79e2502927c22bd.js"></script>
<!-- ```python
non_linear_model = nn.Sequential(
    nn.Linear(input_shape, 256),
    nn.ReLU(),
    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Linear(64, 1),
    nn.Sigmoid()
)
optimizer = optim.Adagrad(non_linear_model.parameters())
loss = nn.BCELoss()
``` -->

Analisando a evolução da superfície de decisão:

|![relu2bound]({filename}/images/relu2_bound.png)||![relu3bound]({filename}/images/relu3_bound.png)|
|:--:||:--:|
|Predições feitas pelo 3° modelo.||Superfície de decisão do 4° modelo.|

Fica evidente que construindo uma rede com mais camadas, atreladas a funções de ativação (não lineares), a nossa superfície de decisão consegue captar mais nuances presentes nos dados, permitindo uma classificação mais acurada. Claro, a ideia aqui é avaliar a superfície em si, já que em um contexto de uma aplicação real seria necessário avaliar também a questão da generalização da rede, que seria o quão bem a rede consegue classificar dados os quais nunca viu.

Verificamos que introduzindo as funções de ativação, junto ao aumento do número de camadas, nossa rede conseguiu captar as nuances da distribuição não linear dos dados.

___


Nesse post, conseguimos analisar brevemente um dos principais impactos de funções de ativação dentro do contexto de redes neurais. O tópico é uma grande área de pesquisa, com constantes novas descobertas, e apenas pincelamos o seu uso dentro do cenário de classificação.

**O post também é acompanhado de um notebook, [neste link](https://github.com/tutss/datascience/blob/master/nonlinearity.ipynb).**

As referências para a construção desse material foram:

- [Deep Learning with Pytorch](https://pytorch.org/assets/deep-learning/Deep-Learning-with-PyTorch.pdf)
- [Why nonlinear activation functions improve ML performance](https://www.machinecurve.com/index.php/2020/10/29/why-nonlinear-activation-functions-improve-ml-performance-with-tensorflow-example/)
- [Plotting decision boundary of logistic regression](https://stackoverflow.com/questions/28256058/plotting-decision-boundary-of-logistic-regression?noredirect=1&lq=1)

Até o próximo post :)
