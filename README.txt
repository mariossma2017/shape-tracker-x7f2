PROJETO SHAPE DE PAI
Controle de Dieta, Treino e Performance — v1.0
================================================================

O QUE É
--------
Aplicativo pessoal para acompanhar seu protocolo diário de dieta, treino,
cardio, água e suplementação, com pontuação de aderência (0-100) e
histórico em calendário. Funciona 100% no navegador, sem servidor,
sem internet (depois de instalado) e sem enviar seus dados a lugar nenhum.

Feito com HTML, CSS e JavaScript puro — sem frameworks, sem build.


COMO INSTALAR NO IPHONE (recomendado)
--------------------------------------
O app deve ser instalado usando o SAFARI (não use o Chrome no iPhone
para este passo, o botão de instalação não aparece do mesmo jeito).

1. Abra o endereço do aplicativo no Safari.
2. Toque no botão Compartilhar (o quadrado com uma seta para cima),
   na barra inferior do Safari.
3. Role as opções e toque em "Adicionar à Tela de Início".
4. Se aparecer a opção "Abrir como App da Web", ative-a.
5. Toque em "Adicionar" no canto superior direito.
6. Um ícone "Shape de Pai" vai aparecer na sua tela inicial.
   A partir de agora, abra sempre por esse ícone — o app abre em tela
   cheia, sem a barra de endereço do navegador.


FUNCIONAMENTO OFFLINE
-----------------------
Depois de abrir o app pelo menos uma vez com internet, ele continua
funcionando normalmente sem conexão (o Service Worker guarda uma cópia
de todos os arquivos necessários). Os registros feitos offline ficam
salvos normalmente no seu iPhone.


ONDE FICAM OS SEUS DADOS
--------------------------
Todos os registros (dieta, treino, água, suplementos, evolução) ficam
salvos no armazenamento local do Safari (localStorage), diretamente
no seu iPhone. Isso significa que:

  • Os dados NÃO são enviados para nenhum servidor ou nuvem.
  • Os dados NÃO sincronizam automaticamente com o computador ou
    com outro celular.
  • Se você limpar os dados de navegação do Safari (Ajustes > Safari >
    Limpar Histórico e Dados de Sites), os registros serão apagados.
  • Remover o ícone do app da tela de início por si só normalmente NÃO
    apaga os dados (eles ficam ligados ao Safari), mas para evitar
    qualquer risco, faça backups regulares.

Por isso o app mostra um aviso na tela de Ajustes quando o último
backup foi feito há muitos dias — leve esse aviso a sério.


BACKUP (MUITO IMPORTANTE)
----------------------------
Na tela "Ajustes" > "Backup e Exportação":

  • Exportar backup (.json): gera um arquivo com TODOS os seus dados
    (protocolo, histórico, evolução). Guarde esse arquivo em local seguro.
  • Importar backup (.json): restaura os dados a partir de um arquivo
    exportado anteriormente. Isso SUBSTITUI todos os dados atuais.
  • Exportar histórico (.csv): gera uma planilha do histórico diário
    para abrir no Excel/Numbers/Google Sheets.

Como salvar o backup no iPhone:
  1. Toque em "Exportar backup (.json)".
  2. O Safari vai abrir o menu de compartilhamento do iOS.
  3. Escolha "Salvar em Arquivos" e selecione uma pasta (ex: iCloud Drive).

Como importar um backup no iPhone:
  1. Toque em "Importar backup (.json)".
  2. Escolha o arquivo dentro do app Arquivos.

Recomendação: exporte um backup pelo menos uma vez por semana.


CAMPOS NUMÉRICOS E VÍRGULA
------------------------------
Os campos de peso, medidas e carga aceitam tanto vírgula quanto ponto
como separador decimal (ex: "104,5" ou "104.5" funcionam igual).


SEGURANÇA / APAGAR DADOS
----------------------------
Não existe nenhum botão de "limpar tudo" acidental. Para apagar todos
os dados é necessário ir em Ajustes > Zona de Perigo > "Apagar todos
os dados" e digitar a palavra APAGAR para confirmar. Faça sempre um
backup antes de usar essa opção.


SOBRE A SUPLEMENTAÇÃO
-------------------------
O app apenas registra se você tomou ou não cada suplemento no dia.
Ele NUNCA recomenda medicamentos, NUNCA altera doses e NUNCA emite
qualquer tipo de orientação médica. Qualquer decisão sobre doses,
substâncias ou protocolos deve vir sempre do seu médico ou coach.


ARQUIVOS DO PROJETO
-----------------------
  index.html         estrutura das telas
  style.css          visual (modo claro/escuro, layout mobile-first)
  script.js          toda a lógica e os dados do seu protocolo
  manifest.json       configuração do PWA (nome, ícone, cor, modo standalone)
  service-worker.js   cache offline
  icons/              ícones do app (tela inicial, favicon)

Se quiser evoluir o app no futuro (novos campos, integração com Apple
Health, sincronização entre aparelhos, etc.), comece lendo o script.js
— não há build nem dependências externas.
