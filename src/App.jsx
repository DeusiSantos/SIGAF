import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Layout from './Layout/layout';
import VisualizarProdutor from './pages/public/VisualizarProdutor';
import GerarCartaoRNPA from './pages/public/GerarCartaoRNPA';
import HistoricoProducao from './pages/public/HistoricoProducao';
import HistoricoBeneficios from './pages/public/HistoricoBeneficios';
import GestaoAlunosMenu from './Layout/other/GestaoAlunosMenu';
import Geolocalizacao from './pages/Geolocalizacao';
import GestaoInqueridorMenu from './Layout/other/GestaoInqueridorMenu';
import GestaoEntidadesAssociativasMenu from './Layout/other/GestaoEntidadesAssociativasMenu';
import GerarCartaoRNPAAgricola from './pages/public/GerarCartaoRNPAAgricola';
import LoginPage from './pages/LoginPage';
import GestaoAssociacoesRuraisMenu from './Layout/other/GestaoAssociacoesRuraisMenu';
import ValidacoesCerificadosMenu from './Layout/other/ValidacoesCerificadosMenu';
import GestaoProgramasBeneficiosMenu from './Layout/other/GestaoProgramasBeneficiosMenu';
import CadastroProducaoCooperativa from './pages/SociedadeAgricola/CadastroProducaoCooperativa';
import CadastroProducaoAssociacao from './pages/SociedadeAgricola/CadastroProducaoAssociacao';
import VisualizarCertificados from './pages/public/VisualizarCertificados';

import IncentivoMenu from './Layout/other/IncentivosMenu';
import VisualizarProjeto from './pages/Programas-e-Benefícios/VisualizarProjeto';
import GestaoProjetos from './pages/Programas-e-Benefícios/GestaoProjetos';
import CadastroProjetos from './pages/Programas-e-Benefícios/CadastroProjetos';

