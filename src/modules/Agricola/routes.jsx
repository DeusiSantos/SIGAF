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
import CertificadosGestao from './pages/validacaoCertificado/CertificadosGestao';

// Componentes de Irrigação
import VisualizarIrrigacao from './pages/infraestrutura/Irrigacao/VisualizarIrrigacao';

// Componentes de Programas e Benefícios
import VisualizarProjeto from './pages/ProgramaBeneficio/VisualizarProjeto';

// Componentes de Amostras de Solo
import VisualizarAmostra from './pages/AmostraSolo/VisualizarAmostra';

// Geolocalização
import Geolocalizacao from '../../pages/Geolocalizacao';
import VisualizarAssociacaoRural from './pages/produtores/empresas/VisualizarAssociacaoRural';
import VisualizarProdutor from './pages/produtores/pessoal/VisualizarProdutor';

const AgricolaRoutes = () => {
    return (
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
            <Route path="gestao-empresas/visualizar-empresa/:id" element={<VisualizarAssociacaoRural />} />

            {/* ======================================= */}
            {/* INFRAESTRUTURA AGRÍCOLA */}
            {/* ======================================= */}

            <Route path="produtores/irrigacao" element={<IrrigacaoMenu />} />
            <Route path="produtores/irrigacao/visualizarirrigacao/:id" element={<VisualizarIrrigacao />} />
            <Route path="produtores/silos-armazenamento" element={<MenuSilosAgricola />} />
            <Route path="produtores/entrepostosMercado" element={<MenuEntrepostosMercadoAgricola />} />
            <Route path="produtores/apoio-agricola" element={<MenuApoioAgricolaAgricola />} />
            <Route path="produtores/infraestrutura-agricola" element={<MenuInfraestruturaAgricola />} />

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

            {/* ======================================= */}
            {/* INCENTIVOS */}
            {/* ======================================= */}
            <Route path="incentivos" element={<IncentivoMenu />} />

            {/* ======================================= */}
            {/* VALIDAÇÃO E CERTIFICADOS */}
            {/* ======================================= */}
            <Route path="workflow" element={<ValidacoesCerificadosMenu />} />
            <Route path="certificados" element={<CertificadosGestao />} />

            {/* ======================================= */}
            {/* OUTRAS ROTAS */}
            {/* ======================================= */}
            <Route path="registo-individual" element={<h1 className="text-2xl font-semibold">Registo Individual de Produtor</h1>} />
            <Route path="registo-familiar" element={<h1 className="text-2xl font-semibold">Registo de Agregado Familiar</h1>} />
            <Route path="verificacao" element={<h1 className="text-2xl font-semibold">Certificação da Qualidade do Produto</h1>} />
            <Route path="geolocalizacao" element={<Geolocalizacao />} />
            <Route path="categorizacao" element={<h1 className="text-2xl font-semibold">Categorização Automática (UFPAs, Empreendimentos, Associações)</h1>} />
        </Route>
    );
};

export default AgricolaRoutes;