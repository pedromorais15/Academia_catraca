# BLACK IRON | Totem de Acesso

Projeto front-end que simula um totem de acesso para academia usando CPF e validação por API.

## Descrição

Este projeto é uma interface web simples em HTML, CSS e JavaScript que permite digitar um CPF usando um teclado numérico virtual ou o teclado físico. O CPF é enviado para a API `https://api-academia-five.vercel.app/catraca` para verificar se o acesso deve ser liberado.

## Funcionalidades

- Interface de totem com visual escuro e estilo moderno.
- Máscara automática para CPF no formato `000.000.000-00`.
- Botões numéricos virtuais e suporte a teclado físico.
- Validação do CPF via requisição POST para a API.
- Mensagens de status para CPF válido, CPF não cadastrado, CPF inativo e erros de conexão.
- Limpeza rápida do campo de CPF.

## Arquivos principais

- `index.html` - estrutura da página e interface.
- `style.css` - estilo visual e animações.
- `script.js` - lógica da aplicação, máscara de CPF e comunicação com a API.
- `img/` - ícone usado como favicon.

## Como usar

1. Abra o arquivo `index.html` em um navegador.
2. Digite o CPF usando os botões ou diretamente pelo teclado.
3. Clique em `OK` para validar o CPF.
4. Use o botão `LIMPAR` ou `Backspace`/`Delete` para apagar o campo.

## API

O projeto consome a seguinte API:

- `POST https://api-academia-five.vercel.app/catraca`

O corpo da requisição é enviado em JSON com o CPF puro, por exemplo:

```json
{
  "cpf": "12345678901"
}
```

## Observações

- Nenhuma instalação é necessária, basta abrir o `index.html` no navegador.
- A validação de CPF depende da disponibilidade da API externa.
- A aplicação bloqueia ações como copiar/colar no campo de entrada para manter o funcionamento como totem.

## Licença

Projeto para fins de estudo e demonstração.