import CadastroPragas from './pages/Pragas/CadastroPragas';
import ControlePragasMenu from './Layout/other/ControlePragasMenu';
import CertificadosGestao from './pages/CertificadosGestao';
import ValidarCerficacao from './pages/Validação e Certifica/validarCerficacao';
import VisualizarCooperativa from './pages/public/VisualizarCooperativa';
import VisualizarAssociacaoRural from './pages/SociedadeAgricola/VisualizarAssociacaoRural';
import VisualizarIncentivo from './pages/public/VisualizarIncentivo';
import AddHistoricoProducao from './pages/public/AddHistoricoProducao';
import CertificacaoProdutorFlorestal from './pages/CertificacaoProdutorFlorestal';
import GestaoProdutoresFlorestais from './pages/GestaoProdutoresFlorestais';
import LicencaMenu from './pages/Licencas/LicencaMenu';
import GestaoFiscalizacao from './pages/Fiscalizacao/GestaoFiscalizacao';
import HistoricoMultasApreensoes from './pages/Sancoes/HistoricoMultasApreensoes';
import GestaoMultasApreensoes from './pages/Sancoes/GestaoMultasApreensoes';
import VisualizarProdutorFlorestal from './pages/VisualizarProdutorFlorestal';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LoginPage />}></Route>
        <Route path="/GerenciaRNPA" element={<Layout />}>
          {/* Rota inicial */}
          <Route index element={<Dashboard />} />

          {/* Rotas dos produtores (já existentes) */}
          <Route path="produtores/visualizar/:id" element={<VisualizarProdutor />} />
          <Route path="produtores/editar/:id" element={<h1>Editar Produtor</h1>} />
          <Route path="produtores/historico-producao/:id" element={<HistoricoProducao />} />
          <Route path="produtores/historico-beneficios/:id" element={<HistoricoBeneficios />} />
          <Route path="produtores/historico-producao/:id/novo" element={<AddHistoricoProducao />} />
          <Route path="gestao-escolar/produtores" element={<h1 className="text-2xl font-semibold">Lista de Produtores</h1>} />
          <Route path="gestao-escolar/produtores/visualizar/:id" element={<VisualizarProdutor />} />
          <Route path="gestao-escolar/produtores/editar/:id" element={<h1>Editar Produtor</h1>} />
          <Route path="gestao-cooperativa/cooperativa/visualizar/:id" element={<VisualizarCooperativa />} />
          <Route path="gestao-escolar/produtores/historico-producao/:id" element={<HistoricoProducao />} />
          <Route path="gestao-escolar/produtores/historico-beneficios/:id" element={<HistoricoBeneficios />} />
          <Route path="gestao-escolar/produtores/gerar-cartao/:id" element={<GerarCartaoRNPAAgricola />} />
          <Route path="produtores/gerar-cartao/:id" element={<GerarCartaoRNPA />} />
          <Route path="certificados/visualizar/:produtorId" element={<VisualizarCertificados />} />
          <Route path="incentivos/visualizar/:id" element={<VisualizarIncentivo />} />

          {/* Rotas dos produtores Florestais */}
          {/* Dashboard */}
          <Route path="/GerenciaRNPA/dashboard">
            <Route index element={<Dashboard />} />
          </Route>

          {/* 1. Gestão de Agricultores */}
          <Route path="gestao-agricultores">
            <Route index element={<GestaoAlunosMenu />} />
            <Route path="produtores" element={<GestaoAlunosMenu />} />
            <Route path="registo-individual" element={<h1 className="text-2xl font-semibold">Registo Individual de Produtor</h1>} />
            <Route path="registo-familiar" element={<h1 className="text-2xl font-semibold">Registo de Agregado Familiar</h1>} />
            <Route path="workflow" element={<ValidarCerficacao />} />
            <Route path="certificados" element={<CertificadosGestao />} />
            <Route path="verificacao" element={<h1 className="text-2xl font-semibold">Certificação da Qualidade do Produto</h1>} />
            <Route path="geolocalizacao" element={<Geolocalizacao />} />
            <Route path="categorizacao" element={<h1 className="text-2xl font-semibold">Categorização Automática (UFPAs, Empreendimentos, Associações)</h1>} />
          </Route>

          {/* 1. Gestão Florestal */}
          <Route path="gestao-florestal">
            <Route index element={<GestaoProdutoresFlorestais />} />
            <Route path="produtoresflorestais" element={<GestaoProdutoresFlorestais />} />
            <Route path="licencas" element={<LicencaMenu />} />
            <Route path="fiscalizacao" element={<GestaoFiscalizacao />} />
            <Route path='visualizarprodutorflorestal/:id' element={<VisualizarProdutorFlorestal />} />
            <Route path="certificacaoFlorestal" element={< CertificacaoProdutorFlorestal />} />
            <Route path="registo-individual" element={<h1 className="text-2xl font-semibold">Registo Individual de Produtor</h1>} />
            <Route path="registo-familiar" element={<h1 className="text-2xl font-semibold">Registo de Agregado Familiar</h1>} />
            <Route path="workflow" element={<ValidarCerficacao />} />
            <Route path="certificados" element={<CertificadosGestao />} />
            <Route path="verificacao" element={<h1 className="text-2xl font-semibold">Certificação da Qualidade do Produto</h1>} />
            <Route path="geolocalizacao" element={<Geolocalizacao />} />
            <Route path="categorizacao" element={<h1 className="text-2xl font-semibold">Categorização Automática (UFPAs, Empreendimentos, Associações)</h1>} />
          </Route>

          <Route path="sancoes">
            <Route index element={<HistoricoMultasApreensoes />} />
            <Route path="inserir" element={<HistoricoMultasApreensoes />} />
            <Route path="historico" element={< GestaoMultasApreensoes />} />
          </Route>

          {/* 2. Gestão de Entidades Associativas */}
          <Route path="entidades-associativas">
            <Route index element={<GestaoEntidadesAssociativasMenu />} />
            <Route path="cooperativas" element={<GestaoEntidadesAssociativasMenu />} />
            <Route path="cadastro-producao-cooperativa/:cooperativaId" element={<CadastroProducaoCooperativa />} />
            <Route path="associacoes" element={<GestaoAssociacoesRuraisMenu />} />
            <Route path="cadastro-producao-associacoes/:cooperativaId" element={<CadastroProducaoAssociacao />} />
            <Route path="visualizar-associacao/:id" element={<VisualizarAssociacaoRural />} />
            <Route path="documentos" element={<h1 className="text-2xl font-semibold">Upload de Documentos Legais</h1>} />
            <Route path="membros" element={<h1 className="text-2xl font-semibold">Histórico de Membros</h1>} />
            <Route path="projectos" element={<h1 className="text-2xl font-semibold">Histórico de Projectos</h1>} />
            <Route path="visualizar-cooperativa/:id" element={<VisualizarCooperativa />} />
          </Route>

          {/* 3. Gestão de Agentes de Campo */}
          <Route path="agentes-campo">
            <Route index element={<GestaoInqueridorMenu />} />
            <Route path="perfis" element={<GestaoInqueridorMenu />} />
            <Route path="territorios" element={<h1 className="text-2xl font-semibold">Atribuição de Territórios</h1>} />
            <Route path="interface-movel" element={<h1 className="text-2xl font-semibold">Interface Móvel para Recolha de Dados</h1>} />
            <Route path="recolha-dados" element={<h1 className="text-2xl font-semibold">Recolha de Dados em Campo (Online/Offline)</h1>} />
            <Route path="cobertura" element={<h1 className="text-2xl font-semibold">Monitoramento da Cobertura Geográfica</h1>} />
          </Route>

          {/* 4. Validação e Certificação */}
          <Route path="validacao-certificacao">
            <Route index element={<ValidacoesCerificadosMenu />} />
            <Route path="workflow" element={<ValidacoesCerificadosMenu />} />
            <Route path="certificados" element={<h1 className="text-2xl font-semibold">Emissão de Certificado Digital de Agricultor Familiar</h1>} />
            <Route path="verificacao" element={<h1 className="text-2xl font-semibold">Verificação Pública via QR Code</h1>} />
            <Route path="aprovacoes" element={<h1 className="text-2xl font-semibold">Gestão de Aprovações</h1>} />
          </Route>

          {/* 5. Painel de Monitoramento */}
          <Route path="painel-monitoramento">
            <Route index element={<ControlePragasMenu />} />
            <Route path="indicadores" element={<ControlePragasMenu />} />
            <Route path="mapa" element={<h1 className="text-2xl font-semibold">Mapa Interactivo com Cobertura Territorial</h1>} />
            <Route path="relatorios" element={<h1 className="text-2xl font-semibold">Exportação de Relatórios Excel/PDF</h1>} />
            <Route path="provincias" element={<h1 className="text-2xl font-semibold">Análise por Província</h1>} />
          </Route>

          {/* 6. Gestão de Programas e Benefícios */}

          <Route path="programas-beneficios">
            <Route index element={<GestaoProgramasBeneficiosMenu />} />
            <Route path="historico" element={<GestaoProgramasBeneficiosMenu />} />
            <Route path="incentivos" element={<IncentivoMenu />} />
            <Route path="insumos" element={<h1 className="text-2xl font-semibold">Integração com Módulos de Distribuição de Insumos</h1>} />
            <Route path="acompanhamento" element={<h1 className="text-2xl font-semibold">Acompanhamento de Beneficiários</h1>} />
          </Route>
          <Route path="programas-beneficios" element={<GestaoProgramasBeneficiosMenu />} />
          <Route path="programas-beneficios/cadastrar" element={<CadastroProjetos />} />
          <Route path="programas-beneficios/visualizar/:id" element={<VisualizarProjeto />} />

          {/* 7. Gestão de Usuários e Perfis */}
          <Route path="usuarios-perfis">
            <Route index element={<h1 className="text-2xl font-semibold">Gestão de Usuários e Perfis</h1>} />
            <Route path="niveis-acesso" element={<h1 className="text-2xl font-semibold">Diferenciação por Níveis de Acesso (Nacional, Provincial, Municipal, Comunal)</h1>} />
            <Route path="permissoes" element={<h1 className="text-2xl font-semibold">Sistema de Permissões Detalhado</h1>} />
            <Route path="auditoria" element={<h1 className="text-2xl font-semibold">Auditoria de Acessos</h1>} />
            <Route path="gestao" element={<h1 className="text-2xl font-semibold">Gestão de Utilizadores</h1>} />
          </Route>

          {/* 8. Documentação e Arquivo Digital */}
          <Route path="arquivo-digital">
            <Route index element={<h1 className="text-2xl font-semibold">Documentação e Arquivo Digital</h1>} />
            <Route path="upload" element={<h1 className="text-2xl font-semibold">Upload e Organização de Documentos</h1>} />
            <Route path="organizacao" element={<h1 className="text-2xl font-semibold">Organização de Documentos</h1>} />
            <Route path="pesquisa" element={<h1 className="text-2xl font-semibold">Pesquisa Avançada por CPF/NIF, Nome, Entidade, Localização</h1>} />
            <Route path="gestao" element={<h1 className="text-2xl font-semibold">Gestão de Arquivos</h1>} />
          </Route>

          {/* 9. Helpdesk e Formação */}
          <Route path="helpdesk-formacao">
            <Route index element={<h1 className="text-2xl font-semibold">Helpdesk e Formação</h1>} />
            <Route path="tickets" element={<h1 className="text-2xl font-semibold">Sistema de Tickets para Suporte</h1>} />
            <Route path="conhecimento" element={<h1 className="text-2xl font-semibold">Base de Conhecimento</h1>} />
            <Route path="materiais" element={<h1 className="text-2xl font-semibold">Materiais de Formação para Agentes</h1>} />
            <Route path="suporte" element={<h1 className="text-2xl font-semibold">Suporte aos Agentes de Campo</h1>} />
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<h1 className="text-2xl font-semibold text-green-600">Página não encontrada - Sistema RNPA</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;