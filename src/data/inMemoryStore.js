const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const STORE_FILE_PATH = path.join(__dirname, 'store.json');

function createInitialState() {
  const senhaPadrao = bcrypt.hashSync('123456', 10);

  return {
    usuarios: [
      {
        id: 1,
        email: 'cliente@elaine.com',
        senha: senhaPadrao,
        endereco: 'Rua das Flores, 123',
        telefone: '(11) 99999-1111',
        cpf: '123.456.789-00',
        cnpj: null,
        dataNascimento: '1995-08-10',
      },
    ],
    produtos: [
      { id: 1, nome: 'Bolo de Chocolate', descricao: 'Bolo recheado com brigadeiro', tamanho: '1kg', tipo: 'BOLO' },
      { id: 2, nome: 'Bolo Red Velvet', descricao: 'Massa aveludada com cream cheese', tamanho: '1kg', tipo: 'BOLO' },
      { id: 3, nome: 'Caixa de Cupcakes', descricao: 'Caixa com 6 cupcakes decorados', tamanho: '6 unidades', tipo: 'CUPCAKE' },
      { id: 4, nome: 'Torta de Limão', descricao: 'Torta gelada com merengue', tamanho: '8 fatias', tipo: 'TORTA' },
    ],
    massas: [
      { id: 1, descricao: 'Pão de ló de chocolate' },
      { id: 2, descricao: 'Massa amanteigada de baunilha' },
      { id: 3, descricao: 'Red velvet tradicional' },
    ],
    sabores: [
      { id: 1, descricao: 'Brigadeiro belga' },
      { id: 2, descricao: 'Ninho com morango' },
      { id: 3, descricao: 'Doce de leite' },
      { id: 4, descricao: 'Limão siciliano' },
    ],
    tabelasPreco: [
      {
        id: 1,
        descricao: 'Tabela vigente 2026',
        dataInicio: new Date('2026-01-01T00:00:00.000Z').toISOString(),
        dataFim: null,
        atual: true,
      },
      {
        id: 2,
        descricao: 'Tabela promocional 2025',
        dataInicio: new Date('2025-06-01T00:00:00.000Z').toISOString(),
        dataFim: new Date('2025-12-31T23:59:59.000Z').toISOString(),
        atual: false,
      },
    ],
    tpItems: [
      { id: 1, tabelaPrecoId: 1, produtoId: 1, preco: 95 },
      { id: 2, tabelaPrecoId: 1, produtoId: 2, preco: 110 },
      { id: 3, tabelaPrecoId: 1, produtoId: 3, preco: 48 },
      { id: 4, tabelaPrecoId: 1, produtoId: 4, preco: 72 },
      { id: 5, tabelaPrecoId: 2, produtoId: 1, preco: 88 },
      { id: 6, tabelaPrecoId: 2, produtoId: 2, preco: 104 },
      { id: 7, tabelaPrecoId: 2, produtoId: 3, preco: 44 },
      { id: 8, tabelaPrecoId: 2, produtoId: 4, preco: 68 },
    ],
    pedidos: [
      {
        id: 1,
        usuarioId: 1,
        endereco: 'Rua das Flores, 123',
        tipoEntrega: 'ENTREGA',
        valorTotal: 185,
        desconto: 5,
        status: 'PENDENTE',
        itens: [
          { id: 1, produtoId: 1, quantidade: 2, preco: 95 },
        ],
      },
      {
        id: 2,
        usuarioId: 1,
        endereco: '',
        tipoEntrega: 'RETIRADA',
        valorTotal: 48,
        desconto: 0,
        status: 'EM_PREPARO',
        itens: [
          { id: 2, produtoId: 3, quantidade: 1, preco: 48 },
        ],
      },
    ],
    counters: {
      usuario: 2,
      pedido: 3,
      pedidoItem: 3,
      produto: 5,
      massa: 4,
      sabor: 5,
      tabelaPreco: 3,
      tpItem: 9,
    },
  };
}

function persistStore() {
  fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function loadStore() {
  if (!fs.existsSync(STORE_FILE_PATH)) {
    const initialState = createInitialState();
    fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(initialState, null, 2), 'utf8');
    return initialState;
  }

  const fileContents = fs.readFileSync(STORE_FILE_PATH, 'utf8');
  return JSON.parse(fileContents);
}

const store = loadStore();

function nextId(key) {
  const value = store.counters[key];
  store.counters[key] += 1;
  return value;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function findProdutoById(produtoId) {
  return store.produtos.find((produto) => produto.id === produtoId) || null;
}

function findUsuarioById(usuarioId) {
  return store.usuarios.find((usuario) => usuario.id === usuarioId) || null;
}

function findTabelaPrecoById(tabelaPrecoId) {
  return store.tabelasPreco.find((tabelaPreco) => tabelaPreco.id === tabelaPrecoId) || null;
}

function hydratePedido(pedido) {
  if (!pedido) {
    return null;
  }

  return clone({
    ...pedido,
    usuario: (() => {
      const usuario = findUsuarioById(pedido.usuarioId);
      return usuario
        ? {
            id: usuario.id,
            email: usuario.email,
          }
        : null;
    })(),
    itens: pedido.itens.map((item) => ({
      ...item,
      produto: findProdutoById(item.produtoId),
    })),
  });
}

function hydrateTpItem(tpItem) {
  if (!tpItem) {
    return null;
  }

  return clone({
    ...tpItem,
    produto: findProdutoById(tpItem.produtoId),
    tabelaPreco: findTabelaPrecoById(tpItem.tabelaPrecoId),
  });
}

function hydrateTabelaPreco(tabelaPreco) {
  if (!tabelaPreco) {
    return null;
  }

  return clone({
    ...tabelaPreco,
    itens: store.tpItems
      .filter((item) => item.tabelaPrecoId === tabelaPreco.id)
      .map((item) => hydrateTpItem(item)),
  });
}

module.exports = {
  store,
  nextId,
  clone,
  persistStore,
  findProdutoById,
  findUsuarioById,
  findTabelaPrecoById,
  hydratePedido,
  hydrateTpItem,
  hydrateTabelaPreco,
};
