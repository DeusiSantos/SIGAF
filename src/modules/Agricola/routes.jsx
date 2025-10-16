import { Route } from 'react-router-dom';

// Menus
import AmostrasDeSoloMenu from '../../Layout/other/AmostrasDeSoloMenu';
import GestaoAlunosMenu from '../../Layout/other/GestaoAlunosMenu';
import GestaoProgramasBeneficiosMenu from '../../Layout/other/GestaoProgramasBeneficiosMenu';
import IncentivoMenu from '../../Layout/other/IncentivosMenu';
import IrrigacaoMenu from '../../Layout/other/IrrigacaoMenu';
import ValidacoesCerificadosMenu from '../../Layout/other/ValidacoesCerificadosMenu';
import AssociacaoMenuAgricola from './Menu/AssociacaoMenuAgricola';
import CooperativaMenuAgricola from './Menu/CooperativaMenuAgricola';
import EmpresasMenu from './Menu/EmpresasMenu';
import MenuApoioAgricolaAgricola from './Menu/MenuApoioAgricola';
import MenuEntrepostosMercadoAgricola from './Menu/MenuEntrepostosMercado';
import MenuInfraestruturaAgricola from './Menu/MenuInfraestruturaAgricola';
import MenuSilosAgricola from './Menu/MenuSilos';

// Laboratório de Solo Menus
import MetodosEnsaiosMenu from './Menu/MetodosEnsaiosMenu';
import AmostraSoloMenu from './Menu/AmostraSoloMenu';
import ResultadosAnalisesMenu from './Menu/ResultadosAnalisesMenu';
import RelatoriosLaudosMenu from './Menu/RelatoriosLaudosMenu';
import GestaoLaboratoriosMenu from './Menu/GestaoLaboratoriosMenu';
import CertificadosGestao from './pages/validacaoCertificado/CertificadosGestao';

// Componentes de Irrigação
import VisualizarIrrigacao from './pages/infraestrutura/Irrigacao/VisualizarIrrigacao';

// Componentes de Programas e Benefícios
import VisualizarProjeto from './pages/ProgramaBeneficio/VisualizarProjeto';

// Componentes de Amostras de Solo
import VisualizarAmostra from './pages/LaboratorioDeSolo/VisualizarAmostra';

// Geolocalização
import Geolocalizacao from '../../pages/Geolocalizacao';
import LancamentoResultadosSolo from './pages/LaboratorioDeSolo/LancamentoResultadosSolo';
import VisualizarIncentivo from './pages/incentivo/VisualizarIncentivo';
import VisualizarInfraestrutura from './pages/infraestrutura/infraestruturaDeApoio/VisualizarInfraestrutura';
import VisualizarSilos from './pages/infraestrutura/Silos/VisualizarSilos';
import ControlePragasMenu from './pages/PainelMonitoramento/ControlePragas/ControlePragasMenu';
import VisualizarPraga from './pages/PainelMonitoramento/ControlePragas/VisualizarPraga';
import VisualizarAssociacaoRural from './pages/produtores/empresas/VisualizarAssociacaoRural';
import VisualizarProdutor from './pages/produtores/pessoal/VisualizarProdutor';
import VisualizarCertificados from './pages/validacaoCertificado/VisualizarCertificados';
import AddHistoricoProducao from './public/AddHistoricoProducao';
import GerarCartaoRNPAAgricola from './public/GerarCartaoRNPAAgricola';
import HistoricoProducao from './public/HistoricoProducao';
import HistoricoEntidade from './public/HistoricoEntidade';
import AddHistoricoEntidade from './public/AddHistoricoEntidade';
import VisualizarOrganizacao from '@/pages/VisualizarOrganizacao';

