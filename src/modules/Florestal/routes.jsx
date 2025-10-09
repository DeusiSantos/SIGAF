import { Route } from 'react-router-dom';
import GestaoProdutoresFlorestaisMenu from '../../Layout/other/GestaoProdutoresFlorestaisMenu';
import ValidacoesCerificadosFlorestaisMenu from '../../Layout/other/ValidacoesCerificadosFlorestaisMenu';
import GestaoFiscalizacao from '../../pages/Fiscalizacao/GestaoFiscalizacao';
import Geolocalizacao from '../../pages/Geolocalizacao';
import LicencaMenu from '../../pages/Licencas/LicencaMenu';
import VisualizarProdutorFlorestal from '../../pages/VisualizarProdutorFlorestal';
import AssociacaoMenuFlorestal from './Menu/AssociacaoMenuFlorestal';
import CooperativaMenuFlorestal from './Menu/CooperativaMenuFlorestal';
import EmpresasMenuFlorestal from './Menu/EmpresasMenuFlorestal';


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

            {/* ======================================= */}
            {/* LICENÇAS E FISCALIZAÇÃO */}
            {/* ======================================= */}
            <Route path="licencas" element={<LicencaMenu />} />
            <Route path="fiscalizacao" element={<GestaoFiscalizacao />} />

            {/* ======================================= */}
            {/* VISUALIZAR PRODUTOR */}
            {/* ======================================= */}
            <Route path="visualizarprodutorflorestal/:id" element={<VisualizarProdutorFlorestal />} />

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

export default FlorestalRoutes;