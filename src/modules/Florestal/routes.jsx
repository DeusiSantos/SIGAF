import { Route } from 'react-router-dom';
import AmostrasDeSoloMenu from '../../Layout/other/AmostrasDeSoloMenu';
import GestaoProdutoresFlorestaisMenu from '../../Layout/other/GestaoProdutoresFlorestaisMenu';
import GestaoProgramasBeneficiosMenu from '../../Layout/other/GestaoProgramasBeneficiosMenu';
import SancoesMenu from '../../Layout/other/SancoesMenu';
import ValidacoesCerificadosFlorestaisMenu from '../../Layout/other/ValidacoesCerificadosFlorestaisMenu';
import GestaoFiscalizacao from '../../pages/Fiscalizacao/GestaoFiscalizacao';
import Geolocalizacao from '../../pages/Geolocalizacao';
import LicencaMenu from '../../pages/Licencas/LicencaMenu';
import VisualizarOrganizacao from '../../pages/VisualizarOrganizacao';
import LancamentoResultadosSolo from '../Agricola/pages/LaboratorioDeSolo/LancamentoResultadosSolo';
import VisualizarProjeto from '../Agricola/pages/ProgramaBeneficio/VisualizarProjeto';
import ArmazenamentoMenu from './Menu/ArmazenamentoMenu';
import AssociacaoMenuFlorestal from './Menu/AssociacaoMenuFlorestal';
import CooperativaMenuFlorestal from './Menu/CooperativaMenuFlorestal';
import EmpresasMenuFlorestal from './Menu/EmpresasMenuFlorestal';
import EntrepostosMercadoFlorestalMenu from './Menu/EntrepostosMercadoFlorestalMenu';
import MenuEmpresasApoio from './Menu/MenuEmpresasApoio';
import MenuInfraestruturaFlorestal from './Menu/MenuInfraestruturaFlorestal';
import CertificacaoProdutorFlorestal from './pages/CertificacaoProdutor/CertificacaoProdutorFlorestal';
import VisualizarCertificadosFlorestal from './pages/CertificacaoProdutor/VisualizarCertificadosFlorestal';
import AddHistoricoProducaoFlorestal from './pages/Produtores/Pessoal/AddHistoricoProducaoFlorestal';
import HistoricoProducaoFlorestal from './pages/Produtores/Pessoal/HistoricoProducaoFlorestal';
import VisualizarProdutorFlorestal from './pages/Produtores/Pessoal/VisualizarProdutorFlorestal';


const FlorestalRoutes = () => {
    return (
        <Route path="gestao-florestal">
            <Route index element={<GestaoProdutoresFlorestaisMenu />} />

            {/* ======================================= */}
            {/* PRODUTORES FLORESTAIS */}
            {/* ======================================= */}
            <Route path="produtores" element={<GestaoProdutoresFlorestaisMenu />} />
            <Route path="produtores/pessoal" element={<GestaoProdutoresFlorestaisMenu />} />
            <Route path="produtores/empresa" element={<EmpresasMenuFlorestal />} />
            <Route path="produtores/cooperativa" element={<CooperativaMenuFlorestal />} />
            <Route path="produtores/associacao" element={<AssociacaoMenuFlorestal />} />
            <Route path="certificacaoFlorestal" element={<ValidacoesCerificadosFlorestaisMenu />} />
            <Route path="produtores/historico-producao/:id" element={<HistoricoProducaoFlorestal />} />
            <Route path="produtores/historico-producao/:id/novo" element={<AddHistoricoProducaoFlorestal />} />

            {/* ======================================= */}
            {/* LICENÇAS E FISCALIZAÇÃO */}
            {/* ======================================= */}
            <Route path="licencas" element={<LicencaMenu />} />
            <Route path="fiscalizacao" element={<GestaoFiscalizacao />} />
            <Route path="produtores/gerar-licenca/:tipo/:id" element={<CertificacaoProdutorFlorestal />} />
            <Route path="produtores/visualizar-organizacao/:id" element={<VisualizarOrganizacao />} />

            {/* ======================================= */}
            {/* VISUALIZAR PRODUTOR */}
            {/* ======================================= */}

            <Route path="visualizarprodutorflorestal/:id" element={<VisualizarProdutorFlorestal />} />
            <Route path="visualizarCertificado/:produtorId" element={<VisualizarCertificadosFlorestal />} />
            <Route path="programas" element={<GestaoProgramasBeneficiosMenu />} />
            <Route path="programas-beneficios/visualizar/:id" element={<VisualizarProjeto />} />

            {/* ======================================= */}
            {/* INFRAESTRUTURA AGRÍCOLA */}
            {/* ======================================= */}

            <Route path="produtores/armazenamento" element={<ArmazenamentoMenu />} />
            <Route path="produtores/entrepostosMercado" element={<EntrepostosMercadoFlorestalMenu />} />
            <Route path="produtores/empresas-apoio-florestal" element={<MenuEmpresasApoio />} />
            <Route path="produtores/intraestrutura-apoio-florestal" element={<MenuInfraestruturaFlorestal />} />
            <Route path='sancoes' element={<SancoesMenu />} />

            {/* ======================================= */}
            {/* OUTRAS ROTAS */}
            {/* ======================================= */}



            <Route path="produtores/cadastro-producao-organizacao/:id" element={<HistoricoProducaoFlorestal />} />
            <Route path="produtores/historico-producao/:id/novo" element={<AddHistoricoProducaoFlorestal />} />


            <Route path="AmostrasDeSolo" element={<AmostrasDeSoloMenu />} />
            <Route path="lancamento-resultados/:id" element={<LancamentoResultadosSolo />} />
            <Route path="registo-individual" element={<h1 className="text-2xl font-semibold">Registo Individual de Produtor</h1>} />
            <Route path="registo-familiar" element={<h1 className="text-2xl font-semibold">Registo de Agregado Familiar</h1>} />
            <Route path="verificacao" element={<h1 className="text-2xl font-semibold">Certificação da Qualidade do Produto</h1>} />
            <Route path="geolocalizacao" element={<Geolocalizacao />} />
            <Route path="categorizacao" element={<h1 className="text-2xl font-semibold">Categorização Automática (UFPAs, Empreendimentos, Associações)</h1>} />
        </Route>
    );
};

export default FlorestalRoutes;