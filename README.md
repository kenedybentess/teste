[teste01.html](https://github.com/user-attachments/files/27178401/teste01.html)
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Controle de Estoque v2.0 - Supabase</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f7; color: #1d1d1f; }
.login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.login-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
.login-box h1 { font-size: 28px; margin-bottom: 8px; }
.login-box p { color: #6e6e73; margin-bottom: 24px; }
.input-group { margin-bottom: 16px; }
.input-group label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; }
.input-group input,.input-group select,.input-group textarea {
    width: 100%; padding: 12px; border: 1px solid #d2d2d7; border-radius: 8px; font-size: 16px;
  }
.btn { width: 100%; padding: 12px; background: #0071e3; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; }
.btn:hover { background: #0077ed; }
.btn-secondary { background: #e8e8ed; color: #1d1d1f; }
.btn-danger { background: #ff3b30; }
.header { background: white; border-bottom: 1px solid #d2d2d7; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
.header h2 { font-size: 20px; }
.header-user { display: flex; align-items: center; gap: 12px; }
.badge { background: #0071e3; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
.container { max-width: 1200px; margin: 0 auto; padding: 24px; }
.tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #d2d2d7; }
.tab { padding: 12px 20px; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 15px; color: #6e6e73; }
.tab.active { color: #0071e3; border-bottom-color: #0071e3; font-weight: 500; }
.card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.card h3 { font-size: 18px; margin-bottom: 16px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.stat-card.label { font-size: 13px; color: #6e6e73; margin-bottom: 4px; }
.stat-card.value { font-size: 28px; font-weight: 600; }
.table-container { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e8e8ed; }
  th { font-size: 13px; font-weight: 500; color: #6e6e73; background: #f5f5f7; }
  td { font-size: 14px; }
.alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
.alert-error { background: #ffebeb; color: #c41e3a; border: 1px solid #ffcccc; }
.alert-success { background: #e8f5e9; color: #1b5e20; border: 1px solid #c8e6c9; }
.modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000; }
.modal.active { display: flex; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { margin: 0; }
.close { background: none; border: none; font-size: 24px; cursor: pointer; color: #6e6e73; }
.hidden { display: none!important; }
.estoque-baixo { color: #ff3b30; font-weight: 500; }
.estoque-ok { color: #34c759; }
</style>
</head>
<body>

<div id="loginScreen" class="login-container">
  <div class="login-box">
    <h1>Controle de Estoque</h1>
    <p>Faça login para continuar</p>
    <div id="loginAlert"></div>
    <div class="input-group">
      <label>Email</label>
      <input type="email" id="loginEmail" placeholder="admin@empresa.com">
    </div>
    <div class="input-group">
      <label>Senha</label>
      <input type="password" id="loginSenha" placeholder="••••••••">
    </div>
    <button class="btn" onclick="fazerLogin()">Entrar</button>
  </div>
</div>

<div id="appScreen" class="hidden">
  <div class="header">
    <h2>Controle de Estoque v2.0</h2>
    <div class="header-user">
      <span id="userNome"></span>
      <span class="badge" id="userPerfil"></span>
      <button class="btn btn-secondary" style="width: auto; padding: 8px 16px;" onclick="logout()">Sair</button>
    </div>
  </div>

  <div class="container">
    <div class="tabs">
      <button class="tab active" onclick="mostrarAba('dashboard')">Dashboard</button>
      <button class="tab" id="tabProdutos" onclick="mostrarAba('produtos')">Produtos</button>
      <button class="tab" onclick="mostrarAba('saida')">Saída</button>
      <button class="tab" id="tabEntrada" onclick="mostrarAba('entrada')">Entrada</button>
      <button class="tab" onclick="mostrarAba('historico')">Histórico</button>
      <button class="tab" id="tabUsuarios" onclick="mostrarAba('usuarios')">Usuários</button>
    </div>

    <div id="alertContainer"></div>

    <!-- DASHBOARD -->
    <div id="aba-dashboard" class="aba">
      <div class="grid">
        <div class="stat-card">
          <div class="label">Total de Produtos</div>
          <div class="value" id="statTotalProdutos">0</div>
        </div>
        <div class="stat-card">
          <div class="label">Estoque Baixo</div>
          <div class="value estoque-baixo" id="statEstoqueBaixo">0</div>
        </div>
        <div class="stat-card">
          <div class="label">Saídas Hoje</div>
          <div class="value" id="statSaidasHoje">0</div>
        </div>
        <div class="stat-card">
          <div class="label">Valor Total Estoque</div>
          <div class="value" id="statValorTotal">R$ 0</div>
        </div>
      </div>

      <div class="card">
        <h3>Produtos com Estoque Baixo</h3>
        <div class="table-container">
          <table id="tabelaEstoqueBaixo">
            <thead><tr><th>Código</th><th>Produto</th><th>Atual</th><th>Mínimo</th><th>Status</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PRODUTOS -->
    <div id="aba-produtos" class="aba hidden">
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3>Produtos Cadastrados</h3>
          <button class="btn" style="width: auto;" onclick="abrirModalProduto()">+ Novo Produto</button>
        </div>
        <div class="table-container">
          <table id="tabelaProdutos">
            <thead><tr><th>Código</th><th>Nome</th><th>Categoria</th><th>Estoque</th><th>Mínimo</th><th>Ações</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SAÍDA -->
    <div id="aba-saida" class="aba hidden">
      <div class="card">
        <h3>Lançar Saída de Material</h3>
        <div class="input-group">
          <label>Produto</label>
          <select id="saidaProduto"></select>
        </div>
        <div class="input-group">
          <label>Quantidade</label>
          <input type="number" id="saidaQtd" min="1">
        </div>
        <div class="input-group">
          <label>Motivo *</label>
          <select id="saidaMotivo">
            <option value="">Selecione...</option>
            <option>Produção</option>
            <option>Manutenção</option>
            <option>Amostra</option>
            <option>Perda</option>
            <option>Transferência</option>
            <option>Outro</option>
          </select>
        </div>
        <div class="input-group">
          <label>Observação</label>
          <textarea id="saidaObs" rows="3"></textarea>
        </div>
        <button class="btn" onclick="lancarSaida()">Confirmar Saída</button>
      </div>
    </div>

    <!-- ENTRADA -->
    <div id="aba-entrada" class="aba hidden">
      <div class="card">
        <h3>Lançar Entrada de Material</h3>
        <div class="input-group">
          <label>Produto</label>
          <select id="entradaProduto"></select>
        </div>
        <div class="input-group">
          <label>Quantidade</label>
          <input type="number" id="entradaQtd" min="1">
        </div>
        <button class="btn" onclick="lancarEntrada()">Confirmar Entrada</button>
      </div>
    </div>

    <!-- HISTÓRICO -->
    <div id="aba-historico" class="aba hidden">
      <div class="card">
        <h3>Histórico de Movimentações</h3>
        <div class="table-container">
          <table id="tabelaHistorico">
            <thead><tr><th>Data/Hora</th><th>Tipo</th><th>Produto</th><th>Qtd</th><th>Usuário</th><th>Motivo</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- USUÁRIOS -->
    <div id="aba-usuarios" class="aba hidden">
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3>Usuários do Sistema</h3>
          <button class="btn" style="width: auto;" onclick="abrirModalUsuario()">+ Novo Usuário</button>
        </div>
        <div class="table-container">
          <table id="tabelaUsuarios">
            <thead><tr><th>Nome</th><th>Email</th><th>Perfil</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL PRODUTO -->
<div id="modalProduto" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Novo Produto</h3>
      <button class="close" onclick="fecharModal('modalProduto')">&times;</button>
    </div>
    <div class="input-group"><label>Código *</label><input type="text" id="prodCodigo"></div>
    <div class="input-group"><label>Nome *</label><input type="text" id="prodNome"></div>
    <div class="input-group"><label>Categoria</label><input type="text" id="prodCategoria"></div>
    <div class="input-group"><label>Unidade</label><input type="text" id="prodUnidade" value="UN"></div>
    <div class="input-group"><label>Estoque Inicial</label><input type="number" id="prodEstoque" value="0"></div>
    <div class="input-group"><label>Estoque Mínimo</label><input type="number" id="prodMinimo" value="0"></div>
    <button class="btn" onclick="salvarProduto()">Salvar Produto</button>
  </div>
</div>

<!-- MODAL USUÁRIO -->
<div id="modalUsuario" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Novo Usuário</h3>
      <button class="close" onclick="fecharModal('modalUsuario')">&times;</button>
    </div>
    <div class="input-group"><label>Nome *</label><input type="text" id="userNome"></div>
    <div class="input-group"><label>Email *</label><input type="email" id="userEmail"></div>
    <div class="input-group"><label>Senha *</label><input type="password" id="userSenha"></div>
    <div class="input-group">
      <label>Perfil *</label>
      <select id="userPerfil">
        <option>Usuario</option>
        <option>Gerente</option>
        <option>Admin</option>
      </select>
    </div>
    <button class="btn" onclick="salvarUsuario()">Salvar Usuário</button>
  </div>
</div>

<script>
const SUPABASE_URL = 'https://lwqkjjlyyaohjzqpwwiv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_iA0VKR6xQ3lvmf5gf3d1MA_mwiEW__l';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let usuarioAtual = null;

async function fazerLogin() {
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  const { data, error } = await supabase
   .from('usuarios')
   .select('*')
   .eq('email', email)
   .eq('senha', senha)
   .eq('ativo', true)
   .single();

  if (error ||!data) {
    mostrarAlerta('loginAlert', 'Email ou senha incorretos', 'error');
    return;
  }

  usuarioAtual = data;
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('hidden');
  document.getElementById('userNome').textContent = data.nome;
  document.getElementById('userPerfil').textContent = data.perfil;

  aplicarPermissoes();
  carregarDashboard();
  carregarProdutos();
}

function aplicarPermissoes() {
  const perfil = usuarioAtual.perfil;
  if (perfil === 'Usuario') {
    document.getElementById('tabProdutos').classList.add('hidden');
    document.getElementById('tabEntrada').classList.add('hidden');
    document.getElementById('tabUsuarios').classList.add('hidden');
  } else if (perfil === 'Gerente') {
    document.getElementById('tabEntrada').classList.add('hidden');
    document.getElementById('tabUsuarios').classList.add('hidden');
  }
}

function logout() {
  usuarioAtual = null;
  document.getElementById('appScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
}

function mostrarAba(nome) {
  document.querySelectorAll('.aba').forEach(aba => aba.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById('aba-' + nome).classList.remove('hidden');
  event.target.classList.add('active');

  if (nome === 'dashboard') carregarDashboard();
  if (nome === 'produtos') carregarProdutos();
  if (nome === 'saida') carregarProdutosSelect('saidaProduto');
  if (nome === 'entrada') carregarProdutosSelect('entradaProduto');
  if (nome === 'historico') carregarHistorico();
  if (nome === 'usuarios') carregarUsuarios();
}

function mostrarAlerta(containerId, msg, tipo) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="alert alert-${tipo}">${msg}</div>`;
  setTimeout(() => container.innerHTML = '', 4000);
}

async function carregarDashboard() {
  const { data: produtos } = await supabase.from('produtos').select('*');
  const { data: movs } = await supabase
   .from('movimentacoes')
   .select('*')
   .gte('criado_em', new Date().toISOString().split('T')[0]);

  document.getElementById('statTotalProdutos').textContent = produtos.length;
  document.getElementById('statEstoqueBaixo').textContent = produtos.filter(p => p.estoque_atual <= p.estoque_minimo).length;
  document.getElementById('statSaidasHoje').textContent = movs.filter(m => m.tipo === 'SAIDA').length;

  const tbody = document.querySelector('#tabelaEstoqueBaixo tbody');
  tbody.innerHTML = produtos
   .filter(p => p.estoque_atual <= p.estoque_minimo)
   .map(p => `<tr>
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td class="estoque-baixo">${p.estoque_atual}</td>
      <td>${p.estoque_minimo}</td>
      <td><span class="estoque-baixo">Baixo</span></td>
    </tr>`).join('');
}

async function carregarProdutos() {
  const { data } = await supabase.from('produtos').select('*').order('nome');
  const tbody = document.querySelector('#tabelaProdutos tbody');
  tbody.innerHTML = data.map(p => `<tr>
    <td>${p.codigo}</td>
    <td>${p.nome}</td>
    <td>${p.categoria || '-'}</td>
    <td class="${p.estoque_atual <= p.estoque_minimo? 'estoque-baixo' : 'estoque-ok'}">${p.estoque_atual}</td>
    <td>${p.estoque_minimo}</td>
    <td><button class="btn btn-danger" style="width: auto; padding: 6px 12px;" onclick="excluirProduto(${p.id})">Excluir</button></td>
  </tr>`).join('');
}

async function carregarProdutosSelect(selectId) {
  const { data } = await supabase.from('produtos').select('*').order('nome');
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="">Selecione...</option>' +
    data.map(p => `<option value="${p.id}">${p.codigo} - ${p.nome} (Estoque: ${p.estoque_atual})</option>`).join('');
}

async function abrirModalProduto() {
  document.getElementById('modalProduto').classList.add('active');
}

async function salvarProduto() {
  const produto = {
    codigo: document.getElementById('prodCodigo').value,
    nome: document.getElementById('prodNome').value,
    categoria: document.getElementById('prodCategoria').value,
    unidade: document.getElementById('prodUnidade').value,
    estoque_atual: parseInt(document.getElementById('prodEstoque').value) || 0,
    estoque_minimo: parseInt(document.getElementById('prodMinimo').value) || 0
  };

  const { error } = await supabase.from('produtos').insert([produto]);
  if (error) {
    mostrarAlerta('alertContainer', 'Erro: ' + error.message, 'error');
  } else {
    mostrarAlerta('alertContainer', 'Produto cadastrado!', 'success');
    fecharModal('modalProduto');
    carregarProdutos();
  }
}

async function lancarSaida() {
  const produtoId = document.getElementById('saidaProduto').value;
  const qtd = parseInt(document.getElementById('saidaQtd').value);
  const motivo = document.getElementById('saidaMotivo').value;
  const obs = document.getElementById('saidaObs').value;

  if (!produtoId ||!qtd ||!motivo) {
    mostrarAlerta('alertContainer', 'Preencha todos os campos obrigatórios', 'error');
    return;
  }

  const { data: produto } = await supabase.from('produtos').select('*').eq('id', produtoId).single();
  if (produto.estoque_atual < qtd) {
    mostrarAlerta('alertContainer', 'Estoque insuficiente', 'error');
    return;
  }

  await supabase.from('produtos').update({ estoque_atual: produto.estoque_atual - qtd }).eq('id', produtoId);
  await supabase.from('movimentacoes').insert([{
    tipo: 'SAIDA',
    produto_id: produtoId,
    quantidade: qtd,
    usuario_id: usuarioAtual.id,
    motivo: motivo,
    observacao: obs
  }]);

  mostrarAlerta('alertContainer', 'Saída lançada com sucesso!', 'success');
  document.getElementById('saidaQtd').value = '';
  document.getElementById('saidaMotivo').value = '';
  document.getElementById('saidaObs').value = '';
  carregarDashboard();
}

async function lancarEntrada() {
  const produtoId = document.getElementById('entradaProduto').value;
  const qtd = parseInt(document.getElementById('entradaQtd').value);

  if (!produtoId ||!qtd) {
    mostrarAlerta('alertContainer', 'Preencha todos os campos', 'error');
    return;
  }

  const { data: produto } = await supabase.from('produtos').select('*').eq('id', produtoId).single();
  await supabase.from('produtos').update({ estoque_atual: produto.estoque_atual + qtd }).eq('id', produtoId);
  await supabase.from('movimentacoes').insert([{
    tipo: 'ENTRADA',
    produto_id: produtoId,
    quantidade: qtd,
    usuario_id: usuarioAtual.id,
    motivo: 'Reposição'
  }]);

  mostrarAlerta('alertContainer', 'Entrada lançada!', 'success');
  document.getElementById('entradaQtd').value = '';
  carregarDashboard();
}

async function carregarHistorico() {
  const { data } = await supabase
   .from('movimentacoes')
   .select('*, produtos(nome), usuarios(nome)')
   .order('criado_em', { ascending: false })
   .limit(100);

  const tbody = document.querySelector('#tabelaHistorico tbody');
  tbody.innerHTML = data.map(m => `<tr>
    <td>${new Date(m.criado_em).toLocaleString('pt-BR')}</td>
    <td>${m.tipo}</td>
    <td>${m.produtos?.nome || '-'}</td>
    <td>${m.quantidade}</td>
    <td>${m.usuarios?.nome || '-'}</td>
    <td>${m.motivo || '-'}</td>
  </tr>`).join('');
}

async function carregarUsuarios() {
  const { data } = await supabase.from('usuarios').select('*').order('nome');
  const tbody = document.querySelector('#tabelaUsuarios tbody');
  tbody.innerHTML = data.map(u => `<tr>
    <td>${u.nome}</td>
    <td>${u.email}</td>
    <td><span class="badge">${u.perfil}</span></td>
    <td>${u.ativo? 'Ativo' : 'Inativo'}</td>
    <td><button class="btn btn-danger" style="width: auto; padding: 6px 12px;" onclick="excluirUsuario(${u.id})">Excluir</button></td>
  </tr>`).join('');
}

function abrirModalUsuario() {
  document.getElementById('modalUsuario').classList.add('active');
}

async function salvarUsuario() {
  const user = {
    nome: document.getElementById('userNome').value,
    email: document.getElementById('userEmail').value,
    senha: document.getElementById('userSenha').value,
    perfil: document.getElementById('userPerfil').value
  };

  const { error } = await supabase.from('usuarios').insert([user]);
  if (error) {
    mostrarAlerta('alertContainer', 'Erro: ' + error.message, 'error');
  } else {
    mostrarAlerta('alertContainer', 'Usuário criado!', 'success');
    fecharModal('modalUsuario');
    carregarUsuarios();
  }
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('active');
}

async function excluirProduto(id) {
  if (!confirm('Excluir este produto?')) return;
  await supabase.from('produtos').delete().eq('id', id);
  carregarProdutos();
}

async function excluirUsuario(id) {
  if (!confirm('Excluir este usuário?')) return;
  await supabase.from('usuarios').delete().eq('id', id);
  carregarUsuarios();
}

// Realtime
supabase.channel('produtos-changes')
.on('postgres_changes', { event: '*', schema: 'public', table: 'produtos' }, () => {
    carregarDashboard();
    carregarProdutos();
  })
.subscribe();
</script>

</body>
</html> 
