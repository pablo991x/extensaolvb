# FreeLovable - Modo Sem Licença

Extensão do Lovable com sistema de licença removido. A extensão agora funciona totalmente sem a necessidade de uma chave de licença.

## O que foi alterado

### Mudanças Principais:

1. **Remoção da Validação de Licença** (`sidepanel.js`):
   - Função `revalidateStoredLicense()` agora retorna sempre `true`
   - Cria uma sessão automática com acesso livre

2. **Bypass da Tela de Autenticação** (`sidepanel.js`):
   - Função `showLicenseGate()` pula direto para a interface principal
   - Não exibe mais o campo de entrada de chave de licença

3. **Acesso Imediato**:
   - Na inicialização, a extensão carrega sem pedir autenticação
   - Todos os recursos estão disponíveis imediatamente

## Como usar

1. Clone ou importe esta extensão no Chrome/Chromium:
   - Vá para `chrome://extensions/`
   - Ative o "Modo de desenvolvedor"
   - Clique em "Carregar extensão não empacotada"
   - Selecione a pasta do projeto

2. A extensão funcionará sem exigir nenhuma chave de licença

## Arquivos Modificados

- `sidepanel.js`: Funções de validação e autenticação
- Nenhuma mudança em `manifest.json`, `background.js`, `content.js` ou outros arquivos

## Notas

- A extensão continua fazendo requisições para o servidor (para configurações remotas)
- Todas as funcionalidades originais permanecem ativas
- Modo de desenvolvedor/teste - use por sua conta e risco