const AgricolaRoutes = () => {
    return (
        <>
            <Route path="gestao-agricultores">
                <Route index element={<GestaoAlunosMenu />} />

                {/* ======================================= */}
                {/* PRODUTORES AGRÍCOLAS */}
                {/* ======================================= */}
                <Route path="produtores" element={<GestaoAlunosMenu />} />
                <Route path="produtores/pessoal" element={<GestaoAlunosMenu />} />
                <Route path="produtores/empresa" element={<EmpresasMenu />} />
                <Route path="produtores/cooperativa" element={<CooperativaMenuAgricola />} />
                <Route path="produtores/associacao" element={<AssociacaoMenuAgricola />} />
                <Route path="produtores/visualizar/:id" element={<VisualizarProdutor />} />
                <Route path="produtores/visualizar-entidade/:id" element={<VisualizarOrganizacao />} />
                <Route path="produtores/historico-producao/:id" element={<HistoricoProducao />} />
                <Route path="produtores/historico-entidade/:id" element={<HistoricoEntidade />} />
                <Route path="produtores/historico-producao/:id/novo" element={<AddHistoricoProducao />} />
                <Route path="produtores/historico-entidade/:id/novo" element={<AddHistoricoEntidade />} />
                <Route path="produtores/gerar-cartao/:id" element={<GerarCartaoRNPAAgricola />} />
                {/* ======================================= */}
                {/* INFRAESTRUTURA AGRÍCOLA */}
                {/* ======================================= */}

                <Route path="produtores/irrigacao" element={<IrrigacaoMenu />} />
                <Route path="produtores/irrigacao/visualizarirrigacao/:id" element={<VisualizarIrrigacao />} />
                <Route path="produtores/silos-armazenamento" element={<MenuSilosAgricola />} />
                <Route path="produtores/entrepostosMercado" element={<MenuEntrepostosMercadoAgricola />} />
                <Route path="produtores/apoio-agricola" element={<MenuApoioAgricolaAgricola />} />
                <Route path="produtores/infraestrutura-agricola" element={<MenuInfraestruturaAgricola />} />
                <Route path="produtores/infraestruturas/visualizar/:id" element={<VisualizarInfraestrutura />} />
                <Route path="produtores/silos-armazenamento/visualizar/:id" element={<VisualizarSilos />} />

                {/* ======================================= */}
                {/* PROGRAMAS E BENEFÍCIOS */}
                {/* ======================================= */}

                <Route path="programas" element={<GestaoProgramasBeneficiosMenu />} />
                <Route path="programas-beneficios/visualizar/:id" element={<VisualizarProjeto />} />

                {/* ======================================= */}
                {/* AMOSTRAS DE SOLO */}
                {/* ======================================= */}
                <Route path="AmostrasDeSolo" element={<AmostrasDeSoloMenu />} />
                <Route path="AmostraDeSolo/visualizar/:id" element={<VisualizarAmostra />} />
                <Route path="lancamento-resultados/:id" element={<LancamentoResultadosSolo />} />



                {/* ======================================= */}
                {/* INCENTIVOS */}
                {/* ======================================= */}
                <Route path="incentivos" element={<IncentivoMenu />} />
                <Route path="incentivos/visualizar/:id" element={<VisualizarIncentivo />} />

                {/* ======================================= */}
                {/* VALIDAÇÃO E CERTIFICADOS */}
                {/* ======================================= */}
                <Route path="workflow" element={<ValidacoesCerificadosMenu />} />
                <Route path="certificados" element={<CertificadosGestao />} />
                <Route path="certificados/visualizar/:produtorId" element={<VisualizarCertificados />} />

                {/* ======================================= */}
                {/* OUTRAS ROTAS */}
                {/* ======================================= */}

                <Route path="registo-individual" element={<h1 className="text-2xl font-semibold">Registo Individual de Produtor</h1>} />
                <Route path="registo-familiar" element={<h1 className="text-2xl font-semibold">Registo de Agregado Familiar</h1>} />
                <Route path="verificacao" element={<h1 className="text-2xl font-semibold">Certificação da Qualidade do Produto</h1>} />
                <Route path="geolocalizacao" element={<Geolocalizacao />} />
                <Route path="categorizacao" element={<h1 className="text-2xl font-semibold">Categorização Automática (UFPAs, Empreendimentos, Associações)</h1>} />
            </Route>

            {/* ======================================= */}
            {/* LABORATÓRIO DE SOLO - ROTAS PRINCIPAIS */}
            {/* ======================================= */}
            <Route path="LaboratorioDeSolo">
                <Route path="MetodosEnsaios" element={<MetodosEnsaiosMenu />} />
                <Route path="AmostraSolo" element={<AmostraSoloMenu />} />
                <Route path="ResultadosAnalises" element={<ResultadosAnalisesMenu />} />
                <Route path="RelatoriosLaudos" element={<RelatoriosLaudosMenu />} />
                <Route path="GestaoLaboratorios" element={<GestaoLaboratoriosMenu />} />
            </Route>

            <Route path="painel-monitoramento">
                <Route index element={<ControlePragasMenu />} />

                {/* Controle de Pragas, Meteorologia, Hidrografia */}
                <Route path="indicadores" element={<ControlePragasMenu />} />
                <Route path="controle-pragas" element={<ControlePragasMenu />} />
                <Route path="meteorologia" element={<ControlePragasMenu />} />
                <Route path="hidrografia" element={<ControlePragasMenu />} />
                <Route path="praga/visualizar/:id" element={<VisualizarPraga />} />

                {/* Outras rotas existentes */}
                <Route path="mapa" element={<h1 className="text-2xl font-semibold">Mapa Interactivo com Cobertura Territorial</h1>} />
                <Route path="relatorios" element={<h1 className="text-2xl font-semibold">Exportação de Relatórios Excel/PDF</h1>} />
                <Route path="provincias" element={<h1 className="text-2xl font-semibold">Análise por Província</h1>} />
            </Route>

        </>
    );
};

export default AgricolaRoutes;