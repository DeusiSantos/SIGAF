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
import MenuApoioFlorestal from './pages/ApoioAgricola/MenuApoioAgricola';
import InfraestruturaMenu from './Layout/other/IrrigacaoMenu';
import IrrigacaoMenu from './Layout/other/IrrigacaoMenu';
import TesteAmostrasSolo from './pages/InfraEstrutura/TesteAmostrasSolo';
import AmostrasDeSoloMenu from './Layout/other/AmostrasDeSoloMenu';
import SancoesMenu from './Layout/other/SancoesMenu';
import EmpresasMenu from './pages/SociedadeAgricola/EmpresasMenu';
import VisualizarProdutorFlorestal from './pages/VisualizarProdutorFlorestal';
import EntidadesAssociativasGestao from './pages/SociedadeAgricola/EntidadesAssociativasGestao';
import MenuEntrepostosMercado from './pages/EntrepostasMercado/MenuEntrepostasMercado';
import MenuSilos from './pages/SilosEArmazenamento/MenuSilos';
import VisualizarPraga from './pages/Pragas/VisualizarPraga';
import GestaoProdutoresFlorestaisMenu from './Layout/other/GestaoProdutoresFlorestaisMenu';

// Infraestrutura Agrícola
import IrrigacaoMenuAgricola from './pages/infraestruturaAgricola/IrrigacaoMenu';
import MenuSilosAgricola from './pages/infraestruturaAgricola/MenuSilos';
import MenuEntrepostosMercadoAgricola from './pages/infraestruturaAgricola/MenuEntrepostosMercado';
import MenuApoioAgricolaAgricola from './pages/infraestruturaAgricola/MenuApoioAgricola';

// Infraestrutura Florestal
import IrrigacaoMenuFlorestal from './pages/infraestruturaFlorestal/IrrigacaoMenu';
import MenuSilosFlorestal from './pages/infraestruturaFlorestal/MenuSilos';
import MenuEntrepostosMercadoFlorestal from './pages/infraestruturaFlorestal/MenuEntrepostosMercado';
import MenuApoioAgricolaFlorestal from './pages/infraestruturaFlorestal/MenuApoioAgricola';
import CooperativaMenuAgricola from './pages/SociedadeAgricola/CooperativaMenuAgricola';
import AssociacaoMenuAgricola from './pages/SociedadeAgricola/AssociacaoMenuAgricola';
import EmpresasMenuFlorestal from './pages/SociedadeAgricola/EmpresasMenuFlorestal';
import CooperativaMenuFlorestal from './pages/SociedadeAgricola/CooperativaMenuFlorestal';
import AssociacaoMenuFlorestal from './pages/SociedadeAgricola/AssociacaoMenuFlorestal';
import ValidacoesCerificadosFlorestaisMenu from './Layout/other/ValidacoesCerificadosFlorestaisMenu';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LoginPage />}></Route>
        <Route path="/GerenciaRNPA" element={<Layout />}>
          {/* Rota inicial - Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* =================================== */}
          {/* ROTAS GERAIS DO SISTEMA (mantidas) */}
          {/* =================================== */}
          
          {/* Rotas dos produtores (já existentes) */}
          <Route path="produtores/visualizar/:id" element={<VisualizarProdutor />} />
          <Route path="praga/visualizar/:id" element={<VisualizarPraga />} />
          <Route path="produtores/editar/:id" element={<h1>Editar Produtor</h1>} />
          <Route path="produtores/historico-producao/:id" element={<HistoricoProducao />} />
          <Route path="produtores/historico-beneficios/:id" element={<HistoricoBeneficios />} />
          <Route path="produtores/historico-producao/:id/novo" element={<AddHistoricoProducao />} />
          <Route path="produtores/gerar-cartao/:id" element={<GerarCartaoRNPA />} />
          <Route path="certificados/visualizar/:produtorId" element={<VisualizarCertificados />} />
          <Route path="incentivos/visualizar/:id" element={<VisualizarIncentivo />} />
          <Route path="produtores-florestais/visualizar/:id" element={<VisualizarProdutorFlorestal />} />
          <Route path="gestao-empresas/visualizar-empresa/:id" element={<VisualizarAssociacaoRural />} />

          {/* Rotas de gestão escolar (mantidas) */}
          <Route path="gestao-escolar/produtores" element={<h1 className="text-2xl font-semibold">Lista de Produtores</h1>} />
          <Route path="gestao-escolar/produtores/visualizar/:id" element={<VisualizarProdutor />} />
          <Route path="gestao-escolar/produtores/editar/:id" element={<h1>Editar Produtor</h1>} />
          <Route path="gestao-escolar/produtores/historico-producao/:id" element={<HistoricoProducao />} />
          <Route path="gestao-escolar/produtores/historico-beneficios/:id" element={<HistoricoBeneficios />} />
          <Route path="gestao-escolar/produtores/gerar-cartao/:id" element={<GerarCartaoRNPAAgricola />} />

          {/* Rotas de gestão cooperativa (mantidas) */}
          <Route path="gestao-cooperativa/cooperativa/visualizar/:id" element={<VisualizarCooperativa />} />

          {/* ======================================= */}
          {/* 1. PRODUTORES AGRÍCOLAS */}
          {/* ======================================= */}
          <Route path="gestao-agricultores">
            <Route index element={<GestaoAlunosMenu />} />
            {/* Produtores (com dropdown para Pessoal, Empresa, Cooperativa, Associação) */}
            <Route path="produtores" element={<GestaoAlunosMenu />} />
            <Route path="produtores/pessoal" element={<GestaoAlunosMenu />} />
            <Route path="produtores/empresa" element={<EmpresasMenu />} />
            <Route path="produtores/cooperativa" element={<CooperativaMenuAgricola />} />
            <Route path="produtores/associacao" element={<AssociacaoMenuAgricola />} />
            {/* Infraestrutura Agrícola */}
            <Route path="produtores/irrigacao" element={<IrrigacaoMenuAgricola />} />
            <Route path="produtores/silos-armazenamento" element={<MenuSilosAgricola />} />
            <Route path="produtores/entrepostosMercado" element={<MenuEntrepostosMercadoAgricola />} />
            <Route path="produtores/apoio-agricola" element={<MenuApoioAgricolaAgricola />} />
            <Route path="programas" element={<GestaoProgramasBeneficiosMenu />} />
             <Route path="programas-beneficios/visualizar/:id" element={<VisualizarProjeto />} />

            <Route path="incentivos" element={<IncentivoMenu />} />
           
            
            {/* Validação e Certificado */}
            <Route path="workflow" element={<ValidacoesCerificadosMenu />} />
            
            {/* Passe (Certificados) */}
            <Route path="certificados" element={<CertificadosGestao />} />
            
            {/* Outras rotas existentes */}
            <Route path="registo-individual" element={<h1 className="text-2xl font-semibold">Registo Individual de Produtor</h1>} />
            <Route path="registo-familiar" element={<h1 className="text-2xl font-semibold">Registo de Agregado Familiar</h1>} />
            <Route path="verificacao" element={<h1 className="text-2xl font-semibold">Certificação da Qualidade do Produto</h1>} />
            <Route path="geolocalizacao" element={<Geolocalizacao />} />
            <Route path="categorizacao" element={<h1 className="text-2xl font-semibold">Categorização Automática (UFPAs, Empreendimentos, Associações)</h1>} />
          </Route>

          {/* ======================================= */}
          {/* 2. FLORESTAIS */}
          {/* ======================================= */}
          <Route path="gestao-florestal">
            <Route index element={<GestaoProdutoresFlorestaisMenu />} />
            
            {/* Produtores (com dropdown para Pessoal, Empresa, Cooperativa, Associação) */}
            <Route path="produtores" element={<GestaoProdutoresFlorestaisMenu />} />
            <Route path="produtores/pessoal" element={<GestaoProdutoresFlorestaisMenu />} />
            <Route path="produtores/empresa" element={<EmpresasMenuFlorestal />} />
            <Route path="produtores/cooperativa" element={<CooperativaMenuFlorestal />} />
            <Route path="produtores/associacao" element={<AssociacaoMenuFlorestal />} />
             {/* Irrigação */}
            <Route path="produtores/irrigacao" element={<IrrigacaoMenuFlorestal />} />
             {/* Silos e Centro de Armazenamento */}
            <Route path="produtores/silos-armazenamento" element={<MenuSilosFlorestal />} />
            {/* Entrepostas e Mercado */}
            <Route path="produtores/entrepostosMercado" element={<MenuEntrepostosMercadoFlorestal />} />
            {/* Empresas de Apoio Agrícola */}
            <Route path="produtores/apoio-agricola" element={<MenuApoioAgricolaFlorestal />} />
            <Route path="programas" element={<GestaoProgramasBeneficiosMenu />} />
            <Route path="incentivos" element={<IncentivoMenu />} />
            
            {/* Validação e Certificado */}
            <Route path="workflow" element={<ValidarCerficacao />} />
            
            
            {/* Passe (Certificados) */}
            <Route path="certificados" element={<CertificadosGestao />} />
            
            {/* Certificação Florestal */}
            <Route path="certificacaoFlorestal" element={<ValidacoesCerificadosFlorestaisMenu />} />
            
            {/* Visualizar Produtor Florestal */}
            <Route path="visualizarprodutorflorestal/:id" element={<VisualizarProdutorFlorestal />} />
            
            {/* Outras rotas existentes */}
            <Route path="licencas" element={<LicencaMenu />} />
            <Route path="fiscalizacao" element={<GestaoFiscalizacao />} />
            <Route path="registo-individual" element={<h1 className="text-2xl font-semibold">Registo Individual de Produtor</h1>} />
            <Route path="registo-familiar" element={<h1 className="text-2xl font-semibold">Registo de Agregado Familiar</h1>} />
            <Route path="verificacao" element={<h1 className="text-2xl font-semibold">Certificação da Qualidade do Produto</h1>} />
            <Route path="geolocalizacao" element={<Geolocalizacao />} />
            <Route path="categorizacao" element={<h1 className="text-2xl font-semibold">Categorização Automática (UFPAs, Empreendimentos, Associações)</h1>} />
          </Route>

          {/* Transgreções/Sanções */}
          <Route path="sancoes">
            <Route index element={<SancoesMenu />} />
            <Route path="inserir" element={<GestaoMultasApreensoes />} />
            <Route path="historico" element={<HistoricoMultasApreensoes />} />
          </Route>

          {/* ======================================= */}
          {/* 3. INFRAESTRUTURA */}
          {/* ======================================= */}
          <Route path="gestao-infraestrutura">
            <Route index element={<MenuApoioFlorestal />} />
            
            {/* Irrigação */}
            <Route path="Irrigacao" element={<IrrigacaoMenu />} />
             {/* Silos e Centro de Armazenamento */}
            <Route path="silos-armazenamento" element={<MenuSilos />} />
            
            {/* Ciclos e Centro de Armazenamento + Entrepostas e Mercado */}
            <Route path="AmostrasDeSolo" element={<AmostrasDeSoloMenu />} />

            {/* Entrepostas e Mercado */ }
            <Route path="entrepostasMercado" element={<MenuEntrepostosMercado />} />
            {/* Empresas de Apoio Agrícola */}
            <Route path="apoio-agricola" element={<MenuApoioFlorestal />} />
            
            {/* Rotas adicionais */}
            <Route path="teste-amostras" element={<TesteAmostrasSolo />} />
          </Route>

          {/* ======================================= */}
          {/* 4. PAINEL E MONITORAMENTO */}
          {/* ======================================= */}
          <Route path="painel-monitoramento">
            <Route index element={<ControlePragasMenu />} />
            
            {/* Controle de Pragas, Meteorologia, Hidrografia */}
            <Route path="indicadores" element={<ControlePragasMenu />} />
            <Route path="controle-pragas" element={<ControlePragasMenu />} />
            <Route path="meteorologia" element={<ControlePragasMenu />} />
            <Route path="hidrografia" element={<ControlePragasMenu />} />
            
            {/* Outras rotas existentes */}
            <Route path="mapa" element={<h1 className="text-2xl font-semibold">Mapa Interactivo com Cobertura Territorial</h1>} />
            <Route path="relatorios" element={<h1 className="text-2xl font-semibold">Exportação de Relatórios Excel/PDF</h1>} />
            <Route path="provincias" element={<h1 className="text-2xl font-semibold">Análise por Província</h1>} />
            
            {/* Cadastro de Pragas */}
            <Route path="cadastro-pragas" element={<CadastroPragas />} />
          </Route>

          {/* ======================================= */}
          {/* 5. ENTIDADES ASSOCIATIVAS */}
          {/* ======================================= */}
          {/* <Route path="entidades-associativas">
            <Route index element={<GestaoEntidadesAssociativasMenu />} />
            
            {/* Cooperativas 
            <Route path="cooperativas" element={<GestaoEntidadesAssociativasMenu />} />
            <Route path="visualizar-cooperativa/:id" element={<VisualizarCooperativa />} />
            <Route path="cadastro-producao-cooperativa/:cooperativaId" element={<CadastroProducaoCooperativa />} />
            
            {/* Associações Rurais 
            <Route path="associacoes" element={<GestaoAssociacoesRuraisMenu />} />
            <Route path="visualizar-associacao/:id" element={<VisualizarAssociacaoRural />} />
            <Route path="cadastro-producao-associacoes/:cooperativaId" element={<CadastroProducaoAssociacao />} />
            
            {/* Empresas 
            <Route path="empresas" element={<EmpresasMenu />} />
            
            {/* Outras rotas existentes 
            <Route path="documentos" element={<h1 className="text-2xl font-semibold">Upload de Documentos Legais</h1>} />
            <Route path="membros" element={<h1 className="text-2xl font-semibold">Histórico de Membros</h1>} />
            <Route path="projectos" element={<h1 className="text-2xl font-semibold">Histórico de Projectos</h1>} />
          </Route> */}

          {/* ======================================= */}
          {/* 6. PROGRAMAS E BENEFÍCIOS */}
          {/* ======================================= */}
          {/* <Route path="programas-beneficios">
            <Route index element={<GestaoProgramasBeneficiosMenu />} />
            
            {/* Histórico/Cadastro de Programas 
            <Route path="historico" element={<GestaoProgramasBeneficiosMenu />} />
            <Route path="cadastrar" element={<CadastroProjetos />} />
            <Route path="visualizar/:id" element={<VisualizarProjeto />} />
            
            {/* Incentivos *
            <Route path="incentivos" element={<IncentivoMenu />} />
            
            {/* Outras rotas existentes *
            <Route path="insumos" element={<h1 className="text-2xl font-semibold">Integração com Módulos de Distribuição de Insumos</h1>} />
            <Route path="acompanhamento" element={<h1 className="text-2xl font-semibold">Acompanhamento de Beneficiários</h1>} />
          </Route> */}

          {/* ======================================= */}  
          {/* ROTAS ADICIONAIS (mantidas) */}


          
          {/* ======================================= */}

          {/* Gestão de Agentes de Campo */}
          <Route path="agentes-campo">
            <Route index element={<GestaoInqueridorMenu />} />
            <Route path="perfis" element={<GestaoInqueridorMenu />} />
            <Route path="territorios" element={<h1 className="text-2xl font-semibold">Atribuição de Territórios</h1>} />
            <Route path="interface-movel" element={<h1 className="text-2xl font-semibold">Interface Móvel para Recolha de Dados</h1>} />
            <Route path="recolha-dados" element={<h1 className="text-2xl font-semibold">Recolha de Dados em Campo (Online/Offline)</h1>} />
            <Route path="cobertura" element={<h1 className="text-2xl font-semibold">Monitoramento da Cobertura Geográfica</h1>} />
          </Route>

          {/* Validação e Certificação */}
          <Route path="validacao-certificacao">
            <Route index element={<ValidacoesCerificadosMenu />} />
            <Route path="workflow" element={<ValidacoesCerificadosMenu />} />
            <Route path="certificados" element={<h1 className="text-2xl font-semibold">Emissão de Certificado Digital de Agricultor Familiar</h1>} />
            <Route path="verificacao" element={<h1 className="text-2xl font-semibold">Verificação Pública via QR Code</h1>} />
            <Route path="aprovacoes" element={<h1 className="text-2xl font-semibold">Gestão de Aprovações</h1>} />
          </Route>

          {/* Gestão de Usuários e Perfis */}
          <Route path="usuarios-perfis">
            <Route index element={<h1 className="text-2xl font-semibold">Gestão de Usuários e Perfis</h1>} />
            <Route path="niveis-acesso" element={<h1 className="text-2xl font-semibold">Diferenciação por Níveis de Acesso (Nacional, Provincial, Municipal, Comunal)</h1>} />
            <Route path="permissoes" element={<h1 className="text-2xl font-semibold">Sistema de Permissões Detalhado</h1>} />
            <Route path="auditoria" element={<h1 className="text-2xl font-semibold">Auditoria de Acessos</h1>} />
            <Route path="gestao" element={<h1 className="text-2xl font-semibold">Gestão de Utilizadores</h1>} />
          </Route>

          {/* Documentação e Arquivo Digital */}
          <Route path="arquivo-digital">
            <Route path="upload" element={<h1 className="text-2xl font-semibold">Upload e Organização de Documentos</h1>} />
            <Route path="organizacao" element={<h1 className="text-2xl font-semibold">Organização de Documentos</h1>} />
            <Route path="pesquisa" element={<h1 className="text-2xl font-semibold">Pesquisa Avançada por CPF/NIF, Nome, Entidade, Localização</h1>} />
            <Route path="gestao" element={<h1 className="text-2xl font-semibold">Gestão de Arquivos</h1>} />
          </Route>

          {/* Helpdesk e Formação */}
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