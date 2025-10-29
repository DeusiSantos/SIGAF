import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, AlertCircle, CheckCircle, Sprout, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import emblema from '../assets/emblema.png'
import Imagem2 from '../assets/imageLogin.jpeg'
import IDA from '../assets/IDA.png'
import ISV from '../assets/ISV.png'
import SIGAF from '../assets/SIGAF.png'

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear message when user starts typing
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };

    const fillTestCredentials = () => {
        setFormData({
            email: 'admin@rnpa.gov.ao',
            password: 'senha123'
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        // Credenciais de teste
        const TEST_EMAIL = 'admin@rnpa.gov.ao';
        const TEST_PASSWORD = 'senha123';

        try {
            // Validate inputs
            if (!formData.email || !formData.password) {
                setMessage({
                    type: 'error',
                    text: 'Por favor, preencha todos os campos'
                });
                setIsLoading(false);
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setMessage({
                    type: 'error',
                    text: 'Por favor, insira um email válido'
                });
                setIsLoading(false);
                return;
            }

            // Simulate login process
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Validate credentials
            if (formData.email === TEST_EMAIL && formData.password === TEST_PASSWORD) {
                setMessage({
                    type: 'success',
                    text: 'Login realizado com sucesso! Redirecionando...'
                });

                // Redirect after a short delay
                setTimeout(() => {
                    navigate('/GerenciaSIGAF');
                }, 1000);
            } else {
                setMessage({
                    type: 'error',
                    text: 'Credenciais inválidas. Use: admin@rnpa.gov.ao / rnpa2024'
                });
            }

        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Erro no login. Tente novamente.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const MessageAlert = ({ type, text }) => {
        if (!text) return null;

        const bgColor = type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                'bg-yellow-50 border-yellow-200 text-yellow-800';

        const Icon = type === 'error' ? AlertCircle :
            type === 'success' ? CheckCircle :
                AlertCircle;

        return (
            <div className={`flex items-center space-x-2 p-3 rounded-lg border ${bgColor} text-sm`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{text}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col lg:flex-row">
            {/* Login Form Section */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-8 lg:p-12">
                <div className="w-full bg-white rounded-xl shadow-lg p-8 max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <img src={emblema} alt="Emblema do Governo de Angola" className="w-20 h-20" />
                        </div>
                        <h1 className="text-sm text-gray-600 font-medium">
                            REPÚBLICA DE ANGOLA
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            MINISTÉRIO DA AGRICULTURA E FLORESTAS
                        </p>

                    </div>

                    {/* Login Form */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                        placeholder="seu.email@exemplo.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                        placeholder="Digite sua senha"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Message Display */}
                        {message.text && (
                            <MessageAlert type={message.type} text={message.text} />
                        )}

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Entrando...</span>
                                </>
                            ) : (
                                <>
                                    <User className="w-5 h-5" />
                                    <span>Entrar</span>
                                </>
                            )}
                        </button>

                        {/* Test Credentials Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-blue-800">
                                    Credenciais de Teste
                                </h4>
                                <button
                                    type="button"
                                    onClick={fillTestCredentials}
                                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                                    disabled={isLoading}
                                >
                                    Preencher
                                </button>
                            </div>
                            <div className="space-y-1 text-sm text-blue-700">
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <span className="font-mono">admin@rnpa.gov.ao</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Lock className="w-4 h-4" />
                                    <span className="font-mono">rnpa2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                                disabled={isLoading}
                            >
                                Esqueceu sua senha?
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Welcome Banner Section */}
            <div className="bgImage w-full lg:w-1/2 flex justify-center items-center p-4 md:p-8 lg:p-0 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30s-13.431 30-30 30S0 46.569 0 30 13.431 0 30 0zm0 6C17.85 6 8 15.85 8 28s9.85 22 22 22 22-9.85 22-22S42.15 6 30 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }} />
                </div>

                <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl max-w-lg w-full m-4 relative z-10">
                    <div className="text-center space-y-6">
                        {/* Main Image Placeholder */}
                        <div className="w-full h-48 rounded-lg flex items-center justify-center">
                            <div className="text-center flex justify-center items-center space-y-2">
                                <img src={SIGAF} className=' w-[200px]' alt="" srcset="" />
                            </div>
                        </div>

                        {/* Divider */}
                        {/* Divider com texto e estilo profissional */}
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium"></span>
                            </div>
                        </div>

                        {/* Partner Logos Placeholder */}
                        {/* <div className="flex justify-center items-center gap-8">
                            <img src={IDA} className='w-20' alt="" srcset="" />

                            <img src={ISV} className='w-20' alt="" srcset="" />

                        </div> */}

                        {/* Description */}
                        <div className="text-sm text-gray-600 font-medium border-t border-green-100 pt-6">
                            <h3 className="font-bold text-gray-800 mb-2">SIGAF - Sistema Nacional</h3>
                            <p>Sistema Integrado de Gestão De Agro-Florestal</p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Gestão Integrada de Produtores</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Monitoramento Territorial</span>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;