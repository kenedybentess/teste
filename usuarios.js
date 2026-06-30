if (permissaoUsuario === 'admin') {
    const btnUsers = document.createElement('a');
    btnUsers.href = 'usuarios.html';
    btnUsers.className = 'btn-dashboard';
    btnUsers.style.marginLeft = '10px';
    btnUsers.innerText = '👥 Gerenciar Usuários';
    document.querySelector('.user-info').appendChild(btnUsers);
}