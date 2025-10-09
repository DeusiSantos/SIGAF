import { Lock, LogIn, Mail, User } from 'lucide-react';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { TabPanel, TabView } from 'primereact/tabview';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoAngola.png';
import CustomInput from '../../core/components/CustomInput';
import { useAuth } from '../../services/AuthContext copy';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(null);
    const [message, setMessage] = useState({ severity: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const roleOptions = [
        { label: 'Administração Nacional', value: 'nacional' },
        { label: 'Administração Regional', value: 'regional' },
        { label: 'Administração do Núcleo', value: 'nucleo' },
        { label: 'Administração do Agrupamento', value: 'agrupamento' },
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ severity: '', text: '' });

        try {
            // Validate inputs
            if (!email || !password || !role) {
                setMessage({
                    severity: 'warn',
                    text: 'Por favor, preencha todos os campos'
                });
                setIsLoading(false);
                return;
            }

            // Attempt login
            const roleValue = role.value;
            const user = await login(email, password, roleValue);

            // Navigate based on user role
            switch (user.role) {
                case 'nacional':
                    navigate('/nacional/dashboard/visao-geral');
                    break;
                case 'regional':
                    navigate('/regional/dashboard/visao-geral');
                    break;
                case 'agrupamento':
                    navigate('/agrupamento/dashboard/visao-geral');
                    break;
                case 'nucleo':
                    navigate('/nucleo/dashboard/visao-geral');
                    break;
                default:
                    setMessage({
                        severity: 'error',
                        text: 'Função de usuário não reconhecida'
                    });
            }
        } catch (error) {
            // Handle login errors
            setMessage({
                severity: 'error',
                text: error.response?.data?.message || 'Erro de login. Verifique suas credenciais.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
            {/* Login Form Section */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-8 lg:p-12 bg-white">
                <div className="w-full max-w-md">
                    <Card className="shadow-xl border-0 rounded-xl overflow-hidden">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <div className="p-2 bg-white rounded-full shadow-md inline-flex">
                                    <img
                                        src={logo}
                                        alt="AEA Logo"
                                        className="w-24 h-24 md:w-32 md:h-32 object-contain"
                                    />
                                </div>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold mt-4 text-gray-800">
                                Associação de Escuteiros de Angola
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">Sistema de Gestão de Unidades</p>
                        </div>

                        <TabView className="mt-6">
                            <TabPanel header="Login">
                                <form onSubmit={handleLogin} className="space-y-6 mt-4">
                                    <div>
                                        <CustomInput
                                            type="text"
                                            placeholder="Digite seu email"
                                            value={email}
                                            onChange={(value) => setEmail(value)}
                                            iconStart={<Mail size={18} className="text-gray-500" />}
                                            required
                                            label="Email"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <CustomInput
                                            type="password"
                                            placeholder="Digite sua senha"
                                            value={password}
                                            onChange={(value) => setPassword(value)}
                                            iconStart={<Lock size={18} className="text-gray-500" />}
                                            required
                                            label="Senha"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <CustomInput
                                            type="select"
                                            placeholder="Escolha a função"
                                            value={role}
                                            onChange={(value) => setRole(value)}
                                            iconStart={<User size={18} className="text-gray-500" />}
                                            options={roleOptions}
                                            required
                                            label="Função"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg transition-colors duration-300 font-medium"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                Entrando...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5 mr-2" />
                                                Entrar
                                            </>
                                        )}
                                    </button>
                                </form>
                            </TabPanel>
                        </TabView>

                        {message.text && (
                            <div className="mt-4">
                                <Message
                                    severity={message.severity}
                                    text={message.text}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Welcome Banner Section */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-950 flex justify-center items-center p-4 md:p-8 lg:p-0">
                <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-2xl max-w-lg w-full m-4 transform transition-all duration-300">
                    <div className="text-center space-y-4 md:space-y-6">
                        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                            Bem-vindo ao Sistema de Gestão de Unidades Escutista
                        </h1>

                        <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>

                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                            "Por um Escutismo para Todos"
                        </p>

                        <div className="py-4 md:py-6">
                            <p className="text-lg md:text-xl italic text-purple-700 font-medium">
                                "Sempre Alerta para Servir"
                            </p>
                        </div>

                        <div className="text-sm text-gray-500 font-medium border-t border-purple-100 pt-4 md:pt-6">
                            Portal Oficial da Associação de Escuteiros de Angola
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;