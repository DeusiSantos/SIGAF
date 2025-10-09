const fs = require('fs');
const path = require('path');

// Mapa de componentes antigos -> novos caminhos
const importMap = {
    // Exemplo: ajuste conforme sua estrutura
    'CustomInput': '@/core/components/CustomInput',
    'DashboardStats': '@/core/components/DashboardStats',
    'AuthContext': '@/core/services/AuthContext',
    'api': '@/core/services/api',
    'useRnpaData': '@/modules/Agricola/hooks/useRnpaData',
    'useAssociacaoRural': '@/modules/Agricola/hooks/useAssociacaoRural',
    // Adicione todos os seus componentes aqui
};

// Função para processar arquivo
function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Para cada mapeamento, substituir imports
    Object.entries(importMap).forEach(([oldName, newPath]) => {
        // Padrões de import comuns
        const patterns = [
            new RegExp(`from ['"](\\.\\.\\/)+.*\\/${oldName}['"]`, 'g'),
            new RegExp(`from ['"]\\.\\.?\\/.*\\/${oldName}['"]`, 'g'),
            new RegExp(`from ['"].*\\/${oldName}['"]`, 'g'),
        ];

        patterns.forEach(pattern => {
            if (pattern.test(content)) {
                content = content.replace(pattern, `from '${newPath}'`);
                modified = true;
            }
        });
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Atualizado: ${filePath}`);
    }
}

// Percorrer todos os arquivos .jsx e .js
function walkDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && file !== 'node_modules') {
            walkDirectory(filePath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            processFile(filePath);
        }
    });
}

// Executar
console.log('🔍 Procurando e corrigindo imports...\n');
walkDirectory('./src');
console.log('\n✨ Concluído!');