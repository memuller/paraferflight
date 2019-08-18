# Parafeflight

Programa implementado como parte do desafio técnico da Parafernalha Interativa.

## Instruções

### Execução

#### Carregador de dados iniciais
- `yarn clear` limpa todos os vôos registrados no banco;
- `yarn load` carrega os vôos contidos em `data.csv` -  atualmente isso não insere todos os vôos, vide problema descrito abaixo;
- `yarn reset` executa as duas tarefas em sucessão.

#### Programa Principal
- `yarn run start` executa o programa principal na porta 3000.
- se necessário, altere a porta com a variável de ambiente PORT.

### Requerimentos
- Node.js > 10.2
- o CSV de exemplo fornecido, com nome `data.csv`, colocado na raiz do aplicativo
- um servidor MongoDB em execução; altere a URL ou porta deste no arquivo `config.json` se necessário.
- dependências instaladas, via `yarn install`

## Decisões técnicas
- Preferi iniciar o projeto "do zero", sem starters/projetos base ou bibliotecas de ORM ou gerenciamento de conexão de banco
  - isso gerou um certo trabalho no compartilhamento de conexão com banco entre rotas e classe-modelo 
- csv-parse usado para carregar os dados do CSV; dado o tamanho do arquivo, a API de nível mais baixo (que emite eventos e processa linha-a-linha) foi usada para evitar que o arquivo inteiro seja carregado em memória
  - isso na prática não resolveu o problema e causou grande perda de tempo. no momento, os vôos não são carregados completamente pois eventualmente o carregador deixa de responder.
  - possíveis soluções:
    - implementar um gerenciador de tarefas com uma pilha de inserções, para que estas possam ser executadas de forma ordenada e completa e o programa encerrado quando a pilha estiver vazia;
    - deixar de usar o csv-parse e ler o arquivo linha por linha no nível mais baixo possível, criando uma pequena pilha de inserções a serem executadas que bloqueia a leitura de mais linhas até estas se concretizarem.
- buscas case-insentive por strings podem ser feitas com expressões regulares em mongodb, mas isso tem desempenho sofrível. ao invés disso, uma versão em minúsculas de cada campo string foi armazenada para facilitar tais buscas
  - alternativamente, é possível usar os índices case-insentive de campos TEXT adicionados no Mongo um tempo atrás, mas não cheguei a utilizar este recurso em produção
- as buscas por string são exatas, não buscando por fragmentos; isso também é por questão de desempenho e os comentários acima se aplicam

## Considerações gerais
- Algumas melhorias foram pensadas porém descartadas por falta de tempo:
  - implementação em Typescript
  - inclusão de um docker-compose para execução facilitada
- O script de carregamento sem dúvida foi a parte mais complexa do aplicativo
- O tamanho do arquivo de exemplo gerou dificuldades e decisões complicadas de funcionalidade vs. desempenho; nestes casos desempenho sempre foi escolhido

## Alocação de tempo
Tempo medido em Pomodoros - intervalos de trabalho de 25min de duração. Cada item na lista corresponde a tal intervalo, totalizando **6h50min**.


- Análise e decisões técnicas
- Preparação de ambiente de desenvolvimento
- Início do projeto
- Carregador de dados: início
- Carregador de dados: tentando resolver problema de carregamento
- Carregador de dados: ainda tentando
- Carregador de dados: script p/ limpeza, finalização
- Inserção: cria classe/model p/ Flight, filtra argumentos
- Inserção: lida com compartilhamento de conexão
- Inserção: ainda lidando com compartilhamento de conexão
- Busca: testes e considerações técnicas de desempenho
- Busca: inserindo e tratanto campos lowe-case p/busca
- Busca: refatoração do carregador p/ usar a classe nova de inserção, implementação da rota
- Busca: por data
- Refactoring e ajustes
- Documentação e comentários
