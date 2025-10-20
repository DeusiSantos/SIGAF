import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Mail, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useFaturas } from '../../../hooks/useFaturas';

const GestaoDeFaturas = () => {
    const { faturas, loading, error, gerarFaturaAutomatica, gerarPDF } = useFaturas();
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (type, title, message) => {
        setToastMessage({ type, title, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    // Expor função para uso externo
    useEffect(() => {
        window.gerarFaturaAutomatica = gerarFaturaAutomatica;
    }, [gerarFaturaAutomatica]);

    // Toast Component
    const Toast = () => {
        if (!toastMessage) return null;

        const { type, title, message } = toastMessage;
        const bgColor = type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'bg-red-50 border-l-4 border-red-500 text-red-700';
        const icon = type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />;

        return (
            <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${bgColor}`}>
                <div className="flex items-center">
                    <div className="mr-3">{icon}</div>
                    <div>
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm mt-1">{message}</p>
                    </div>
                    <button
                        className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={() => setToastMessage(null)}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white rounded-t-xl">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">Gestão de Faturas</h1>
                                <p className="text-blue-100 mt-1">Faturas Pro-Forma geradas automaticamente</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FileText className="w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {loading && (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-500">Gerando fatura...</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <div className="flex">
                                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {faturas.length === 0 && !loading ? (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma fatura gerada</h3>
                                <p className="text-gray-500">As faturas serão geradas automaticamente quando novas amostras forem cadastradas.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {faturas.map(fatura => (
                                    <div key={fatura.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{fatura.numeroFatura}</h3>
                                                <p className="text-sm text-gray-500">{fatura.data}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-blue-600">{fatura.total.toLocaleString()} Kz</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700">{fatura.cliente.nome}</p>
                                            <p className="text-xs text-gray-500">{fatura.cliente.endereco}</p>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => gerarPDF(fatura)}
                                                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                    title="Baixar PDF"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => showToast('info', 'Funcionalidade', 'Envio por email será implementado em breve')}
                                                    className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                                    title="Enviar por Email"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => showToast('info', 'Funcionalidade', 'Visualização detalhada será implementada em breve')}
                                                    className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                Válida até {fatura.prazoValidade}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestaoDeFaturas;