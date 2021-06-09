# Backend do Projeto Spirax - Teste
- API em NodeJS voltada para eliminar o uso de planilhas na empresa Hiter Controls
- Portando o backend desenvolvido aqui, foi trabalhado em cima de algumas das planilhas como forma de teste para o uso futuro de um backend melhor trabalhado e validado para o futuro. Tendo em vista em um primeiro momento apenas funções extremamentes básicas e que foram permitidas pelo TI da empresa apresentar.

# Integrantes do Grupo
- Felipe Yamaoka
- Danillo Aledes

# Rotas, Modelos e Bancos de dados desenvolvidos
- Company (Empresas)
- Infraestrutura (Máquinas)
- Printer (Impressoras)
- Ramal (Telefonia)
- User (Usuário)

Dentre as tabelas existem alguns bancos que são relacionados como o de usuário com o de ramal e também o de infraestrutura, para que possa ser feito o controle de qual usuário utiliza qual máquina e responsável por qual número de telefonia para contato.

# Heroku
- O backend além de ter sido trabalhado de forma local, conta também com o Heroku que foi a ferramenta utilizada para hospedagem desse backend, onde estará disponível para acesso no seguinte link: https://backspirax.herokuapp.com

# Rotas para serem testadas
- /company
- /infra
- /printers
- /ramais
- /users

# CRUD
- Atualmente a API conta com o CRUD em ambas as 5 tabelas até o momento desenvolvida.
